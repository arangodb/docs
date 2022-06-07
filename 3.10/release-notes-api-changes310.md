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

### Privilege changes

### Endpoint return value changes

Since ArangoDB 3.8, there have been two APIs for retrieving the metrics in two different formats: `/_admin/metrics` and `/_admin/metrics/v2`. The metrics API v1 (`/_admin/metrics`) was deprecated in 3.8 and the usage of `/_admin/metrics/v2` was encouraged.  
In ArangoDB 3.10, `/_admin/metrics` and `/_admin/metrics/v2` now behave identically and return the same output in a fully Prometheus-compatible format. The old metrics format is not available anymore.

For the metrics APIs at `/_admin/metrics` and `/_admin/metrics/v2`, unnecessary spaces have been removed between the "}" delimiting the labels and the value of the metric.


### Endpoints added

Added the `GET /_api/query/rules` endpoint that returns the available
optimizer rules for AQL queries. It returns an array of objects that contain
the name of each available rule and its respective flags.

The JavaScript API was not extended, but you can make a request using a
low-level method in _arangosh_:

```js
arango.GET("/_api/query/rules")
```

### Endpoints augmented

APIs that return data from ArangoDB's write-ahead log (WAL) may now return
collection truncate markers in the cluster, too. Previously such truncate
markers were only issued in the single server and active failover modes, but not
in a cluster. Client applications that tail ArangoDB's WAL are thus supposed
to handle WAL markers of type `2004`.

The following HTTP APIs are affected:
* `/_api/wal/tail`
* `/_api/replication/logger-follow`

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

### Endpoints moved

### Endpoints deprecated

### Endpoints removed

## JavaScript API


