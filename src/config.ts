export const CONFIG = {
  SF: {
    CONNECT: {
      account: process.env.SF_ACCOUNT,
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASS,
      database: process.env.SF_DB_NAME,
      warehouse: process.env.SF_WAREHOUSE,
      keepAlive: true,
      timeout: 5 * 60 * 1000
    },
    POOL_OPTIONS: {
      max: 10,
      min: 10
    }
  },
  CUBE: {
    URL:  process.env.CUBE_URL,
    AUTH: process.env.CUBE_AUTH
  },
  API: {
    BASE_URL: 'http://localhost:3004/api',
    ROUTES: {
      CONTRIBUTORS: {
        BASE: '/contributors',
        ENDPOINTS: {
          COUNTERS: '/counters',
          COUNTERS_POOL: '/counters-pool',
          LEADERBOARD: '/leaderboard',
        },
      },
    },
    ENDPOINTS: {
      CONTRIBUTORS_COUNTERS: '/contributors_counters',
      CONTRIBUTORS_COUNTERS_POOL: '/contributors_counters_pool',
      TYPE_BUS_FACTOR: '/type_bus_factor',
      TYPE_BUS_FACTOR_POOL: '/type_bus_factor_pool',
      // TODO: add real SF API candidates (to be moved to a swagger repo) starting here:
      CONTRIBUTOR_LEADERBOARD: '/contributor-leaderboard',
      ORGANIZATION_LEADERBOARD: '/organization-leaderboard',
      CACHE_STATS: '/cache-stats',
    }
  },
};
