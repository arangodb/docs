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
URL-encoded and also NFC-normalized if they contain UTF-8 characters.

The ArangoDB client tools _arangobench_, _arangodump_, _arangoexport_,
_arangoimport_, _arangorestore_, and _arangosh_ ship with full support for the
extended naming constraints.

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

The `refillIndexCaches` option supported by the following endpoints now includes
in-memory hash caches of persistent indexes in addition to edge caches:

- `POST /_api/document/{collection}`
- `PATCH /_api/document/{collection}/{key}`
- `PUT /_api/document/{collection}/{key}`
- `DELETE /_api/document/{collection}/{key}`

This also applies to the `INSERT`, `UPDATE`, `REPLACE`, and `REMOVE` operations
in AQL queries, which support a `refillIndexCache` option, too.

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

### Privilege changes



### Endpoint return value changes



### Endpoints added



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

### Endpoints moved



### Endpoints deprecated



### Endpoints removed



## JavaScript API

### Deprecations

The `collection.iterate()` method is deprecated from v3.11.0 onwards and will be
removed in a future version.
