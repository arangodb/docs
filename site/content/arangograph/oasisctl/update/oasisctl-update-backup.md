---
fileID: oasisctl-update-backup
title: Oasisctl Update Backup
weight: 3295
description: 
layout: default
---
Update a backup

## Synopsis

Update a backup

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl update backup [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --auto-deleted-at int   Time (h) until auto delete of the backup
  -d, --backup-id string      Identifier of the backup
      --description string    Description of the backup
  -h, --help                  help for backup
      --name string           Name of the backup
      --upload                The backups should be uploaded
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
* [oasisctl update backup policy](oasisctl-update-backup-policy)	 - Update a backup policy

