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
    },
    CACHING: {
      SQL_QUERY: true,    // Cache *.sql pre-compiled statements query files
      SQL_RESULT: true,   // Cache query results for TTL seconds - using query's SHA256 hash BASE64 encoded as a key
      TTL: 28800          // 8 hours
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
          LEADERBOARD: '/leaderboard',
          BUS_FACTOR: '/bus-factor',
        },
      },
      ORGANIZATIONS: {
        BASE: '/organizations',
        ENDPOINTS: {
          LEADERBOARD: '/leaderboard',
          ELEPHANT_FACTOR: '/elephant-factor',
        },
      },
    },
    ENDPOINTS: {
      CONTRIBUTORS_COUNTERS: '/contributors_counters',
      CONTRIBUTORS_COUNTERS_POOL: '/contributors_counters_pool',
      TYPE_BUS_FACTOR: '/type_bus_factor',
      TYPE_BUS_FACTOR_POOL: '/type_bus_factor_pool',
      // Cache statistics API
      CACHE_STATS: '/cache-stats',
    }
  },
};
