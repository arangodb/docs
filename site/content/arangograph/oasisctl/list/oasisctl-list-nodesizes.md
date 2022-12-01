---
fileID: oasisctl-list-nodesizes
title: Oasisctl List Nodesizes
weight: 3110
description: 
layout: default
---
List node sizes

## Synopsis

List node sizes

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list nodesizes [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for nodesizes
      --model string             Identifier of the model (default "oneshard")
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
      --provider-id string       Identifier of the provider
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

* [oasisctl list]()	 - List resources

