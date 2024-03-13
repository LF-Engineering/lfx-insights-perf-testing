import { check, group } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { thresholdsLoadBulk } from '../../../common/thresholds';
import { load } from '../../../common/stages';
import { projectSlugOptions } from '../../../static-options/projectSlug.case';
import { Helpers } from '../../../common/helpers';
import { timeRangeNameOptions } from '../../../static-options/timeRangeName.case';
import { typeNameOptions } from '../../../static-options/typeName.case';
import { typeBusFactorSfAssert } from './assert';

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
      const timeRangeName = Helpers.getRandomElFromArray(timeRangeNameOptions);
      const type = Helpers.getRandomElFromArray(typeNameOptions);
      const project = Helpers.getRandomElFromArray(projectSlugOptions);
      const response = http.post(`http://localhost:3004/api/sf/type_bus_factor_pool`, {
        timeRangeName, type, project
      } as any);
      check(response, {
        "Should have code status 200": res => res.status === 200,
        "Should contain data": typeBusFactorSfAssert
      });
    }
  );
};
