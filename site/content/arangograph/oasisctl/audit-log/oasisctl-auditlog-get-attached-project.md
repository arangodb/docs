---
fileID: oasisctl-auditlog-get-attached-project
title: Oasisctl Auditlog Get Attached Project
weight: 2520
description: 
layout: default
---
Get an attached log to a project

## Synopsis

Get an attached log to a project

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl auditlog get attached project [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for project
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

* [oasisctl auditlog get attached](oasisctl-auditlog-get-attached)	 - Audit get attached resources

