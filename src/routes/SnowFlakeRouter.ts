import { NextFunction, Request, Response, Router } from 'express';
import { ConnectionOptions } from 'snowflake-sdk';
import { SnowFlakeClass } from '@sf/sf';
import { SfQuery } from '@sf/sf.query';
import { IContributorsTotalSf } from '@type/contributors.type';
import { ITypeBusFactorParams, ITypeBusFactorSf } from '@type/typeBusFactor.type';
import { SnowFlakeContributorsRouterClass } from '@routes/snow-flake/contributors/SnowFlakeContributors.router';
import { SnowFlakeOrganizationsRouterClass } from '@routes/snow-flake/organizations/SnowFlakeOrganizations.router';

import { CONFIG } from '@root/config';

class SnowFlakeRouterClass {
  public router: Router;
  private sf: SnowFlakeClass;

  private queriesMap: Map<string, string>;
  private queriesResultCache: Map<string, any[]>;
  constructor() {
    this.sfInit();
    this.statementsInit();
    this.routerInit();
  }
  private sfInit() {
    this.sf = new SnowFlakeClass(CONFIG.SF.CONNECT as ConnectionOptions, CONFIG.SF.POOL_OPTIONS);
    this.sf.showFlakeConnection.connect((err, _con) => {
      if (err) throw new Error(`Cant connect to SF, error: ${err.toString()}`);
    });
  }
  private routerInit() {
    this.router = Router();

    const SnowFlakeContributorsRouter = new SnowFlakeContributorsRouterClass(this.sf, this.queriesMap, this.queriesResultCache);
    const SnowFlakeOrganizationsRouter = new SnowFlakeOrganizationsRouterClass(this.sf, this.queriesMap, this.queriesResultCache);
    this.router.use(CONFIG.API.ROUTES.CONTRIBUTORS.BASE, SnowFlakeContributorsRouter.router);
    this.router.use(CONFIG.API.ROUTES.ORGANIZATIONS.BASE, SnowFlakeOrganizationsRouter.router);

    this.router.post(CONFIG.API.ENDPOINTS.CONTRIBUTORS_COUNTERS, this.getContributorsCountersDirect);
    this.router.post(CONFIG.API.ENDPOINTS.CONTRIBUTORS_COUNTERS_POOL, this.getContributorsCountersPool);
    this.router.post(CONFIG.API.ENDPOINTS.TYPE_BUS_FACTOR, this.getTypeBusFactorDirect);
    this.router.post(CONFIG.API.ENDPOINTS.TYPE_BUS_FACTOR_POOL, this.getTypeBusFactorPool);
    this.router.get(CONFIG.API.ENDPOINTS.CACHE_STATS, this.cacheStats);
  }

  private statementsInit() {
    this.queriesMap = new Map();
    this.queriesResultCache = new Map();
  }

  private getContributorsCountersPool = async (request: Request, response: Response, _next: NextFunction) => {
    const {project, granularity, dateRange} = request.body;
    const query = SfQuery.getQuery(this.queriesMap, './src/sql/contributorsCounters.sql');
    await this.sf.showFlakePoolConnection.use(async (clientConnection) => {
      const statement = clientConnection.execute({
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

  private cacheStats = async (request: Request, response: Response, _next: NextFunction) => {
    var str : string = 'cache TTL: ' + CONFIG.SF.CACHING.TTL + 's';
    str += ', mapped SQL files: ' + this.queriesMap.size + "\n";
    var i = 0;
    for (let data of this.queriesMap) {
      i++;
      str += i + ") '" + data[0] + "' length= " + data[1].length + ":\n";
      str += data[1] + "\n";
    }
    i = 0;
    str += 'cached SQL queries: ' + this.queriesResultCache.size + "\n";
    for (let data of this.queriesResultCache) {
      i++;
      str += i + ") query sha256 hash as base64 '" + data[0] + "':";
      const entry = data[1];
      const ageSeconds = (Date.now() - entry[0]) / 1000;
      const remain = CONFIG.SF.CACHING.TTL - ageSeconds;
      str += ' age ' + ageSeconds + 's'
      if (remain > 0) {
        str += ', expires in ' + remain + "s:\n";
      } else {
        str += ', expired ' + -remain + "s:\n";
      }
      str += JSON.stringify(entry[1]) + "\n";
    }
    console.log(str);
    response.status(200).send({"status": "ok", "info": str});
  }
}

export const sfRouter = new SnowFlakeRouterClass();

