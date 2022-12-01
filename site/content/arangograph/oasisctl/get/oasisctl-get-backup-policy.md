---
fileID: oasisctl-get-backup-policy
title: Oasisctl Get Backup Policy
weight: 2830
description: 
layout: default
---
Get an existing backup policy

## Synopsis

Get an existing backup policy

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl get backup policy [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help        help for policy
  -i, --id string   Identifier of the backup policy (Id|Name|Url)
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

* [oasisctl get backup](oasisctl-get-backup)	 - Get a backup

