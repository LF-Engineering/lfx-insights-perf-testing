import { RefinedResponse } from 'k6/http';
import { ITypeBusFactorSf } from '../../../../types/typeBusFactor.type';

export const typeBusFactorSfAssert = (res: RefinedResponse<any>): boolean => {
  if (!res.body) return false;
  const body = JSON.parse(res.body as string) as ITypeBusFactorSf[];
  return !!(body[0]['ROW_NUMBER']);
}
