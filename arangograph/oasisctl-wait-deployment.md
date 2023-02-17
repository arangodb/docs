---
layout: default
description: Description of the oasisctl wait deployment command
title: Oasisctl Wait Deployment
---
# Oasisctl Wait Deployment

Wait for a deployment to reach the ready status

## Synopsis

Wait for a deployment to reach the ready status

```
oasisctl wait deployment [flags]
```

## Options

```
  -d, --deployment-id string     Identifier of the deployment
  -h, --help                     help for deployment
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
  -t, --timeout duration         How long to wait for the deployment to reach the ready status (default 20m0s)
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl wait](oasisctl-wait.html)	 - Wait for a status change

