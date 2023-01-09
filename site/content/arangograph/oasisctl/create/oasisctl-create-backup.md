---
fileID: oasisctl-create-backup
title: Oasisctl Create Backup
weight: 2490
description: 
layout: default
---
Create backup ...

## Synopsis

Create backup ...

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl create backup [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --auto-deleted-at int    Time (h) until auto delete of the backup
      --deployment-id string   ID of the deployment
      --description string     Description of the backup
  -h, --help                   help for backup
      --name string            Name of the deployment
      --upload                 The backup should be uploaded
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

* [oasisctl create]()	 - Create resources
* [oasisctl create backup policy](oasisctl-create-backup-policy)	 - Create a new backup policy

