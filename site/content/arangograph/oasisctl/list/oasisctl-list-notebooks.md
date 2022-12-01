---
fileID: oasisctl-list-notebooks
title: Oasisctl List Notebooks
weight: 3120
description: 
layout: default
---
List notebooks

## Synopsis

List notebooks

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list notebooks [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment that the notebooks run next to
  -h, --help                     help for notebooks
  -o, --organization-id string   Identifier of the organization that has notebooks
  -p, --project-id string        Identifier of the project that has notebooks
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

* [oasisctl list]()	 - List resources

