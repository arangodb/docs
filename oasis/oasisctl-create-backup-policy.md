---
layout: default
description: Description of the oasisctl create backup policy command
title: Oasisctl Create Backup Policy
---
# Oasisctl Create Backup Policy

Create a new backup policy

## Synopsis

Create a new backup policy

```
oasisctl create backup policy [flags]
```

## Options

```
      --day-of-the-month int32       Run the backup on the specified day of the month (1-31) (default 1)
      --deployment-id string         ID of the deployment
      --description string           Description of the backup policy
      --email-notification string    Email notification setting (Never|FailureOnly|Always)
      --every-interval-hours int32   Schedule should run with an interval of the specified hours (1-23)
      --friday                       If set, a backup will be created on Fridays.
  -h, --help                         help for policy
      --hours int32                  Hours part of the time of day (0-23)
      --minutes int32                Minutes part of the time of day (0-59)
      --monday                       If set, a backup will be created on Mondays
      --name string                  Name of the deployment
      --paused                       The policy is paused
      --retention-period int         Backups created by this policy will be automatically deleted after the specified retention period. A value of 0 means that backup will never be deleted.
      --saturday                     If set, a backup will be created on Saturdays
      --schedule-type string         Schedule of the policy (Hourly|Daily|Monthly)
      --sunday                       If set, a backup will be created on Sundays
      --thursday                     If set, a backup will be created on Thursdays
      --time-zone string             The time-zone this time of day applies to (empty means UTC). Names MUST be exactly as defined in RFC-822. (default "UTC")
      --tuesday                      If set, a backup will be created on Tuesdays
      --upload                       The backup should be uploaded
      --wednesday                    If set, a backup will be created on Wednesdays
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl create backup](oasisctl-create-backup.html)	 - Create backup ...

