export const CONFIG = {
  SF: {
    CONNECT: {
      account: process.env.SF_ACCOUNT,
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASS,
      database: process.env.SF_DB_NAME,
    },
    POOL_OPTIONS: {
      max: 10,
      min: 0
    }
  },
  CUBE: {
    URL:  process.env.CUBE_URL,
    AUTH: process.env.CUBE_AUTH
  },
  API: {
    BASE_URL: 'http://localhost:3004/api',
    ENDPOINTS: {
      CONTRIBUTORS_COUNTERS: '/contributors_counters',
    }
  },
};
