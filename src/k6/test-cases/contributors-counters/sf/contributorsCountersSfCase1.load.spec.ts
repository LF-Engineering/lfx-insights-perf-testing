import { check, group } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { thresholdsLoadSingle } from '../../../common/thresholds';
import { load } from '../../../common/stages';
import { projectSlugOptions } from '../../../static-options/projectSlug.case';
import { contributorsCountersSfAssert } from './assert';

export let options: Options = {
  stages: load,
  thresholds: thresholdsLoadSingle
};

export default function () {
  group(
    `
    Should response with: 
    checks ${thresholdsLoadSingle.checks[0]}, 
    req failed ${thresholdsLoadSingle.http_req_failed[0]}, 
    req duration ${thresholdsLoadSingle.http_req_duration[0]}
    `,
    () => {
      const response = http.post(`http://localhost:3004/api/sf/contributors_counters_pool`, {
        granularity: 'year',
        dateRange: [
          '2014-01-01T00:00:00.000',
          '2024-12-31T23:59:59.999'
        ],
        project: projectSlugOptions[9]
      } as any);
      check(response, {
        "Should have code status 200": res => res.status === 200,
        "Should contain data": contributorsCountersSfAssert
      });
    }
  );
};
