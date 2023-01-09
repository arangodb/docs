---
fileID: oasisctl-get-tandc
title: Oasisctl Get Tandc
weight: 2885
description: 
layout: default
---
Get current terms and conditions or get one by ID

## Synopsis

Get current terms and conditions or get one by ID

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl get tandc [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                             help for tandc
  -o, --organization-id string           Identifier of the organization
  -t, --terms-and-conditions-id string   Identifier of the terms and conditions to accept.
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

