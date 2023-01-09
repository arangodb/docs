---
fileID: oasisctl-list-metrics-tokens
title: Oasisctl List Metrics Tokens
weight: 3020
description: 
layout: default
---
List all metrics tokens of the given deployment

## Synopsis

List all metrics tokens of the given deployment

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list metrics tokens [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment
  -h, --help                     help for tokens
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

* [oasisctl list metrics](oasisctl-list-metrics)	 - List metrics resources

