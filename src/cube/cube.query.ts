import { Query, TimeDimensionGranularity } from '@cubejs-client/core';

export class CubeQuery {
  static contributorsCounters(project: string, granularity: TimeDimensionGranularity, dateRange: [string, string]): Query {
    return {
      limit: 5000,
      measures: ['SnowContributions.count_contributors'],
      dimensions: ['SnowContributions.project'],
      timeDimensions: [
        {
          dimension: 'SnowContributions.timestamp', granularity, dateRange
        }
      ],
      filters: [
        {
          member: 'SnowContributions.project', operator: 'equals', values: [project]
        },
        {
          member: 'SnowContributions.is_bot', operator: 'equals', values: ['false']
        }
      ]
    }
  }
  static contributorsCountersNew(project: string, granularity: TimeDimensionGranularity, dateRange: [string, string]): Query {
    return {
      limit: 5000,
      measures: ['SnowActivities.metric_contributors'],
      dimensions: ['SnowSubSegments.project_slug'],
      timeDimensions: [
        {
          dimension: 'SnowActivities.timestamp', granularity, dateRange
        }
      ],
      filters: [
        {
          member: 'SnowSubSegments.project_slug', operator: 'equals', values: [project]
        },
        {
          member: 'SnowMembers.is_bot', operator: 'equals', values: ['false']
        }
      ]
    }
  }
}
