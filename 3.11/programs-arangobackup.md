---
layout: default
description: arangobackup is a command-line client tool to create global hot backups of an ArangoDB instance
---
# _arangobackup_ client tool

{% include hint-ee.md feature="The arangobackup tool" %}

{% hint 'tip' %}
In the Community Edition, use [_arangodump_](programs-arangodump.html) and
[_arangorestore_](programs-arangorestore.html) for
[logical backups](backup-restore.html#logical-backups).
{% endhint %}

_arangobackup_ is a command-line client tool for instantaneous and
consistent [hot backups](backup-restore.html#hot-backups) of the data and
structures stored in ArangoDB.

Hot backups rely on hard link magic performed on the database's
persistence layer.

_arangobackup_ can be used for all ArangoDB deployment modes
(Single Instance, Active Failover, Cluster). It always creates what
is most readily described as a persistence layer consistent snapshot
of the entire instance. Therefore, no such thing as database or
collection level hot backup exists. Consequently, unlike with
_arangodump_/_arangorestore_, one may only restore a hot backup set to
the same layout, for example one can only restore a single server hot backup 
to a single server instance and a 3 _DB-Server_ cluster's hot backup to a 3
_DB-Server_ instance.

Snapshots can be uploaded to or downloaded from remote repositories.

{% hint 'info' %}
Please review the
[**requirements and limitations**](backup-restore.html#hot-backup-limitations)
of hot backups, specifically regarding storage engine, deployment, scope
and storage space.
{% endhint %}
