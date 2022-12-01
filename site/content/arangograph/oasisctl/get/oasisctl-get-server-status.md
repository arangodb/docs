---
fileID: oasisctl-get-server-status
title: Oasisctl Get Server Status
weight: 2965
description: 
layout: default
---
Get the status of servers for a deployment

## Synopsis

Get the status of servers for a deployment

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl get server status [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment
  -h, --help                     help for status
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

* [oasisctl get server](oasisctl-get-server)	 - Get server information

