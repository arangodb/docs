---
fileID: oasisctl-update-organization
title: Oasisctl Update Organization
weight: 3425
description: 
layout: default
---
Update an organization the authenticated user has access to

## Synopsis

Update an organization the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl update organization [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --description string       Description of the organization
  -h, --help                     help for organization
      --name string              Name of the organization
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

* [oasisctl update]()	 - Update resources
* [oasisctl update organization authentication](oasisctl-update-organization-authentication)	 - Update authentication settings for an organization
* [oasisctl update organization email](oasisctl-update-organization-email)	 - Update email specific information for an organization

