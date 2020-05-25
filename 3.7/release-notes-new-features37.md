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

### Wildcard search

ArangoSearch was extended to support the `LIKE()` function and `LIKE` operator
in AQL. This allows to check whether the given search pattern is contained in
specified attribute using wildcard matching (`_` for any single character and
`%` for any sequence of characters including none):

```js
FOR doc IN viewName
  SEARCH ANALYZER(LIKE(doc.text, "foo%b_r"), "text_en")
  // or
  SEARCH ANALYZER(doc.text LIKE "foo%b_r", "text_en")
  // will match "foobar", "fooANYTHINGbor" etc.
  RETURN doc.text
```

See [ArangoSearch functions](aql/functions-arangosearch.html#like)

### Covering Indexes

It is possible to directly store the values of document attributes in View
indexes now via a new View property `storedValues` (not to be confused with
the existing `storeValues`).

View indexes may fully cover `SEARCH` queries for improved performance.
While late document materialization reduces the amount of fetched documents,
this new optimization can avoid to access the storage engine entirely.

```json
{
  "links": {
    "articles": {
      "fields": {
        "categories": {}
      }
    }
  },
  "primarySort": [
    { "field": "publishedAt", "direction": "desc" }
  ],
  "storedValues": [
    { "fields": [ "title", "categories" ] }
  ],
  ...
}
```

In above View definition, the document attribute *categories* is indexed for
searching, *publishedAt* is used as primary sort order and *title* as well as
*categories* are stored in the View using the new `storedValues` property.

```js
FOR doc IN articlesView
  SEARCH doc.categories == "recipes"
  SORT doc.publishedAt DESC
  RETURN {
    title: doc.title,
    date: doc.publishedAt,
    tags: doc.categories
  }
```

The query searches for articles which contain a certain tag in the *categories*
array and returns title, date and tags. All three values are stored in the View
(`publishedAt` via `primarySort` and the two other via `storedValues`), thus
no documents need to be fetched from the storage engine to answer the query.
This is shown in the execution plan as a comment to the *EnumerateViewNode*:
`/* view query without materialization */`

```js
Execution plan:
 Id   NodeType            Est.   Comment
  1   SingletonNode          1   * ROOT
  2   EnumerateViewNode      1     - FOR doc IN articlesView SEARCH (doc.`categories` == "recipes") SORT doc.`publishedAt` DESC LET #1 = doc.`publishedAt` LET #7 = doc.`categories` LET #5 = doc.`title`   /* view query without materialization */
  5   CalculationNode        1       - LET #3 = { "title" : #5, "date" : #1, "tags" : #7 }   /* simple expression */
  6   ReturnNode             1       - RETURN #3

Indexes used:
 none

Optimization rules applied:
 Id   RuleName
  1   move-calculations-up
  2   move-calculations-up-2
  3   handle-arangosearch-views
```

See [ArangoSearch Views](arangosearch-views.html#view-properties).

### Stemming support for more languages

The Snowball library was updated to the latest version 2, adding stemming
support for the following languages:

- Arabic (`ar`)
- Basque (`eu`)
- Catalan (`ca`)
- Danish (`da`)
- Greek (`el`)
- Hindi (`hi`)
- Hungarian (`hu`)
- Indonesian (`id`)
- Irish (`ga`)
- Lithuanian (`lt`)
- Nepali (`ne`)
- Romanian (`ro`)
- Serbian (`sr`)
- Tamil (`ta`)
- Turkish (`tr`)

Create a custom Analyzer and set the `locale` accordingly in the properties,
e.g. `"el.utf-8"` for Greek. Arangosh example:

```js
var analyzers = require("@arangodb/analyzers");

analyzers.save("text_el", "text", {
  locale: "el.utf-8",
  stemming: true,
  case: "lower",
  accent: false,
  stopwords: []
}, ["frequency", "norm", "position"]);

db._query(`RETURN TOKENS("αυτοκινητουσ πρωταγωνιστούσαν", "text_el")`)
// [ [ "αυτοκινητ", "πρωταγωνιστ" ] ]
```

Also see [Analyzers: Supported Languages](arangosearch-analyzers.html#supported-languages)

### Condition Optimization Option

The `SEARCH` operation in AQL accepts a new option `conditionOptimization` to
give users control over the search criteria optimization:

```js
FOR doc IN myView
  SEARCH doc.val > 10 AND doc.val > 5 /* more conditions */
  OPTIONS { conditionOptimization: "none" }
  RETURN doc
```

By default, all conditions get converted into disjunctive normal form (DNF).
Numerous optimizations can be applied, like removing redundant or overlapping
conditions (such as `doc.val > 10` which is included by `doc.val > 5`).
However, converting to DNF and optimizing the conditions can take quite some
time even for a low number of nested conditions which produce dozens of
conjunctions / disjunctions. It can be faster to just search the index without
optimizations.

See [SEARCH operation](aql/operations-search.html#search-options).

### Primary Sort Compression Option

There is a new option `primarySortCompression` which can be set on View
creation to disable the compression of the primary sort data:

```json
{
  "primarySort": [
    { "field": "date", "direction": "desc" },
    { "field": "title", "direction": "asc" }
  ],
  "primarySortCompression": "none",
  ...
}
```

It defaults to LZ4 compression (`"lz4"`), which was already used in ArangoDB
v3.5 and v3.6.

See [ArangoSearch Views](arangosearch-views.html#view-properties).

SatelliteGraphs
---------------

When doing joins involving graph traversals, shortest path or k-shortest paths
computation in an ArangoDB cluster, data has to be exchanged between different
servers. In particular graph traversals are usually executed on a Coordinator,
because they need global information. This results in a lot of network traffic
and potentially slow query execution.

SatelliteGraphs are the natural extension of the concept of Satellite
collections to graphs. All of the usual benefits and caveats apply.
SatelliteGraphs are synchronously replicated to all DB-Servers that are part
of a cluster, which enables DB-Servers to execute graph traversals locally.
This includes (k-)shortest path(s) computation and possibly joins with
traversals and greatly improves performance for such queries.

SatelliteGraphs are only available in the Enterprise Edition and the
[ArangoDB Cloud](https://cloud.arangodb.com/home?utm_source=docs&utm_medium=cluster_pages&utm_campaign=docs_traffic).

AQL
---

### Subquery optimizations

The execution process of AQL has been refactored internally. This especially
pays off in subqueries. It will allow for more optimizations and better
batching of requests.

The first stage of this refactoring has been part of 3.6 already where some
subqueries have gained a significant performance boost. 3.7 takes the next step
in this direction. AQL can now combine skipping and producing of outputs in a
single call, so all queries with an offset or the fullCount option enabled will
benefit from this change straight away. This also holds true for subqueries,
hence the existing AQL optimizer rule `splice-subqueries` is now able to
optimize all subqueries and is enabled by default.

### Count optimizations

Subqueries can now use an optimized code path for counting documents if they
are supposed to only return the number of matching documents.
The optimization will be triggered for read-only subqueries that use a full 
collection scan or an index scan, without any additional filtering on document
attributes (early pruning or document post-filtering) and without using LIMIT.

The optimization will help in the following situation:

```js
FOR doc IN collection
  LET count = COUNT(
    FOR sub IN subCollection
      FILTER sub._from == doc._id
      RETURN sub
  )
  ...
```

The restrictions are that the subquery result must only be used with the
`COUNT`/`LENGTH` AQL function and not for anything else. The subquery itself 
must be read-only (no data-modification subquery), not use nested FOR loops,
no LIMIT clause and no FILTER condition or calculation that requires
accessing document data. Accessing index data is supported for filtering (as
in the above example that would use the edge index), but not for further 
calculations.

In case a subquery does not match these criteria, it will not use the 
optimized code path for counting, but will execute normally.

If the optimization is triggered, it will show up in the query execution
plan under the rule name `optimize-count`.

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

Additionally, traversals now accept the options `vertexCollections` and
`edgeCollections` to restrict the traversal to certain vertex or edge collections.

The use case for `vertexCollections` is to not follow any edges that will point
to other than the specified vertex collections, e.g.

```js
FOR v, e, p IN 1..3 OUTBOUND 'products/123' components
  OPTIONS { vertexCollections: [ "bolts", "screws" ] }
  RETURN v 
```

The traversal's start vertex is always considered valid, even if it not stored
in any of the collections listed in the `vertexCollections` option.

The use case for `edgeCollections` is to not take into consideration any edges
from edge collections other than the specified ones, e.g.

```js
FOR v, e, p IN 1..3 OUTBOUND 'products/123' GRAPH 'components'
  OPTIONS { edgeCollections: [ "productsToBolts", "productsToScrews" ] }
  RETURN v
```

This is mostly useful in the context of named graphs, when the named graph
contains many edge collections. Not restricting the edge collections for the
traversal will make the traversal search for edges in all edge collections of
the graph, which can be expensive. In case it is known that only certain edges
from the named graph are needed, the `edgeCollections` option can be a handy
performance optimization.

### Traversal collection restrictions

Added traversal options `vertexCollections` and `edgeCollections` to restrict
traversal to certain vertex or edge collections.

The use case for `vertexCollections` is to not follow any edges that will point
to other than the specified vertex collections, e.g.

    FOR v, e, p IN 1..3 OUTBOUND 'products/123' components 
      OPTIONS { vertexCollections: [ "bolts", "screws" ] }

The traversal's start vertex is always considered valid, regardless of whether
it is present in the `vertexCollections` option.

The use case for `edgeCollections` is to not take into consideration any edges
from edge collections other than the specified ones, e.g.

    FOR v, e, p IN 1..3 OUTBOUND 'products/123' GRAPH 'components' 
      OPTIONS { edgeCollections: [ "productsToBolts", "productsToScrews" ] }

This is mostly useful in the context of named graphs, when the named graph
contains many edge collections. Not restricting the edge collections for the
traversal will make the traversal search for edges in all edge collections of
the graph, which can be expensive. In case it is known that only certain edges
from the named graph are needed, the `edgeCollections` option can be a handy
performance optimization.

### AQL functions added

The following AQL functions have been added in ArangoDB 3.7:

- [IN_RANGE()](aql/functions-miscellaneous.html#in_range)
  (now available outside of `SEARCH` operations)
- [INTERLEAVE()](aql/functions-array.html#interleave)
- [JACCARD()](aql/functions-array.html#jaccard)
- [LEVENSHTEIN_DISTANCE()](aql/functions-string.html#levenshtein_distance)
- [LEVENSHTEIN_MATCH()](aql/functions-arangosearch.html#levenshtein_match)
- [NGRAM_MATCH()](aql/functions-arangosearch.html#ngram_match)
- [NGRAM_POSITIONAL_SIMILARITY()](aql/functions-string.html#ngram_positional_similarity)
- [NGRAM_SIMILARITY()](aql/functions-string.html#ngram_similarity)
- [REPLACE_NTH()](aql/functions-array.html#replace_nth)

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

### Schema Validation for Documents

ArangoDB now supports validating documents on collection level using
JSON Schema (draft-4).

In order to enforce a certain document structure in a collection we have
introduced the `schema` collection property. It expects an object comprised
of a `rule` (JSON Schema object), a `level` and a `message` that will be used
when validation fails. When documents are validated is controlled by the
validation level, which can be `none` (off), `new` (insert only), `moderate`
(on insert and modification, but existing documents can remain invalid)
or `strict` (always).

See: [Schema Validation](data-modeling-documents-schema-validation.html)

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

### Insert-Update and Insert-Ignore

ArangoDB 3.7 adds an insert-update operation that is similar to the already
existing insert-replace functionality. A new `overwriteMode` flag has been
introduced to control the type of the overwrite operation in case of colliding
primary keys during the insert.

In the case of `overwriteMode: "update"`, the parameters `keepNull` and
`mergeObjects` can be provided to control the update operation.

There is now also an insert-ignore operation that allows insert operations
to do nothing in case of a primary key conflict. This operation is an efficient
way of making sure a document with a specific primary key exists. If it does
not exist already, it will be created as specified. Should the document exist
already, nothing will happen and the insert will return without an error. No
write operations happens in this case, and only a single primary key lookup 
needs to be performed in the storage engine. 
This makes the insert-ignore operation the most efficient way 
existing insert-replace functionality. A new `overwriteMode` flag has been
introduced to control the type of the overwrite operation in case of colliding
primary keys during the insert.

The query options are available in [AQL](aql/operations-insert.html#setting-query-options),
the [JS API](data-modeling-documents-document-methods.html#insert--save) and
[HTTP API](http/document-working-with-documents.html#create-document).

### Override detected total memory and CPU cores

`arangod` detects the total amount of RAM present on the system and calculates
various default sizes based on this value. If you run it alongside other
services or in a container with a RAM limitation for its cgroup, then you
probably don't want the server to detect and use all available memory.

An environment variable `ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY` can now be
set to restrict the amount of memory it will detect (also available in v3.6.3).

An environment variable `ARANGODB_OVERRIDE_DETECTED_NUMBER_OF_CORES` can be
set to restrict the number of CPU cores that are visible to arangod.

See [ArangoDB Server Environment Variables](programs-arangod-env-vars.html)

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
- [V8 features](https://v8.dev/features){:target="_blank"} (up to Chrome 79)

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

Metrics
-------

The amount of exported metrics has been extended and is now available in a
format compatible with Prometheus. You can now easily scrape on `/_admin/metrics`.
See [here](http/administration-and-monitoring-metrics.html).

MMFiles storage engine
----------------------

ArangoDB 3.7 does not contain the MMFiles storage engine anymore. In ArangoDB
3.7, the only available storage engine is the RocksDB storage engine, which is
the default storage engine in ArangoDB since version 3.4. The MMFiles storage
engine had been deprecated since the release of ArangoDB 3.6.

Any deployments that use the MMFiles storage engine will need to be migrated to
the RocksDB storage engine using ArangoDB 3.6 (or earlier versions) in order to
upgrade to ArangoDB 3.7.

All storage engine selection functionality has also been removed from the
ArangoDB package installers. The RocksDB storage engine will be selected
automatically for any new deployments created with ArangoDB 3.7.

This change simplifies the installation procedures and internal code paths.

Internal changes
----------------

### Upgrade of bundled RocksDB library version

The bundled version of the RocksDB library has been upgraded from 6.2 to 6.8.

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
g++9.2 is known to work, and is the preferred compiler to build ArangoDB
under Linux.

Under macOS, the official compiler is clang with a minimal target of
macOS 10.14 (Mojave).

Under Windows, use the Visual C++ compiler of Visual Studio 2019 v16.5.0 or
later. VS 2017 might still work, but is not officially supported any longer.

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
