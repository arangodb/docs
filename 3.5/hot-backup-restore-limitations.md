---
layout: default
description: ArangoDB hot backups impose limitations one should be absolutely aware of.
title: ArangoDB Hot Backup Limitations
---
Hot Backup Limitations
======================

ArangoDB hot backups impose limitations with respect to storage engine,
storage usage, upgrades, deployment scheme, etc. Please review the below
list of limitations closely to make sure that they don't clash with
planned deployments.

Global Scope
------------

In order to be able to create hot backups instantaneously, they are created
on file system level and thus well below any structural entity related to
databases, collections, indexes, users, etc.

Consequently, a hot backup is a backup of the entire ArangoDB single server
and cluster. In other words, one cannot restore to a older hot backup of a
single collection or database. With every restore, one restores the entire
deployment including of course the `_system` database.

It cannot be stressed enough that a restore to an earlier hot backup set will
also revert users, graphs, Foxx apps - everything - back to that at the time
of the hot backup.

### Cluster's Special Limitations

Creating hot backups can only be done while the internal structure of the
cluster remains unaltered. The background of this limitation lies in the
distributed nature and the asynchronicity of creation, alteration and
dropping of cluster databases, collections and indexes.

It must be ensured that for the hot backup no such changes are made to the
cluster's inventory, as this could lead to inconsistent backups.

Off Site Upload and Download Are Enterprise Features
----------------------------------------------------

The capability of up or down loading hot backups to and from external
storage space using ArangoDB commands and APIs is only available in the
Enterprise Edition of ArangoDB. Users of the community edition may make
manual copies of the `backup/<backupId>` directories.

Identical Minor Version
-----------------------

Hot backups sets can only be restored to an ArangoDB deployment of the same
minor version as that of the creating deployment. This explicitly implies that
every minor version upgrade of an ArangoDB instance makes hot backups created
with the previous versions of the same installation obsolete. i.e. an upgraded
3.4.7 to 3.4.8 will allow a restore to the old hot backups while one from
3.4.7 to 3.5.0 will not.

Identical Topology
------------------

Unlike backups crated with _arangodump_ and restored with _arangorestore_,
hot backups can only be restored to the same type and structure of deployment.
This means that one cannot restore a 3-node ArangoDB cluster's hot backup to
any other deployment that another 3-node ArangoDB cluster of the same version.

RocksDB Only for Now
--------------------

Hot backups rely on creation of hard links on actual RocksDB data files and
directories. The same or according file system level mechanisms are not
available to MMFiles deployments.

Storage Space
-------------

Without the creation of hot backups, RocksDB keeps compacting the file system
level files as the operation continues. Compacted files are subsequently
automatically deleted. Every hot backup, needs of course to hold on to the
files as they were at the moment of the hot backup creation, thus preventing
the deletions and consequently growing the storage space of the ArangoDB
data directory. That growth of course depends on the amount of write operations
per time.

This is a crucial factor for sustained operation and might require
significantly higher storage reservation for ArangoDB instances involved and
or the much more fine grained monitoring of storage usage than before.

Also note that in a cluster each RocksDB instance will be backed up
individually and hence the overall storage space will be the sum of all
RocksDB instances (i.e., data which is replicated between instances will
not be de-duplicated for performance reasons).

Global Transaction Lock
-----------------------

In order to be able to create consistent hot backups, it is mandatory to get
a very brief global transaction lock across the entire installation.
In single server deployments constant invocation of very long running
transactions could prevent that from every happening during a timeout period.
The same holds true for clusters, where this lock must now be obtained on all
database servers as the same time.

Especially in the cluster the result of these successively longer tries to
obtain the global transaction lock might become visible in periods of apparent
dead time. Locks might be obtained on some machines and and not on others, so
that the process has to be retried over and over. Every unsuccessful try would
then lead to the release of all partial locks.

ArangoSearch not Supported Yet
------------------------------

ArangoSearch views are not backed up and thus not restored yet.
