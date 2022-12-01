---
fileID: oasisctl-create-example-installation
title: Oasisctl Create Example Installation
weight: 2600
description: 
layout: default
---
Create a new example dataset installation

## Synopsis

Create a new example dataset installation

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl create example installation [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string        Identifier of the deployment to list installations for
  -e, --example-dataset-id string   ID of the example dataset
  -h, --help                        help for installation
  -o, --organization-id string      Identifier of the organization
  -p, --project-id string           Identifier of the project
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

* [oasisctl create example](oasisctl-create-example)	 - Create example ...

