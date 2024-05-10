import { ITimeRangeName } from '@type/timeRanges.type';
import { IActivityType } from '@type/activityTypes.type';
var fs = require('fs');

export class SfQuery {

  // Returned query has '?' parameters that must be bind to actual values
  static getQuery(queriesMap: Map<string, string>, queryFileName: string): string {
    if (!queriesMap.has(queryFileName)) {
      console.log('reading (only once) ' + queryFileName);
      queriesMap.set(queryFileName, fs.readFileSync(queryFileName).toString());
    }
    return queriesMap.get(queryFileName);
  }

  static contributorsCounters(
    project: string,
    granularity: string,
    dateRange: [string, string],
    repositoryUrl?: string,
    isBot?: boolean
  ): string {
    return `
        select 
          date_trunc('${granularity}', ymd) as YM, 
          count (distinct contributors) as contributors_count
        from 
          analytics.platinum_insights.contributor_counts
        where 
          repository_url = '${repositoryUrl || `all-repos-combined`}' 
          ${typeof isBot !== 'undefined' ? `and is_bot = ${isBot}` : ''} 
          and slug = '${project}' 
          and ymd between '${dateRange[0]}' and '${dateRange[1]}' 
        group by 
          all 
        order by 
          1 asc
      `
  }

  static typeBusFactor(project: string, timeRangeName: ITimeRangeName, type: IActivityType): string {
    return `
        select
          row_number,
          username,
          display_name,
          logo_url,
          cnt,
          percent,
          cumulative_percent
        from
          analytics.platinum_insights.type_bus_factor
        where
          cumulative_percent <= 50.0
          and subproject_slug = '${project}'
          and repository_url = 'all-repos-combined'
          and time_range_name = '${timeRangeName}'
          and type = '${type}'
        order by
          1 asc
        ;
      `
  }
}
