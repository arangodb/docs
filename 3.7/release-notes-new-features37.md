---
layout: default
description: ArangoDB v3.7 Release Notes New Features
---
Features and Improvements in ArangoDB 3.7
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.7. ArangoDB 3.7 also contains several bug fixes that are not listed
here.

ArangoSearch
------------

Satellite Graphs
-------

When doing joins involving graph traversals, shortest paths, or k-shortest paths in an ArangoDB cluster, data has to be exchanged between different servers. In particular graph traversals are usually executed on a Coordinator, because they need global information.

This results in a lot of network traffic and potentially slow query execution.

Satellite Graphs are the natural extension of the concept of Satellite collections to graphs. All of the usual benefits and caveats apply. 
Satellite graphs are synchronously replicated to all DB-Servers that are part of a cluster, which enables DB-Servers to execute graph traversals (and (k-)shortest paths), and possibly joins with traversals, locally.

This greatly improves performance for such queries.

Satellite Graphs are only available in the Enterprise Edition, and the ArangoDB Cloud.

AQL
---

### Subquery optimizations

### Traversal optimizations

Graph traversal performance is improved via some internal code refactoring:

- Traversal cursors are reused instead of recreated from scratch, if possible.
  This can save lots of calls to the memory management subsystem.
- Unnecessary checks have been removed from the cursors, by ensuring some
  invariants.
- Each vertex lookup needs to perform slightly less work.
  
The traversal speedups observed by these changes alone were around 8 to 10% for
single-server traversals and traversals in OneShard setups. Cluster traversals
will also benefit from these changes, but to a lesser extent. This is because 
the network roundtrips have a higher share of the total query execution times there.

Traversal performance can be further improved by not fetching the visited vertices
from the storage engine in case the traversal query does not refer to them. 
For example, in the query:

```js
FOR v, e, p IN 1..3 OUTBOUND 'collection/startVertex' edges
  RETURN e
```

…the vertex variable (`v`) is never accessed, making it unnecessary to fetch the
vertices from storage. If this optimization is applied, the traversal node will be
marked with `/* vertex optimized away */` in the query's execution plan output.
Unused edge and path variables (`e` and `p`) were already optimized away in
previous versions by the `optimize-traversals` optimizer rule.

### AQL functions added

The following AQL functions have been added in ArangoDB 3.7:

