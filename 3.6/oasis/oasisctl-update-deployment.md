---
layout: default
description: Description of the oasisctl update deployment command
title: Oasisctl Update Deployment
---
# Oasisctl Update Deployment

Update a deployment the authenticated user has access to

## Synopsis

Update a deployment the authenticated user has access to

```
oasisctl update deployment [flags]
```

## Options

```
  -d, --deployment-id string     Identifier of the deployment
      --description string       Description of the deployment
  -h, --help                     help for deployment
  -i, --ipwhitelist-id string    Identifier of the IP whitelist to use for the deployment
      --name string              Name of the deployment
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.adbtest.xyz")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl update](oasisctl-update.html)	 - Update resources

