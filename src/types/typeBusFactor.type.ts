/*export interface IContributorsTotalCube {
  ['SnowContributions.project']: string;
  ['SnowContributions.timestamp.month']: string;
  ['SnowContributions.timestamp']: string;
  ['SnowContributions.count_contributors']: string;
}

export interface IContributorsTotalCubeNew {
  ['SnowSubSegments.project_slug']: string;
  ['SnowActivities.timestamp.year']: string;
  ['SnowActivities.timestamp']: string;
  ['SnowActivities.metric_contributors']: string;
}*/

export interface ITypeBusFactorSf {
  ROW_NUMBER: number;
  USERNAME: string;
  DISPLAY_NAME: string;
  LOGO_URL: string;
  CNT: number
  PERCENT: number;
  CUMULATIVE_PERCENT: number;
}

export interface ITypeBusFactorParams {
  timeRangeName: ITypeBusFactorTimeRangeName;
  type: ITypeBusFactorType;
  project: string;
}

export type ITypeBusFactorTimeRangeName =
  '7d'| '30d' | '90d' | '12m' | 'q' | 'ty' | 'y' | '2y' | 'a' | '7dp' | '30dp' | '90dp' | '12mp' | 'qp' | 'typ' | 'yp' | '2yp';

export type ITypeBusFactorType =
  'changeset-abandoned' | 'changeset-created' | 'changeset-merged' | 'commits' | 'contributions' | 'gerrit_comments' | 'issues-closed' | 'issues-opened' | 'pr_comments' | 'pull_request-closed' | 'pull_request-merged' | 'pull_request-opened' | 'pull_request-reviewed';
