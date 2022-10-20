---
layout: default
description: Description of the oasisctl update backup command
title: Oasisctl Update Backup
---
# Oasisctl Update Backup

Update a backup

## Synopsis

Update a backup

```
oasisctl update backup [flags]
```

## Options

```
      --auto-deleted-at int   Time (h) until auto delete of the backup
  -d, --backup-id string      Identifier of the backup
      --description string    Description of the backup
  -h, --help                  help for backup
      --name string           Name of the backup
      --upload                The backups should be uploaded
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl update](oasisctl-update.html)	 - Update resources
* [oasisctl update backup policy](oasisctl-update-backup-policy.html)	 - Update a backup policy

