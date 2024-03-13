import { check, group } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { thresholdsLoadSingle } from '../../common/thresholds';
import { load } from '../../common/stages';
import { crocodilesAssert } from './assert';

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
      const response = http.get(`http://localhost:3004/api/dummy/crocodiles`);
      check(response, {
        "Should have code status 200": res => res.status === 200,
        "Should contain data": crocodilesAssert
      });
    }
  );
};
