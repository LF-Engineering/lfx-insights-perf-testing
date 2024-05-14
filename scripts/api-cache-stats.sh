#!/bin/bash
curl -s 'http://localhost:3004/api/sf/cache-stats' | jq '.'
