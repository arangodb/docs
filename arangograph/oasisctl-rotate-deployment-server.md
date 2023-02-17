---
layout: default
description: Description of the oasisctl rotate deployment server command
title: Oasisctl Rotate Deployment Server
---
# Oasisctl Rotate Deployment Server

Rotate a single server of a deployment

## Synopsis

Rotate a single server of a deployment

```
oasisctl rotate deployment server [flags]
```

## Options

```
  -d, --deployment-id string     Identifier of the deployment
  -h, --help                     help for server
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
  -s, --server-id strings        Identifier of the deployment server
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl rotate deployment](oasisctl-rotate-deployment.html)	 - Rotate deployment resources

