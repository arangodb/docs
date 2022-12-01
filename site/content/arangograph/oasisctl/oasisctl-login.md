---
fileID: oasisctl-login
title: Oasisctl Login
weight: 3210
description: 
layout: default
---
Login to ArangoDB Oasis using an API key

## Synopsis

To authenticate in a script environment, run:
	
	export OASIS_TOKEN=$(oasisctl login --key-id=<your-key-id> --key-secret=<your-key-secret>)


{{< tabs >}}
{{% tab name="" %}}
```
oasisctl login [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                help for login
  -i, --key-id string       API key identifier
  -s, --key-secret string   API key secret
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

