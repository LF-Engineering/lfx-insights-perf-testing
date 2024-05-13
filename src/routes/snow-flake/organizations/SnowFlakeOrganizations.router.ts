import { NextFunction, Request, Response, Router } from 'express';
import { SnowFlakeClass } from '@sf/sf';
import { BasicRouter } from '@routes/Basic.router';
import { CommonService } from '@root/services/common.service';
import { AscEnum } from '@type/common.type';
import { DeveloperMode } from '@type/developerMode.type';
import {
  IOrganizationLeaderboard, IOrganizationLeaderboardParams, organizationLeaderboardOrderColumns
} from '@type/organizationLeaderboard.type';

import { CONFIG } from '@root/config';

export class SnowFlakeOrganizationsRouterClass extends BasicRouter {
  public router: Router;

  constructor(sf: SnowFlakeClass, queriesMap: Map<string, string>, queriesResultCache: Map<string, any[]>) {
    super(sf, queriesMap, queriesResultCache);
    this.routerInit();
  }

  private routerInit() {
    const { LEADERBOARD } = CONFIG.API.ROUTES.ORGANIZATIONS.ENDPOINTS
    this.router = Router();
    this.router.post(LEADERBOARD, this.getOrganizationsLeaderboard);
  }

  private getOrganizationsLeaderboard = async (
    request: Request<{}, {}, IOrganizationLeaderboardParams>,
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
        'organizationLeaderboard_.sql',
        {
          order: organizationLeaderboardOrderColumns.has(orderBy) ? orderBy : 'row_number_by_contributions',
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
      this.executeQuery<IOrganizationLeaderboard>(sqlText, binds, (err, _stmt, rows) => {
        return response.status(err ? 400 : 200).send(err || rows);
      });
    } catch (e) {
      return response.status(400).send(e);
    }
  };

}
