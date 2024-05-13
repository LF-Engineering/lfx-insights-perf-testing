import { NextFunction, Request, Response, Router } from 'express';
import { ConnectionOptions } from 'snowflake-sdk';
import { SnowFlakeClass } from '@sf/sf';
import { SfQuery } from '@sf/sf.query';
import { IContributorsTotalSf } from '@type/contributors.type';
import { ITypeBusFactorParams, ITypeBusFactorSf } from '@type/typeBusFactor.type';
import { IContributorLeaderboardParams, contributorLeaderboardOrderColumns } from '@type/contributorLeaderboard.type';
import {
  IOrganizationLeaderboardParams, organizationLeaderboardOrderColumns,
} from '@type/organizationLeaderboard.type';
import { DeveloperMode, IDeveloperMode } from '@type/developerMode.type';
import { createHash } from 'node:crypto'
import { SnowFlakeContributorsRouterClass } from '@routes/snow-flake/contributors/SnowFlakeContributors.router';
import { SnowFlakeOrganizationsRouterClass } from '@routes/snow-flake/organizations/SnowFlakeOrganizations.router';

import { CONFIG } from '@root/config';

class SnowFlakeRouterClass {
  public router: Router;
  private sf: SnowFlakeClass;
  // TODO: Alex pls see 'statementsInit' function TODO:

