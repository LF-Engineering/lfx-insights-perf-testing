import { Threshold } from 'k6/options';

export const thresholdsLoadSingle: Record<string, Threshold[]> = {
  checks: ['rate > 0.99'],
  http_req_failed: ['rate < 0.01'],
  http_req_duration: ['p(95) < 500'],
}

export const thresholdsLoadBulk: Record<string, Threshold[]> = {
  checks: ['rate>0.95'],
  http_req_failed: ['rate<0.02'],
  http_req_duration: ['p(90) < 5000', 'p(95) < 7500', 'p(99.9) < 10000'],
}
