import { NextFunction, Request, Response, Router } from 'express';
import { ConnectionOptions } from 'snowflake-sdk';
import { SnowFlakeClass } from '../sf/sf';
import { SfQuery } from '../sf/sf.query';
import { IContributorsTotalSf } from '../types/contributors.type';
import { ITypeBusFactorParams, ITypeBusFactorSf } from '../types/typeBusFactor.type';
import { IContributorLeaderboardParams, IContributorLeaderboard, ContributorLeaderboardOrderColumns } from '../types/contributorLeaderboard.type';
import { DeveloperMode } from '../types/developerMode.type';

import { CONFIG } from '../config';

class SnowFlakeRouterClass {
  public router: Router;
  private sf: SnowFlakeClass;
  // TODO: Alex pls see 'statementsInit' function TODO:
  private queriesMap: Map<string, string>;
  constructor() {
    this.sfInit();
    this.routerInit();
    this.statementsInit();
  }
  private sfInit() {
    this.sf = new SnowFlakeClass(CONFIG.SF.CONNECT as ConnectionOptions, CONFIG.SF.POOL_OPTIONS);
    this.sf.showFlakeConnection.connect((err, _con) => {
      if (err) throw new Error(`Cant connect to SF, error: ${err.toString()}`);
    });
  }
  private routerInit() {
    this.router = Router();
    this.router.post(CONFIG.API.ENDPOINTS.CONTRIBUTORS_COUNTERS, this.getContributorsCountersDirect);
    this.router.post(CONFIG.API.ENDPOINTS.CONTRIBUTORS_COUNTERS_POOL, this.getContributorsCountersPool);
    this.router.post(CONFIG.API.ENDPOINTS.TYPE_BUS_FACTOR, this.getTypeBusFactorDirect);
    this.router.post(CONFIG.API.ENDPOINTS.TYPE_BUS_FACTOR_POOL, this.getTypeBusFactorPool);
    this.router.post(CONFIG.API.ENDPOINTS.CONTRIBUTOR_LEADERBOARD, this.getContributorLeaderboard);
  }
  // TODO: This holds mapping of query file name (read once) to '?' parametrized query strings used by APIs
  // We do this by adding `binds` property to SQL 'execute' method
  // Each API will read such '?' parametrized queries and then execute them binding parameters provided as API params
  // We need to have similar logic in swagger - cc Alex
  private statementsInit() {
    this.queriesMap = new Map();
  }
  private getContributorsCountersPool = async (request: Request, response: Response, _next: NextFunction) => {
    const {project, granularity, dateRange} = request.body;
    const query = SfQuery.getQuery(this.queriesMap, './src/sql/contributorsCounters.sql');
    await this.sf.showFlakePoolConnection.use(async (clientConnection) => {
      const statement = await clientConnection.execute({
        sqlText: query,
        binds: [granularity, 'all-repos-combined', false, project, dateRange[0], dateRange[1]],
        complete: (err, stmt, _rows) => {
          if (err) return response.status(400).send(err);
          const stream = stmt.streamRows();
          const res: IContributorsTotalSf[] = [];
          stream.on('data', (row: IContributorsTotalSf) => {
            res.push(row);
          });
          stream.on('end', () => {
            return response.status(200).send(res);
          });
        }
      })
    });
  };

  private getContributorsCountersDirect = async (request: Request, response: Response, _next: NextFunction) => {
    const {project, granularity, dateRange} = request.body;
    const query = SfQuery.getQuery(this.queriesMap, './src/sql/contributorsCounters.sql');
    this.sf.showFlakeConnection.execute({
      sqlText: query,
      binds: [granularity, 'all-repos-combined', false, project, dateRange[0], dateRange[1]],
      complete: function(err, _stmt, rows: IContributorsTotalSf[] | undefined) {
        return response.status(err ? 400 : 200).send(err || rows);
      }
    });
  };

  private getTypeBusFactorPool = async (request: Request, response: Response, _next: NextFunction) => {
    const {project, timeRangeName, type} = request.body as ITypeBusFactorParams;
    const query = SfQuery.typeBusFactor(project, timeRangeName, type);
    await this.sf.showFlakePoolConnection.use(async (clientConnection) => {
      const statement = await clientConnection.execute({
        sqlText: query,
        complete: (err, stmt, _rows) => {
          if (err) return response.status(400).send(err);
          const stream = stmt.streamRows();
          const res: ITypeBusFactorSf[] = [];
          stream.on('data', (row: ITypeBusFactorSf) => {
            res.push(row);
          });
          stream.on('end', () => {
            return response.status(200).send(res);
          });
        }
      })
    });
  };

  private getTypeBusFactorDirect = async (request: Request, response: Response, _next: NextFunction) => {
    try {
      const {project, timeRangeName, type} = request.body as ITypeBusFactorParams;
      const query = SfQuery.typeBusFactor(project, timeRangeName, type);
      this.sf.showFlakeConnection.execute({
        sqlText: query,
        complete: function(err, _stmt, rows: ITypeBusFactorSf[] | undefined) {
          return response.status(err ? 400 : 200).send(err || rows);
        }
      });
    } catch (e) {
      return response.status(400).send(e);
    }
  };

  private isSet(v) : boolean {
    return !(v === undefined || v === null || v == '');
  }

  private getContributorLeaderboard = async (request: Request, response: Response, _next: NextFunction) => {
    const {segmentId, project, repository, timeRangeName, activityType, filterBots, orderBy, asc, limit, offset, developerMode} = request.body as IContributorLeaderboardParams;
    var repo = repository;
    if (repo == "") {
      repo = "all-repos-combined";
    }
    var order = orderBy;
    if (!ContributorLeaderboardOrderColumns.has(order)) {
      order = "row_number";
      console.log('unknown order by column ' + orderBy + ', changed to ' + order);
    }
    var lim = limit;
    if (lim <= 0) {
      lim = 1000;
    }
    var off = offset;
    if (off < 0) {
      off = 0;
    }
    var binds = [repo, timeRangeName, activityType, filterBots];
    var query = SfQuery.getQuery(this.queriesMap, './src/sql/contributorLeaderboard.sql');
    if (this.isSet(segmentId)) {
      query += ' and segment_id = ?'
      binds.push(segmentId);
    }
    if (this.isSet(project)) {
      query += ' and project_slug = ?'
      binds.push(project);
    }
    query += ' order by ' + order
    if (asc) {
      query += " asc";
    } else {
      query += " desc";
    }
    query += " limit ? offset ?";
    binds.push(lim)
    binds.push(off);
    var dev = developerMode as string;
    var devMode = this.isSet(dev);
    var devModeAllowed = DeveloperMode.has(dev)
    if (devMode && devModeAllowed) {
      console.log('using developer ' + dev + ' models');
      dev = "analytics_dev." + dev + "_"
    } else {
      if (devMode && !devModeAllowed) {
        console.log('developer ' + dev + ' is not allowed, using analytics database (system wide) instead');
      }
      dev = "analytics."
    }
    query = query.split('{{db-schema}}').join(dev);
    this.sf.showFlakeConnection.execute({
      sqlText: query,
      binds: binds,
      complete: function(err, _stmt, rows: IContributorLeaderboard[] | undefined) {
        return response.status(err ? 400 : 200).send(err || rows);
      }
    });
  };
}

export const sfRouter = new SnowFlakeRouterClass();

