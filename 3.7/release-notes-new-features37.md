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

- REPLACE_NTH()
- LEVENSHTEIN_MATCH()
- JACCARD()

### Syntax enhancements

AQL now supports trailing commas in array and object definitions.

This is especially convenient for editing multi-line array/object definitions,
since there doesn't need to be a distinction between the last element and all
others just for the comma. That means definitions such as the following are
now supported:

```js
[
  1,
  2,
  3, // trailing comma
]
```

```js
{
  "a": 1,
  "b": 2,
  "c": 3, // trailing comma
}
```

Previous versions of ArangoDB did not support trailing commas in AQL queries
and threw query parse errors when they were used.

### AQL datetime parsing

The performance of parsing ISO 8601 date/time string values in AQL has improved
significantly thanks to a specialized parser, replacing a regular expression.

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

The interactive description of ArangoDB's HTTP API (Swagger UI) shows the
endpoint and model entries collapsed by default now for a better overview.

Internal changes
----------------

### Supported compilers

Manually compiling ArangoDB from source will require a C++17-ready compiler.
Older versions of g++ that could be used to compile previous versions of
ArangoDB, namely g++7, cannot be used anymore for compiling ArangoDB.
g++9 is known to work.

### Documentation generation

The following features have been added for auto-generating documentation:

- the `--dump-options` command for arangod and the client tools now also emits
  an attribute `os` which indicates on which operating system(s) the respective
  options are supported.
- the `--dump-options` command for arangod now also emits an attribute
  `component` which indicates for which node type(s) the respective options are
  supported (`single` server, `coordinator`, `dbserver`, `agent`).
