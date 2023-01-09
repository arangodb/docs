---
fileID: oasisctl-list-effective-permissions
title: Oasisctl List Effective Permissions
weight: 2975
description: 
layout: default
---
List the effective permissions, the authenticated user has for a given URL

## Synopsis

List the effective permissions, the authenticated user has for a given URL

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list effective permissions [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help         help for permissions
  -u, --url string   URL of resource to get effective permissions for
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

* [oasisctl list effective](oasisctl-list-effective)	 - List effective information

