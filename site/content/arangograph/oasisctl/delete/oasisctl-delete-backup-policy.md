---
fileID: oasisctl-delete-backup-policy
title: Oasisctl Delete Backup Policy
weight: 2700
description: 
layout: default
---
Delete a backup policy for a given ID.

## Synopsis

Delete a backup policy for a given ID.

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete backup policy [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for policy
  -i, --id string                Identifier of the backup policy
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

* [oasisctl delete backup](oasisctl-delete-backup)	 - Delete a backup for a given ID.

