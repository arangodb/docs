---
fileID: oasisctl-list-backups
title: Oasisctl List Backups
weight: 3210
description: 
layout: default
---
List backups

## Synopsis

List backups

```
oasisctl list backups [flags]
```

## Options

```
      --deployment-id string   The ID of the deployment to list backups for
      --from string            Request backups that are created at or after this timestamp
  -h, --help                   help for backups
      --to string              Request backups that are created before this timestamp
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl list]()	 - List resources

