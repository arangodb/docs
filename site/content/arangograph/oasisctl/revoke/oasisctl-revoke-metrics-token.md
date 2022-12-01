---
fileID: oasisctl-revoke-metrics-token
title: Oasisctl Revoke Metrics Token
weight: 3310
description: 
layout: default
---
Revoke a metrics token for a deployment

## Synopsis

Revoke a metrics token for a deployment

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl revoke metrics token [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment
  -h, --help                     help for token
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
  -t, --token-id string          Identifier of the metrics token
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

* [oasisctl revoke metrics](oasisctl-revoke-metrics)	 - Revoke keys & tokens

