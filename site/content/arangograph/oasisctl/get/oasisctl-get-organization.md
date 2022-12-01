---
fileID: oasisctl-get-organization
title: Oasisctl Get Organization
weight: 2880
description: 
layout: default
---
Get an organization the authenticated user is a member of

## Synopsis

Get an organization the authenticated user is a member of

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl get organization [flags]
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

* [oasisctl get]()	 - Get information
* [oasisctl get organization authentication](oasisctl-get-organization-authentication)	 - Get authentication specific information for an organization
* [oasisctl get organization email](oasisctl-get-organization-email)	 - Get email specific information for an organization
* [oasisctl get organization invite](oasisctl-get-organization-invite)	 - Get an organization invite the authenticated user has access to

