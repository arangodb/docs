---
fileID: oasisctl-get-example-installation
title: Oasisctl Get Example Installation
weight: 2850
description: 
layout: default
---
Get a single example dataset installation

## Synopsis

Get a single example dataset installation

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl get example installation [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment to list installations for
  -h, --help                     help for installation
      --installation-id string   The ID of the installation to get.
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

* [oasisctl get example](oasisctl-get-example)	 - Get a single example dataset

