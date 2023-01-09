---
fileID: oasisctl-update-organization-email-domain-restrictions
title: Oasisctl Update Organization Email Domain Restrictions
weight: 3365
description: 
layout: default
---
Update which domain restrictions are placed on accessing a specific organization

## Synopsis

Update which domain restrictions are placed on accessing a specific organization

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl update organization email domain restrictions [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --allowed-domain strings   Allowed email domains for users of the organization
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

* [oasisctl update organization email domain](oasisctl-update-organization-email-domain)	 - Update email domain specific information for an organization

