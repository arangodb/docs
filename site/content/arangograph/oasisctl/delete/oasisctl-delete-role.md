---
fileID: oasisctl-delete-role
title: Oasisctl Delete Role
weight: 2775
description: 
layout: default
---
Delete a role the authenticated user has access to

## Synopsis

Delete a role the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete role [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for role
  -o, --organization-id string   Identifier of the organization
  -r, --role-id string           Identifier of the role
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

* [oasisctl delete]()	 - Delete resources

