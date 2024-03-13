import { NextFunction, Request, Response, Router } from 'express';
import { ConnectionOptions } from 'snowflake-sdk';
import { SnowFlakeClass } from '../sf/sf';
import { SfQuery } from '../sf/sf.query';
import { IContributorsTotalSf } from '../types/contributors.type';
import { ITypeBusFactorParams, ITypeBusFactorSf } from '../types/typeBusFactor.type';

import { CONFIG } from '../config';

class SnowFlakeRouterClass {
  public router: Router;
  private sf: SnowFlakeClass;
  constructor() {
    this.sfInit();
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
    this.router.post(CONFIG.API.ENDPOINTS.CONTRIBUTORS_COUNTERS, this.getContributorsCountersDirect);
    this.router.post(CONFIG.API.ENDPOINTS.CONTRIBUTORS_COUNTERS_POOL, this.getContributorsCountersPool);
    this.router.post(CONFIG.API.ENDPOINTS.TYPE_BUS_FACTOR, this.getTypeBusFactorDirect);
    this.router.post(CONFIG.API.ENDPOINTS.TYPE_BUS_FACTOR_POOL, this.getTypeBusFactorPool);
  }
  private getContributorsCountersPool = async (request: Request, response: Response, _next: NextFunction) => {
    const {project, granularity, dateRange} = request.body;
    const query = SfQuery.contributorsCounters(project, granularity, dateRange);
    await this.sf.showFlakePoolConnection.use(async (clientConnection) => {
      const statement = await clientConnection.execute({
        sqlText: query,
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
    const query = SfQuery.contributorsCounters(project, granularity, dateRange);
    this.sf.showFlakeConnection.execute({
      sqlText: query,
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
}

export const sfRouter = new SnowFlakeRouterClass();

