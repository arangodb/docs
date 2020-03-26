---
layout: default
description: Description of the oasisctl get server limits command
title: Oasisctl Get Server Limits
---
# Oasisctl Get Server Limits

Get limits for servers in a project for a specific region

## Synopsis

Get limits for servers in a project for a specific region

```
oasisctl get server limits [flags]
```

## Options

```
  -h, --help                     help for limits
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
      --provider-id string       Identifier of the provider
  -r, --region-id string         Identifier of the region
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.adbtest.xyz")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl get server](oasisctl-get-server.html)	 - Get server information

