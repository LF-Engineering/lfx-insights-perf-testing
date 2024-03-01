import { Stage } from 'k6/options';

export const load: Stage[] = [
  { duration: '30s', target: 100},
  { duration: '1m', target: 100},
  { duration: '30s', target: 0},
]
