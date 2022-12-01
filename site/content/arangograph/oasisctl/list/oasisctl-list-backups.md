---
fileID: oasisctl-list-backups
title: Oasisctl List Backups
weight: 3030
description: 
layout: default
---
List backups

## Synopsis

List backups

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl list backups [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --deployment-id string   The ID of the deployment to list backups for
      --from string            Request backups that are created at or after this timestamp
  -h, --help                   help for backups
      --to string              Request backups that are created before this timestamp
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

* [oasisctl list]()	 - List resources

