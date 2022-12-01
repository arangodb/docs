---
fileID: oasisctl-get-auditlog
title: Oasisctl Get Auditlog
weight: 2810
description: 
layout: default
---
Get auditlog archive

## Synopsis

Get auditlog archive

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl get auditlog [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -i, --auditlog-id string       Identifier of the auditlog
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

* [oasisctl get]()	 - Get information
* [oasisctl get auditlog archive](oasisctl-get-auditlog-archive)	 - Get auditlog archive
* [oasisctl get auditlog events](oasisctl-get-auditlog-events)	 - Get auditlog events

