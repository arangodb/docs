---
fileID: oasisctl-delete-auditlog
title: Oasisctl Delete Auditlog
weight: 2675
description: 
layout: default
---
Delete an auditlog

## Synopsis

Delete an auditlog

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete auditlog [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -i, --auditlog-id string       Identifier of the auditlog to delete.
  -h, --help                     help for auditlog
  -o, --organization-id string   Identifier of the organization
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

* [oasisctl delete]()	 - Delete resources
* [oasisctl delete auditlog archive](oasisctl-delete-auditlog-archive)	 - Delete an auditlog archive
* [oasisctl delete auditlog destination](oasisctl-delete-auditlog-destination)	 - Delete a destination from an auditlog

