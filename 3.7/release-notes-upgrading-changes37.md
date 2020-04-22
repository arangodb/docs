---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.7
---
Incompatible changes in ArangoDB 3.7
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.7, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.7:

MMFiles storage engine
----------------------

This version of ArangoDB does not contain the MMFiles storage engine anymore. In
ArangoDB 3.7, the only available storage engine is the RocksDB storage engine,
which is the default storage engine in ArangoDB since version 3.4. The MMFiles 
storage engine had been deprecated since the release of ArangoDB 3.6.

Any deployments that use the MMFiles storage engine will need to migrate to the
RocksDB storage engine using ArangoDB 3.6 (or earler versions) in order to upgrade 
to ArangoDB 3.7.

All storage engine selection functionality has also been removed from the ArangoDB 
package installers. The RocksDB storage engine will be selected automatically for 
any new deployments created with ArangoDB 3.7.

A side effect of this change is that any MMFiles-specific startup options lose 
their functionality in 3.7. This affects all startup options starting with `--wal.`,
which could be used in earlier versions of ArangoDB to configure the write-ahead
log of the MMFiles storage engine. Another option that is now non-functional is
the MMFiles-specific `--database.journal-size` startup option, which previously
controlled the size of journal files for the MMFiles engine. 
Using these options in ArangoDB 3.7 is not an error, meaning that the server can 
still be started if any of these options are specified. Nevertheless using these
options does not have any effect.

ArangoSearch
------------

The stemming library Snowball was updated, bringing a breaking change to Analyzers:

There is a 33rd letter in the Russian alphabet, `ё` (`e"`), but it is rarely used
and often replaced by `е` in informal writing. The original algorithm assumed it
had already been mapped to `е` (`e`), but now it actively translates this character
if the locale is set to Russian language.

UTF-8 validation
----------------

The ArangoDB server will now perform more strict UTF-8 string validation for
incoming JSON and VelocyPack data. Attribute names or string attribute values
with incorrectly encoded UTF-8 sequences will be rejected by default, and
incoming requests containing such invalid data will be responded to with errors
by default.

In case an ArangoDB deployment already contains UTF-8 data from previous
versions, this will be a breaking change. For this case, there is the startup
option `--server.validate-utf8-strings` which can be set to `false` in order to
ensure operability until any invalid UTF-8 string data has been fixed.

HTTP RESTful API
----------------

### Endpoints moved

The following existing REST APIs have moved in ArangoDB 3.7 to improve API
naming consistency:

- the endpoint at `/_admin/clusterNodeVersion` is now merely redirecting requests
  to the `/_admin/cluster/nodeVersion` endpoint. The new endpoint will handle
  incoming requests in the same way the old endpoint did.
- the endpoint at `/_admin/clusterNodeEngine` is now merely redirecting requests
  to the endpoint `/_admin/cluster/nodeEngine`. The new endpoint will handle
  incoming requests in the same way the old endpoint did.
- the endpoint at `/_admin/clusterNodeStats` is now merely redirecting requests
  to the endpoint `/_admin/cluster/nodeStatistics`. The new endpoint will handle
  incoming requests in the same way the old endpoint did.
- the endpoint at `/_admin/clusterStatistics` is now merely redirecting requests
  to the endpoint `/_admin/cluster/statistics`. The new endpoint will handle
  incoming requests in the same way the old endpoint did.

The above endpoints are part of ArangoDB's exposed REST API, however, they are
not supposed to be called directly by drivers or client

### Endpoints removed

The REST API endpoint at `/_admin/aql/reload` has been removed in ArangoDB 3.7.
There is no necessity to call this endpoint from a driver or a client application
directly.

DC2DC
-----

The replication in DC2DC deployments relies on a message queue and ArangoSync
supported two different message queue systems up to and including version
0.7.2. **Support for Kafka is dropped in ArangoSync v1.0.0** and the built-in
DirectMQ remains as sole message queue system.

If you rely on Kafka, then you must use an ArangoSync 0.x version. ArangoDB
v3.7 ships with ArangoSync 1.x, so be sure to keep the old binary or download
a compatible version for your deployment. ArangoSync 1.x is otherwise
compatible with ArangoDB v3.3 and above.

Startup options
---------------

The default values for the startup options `--rocksdb.block-cache-size` and
`--rocksdb.total-write-buffer-size` have been decreased for systems with less
than 4GiB of RAM. The intention is to make arangod use less memory on very
small systems.

For systems with less than 4GiB of RAM, the default values for 
`--rocksdb.block-cache-size``are now:

* 512MiB for systems with between 2 and 4GiB of RAM.
* 256MiB for systems with between 1 and 2GiB of RAM.
* 128MiB for systems with less than 1GiB of RAM.

For systems with less than 4GiB of RAM, the default values for 
`--rocksdb.total-write-buffer-size``are now:

* 512MiB for systems with between 1 and 4GiB of RAM.
* 256MiB for systems with less than 1GiB of RAM.
