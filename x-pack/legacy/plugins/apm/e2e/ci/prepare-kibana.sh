#!/usr/bin/env bash
set -ex

E2E_DIR="x-pack/legacy/plugins/apm/e2e"
INGEST_DATA_DIR="cypress/ingest-data"

echo "1/3 Install dependencies ..."
# shellcheck disable=SC1091
source src/dev/ci_setup/setup_env.sh true
yarn kbn clean && yarn kbn bootstrap

echo "2/3 Ingest test data ..."
pushd ${E2E_DIR}
yarn
curl --silent https://storage.googleapis.com/apm-ui-e2e-static-data/events.json --output ${INGEST_DATA_DIR}/events.json
node ${INGEST_DATA_DIR}/replay.js --server-url http://localhost:8200 --secret-token abcd --events ./${INGEST_DATA_DIR}/events.json > ingest-data.log

echo "3/3 Start Kibana ..."
popd
## Might help to avoid FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
export NODE_OPTIONS="--max-old-space-size=4096"
nohup node scripts/kibana --config ${E2E_DIR}/ci/kibana.dev.yml --no-base-path --optimize.watch=false> kibana.log 2>&1 &
echo $! > ${E2E_DIR}/kibana_pid.txt
