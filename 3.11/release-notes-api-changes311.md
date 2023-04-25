---
layout: default
description: ArangoDB v3.11 Release Notes API Changes
---
API Changes in ArangoDB 3.11
============================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.11.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.11.

## HTTP RESTful API

### Behavior changes

#### Extended naming constraints for collections, Views, and indexes

In ArangoDB 3.9, the `--database.extended-names-databases` startup option was
added to optionally allow database names to contain most UTF-8 characters.
The startup option has been renamed to `--database.extended-names` in 3.11 and
now controls whether you want to use the extended naming constraints for
database, collection, View, and index names.

The feature is disabled by default to ensure compatibility with existing client
drivers and applications that only support ASCII names according to the
traditional naming constraints used in previous ArangoDB versions.

If the feature is enabled, then any endpoints that contain database, collection,
View, or index names in the URL may contain special characters that were
previously not allowed (percent-encoded). They are also to be expected in
payloads that contain database, collection, View, or index names, as well as
document identifiers (because they are comprised of the collection name and the
document key). If client applications assemble URLs with extended names
programmatically, they need to ensure that extended names are properly
URL-encoded.

When using extended names, any Unicode characters in names need to be 
[NFC-normalized](http://unicode.org/reports/tr15/#Norm_Forms). Trying to
create a database, collection, View or index with a non-NFC-normalized
name will be rejected by the server.

The ArangoDB web interface as well as the _arangobench_, _arangodump_,
_arangoexport_, _arangoimport_, _arangorestore_, and _arangosh_ client tools
ship with support for the extended naming constraints, but they require the
user to provide NFC-normalized names.

Please be aware that dumps containing extended names cannot be restored
into older versions that only support the traditional naming constraints. In a
cluster setup, it is required to use the same naming constraints for all
Coordinators and DB-Servers of the cluster. Otherwise, the startup is
refused. In DC2DC setups, it is also required to use the same naming
constraints for both datacenters to avoid incompatibilities.

Also see:
- [Collection names](data-modeling-collections.html#collection-names)
- [View names](data-modeling-views.html#view-names)
- Index names have the same character restrictions as collection names

#### Status code if write concern not fulfilled

The new `--cluster.failed-write-concern-status-code` startup option can be used
to change the default `403` status code to `503` when the write concern cannot
be fulfilled for a write operation to a collection in a cluster deployment.
This signals client applications that it is a temporary error. Only the
HTTP status code changes in this case, no automatic retry of the operation is
attempted by the cluster.

#### Graph API (Gharial)

The `POST /_api/gharial/` endpoint for creating named graphs validates the
`satellites` property of the graph `options` for SmartGraphs differently now.

If the `satellites` property is set, it must be an array, either empty or with
one or more collection name strings. If the value is not in that format, the
error "Missing array for field `satellites`" is now returned, for example, if
it is a string or a `null` value. Previously, it returned "invalid parameter type".
If the graph is not a SmartGraph, the `satellites` property is ignored unless its
value is an array but its elements are not strings, in which case the error 
"Invalid parameter type" is returned.

#### Document API

The following endpoints support a new `refillIndexCaches` query
parameter to repopulate the index caches after requests that insert, update,
replace, or remove single or multiple documents (including edges) if this
affects an edge index or cache-enabled persistent indexes:

- `POST /_api/document/{collection}`
- `PATCH /_api/document/{collection}/{key}`
- `PUT /_api/document/{collection}/{key}`
- `DELETE /_api/document/{collection}/{key}`

It is a boolean option and the default is `false`.

This also applies to the `INSERT`, `UPDATE`, `REPLACE`, and `REMOVE` operations
in AQL queries, which support a `refillIndexCache` option, too.

In 3.9 and 3.10, `refillIndexCaches` was experimental and limited to edge caches.

#### Collection API

The edge collections of EnterpriseGraphs and SmartGraphs (including
Disjoint SmartGraphs and SmartGraphs using SatelliteCollections but excluding
the edge collections of the SatelliteCollections) previously reported a
value of `0` as the `numberOfShards`. They now return the actual number of
shards. This value can be higher than the configured `numberOfShards` value of
the graph due to internally used hidden collections.

#### Log API

Setting the log level for the `graphs` log topic to `TRACE` now logs detailed
information about AQL graph traversals and (shortest) path searches.
Some new log messages are also logged for the `DEBUG` level.

#### Disabled Foxx APIs

<small>Introduced in: v3.10.5</small>

A `--foxx.enable` startup option has been added to _arangod_. It defaults to `true`.
If the option is set to `false`, access to Foxx services is forbidden and is
responded with an HTTP `403 Forbidden` error. Access to the management APIs for
Foxx services are also disabled as if `--foxx.api false` is set manually.

#### Configurable whitespace in metrics

<small>Introduced in: v3.10.6</small>

The output format of the `/_admin/metrics` and `/_admin/metrics/v2` endpoints
slightly changes for metrics with labels. By default, the metric label and value
are separated by a space for improved compatibility with some tools. This is
controlled by the new `--server.ensure-whitespace-metrics-format` startup option,
which is enabled by default from v3.10.6 onward. Example:

Enabled:

```
arangodb_agency_cache_callback_number{role="SINGLE"} 0
```

Disabled:

```
arangodb_agency_cache_callback_number{role="SINGLE"}0
```

### Privilege changes



### Endpoint return value changes

- Changed the encoding of revision IDs returned by the below listed REST APIs.

  <small>Introduced in: v3.8.8, v3.9.4, v3.10.1</small>

  - `GET /_api/collection/<collection-name>/revision`: The revision ID was
    previously returned as numeric value, and now it is returned as
    a string value with either numeric encoding or HLC-encoding inside.
  - `GET /_api/collection/<collection-name>/checksum`: The revision ID in
    the `revision` attribute was previously encoded as a numeric value
    in single server, and as a string in cluster. This is now unified so
    that the `revision` attribute always contains a string value with
    either numeric encoding or HLC-encoding inside.

### Endpoints added

#### Maintenance mode for DB-Servers

<small>Introduced in: v3.10.1</small>

For rolling upgrades or rolling restarts, DB-Servers can now be put into
maintenance mode, so that no attempts are made to re-distribute the data in a
cluster for such planned events. DB-Servers in maintenance mode are not
considered viable failover targets because they are likely restarted soon.

To query the maintenance status of a DB-Server, use this new endpoint:

`GET /_admin/cluster/maintenance/<DB-Server-ID>`

An example reply of a DB-Server that is in maintenance mode:

```json
{
  "error": false,
  "code": 200,
  "result": {
    "Mode": "maintenance",
    "Until": "2022-10-26T06:14:23Z"
  }
}
```

If the DB-Server is not in maintenance mode, then the `result` attribute is
omitted:

```json
{
  "error": false,
  "code": 200,
}
```

To put a DB-Server into maintenance mode, use this new endpoint:

`PUT /_admin/cluster/maintenance/<DB-Server-ID>`

The payload of the request needs to be as follows, with the `timeout` in seconds:

```json
{
  "mode": "maintenance",
  "timeout": 360
}
```

To turn the maintenance mode off, set `mode` to `"normal"` instead, and omit the
`timeout` attribute or set it to `0`.

You can send another request when the DB-Server is already in maintenance mode
to extend the timeout.

The maintenance mode ends automatically after the defined timeout.

Also see the [HTTP interface for cluster maintenance](http/cluster.html#query-the-maintenance-status-of-a-db-server).

### Endpoints augmented

#### Cursor API

- The `POST /_api/cursor` and `POST /_api/cursor/{cursor-identifier}` endpoints
  can now return an additional statistics value in the `stats` sub-attribute,
  `intermediateCommits`. It is the total number of intermediate commits the
  query has performed. This number can only be greater than zero for
  data modification queries that perform modifications beyond the
  `--rocksdb.intermediate-commit-count` or `--rocksdb.intermediate-commit-size`
  thresholds. In clusters, the intermediate commits are tracked per DB-Server
  that participates in the query and are summed up in the end.

- The `/_api/cursor` endpoint accepts a new `allowRetry` attribute in the
  `options` object. Set this option to `true` to make it possible to retry
  fetching the latest batch from a cursor.

  If retrieving a result batch fails because of a connection issue, you can ask
  for that batch again using the new `POST /_api/cursor/<cursor-id>/<batch-id>`
  endpoint. The first batch has an ID of `1` and the value is incremented by 1
  with every batch. Every result response except the last one also includes a
  `nextBatchId` attribute, indicating the ID of the batch after the current.
  You can remember and use this batch ID should retrieving the next batch fail.
  Calling the new endpoint does not advance the cursor.

  You can only request the latest batch again (or the next batch).
  Earlier batches are not kept on the server-side.

  You can also call this endpoint with the next batch identifier, i.e. the value
  returned in the `nextBatchId` attribute of a previous request. This advances the
  cursor and returns the results of the next batch. This is only supported if there
  are more results in the cursor (i.e. `hasMore` is `true` in the latest batch).

  To allow refetching of the very last batch of the query, the server cannot
  automatically delete the cursor. After the first attempt of fetching the last
  batch, the server would normally delete the cursor to free up resources. As you
  might need to reattempt the fetch, it needs to keep the final batch when the
  `allowRetry` option is enabled. Once you successfully received the last batch,
  you should call the `DELETE /_api/cursor/<cursor-id>` endpoint so that the
  server doesn't unnecessary keep the batch until the cursor times out
  (`ttl` query option).

#### Restriction of indexable fields

It is now forbidden to create indexes that cover fields whose attribute names
start or end with `:` , for example, `fields: ["value:"]`. This notation is
reserved for internal use.

Existing indexes are not affected but you cannot create new indexes with a
preceding or trailing colon using the `POST /_api/index` endpoint.

#### Analyzer types

The `/_api/analyzer` endpoint supports a new Analyzer type in the
Enterprise Edition:

- [`geo_s2`](analyzers.html#geo_s2) (introduced in v3.10.5):
  Like the existing `geojson` Analyzer, but with an additional `format` property
  that can be set to `"latLngDouble"` (default), `"latLngInt"`, or `"s2Point"`.

#### Query API

The [`GET /_api/query/current`](http/aql-query.html#returns-the-currently-running-aql-queries)
and [`GET /_api/query/slow`](http/aql-query.html#returns-the-list-of-slow-aql-queries)
endpoints include a new numeric `peakMemoryUsage` attribute.

#### View API

Views of type `arangosearch` accept a new `optimizeTopK` View property for the
ArangoSearch WAND optimization. It is an immutable array of strings, optional,
and defaults to `[]`.

See the [`optimizeTopK` View property](arangosearch-views.html#view-properties)
for details.

---

Views of the type `arangosearch` support new caching options in the
Enterprise Edition.

<small>Introduced in: v3.9.5, v3.10.2</small>

- A `cache` option for individual View links or fields (boolean, default: `false`).
- A `cache` option in the definition of a `storedValues` View property
  (boolean, immutable, default: `false`).

<small>Introduced in: v3.9.6, v3.10.2</small>

- A `primarySortCache` View property (boolean, immutable, default: `false`).
- A `primaryKeyCache` View property (boolean, immutable, default: `false`).

The `POST /_api/view` endpoint accepts these new options for `arangosearch`
Views, the `GET /_api/view/<view-name>/properties` endpoint may return these
options, and you can change the `cache` View link/field property with the
`PUT /_api/view/<view-name>/properties` and `PATCH /_api/view/<view-name>/properties`
endpoints.

<small>Introduced in: v3.10.3</small>

You may use a shorthand notations on `arangosearch` View creation or the
`storedValues` option, like `["attr1", "attr2"]`, instead of using an array of
objects.

See the [`arangosearch` Views Reference](arangosearch-views.html#link-properties)
for details.

#### Index API

Indexes of type `inverted` accept a new `optimizeTopK` property for the
ArangoSearch WAND optimization. It is an array of strings, optional, and
defaults to `[]`.

See the [inverted index `optimizeTopK` property](http/indexes-inverted.html)
for details.

#### Pregel API

Four new endpoints have been added to the Pregel HTTP interface for the new
persisted execution statistics for Pregel jobs:

- `GET /_api/control_pregel/history/{id}` to retrieve the persisted execution
  statistics of a specific Pregel job
- `GET /_api/control_pregel/history` to retrieve the persisted execution
  statistics of all currently active and past Pregel jobs
- `DELETE /_api/control_pregel/history/{id}` to delete the persisted execution
  statistics of a specific Pregel job
- `DELETE /_api/control_pregel/history` to delete the persisted execution
  statistics of all Pregel jobs

See [Pregel HTTP API](http/pregel.html) for details.

#### Explain API

<small>Introduced in: v3.10.4</small>

The `POST /_api/explain` endpoint for explaining AQL queries includes the
following two new statistics in the `stats` attribute of the response now:

- `peakMemoryUsage` (number): The maximum memory usage of the query during
  explain (in bytes)
- `executionTime` (number): The (wall-clock) time in seconds needed to explain
  the query.

#### Metrics API

<small>Introduced in: v3.8.9, v3.9.6, v3.10.2</small>

The metrics endpoints include the following new traffic accounting metrics:

- `arangodb_client_user_connection_statistics_bytes_received`
- `arangodb_client_user_connection_statistics_bytes_sent`
- `arangodb_http1_connections_total`

---

<small>Introduced in: v3.9.6, v3.10.2</small>

The metrics endpoints include the following new edge cache (re-)filling metrics:

- `rocksdb_cache_auto_refill_loaded_total`
- `rocksdb_cache_auto_refill_dropped_total`
- `rocksdb_cache_full_index_refills_total`

---

<small>Introduced in: v3.9.10, v3.10.5</small>

The following metrics for write-ahead log (WAL) file tracking have been added:

| Label | Description |
|:------|:------------|
| `rocksdb_live_wal_files` | Number of live RocksDB WAL files. |
| `rocksdb_wal_released_tick_flush` | Lower bound sequence number from which WAL files need to be kept because of external flushing needs. |
| `rocksdb_wal_released_tick_replication` | Lower bound sequence number from which WAL files need to be kept because of replication. |
| `arangodb_flush_subscriptions` | Number of currently active flush subscriptions. |

---

The following metric for the number of replication clients for a server has
been added:

<small>Introduced in: v3.10.5</small>

| Label | Description |
|:------|:------------|
| `arangodb_replication_clients` | Number of currently connected/active replication clients. |

#### Log level API

<small>Introduced in: v3.10.2</small>

The `GET /_admin/log/level` and `PUT /_admin/log/level` endpoints support a new
query parameter `serverId`, to forward log level get and set requests to a
specific server. This makes it easier to adjust the log levels in clusters
because DB-Servers require JWT authentication whereas Coordinators also support
authentication using usernames and passwords.

#### Explain API

<small>Introduced in: v3.10.4</small>

The `POST /_api/explain` endpoint for explaining AQL queries includes the
following two new statistics in the `stats` attribute of the response now:

- `peakMemoryUsage` (number): The maximum memory usage of the query during
  explain (in bytes)
- `executionTime` (number): The (wall-clock) time in seconds needed to explain
  the query.

### Endpoints moved



### Endpoints deprecated



### Endpoints removed



## JavaScript API

### Index methods

Calling `collection.dropIndex(...)` or `db._dropIndex(...)` now raises an error
if the specified index does not exist or cannot be dropped (for example, because
it is a primary index or edge index). The methods previously returned `false`.
In case of success, they still return `true`.

You can wrap calls to these methods with a `try { ... }` block to catch errors,
for example, in _arangosh_ or in Foxx services.

### Pregel module

Two new methods have been added to the `@arangodb/pregel` module:

- `history(...)` to get the persisted execution statistics of a specific or all
  algorithm executions
- `removeHistory(...)` to delete the persisted execution statistics of a
  specific or all algorithm executions

```js
var pregel = require("@arangodb/pregel");
const execution = pregel.start("sssp", "demograph", { source: "vertices/V" });
const historyStatus = pregel.history(execution);
pregel.removeHistory();
```

See [Distributed Iterative Graph Processing (Pregel)](graphs-pregel.html#get-persisted-execution-statistics)
for details.

### Deprecations

The `collection.iterate()` method is deprecated from v3.11.0 onwards and will be
removed in a future version.
