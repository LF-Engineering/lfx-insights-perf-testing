import { check, group } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { thresholdsLoadBulk } from '../../common/thresholds';
import { load } from '../../common/stages';
import { projectSlugCase } from '../../common/projectSlug.case';
import { Helpers } from '../../common/helpers';
import { contributorsCountersAssert } from './assert';

export let options: Options = {
  stages: load,
  thresholds: thresholdsLoadBulk
};

export default function () {
  group(
    `
    Should response with: 
    checks ${thresholdsLoadBulk.checks[0]}, 
    req failed ${thresholdsLoadBulk.http_req_failed[0]}, 
    req duration ${thresholdsLoadBulk.http_req_duration[0]}
    `,
    () => {
      const response = http.post(`http://localhost:3004/api/cube/contributors_counters`, {
        granularity: 'year',
        dateRange: [
          '2014-01-01T00:00:00.000',
          '2024-12-31T23:59:59.999'
        ],
        project: Helpers.getRandomElFromArray(projectSlugCase)
      } as any);
      check(response, {
        "Should have code status 200": res => res.status === 200,
        "Should contain data": contributorsCountersAssert
      });
    }
  );
};
