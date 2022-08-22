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

### Privilege changes

### Endpoint return value changes

Since ArangoDB 3.8, there have been two APIs for retrieving the metrics in two different formats: `/_admin/metrics` and `/_admin/metrics/v2`. The metrics API v1 (`/_admin/metrics`) was deprecated in 3.8 and the usage of `/_admin/metrics/v2` was encouraged.  
In ArangoDB 3.10, `/_admin/metrics` and `/_admin/metrics/v2` now behave identically and return the same output in a fully Prometheus-compatible format. The old metrics format is not available anymore.

For the metrics APIs at `/_admin/metrics` and `/_admin/metrics/v2`, unnecessary spaces have been removed between the "}" delimiting the labels and the value of the metric.


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
  
For more information, see the [Cluster Administration & Monitoring](http/administration-and-monitoring.html#calculates-the-current-cluster-imbalance) 
section of the HTTP API reference manual. 

### Endpoints augmented

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

#### `offset` Analyzer feature

The `POST /_api/analyzer` endpoint accepts `"offset"` as a string in the
`features` array attribute. The `/_api/analyzer` endpoints may return this new
value in the `features` attribute. It enables search highlighting capabilities
for ArangoSearch Views.

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

### Endpoints moved

### Endpoints deprecated

### Endpoints removed

## JavaScript API

The Computed Values feature extends the collection properties with a new
`computedValues` attribute. See [Computed Values](data-modeling-documents-computed-values.html#javascript-api)
for details.
