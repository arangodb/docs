---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.12
---
# Incompatible changes in ArangoDB 3.12

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.12, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.12:

## HTTP REST API

The long-deprecated JavaScript-based traversal functionality was removed in 3.12,
including the REST API endpoint `/_api/traversal`.

The functionality provided by this APIs was deprecated and unmaintained for a long
time. JavaScript-based traversals were replaced with AQL traversals in ArangoDB version 
2.x. Additionally, the JavaScript-based traversal REST API could not handle larger 
amounts of data and was thus very limited.

Users of the `/_api/traversal` REST API should use AQL traversal queries traversals 
instead.

## JavaScript API

The long-deprecated JavaScript-based traversal functionality was removed in 3.12,
including the bundled JavaScript module `@arangodb/graph/traversal`.

The functionality provided by this traversal module was deprecated and unmaintained
for many years. JavaScript-based traversals were replaced with AQL traversals in 
ArangoDB version 2.x. Additionally, the JavaScript-based traversals could not handle 
larger amounts of data and were thus very limited.

Users of the JavaScript-based traversal API should use AQL traversal queries instead.

## Startup options



## Client tools

