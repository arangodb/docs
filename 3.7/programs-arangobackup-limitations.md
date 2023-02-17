---
layout: default
description: Hot Backups impose limitations one should be aware of.
title: ArangoDB Hot Backup Limitations
---
Hot Backup Limitations
======================

ArangoDB hot backups impose limitations with respect to storage engine,
storage usage, upgrades, deployment scheme, etc. Please review the below
list of limitations closely to conclude which operations it might or might
not be suited for.

Global Scope
------------

In order to be able to create hot backups instantaneously, they are created
on the file system level and thus well below any structural entity related to
databases, collections, indexes, users, etc.

As a consequence, a hot backup is a backup of the entire ArangoDB single server
or cluster. In other words, one cannot restore to an older hot backup of a
single collection or database. With every restore, one restores the entire
deployment including of course the `_system` database.

It cannot be stressed enough that a restore to an earlier hot backup
snapshot will also revert users, graphs, Foxx apps - everything -
back to that at the time of the hot backup.

### Cluster's Special Limitations

Creating hot backups can only be done while the internal structure of the
cluster remains unaltered. The background of this limitation lies in the
distributed nature and the asynchronicity of creation, alteration and
dropping of cluster databases, collections and indexes.

It must be ensured that for the hot backup no such changes are made to the
cluster's inventory, as this could lead to inconsistent hot backups.

### Active Failover Special Limitations

When restoring hot backups in Active Failover setups, it is necessary to
prevent that a non-restored follower becomes leader by temporarily setting
the maintenance mode:

1. `curl -X PUT <endpoint>/_admin/cluster/maintenance -d'"on"'`
2. Restore the Hot Backup
3. `curl -X PUT <endpoint>/_admin/cluster/maintenance -d'"off"'`

Substitute `<endpoint>` with the actual endpoint of the **leader**
single server instance.

Restoring from a different Version
----------------------------------

Hot backups share the same limitations with respect to different versions
as ArangoDB itself. This means that a hot backup created with some version
`a.b.c` can without any limitations be restored on any version `a.b.d` with
`d` not equal to `c`, that is, the patch level can be changed arbitrarily.
With respect to minor versions (second number, `b`), one can only upgrade
and **not downgrade**. That is, a hot backup created with a version `a.b.c`
can be restored on a version `a.d.e` for `d` greater than `b` but not for `d`
less than `b`. At this stage, we do not guarantee any compatibility between
versions with a different major version number (first number).

Identical Topology
------------------

Unlike dumps created with [_arangodump_](backup-restore.html) and restored 
with [_arangorestore_](backup-restore.html),
hot backups can only be restored to the same type and structure of deployment.
This means that one cannot restore a 3-node ArangoDB cluster's hot backup to
any other deployment than another 3-node ArangoDB cluster of the same version.


Storage Space
-------------

Without the creation of hot backups, RocksDB keeps compacting the file system
level files as the operation continues. Compacted files are subsequently
deleted automatically. Every hot backup needs to hold on to the
files as they were at the moment of the hot backup creation, thus preventing
the deletions and consequently growing the storage space of the ArangoDB
data directory. That growth of course depends on the amount of write operations
per time.

This is a crucial factor for sustained operation and might require
significantly higher storage reservation for ArangoDB instances involved and
a much more fine grained monitoring of storage usage than before.

Also note that in a cluster each RocksDB instance will be backed up
individually and hence the overall storage space will be the sum of all
RocksDB instances (i.e., data which is replicated between instances will
not be de-duplicated for performance reasons).

Global Transaction Lock
-----------------------

In order to be able to create consistent hot backups, it is mandatory to get
a very brief global transaction lock across the entire installation.
In single server deployments constant invocation of very long running
transactions could prevent that from ever happening during a timeout period.
The same holds true for clusters, where this lock must now be obtained on all
DB-Servers at the same time.

Especially in the cluster the result of these successively longer tries to
obtain the global transaction lock might become visible in periods of apparent
dead time. Locks might be obtained on some machines and and not on others, so
that the process has to be retried over and over. Every unsuccessful try would
then lead to the release of all partial locks.

At this stage, index creation constitutes a write transactions, which means
that during index creation one cannot create a hot backup. We intend to lift
this limitation in a future version.
