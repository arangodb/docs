---
fileID: oasisctl-get-organization-email-domain-restrictions
title: Oasisctl Get Organization Email Domain Restrictions
weight: 2905
description: 
layout: default
---
Get which email domain restrictions are placed on accessing a specific organization

## Synopsis

Get which email domain restrictions are placed on accessing a specific organization

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl get organization email domain restrictions [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for restrictions
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

* [oasisctl get organization email domain](oasisctl-get-organization-email-domain)	 - Get email domain specific information for an organization

