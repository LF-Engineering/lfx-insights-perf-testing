import { NextFunction, Request, Response, Router } from 'express';
import { SnowFlakeClass } from '../sf/sf';
import { SfQuery } from '../sf/sf.query';
import { IContributorsTotalSf } from '../types/contributors.type';

import { CONFIG } from '../config';

class SnowFlakeRouterClass {
  public router: Router;
  private sf: SnowFlakeClass;
  constructor() {
    this.sfInit();
    this.routerInit();
  }
  private sfInit() {
    this.sf = new SnowFlakeClass(CONFIG.SF.CONNECT, CONFIG.SF.POOL_OPTIONS);
    this.sf.showFlakeConnection.connect((err, con) => {
      if (err) throw new Error(`Cant connect to SF, error: ${err.toString()}`);
    });
  }
  private routerInit() {
    this.router = Router();
    this.router.post(CONFIG.API.CONTRIBUTORS_COUNTERS, this.getContributorsCounters);
  }
  private getContributorsCounters = async (request: Request, response: Response, _next: NextFunction) => {
    const {project, granularity, dateRange} = request.body;
    const query = SfQuery.contributorsCounters(project, granularity, dateRange);
    this.sf.showFlakeConnection.execute({
      sqlText: query,
      complete: function(err, stmt, rows: IContributorsTotalSf[]) {
        return response.status(err ? 400 : 200).send(err || rows);
      }
    });
  };
}

export const sfRouter = new SnowFlakeRouterClass();

