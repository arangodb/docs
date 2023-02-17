---
layout: default
description: Description of the oasisctl backup copy command
title: Oasisctl Backup Copy
---
# Oasisctl Backup Copy

Copy a backup from source backup to given region

## Synopsis

Copy a backup from source backup to given region

```
oasisctl backup copy [flags]
```

## Options

```
  -h, --help                      help for copy
      --region-id string          Identifier of the region where the new backup is to be created
      --source-backup-id string   Identifier of the source backup
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl backup](oasisctl-backup.html)	 - Backup commands

