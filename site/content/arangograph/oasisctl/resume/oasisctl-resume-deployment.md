---
fileID: oasisctl-resume-deployment
title: Oasisctl Resume Deployment
weight: 3280
description: 
layout: default
---
Resume a paused deployment the authenticated user has access to

## Synopsis

Resume a paused deployment the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl resume deployment [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment
  -h, --help                     help for deployment
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

* [oasisctl resume]()	 - Resume resources

