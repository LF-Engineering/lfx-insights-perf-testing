import { NextFunction, Request, Response, Router } from 'express';
import { ResultSet } from '@cubejs-client/core';
import { CubeClass } from '../cube/Cube';
import { CubeQuery } from '../cube/cube.query';
import { IContributorsTotalCube } from '../types/contributors.type';
import { ITypeBusFactorParams } from '../types/typeBusFactor.type';

import { CONFIG } from '../config';

class CubeRouterClass {
  public router: Router;
  private cube: CubeClass;
  constructor() {
    this.initCube();
    this.initRouter();
  }
  private initCube() {
    this.cube = new CubeClass(CONFIG.CUBE.URL, CONFIG.CUBE.AUTH);
  }
  private initRouter() {
    this.router = Router();
    this.router.post(CONFIG.API.ENDPOINTS.CONTRIBUTORS_COUNTERS, this.getContributorsCounters);
    this.router.post(CONFIG.API.ENDPOINTS.TYPE_BUS_FACTOR, this.getTypeBusFactor);
  }
  private getContributorsCounters = async (request: Request, response: Response, _next: NextFunction) => {
    try {
      const { project, granularity, dateRange } = request.body;
      const query = CubeQuery.contributorsCounters(project, granularity, dateRange);
      const responseData: ResultSet<IContributorsTotalCube> = await this.cube.cubeApi.load(query);
      return response.status(200).send(responseData);
    } catch (e) {
      return response.status(400).send(e);
    }
  };
  private getTypeBusFactor = async (request: Request, response: Response, _next: NextFunction) => {
    try {
      const {project, timeRangeName, type} = request.body as ITypeBusFactorParams;
      const query = CubeQuery.typeBusFactor(project, timeRangeName, type);
      const responseData: ResultSet<IContributorsTotalCube> = await this.cube.cubeApi.load(query);
      return response.status(200).send(responseData);
    } catch (e) {
      return response.status(400).send(e);
    }
  };
}

export const cubeRouter = new CubeRouterClass();

