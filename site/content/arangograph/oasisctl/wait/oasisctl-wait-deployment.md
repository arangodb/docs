---
fileID: oasisctl-wait-deployment
title: Oasisctl Wait Deployment
weight: 3435
description: 
layout: default
---
Wait for a deployment to reach the ready status

## Synopsis

Wait for a deployment to reach the ready status

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl wait deployment [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment
  -h, --help                     help for deployment
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
  -t, --timeout duration         How long to wait for the deployment to reach the ready status (default 20m0s)
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

* [oasisctl wait]()	 - Wait for a status change

