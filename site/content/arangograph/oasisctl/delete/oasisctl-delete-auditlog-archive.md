---
fileID: oasisctl-delete-auditlog-archive
title: Oasisctl Delete Auditlog Archive
weight: 2595
description: 
layout: default
---
Delete an auditlog archive

## Synopsis

Delete an auditlog archive

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete auditlog archive [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -i, --auditlog-archive-id string   Identifier of the auditlog archive to delete.
  -h, --help                         help for archive
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

* [oasisctl delete auditlog](oasisctl-delete-auditlog)	 - Delete an auditlog
* [oasisctl delete auditlog archive events](oasisctl-delete-auditlog-archive-events)	 - Delete auditlog archive events

