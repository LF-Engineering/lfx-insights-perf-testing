import { Query, TimeDimensionGranularity } from '@cubejs-client/core';
import { ITimeRangeName } from '@type/timeRanges.type';
import { IActivityType } from '@type/activityTypes.type';

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
  static typeBusFactor(project: string, timeRangeName: ITimeRangeName, type: IActivityType): Query {
    return {
      dimensions: [
        'SnowTypeBusFactorView.rank',
        'SnowTypeBusFactorView.username',
        'SnowTypeBusFactorView.display_name',
        'SnowTypeBusFactorView.logo_url',
        'SnowTypeBusFactorView.contributions',
        'SnowTypeBusFactorView.percent_contributions',
        'SnowTypeBusFactorView.cumulative_percent_contributions'
      ],
      filters: [
        {
          member: 'SnowTypeBusFactorView.time_range_name',
          operator: 'equals',
          values: [
            timeRangeName
          ]
        },
        {
          member: 'SnowTypeBusFactorView.type',
          operator: 'equals',
          values: [
            type
          ]
        },
        {
          member: 'SnowTypeBusFactorView.repository_url',
          operator: 'equals',
          values: [
            'all-repos-combined'
          ]
        },
        {
          member: 'SnowTypeBusFactorView.subproject_slug',
          operator: 'equals',
          values: [
            project
          ]
        }
      ]
    }
  }
}
