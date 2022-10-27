---
layout: default
description: Description of the oasisctl logs command
title: Oasisctl Logs
---
# Oasisctl Logs

Get logs of the servers of a deployment the authenticated user has access to

## Synopsis

Get logs of the servers of a deployment the authenticated user has access to

```
oasisctl logs [flags]
```

## Options

```
  -d, --deployment-id string     Identifier of the deployment
      --end string               End fetching logs at this timestamp (pass timestamp or duration before now)
  -h, --help                     help for logs
  -l, --limit int                Limit the number of log lines
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
  -r, --role string              Limit logs to servers with given role only (agents|coordinators|dbservers)
      --start string             Start fetching logs from this timestamp (pass timestamp or duration before now)
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl](oasisctl-options.html)	 - ArangoDB Oasis

