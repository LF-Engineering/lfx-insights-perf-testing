# Insights performance testing

### Getting Sources

You need to clone the repo from here `git@github.com:LF-Engineering/lfx-insights-perf-testing.git`.

```bash
$ git clone git@github.com:LF-Engineering/lfx-insights-perf-testing.git
```

### Install `yarn` globally on your machine

```bash
$ npm install -g yarn
```

### Installation

```bash
$ yarn install
```

### Setup env

|    Param     | Obligatory | Default |
|:------------:|:----------:|:-------:|
|  CUBE_AUTH   |    YES     |    -    |
|   CUBE_URL   |    YES     |    -    |
|  SF_ACCOUNT  |    YES     |    -    |
|  SF_DB_NAME  |    YES     |    -    |
|   SF_PASS    |    YES     |    -    |
| SF_USERNAME  |    YES     |    -    |
| SF_WAREHOUSE |    YES     |    -    |

### Run Test server
be sure you assigned env vars correct in prev stage

```yarn start```

Server will start on default port 3004

### Check test server response in Postman / curl or similar

For Cube
`POST` to `http://localhost:3004/api/cube/contributors_counters`

body
```
{
  "granularity": "year",
  "dateRange": [
    "2014-01-01T00:00:00.000",
    "2024-12-31T23:59:59.999"
  ],
  "project": "prometheus"
}
```

For SnowFlake
`POST` to `http://localhost:3004/api/sf/contributors_counters`

body
```
{
  "granularity": "month",
  "dateRange": [
    "2014-01-01T00:00:00.000",
    "2024-12-31T23:59:59.999"
  ],
  "project": "prometheus"
}
```

### Setup K6 locally

Follow instructions for your operating system

`https://k6.io/docs/get-started/installation/`

### Setup Grafana K6 cloud account (optional) for better tests tracking / representation / AI analysis etc

`https://grafana.com/products/cloud/k6/`

### Setup K6 cloud

Follow `https://k6.io/docs/cloud/integrations/token/` to get your token

Login to your account from the CLI

`k6 login cloud --token <YOUR_API_AUTH_TOKEN>`

### Run K6 test locally with `stdout` 
`https://k6.io/docs/results-output/end-of-test/`

1. compile TS to JS (goja)

`yarn build-k6`

2. run k6 locally

Cube test set:

```
k6 run dist/contributorsCountersCase1.load.spec.js
k6 run dist/contributorsCountersCase2.load.spec.js
k6 run dist/contributorsCountersCase3.load.spec.js
```

SnowFlake test set:

```
k6 run dist/contributorsCountersSfCase1.load.spec.js
k6 run dist/contributorsCountersSfCase2.load.spec.js
k6 run dist/contributorsCountersSfCase3.load.spec.js
```

### Run K6 test locally with streaming result to `cloud`
`https://k6.io/docs/results-output/real-time/cloud/`

1. compile TS to JS (goja)

`yarn build-k6`

2. run k6 locally

Cube test set:

```
k6 --out cloud run dist/contributorsCountersCase1.load.spec.js
k6 --out cloud run dist/contributorsCountersCase2.load.spec.js
k6 --out cloud run dist/contributorsCountersCase3.load.spec.js
```

SnowFlake test set:

```
k6 --out cloud run dist/contributorsCountersSfCase1.load.spec.js
k6 --out cloud run dist/contributorsCountersSfCase2.load.spec.js
k6 --out cloud run dist/contributorsCountersSfCase3.load.spec.js
```

### Run K6 test in the cloud with streaming results to `cloud` 
500VU/h available for free account

1. compile TS to JS (goja)

`yarn build-k6`

2. run k6 locally

Cube test set:

```
k6 cloud dist/contributorsCountersCase1.load.spec.js
k6 cloud dist/contributorsCountersCase2.load.spec.js
k6 cloud dist/contributorsCountersCase3.load.spec.js
```

SnowFlake test set:

```
k6 cloud dist/contributorsCountersSfCase1.load.spec.js
k6 cloud dist/contributorsCountersSfCase2.load.spec.js
k6 cloud dist/contributorsCountersSfCase3.load.spec.js
```


# Snowflake APIs development.

- Provide values for `*.secret` files needed by `scripts/server.sh`.
- Start server via: `` ./scripts/server.sh ``. Or manually changing to another developer (othe rthan define din `*.secret files): `` SF_USERNAME=lf_lukasz SF_PASS=[redacted] SF_WAREHOUSE=DBT_INSIGHTS_DEV ./scripts/server.sh ``.
- Call example API via: `` ./scripts/api-contributors_counters.sh ``.
- Call example API via: `` ./scripts/api-contributor-leaderboard.sh ``.
- Call example API via: `` ./scripts/api-organization-leaderboard.sh ``.


### License

This project’s source code is licensed under the MIT License. A copy of the license is available in [LICENSE](https://github.com/LF-Engineering/lfx-insights-ui/blob/main/LICENSE).

The project includes source code from keycloak, which is licensed under the Apache License, version 2.0 (Apache-2.0), a copy of which is available in LICENSE-keycloak.

This project’s documentation is licensed under the Creative Commons Attribution 4.0 International License (CC-BY-4.0). A copy of the license is available in LICENSE-docs.

---

Copyright The Linux Foundation and each contributor to LFX.
