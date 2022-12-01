---
fileID: oasisctl-list-auditlog-archives
title: Oasisctl List Auditlog Archives
weight: 3005
description: 
layout: default
---
List auditlog archives

## Synopsis

List auditlog archives

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list auditlog archives [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -i, --auditlog-id string       Identifier of the auditlog
  -h, --help                     help for archives
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

* [oasisctl list auditlog](oasisctl-list-auditlog)	 - List resources for auditlogs

