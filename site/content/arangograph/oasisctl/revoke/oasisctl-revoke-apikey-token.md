---
fileID: oasisctl-revoke-apikey-token
title: Oasisctl Revoke Apikey Token
weight: 3300
description: 
layout: default
---
Revoke an API key token

## Synopsis

Revoke the token (resulting from API key authentication)

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl revoke apikey token [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help   help for token
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

* [oasisctl revoke apikey](oasisctl-revoke-apikey)	 - Revoke an API key with given identifier

