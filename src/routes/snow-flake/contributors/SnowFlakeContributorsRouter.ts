import { NextFunction, Request, Response, Router } from 'express';
import { SnowFlakeClass } from '@sf/sf';
import { IContributorsTotalSf } from '@type/contributors.type';
import { BasicRouter } from '@routes/BasicRouter';

import { CONFIG } from '@root/config';

export class SnowFlakeContributorsRouterClass extends BasicRouter {
  readonly sf: SnowFlakeClass;
  public router: Router;

  constructor(sf: SnowFlakeClass) {
    super();
    this.sf = sf;
    this.routerInit();
  }

  private routerInit() {
    const {COUNTERS, COUNTERS_POOL, LEADERBOARD} = CONFIG.API.ROUTES.CONTRIBUTORS.ENDPOINTS
    this.router = Router();
    this.router.post(COUNTERS, this.getContributorsCountersDirect);
    this.router.post(COUNTERS_POOL, this.getContributorsCountersPool);
  }

  private getContributorsCountersPool = async (request: Request, response: Response, _next: NextFunction) => {
    const {project, granularity, dateRange} = request.body;
    const query = this.getSqlSync('contributorsCounters');
    await this.sf.showFlakePoolConnection.use(async (clientConnection) => {
      clientConnection.execute({
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
    const query = this.getSqlSync('contributorsCounters');
    this.sf.showFlakeConnection.execute({
      sqlText: query,
      binds: [granularity, 'all-repos-combined', false, project, dateRange[0], dateRange[1]],
      complete: function(err, _stmt, rows: IContributorsTotalSf[] | undefined) {
        return response.status(err ? 400 : 200).send(err || rows);
      }
    });
  };

}
