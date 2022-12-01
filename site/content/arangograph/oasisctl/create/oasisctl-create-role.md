---
fileID: oasisctl-create-role
title: Oasisctl Create Role
weight: 2660
description: 
layout: default
---
Create a new role

## Synopsis

Create a new role

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl create role [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --description string       Description of the role
  -h, --help                     help for role
      --name string              Name of the role
  -o, --organization-id string   Identifier of the organization to create the role in
  -p, --permission strings       Permissions granted by the role
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

* [oasisctl create]()	 - Create resources

