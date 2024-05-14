import { ITimeRangeName } from '@type/timeRanges.type';
import { IActivityType } from '@type/activityTypes.type';
import { IDeveloperMode } from '@type/developerMode.type';

export interface IContributorBusFactor {
  TIME_RANGE_NAME: string;
  TIME_RANGE_FROM: Date;
  TIME_RANGE_TO: Date;
  TYPE: string;
  SEGMENT_ID: string;
  REPOSITORY_URL: string;
  MEMBER_ID: string
  PLATFORM: string;
  USERNAME: string;
  ROW_NUMBER: number;
  CNT: number;
  PREV_CNT: number;
  DELTA: number;
  PERCENT: number;
  CUMULATIVE_PERCENT: number;
  CHANGE_FROM_PREVIOUS: number;
  BUS_FACTOR: number;
  MIN_PERCENT: number;
  OTHERS_COUNT: number;
  OTHERS_PERCENT: number;
  JOINED_AT: Date;
  DISPLAY_NAME: string;
  LOGO_URL: string;
  COUNTRY: string;
  SUBPROJECT_SLUG: string;
  PROJECT_SLUG: string;
  PROJECT_GROUP_SLUG: string;
  SUBPROJECT_NAME: string;
  PROJECT_NAME: string;
  PROJECT_GROUP_NAME: string;
}

export interface IContributorBusFactorParams {
  timeRangeName: ITimeRangeName;
  activityType: IActivityType;
  segmentId: string;
  project: string;
  repository: string;
  orderBy: IContributorBusFactorOrderColumns;
  asc: boolean;
  limit: number;
  offset: number;
  developerMode: IDeveloperMode;
}

export type IContributorBusFactorOrderColumns =
  'segment_id'
  | 'repository_url'
  | 'member_id'
  | 'platform'
  | 'username'
  | 'row_number'
  | 'cnt'
  | 'prev_cnt'
  | 'delta'
  | 'percent'
  | 'cumulative_percent'
  | 'change_from_previous'
  | 'joined_at'
  | 'display_name'
  | 'logo_url'
  | 'country'
  | 'subproject_slug'
  | 'project_slug'
  | 'project_group_slug'
  | 'subproject_name'
  | 'project_name'
  | 'project_group_name';

export const contributorBusFactorOrderColumns = new Set<IContributorBusFactorOrderColumns>([
  'segment_id',
  'repository_url',
  'member_id',
  'platform',
  'username',
  'row_number',
  'cnt',
  'prev_cnt',
  'delta',
  'percent',
  'cumulative_percent',
  'change_from_previous',
  'joined_at',
  'display_name',
  'logo_url',
  'country',
  'subproject_slug',
  'project_slug',
  'project_group_slug',
  'subproject_name',
  'project_name',
  'project_group_name',
]);
