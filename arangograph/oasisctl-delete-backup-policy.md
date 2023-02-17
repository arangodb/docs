---
layout: default
description: Description of the oasisctl delete backup policy command
title: Oasisctl Delete Backup Policy
---
# Oasisctl Delete Backup Policy

Delete a backup policy for a given ID.

## Synopsis

Delete a backup policy for a given ID.

```
oasisctl delete backup policy [flags]
```

## Options

```
  -h, --help                     help for policy
  -i, --id string                Identifier of the backup policy
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl delete backup](oasisctl-delete-backup.html)	 - Delete a backup for a given ID.

