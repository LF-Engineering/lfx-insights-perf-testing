import cube, { CubejsApi, Query, ResultSet } from '@cubejs-client/core';
import axios, { AxiosResponse } from 'axios';
import { BasicClass } from '@core/BasicClass';

export class CubeClass extends BasicClass {
  private url: string;
  private auth: string;
  public cubeApi: CubejsApi;
  constructor(url: string | undefined, auth: string | undefined) {
    super();
    const obligatoryParams = [url, auth];
    if (this.checkEnvParams(obligatoryParams)) throw new Error('Some obligatory env params for CubeClass were not provided');
    this.initApi(url, auth);
    this.assignConfParams(url, auth);
  }
  private initApi(url: string, auth: string) {
    this.cubeApi = cube(
      auth,
      { apiUrl: url }
    );
  }
  private assignConfParams(url: string, auth: string) {
    this.url = url;
    this.auth = auth;
  }
  public postData<T>(query: Query): Promise<AxiosResponse<ResultSet<T>>> {
    return axios.post(
      this.url,
      { query },
      {
        headers: {
          'Authorization': this.auth
        }
      }
    );
  }
}
