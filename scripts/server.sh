#!/bin/bash
if [ -z "$CUBE_AUTH" ]
then
  export CUBE_AUTH="$(cat ./CUBE_AUTH.secret)"
fi
if [ -z "$CUBE_URL" ]
then
  export CUBE_URL="$(cat ./CUBE_URL.secret)"
fi
if [ -z "$SF_ACCOUNT" ]
then
  export SF_ACCOUNT="$(cat ./SF_ACCOUNT.secret)"
fi
if [ -z "$SF_DB_NAME" ]
then
  export SF_DB_NAME="$(cat ./SF_DB_NAME.secret)"
fi
if [ -z "$SF_PASS" ]
then
  export SF_PASS="$(cat ./SF_PASS.secret)"
fi
if [ -z "$SF_USERNAME" ]
then
  export SF_USERNAME="$(cat ./SF_USERNAME.secret)"
fi
if [ -z "$SF_WAREHOUSE" ]
then
  export SF_WAREHOUSE="$(cat ./SF_WAREHOUSE.secret)"
fi
yarn start
