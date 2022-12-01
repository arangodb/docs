---
fileID: oasisctl-upgrade
title: Oasisctl Upgrade
weight: 3505
description: 
layout: default
---
Upgrade Oasisctl tool

## Synopsis

Check the latest, compatible version and upgrade this tool to that.

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl upgrade [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --dry-run   Do an upgrade without applying the version.
  -f, --force     Force an upgrade even if the versions match.
  -h, --help      help for upgrade
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

* [oasisctl](oasisctl-options)	 - ArangoDB Oasis

