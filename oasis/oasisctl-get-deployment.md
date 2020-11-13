---
layout: default
description: Description of the oasisctl get deployment command
title: Oasisctl Get Deployment
---
# Oasisctl Get Deployment

Get a deployment the authenticated user has access to

## Synopsis

Get a deployment the authenticated user has access to

```
oasisctl get deployment [flags]
```

## Options

```
  -d, --deployment-id string     Identifier of the deployment
  -h, --help                     help for deployment
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
      --show-root-password       show the root password of the database
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl get](oasisctl-get.html)	 - Get information

