---
layout: default
description: How to create a consistent snapshot with the arangobackup tool.
title: Create Hot Backups with ArangoDB
---
Create Hot Backup
=================

Hot backups are created near instantaneously. The single server as
well as other deployment modes try to obtain a global transaction lock
to enforce consistency across all servers, databases, collections
etc. Hot backups still require no Data Definition operations (e.g., create database, create collection) to be active at the time of backup, please review the [requirements and limitations](hot-backup-restore-limitations.html) for more details.

Once that lock could be acquired the backup itself is most
readily described as a consistent snapshot and as instantaneous as the
quickest operation on the local file system.

```bash
arangobackup create --server.endpoint tcp://myserver:8529 --label my-label 
```

The above will create a hot backup with a unique identifier consisting
of the UTC time according to the local computer clock output and the
specified label and report the success like below.

```
2019-05-15T13:57:11Z [15213] INFO {backup} Server version: 3.4.5
2019-05-15T14:20:16Z [15397] INFO {backup} Backup succeeded. Generated identifier '2019-05-15T14.20.15Z_my-label'
```

{% hint 'tip' %}
If the `label` marker is omitted then a unique identifier string is
generated instead.
{% endhint %}
