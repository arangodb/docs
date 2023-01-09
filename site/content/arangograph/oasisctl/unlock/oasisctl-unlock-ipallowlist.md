---
fileID: oasisctl-unlock-ipallowlist
title: Oasisctl Unlock Ipallowlist
weight: 3265
description: 
layout: default
---
Unlock an IP allowlist, so it can be deleted

## Synopsis

Unlock an IP allowlist, so it can be deleted

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl unlock ipallowlist [flags]
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

* [oasisctl unlock]()	 - Unlock resources

