---
layout: default
description: ArangoDB v3.7 Release Notes New Features
---
Features and Improvements in ArangoDB 3.7
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.7. ArangoDB 3.7 also contains several bug fixes that are not listed
here.

AQL
---

### Subquery optimizations

### AQL functions added

The following AQL functions have been added in ArangoDB 3.7:

* REPLACE_NTH
* LEVENSHTEIN_MATCH
* JACCARD

### Syntax enhancements

AQL now supports trailing commas in array and object definitions.

This is especially convenient for editing multi-line array/object definitions, since
there doesn't need to be a distinction between the last element and all others just
for the comma.
That means definitions such as the following are now supported:
```
[
  1,
  2,
  3,
]

{ 
  "a": 1,
  "b": 2,
  "c": 3,
}
```
Previous versions of ArangoDB did not support trailing commas in AQL queries and
threw query parse errors when they were used.

### AQL datetime parsing

The performance of parsing string date/times values in AQL has improved significantly.


ArangoSearch
------------


Cluster
-------

### Parallel Move Shard

Shards can now move in parallel. The old locking mechanism was replaced by a
read-write lock and thus allows multiple jobs for the same destination server.
The actual transfer rates are still limited on DB-Server side but there is a
huge overall speedup. This also affects `CleanOutServer` and
`ResignLeadership` jobs.

Web UI
------

The REST API descriptions for ArangoDB's built-in API now only show the REST API endpoints
by default, but hide unnecessary auxilliary data type descriptions by default. This
reduces clutter.



Internal changes
----------------

The following features have been added for auto-generating documentation:

* the `--dump-options` command for arangod and the client tools now also emits the 
  attribute `os` which indicates on which operating system(s) the respective
  options are supported. 
* the `--dump-options` command for arangod now also emits the attribute `component`
  which indicates for which node type(s) the respective options are supported, e.g.
  single server, coordinator, database server, agency node.
