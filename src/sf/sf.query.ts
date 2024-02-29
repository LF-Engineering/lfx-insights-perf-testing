export class SfQuery {
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
}
