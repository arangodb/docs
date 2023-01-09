---
fileID: oasisctl-list-auditlog-destinations
title: Oasisctl List Auditlog Destinations
weight: 2925
description: 
layout: default
---
List auditlog destinations

## Synopsis

List auditlog destinations

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list auditlog destinations [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --auditlog-id string       Identifier of the auditlog to list the destinations for
  -h, --help                     help for destinations
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

