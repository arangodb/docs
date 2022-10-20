---
layout: default
description: Description of the oasisctl clone deployment backup command
title: Oasisctl Clone Deployment Backup
---
# Oasisctl Clone Deployment Backup

Clone a deployment from a backup.

## Synopsis

Clone a deployment from a backup.

```
oasisctl clone deployment backup [flags]
```

## Options

```
      --accept                   Accept the current terms and conditions.
  -b, --backup-id string         Clone a deployment from a backup using the backup's ID.
  -h, --help                     help for backup
  -o, --organization-id string   Identifier of the organization to create the clone in
  -p, --project-id string        An optional identifier of the project to create the clone in
  -r, --region-id string         An optionally defined region in which the new deployment should be created in.
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl clone deployment](oasisctl-clone-deployment.html)	 - Clone deployment resources

