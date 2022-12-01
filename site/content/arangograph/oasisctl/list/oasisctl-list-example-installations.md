---
fileID: oasisctl-list-example-installations
title: Oasisctl List Example Installations
weight: 3070
description: 
layout: default
---
List all example dataset installations for a deployment

## Synopsis

List all example dataset installations for a deployment

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list example installations [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment to list installations for
  -h, --help                     help for installations
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

* [oasisctl list example](oasisctl-list-example)	 - List example ...

