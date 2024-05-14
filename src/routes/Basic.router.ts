import path from 'path';
import { promises as fs } from 'fs';
import { CommonService } from '@root/services/common.service';
import { SnowFlakeClass } from '@sf/sf';
import { SnowflakeError, Statement } from 'snowflake-sdk';
import { CONFIG } from '@root/config';
import { createHash } from 'node:crypto'

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

  private sha(str: string) : string {
    return createHash('sha256').update(str).digest('base64');
  }

  protected executeQuery<T extends object>(
    sqlText: string,
    binds: (string | number)[],
    complete: (err: SnowflakeError, stmt: Statement, rows: T[] | undefined) => void,
    isCacheEnabled: boolean = CONFIG.SF.CACHING.SQL_RESULT
  ) {
    // Caching will be done in ValKey
    if (!isCacheEnabled) {
      return this.sf.showFlakeConnection.execute({
        sqlText,
        binds,
        complete
      });
    }
    const key = this.sha(JSON.stringify({"q":sqlText, "b":binds}));
    if (this.queriesResultCache.has(key)) {
      const entry = this.queriesResultCache.get(key);
      const ageSeconds = (Date.now() - entry[0]) / 1000;
      if (ageSeconds < CONFIG.SF.CACHING.TTL) {
        const rows = entry[1];
        console.log('using cached entry for key ' + key + ', aged ' + ageSeconds + 's');
        return complete(null, null, rows);
      }
      console.log('executing query with key ' + key + ' age ' + ageSeconds + ' >= ' + CONFIG.SF.CACHING.TTL);
    } else {
      console.log('first time executing query with key ' + key);
    }
    var rc = this.queriesResultCache;
    this.sf.showFlakeConnection.execute({
      sqlText,
      binds,
      complete: function(err, stmt, rows) {
        console.log('exectued with bound parameters: ' + binds);
        console.log(stmt.getSqlText());
        if (err) {
          console.log('query ' + key + ' status is error - not storing in cache');
        } else {
          rc.set(key, [Date.now(), rows]);
        }
        complete(err, stmt, rows);
      }
    });
  }

}
