---
fileID: oasisctl-create-notebook
title: Oasisctl Create Notebook
weight: 2540
description: 
layout: default
---
Create a new notebook

## Synopsis

Create a new notebook

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl create notebook [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment that the notebook has to run next to
      --description string       Description of the notebook
  -s, --disk-size int32          Disk size in GiB that has to be attached to given notebook
  -h, --help                     help for notebook
  -n, --name string              Name of the notebook
  -m, --notebook-model string    Identifier of the notebook model that the notebook has to use
  -o, --organization-id string   Identifier of the organization to create the notebook in
  -p, --project-id string        Identifier of the project to create the notebook in
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

* [oasisctl create]()	 - Create resources

