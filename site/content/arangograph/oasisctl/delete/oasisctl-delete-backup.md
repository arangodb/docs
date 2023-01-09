---
fileID: oasisctl-delete-backup
title: Oasisctl Delete Backup
weight: 2610
description: 
layout: default
---
Delete a backup for a given ID.

## Synopsis

Delete a backup for a given ID.

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete backup [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help        help for backup
  -i, --id string   Identifier of the backup
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

* [oasisctl delete]()	 - Delete resources
* [oasisctl delete backup policy](oasisctl-delete-backup-policy)	 - Delete a backup policy for a given ID.

