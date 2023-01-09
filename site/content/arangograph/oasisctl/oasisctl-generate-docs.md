---
fileID: oasisctl-generate-docs
title: Oasisctl Generate-docs
weight: 2715
description: 
layout: default
---
Generate output

## Synopsis

Generate output

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl generate-docs [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                             help for generate-docs
  -l, --link-file-ext string             What file extensions the links should point to
  -o, --output-dir string                Output directory (default "./docs")
  -r, --replace-underscore-with string   Replace the underscore in links with the given character
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

* [oasisctl](oasisctl-options)	 - ArangoDB Oasis

