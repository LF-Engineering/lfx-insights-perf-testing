#!/bin/bash
curl -s -XPOST 'http://localhost:3004/api/sf/contributors_counters' -H 'Content-Type: application/json' -d '{"granularity":"year","dateRange":["2014-01-01T00: 00: 00.000","2024-12-31T23: 59: 59.999"],"project":"prometheus"}' | jq '.'
