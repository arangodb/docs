---
layout: default
description: Description of the oasisctl list backup policies command
title: Oasisctl List Backup Policies
---
# Oasisctl List Backup Policies

List backup policies

## Synopsis

List backup policies

```
oasisctl list backup policies [flags]
```

## Options

```
      --deployment-id string   The ID of the deployment to list backup policies for
  -h, --help                   help for policies
      --include-deleted        If set, the result includes all backup policies, including those who set to deleted, however are not removed from the system currently
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl list backup](oasisctl-list-backup.html)	 - A list command for various backup resources

