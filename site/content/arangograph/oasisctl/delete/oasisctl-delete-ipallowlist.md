---
fileID: oasisctl-delete-ipallowlist
title: Oasisctl Delete Ipallowlist
weight: 2735
description: 
layout: default
---
Delete an IP allowlist the authenticated user has access to

## Synopsis

Delete an IP allowlist the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete ipallowlist [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for ipallowlist
  -i, --ipallowlist-id string    Identifier of the IP allowlist
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
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

