---
layout: default
description: How to restore backups with the arangobackup tool.
title: Restore Hot Backups in ArangoDB
---
Restore to a hot backup
=======================

Once a hot backup is created, one can use the generated backup id,
for example `2019-05-15T14.36.38Z_my-label` to restore the **entire**
instance to that "snapshot". 

{% hint 'warning' %}
Keep in mind that such a restore is a global operation and affects
**all databases** in an installation. The restore will roll back all data
including in the meantime databases, collections, indexes etc.
The database server of a single server instance and all database servers
of a cluster will subsequently be restarted.
{% endhint %}

```bash
arangobackup restore --server.username root --identifier 2019-05-15T14.36.38Z_my-label 
```

The output will reflect the restore operation's success:

```log
2019-05-15T15:24:14Z [16201] INFO {backup} Server version: 3.4.5
2019-05-15T15:24:14Z [16201] INFO {backup} Successfully restored '2019-05-15T14.36.38Z_my-label'
```
