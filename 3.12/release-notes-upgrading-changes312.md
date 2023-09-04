---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.12
---
# Incompatible changes in ArangoDB 3.12

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.12, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.12:

## Little-endian on-disk key format for the RocksDB storage engine

ArangoDB 3.12 does not support the little-endian on-disk key for the RocksDB
storage engine anymore.
The little-endian on-disk key format was used for deployments that were created 
with either ArangoDB 3.2 or 3.3 when using the RocksDB storage engine. 
Since ArangoDB 3.4, a big-endian on-disk key format was used for the RocksDB 
storage engine, which is more performant than the little-endian format. 

Deployments that were set up with the RocksDB storage engine using ArangoDB 3.2 
or 3.3 and that have been upgraded since then will still use the old format. 
This should not affect many users, because the default storage engine in ArangoDB 
3.2 and 3.3 was the MMFiles storage engine. 
Furthermore, deployments that have been recreated from an arangodump since 
ArangoDB 3.4 will not be affected, because restoring an arangodump into a fresh 
deployment will also make ArangoDB use the big-endian on-disk format.

ArangoDB 3.11 logs a warning message during startup when the little-endian 
on-disk format is in use, but it still supports using the little-endian key format
for almost all operations.

ArangoDB 3.12 will refuse to start when detecting that the little-endian on-disk
is in use, so users that are still using this format must migrate to the big-endian
on-disk key format before upgrading to 3.12.

The migration can be performed as follows:

1. create a full logical backup of the database using arangodump
2. stop the database servers in the deployment
3. wipe the existing database directories
4. restart the servers in the deployment
5. restore the logical dump into the deployment

It will not be sufficient to take a hot backup of a little-endian dataset
and restore it, because when restoring a hot backup, the original database
format will be restored as it was at time of the backup.

## In-memory cache subsystem

By default, the in-memory cache subsystem uses up to 95% of its configured
memory limit value (as configured by the `--cache.size` startup option).

Previous versions of ArangoDB effectively used only 56% of the configured memory
limit value for the cache subsystem. The 56% value was hard-coded in ArangoDB
versions before 3.11.3, and has been configurable since then via the 
`--cache.high-water-multiplier` startup option. To make things compatible, the 
default value for the high water multiplier was set to 56% in 3.11.

ArangoDB 3.12 now adjusts this default value to 95%, i.e. the cache subsystem
uses up to 95% of the configured memory. Although this is a behavior
change, it seems more sensible to use up to 95% of the configured limit value 
rather than just 56%.
The change can lead to the cache subsystem effectively using more memory than
before. In case a deployment's memory usage is already close to the maximum,
the change can lead to out-of-memory (OOM) kills. To avoid this, you have
two options:

1. Decrease the value of `--cache.high-water-multiplier` to 0.56, which should
   mimic the old behavior.
2. Leave the high water multiplier untouched, but decrease the value of the 
   `--cache.size` startup option to about half of its current value.

The second option is the recommended one, as it signals the intent more clearly,
and makes the cache behave "as expected", i.e. use up to the configured
memory limit and not just 56% of it.

## Client tools

### jslint feature in arangosh

The `--jslint` startup option and all of the underlying functionality has been
removed from arangosh. The feature was mainly for internal purposes.

## HTTP RESTful API

### JavaScript-based traversal using `/_api/traversal`

The long-deprecated JavaScript-based traversal functionality has been removed
in v3.12.0, including the REST API endpoint `/_api/traversal`.

The functionality provided by this API was deprecated and unmaintained since
v3.4.0. JavaScript-based traversals have been replaced with AQL traversals in
v2.8.0. Additionally, the JavaScript-based traversal REST API could not handle
larger amounts of data and was thus very limited.

Users of the `/_api/traversal` REST API should use
[AQL traversal queries](aql/graphs-traversals.html) instead.

### HTTP server behavior

The following long-deprecated features have been removed from ArangoDB's HTTP
server:

- overriding the HTTP method by setting one of the HTTP headers:
  - `x-http-method`
  - `x-http-method-override`
  - `x-method-override`
 
   This functionaltiy posed a potential security risk and was thus removed.
   Previously, it was only enabled when explicitly starting the 
   server with the `--http.allow-method-override` startup option.
   The functionality has now been removed and setting the startup option does
   nothing.

- optionally hiding ArangoDB's `server` response header. This functionality
  could optionally be enabled by starting the server with the startup option
  `--http.hide-product-header`.
  The functionality has now been removed and setting the startup option does
  nothing.

## JavaScript API

### `@arangodb/graph/traversal` module

The long-deprecated JavaScript-based traversal functionality has been removed in
v3.12.0, including the bundled `@arangodb/graph/traversal` JavaScript module.

The functionality provided by this traversal module was deprecated and
unmaintained since v3.4.0. JavaScript-based traversals have been replaced with
AQL traversals in v2.8.0. Additionally, the JavaScript-based traversals could
not handle larger amounts of data and were thus very limited.

Users of the JavaScript-based traversal API should use
[AQL traversal queries](aql/graphs-traversals.html) instead.

### Graph compatibility functions

The following long-deprecated compatibility graph functions have been removed
in ArangoDB 3.12. These functions were implemented as JavaScript user-defined 
AQL functions since ArangoDB 3.0:
  - `arangodb::GRAPH_EDGES(...)`
  - `arangodb::GRAPH_VERTICES(...)`
  - `arangodb::GRAPH_NEIGHBORS(...)`
  - `arangodb::GRAPH_COMMON_NEIGHBORS(...)`
  - `arangodb::GRAPH_COMMON_PROPERTIES(...)`
  - `arangodb::GRAPH_PATHS(...)`
  - `arangodb::GRAPH_SHORTEST_PATH(...)`
  - `arangodb::GRAPH_DISTANCE_TO(...)`
  - `arangodb::GRAPH_ABSOLUTE_ECCENTRICTIY(...)`
  - `arangodb::GRAPH_ECCENTRICTIY(...)`
  - `arangodb::GRAPH_ABSOLUTE_CLOSENESS(...)`
  - `arangodb::GRAPH_CLOSENESS(...)`
  - `arangodb::GRAPH_ABSOLUTE_BETWEENNESS(...)`
  - `arangodb::GRAPH_BETWEENNESS(...)`
  - `arangodb::GRAPH_RADIUS(...)`
  - `arangodb::GRAPH_DIAMETER(...)`

These functions were only available previously after explicitly calling the
`_registerCompatibilityFunctions()` function from any of the JavaScript graph
modules.
The `_registerCompatibilityFunctions()` exports have also been removed from
the JavaScript graph modules.

## Startup options



## Client tools

### arangodump

This following startup options of arangodump are obsolete from ArangoDB 3.12 on:

- `--envelope`: setting this option to `true` previously wrapped every dumped 
  document into a `{data, type}` envelope. 
  This was useful for the MMFiles storage engine, where dumps could also include 
  document removals. With the RocksDB storage engine, the envelope only caused 
  overhead and increased the size of the dumps. The default value of `--envelope`
  was changed to false in ArangoDB 3.9 already, so by default all arangodump 
  invocations since then created non-envelope dumps. With the option being removed 
  now, all arangodump invocations will unconditionally create non-envelope dumps.
- `--tick-start`: setting this option allowed to restrict the dumped data to some 
  time range with the MMFiles storage engine. It had no effect for the RocksDB 
  storage engine and so it is removed now.
- `--tick-end`: setting this option allowed to restrict the dumped data to some 
  time range with the MMFiles storage engine. It had no effect for the RocksDB 
  storage engine and so it is removed now.

