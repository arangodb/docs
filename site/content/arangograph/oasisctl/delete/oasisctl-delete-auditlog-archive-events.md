---
fileID: oasisctl-delete-auditlog-archive-events
title: Oasisctl Delete Auditlog Archive Events
weight: 2600
description: 
layout: default
---
Delete auditlog archive events

## Synopsis

Delete auditlog archive events

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete auditlog archive events [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -i, --auditlog-archive-id string   Identifier of the auditlog archive to delete events from.
  -h, --help                         help for events
      --to string                    Remove events created before this timestamp.
```
{{% /tab %}}
{{< /tabs >}}

## Options inherited from parent commands

{{< tabs >}}
{{% tab name="" %}}
```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```
{{% /tab %}}
{{< /tabs >}}

## See also

* [oasisctl delete auditlog archive](oasisctl-delete-auditlog-archive)	 - Delete an auditlog archive

