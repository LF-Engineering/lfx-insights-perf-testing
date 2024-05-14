#!/bin/bash
curl -s -XPOST 'http://localhost:3004/api/sf/contributors/bus-factor' -H 'Content-Type: application/json' -d '{"segmentId": "", "project": "cncf", "repository": "", "timeRangeName": "a", "activityType": "contributions", "orderBy": "row_number", "asc": true, "limit": 10, "offset": 0, "developerMode": ""}' | jq '.'
