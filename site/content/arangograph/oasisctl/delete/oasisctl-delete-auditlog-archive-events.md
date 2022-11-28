---
fileID: oasisctl-delete-auditlog-archive-events
title: Oasisctl Delete Auditlog Archive Events
weight: 2685
description: 
layout: default
---
Delete auditlog archive events

## Synopsis

Delete auditlog archive events

```
oasisctl delete auditlog archive events [flags]
```

## Options

```
  -i, --auditlog-archive-id string   Identifier of the auditlog archive to delete events from.
  -h, --help                         help for events
      --to string                    Remove events created before this timestamp.
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl delete auditlog archive](oasisctl-delete-auditlog-archive)	 - Delete an auditlog archive

