---
fileID: oasisctl-rotate-deployment-server
title: Oasisctl Rotate Deployment Server
weight: 3325
description: 
layout: default
---
Rotate a single server of a deployment

## Synopsis

Rotate a single server of a deployment

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl rotate deployment server [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment
  -h, --help                     help for server
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
  -s, --server-id strings        Identifier of the deployment server
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

* [oasisctl rotate deployment](oasisctl-rotate-deployment)	 - Rotate deployment resources

