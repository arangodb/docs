---
fileID: oasisctl-update-backup-policy
title: Oasisctl Update Backup Policy
weight: 3300
description: 
layout: default
---
Update a backup policy

## Synopsis

Update a backup policy

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl update backup policy [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --additional-region-ids strings   Add backup to the specified addition regions
  -d, --backup-policy-id string         Identifier of the backup policy
      --day-of-the-month int32          Run the backup on the specified day of the month (1-31) (default 1)
      --description string              Description of the backup
      --email-notification string       Email notification setting (Never|FailureOnly|Always)
      --every-interval-hours int32      Schedule should run with an interval of the specified hours (1-23)
      --friday                          If set, a backup will be created on Fridays. Set to false explicitly to clear the flag.
  -h, --help                            help for policy
      --hours int32                     Hours part of the time of day (0-23)
      --minutes int32                   Minutes part of the time of day (0-59)
      --minutes-offset int32            Schedule should run with specific minutes offset (0-59)
      --monday                          If set, a backup will be created on Mondays. Set to false explicitly to clear the flag.
      --name string                     Name of the deployment
      --paused                          The policy is paused. Set to false explicitly to clear the flag.
      --retention-period int            Backups created by this policy will be automatically deleted after the specified retention period. A value of 0 means that backup will never be deleted.
      --saturday                        If set, a backup will be created on Saturdays. Set to false explicitly to clear the flag.
      --schedule-type string            Schedule of the policy (Hourly|Daily|Monthly)
      --sunday                          If set, a backup will be created on Sundays. Set to false explicitly to clear the flag.
      --thursday                        If set, a backup will be created on Thursdays. Set to false explicitly to clear the flag.
      --time-zone string                The time-zone this time of day applies to (empty means UTC). Names MUST be exactly as defined in RFC-822. (default "UTC")
      --tuesday                         If set, a backup will be created on Tuesdays. Set to false explicitly to clear the flag.
      --upload                          The backup should be uploaded. Set to false explicitly to clear the flag.
      --wednesday                       If set, a backup will be created on Wednesdays. Set to false explicitly to clear the flag.
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

* [oasisctl update backup](oasisctl-update-backup)	 - Update a backup

