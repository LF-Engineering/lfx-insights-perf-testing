select
  date_trunc(?, ymd) as YM,
  count (distinct contributors) as contributors_count
from
  {{db-schema}}platinum_insights.contributor_counts
where
  repository_url = ?
  and is_bot = ? 
  and slug = ?
  and ymd between ? and ?
group by
  all
order by
  1 asc
