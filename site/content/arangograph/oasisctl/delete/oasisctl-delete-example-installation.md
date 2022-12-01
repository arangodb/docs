---
fileID: oasisctl-delete-example-installation
title: Oasisctl Delete Example Installation
weight: 2720
description: 
layout: default
---
Delete an example datasets installation

## Synopsis

Delete an example datasets installation

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete example installation [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment to list installations for
  -h, --help                     help for installation
      --installation-id string   The ID of the installation to delete.
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

* [oasisctl delete example](oasisctl-delete-example)	 - Delete example ...

