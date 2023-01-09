---
fileID: oasisctl-create-apikey
title: Oasisctl Create Apikey
weight: 2480
description: 
layout: default
---
Create a new API key

## Synopsis

Create a new API key

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl create apikey [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for apikey
  -o, --organization-id string   If set, the newly created API key will grant access to this organization only
      --readonly                 If set, the newly created API key will grant readonly access only
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

* [oasisctl create]()	 - Create resources

