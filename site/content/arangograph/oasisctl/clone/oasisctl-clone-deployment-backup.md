---
fileID: oasisctl-clone-deployment-backup
title: Oasisctl Clone Deployment Backup
weight: 2465
description: 
layout: default
---
Clone a deployment from a backup.

## Synopsis

Clone a deployment from a backup.

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl clone deployment backup [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --accept                   Accept the current terms and conditions.
  -b, --backup-id string         Clone a deployment from a backup using the backup's ID.
  -h, --help                     help for backup
  -o, --organization-id string   Identifier of the organization to create the clone in
  -p, --project-id string        An optional identifier of the project to create the clone in
  -r, --region-id string         An optionally defined region in which the new deployment should be created in.
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

* [oasisctl clone deployment](oasisctl-clone-deployment)	 - Clone deployment resources

