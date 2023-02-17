---
layout: default
description: Features listed in this section should no longer be used, because they are considered obsolete and may get removed in a future release
title: Deprecated Features
redirect_from:
  - appendix-deprecated-simple-queries.html # 3.8 -> 3.8
  - appendix-deprecated-simple-queries-pagination.html # 3.8 -> 3.8
  - appendix-deprecated-simple-queries-modification-queries.html # 3.8 -> 3.8
  - appendix-deprecated-simple-queries-geo-queries.html # 3.8 -> 3.8
  - appendix-deprecated-simple-queries-fulltext-queries.html # 3.8 -> 3.8
  - http/simple-query.html # 3.8 -> 3.8
  - programs-arangod-compaction.html # 3.9 -> 3.9
---
Deprecated
==========

Features listed in this section should no longer be used, because they are
considered obsolete and may get removed in a future release. They are currently
kept for backward compatibility. There are usually better alternatives to
replace the old features with:

- **MMFiles Storage Engine**:
  The MMFiles storage engine was deprecated in version 3.6.0 and removed in
  3.7.0.

  MMFiles specific startup options still exist but will also be removed.
  This will affect the following options:

  - `--compaction.*`
  - `--database.force-sync-properties`
  - `--database.index-threads`
  - `--database.maximal-journal-size`
  - `--database.throw-collection-not-loaded-error`
  - `--ttl.only-loaded-collection`
  - `--wal.*`

  The collection attributes `doCompact`, `indexBuckets`, `isVolatile`,
  `journalSize` and `path` are only used with MMFiles and are thus also
  deprecated. They are completely ignored when specified in requests.

- **Export API**:
  The [export REST API](http/export.html) is deprecated and will be removed in a
  future version. Instead of using this API, please use an AQL query with a
  streaming cursor to dump the contents of a collection.

