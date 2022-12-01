---
fileID: oasisctl-update-project
title: Oasisctl Update Project
weight: 3495
description: 
layout: default
---
Update a project the authenticated user has access to

## Synopsis

Update a project the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl update project [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --description string       Description of the project
  -h, --help                     help for project
      --name string              Name of the project
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

* [oasisctl update]()	 - Update resources

