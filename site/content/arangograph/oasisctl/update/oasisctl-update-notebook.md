---
fileID: oasisctl-update-notebook
title: Oasisctl Update Notebook
weight: 3420
description: 
layout: default
---
Update notebook

## Synopsis

Update notebook

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl update notebook [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --description string      Description of the notebook
  -s, --disk-size int32         Notebook disk size in GiB
  -h, --help                    help for notebook
      --name string             Name of the notebook
  -n, --notebook-id string      Identifier of the notebook
  -m, --notebook-model string   Identifier of the notebook model
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

* [oasisctl update]()	 - Update resources

