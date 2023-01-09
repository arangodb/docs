---
fileID: oasisctl-delete-organization-members
title: Oasisctl Delete Organization Members
weight: 2680
description: 
layout: default
---
Delete members from organization

## Synopsis

Delete members from organization

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete organization members [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
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

* [oasisctl delete organization](oasisctl-delete-organization)	 - Delete an organization the authenticated user has access to

