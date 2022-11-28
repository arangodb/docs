---
fileID: oasisctl-delete-metrics-token
title: Oasisctl Delete Metrics Token
weight: 2925
description: 
layout: default
---
Delete a metrics token for a deployment

## Synopsis

Delete a metrics token for a deployment

```
oasisctl delete metrics token [flags]
```

## Options

```
  -d, --deployment-id string     Identifier of the deployment
  -h, --help                     help for token
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
  -t, --token-id string          Identifier of the metrics token
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl delete metrics](oasisctl-delete-metrics)	 - Delete metrics resources

