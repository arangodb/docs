---
fileID: oasisctl-list-diskperformances
title: Oasisctl List Diskperformances
weight: 3050
description: 
layout: default
---
List disk performances

## Synopsis

List disk performances

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list diskperformances [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --dbserver-disk-size int32   The disk size of dbservers (GB) (default 32)
  -h, --help                       help for diskperformances
      --node-size-id string        Identifier of the node size
  -o, --organization-id string     Identifier of the organization
      --provider-id string         Identifier of the provider
  -r, --region-id string           Identifier of the region
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