  private queriesMap: Map<string, string>;
  private queriesResultCache: Map<string, any[]>;
  private CacheTTL: number;
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
    this.router.post(CONFIG.API.ENDPOINTS.CONTRIBUTOR_LEADERBOARD, this.getContributorLeaderboard);
    this.router.post(CONFIG.API.ENDPOINTS.ORGANIZATION_LEADERBOARD, this.getOrganizationLeaderboard);
    this.router.get(CONFIG.API.ENDPOINTS.CACHE_STATS, this.cacheStats);
  }

  // TODO: This holds mapping of query file name (read once) to '?' parametrized query strings used by APIs
  // We do this by adding `binds` property to SQL 'execute' method
  // Each API will read such '?' parametrized queries and then execute them binding parameters provided as API params
  // We need to have similar logic in swagger - cc Alex
  // This also uses query results caching (can be replaced with REDIS or whatever else more fancy caching)
  // Idea is to calculate hash of query and its parameters and store this in memory for re-use with some TTL
  private statementsInit() {
    this.queriesMap = new Map();
    this.queriesResultCache = new Map();
    this.CacheTTL = 28800; // 8 hours
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

  // is given value set? must be non empty, non null and not undefined
  private isSet(v) : boolean {
    return !(v === undefined || v === null || v == '');
  }

  // calculate SHA-256 of string and return BASE64 encoded
  private sha(str: string) : string {
    return createHash('sha256').update(str).digest('base64');
  }

  // run query with bind arguments
  // optionally run on given developer's DBT models instead of prod ones
  // prod ones are `analytics.` prefixed (`:schema.` -> `analytics.`)
  // developer are `analytics_dev.developer_name_` prefixed (`:schema.` -> `analytics_dev.developer_name_`)
  private runQuery(query: string, binds: any, developerMode: IDeveloperMode, response: Response) {
    // Developer mode
    var dev = developerMode as string;
    var devMode = this.isSet(dev);
    var devModeAllowed = DeveloperMode.has(dev as any)
    if (devMode && devModeAllowed) {
      console.log('using developer ' + dev + ' models');
      dev = "analytics_dev." + dev + "_"
    } else {
      if (devMode && !devModeAllowed) {
        console.log('developer ' + dev + ' is not allowed, using analytics database (system wide) instead');
      }
      dev = "analytics."
    }
    query = query.split(':schema.').join(dev);
    // Caching
    const key = this.sha(JSON.stringify({"q":query, "b":binds}));
    if (!this.queriesResultCache.has(key)) {
      console.log('first time executing query with key ' + key);
    } else {
      const entry = this.queriesResultCache.get(key);
      const ageSeconds = (Date.now() - entry[0]) / 1000;
      if (ageSeconds < this.CacheTTL) {
        const rows = entry[1];
        console.log('using cached entry for key ' + key + ', aged ' + ageSeconds + 's');
        return response.status(200).send(rows);
      }
      console.log('executing query with key ' + key + ' age ' + ageSeconds + ' >= ' + this.CacheTTL);
    }
    var rc = this.queriesResultCache;
    this.sf.showFlakeConnection.execute({
      sqlText: query,
      binds: binds,
      complete: function(err, stmt, rows) {
        // here we can see actual query that was executed + bound parameters
        console.log('exectued with bound parameters: ' + binds);
        console.log(stmt.getSqlText());
        if (err) {
          console.log('query ' + key + ' status is error - not storing in cache');
        } else {
          rc.set(key, [Date.now(), rows]);
        }
        return response.status(err ? 400 : 200).send(err || rows);
      }
    });
  }

  // handle `order by` part by adding a correct `order by column-name asc|desc` phrase in place of `:order` placeholder
  private handleOrderBy(query: string, order: string, asc: boolean, allowedOrders: Set<string>, defaultOrder: string) : string {
    if (!allowedOrders.has(order)) {
      order = defaultOrder
      console.log('unknown order by column ' + order + ', changed to ' + order);
    }
    var queryOrderBy = ' order by ' + order
    if (asc) {
      queryOrderBy += " asc";
    } else {
      queryOrderBy += " desc";
    }
    return query.split(':order').join(queryOrderBy);
  }

  private getContributorLeaderboard = async (request: Request, response: Response, _next: NextFunction) => {
    const {segmentId, project, repository, timeRangeName, activityType, filterBots, orderBy, asc, limit, offset, developerMode} = request.body as IContributorLeaderboardParams;
    var query = SfQuery.getQuery(this.queriesMap, './src/sql/contributorLeaderboard.sql');
    query = this.handleOrderBy(query, orderBy, asc, contributorLeaderboardOrderColumns, 'row_number');
    // only numbered binds parameters are supported (no named parameters): so we bind to :1, :2, ..., :N the same as in .sql file
    var binds:(string | number)[] = [
      (this.isSet(segmentId)) ? segmentId : '',               // :1
      (this.isSet(project)) ? project : '',                   // :2
      (repository == '') ? 'all-repos-combined' : repository, // :3
      timeRangeName,                                          // :4
      activityType,                                           // :5
      filterBots,                                             // :6
      (limit <= 0) ? 1000 : limit,                            // :7
      (offset < 0) ? 0 : offset,                              // :8
    ];
    this.runQuery(query, binds, developerMode, response);
  };

  private getOrganizationLeaderboard = async (request: Request, response: Response, _next: NextFunction) => {
    const {segmentId, project, repository, timeRangeName, activityType, orderBy, asc, limit, offset, developerMode} = request.body as IOrganizationLeaderboardParams;
    var query = SfQuery.getQuery(this.queriesMap, './src/sql/organizationLeaderboard.sql');
    query = this.handleOrderBy(query, orderBy, asc, organizationLeaderboardOrderColumns, 'row_number_by_contributions');
    // only numbered binds parameters are supported (no named parameters): so we bind to :1, :2, ..., :N the same as in .sql file
    var binds:(string | number)[] = [
      (this.isSet(segmentId)) ? segmentId : '',               // :1
      (this.isSet(project)) ? project : '',                   // :2
      (repository == '') ? 'all-repos-combined' : repository, // :3
      timeRangeName,                                          // :4
      activityType,                                           // :5
      (limit <= 0) ? 1000 : limit,                            // :6
      (offset < 0) ? 0 : offset,                              // :7
    ];
    this.runQuery(query, binds, developerMode, response);
  };

  private cacheStats = async (request: Request, response: Response, _next: NextFunction) => {
    var str : string = 'cache TTL: ' + this.CacheTTL + 's';
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
      const remain = this.CacheTTL - ageSeconds;
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