- **Batch Requests API**:
  The [batch request REST API](http/batch-request.html) is deprecated and will be 
  removed in a future version. Instead of using this API, please use the 
  [HTTP Interface for Documents](http/document-working-with-documents.html#bulk-document-operations)
  that can insert, update, replace or remove arrays of documents.

- **Simple Queries**: Idiomatic interface in arangosh to perform trivial queries.
  They are superseded by [AQL queries](aql/index.html), which can also
  be run in arangosh. AQL is a language on its own and way more powerful than
  *Simple Queries* could ever be. In fact, the (still supported) *Simple Queries*
  are translated internally to AQL, then the AQL query is optimized and run
  against the database in recent versions, because of better performance and
  reduced maintenance complexity.

- **Accessing collections by ID instead of by name**:
  Accessing collections by their internal ID instead of accessing them by name
  is deprecated and highly discouraged. This functionality may be removed in
  future versions of ArangoDB.

- **Old metrics REST API**:
  The old metrics API under `/_admin/metrics` is deprecated and replaced by
  a new one under `/_admin/metrics/v2` from version 3.8.0 on. This step was
  necessary because the old API did not follow quite a few Prometheus
  guidelines for metrics.

- **Statistics REST API**:
  The endpoints `/_admin/statistics` and `/_admin/statistics-description`
  are deprecated in favor of the new metrics API under `/_admin/metrics/v2`.
  The metrics API provides a lot more information than the statistics API, so
  it is much more useful.

- **Replication logger-follow REST API**:
  The endpoint `/_api/replication/logger-follow` is deprecated since 3.4.0 and
  may be removed in a future version. Client applications should use the REST 
  API endpoint `/_api/wal/tail` instead, which is available since ArangoDB 3.3.

- **Older cluster REST API endpoints**:
  The following endpoints are simply redirects since ArangoDB 3.7 and are thus
  deprecated from ArangoDB 3.8 onwards:

  - `/_admin/clusterNodeVersion`: redirects to `/_admin/cluster/nodeVersion`
  - `/_admin/clusterNodeEngine`: redirects to `/_admin/cluster/nodeEngine`
  - `/_admin/clusterNodeStats`: redirects to `/_admin/cluster/nodeStatistics`
  - `/_admin/clusterStatistics`: redirects to `/_admin/cluster/statistics`

  The redirecting endpoints will be removed in a future version of ArangoDB.
  Their usage in client applications can be replaced by the endpoints they 
  redirect to.

- **Loading and unloading of collections**:
  The JavaScript functions for explicitly loading and unloading collections,
  `db.<collection-name>.load()` and `db.<collection-name>.unload()` and their
  REST API endpoints `PUT /_api/collection/<collection-name>/load` and
  `PUT /_api/collection/<collection-name>/unload` are deprecated in 3.8.
  There should be no need to explicitly load or unload a collection with the
  RocksDB storage engine. The load/unload functionality was useful only with
  the MMFiles storage engine, which is not available anymore since 3.7.

- **Actions**: Snippets of JavaScript code on the server-side for minimal
  custom endpoints. Since the Foxx revamp in 3.0, it became really easy to
  write [Foxx Microservices](foxx.html), which allow you to define
  custom endpoints even with complex business logic.

  From v3.5.0 on, the system collections `_routing` and `_modules` are not
  created anymore when the `_system` database is first created (blank new data
  folder). They are not actively removed, they remain on upgrade or backup
  restoration from previous versions.

- **Outdated AQL functions**: The following AQL functions are deprecated and
  their usage is discouraged:
  - `IS_IN_POLYGON`
  - `NEAR`
  - `WITHIN`
  - `WITHIN_RECTANGLE`

  See [Geo functions](aql/functions-geo.html) for substitutes.

- **`bfs` option** in AQL graph traversal: Using the *bfs* attribute inside
  traversal options is deprecated since v3.8.0. The preferred way to start a
  breadth-first traversal is by using the new `order` attribute, and setting it
  to a value of `bfs`.

- **Overwrite option**: The `overwrite` option for insert operations (either
  single document operations or AQL `INSERT` operations) is deprecated in favor
  of the `overwriteMode` option, which provides more flexibility.

- **`minReplicationFactor` collection option**: The `minReplicationFactor`
  option for collections has been renamed to `writeConcern`. If
  `minReplicationFactor` is specified and no `writeConcern` is set, the
  `minReplicationFactor` value will still be picked up and used as
  `writeConcern` value. However, this compatibility mode will be removed
  eventually, so changing applications from using `minReplicationFactor` to
  `writeConcern` is advised.

- **Outdated startup options**

  The following _arangod_ startup options are deprecated and will be removed
  in a future version:
  - `--database.old-system-collections` (no need to use it anymore)
  - `--server.jwt-secret` (use `--server.jwt-secret-keyfile`) 
  - `--arangosearch.threads` / `--arangosearch.threads-limit`
    (use the following options instead):
    - `--arangosearch.commit-threads`
    - `--arangosearch.commit-threads-idle`
    - `--arangosearch.consolidation-threads`
    - `--arangosearch.consolidation-threads-idle`
  - `--rocksdb.exclusive-writes` (was intended only as a stopgap measure to
    make porting applications from MMFiles to RocksDB easier)
  - `--http.allow-method-override`: this option allows incoming HTTP POST 
    request to override the actual HTTP method used by setting one of the
    special HTTP headers `x-http-method`, `x-method-override` or 
    `x-http-method-override`. This was originally intended for very restricted
    callers, which only supported HTTP GET and HTTP POST, but seems very
    unnecessary nowadways.
  - `--http.hide-product-header`: whether or not to hide the `Server: ArangoDB`
    header in all responses served by arangod.

  The following options are deprecated for _arangorestore_:
  - `--default-number-of-shards` (use `--number-of-shards` instead)
  - `--default-replication-factor` (use `--replication-factor` instead)

  The following startup options are deprecated in _arangod_ and all client tools:
  - `--log` (use `--log.level` instead)
  - `--log.use-local-time` (use `--log.time-format` instead)
  - `--log.use-microtime` (use `--log.time-format` instead)
  - `--log.performance` (use `--log.level` instead)

- **Obsoleted startup options**: Any startup options marked as obsolete can be
  removed in any future version of ArangoDB, so their usage is highly
  discouraged. Their functionality is already removed, but they still exist to
  prevent unknown startup option errors.

- **HTTP and JavaScript traversal APIs**: The [HTTP traversal API](http/traversal.html)
  is deprecated since version 3.4.0. The JavaScript traversal module
  `@arangodb/graph/traversal` is also deprecated since then. The preferred way
  to traverse graphs is via AQL.

- **JavaScript-based AQL graph functions**: The following JavaScript-based AQL
  graph functions are deprecated:
  - `arangodb::GRAPH_EDGES`
  - `arangodb::GRAPH_VERTICES`
  - `arangodb::GRAPH_NEIGHBORS`
  - `arangodb::GRAPH_COMMON_NEIGHBORS`
  - `arangodb::GRAPH_COMMON_PROPERTIES`
  - `arangodb::GRAPH_PATHS`
  - `arangodb::GRAPH_SHORTEST_PATH`
  - `arangodb::GRAPH_DISTANCE_TO`
  - `arangodb::GRAPH_ABSOLUTE_ECCENTRICITY`
  - `arangodb::GRAPH_ECCENTRICITY`
  - `arangodb::GRAPH_ABSOLUTE_CLOSENESS`
  - `arangodb::GRAPH_CLOSENESS`
  - `arangodb::GRAPH_ABSOLUTE_BETWEENNESS`
  - `arangodb::GRAPH_BETWEENNESS`
  - `arangodb::GRAPH_RADIUS`
  - `arangodb::GRAPH_DIAMETER`
