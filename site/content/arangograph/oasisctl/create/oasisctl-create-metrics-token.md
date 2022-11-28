---
fileID: oasisctl-create-metrics-token
title: Oasisctl Create Metrics Token
weight: 2800
description: 
layout: default
---
Create a new metrics access token

## Synopsis

Create a new metrics access token

```
oasisctl create metrics token [flags]
```

## Options

```
  -d, --deployment-id string     Identifier of the deployment to create the token for
      --description string       Description of the token
  -h, --help                     help for token
      --lifetime duration        Lifetime of the token.
      --name string              Name of the token
  -o, --organization-id string   Identifier of the organization to create the token in
  -p, --project-id string        Identifier of the project to create the token in
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl create metrics](oasisctl-create-metrics)	 - Create metrics resources

