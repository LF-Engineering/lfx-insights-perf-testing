import path from 'path';
import { promises as fs } from 'fs';
import { CommonService } from '@root/services/common.service';
import { SnowFlakeClass } from '@sf/sf';
import { SnowflakeError, Statement } from 'snowflake-sdk';
import { CONFIG } from '@root/config';

export class BasicRouter {
  readonly sf: SnowFlakeClass;
  readonly queriesMap: Map<string, string>;
  readonly queriesResultCache: Map<string, any[]>

  constructor(sf: SnowFlakeClass, queriesMap: Map<string, string>, queriesResultCache: Map<string, any[]>) {
    this.sf = sf;
    this.queriesMap = queriesMap;
    this.queriesResultCache = queriesResultCache;
  }

  protected getSqlAsync(sqlName: string): Promise<string> {
    console.log(`reading (only once) ${sqlName}`);
    return fs.readFile(path.join(__dirname, `../sql/${sqlName}`), 'utf8');
  }

  protected async getQueryAsync(
    queryFileName: string,
    vars?: Record<string, string | number>,
    isCacheEnabled: boolean = CONFIG.SF.CACHING.SQL_QUERY
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!isCacheEnabled) {
          const sqlData = await this.getSqlAsync(queryFileName);
          return resolve(CommonService.replaceVariablesInString(sqlData, vars));
        }
        if (!this.queriesMap.has(queryFileName)) {
          const sqlData = await this.getSqlAsync(queryFileName);
          this.queriesMap.set(queryFileName, sqlData);
        }
        const sqlData = this.queriesMap.get(queryFileName);
        resolve(CommonService.replaceVariablesInString(sqlData, vars));
      } catch (e) {
        reject(e);
      }
    });
  }

  protected executeQuery<T extends object>(
    sqlText: string,
    binds: (string | number)[],
    complete: (err: SnowflakeError, stmt: Statement, rows: T[] | undefined) => void,
    isCacheEnabled: boolean = CONFIG.SF.CACHING.SQL_RESULT
  ) {
    // Caching will be done in ValKey
    this.sf.showFlakeConnection.execute({
      sqlText,
      binds,
      complete
    });
  }

}
