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

  static contributorsCounters(project: string, granularity: string, dateRange: [string, string]): string {
    return `
        select 
          date_trunc('${granularity}', ymd) as YM, 
          hll_estimate(hll_combine(contributors)) as contributors_count
          from analytics.platinum_insights.contributor_counts 
          where repository_url = 'all-repos-combined' 
          and is_bot = false 
          and slug = '${project}' 
          and ymd between '${dateRange[0]}' and '${dateRange[1]}' 
          group by ALL order by 1
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
