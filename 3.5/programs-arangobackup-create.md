---
layout: default
description: How to create a consistent snapshot with the arangobackup tool.
title: Create Backups with ArangoDB
---
Create Backup
=============

Backups are created near instantaneously. The single server as
well as other deployment modes try to obtain a global write transaction lock
to enforce consistency across all servers, databases, collections
etc. Backups still require no Data Definition operations (e.g., create database, create collection) to be active at the time of backup, please review the [requirements and limitations](hot-backup-restore-limitations.html) for more details.

Once that lock could be acquired the backup itself is most
readily described as a consistent snapshot on the local file system.

```bash
arangobackup create --server.endpoint tcp://myserver:8529 --label my-label 
```

The above will create a backup with a unique identifier consisting
of the UTC time according to the local computer clock output and the
specified label and report the success like below.

```
2019-05-15T13:57:11Z [15213] INFO {backup} Server version: 3.5.1
2019-05-15T14:20:16Z [15397] INFO {backup} Backup succeeded. Generated identifier '2019-05-15T14.20.15Z_my-label'
```

{% hint 'tip' %}
If the `label` marker is omitted then a unique identifier string is
generated instead.
{% endhint %}

There are two more options for the cluster mode regarding the
acquisition of the global write transaction lock. One is that one can
configure how long the system tries to get the global write transaction
lock before it reports failure. This is the `--max-wait-for-lock`
option. Its value must be a number in seconds and the default is 120
seconds. The second is the `--force` option, whose default is `false`.
If set to `false`, the operation is considered to have failed if the
maximal waiting time for the lock is exceeded. If `--force` is set to
`true`, the system will take a potentially non-consistent backup when
the timeout is exceeded.
