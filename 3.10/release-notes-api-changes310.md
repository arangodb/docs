---
layout: default
description: ArangoDB v3.10 Release Notes API Changes
---
API Changes in ArangoDB 3.10
============================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.10.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.10.

## HTTP RESTful API

### Behavior changes

The HTTP interface of _arangod_ instances can now optionally be started earlier
during the startup process, so that ping probes from monitoring tools can
already be responded to when the instance has not fully started.

By default, the HTTP interface is opened at the same point during the startup
sequence as in previous versions, but it can optionally be opened earlier by
setting the new `--server.early-connections` startup option to `true`.

The following APIs can reply early with an HTTP 200 status:

- `GET /_api/version` and `GET /_admin/version`:
  These APIs return the server version number, but can also be used as a
  lifeliness probe, to check if the instance is responding to incoming HTTP requests.
- `GET /_admin/status`:
  This API returns information about the instance's status, now also including
  recovery progress and information about which server feature is currently starting.
  
See [Responding to Liveliness Probes](http/general.html#responding-to-liveliness-probes) for more details.

### Endpoint return value changes

Since ArangoDB 3.8, there have been two APIs for retrieving the metrics in two
different formats: `/_admin/metrics` and `/_admin/metrics/v2`.
The metrics API v1 (`/_admin/metrics`) was deprecated in 3.8 and the usage of
`/_admin/metrics/v2` was encouraged.

In ArangoDB 3.10, `/_admin/metrics` and `/_admin/metrics/v2` now behave
identically and return the same output in a fully Prometheus-compatible format.
The old metrics format is not available anymore.

For the metrics APIs at `/_admin/metrics` and `/_admin/metrics/v2`, unnecessary
spaces have been removed between the `}` delimiting the labels and the value of
the metric.

### Endpoints added

#### Optimizer rules for AQL queries

Added the `GET /_api/query/rules` endpoint that returns the available
optimizer rules for AQL queries. It returns an array of objects that contain
the name of each available rule and its respective flags.

The JavaScript API was not extended, but you can make a request using a
low-level method in _arangosh_:

```js
arango.GET("/_api/query/rules")
```

#### Shard rebalancing

Starting with version 3.10, new endpoints are added that allow you to perform
move shard operations and improve balance in the cluster.

- `GET /_admin/cluster/rebalance`
- `POST /_admin/cluster/rebalance`
- `POST /_admin/cluster/rebalance_execute`
- `PUT /_admin/cluster/rebalance`
  
For more information, see the [Cluster Administration & Monitoring](http/administration-and-monitoring.html#compute-the-current-cluster-imbalance) 
section of the HTTP API reference manual. 

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

Also see the [HTTP interface for cluster maintenance](http/cluster-maintenance.html#query-the-maintenance-status-of-a-db-server).

### Endpoints augmented

#### EnterpriseGraphs (Enterprise Edition)

You can create EnterpriseGraphs by setting `isSmart` to `true`, the `numberOfShards`,
but no `smartGraphAttribute`. You can optionally specify which collections shall
be `satellites`. There are no new attributes for creating this type of graph.

The vertex collections of an EnterpriseGraph have a new `shardingStrategy` value
of `enterprise-hex-smart-vertex`.

Also see [EnterpriseGraphs](graphs-enterprise-graphs.html).

#### Inverted Indexes

The `/_api/index` endpoints support a new `inverted` index type.

Options for creating an index (`POST /_api/index`):

- `type` (string): needs to be set to `"inverted"`
- `name` (string, _optional_)
- `fields` (array): required unless the top-level `includeAllFields` option is
  set to `true`. The array elements can be a mix of strings and objects:
  - `name` (string, _required_): an attribute path. Passing a string instead of
    an object is the same as passing an object with this name attribute
  - `analyzer` (string, _optional_): default: the value defined by the top-level
    `analyzer` option
  - `features` (array, _optional_): an array of strings, possible values:
    `"frequency"`, `"norm"`, `"position"`, `"offset"`. Default: the features as
    defined by the Analyzer itself, or inherited from the top-level `features`
    option if the `analyzer` option adjacent to this option is not set
  - `includeAllFields` (boolean, _optional_): default: `false`
  - `searchField` (boolean, _optional_): default: the value defined by the
    top-level `searchField` option
  - `trackListPositions` (boolean, _optional_): default: the value of the
    top-level `trackListPositions` option
  - `nested` (array, _optional_): Enterprise Edition only.
    The array elements can be a mix of strings and objects:
    - `name` (string, _required_): an attribute path. Passing a string instead
      of an object is the same as passing an object with this name attribute
    - `analyzer` (string, _optional_): default: the value defined by the parent
      field, or the top-level `analyzer` option
    - `features` (array, _optional_): an array of strings, possible values:
      `"frequency"`, `"norm"`, `"position"`, `"offset"`. Default: the features as
      defined by the Analyzer itself, or inherited from the parent field's or
      top-level `features` option if no `analyzer` option is set at a deeper
      level, closer to this option
    - `searchField` (boolean, _optional_): default: the value defined by the
      top-level `searchField` option
    - `nested` (array, _optional_): can be used recursively. See `nested` above
- `searchField` (boolean, _optional_): default: `false`
- `storedValues` (array, _optional_): an array of objects:
  - `fields` (array, _required_): an array of strings
  - `compression` (string, _optional_): possible values: `"lz4"`, `"none"`.
    Default: `"lz"`
- `primarySort` (object, _optional_)
  - `fields` (array, _required_): an array of objects:
    - `field` (string, _required_)
    - `direction` (string, _required_): possible values: `"asc"`, `"desc"`
  - `compression` (string, _optional_): possible values: `"lz4"`, `"none"`.
    Default: `"lz4"`
- `analyzer` (string, _optional_): default: `identity`
- `features` (array, _optional_): an array of strings, possible values:
  `"frequency"`, `"norm"`, `"position"`, `"offset"`. Default: the features as
  defined by the Analyzer itself
- `includeAllFields` (boolean, _optional_): default: `false`
- `trackListPositions` (boolean, _optional_): default: `false`
- `parallelism` (integer, _optional_): default: `2`
- `inBackground` (boolean, _optional_)
- `cleanupIntervalStep` (integer, _optional_): default: `2`
- `commitIntervalMsec` (integer, _optional_): default: `1000`
- `consolidationIntervalMsec` (integer, _optional_): default: `1000`
- `consolidationPolicy` (object, _optional_):
  - `type` (string, _optional_): possible values: `"tier"`. Default: `"tier"`
  - `segmentsBytesFloor` (integer, _optional_): default: `2097152`
  - `segmentsBytesMax` (integer, _optional_): default: `5368709120`
  - `segmentsMax` (integer, _optional_): default: `10`
  - `segmentsMin` (integer, _optional_): default: `1`
  - `minScore`: (integer, _optional_): default: `0`
- `writebufferIdle` (integer, _optional_): default: `64`
- `writebufferActive` (integer, _optional_): default: `0`
- `writebufferSizeMax` (integer, _optional_): default: `33554432`

Index definition returned by index endpoints:

- `id` (string)
- `isNewlyCreated` (boolean)
- `unique` (boolean): `false`
- `sparse` (boolean): `true`
- `version` (integer)
- `code` (integer)
- `type` (string): `"inverted"`
- `name` (string)
- `fields` (array): array of objects:
  - `name` (string)
  - `analyzer` (string): default: omitted
  - `features` (array): an array of strings, possible values:
    `"frequency"`, `"norm"`, `"position"`, `"offset"`. Default: omitted
  - `includeAllFields` (boolean): default: omitted
  - `searchField` (boolean): default: the value defined by the top-level
    `searchField` option
  - `trackListPositions` (boolean): default: omitted
  - `nested` (array): default: omitted. Enterprise Edition only. An array of objects:
    - `name` (string)
    - `analyzer` (string), default: omitted
    - `features` (array): an array of strings, possible values:
      `"frequency"`, `"norm"`, `"position"`, `"offset"`. Default: the features
      as defined by the Analyzer itself
    - `searchField` (boolean): default: the value defined by the top-level
      `searchField` option
- `searchField` (boolean): default: `false`
- `storedValues` (array): default: `[]`. An array of objects:
  - `fields` (array): an array of strings
  - `compression` (string): possible values: `"lz4"`, `"none"`.
    Default: `"lz"`
- `primarySort` (object)
  - `fields` (array): default: `[]`. An array of objects:
    - `field` (string)
    - `direction` (string): possible values: `"asc"`, `"desc"`
  - `compression` (string): possible values: `"lz4"`, `"none"`.
    Default: `"lz4"`
- `analyzer` (string): default: `identity`
- `features` (array): default: the features as defined by the Analyzer itself
- `includeAllFields` (boolean): default: `false`
- `trackListPositions` (boolean): default: `false`
- `cleanupIntervalStep` (integer): default: `2`
- `commitIntervalMsec` (integer): default: `1000`
- `consolidationIntervalMsec` (integer): default: `1000`
- `consolidationPolicy` (object):
  - `type` (string): possible values: `"tier"`. Default: `"tier"`
  - `segmentsBytesFloor` (integer): default: `2097152`
  - `segmentsBytesMax` (integer): default: `5368709120`
  - `segmentsMax` (integer): default: `10`
  - `segmentsMin` (integer): default: `1`
  - `minScore`: (integer): default: `0`
- `writebufferIdle` (integer): default: `64`
- `writebufferActive` (integer): default: `0`
- `writebufferSizeMax` (integer): default: `33554432`

Also see the [HTTP API documentation](http/indexes-inverted.html).

#### `search-alias` Views

The `/_api/view` endpoints support a new `search-alias` type.

Options for creating an `search-alias` View (`POST /_api/view`):

- `name` (string, _required_)
- `type` (string, _required_): needs to be set to `"search-alias"`
- `indexes` (array, _optional_): default: `[]`. An array of objects:
  - `collection` (string, _required_)
  - `index` (string, _required_)

Options for partially changing properties (`PATCH /_api/view/<view>/properties`),
to add or remove inverted indexes from the View definition:

- `indexes` (array, _optional_): default: `[]`. An array of objects:
  - `collection` (string, _required_)
  - `index` (string, _required_)
  - `operation` (string, _optional_): possible values: `"add"` and `"del"`.
    Default: `"add"`

View definition returned by View endpoints:

- `name` (string)
- `type` (string): `"search-alias"`
- `indexes` (array): default: `[]`. An array of objects:
  - `collection` (string)
  - `index` (string)

Also see the [HTTP API documentation](http/views-search-alias.html).

#### Computed Values

The [Computed Values](data-modeling-documents-computed-values.html) feature
extends the following endpoints with a new `computedValues` collection property
that you can read or write to manage the computed value definitions:

- Create a collection (`POST /_api/collection`)
- Read the properties of a collection (`GET /_api/collection/{collection-name}/properties`)
- Change the properties of a collection (`PUT /_api/collection/{collection-name}/properties`)

The `computedValues` attribute is either `null` or an array of objects with the
following attributes:
- `name` (string, _required_)
- `expression` (string, _required_)
- `overwrite` (boolean, _required_)
- `computeOn` (array of strings, _optional_, default: `["insert","update","replace"]`)
- `keepNull` (boolean, _optional_, default: `true`)
- `failOnWarning` (boolean, _optional_, default: `false`)

#### Nested search (Enterprise Edition)

The following endpoints accepts a new, optional link property called `nested`
for Views of type `arangosearch` in the Enterprise Edition:

- `POST /_api/view`
- `PUT /_api/view/{view-name}/properties`
- `PATCH /_api/view/{view-name}/properties`

It is an object and similar to the existing `fields` property. However, it
cannot be used at the top-level of the link properties. It needs to have a
parent field (`"fields": { "<field>": { "nested": { ... } } }`). It can be
nested, however (`"nested": { "<field>": { "nested": { ... } } }`).

The `GET /_api/view/{view-name}/properties` endpoint may return link properties
including the new `nested` property.

For nested search with inverted indexes (and indirectly with `search-alias` Views),
see the `nested` property supported by [inverted indexes](#inverted-indexes).

#### `offset` Analyzer feature

In the Enterprise Edition, the `POST /_api/analyzer` endpoint accepts `"offset"`
as a string in the `features` array attribute. The `/_api/analyzer` endpoints
may return this new value in the `features` attribute. It enables
search highlighting capabilities for Views.

#### Analyzer types

The `/_api/analyzer` endpoint supports three new Analyzer types in the
Enterprise Edition:

- [`minhash`](analyzers.html#minhash):
  It has two properties, `analyzer` (object) and `numHashes` (number).
  The `analyzer` object is an Analyzer-like definition with a `type` (string) and
  a `properties` attribute (object). The properties depend on the Analyzer type.

- [`classification`](analyzers.html#classification) (experimental):
  It has three properties, `model_location` (string), `top_k` (number, optional,
  default: `1`), and `threshold` (number, optional, default: `0.99`).

- [`nearest_neighbors`](analyzers.html#nearest_neighbors) (experimental):
  It has two properties, `model_location` (string) and `top_k` (number, optional,
  default: `1`).

#### Collection truncation markers

APIs that return data from ArangoDB's write-ahead log (WAL) may now return
collection truncate markers in the cluster, too. Previously such truncate
markers were only issued in the single server and active failover modes, but not
in a cluster. Client applications that tail ArangoDB's WAL are thus supposed
to handle WAL markers of type `2004`.

The following HTTP APIs are affected:
- `/_api/wal/tail`
- `/_api/replication/logger-follow`

#### Startup and recovery information

The GET `/_admin/status` API now also returns startup and recovery information. This
can be used to determine the instance's progress during startup. The new `progress`
attribute is returned inside the `serverInfo` object with the following subattributes:

- `phase`: name of the lifecycle phase the instance is currently in. Normally one of
  `"in prepare"`, `"in start"`, `"in wait"`, `"in shutdown"`, `"in stop"`, or `"in unprepare"`.
- `feature`: internal name of the feature that is currently being prepared, started, 
   stopped or unprepared.
- `recoveryTick`: current recovery sequence number value if the instance is currently in
  recovery. If the instance is already past the recovery, this attribute contains 
  the last handled recovery sequence number.

See [Responding to Liveliness Probes](http/general.html#responding-to-liveliness-probes) for more information.

#### Read from Followers

A number of read-only APIs now observe the `x-arango-allow-dirty-read`
header, which was previously only used in Active Failover deployments.
This header allows reading from followers or "dirty reads". See
[Read from Followers](http/document-address-and-etag.html#read-from-followers)
for details.

The following APIs are affected:

- Single document reads (`GET /_api/document`)
- Batch document reads (`PUT /_api/document?onlyget=true`)
- Read-only AQL queries (`POST /_api/cursor`)
- The edge API (`GET /_api/edges`)
- Read-only Stream Transactions and their sub-operations
  (`POST /_api/transaction/begin` etc.)

If the header is not specified, the behavior is the same as before.

#### Cursor API

The cursor API can now return additional statistics values in its `stats` subattribute:

- **cursorsCreated**: the total number of cursor objects created during query execution. Cursor
  objects are created for index lookups.
- **cursorsRearmed**: the total number of times an existing cursor object was repurposed. 
  Repurposing an existing cursor object is normally more efficient compared to destroying an 
  existing cursor object and creating a new one from scratch.
- **cacheHits**: the total number of index entries read from in-memory caches for indexes
  of type edge or persistent. This value will only be non-zero when reading from indexes
  that have an in-memory cache enabled, and when the query allows using the in-memory
  cache (i.e. using equality lookups on all index attributes).
- **cacheMisses**: the total number of cache read attempts for index entries that could not
  be served from in-memory caches for indexes of type edge or persistent. This value will 
  only be non-zero when reading from indexes that have an in-memory cache enabled, the 
  query allows using the in-memory cache (i.e. using equality lookups on all index attributes)
  and the looked up values are not present in the cache.

These attributes are optional and only useful for detailed performance analyses.

The `POST /_api/cursor` endpoint accepts two new parameters in the `options`
object to set per-query thresholds for the
[query spillover feature](release-notes-new-features310.html#query-result-spillover-to-decrease-memory-usage):

- `spillOverThresholdMemoryUsage` (integer, _optional_): in bytes, default: `134217728` (128MB)
- `spillOverThresholdNumRows` (integer, _optional_): default: `5000000` rows

#### Index API

- The index creation API at POST `/_api/index` now accepts an optional `storedValues`
  attribute to include additional attributes in a persistent index.
  These additional attributes cannot be used for index lookups or sorts, but they
  can be used for projections.

  If set, `storedValues` must be an array of index attribute paths. There must be no
  overlap of attribute paths between `fields` and `storedValues`. The maximum number
  of values is 32.

  All index APIs that return additional data about indexes (e.g. GET `/_api/index`)
  will now also return the `storedValues` attribute for indexes that have their
  `storedValues` attribute set.

  The extra index information is also returned by inventory-like APIs that return
  the full set of collections with their indexes.

- The index creation API at POST `/_api/index` now accepts an optional `cacheEnabled`
  attribute to enable an in-memory cache for index values for persistent indexes.

  If `cacheEnabled` is set to `true`, the index is created with the cache. Otherwise
  the index is created without it. Caching is turned off by default.

  APIs that return information about all indexes such as GET `/_api/index` 
  or GET `/_api/index/<index-id>` can now also return the `cacheEnabled`
  attribute.

You cannot create multiple persistent indexes with the same `fields` attributes
and uniqueness option but different `storedValues` or `cacheEnabled` attributes.
The values of `storedValues` and `cacheEnabled` are not considered in index
creation calls when checking if a persistent index is already present or a new
one needs to be created.

The index API may now include `figures` for `arangosearch` View links and
inverted indexes. This information was previously not available for these index
types. The `withStats` query parameter needs to be set to `true` to retrieve
figures, and for `arangosearch` Views, `withHidden` needs to be enabled, too:

```json
{
  "figures" : { 
    "numDocs" : 4,
    "numLiveDocs" : 4,
    "numSegments" : 1,
    "numFiles" : 8,
    "indexSize" : 1358
  }, ...
}
```

#### Metrics API

The `GET /_admin/metrics/v2` (and `GET /_admin/metrics`) endpoints provide
metrics for `arangosearch` View links and inverted indexes:

- `arangodb_search_cleanup_time`
- `arangodb_search_commit_time`
- `arangodb_search_consolidation_time`
- `arangodb_search_index_size`
- `arangodb_search_num_docs`
- `arangodb_search_num_failed_cleanups`
- `arangodb_search_num_failed_commits`
- `arangodb_search_num_failed_consolidations`
- `arangodb_search_num_files`
- `arangodb_search_num_live_docs`
- `arangodb_search_num_out_of_sync_links`
- `arangodb_search_num_segments`

#### Pregel API

When loading the graph data into memory, a `"loading"` state is now returned by
the `GET /_api/control_pregel` and `GET /_api/control_pregel/{id}` endpoints.
The state changes to `"running"` when loading finishes.

In previous versions, the state was `"running"` when loading the data as well as
when running the algorithm.

Both endpoints return a new `detail` attribute with additional Pregel run details:

- `detail` (object)
  - `aggregatedStatus` (object)
    - `timeStamp` (string)
    - `graphStoreStatus` (object)
      - `verticesLoaded` (integer)
      - `edgesLoaded` (integer)
      - `memoryBytesUsed` (integer)
      - `verticesStored` (integer)
    - `allGssStatus` (object)
      - `items` (array of objects)
        - `verticesProcessed` (integer)
        - `messagesSent` (integer)
        - `messagesReceived` (integer)
        - `memoryBytesUsedForMessages` (integer)
    - `workerStatus` (object)
      - `<serverId>` (object)
        - (the same attributes like under `aggregatedStatus`)

For a detailed description of the attributes, see
[Pregel HTTP API](http/pregel.html#get-pregel-job-execution-status).

## JavaScript API

The Computed Values feature extends the collection properties with a new
`computedValues` attribute. See [Computed Values](data-modeling-documents-computed-values.html#javascript-api)
for details.

The `db._query()` and `db._createStatement()` methods accepts two new query
options (`options` object) to set per-query thresholds for the
[query spillover feature](release-notes-new-features310.html#query-result-spillover-to-decrease-memory-usage):

- `spillOverThresholdMemoryUsage` (integer, _optional_): in bytes, default: `134217728` (128MB)
- `spillOverThresholdNumRows` (integer, _optional_): default: `5000000` rows
