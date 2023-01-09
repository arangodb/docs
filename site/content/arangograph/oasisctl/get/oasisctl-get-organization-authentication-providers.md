---
fileID: oasisctl-get-organization-authentication-providers
title: Oasisctl Get Organization Authentication Providers
weight: 2805
description: 
layout: default
---
Get which authentication providers are allowed for accessing a specific organization

## Synopsis

Get which authentication providers are allowed for accessing a specific organization

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl get organization authentication providers [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for providers
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

* [oasisctl get organization authentication](oasisctl-get-organization-authentication)	 - Get authentication specific information for an organization

