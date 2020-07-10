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
RocksDB storage engine using ArangoDB 3.6 (or earlier versions) in order to upgrade 
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

AQL
---

The memory usage reported by AQL queries may now be slightly higher in 3.7 than in
previous versions of ArangoDB. This is not due to queries using more memory in 3.7, 
but due to a change in the memory accounting code, which is slightly more accurate
now.

For cluster AQL queries the memory usage now is now tracked on a per-server basis
and not on a per-shard basis as in previous versions of ArangoDB.
These changes can affect queries that set a memory limit via the query options
or are employing a global limit via the `--query.memory-limit` option. It may be
required to raise the configured memory limit value in either client applications 
or the ArangoDB configuration to take these changes into account.

The number of HTTP requests reported for cluster AQL queries now also includes the
requests for deploying the queries to the database servers. These requests weren't
tracked in previous versions of ArangoDB.

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

Requests statistics
-------------------

Previous versions of ArangoDB excluded all requests made to the web interface at
`/_admin/aardvark` from the requests statistics if the request was made for the
`_system` database. Requests for all other endpoints or requests to the same
endpoint for any non-system database were already counted.
ArangoDB 3.7 now treats all incoming requests to the web interface in the same
way as requests to other endpoints, so the request counters may show higher
values in 3.7 than before in case the web interface was used a lot on the
`_system` database.

This change in behavior was also backported to ArangoDB v3.6.5.

Client tools
------------

_arangodump_ and _arangorestore_ will now fail when using the `--collection` 
option and none of the specified collections actually exist in the database (on dump) 
or in the dump to restore (on restore). In case only some of the specified collections 
exist, _arangodump_ / _arangorestore_ will issue warnings about the invalid collections, 
but will continue to work for the valid collections.

Metrics
-------

The following existing metrics for monitoring that are exposed via the HTTP
REST endpoint `/_admin/metrics` have been renamed in ArangoDB 3.7:

- `agency_agent_read_no_leader`
- `agency_agent_read_ok`
- `agency_agent_write_hist`
- `agency_agent_write_no_leader`
- `agency_agent_write_ok`

The new names are:

- `arangodb_agency_agent_read_no_leader`
- `arangodb_agency_agent_read_ok`
- `arangodb_agency_agent_write_hist`
- `arangodb_agency_agent_write_no_leader`
- `arangodb_agency_agent_write_ok`

This change was made to put the metrics into the "arangodb" namespace, so
that metrics from different systems can unambiguously combined into a single
monitoring system.

HTTP RESTful API
----------------

### Privilege changes

The access privileges for the REST API endpoint at `/_admin/cluster/numberOfServers`
can now be controlled via the `--server.harden` startup option. The behavior is
as follows:

- for HTTP GET requests, all authenticated users can access the API if `--server.harden`
  is `false` (which is the default).
- for HTTP GET requests, only admin users can access the API if `--server.harden`
  is `true`. This is a change compared to previous versions.
- for HTTP PUT requests, only admin users can access the API, regardless of the value
  of `--server.harden`.

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

The REST API endpoint at `/_api/collection/<collection>/rotate` has been removed 
in ArangoDB 3.7. This endpoint was previously only available for the MMFiles
storage engine, but not for the RocksDB storage engine.

JavaScript API
--------------

The `rotate` function has been removed on the ArangoCollection object. This 
means the following JavaScript code will not work in ArangoDB 3.7, neither in
the ArangoShell nor in arangod (when using Foxx):

```js
db.<collection>.rotate();
```

The `rotate` function was previously only supported for the MMFiles storage 
engine, but not for the RocksDB storage engine.

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
`--rocksdb.block-cache-size` are now:

- 512MiB for systems with between 2 and 4GiB of RAM.
- 256MiB for systems with between 1 and 2GiB of RAM.
- 128MiB for systems with less than 1GiB of RAM.

For systems with less than 4GiB of RAM, the default values for 
`--rocksdb.total-write-buffer-size` are now:

- 512MiB for systems with between 1 and 4GiB of RAM.
- 256MiB for systems with less than 1GiB of RAM.
