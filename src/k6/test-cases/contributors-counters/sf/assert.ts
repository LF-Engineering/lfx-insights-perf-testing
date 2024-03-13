import { IContributorsTotalSf } from '../../../../types/contributors.type';
import { RefinedResponse } from 'k6/http';

export const contributorsCountersSfAssert = (res: RefinedResponse<any>): boolean => {
  if (!res.body) return false;
  const body = JSON.parse(res.body as string) as IContributorsTotalSf[];
  return !!(body[0]['CONTRIBUTORS_COUNT']);
}
