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

Note that this applies in particular in the case that a certain user
might have admin access for the `_system` database, but explicitly has
no access to certain collections. The backup will still extend across
**all** collections!

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

Identical Minor Version
-----------------------

Hot backups sets can only be restored to an ArangoDB deployment of the same
minor version as that of the creating deployment. This explicitly implies that
every minor version upgrade of an ArangoDB instance makes hot backups created
with the previous versions of the same installation obsolete. For example,
an upgraded 3.4.7 to 3.4.8 will allow a restore to the old hot backups while
one from 3.4.7 to 3.5.1 will not.

Identical Topology
------------------

Unlike dumps created with [_arangodump_](backup-restore.html) and restored 
with [_arangorestore_](backup-restore.html),
hot backups can only be restored to the same type and structure of deployment.
This means that one cannot restore a 3-node ArangoDB cluster's hot backup to
any other deployment than another 3-node ArangoDB cluster of the same version.

RocksDB Storage Engine Only
---------------------------

Hot backups rely on creation of hard links on actual RocksDB data files and
directories. The same or according file system level mechanisms are not
available to MMFiles deployments.

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
database servers at the same time.

Especially in the cluster the result of these successively longer tries to
obtain the global transaction lock might become visible in periods of apparent
dead time. Locks might be obtained on some machines and and not on others, so
that the process has to be retried over and over. Every unsuccessful try would
then lead to the release of all partial locks.

ArangoSearch not Supported Yet
------------------------------

ArangoSearch views are not backed up and thus not restored yet.
Therefore, views have to be dropped and recreated after a restore.
This happens automatically in the background, but in particular in the
presence of large amounts of data, the recreation of the ArangoSearch
indexes can take some time after the restore. It is planned to rectify
this limitation in one of the next releases.

Note furthermore that a running query with views can prevent a restore
operation from happening whilst the query is running.

Windows not Supported Yet
-------------------------

The hot backup feature is not supported in the Windows version of ArangoDB
at this point in time.

Services on Single Server
-------------------------

On a single server the installed Foxx microservices are not backed up and are
therefore also not restored. This is because in single server mode
the service installation is done locally in the file system and does not
track the information in the `_apps` collection.

In a cluster, the coordinators will after a restore eventually restore
the state of the services from the `_apps` collection.

Encryption at Rest
------------------

Currently, the hot backup simply takes a snapshot of the database files.
If one is using encryption at rest, then the backed up files will be
encrypted, with the encryption key that was used in the
instance which created the backup.

Such an encrypted backup can only be restored to an instance using the
same encryption key.

Replication and Hot Backup
--------------------------

Hot backups are not automatically replicated between instances. This is
true for both the Active Failover setup with 2 (or more) single servers
and for the Datacenter to Datacenter Replication between clusters.
Simply take hot backups on all instances.
