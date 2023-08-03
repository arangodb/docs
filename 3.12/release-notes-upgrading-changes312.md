---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.12
---
# Incompatible changes in ArangoDB 3.12

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.12, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.12:

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

