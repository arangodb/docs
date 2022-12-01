---
fileID: oasisctl-list-cacertificates
title: Oasisctl List Cacertificates
weight: 3035
description: 
layout: default
---
List all CA certificates of the given project

## Synopsis

List all CA certificates of the given project

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list cacertificates [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for cacertificates
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
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

