import { ITimeRangeName } from '../types/timeRanges.type';
import { IActivityType } from '../types/activityTypes.type';
import { IDeveloperMode } from '../types/developerMode.type';

export interface IOrganizationLeaderboard {
  TIME_RANGE_NAME: string;
  TYPE: string;
  SEGMENT_ID: string;
  REPOSITORY_URL: string;
  ORGANIZATION_ID: string;
  ORG_NAME: string;
  ROW_NUMBER_BY_CONTRIBUTORS: number;
  ROW_NUMBER_BY_CONTRIBUTIONS: number;
  CONTRIBUTIONS: number;
  PREV_CONTRIBUTIONS: number;
  ALL_CONTRIBUTIONS: number;
  PERCENT_TOTAL: number;
  CHANGE_FROM_PREVIOUS: number;
  ALL_ORGANIZATIONS: number;
  ALL_PREV_ORGANIZATIONS: number;
  ALL_PREV_CONTRIBUTIONS: number;
  ALL_CHANGE_FROM_PREVIOUS: number;
  CONTRIBUTORS: number;
  PREV_CONTRIBUTORS: number;
  ALL_CONTRIBUTORS: number;
  CONTRIBUTORS_PERCENT_TOTAL: number;
  CONTRIBUTORS_CHANGE_FROM_PREVIOUS: number;
  ALL_PREV_CONTRIBUTORS: number;
  CONTRIBUTORS_ALL_CHANGE_FROM_PREVIOUS: number;
  DELTA_CONTRIBUTIONS: number;
  DELTA_CONTRIBUTORS: number;
  DELTA_ALL_CONTRIBUTIONS: number;
  DELTA_ALL_CONTRIBUTORS: number;
  DELTA_ALL_ORGANIZATIONS: number;
  ORG_CREATED_AT: Date;
  ORG_LOGO_URL: string;
  SUBPROJECT_SLUG: string;
  PROJECT_SLUG: string;
  PROJECT_GROUP_SLUG: string;
}

export interface IOrganizationLeaderboardParams {
  timeRangeName: ITimeRangeName;
  activityType: IActivityType;
  segmentId: string;
  project: string;
  repository: string;
  orderBy: IOrganizationLeaderboardOrderColumns;
  asc: boolean;
  limit: number;
  offset: number;
  developerMode: IDeveloperMode;
}

export type IOrganizationLeaderboardOrderColumns =
  'segment_id'
  | 'repository_url'
  | 'organization_id'
  | 'org_name'
  | 'row_number_by_contributions'
  | 'row_number_by_contributors'
  | 'contributions'
  | 'prev_contributions'
  | 'all_contributions'
  | 'percent_total'
  | 'change_from_previous'
  | 'all_organizations'
  | 'all_prev_organizations'
  | 'all_prev_contributions'
  | 'all_change_from_previous'
  | 'contributors'
  | 'prev_contributors'
  | 'all_contributors'
  | 'contributors_percent_total'
  | 'contributors_change_from_previous'
  | 'all_prev_contributors'
  | 'contributors_all_change_from_previous'
  | 'delta_contributions'
  | 'delta_contributors'
  | 'delta_all_contributions'
  | 'delta_all_contributors'
  | 'delta_all_organizations'
  | 'org_created_at'
  | 'org_logo_url'
  | 'subproject_slug'
  | 'project_slug'
  | 'project_group_slug';

export const organizationLeaderboardOrderColumns = new Set<IOrganizationLeaderboardOrderColumns>([
  'segment_id',
  'repository_url',
  'organization_id',
  'org_name',
  'row_number_by_contributions',
  'row_number_by_contributors',
  'contributions',
  'prev_contributions',
  'all_contributions',
  'percent_total',
  'change_from_previous',
  'all_organizations',
  'all_prev_organizations',
  'all_prev_contributions',
  'all_change_from_previous',
  'contributors',
  'prev_contributors',
  'all_contributors',
  'contributors_percent_total',
  'contributors_change_from_previous',
  'all_prev_contributors',
  'contributors_all_change_from_previous',
  'delta_contributions',
  'delta_contributors',
  'delta_all_contributions',
  'delta_all_contributors',
  'delta_all_organizations',
  'org_created_at',
  'org_logo_url',
  'subproject_slug',
  'project_slug',
  'project_group_slug',
]);
