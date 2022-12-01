---
fileID: oasisctl-add-group-members
title: Oasisctl Add Group Members
weight: 2490
description: 
layout: default
---
Add members to group

## Synopsis

Add members to group

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl add group members [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -g, --group-id string          Identifier of the group to add members to
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

* [oasisctl add group](oasisctl-add-group)	 - Add group resources

