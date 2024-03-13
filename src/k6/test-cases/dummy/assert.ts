import { RefinedResponse } from 'k6/http';

export const crocodilesAssert = (res: RefinedResponse<any>): boolean => {
  if (!res.body) return false;
  const body = JSON.parse(res.body as string) as any;
  return !!(body[0].name);
}

export const todosAssert = (res: RefinedResponse<any>): boolean => {
  if (!res.body) return false;
  const body = JSON.parse(res.body as string) as any;
  return !!(body[0].id);
}
