---
fileID: oasisctl-lock-organization
title: Oasisctl Lock Organization
weight: 3110
description: 
layout: default
---
Lock an organization, so it cannot be deleted

## Synopsis

Lock an organization, so it cannot be deleted

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl lock organization [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for organization
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

* [oasisctl lock]()	 - Lock resources

