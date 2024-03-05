import { check, group } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { thresholdsLoadBulk } from '../../common/thresholds';
import { load } from '../../common/stages';
import { projectSlugCase } from '../../common/projectSlug.case';
import { Helpers } from '../../common/helpers';
import { contributorsCountersSfAssert } from './assert';

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
      const randomDateRange = Helpers.getRandomDateRange(new Date('2014-01-01T00:00:00.000'), new Date());
      const granularity = Helpers.getGranularity(new Date(randomDateRange[0]), new Date(randomDateRange[1]));
      const response = http.post(`http://localhost:3004/api/sf/contributors_counters`, {
        granularity,
        dateRange: randomDateRange,
        project: Helpers.getRandomElFromArray(projectSlugCase)
      } as any);
      check(response, {
        "Should have code status 200": res => res.status === 200,
        "Should contain data": contributorsCountersSfAssert
      });
    }
  );
};
