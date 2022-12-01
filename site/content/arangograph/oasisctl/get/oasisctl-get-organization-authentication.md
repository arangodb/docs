---
fileID: oasisctl-get-organization-authentication
title: Oasisctl Get Organization Authentication
weight: 2885
description: 
layout: default
---
Get authentication specific information for an organization

## Synopsis

Get authentication specific information for an organization

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl get organization authentication [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help   help for authentication
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

* [oasisctl get organization](oasisctl-get-organization)	 - Get an organization the authenticated user is a member of
* [oasisctl get organization authentication providers](oasisctl-get-organization-authentication-providers)	 - Get which authentication providers are allowed for accessing a specific organization

