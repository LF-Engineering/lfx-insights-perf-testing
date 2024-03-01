import { SerializedResult } from '@cubejs-client/core';
import { IContributorsTotalCube, IContributorsTotalCubeNew } from '../../../types/contributors.type';
import { RefinedResponse } from 'k6/http';

export const contributorsCountersAssert = (res: RefinedResponse<any>): boolean => {
  if (!res.body) return false;
  const body = JSON.parse(res.body as string) as SerializedResult<IContributorsTotalCube>;
  return !!(body.loadResponse.results[0].data[0]['SnowContributions.count_contributors']);
}

export const contributorsCountersNewAssert = (res: RefinedResponse<any>): boolean => {
  if (!res.body) return false;
  const body = JSON.parse(res.body as string) as SerializedResult<IContributorsTotalCubeNew>;
  return !!(body.loadResponse.results[0].data[0]['SnowActivities.metric_contributors']);
}
