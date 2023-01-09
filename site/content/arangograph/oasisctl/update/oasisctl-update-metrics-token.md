---
fileID: oasisctl-update-metrics-token
title: Oasisctl Update Metrics Token
weight: 3330
description: 
layout: default
---
Update a metrics token

## Synopsis

Update a metrics token

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl update metrics token [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment
      --description string       Description of the CA certificate
  -h, --help                     help for token
      --name string              Name of the CA certificate
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

* [oasisctl update metrics](oasisctl-update-metrics)	 - Update metrics resources

