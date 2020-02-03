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

General
-------

### HTTP/2 support

The server now supports upgrading connections from HTTP 1.1 to HTTP 2.
This should improve ArangoDBs compatibility with various L7 load balancers
and modern cloud platforms like Kubernetes.

We also expect improved request throughput in cases where there are many
concurrent requests.

See: [HTTP Switching Protocols](http/general.html#switching-protocols)

### JWT secret rotation (Enterprise Edition)

There are now new APIs and startup options for JWT secrets. The new option
`--server.jwt-secret-folder` can be used to specify a path for more than one
JWT secret file.

Additionally the `/_admin/server/jwt` API can be used to reload the JWT secrets
of a local arangod process without having to restart it (hot-reload). This may
be used to roll out new JWT secrets throughout an ArangoDB cluster.

### Insert-Update

ArangoDB 3.7 adds an insert-update operation that is similar to the already
existing insert-replace functionality. A new `overwriteMode` flag has been
introduced to control the type of the overwrite operation in case of colliding
keys during the insert.

In the case of `overwriteMode: "update"`, the parameters `keepNull` and
`mergeObjects` can be provided to control the update operation.

The query options are available in [AQL](aql/operations-insert.html#setting-query-options),
the [JS API](data-modeling-documents-document-methods.html#insert--save) and
[HTTP API](http/document-working-with-documents.html#create-document).

JavaScript API
--------------

The [`query` helper](appendix-java-script-modules-arango-db.html#the-query-helper)
was extended to support passing [query options](aql/invocation-with-arangosh.html#setting-options):

```js
require("@arangodb").query( { maxRuntime: 1 } )`SLEEP(2)`
```

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
