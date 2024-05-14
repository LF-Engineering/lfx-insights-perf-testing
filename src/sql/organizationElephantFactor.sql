select
  time_range_name,
  time_range_from,
  time_range_to,
  type,
  segment_id,
  repository_url,
  org_id,
  row_number,
  cnt,
  prev_cnt,
  percent,
  cumulative_percent,
  delta,
  change_from_previous,
  bus_factor,
  min_percent,
  others_count,
  others_percent,
  org_name,
  org_logo_url,
  org_created_at,
  subproject_slug,
  project_slug,
  project_group_slug,
  subproject_name,
  project_name,
  project_group_name
from
  $$schema$$platinum_insights.org_bus_factor
where
  (segment_id = :1 or '' = :1)
  and (project_slug = :2 or '' = :2)
  and repository_url = :3
  and time_range_name = :4
  and type = :5
order by $$order$$ $$asc$$
  limit :6
  offset :7
