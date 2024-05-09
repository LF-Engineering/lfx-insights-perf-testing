import { Connection, ConnectionOptions, createConnection, createPool } from 'snowflake-sdk';
import { BasicClass } from '@core/BasicClass';
import { Options as PoolOptions, Pool } from 'generic-pool';

export class SnowFlakeClass extends BasicClass {
  public showFlakeConnection: Connection;
  public showFlakePoolConnection: Pool<Connection>;
  constructor(connectionOptions: ConnectionOptions, poolOptions: PoolOptions) {
    super();
    const obligatoryParams = Object.values(connectionOptions);
    if (this.checkEnvParams(obligatoryParams)) throw new Error('Some obligatory env params for SnowFlakeClass were not provided');
    this.initConnection(connectionOptions, poolOptions);
  }
  private initConnection(connectionOptions: ConnectionOptions, poolOptions: PoolOptions){
    this.showFlakeConnection = createConnection(connectionOptions);
    this.showFlakePoolConnection = createPool(connectionOptions, poolOptions);
  }
}

