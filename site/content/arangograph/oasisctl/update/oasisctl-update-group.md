---
fileID: oasisctl-update-group
title: Oasisctl Update Group
weight: 3400
description: 
layout: default
---
Update a group the authenticated user has access to

## Synopsis

Update a group the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl update group [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --description string       Description of the group
  -g, --group-id string          Identifier of the group
  -h, --help                     help for group
      --name string              Name of the group
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

