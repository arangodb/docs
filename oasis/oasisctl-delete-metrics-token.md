---
layout: default
description: Description of the oasisctl delete metrics token command
title: Oasisctl Delete Metrics Token
---
# Oasisctl Delete Metrics Token

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

* [oasisctl delete metrics](oasisctl-delete-metrics.html)	 - Delete metrics resources

