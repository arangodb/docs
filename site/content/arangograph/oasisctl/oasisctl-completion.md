---
fileID: oasisctl-completion
title: Oasisctl Completion
weight: 2470
description: 
layout: default
---
Generates bash completion scripts

## Synopsis

To load completion run

    . <(oasisctl completion [bash|fish|powershell|zsh])

To configure your bash shell to load completions for each session add to your bashrc

    # ~/.bashrc or ~/.profile
    . <(oasisctl completion bash)


{{< tabs >}}
{{% tab name="" %}}
```
oasisctl completion [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help   help for completion
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

