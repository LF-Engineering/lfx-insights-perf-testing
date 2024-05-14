import { ITimeRangeName } from '../types/timeRanges.type';
import { IActivityType } from '../types/activityTypes.type';
import { IDeveloperMode } from '../types/developerMode.type';

export interface IOrganizationElephantFactor {
  TIME_RANGE_NAME: string;
  TIME_RANGE_FROM: Date;
  TIME_RANGE_TO: Date;
  TYPE: string;
  SEGMENT_ID: string;
  REPOSITORY_URL: string;
  ORG_ID: string
  ROW_NUMBER: number;
  CNT: number;
  PREV_CNT: number;
  PERCENT: number;
  CUMULATIVE_PERCENT: number;
  DELTA: number;
  CHANGE_FROM_PREVIOUS: number;
  BUS_FACTOR: number;
  MIN_PERCENT: number;
  OTHERS_COUNT: number;
  OTHERS_PERCENT: number;
  ORG_NAME: string;
  ORG_LOGO_URL: string;
  ORG_CREATED_AT: Date;
  SUBPROJECT_SLUG: string;
  PROJECT_SLUG: string;
  PROJECT_GROUP_SLUG: string;
  SUBPROJECT_NAME: string;
  PROJECT_NAME: string;
  PROJECT_GROUP_NAME: string;
}

export interface IOrganizationElephantFactorParams {
  timeRangeName: ITimeRangeName;
  activityType: IActivityType;
  segmentId: string;
  project: string;
  repository: string;
  orderBy: IOrganizationElephantFactorOrderColumns;
  asc: boolean;
  limit: number;
  offset: number;
  developerMode: IDeveloperMode;
}

export type IOrganizationElephantFactorOrderColumns =
  'segment_id'
  | 'repository_url'
  | 'org_id'
  | 'row_number'
  | 'cnt'
  | 'prev_cnt'
  | 'percent'
  | 'cumulative_percent'
  | 'delta'
  | 'change_from_previous'
  | 'org_name'
  | 'org_logo_url'
  | 'org_created_at'
  | 'subproject_slug'
  | 'project_slug'
  | 'project_group_slug'
  | 'subproject_name'
  | 'project_name'
  | 'project_group_name';

export const organizationElephantFactorOrderColumns = new Set<IOrganizationElephantFactorOrderColumns>([
  'segment_id',
  'repository_url',
  'org_id',
  'row_number',
  'cnt',
  'prev_cnt',
  'percent',
  'cumulative_percent',
  'delta',
  'change_from_previous',
  'org_name',
  'org_logo_url',
  'org_created_at',
  'subproject_slug',
  'project_slug',
  'project_group_slug',
  'subproject_name',
  'project_name',
  'project_group_name',
]);

