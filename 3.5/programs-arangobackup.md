---
layout: default
description: arangobackup is a command-line client tool to create a global backups of an ArangoDB instance
title: Arangobackup Client Tool
---
Arangobackup
============

_Arangobackup_ is a command-line client tool which creates global
[backups](hot-backup-restore.html) of the data and structures
stored in ArangoDB.

Backups rely on hard link magic performed on the database's
persistence layer.

_Arangobackup_ can be used for all ArangoDB deployments modes
(Single Instance, Active Failover, Cluster). It always creates what
is most readily described as a persistence layer consistent snapshot
of the entire instance. Therefore, no such thing as database or
collection level backup exists. Consequently, unlike with
_arangodump_/_arangorestore_, one may only restore a backup set to
the same layout. One can only restore a single server backup to a
single server instance and a 3 _DBServer_ cluster's backup to a 3
_DBServer_ instance.

If you are using the Enterprise Edition, snapshots can be uploaded to
or downloaded from remote S3 mount points.
