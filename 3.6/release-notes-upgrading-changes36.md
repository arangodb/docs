---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.6
---
Incompatible changes in ArangoDB 3.6
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.6, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.6:

Restricted ranges for date/time values in AQL
---------------------------------------------

ArangoDB 3.6 enforces valid date ranges for working with date/time in AQL. 
The valid date ranges for any AQL date/time function are:

- for string date/time values: `"0000-01-01T00:00:00.000Z"` (including) up to `"9999-12-31T23:59:59.999Z"` (including)
- for numeric date/time values: -62167219200000 (including) up to 253402300799999 (including). 
  These values are the numeric equivalents of `"0000-01-01T00:00:00.000Z"` and `"9999-12-31T23:59:59.999Z"`.

Any date/time values outside the given range that are passed into an AQL date
function will make the function return `null` and trigger a warning in the query,
which can optionally be escalated to an error and stop the query.

Any date/time operations that produce date/time outside the valid ranges stated
above will make the function return `null` and trigger a warning too. Example:

```js
DATE_SUBTRACT("2018-08-22T10:49:00+02:00", 100000, "years") // null
```

Startup options
---------------

The following startup options have been added in ArangoDB 3.6:

- `--cluster.force-one-shard`:

  When set to `true`, forces the cluster into creating all future collections with 
  only a single shard and using the same database server as these collections' 
  shards leader. 
  All collections created this way will be eligible for specific AQL query optimizations
  that can improve query performance and provide advanced transactional guarantees.

  Note: this option only has an effect in the *Enterprise Edition* of ArangoDB.

- `--cluster.write-concern`: default minimum number of copies of data for new 
  collections required for the collection to be considered "in sync". If a 
  collection has less in-sync copies than specified by this value, the collection 
  will turn into read-only mode until enough copies are created.
  This value is the default value for the required minimum number of copies when creating
  new collections. It can still be adjusted per collection.
  The default value for this option is `1`. The value must be smaller or equal compared 
  to the replication factor. 

- `--cluster.upgrade`: toggles the cluster upgrade mode for coordinators. It supports
  the following values:

  - `auto`: perform a cluster upgrade and shut down afterwards if the startup option
    `--database.auto-upgrade` is set to true. Otherwise, don't perform an upgrade.
  - `disable`: never perform a cluster upgrade, regardless of the value of `--database.auto-upgrade`.
  - `force`: always perform a cluster upgrade and shut down, regardless of the value of
    `--database.auto-upgrade`.
  - `online`: always perform a cluster upgrade but don't shut down afterwards

  The default value is `auto`. The option only affects coordinators. It does not have
  any affect on single servers, agents or database servers.

- `--network.idle-connection-ttl`: default time-to-live for idle cluster-internal 
  connections (in milliseconds). The default value is `60000`.

- `--network.io-threads`: number of I/O threads for cluster-internal network requests.
  The default value is `2`.

- `--network.max-open-connections`: maximum number of open network connections for
  cluster-internal requests. The default value is `1024`.

- `--network.verify-hosts`: if set to `true`, this will verify peer certificates for
  cluster-internal requests when TLS is used. The default value is `false`.

- `--rocksdb.exclusive-writes`: if set to `true` all write operations to the RocksDB
  storage engine are serialized on a per-collection level. This serialization of writes
  prevents write-write conflicts from occurring, providing the same write operation
  isolation as the MMFiles engine. As a downside, using this option will effectively
  limit the per-collection write operation concurrency to a single thread. It should
  thus be used with care, and only while porting applications from MMFiles to the
  RocksDB storage engine. 
  The option may be removed in a future ArangoDB release.

The following startup options have been augmented in ArangoDB 3.6:

- `--ssl.protocol`: in addition to the possible values supported by this option
  in ArangoDB 3.5, there is now an extra value `9` for "generic TLS" connections.
  Using this value will make the client and the server negotiate the best possible
  mutually supported TLS protocol version.

  The value `9` for "generic TLS" has also been made the default in ArangoDB 3.6.
  The option is only effective if an SSL/TLS connection is actually used. It is
  ineffective when unencrypted connections are used.

  The change affects the arangod executable and all client tools, e.g. arangosh,
  arangoimport, arangodump, arangorestore.

The following startup options have been removed in ArangoDB 3.6:

- `--vst.maxsize`: this option was used in previous versions to control the maximum 
  size (in bytes) of VelocyPack chunks when using the VelocyStream (VST) protocol.
  This is now handled automatically by the server and does not need any configuration.

HTTP API
--------

The following APIs have been added:

- Database properties API, HTTP GET `/_api/database/properties`

  The new database properties API provides the attributes `replicationFactor`, 
  `minReplicationFactor` and `sharding`. A description of these attributes can be found 
  below.

The following APIs have been expanded:

- Database creation API, HTTP POST `/_api/database`

  The database creation API now handles the `replicationFactor`, `minReplicationFactor` 
  and `sharding` attributes. All these attributes are optional, and only meaningful
  in a cluster.

  The values provided for the attributes `replicationFactor` and `minReplicationFactor` 
  will be used as default values when creating collections in that database, allowing to 
  omit these attributes when creating collections. However, the values set here are just 
  defaults for new collections in the database. The values can still be adjusted per 
  collection when creating new collections in that database via the web UI, the arangosh 
  or drivers.

  In an Enterprise Edition cluster, the `sharding` attribute can be given a value of 
  "single", which will make all new collections in that database use the same shard 
  distribution and use one shard by default. This can still be overridden by setting the 
  values of `distributeShardsLike` when creating new collections in that database via 
  the web UI, the arangosh or drivers. 
