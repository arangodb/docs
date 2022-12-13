#!/bin/bash

sed "s/.*operationId.*//g" api-docs.json > stub.json
npx @openapitools/openapi-generator-cli generate -i stub.json -g nodejs-express-server -o arangostub