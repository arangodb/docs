---
fileID: oasisctl-lock-project
title: Oasisctl Lock Project
weight: 3120
description: 
layout: default
---
Lock a project, so it cannot be deleted

## Synopsis

Lock a project, so it cannot be deleted

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl lock project [flags]
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

* [oasisctl lock]()	 - Lock resources

