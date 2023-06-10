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

#### Early connections

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
  
See [Respond to liveliness probes](http/general.html#respond-to-liveliness-probes) for more details.

#### Validation of collections in named graphs

The `/_api/gharial` endpoints for named graphs have changed:

- If you reference a vertex collection in the `_from` or `_to` attribute of an
  edge that doesn't belong to the graph, an error with the number `1947` is
  returned. The HTTP status code of such an `ERROR_GRAPH_REFERENCED_VERTEX_COLLECTION_NOT_USED`
  error has been changed from `400` to `404`. This change aligns the behavior to
  the similar `ERROR_GRAPH_EDGE_COLLECTION_NOT_USED` error (number `1930`).

- Write operations now check if the specified vertex or edge collection is part
  of the graph definition. If you try to create a vertex via
  `POST /_api/gharial/{graph}/vertex/{collection}` but the `collection` doesn't
  belong to the `graph`, then the `ERROR_GRAPH_REFERENCED_VERTEX_COLLECTION_NOT_USED`
  error is returned. If you try to create an edge via
  `POST /_api/gharial/{graph}/edge/{collection}` but the `collection` doesn't
  belong to the `graph`, then the error is `ERROR_GRAPH_EDGE_COLLECTION_NOT_USED`.

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

#### Cursor API

<small>Introduced in: v3.9.11, v3.10.7</small>

In AQL graph traversals (`POST /_api/cursor` endpoint), you can restrict the
vertex and edge collections in the traversal options like so:

```aql
FOR v, e, p IN 1..3 OUTBOUND 'products/123' components
  OPTIONS {
    vertexCollections: [ "bolts", "screws" ],
    edgeCollections: [ "productsToBolts", "productsToScrews" ]
  }
  RETURN v 
```

If you specify collections that don't exist, queries now fail with
a "collection or view not found" error (code `1203` and HTTP status
`404 Not Found`). In previous versions, unknown vertex collections were ignored,
and the behavior for unknown edge collections was undefined.

Additionally, the collection types are now validated. If a document collection
or View is specified in `edgeCollections`, an error is raised
(code `1218` and HTTP status `400 Bad Request`).

Furthermore, it is now an error if you specify a vertex collection that is not
part of the specified named graph (code `1926` and HTTP status `404 Not Found`).
It is also an error if you specify an edge collection that is not part of the
named graph's definition or of the list of edge collections (code `1939` and
HTTP status `400 Bad Request`).

### Endpoint return value changes

- Since ArangoDB 3.8, there have been two APIs for retrieving the metrics in two
  different formats: `/_admin/metrics` and `/_admin/metrics/v2`.
  The metrics API v1 (`/_admin/metrics`) was deprecated in 3.8 and the usage of
  `/_admin/metrics/v2` was encouraged.

  In ArangoDB 3.10, `/_admin/metrics` and `/_admin/metrics/v2` now behave
  identically and return the same output in a fully Prometheus-compatible format.
  The old metrics format is not available anymore.

  For the metrics APIs at `/_admin/metrics` and `/_admin/metrics/v2`, unnecessary
  spaces have been removed between the `}` delimiting the labels and the value of
  the metric.

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
  
