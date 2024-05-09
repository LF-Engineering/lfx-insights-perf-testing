import { ITimeRangeName } from '@type/timeRanges.type';
import { IActivityType } from '@type/activityTypes.type';
import { IDeveloperMode } from '@type/developerMode.type';

export interface IContributorLeaderboard {
  TIME_RANGE_NAME: string;
  TYPE: string;
  IS_BOT: boolean;
  FILTER_BOTS: boolean;
  SEGMENT_ID: string;
  REPOSITORY_URL: string;
  MEMBER_ID: string
  PLATFORM: string;
  USERNAME: string;
  ROW_NUMBER: number;
  CONTRIBUTIONS: number;
  PREV_CONTRIBUTIONS: number;
  ALL_CONTRIBUTIONS: number;
  PERCENT_TOTAL: number;
  CHANGE_FROM_PREVIOUS: number;
  ALL_CONTRIBUTORS: number;
  ALL_PREV_CONTRIBUTORS: number;
  ALL_PREV_CONTRIBUTIONS: number;
  ALL_CHANGE_FROM_PREVIOUS: number;
  DELTA_CONTRIBUTIONS: number;
  DELTA_ALL_CONTRIBUTIONS: number;
  DELTA_ALL_CONTRIBUTORS: number;
  JOINED_AT: Date;
  DISPLAY_NAME: string;
  LOGO_URL: string;
  COUNTRY: string;
  SUBPROJECT_SLUG: string;
  PROJECT_SLUG: string;
  PROJECT_GROUP_SLUG: string;
}

export interface IContributorLeaderboardParams {
  timeRangeName: ITimeRangeName;
  activityType: IActivityType;
  segmentId: string;
  project: string;
  repository: string;
  filterBots: number;
  orderBy: IContributorLeaderboardOrderColumns;
  asc: boolean;
  limit: number;
  offset: number;
  developerMode: IDeveloperMode;
}

export type IContributorLeaderboardOrderColumns = 'is_bot' | 'segment_id' | 'repository_url' | 'member_id' | 'platform' | 'username' | 'row_number' | 'contributions' | 'prev_contributions' | 'percent_total' | 'change_from_previous' | 'delta_contributions' | 'joined_at' | 'display_name' | 'logo_url' | 'country' | 'subproject_slug' | 'project_slug' | 'project_group_slug';
// TODO: Alex? TS seem not to enforce that a given string can only be from a fixed set of values (as defined in 'IContributorLeaderboardOrderColumns') so I need to declare an additional 'Set' that holds possible values and check this in API call to avoid SQL injection
// I must do this because SQL query cannot be '?' by column name (like needed in "order by column asc/desc" - we can only bind to parameter values, not names - so this must be handled by enforcing value from a fixed set of allowed values, it is easier with ASC/DESC ordering as there are just two possible values there.
export var ContributorLeaderboardOrderColumns = new Set<string>(['is_bot', 'segment_id', 'repository_url', 'member_id', 'platform', 'username', 'row_number', 'contributions', 'prev_contributions', 'percent_total', 'change_from_previous', 'delta_contributions', 'joined_at', 'display_name', 'logo_url', 'country', 'subproject_slug', 'project_slug', 'project_group_slug']);
