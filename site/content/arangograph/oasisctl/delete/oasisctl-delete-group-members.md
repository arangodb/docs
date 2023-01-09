---
fileID: oasisctl-delete-group-members
title: Oasisctl Delete Group Members
weight: 2645
description: 
layout: default
---
Delete members from group

## Synopsis

Delete members from group

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete group members [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -g, --group-id string          Identifier of the group to delete members from
  -h, --help                     help for members
  -o, --organization-id string   Identifier of the organization
  -u, --user-emails strings      A comma separated list of user email addresses
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

* [oasisctl delete group](oasisctl-delete-group)	 - Delete a group the authenticated user has access to

