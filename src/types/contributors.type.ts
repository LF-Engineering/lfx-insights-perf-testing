export interface IContributorsTotalCube {
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
}

export interface IContributorsTotalSf {
  YM: string;
  CONTRIBUTORS_COUNT: number;
}

export interface IContributorsTotalParams {
  granularity: string;
  dateRange: [string, string];
  project: string;
}

