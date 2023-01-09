---
fileID: oasisctl-get-region
title: Oasisctl Get Region
weight: 2860
description: 
layout: default
---
Get a region the authenticated user has access to

## Synopsis

Get a region the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl get region [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for region
  -o, --organization-id string   Optional Identifier of the organization
  -p, --provider-id string       Identifier of the provider
  -r, --region-id string         Identifier of the region
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

