---
fileID: oasisctl-list-backup-policies
title: Oasisctl List Backup Policies
weight: 2940
description: 
layout: default
---
List backup policies

## Synopsis

List backup policies

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list backup policies [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --deployment-id string   The ID of the deployment to list backup policies for
  -h, --help                   help for policies
      --include-deleted        If set, the result includes all backup policies, including those who set to deleted, however are not removed from the system currently
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

* [oasisctl list backup](oasisctl-list-backup)	 - A list command for various backup resources

