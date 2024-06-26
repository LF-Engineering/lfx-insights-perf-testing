select
    time_range_name,
    type,
    segment_id,
    repository_url,
    organization_id,
    org_name,
    row_number_by_contributors,
    row_number_by_contributions,
    contributions,
    prev_contributions,
    all_contributions,
    percent_total,
    change_from_previous,
    all_organizations,
    all_prev_organizations,
    all_prev_contributions,
    all_change_from_previous,
    contributors,
    prev_contributors,
    all_contributors,
    contributors_percent_total,
    contributors_change_from_previous,
    all_prev_contributors,
    contributors_all_change_from_previous,
    delta_contributions,
    delta_contributors,
    delta_all_contributions,
    delta_all_contributors,
    delta_all_organizations,
    org_created_at,
    org_logo_url,
    subproject_slug,
    project_slug,
    project_group_slug
from
  $$schema$$platinum_insights.organization_leaderboard
where
  (segment_id = :1 or '' = :1)
  and (project_slug = :2 or '' = :2)
  and repository_url = :3
  and time_range_name = :4
  and type = :5
order by $$order$$ $$asc$$
  limit :6
  offset :7
