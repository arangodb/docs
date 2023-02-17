---
layout: default
description: Description of the oasisctl update auditlog command
title: Oasisctl Update Auditlog
---
# Oasisctl Update Auditlog

Update an auditlog

## Synopsis

Update an auditlog

```
oasisctl update auditlog [flags]
```

## Options

```
  -i, --auditlog-id string       Identifier of the auditlog to update.
      --default                  If set, this AuditLog is the default for the organization.
      --description string       Description of the audit log.
  -h, --help                     help for auditlog
      --name string              Name of the audit log.
  -o, --organization-id string   Identifier of the organization
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl update](oasisctl-update.html)	 - Update resources

