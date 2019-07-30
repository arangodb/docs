---
layout: default
description: How to restore backups with the arangobackup tool.
title: Restore Backups in ArangoDB
---
Restore to a backup
===================

Once a backup is created, one can use the generated backup id,
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
2019-05-15T15:24:14Z [16201] INFO {backup} Server version: 3.5.1
2019-05-15T15:24:14Z [16201] INFO {backup} Successfully restored '2019-05-15T14.36.38Z_my-label'
```

Note that current ArangoSearch views are not stored in backups,
therefore, after a successful restore operation, all views have to be
dropped and recreated. This is done automatically in the background, but
the recreation of the ArangoSearch indexes can take some time, in
particular if a lot of data has to be indexed.