- [REPLACE_NTH()](aql/functions-array.html#replace_nth)
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

### Ternary operator

Improved the lazy evaluation capabilities of the [ternary operator](aql/operators.html#ternary-operator).
If the second operand is left out, the expression of the condition is only
evaluated once now, instead of once more for the true branch.

### Other AQL improvements

The existing AQL optimizer rule `move-calculations-down` is now able to also move
unrelated subqueries beyond SORT and LIMIT instructions, which can help avoid the
execution of subqueries for which the results are later discarded.

For example, in the query:

```js
FOR doc IN collection1
  LET sub1 = FIRST(FOR sub IN collection2 FILTER sub.ref == doc._key RETURN sub)
  LET sub2 = FIRST(FOR sub IN collection3 FILTER sub.ref == doc._key RETURN sub)
  
  SORT sub1
  LIMIT 10
  RETURN { doc, sub1, sub2 }
```

…the execution of the `sub2` subquery can be delayed to after the SORT and LIMIT.
The query optimizer will automatically transform this query into the following:

```js
FOR doc IN collection1
  LET sub1 = FIRST(FOR sub IN collection2 FILTER sub.ref == doc._key RETURN sub)
  SORT sub1
  LIMIT 10

  LET sub2 = FIRST(FOR sub IN collection3 FILTER sub.ref == doc._key RETURN sub)
  RETURN { doc, sub1, sub2 }
```

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

### Server Name Indication (Enterprise Edition)

Sometimes it is desirable to have the same server use different server keys
and certificates when it is contacted under different names. This is possible
with the [Server Name Indication](programs-arangod-ssl.html#server-name-indication-sni)
(SNI) TLS extension. It is now supported by ArangoDB using a new startup option
`--ssl.server-name-indication`.

### JWT secret rotation (Enterprise Edition)

There are now new APIs and startup options for JWT secrets. The new option
`--server.jwt-secret-folder` can be used to specify a path for more than one
JWT secret file.

Additionally the `/_admin/server/jwt` API can be used to
[reload the JWT secrets](http/general.html#hot-reload-of-jwt-secrets)
of a local arangod process without having to restart it (hot-reload).
This may be used to roll out new JWT secrets throughout an ArangoDB cluster.

### TLS key and certificate rotation

It is now possible to change the TLS keyfile (secret key as well as
public certificates) at run time. The API `POST /_admin/server/tls`
basically makes the `arangod` server reload the keyfile from disk.

Furthermore, one can query the current TLS setup at runtime with the
`GET /_admin/server/tls` API. The public certificates as well as a
SHA-256 hash of the private key is returned.

This allows [rotation of TLS keys and certificates](http/administration-and-monitoring.html#tls)
without a server restart.

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

JavaScript
----------

### V8 and ICU library upgrades

The bundled V8 JavaScript engine was upgraded to version 7.9.317. The bundled
Unicode character handling library ICU was upgraded to version 64.2.

The resource usage of V8 has improved a lot. Memory usage is down by 15%,
spawning a new Isolate has become almost 10 times faster.

Here is the list of improvements that may matter to you as an ArangoDB user:

- [JSON.parse improvements](https://v8.dev/blog/v8-release-76#json.parse-improvements){:target="_blank"}:
  JSON parsing is roughly 60% faster compared to ArangoDB v3.6. Parsing JSON
  is generally faster than parsing JavaScript because of the lower syntactic
  complexity, but with the additional speedup of the JSON parser you should
  consider to use `JSON.parse(string)` over JavaScript variable declarations
  for complex data:
  ```js
  // Parsing a JSON string
  let structuredVar = JSON.parse('{"foo": "bar", …}');
  // instead of using an object literal
  let structuredVar = {foo: "bar", …};
  ```
  Also see [Embedding JSON into JavaScript programs with JSON.parse](https://v8.dev/features/subsume-json#embedding-json-parse){:target="_blank"}.

- [BigInt support in formatter](https://v8.dev/features/intl-numberformat){:target="_blank"}:
  Large integer numbers are now supported in number formatters:
  ```js
  const formatter = new Intl.NumberFormat('fr');
  formatter.format(12345678901234567890n);
  ```
  This no longer throws an `Cannot convert a BigInt value to a number` error.
  Note that ArangoDB does not support BigInt in general but only in JavaScript
  contexts. AQL, JSON etc. do not support BigInt.

- [Object.fromEntries support](https://v8.dev/features/object-fromentries){:target="_blank"}:
  Performs the inverse operation of `Object.entries()`:
  ```js
  const object = { x: 42, y: 50 };
  const entries = Object.entries(object);
  // → [['x', 42], ['y', 50]]
  
  const result = Object.fromEntries(entries);
  // → { x: 42, y: 50 }
  ```

- [Underscores for better readability of large numbers](https://v8.dev/features/numeric-separators){:target="_blank"}:
  ```
  1_000_000_000_000 // → equals 1000000000000
  ```

- [matchAll support for strings](https://v8.dev/features/string-matchall){:target="_blank"}:
  A convenient generator for a match object for each match:
  ```js
  const string = 'Favorite GitHub repos: tc39/ecma262 v8/v8.dev';
  const regex = /\b(?<owner>[a-z0-9]+)\/(?<repo>[a-z0-9\.]+)\b/g;
  for (const match of string.matchAll(regex)) {
    console.log(`${match[0]} at ${match.index} with '${match.input}'`);
    console.log(`→ owner: ${match.groups.owner}`);
    console.log(`→ repo: ${match.groups.repo}`);
  ```

- ICU supports more languages and characters (Unicode 12.1),
  emoji handling was improved

Also see:
- [V8 release blog posts](https://v8.dev/blog){:target="_blank"} (v7.2 to v7.9)
- [V8 features](https://v8.dev/features){:target="_blank"} (Chrome 79 or lower)

### JavaScript APIs

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

### Crash handler

ArangoDB 3.7 contains a crash handler for Linux and macOS builds. The crash
handler is supposed to log basic crash information to the ArangoDB logfile in
case the arangod process receives one of the signals SIGSEGV, SIGBUS, SIGILL,
SIGFPE or SIGABRT.

If possible, the crash handler will also write a backtrace to the logfile, so
that the crash location can be found later by ArangoDB support.

By design, the crash handler will not kick in in case the arangod process is
killed by the operating system with a SIGKILL signal, as it happens on Linux
when the OOM killer terminates processes that consume lots of memory.

Also see [Troubleshooting Arangod](troubleshooting-arangod.html#other-crashes).

### Supported compilers

Manually compiling ArangoDB from source will require a C++17-ready compiler.
Older versions of g++ that could be used to compile previous versions of
ArangoDB, namely g++7, cannot be used anymore for compiling ArangoDB.

g++9.2 is known to work, and is the preferred compiler to build ArangoDB.

### Removed libcurl dependency

The compile-time dependency on libcurl was removed. Cluster-internal
communication is now performed using [fuerte](https://github.com/arangodb/fuerte){:target="_blank"}
instead of libcurl.

### Documentation generation

The following features have been added for auto-generating documentation:

- the `--dump-options` command for arangod and the client tools now also emits
  an attribute `os` which indicates on which operating system(s) the respective
  options are supported.
- the `--dump-options` command for arangod now also emits an attribute
  `component` which indicates for which node type(s) the respective options are
  supported (`single` server, `coordinator`, `dbserver`, `agent`).