For more information, see the [Cluster](http/cluster.html#get-the-current-cluster-imbalance) 
section of the HTTP API documentation. 

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

Also see the [HTTP interface for cluster maintenance](http/cluster.html#get-the-maintenance-status-of-a-db-server).

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
  - `cache` (boolean, _optional_): default: the value of the top-level `cache`
    option (introduced in v3.10.2, Enterprise Edition only)
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
- `cache` (boolean, _optional_): default: `false`
  (introduced in v3.10.2, Enterprise Edition only)
- `storedValues` (array, _optional_): an array of objects (or an array of arrays
  of strings as shorthand, or also an array of strings from v3.10.3 on):
  - `fields` (array, _required_): an array of strings
  - `compression` (string, _optional_): possible values: `"lz4"`, `"none"`.
    Default: `"lz"`
  - `cache` (boolean, _optional_): default: `false`
    (introduced in v3.10.2, Enterprise Edition only)
- `primarySort` (object, _optional_)
  - `fields` (array, _required_): an array of objects:
    - `field` (string, _required_)
    - `direction` (string, _required_): possible values: `"asc"`, `"desc"`
  - `compression` (string, _optional_): possible values: `"lz4"`, `"none"`.
    Default: `"lz4"`
  - `cache` (boolean, _optional_): default: `false`
    (introduced in v3.10.2, Enterprise Edition only)
- `primaryKeyCache` (boolean, _optional_): default: `false`
  (introduced in v3.10.2, Enterprise Edition only)
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
  - `cache` (boolean): default: omitted
    (introduced in v3.10.2, Enterprise Edition only)
  - `nested` (array): default: omitted. Enterprise Edition only. An array of objects:
    - `name` (string)
    - `analyzer` (string), default: omitted
    - `features` (array): an array of strings, possible values:
      `"frequency"`, `"norm"`, `"position"`, `"offset"`. Default: the features
      as defined by the Analyzer itself
    - `searchField` (boolean): default: the value defined by the top-level
      `searchField` option
- `searchField` (boolean): default: `false`
- `cache` (boolean): default: omitted
  (introduced in v3.10.2, Enterprise Edition only)
- `storedValues` (array): default: `[]`. An array of objects:
  - `fields` (array): an array of strings
  - `compression` (string): possible values: `"lz4"`, `"none"`.
    Default: `"lz"`
  - `cache` (boolean): default: omitted
    (introduced in v3.10.2, Enterprise Edition only)
- `primarySort` (object)
  - `fields` (array): default: `[]`. An array of objects:
    - `field` (string)
    - `direction` (string): possible values: `"asc"`, `"desc"`
  - `compression` (string): possible values: `"lz4"`, `"none"`.
    Default: `"lz4"`
  - `cache` (boolean): default: omitted
    (introduced in v3.10.2, Enterprise Edition only)
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

The `/_api/analyzer` endpoint supports new Analyzer types in the
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

- [`geo_s2`](analyzers.html#geo_s2) (introduced in v3.10.5):
  Like the existing `geojson` Analyzer, but with an additional `format` property
  that can be set to `"latLngDouble"` (default), `"latLngInt"`, or `"s2Point"`.

#### Views API

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

See [Respond to liveliness probes](http/general.html#respond-to-liveliness-probes) for more information.

#### Read from followers

A number of read-only APIs now observe the `x-arango-allow-dirty-read`
header, which was previously only used in Active Failover deployments.
This header allows reading from followers or "dirty reads". See
[Read from followers](http/document.html#read-from-followers)
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

#### Document API

<small>Introduced in: v3.9.6, v3.10.2</small>

The following endpoints support a new, experimental `refillIndexCaches` query
parameter to repopulate the edge cache after requests that insert, update,
replace, or remove single or multiple edge documents:

- `POST /_api/document/{collection}`
- `PATCH /_api/document/{collection}/{key}`
- `PUT /_api/document/{collection}/{key}`
- `DELETE /_api/document/{collection}/{key}`

It is a boolean option and the default is `false`.

This also applies to the `INSERT`, `UPDATE`, `REPLACE`, and `REMOVE` operations
in AQL queries, which support a `refillIndexCache` option, too.

#### Metrics API

The `GET /_admin/metrics/v2` (and `GET /_admin/metrics`) endpoints provide
newly added metrics for `arangosearch` View links and inverted indexes:

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

---

<small>Introduced in: v3.10.7</small>

This new metric reports the number of RocksDB `.sst` files:

| Label | Description |
|:------|:------------|
| `rocksdb_total_sst_files` | Total number of RocksDB sst files, aggregated over all levels. |

---

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

<small>Introduced in: v3.10.5</small>

The following metric for the number of replication clients for a server has
been added:

| Label | Description |
|:------|:------------|
| `arangodb_replication_clients` | Number of currently connected/active replication clients. |

---

<small>Introduced in: v3.9.11, v3.10.6</small>

The following metrics for diagnosing delays in cluster-internal network requests
have been added:

| Label | Description |
|:------|:------------|
| `arangodb_network_dequeue_duration` | Internal request duration for the dequeue in seconds. |
| `arangodb_network_response_duration` | Internal request duration from fully sent till response received in seconds. |
| `arangodb_network_send_duration` | Internal request send duration in seconds. |
| `arangodb_network_unfinished_sends_total` | Number of internal requests for which sending has not finished. |

---

<small>Introduced in: v3.10.7</small>

The following metric stores the peak value of the `rocksdb_cache_allocated` metric:

| Label | Description |
|:------|:------------|
| `rocksdb_cache_peak_allocated` | Global peak memory allocation of ArangoDB in-memory caches. |

---

<small>Introduced in: v3.10.7</small>

The following metrics have been added:

| Label | Description |
|:------|:------------|
| `arangodb_file_descriptors_limit` | System limit for the number of open files for the arangod process. |
| `arangodb_file_descriptors_current` | Number of file descriptors currently opened by the arangod process. |

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
[Pregel HTTP API](http/pregel.html#get-a-pregel-job-execution-status).

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

## JavaScript API

### Computed values

The Computed Values feature extends the collection properties with a new
`computedValues` attribute. See [Computed Values](data-modeling-documents-computed-values.html#javascript-api)
for details.

### Query spillover and Read from followers

The `db._query()` and `db._createStatement()` methods accepts new query
options (`options` object) to set per-query thresholds for the
[query spillover feature](release-notes-new-features310.html#query-result-spillover-to-decrease-memory-usage)
and to [Read from followers](http/document.html#read-from-followers):

- `allowDirtyReads` (boolean, _optional_): default: `false`
- `spillOverThresholdMemoryUsage` (integer, _optional_): in bytes, default: `134217728` (128MB)
- `spillOverThresholdNumRows` (integer, _optional_): default: `5000000` rows

### AQL queries

<small>Introduced in: v3.9.11, v3.10.7</small>

If you specify collections that don't exist in the options of AQL graph traversals
(`vertexCollections`, `edgeCollections`), queries now fail. In previous versions,
unknown vertex collections were ignored, and the behavior for unknown
edge collections was undefined.

Additionally, queries now fail if you specify a document collection or View
in `edgeCollections`.
