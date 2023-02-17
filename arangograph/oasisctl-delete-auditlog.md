---
layout: default
description: Description of the oasisctl delete auditlog command
title: Oasisctl Delete Auditlog
---
# Oasisctl Delete Auditlog

Delete an auditlog

## Synopsis

Delete an auditlog

```
oasisctl delete auditlog [flags]
```

## Options

```
  -i, --auditlog-id string       Identifier of the auditlog to delete.
  -h, --help                     help for auditlog
  -o, --organization-id string   Identifier of the organization
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl delete](oasisctl-delete.html)	 - Delete resources
* [oasisctl delete auditlog archive](oasisctl-delete-auditlog-archive.html)	 - Delete an auditlog archive
* [oasisctl delete auditlog destination](oasisctl-delete-auditlog-destination.html)	 - Delete a destination from an auditlog

