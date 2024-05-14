#!/bin/bash
curl -s -XPOST 'http://localhost:3004/api/sf/organizations/leaderboard' -H 'Content-Type: application/json' -d '{"segmentId": "", "project": "cncf", "repository": "", "timeRangeName": "a", "activityType": "commits", "orderBy": "contributors", "asc": false, "limit": 2, "offset": 0, "developerMode": ""}' | jq '.'
