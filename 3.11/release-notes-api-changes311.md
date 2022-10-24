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

### Privilege changes



### Endpoint return value changes



### Endpoints added



### Endpoints augmented

#### Cursor API

The cursor API can now return an additional statistics value in its `stats` sub-attribute:

- **intermediateCommits**: the total number of intermediate commits the query has performed. 
  This number can only be greater than zero for data-modification queries that perform modifications 
  beyond the `--rocksdb.intermediate-commit-count` or `--rocksdb.intermediate-commit-size` thresholds.
  In a cluster, the intermediate commits are tracked per DB server that participates in the query
  and are summed up in the end.

#### Restriction of indexable fields

It is now forbidden to create indexes that cover fields whose attribute names
start or end with `:` , for example, `fields: ["value:"]`. This notation is
reserved for internal use.

Existing indexes are not affected but you cannot create new indexes with a
preceding or trailing colon using the `POST /_api/index` endpoint.

### Endpoints moved



### Endpoints deprecated



### Endpoints removed



## JavaScript API

### Deprecations

The `collection.iterate()` method is deprecated from v3.11.0 onwards and will be
removed in a future version.
