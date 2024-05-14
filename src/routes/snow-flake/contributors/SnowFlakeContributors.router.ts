import { NextFunction, Request, Response, Router } from 'express';
import { SnowFlakeClass } from '@sf/sf';
import { BasicRouter } from '@routes/Basic.router';
import {
  contributorLeaderboardOrderColumns,
  IContributorLeaderboard,
  IContributorLeaderboardParams
} from '@type/contributorLeaderboard.type';
import {
  contributorBusFactorOrderColumns,
  IContributorBusFactor,
  IContributorBusFactorParams
} from '@type/contributorBusFactor.type';
import { CommonService } from '@root/services/common.service';
import { AscEnum } from '@type/common.type';
import { DeveloperMode } from '@type/developerMode.type';
import { CONFIG } from '@root/config';

export class SnowFlakeContributorsRouterClass extends BasicRouter {
  public router: Router;

  constructor(sf: SnowFlakeClass, queriesMap: Map<string, string>, queriesResultCache: Map<string, any[]>) {
    super(sf, queriesMap, queriesResultCache);
    this.routerInit();
  }

  private routerInit() {
    const {LEADERBOARD, BUS_FACTOR} = CONFIG.API.ROUTES.CONTRIBUTORS.ENDPOINTS
    this.router = Router();
    this.router.post(LEADERBOARD, this.getContributorLeaderboard);
    this.router.post(BUS_FACTOR, this.getContributorBusFactor);
  }

  private getContributorLeaderboard = async (
    request: Request<{}, {}, IContributorLeaderboardParams>,
    response: Response,
    _next: NextFunction
  ) => {
    try {
      const {
        segmentId,
        project,
        repository,
        timeRangeName,
        activityType,
        filterBots,
        orderBy,
        asc,
        limit,
        offset,
        developerMode
      } = request.body;
      const sqlText = await this.getQueryAsync(
        'contributorLeaderboard.sql',
        {
          order: contributorLeaderboardOrderColumns.has(orderBy) ? orderBy : 'row_number',
          asc: asc ? AscEnum.ASC : AscEnum.DESC,
          schema: DeveloperMode.has(developerMode) ? `analytics_dev.${developerMode}_` : 'analytics.'
        }
      );
      const binds: (string | number)[] = [
        (CommonService.isSet(segmentId)) ? segmentId : '',      // :1
        (CommonService.isSet(project)) ? project : '',          // :2
        (repository == '') ? 'all-repos-combined' : repository, // :3
        timeRangeName,                                          // :4
        activityType,                                           // :5
        filterBots,                                             // :6
        (limit <= 0) ? 1000 : limit,                            // :7
        (offset < 0) ? 0 : offset,                              // :8
      ];
      this.executeQuery<IContributorLeaderboard>(sqlText, binds, (err, _stmt, rows) => {
        return response.status(err ? 400 : 200).send(err || rows);
      });
    } catch (e) {
      return response.status(400).send(e);
    }
  };

  private getContributorBusFactor = async (
    request: Request<{}, {}, IContributorBusFactorParams>,
    response: Response,
    _next: NextFunction
  ) => {
    try {
      const {
        segmentId,
        project,
        repository,
        timeRangeName,
        activityType,
        orderBy,
        asc,
        limit,
        offset,
        developerMode
      } = request.body;
      const sqlText = await this.getQueryAsync(
        'contributorBusFactor.sql',
        {
          order: contributorBusFactorOrderColumns.has(orderBy) ? orderBy : 'row_number',
          asc: asc ? AscEnum.ASC : AscEnum.DESC,
          schema: DeveloperMode.has(developerMode) ? `analytics_dev.${developerMode}_` : 'analytics.'
        }
      );
      const binds: (string | number)[] = [
        (CommonService.isSet(segmentId)) ? segmentId : '',      // :1
        (CommonService.isSet(project)) ? project : '',          // :2
        (repository == '') ? 'all-repos-combined' : repository, // :3
        timeRangeName,                                          // :4
        activityType,                                           // :5
        (limit <= 0) ? 1000 : limit,                            // :6
        (offset < 0) ? 0 : offset,                              // :7
      ];
      this.executeQuery<IContributorBusFactor>(sqlText, binds, (err, _stmt, rows) => {
        return response.status(err ? 400 : 200).send(err || rows);
      });
    } catch (e) {
      return response.status(400).send(e);
    }
  };

}
