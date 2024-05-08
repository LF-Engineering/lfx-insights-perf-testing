select
  time_range_name,
  type,
  is_bot,
  filter_bots,
  segment_id,
  repository_url,
  member_id,
  platform,
  username,
  row_number,
  contributions,
  prev_contributions,
  all_contributions,
  percent_total,
  change_from_previous,
  all_contributors,
  all_prev_contributors,
  all_prev_contributions,
  all_change_from_previous,
  delta_contributions,
  delta_all_contributions,
  delta_all_contributors,
  joined_at,
  display_name,
  logo_url,
  country,
  subproject_slug,
  project_slug,
  project_group_slug
from
  analytics.platinum_insights.contributor_leaderboard
where
  repository_url = ?
  and time_range_name = ?
  and type = ?
  and filter_bots = ?
