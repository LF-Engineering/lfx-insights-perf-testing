import { Stage } from 'k6/options';

export const load: Stage[] = [
  { duration: '30s', target: 50 },
  { duration: '4m', target: 50 },
  { duration: '30s', target: 0 },
]
