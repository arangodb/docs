---
fileID: oasisctl-create-organization-invite
title: Oasisctl Create Organization Invite
weight: 2550
description: 
layout: default
---
Create a new invite to an organization

## Synopsis

Create a new invite to an organization

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl create organization invite [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --email string             Email address of the person to invite
  -h, --help                     help for invite
  -o, --organization-id string   Identifier of the organization to create the invite in
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

* [oasisctl create organization](oasisctl-create-organization)	 - Create a new organization

