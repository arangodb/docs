---
fileID: oasisctl-list-group-members
title: Oasisctl List Group Members
weight: 3000
description: 
layout: default
---
List members of a group the authenticated user is a member of

## Synopsis

List members of a group the authenticated user is a member of

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list group members [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -g, --group-id string          Identifier of the group
  -h, --help                     help for members
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

* [oasisctl list group](oasisctl-list-group)	 - List group resources

