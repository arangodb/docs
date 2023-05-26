---
layout: default
description: ArangoDB v3.12 Release Notes API Changes
---
API Changes in ArangoDB 3.12
============================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.12.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.12.

## HTTP RESTful API

### Behavior changes



### Privilege changes



### Endpoint return value changes



### Endpoints added



### Endpoints augmented



### Endpoints moved



### Endpoints deprecated



### Endpoints removed

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
