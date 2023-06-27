---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.12
---
# Incompatible changes in ArangoDB 3.12

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.12, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.12:

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

## Startup options



## Client tools

