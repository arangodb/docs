---
layout: default
description: ArangoDB v3.10 Release Notes New Features
---
# Features and Improvements in ArangoDB 3.10

The following list shows in detail which features have been added or improved in
ArangoDB 3.10. ArangoDB 3.10 also contains several bug fixes that are not listed
here.

## Native ARM Support

ArangoDB is now available for the ARM architecture, in addition to the x86-64
architecture.

It can natively run on Apple silicon (e.g. M1 chips). It was already possible to
run 3.8.x and older versions on these systems via Rosetta 2 emulation, but not
3.9.x because of its use of AVX instructions, which Rosetta 2 does not emulate.
3.10.x runs on this hardware again, but now without emulation.

ArangoDB 3.10.x also runs on 64-bit ARM (AArch64, Little Endian) chips under Linux.
The minimum requirement is an ARMv8 chip with Neon (SIMD extension).

## SmartGraphs (Enterprise Edition)

### SmartGraphs and SatelliteGraphs on a single server

It is now possible to test [SmartGraphs](graphs-smart-graphs.html) and
[SatelliteGraphs](graphs-satellite-graphs.html) on a single server and then to
port them to a cluster with multiple servers.

You can create SmartGraphs, Disjoint SmartGraphs, SmartGraphs using 
SatelliteCollections, Disjoint SmartGraphs using SatelliteCollections, as well
as SatelliteGraphs in the usual way, using
`arangosh` for instance, but on a single server, then dump them, start a cluster
(with multiple servers) and restore the graphs in the cluster. The graphs and
the collections will keep all properties that are kept when the graph is already
created in a cluster.

Also see [SmartGraphs and SatelliteGraphs on a Single Server](smart-and-satellite-graphs-single-server.html).

This feature is only available in the Enterprise Edition.

### EnterpriseGraphs (Enterprise Edition)

The 3.10 version of ArangoDB introduces a specialized version of SmartGraphs, 
called EnterpriseGraphs. 

EnterpriseGraphs come with a concept of automated sharding key selection,
meaning that the sharding key is randomly selected while ensuring that all
their adjacent edges are co-located
on the same servers, whenever possible. This approach provides significant
advantages as it minimizes the impact of having suboptimal sharding keys
defined when creating the graph.

See the [EnterpriseGraphs](graphs-enterprise-graphs.html) chapter for more details.

This feature is only available in the Enterprise Edition.

### (Disjoint) Hybrid SmartGraphs renaming

(Disjoint) Hybrid SmartGraphs were renamed to
**(Disjoint) SmartGraphs using SatelliteCollections**.
The functionality and behavior of both types of graphs stay the same.

## Computed Values

This feature lets you define expressions on the collection level
that run on inserts, modifications, or both. You can access the data of the
current document to compute new values using a subset of AQL.

Possible use cases are to add timestamps of the creation or last modification to
every document, to add default attributes, or to automatically process
attributes for indexing purposes, like filtering, combining multiple attributes
into one, and to convert characters to lowercase.

The following example uses the JavaScript API to create a collection with two
computed values, one to add a timestamp of the document creation, and another
to maintain an attribute that combines two other attributes:

```js
var coll = db._create("users", {
  computedValues: [
    {
      name: "createdAt",
      expression: "RETURN DATE_ISO8601(DATE_NOW())",
      overwrite: true,
      computeOn: ["insert"]
    },
    {
      name: "fullName",
      expression: "RETURN LOWER(CONCAT_SEPARATOR(' ', @doc.firstName, @doc.lastName))",
      overwrite: false,
      computeOn: ["insert", "update", "replace"], // default
      keepNull: false,
      failOnWarning: true
    }
  ]
});
var doc = db.users.save({ firstName: "Paula", lastName: "Plant" });
/* Stored document:
  {
    "createdAt": "2022-08-08T17:14:37.362Z",
    "fullName": "paula plant",
    "firstName": "Paula",
    "lastName": "Plant"
  }
*/
```

See [Computed Values](data-modeling-documents-computed-values.html) for more
information and examples.

## ArangoSearch

### Inverted collection indexes

A new `inverted` index type is available that you can define at the collection
level. You can use these indexes similar to `arangosearch` Views, to accelerate
queries like value lookups, range queries, accent- and case-insensitive search,
wildcard and fuzzy search, nested search, as well as for
sophisticated full-text search with the ability to search for words, phrases,
and more.

```js
db.imdb_vertices.ensureIndex({
  type: "inverted",
  name: "inv-idx",
  fields: [
    "title",
    { name: "description", analyzer: "text_en" }
  ]
});

db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-idx", forceIndexHint: true }
  FILTER TOKENS("neo morpheus", "text_en") ALL IN doc.description
  RETURN doc.title`);
```

You need to use an index hint to utilize an inverted index.
Note that the `FOR` loop uses a collection, not a View, and documents are
matched using a `FILTER` operation. Filter conditions work similar to the
`SEARCH` operation but you don't need to specify Analyzers with the `ANALYZER()`
function in queries.

Like Views, this type of index is eventually consistent.

See [Inverted index](indexing-inverted.html) for details.

### `search-alias` Views

A new `search-alias` View type was added to let you add one or more
inverted indexes to a View, enabling federated searching over multiple collections,
ranking of search results by relevance, and search highlighting, similar to
`arangosearch` Views. This is on top of the filtering capabilities provided by the
inverted indexes, including full-text processing with Analyzers and more.

```js
db._createView("view", "search-alias", {
  indexes: [
    { collection: "coll", index: "inv-idx" }
  ]
});

db._query(`FOR doc IN imdb
  SEARCH STARTS_WITH(doc.title, "The Matrix") AND
  PHRASE(doc.description, "invasion", 2, "machine")
  RETURN doc`);
```

A key difference between `arangosearch` and `search-alias` Views is that you don't
need to specify an Analyzer context with the `ANALYZER()` function in queries
because it is inferred from the inverted index definition, which only supports
a single Analyzer per field.

Also see [Getting started with ArangoSearch](arangosearch.html#getting-started-with-arangosearch).

### Search highlighting (Enterprise Edition)

Views now support search highlighting, letting you retrieve the positions of
matches within strings, to highlight what was found in search results.

You need to index attributes with custom Analyzers that have the new `offset`
feature enabled to use this feature. You can then call the
[`OFFSET_INFO()` function](aql/functions-arangosearch.html#offset_info) to
get the start offsets and lengths of the matches (in bytes).

You can use the [`SUBSTRING_BYTES()` function](aql/functions-string.html#substring_bytes)
together with the [`VALUE()` function](aql/functions-document.html#value) to
extract a match.

```js
db._create("food");
db.food.save({ name: "avocado", description: { en: "The avocado is a medium-sized, evergreen tree, native to the Americas." } });
db.food.save({ name: "carrot", description: { en: "The carrot is a root vegetable, typically orange in color, native to Europe and Southwestern Asia." } });
db.food.save({ name: "chili pepper", description: { en: "Chili peppers are varieties of the berry-fruit of plants from the genus Capsicum, cultivated for their pungency." } });
db.food.save({ name: "tomato", description: { en: "The tomato is the edible berry of the tomato plant." } });

var analyzers = require("@arangodb/analyzers");
var analyzer = analyzers.save("text_en_offset", "text", { locale: "en", stopwords: [] }, ["frequency", "norm", "position", "offset"]);

db._createView("food_view", "arangosearch", { links: { food: { fields: { description: { fields: { en: { analyzers: ["text_en_offset"] } } } } } } });
db._query(`FOR doc IN food_view
  SEARCH ANALYZER(
    TOKENS("avocado tomato", "text_en_offset") ANY == doc.description.en OR
    PHRASE(doc.description.en, "cultivated", 2, "pungency") OR
    STARTS_WITH(doc.description.en, "cap")
  , "text_en_offset")
  FOR offsetInfo IN OFFSET_INFO(doc, ["description.en"])
    RETURN {
      description: doc.description,
      name: offsetInfo.name,
      matches: offsetInfo.offsets[* RETURN {
        offset: CURRENT,
        match: SUBSTRING_BYTES(VALUE(doc, offsetInfo.name), CURRENT[0], CURRENT[1])
      }]
    }`);
```

```json
[
  {
    "description" : { "en" : "The avocado is a medium-sized, evergreen tree, native to the Americas." },
    "name" : [ "description", "en" ],
    "matches" : [
      { "offset" : [4, 11], "match" : "avocado" }
    ]
  },
  {
    "description" : { "en" : "Chili peppers are varieties of the berry-fruit of plants from the genus Capsicum, cultivated for their pungency." },
    "name" : [ "description", "en" ],
    "matches" : [
      { "offset" : [82, 111], "match" : "cultivated for their pungency" },
      { "offset" : [72, 80], "match" : "Capsicum" }
    ]
  },
  {
    "description" : { "en" : "The tomato is the edible berry of the tomato plant." },
    "name" : [ "description", "en" ],
    "matches" : [
      { "offset" : [4, 10], "match" : "tomato" },
      { "offset" : [38, 44], "match" : "tomato" }
    ]
  }
]
*/
```

See [Search highlighting with ArangoSearch](arangosearch-search-highlighting.html)
for details.

### Nested search (Enterprise Edition)

Nested search allows you to index arrays of objects in a way that lets you
search the sub-objects with all the conditions met by a single sub-object
instead of each condition being met by any of the sub-objects.

Consider a document like the following:

```json
{
  "dimensions": [
    { "type": "height", "value": 35 },
    { "type": "width", "value": 60 }
  ]
}
```

The following search query matches the document because the individual conditions
are satisfied by one of the nested objects:

```aql
FOR doc IN viewName
  SEARCH doc.dimensions.type == "height" AND doc.dimensions.value > 40
  RETURN doc
```

If you only want to find documents where both conditions are true for a single
nested object, you could post-filter the search results:

```aql
FOR doc IN viewName
  SEARCH doc.dimensions.type == "height" AND doc.dimensions.value > 40
  FILTER LENGTH(doc.dimensions[* FILTER CURRENT.type == "height" AND CURRENT.value > 40]) > 0
  RETURN doc
```

The new nested search feature allows you to simplify the query and get better
performance:

```aql
FOR doc IN viewName
  SEARCH doc.dimensions[? FILTER CURRENT.type == "height" AND CURRENT.value > 40]
  RETURN doc
```

See [Nested search with ArangoSearch](arangosearch-nested-search.html) using Views
and the nested search example using [Inverted indexes](indexing-inverted.html#nested-search-enterprise-edition)
for details.

This feature is only available in the Enterprise Edition.

### Optimization rule `arangosearch-constrained-sort`

This new optimization rule brings significant performance improvements by 
allowing you to perform sorting and limiting inside `arangosearch` Views
enumeration node, if using just scoring for a sort operation.

### ArangoSearch column cache (Enterprise Edition)

[`arangosearch` Views](arangosearch-views.html) support new caching options.

<small>Introduced in: v3.9.5, v3.10.2</small>

- You can enable the new `cache` option for individual View links or fields
  to always cache field normalization values in memory. This can improve the
  performance of scoring and ranking queries.

- You can enable the new `cache` option in the definition of a `storedValues`
  View property to always cache stored values in memory. This can improve the
  query performance if stored values are involved.

---

<small>Introduced in: v3.9.6, v3.10.2</small>

- You can enable the new `primarySortCache` View property to always cache the
  primary sort columns in memory. This can improve the performance of queries
  that utilize the primary sort order.

- You can enable the new `primaryKeyCache` View property to always cache the
  primary key column in memory. This can improve the performance of queries
  that return many documents.

---

[Inverted indexes](http/indexes-inverted.html) also support similar new caching
options.

<small>Introduced in: v3.10.2</small>

- A new `cache` option for inverted indexes as the default or for specific
  `fields` to always cache field normalization values in memory.

- A new `cache` option per object in the definition of the `storedValues`
  elements to always cache stored values in memory.

- A new `cache` option in the `primarySort` property to always cache the
  primary sort columns in memory.

- A new `primaryKeyCache` property for inverted indexes to always cache the
  primary key column in memory.

---

The cache size can be controlled with the new `--arangosearch.columns-cache-limit`
startup option and monitored via the new `arangodb_search_columns_cache_size`
metric.

ArangoSearch caching is only available in the Enterprise Edition.

See [Optimizing View and inverted index query performance](arangosearch-performance.html)
for examples.

{% hint 'info' %}
If you use ArangoSearch caching in supported 3.9 versions and upgrade an
Active Failover deployment to 3.10, you may need to re-configure the
cache-related options and thus recreate inverted indexes and Views. See
[Known Issues in 3.10](release-notes-known-issues310.html#arangosearch).
{% endhint %}

### New startup options

- With `--arangosearch.skip-recovery`, you can skip data recovery for the
  specified View links and inverted indexes on startup.
  Values for this startup option should have the format `<collection-name>/<link-id>`,
  `<collection-name>/<index-id>`, or `<collection-name>/<index-name>`.
  On DB-Servers, the `<collection-name>` part should contain a shard name.

- With the `--arangosearch.fail-queries-on-out-of-sync` startup option you can let
  write operations fail if `arangosearch` View links or inverted indexes are not
  up-to-date with the collection data. The option is set to `false` by default.
  Queries on out-of-sync links/indexes are answered normally, but the return data
  may be incomplete.
  If set to `true`, any data retrieval queries on out-of-sync 
  links/indexes are going to fail with error "collection/view is out of sync"
  (error code 1481).

<small>Introduced in: v3.10.4</small>

- The new `--javascript.user-defined-functions` startup option lets you disable
  user-defined AQL functions so that no user-defined JavaScript code of
  [UDFs](aql/extending.html) runs on the server. Also see
  [Server security options](security-security-options.html).

### ArangoSearch metrics and figures

The [Metrics HTTP API](http/administration-and-monitoring-metrics.html) has been
extended with metrics for ArangoSearch for monitoring `arangosearch` View links
and inverted indexes.

The following metrics have been added in ArangoDB 3.10:

| Label | Description |
|:------|:------------|
| `arangodb_search_cleanup_time` | Average time of few last cleanups.
| `arangodb_search_commit_time` | Average time of few last commits.
| `arangodb_search_consolidation_time` | Average time of few last consolidations.
| `arangodb_search_index_size` | Size of the index in bytes for current snapshot.
| `arangodb_search_num_docs` | Number of documents for current snapshot.
| `arangodb_search_num_failed_cleanups` | Number of failed cleanups.
| `arangodb_search_num_failed_commits` | Number of failed commits.
| `arangodb_search_num_failed_consolidations` | Number of failed consolidations.
| `arangodb_search_num_files` | Number of files for current snapshot.
| `arangodb_search_num_live_docs` | Number of live documents for current snapshot.
| `arangodb_search_num_out_of_sync_links` | Number of out-of-sync arangosearch links/inverted indexes.
| `arangodb_search_num_segments` | Number of segments for current snapshot.
| `arangodb_search_columns_cache_size` | Size of all ArangoSearch columns currently loaded into the cache.

These metrics are exposed by single servers and DB-Servers.

Additionally, the JavaScript and HTTP API for indexes has been extended with
figures for `arangosearch` View links and inverted indexes.

In arangosh, you can call `db.<collection>.indexes(true, true);` to get at this
information. Also see [Listing all indexes of a collection](indexing-working-with-indexes.html#listing-all-indexes-of-a-collection).
The information has the following structure:

```js
{
  "figures" : { 
    "numDocs" : 4,      // total number of documents in the index with removals
    "numLiveDocs" : 4,  // total number of documents in the index without removals
    "numSegments" : 1,  // total number of index segments
    "numFiles" : 8,     // total number of index files
    "indexSize" : 1358  // size of the index in bytes
  }, ...
}
```

Note that the number of (live) docs may differ from the actual number of
documents if the nested search feature is used.

## Analyzers

### `minhash` Analyzer (Enterprise Edition)

This new Analyzer applies another Analyzer, for example, a `text` Analyzer to
tokenize text into words, and then computes so called *MinHash signatures* from
the tokens using a locality-sensitive hash function. The result lets you
approximate the Jaccard similarity of sets.

A common use case is to compare sets with many elements for entity resolution,
such as for finding duplicate records, based on how many common elements they
have.

You can use the Analyzer with a new inverted index or `arangosearch` View to
quickly find candidates for the actual Jaccard similarity comparisons you want
to perform.

This feature is only available in the Enterprise Edition.

See [Analyzers](analyzers.html#minhash) for details.

### `classification` Analyzer (Enterprise Edition)

A new, experimental Analyzer for classifying individual tokens or entire inputs
using a supervised fastText word embedding model that you provide.

This feature is only available in the Enterprise Edition.

See [Analyzers](analyzers.html#classification) for details.

### `nearest_neighbors` Analyzer (Enterprise Edition)

A new, experimental Analyzer for finding similar tokens
using a supervised fastText word embedding model that you provide.

This feature is only available in the Enterprise Edition.

See [Analyzers](analyzers.html#nearest_neighbors) for details.

## Web Interface

The 3.10 release of ArangoDB introduces a new Web UI for **Views** that allows
you to view, configure, or drop `arangosearch` Views.

## AQL

### All Shortest Paths Graph Traversal

In addition to finding any shortest path and enumerating all paths between two
vertices in order of increasing length, you can now use the new
`ALL_SHORTEST_PATHS` graph traversal algorithm in AQL to get all paths of
shortest length:

```aql
FOR p IN OUTBOUND ALL_SHORTEST_PATHS 'places/Carlisle' TO 'places/London'
  GRAPH 'kShortestPathsGraph'
    RETURN { places: p.vertices[*].label }
```

See [All Shortest Paths in AQL](aql/graphs-all-shortest-paths.html) for details.

### Parallelism for Sharded Graphs (Enterprise Edition)

The 3.10 release supports traversal parallelism for Sharded Graphs,
which means that traversals with many start vertices can now run
in parallel. An almost linear performance improvement has been
achieved, so the parallel processing of threads leads to faster results.

This feature supports all types of graphs - General Graphs, SmartGraphs,
EnterpriseGraphs (including Disjoint).

Traversals with many start vertices can now run in parallel.
A traversal always starts with one single start vertex and then explores
the vertex neighborhood. When you want to explore the neighborhoods of
multiple vertices, you now have the option to do multiple operations in parallel.

The example below shows how to use parallelism to allow using up to three
threads to search for `v/1`, `v/2`, and `v/3` in parallel and independent of one
another. Note that parallelism increases the memory usage of the query due to
having multiple operations performed simultaneously, instead of one after the
other.

```aql
FOR startVertex IN ["v/1", "v/2", "v/3", "v/4"]
FOR v,e,p IN 1..3 OUTBOUND startVertex GRAPH "yourShardedGraph" OPTIONS {parallelism: 3}
[...]
```

This feature is only available in the Enterprise Edition.

### GeoJSON changes

The 3.10 release of ArangoDB conforms to the standards specified in 
[GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946){:target="_blank"}
and [GeoJSON Mode](indexing-geo.html#geojson-mode).
This diverges from the previous implementation in two fundamental ways:

1. The syntax of GeoJSON objects is interpreted so that lines on the
   sphere are geodesics (pieces of great circles). This is in
   particular true for boundaries of polygons. No special treatment
   of longitude-latitude-rectangles is done any more.

2. Linear rings in polygons are no longer automatically normalized so
   that the "smaller" of the two connected components are the interior.
   This allows specifying polygons that cover more than half of
   the surface of the Earth and conforms to the GeoJSON standard.

Additionally, the reported issues, which occasionally produced
wrong results in geo queries when using geo indexes, have been fixed.

For existing users who do not wish to rebuild their geo indexes and
continue using the previous behavior, the `legacyPolygons` index option 
has been introduced to guarantee backwards compatibility.

For existing users who wish to take advantage of the new standard behavior,
geo indexes need to be dropped and recreated after an upgrade.

See [Legacy Polygons](indexing-geo.html#legacy-polygons) for
details and for hints about upgrading to version 3.10 or later.

### Traversal Projections (Enterprise Edition)

Starting with version 3.10, the AQL optimizer automatically detects which
document attributes you access in traversal queries and optimizes the data
loading. This optimization is beneficial if you have large document sizes
but only access small parts of the documents.

By default, up to 5 attributes are extracted instead of loading the full document.
You can control this number with the `maxProjections` option, which is now
supported for [graph traversals](aql/graphs-traversals.html#working-with-named-graphs).
See also [how to use `maxProjections` with FOR loops](aql/operations-for.html#maxprojections).

In the following query, the accessed attributes are the `name` attribute of the
neighbor vertices and the `vertex` attribute of the edges (via the path variable):

```aql
FOR v, e, p IN 1..3 OUTBOUND "persons/alice" GRAPH "knows_graph" OPTIONS { maxProjections: 5 }
  RETURN { name: v.name, vertices: p.edges[*].vertex }
```

The use of projections is indicated in the query explain output:

```aql
Execution plan:
 Id   NodeType          Est.   Comment
  1   SingletonNode        1   * ROOT
  2   TraversalNode        1     - FOR v  /* vertex (projections: `name`) */, p  /* paths: edges (projections: `_from`, `_to`, `vertex`) */ IN 1..3  /* min..maxPathDepth */ OUTBOUND 'persons/alice' /* startnode */  GRAPH 'knows_graph'
  3   CalculationNode      1       - LET #7 = { "name" : v.`name`, "vertex" : p.`edges`[*].`vertex` }   /* simple expression */
  4   ReturnNode           1       - RETURN #7
```

This feature is only available in the Enterprise Edition.

### Number of filtered documents in profiling output

The AQL query profiling output now shows the number of filtered inputs for each execution node
separately, so that it is more visible how often filter conditions are invoked and how effective
they are. Previously the number of filtered inputs was only available as a total value in the
profiling output, and it wasn't clear which execution node caused which amount of filtering.

For example, consider the following query:

```aql
FOR doc1 IN collection
  FILTER doc1.value1 < 1000  /* uses index */
  FILTER doc1.value2 NOT IN [1, 4, 7]  /* post filter */
  FOR doc2 IN collection
    FILTER doc1.value1 == doc2.value2  /* uses index */
    FILTER doc2.value2 != 5  /* post filter */
    RETURN doc2
```

The profiling output for this query now shows how often the filters were invoked for the 
different execution nodes:

```aql
Execution plan:
 Id   NodeType        Calls   Items   Filtered   Runtime [s]   Comment
  1   SingletonNode       1       1          0       0.00008   * ROOT
 14   IndexNode           1     700        300       0.00694     - FOR doc1 IN collection   /* persistent index scan, projections: `value1`, `value2` */    FILTER (doc1.`value2` not in [ 1, 4, 7 ])   /* early pruning */
 13   IndexNode          61   60000      10000       0.11745       - FOR doc2 IN collection   /* persistent index scan */    FILTER (doc2.`value2` != 5)   /* early pruning */
 12   ReturnNode         61   60000          0       0.00212         - RETURN doc2

Indexes used:
 By   Name                      Type         Collection   Unique   Sparse   Selectivity   Fields         Ranges
 14   idx_1727463382256189440   persistent   collection   false    false        99.99 %   [ `value1` ]   (doc1.`value1` < 1000)
 13   idx_1727463477736374272   persistent   collection   false    false         0.01 %   [ `value2` ]   (doc1.`value1` == doc2.`value2`)

Query Statistics:
 Writes Exec   Writes Ign   Scan Full   Scan Index   Cache Hits/Misses   Filtered   Peak Mem [b]   Exec Time [s]
           0            0           0        71000               0 / 0      10300          98304         0.13026
```

### Number of cache hits / cache misses in profiling output

When profiling an AQL query via `db._profileQuery(...)` command or via the web interface, the
query profile output will now contain the number of index entries read from
in-memory caches (usable for edge and persistent indexes) plus the number of cache misses.

In the following example query, there are in-memory caches present for both indexes used in
the query. However, only the innermost index node #13 can use the cache, because the outer
FOR loop does not use an equality lookup.

```aql
Query String (270 chars, cacheable: false):
 FOR doc1 IN collection FILTER doc1.value1 < 1000 FILTER doc1.value2 NOT IN [1, 4, 7]  
 FOR doc2 IN collection FILTER doc1.value1 == doc2.value2 FILTER doc2.value2 != 5 RETURN doc2

Execution plan:
 Id   NodeType        Calls   Items   Filtered   Runtime [s]   Comment
  1   SingletonNode       1       1          0       0.00008   * ROOT
 14   IndexNode           1     700        300       0.00630     - FOR doc1 IN collection   /* persistent index scan, projections: `value1`, `value2` */    FILTER (doc1.`value2` not in [ 1, 4, 7 ])   /* early pruning */
 13   IndexNode          61   60000      10000       0.14254       - FOR doc2 IN collection   /* persistent index scan */    FILTER (doc2.`value2` != 5)   /* early pruning */
 12   ReturnNode         61   60000          0       0.00168         - RETURN doc2

Indexes used:
 By   Name                      Type         Collection   Unique   Sparse   Cache   Selectivity   Fields         Ranges
 14   idx_1727463613020504064   persistent   collection   false    false    true        99.99 %   [ `value1` ]   (doc1.`value1` < 1000)
 13   idx_1727463601873092608   persistent   collection   false    false    true         0.01 %   [ `value2` ]   (doc1.`value1` == doc2.`value2`)

Query Statistics:
 Writes Exec   Writes Ign   Scan Full   Scan Index   Cache Hits/Misses   Filtered   Peak Mem [b]   Exec Time [s]
           0            0           0        71000            689 / 11      10300          98304         0.15389
```

### Index Lookup Optimization

ArangoDB 3.10 features a new optimization for index lookups that can help to
speed up index accesses with post-filter conditions. The optimization is 
triggered if an index is used that does not cover all required attributes for
the query, but the index lookup post-filter conditions only access attributes
that are part of the index.

For example, if you have a collection with an index on `value1` and `value2`,
a query like below can only partially utilize the index for the lookup: 

```aql
FOR doc IN collection
  FILTER doc.value1 == @value1   /* uses the index */
  FILTER ABS(doc.value2) != @value2   /* does not use the index */
  RETURN doc
```

In this case, previous versions of ArangoDB always fetched the full documents
from the storage engine for all index entries that matched the index lookup
conditions. 3.10 will now only fetch the full documents from the storage engine
for all index entries that matched the index lookup conditions, and that satisfy
the index lookup post-filter conditions, too.

If the post-filter conditions filter out a lot of documents, this optimization
can significantly speed up queries that produce large result sets from index
lookups but filter many of the documents away with post-filter conditions.

See [Filter Projections Optimization](aql/execution-and-performance-optimizer.html#filter-projections-optimizations)
for details.

### Lookahead for Multi-Dimensional Indexes

The multi-dimensional index type `zkd` (experimental) now supports an optional
index hint for tweaking performance:

```aql
FOR … IN … OPTIONS { lookahead: 32 }
```

See [Lookahead Index Hint](indexing-multi-dim.html#lookahead-index-hint).

### Question mark operator

The new `[? ... ]` array operator is a shorthand for an inline filter with a
surrounding length check:

```aql
LET arr = [ 1, 2, 3, 4 ]
RETURN arr[? 2 FILTER CURRENT % 2 == 0] // true

/* Equivalent expression:
RETURN LENGTH(arr[* FILTER CURRENT % 2 == 0]) == 2
*/
```

The quantifier can be a number, a range, `NONE`, `ANY`, `ALL`, or `AT LEAST`.

This operator is used for the new [Nested search](#nested-search-enterprise-edition)
feature (Enterprise Edition only).

See [Array Operators](aql/advanced-array-operators.html#question-mark-operator)
for details.

### New `AT LEAST` array comparison operator

You can now combine one of the supported comparison operators with the special
`AT LEAST (<expression>)` operator to require an arbitrary number of elements
to satisfy the condition to evaluate to `true`. You can use a static number or
calculate it dynamically using an expression:

```aql
[ 1, 2, 3 ]  AT LEAST (2) IN  [ 2, 3, 4 ]  // true
["foo", "bar"]  AT LEAST (1+1) ==  "foo"   // false
```

See [Array Comparison Operators](aql/operators.html#array-comparison-operators).

### New and Changed AQL Functions

AQL functions added to the 3.10 Enterprise Edition:

- [`OFFSET_INFO()`](aql/functions-arangosearch.html#offset_info):
  An ArangoSearch function to get the start offsets and lengths of matches for
  [search highlighting](arangosearch-search-highlighting.html).

- [`MINHASH()`](aql/functions-miscellaneous.html#minhash):
  A new function for locality-sensitive hashing to approximate the
  Jaccard similarity.

- [`MINHASH_COUNT()`](aql/functions-miscellaneous.html#minhash_count):
  A helper function to calculate the number of hashes (MinHash signature size)
  needed to not exceed the specified error amount.

- [`MINHASH_ERROR()`](aql/functions-miscellaneous.html#minhash_error):
  A helper function to calculate the error amount based on the number of hashes
  (MinHash signature size).

- [`MINHASH_MATCH()`](aql/functions-arangosearch.html#minhash_match):
  A new ArangoSearch function to match documents with an approximate
  Jaccard similarity of at least the specified threshold that are indexed by a View.

AQL functions added to all editions of 3.10:

- [`SUBSTRING_BYTES()`](aql/functions-string.html#substring_bytes):
  A function to get a string subset using a start and length in bytes instead of
  in number of characters. 

- [`VALUE()`](aql/functions-document.html#value):
  A new document function to dynamically get an attribute value of an object,
  using an array to specify the path.

- [`KEEP_RECURSIVE()`](aql/functions-document.html#keep_recursive):
  A document function to recursively keep attributes from objects/documents,
  as a counterpart to `UNSET_RECURSIVE()`.

AQL functions changed in 3.10:

- [`MERGE_RECURSIVE()`](aql/functions-document.html#merge_recursive):
  You can now call the function with a single argument instead of at least two.
  It also accepts an array of objects now, matching the behavior of the
  `MERGE()` function.

- [`EXISTS()`](aql/functions-arangosearch.html#testing-for-nested-fields):
  The function supports a new signature `EXISTS(doc.attr, "nested")` to check
  whether the specified attribute is indexed as nested field by a View or
  inverted index (introduced in v3.10.1).

### Edge cache refilling (experimental)

<small>Introduced in: v3.9.6, v3.10.2</small>

A new feature to automatically refill the in-memory edge cache is available.
When edges are added, modified, or removed, these changes are tracked and a
background thread tries to update the edge cache accordingly if the feature is
enabled, by adding new, updating existing, or deleting and refilling cache
entries.

You can enable it for individual `INSERT`, `UPDATE`, `REPLACE`,  and `REMOVE`
operations in AQL queries, for individual document API requests that insert,
update, replace, or remove single or multiple edge documents, as well as enable
it by default using the new `--rocksdb.auto-refill-index-caches-on-modify`
startup option.

The new `--rocksdb.auto-refill-index-caches-queue-capacity` startup option
restricts how many edge cache entries the background thread can queue at most.
This limits the memory usage for the case of the background thread being slower
than other operations that invalidate edge cache entries.

The background refilling is done on a best-effort basis and not guaranteed to
succeed, for example, if there is no memory available for the cache subsystem,
or during cache grow/shrink operations. A background thread is used so that
foreground write operations are not slowed down by a lot. It may still cause
additional I/O activity to look up data from the storage engine to repopulate
the cache.

In addition to refilling the edge cache, the cache can also automatically be
seeded on server startup. Use the new `--rocksdb.auto-fill-index-caches-on-startup`
startup option to enable this feature. It may cause additional CPU and I/O load.
You can limit how many index filling operations can execute concurrently with the
`--rocksdb.max-concurrent-index-fill-tasks` option. The lower this number, the
lower the impact of the cache filling, but the longer it takes to complete.

The following metrics are available:

| Label | Description |
|:------|:------------|
| `rocksdb_cache_auto_refill_loaded_total` | Total number of queued items for in-memory index caches refilling.
| `rocksdb_cache_auto_refill_dropped_total` | Total number of dropped items for in-memory index caches refilling.
| `rocksdb_cache_full_index_refills_total` | Total number of in-memory index caches refill operations for entire indexes.

This feature is experimental.

Also see:
- [AQL `INSERT` operation](aql/operations-insert.html#refillindexcaches)
- [AQL `UPDATE` operation](aql/operations-update.html#refillindexcaches)
- [AQL `REPLACE` operation](aql/operations-replace.html#refillindexcaches)
- [AQL `REMOVE` operation](aql/operations-remove.html#refillindexcaches)
- [Document HTTP API](http/document-working-with-documents.html)
- [Edge cache refill options](#edge-cache-refill-options)

## Indexes

### Parallel index creation (Enterprise Edition)

In the Enterprise Edition, non-unique indexes can be created with multiple
threads in parallel. The number of parallel index creation threads is currently 
set to 2, but future versions of ArangoDB may increase this value.
Parallel index creation is only triggered for collections with at least 120,000
documents.

### Storing additional values in indexes

Persistent indexes now allow you to store additional attributes in the index
that can be used to cover more queries without having to look up full documents.
They cannot be used for index lookups or for sorting, but for projections only.

You can specify the additional attributes in the new `storedValues` option when
creating a new persistent index:

```js
db.<collection>.ensureIndex({
  type: "persistent",
  fields: ["value1"],
  storedValues: ["value2"]
});
```

See [Persistent Indexes](indexing-persistent.html#storing-additional-values-in-indexes).

### Enabling caching for index values

Persistent indexes now support in-memory caching of index entries, which can be
used when doing point lookups on the index. You can enable the cache with the
new `cacheEnabled` option when creating a persistent index:

```js
db.<collection>.ensureIndex({
  type: "persistent",
  fields: ["value"],
  cacheEnabled: true
});
```

This can have a great positive effect on index scan performance if the number of
scanned index entries is large.

As the cache is hash-based and unsorted, it cannot be used for full or partial range
scans, for sorting, or for lookups that do not include all index attributes.

See [Persistent Indexes](indexing-persistent.html#caching-of-index-values).

## Document keys

Some key generators can generate keys in an ascending order, meaning that document
keys with "higher" values also represent newer documents. This is true for the
`traditional`, `autoincrement` and `padded` key generators.

Previously, the generated keys were only guaranteed to be truly ascending in single 
server deployments. The reason was that document keys could be generated not only by
the DB-Server, but also by Coordinators (of which there are normally multiple instances). 
While each component would still generate an ascending sequence of keys, the overall 
sequence (mixing the results from different components) was not guaranteed to be 
ascending. 
ArangoDB 3.10 changes this behavior so that collections with only a single 
shard can provide truly ascending keys. This includes collections in OneShard
databases as well.
Also, `autoincrement` key generation is now supported in cluster mode for
single-sharded collections.
Document keys are still not guaranteed to be truly ascending for collections with
more than a single shard.

## Read from Followers in Clusters (Enterprise Edition)

You can now allow for reads from followers for a
number of read-only operations in cluster deployments. In this case, Coordinators
are allowed to read not only from leader shards but also from follower shards.
This has a positive effect, because the reads can scale out to all DB-Servers
that have copies of the data. Therefore, the read throughput is higher.

This feature is only available in the Enterprise Edition.

For more information, see [Read from Followers](http/document-address-and-etag.html#read-from-followers).

## Improved shard rebalancing

Starting with version 3.10, the shard rebalancing feature introduces an
automatic shard rebalancing API. 

You can do any of the following by using the API:

- Get an analysis of the current cluster imbalance.
- Compute a plan of move shard operations to rebalance the cluster and thus improve balance.
- Execute the given set of move shard operations.
- Compute a set of move shard operations to improve balance and execute them immediately. 

For more information, see the [Cluster Administration & Monitoring](http/administration-and-monitoring.html#compute-the-current-cluster-imbalance) 
section of the HTTP API reference manual.

## Query result spillover to decrease memory usage

Queries can be executed with storing intermediate and final results temporarily
on disk to decrease memory usage when a specified threshold is reached, either
based on the memory usage (in bytes) or the number of result rows.

{% hint 'info' %}
This feature is experimental and is turned off by default. It is currently
limited to AQL queries that use `SORT` operations but without a `LIMIT`.
The query results are still built up entirely in memory on Coordinators
and single servers unless you use streaming queries.
{% endhint %}

An example of how to configure the spillover feature:

```
arangod --database.directory "myDir"
--temp.intermediate-results-path "tempDir" 
--temp.intermediate-results-encryption
--temp.intermediate-results-encryption-hardware-acceleration
--temp.intermediate-results-spillover-threshold-memory-usage 134217728
--temp.intermediate-results-spillover-threshold-num-rows 50000
```

You can also set the thresholds per query in the JavaScript and HTTP APIs.

For details, see:
- [`temp` startup options](programs-arangod-options.html#--tempintermediate-results-path)
- [Executing queries from _arangosh_](aql/invocation-with-arangosh.html#spilloverthresholdmemoryusage)
- [Accessing Cursors via HTTP](http/aql-query-cursor-accessing-cursors.html)

## Server options

### Responses early during instance startup

The HTTP interface of _arangod_ instances can now optionally be started earlier
during the startup process, so that ping probes from monitoring tools can
already be responded to when the instance has not fully started.

You can set the new `--server.early-connections` startup option to `true` to
let the instance respond to the `/_api/version`, `/_admin/version`, and
`/_admin/status` REST APIs early.

See [Responding to Liveliness Probes](http/general.html#responding-to-liveliness-probes).

### Cache RocksDB index and filter blocks by default

The default value of the `--rocksdb.cache-index-and-filter-blocks` startup option was changed
from `false` to `true`. This makes RocksDB track all loaded index and filter blocks in the 
block cache, so they are accounted against the RocksDB's block cache memory limit. 
The default value for the `--rocksdb.enforce-block-cache-size-limit` startup option was also
changed from `false` to `true` to make the RocksDB block cache not temporarily exceed the 
configured memory limit.

These default value changes will make RocksDB adhere much better to the configured memory limit
(configurable via `--rocksdb.block-cache-size`). 
The changes may have a small negative impact on performance because, if the block cache is 
not large enough to hold the data plus the index and filter blocks, additional disk I/O may 
need to be performed compared to the previous versions. 
This is a trade-off between memory usage predictability and performance, and ArangoDB 3.10
will default to more stable and predictable memory usage. If there is still unused RAM 
capacity available, it may be sensible to increase the total size of the RocksDB block cache,
by increasing `--rocksdb.block-cache-size`. Due to the changed configuration, the block 
cache size limit will not be exceeded anymore.

It is possible to opt out of these changes and get back the memory and performance characteristics
of previous versions by setting the `--rocksdb.cache-index-and-filter-blocks` 
and `--rocksdb.enforce-block-cache-size-limit` startup options to `false` on startup.

### RocksDB range delete operations in cluster

The new `--rocksdb.use-range-delete-in-wal` startup option controls whether the
collection truncate operation in a cluster can use RangeDelete operations in
RocksDB. Using RangeDeletes is fast and reduces the algorithmic complexity of
the truncate operation to O(1), compared to O(n) when this option is turned off
(with n being the number of documents in the collection/shard).

Previous versions of ArangoDB used RangeDeletes only on a single server, but
never in a cluster.

The default value for this startup option is `true`, and the option should only
be changed in case of emergency. This option is only honored in the cluster.
Single server and Active Failover deployments use RangeDeletes regardless of the
value of this option.

Note that it is not guaranteed that all truncate operations use a RangeDelete
operation. For collections containing a low number of documents, the O(n)
truncate method may still be used.

### Pregel configuration options

There are now several startup options to configure the parallelism of Pregel jobs:

- `--pregel.min-parallelism`: minimum parallelism usable in Pregel jobs.
- `--pregel.max-parallelism`: maximum parallelism usable in Pregel jobs.
- `--pregel.parallelism`: default parallelism to use in Pregel jobs.

Administrators can use these options to set concurrency defaults and bounds 
for Pregel jobs on an instance level.

There are also new startup options to configure the usage of memory-mapped files for Pregel 
temporary data:

- `--pregel.memory-mapped-files`: to specify whether to use memory-mapped files or RAM for
  storing temporary Pregel data.

- `--pregel.memory-mapped-files-location-type`: to set a location for memory-mapped
  files written by Pregel. This option is only meaningful, if memory-mapped
  files are used. 

For more information on the new options, please refer to [ArangoDB Server Pregel Options](programs-arangod-options.html#pregel).

### Query spillover options

The following new options are available to control the
[Query spillover feature](#query-result-spillover-to-decrease-memory-usage).

- `--temp.intermediate-results-path`
- `--temp.intermediate-results-encryption` (Enterprise Edition only)
- `--temp.intermediate-results-encryption-hardware-acceleration` (Enterprise Edition only)
- `--temp.intermediate-results-spillover-threshold-memory-usage`
- `--temp.intermediate-results-spillover-threshold-num-rows`

### AQL query logging

<small>Introduced in: v3.9.5, v3.10.2</small>

There are three new startup options to configure how AQL queries are logged:

- `--query.log-failed` for logging all failed AQL queries, to be used during
  development or to catch unexpected failed queries in production (off by default)
- `--query.log-memory-usage-threshold` to define a peak memory threshold from
  which on a warning is logged for AQL queries that exceed it (default: 4 GB)
- `--query.max-artifact-log-length` for controlling the length of logged query
  strings and bind parameter values. Both are truncated to 4096 bytes by default.

### ArangoSearch column cache limit

<small>Introduced in: v3.9.5, v3.10.2</small>

The new `--arangosearch.columns-cache-limit` startup option lets you control how
much memory (in bytes) the [ArangoSearch column cache](#arangosearch-column-cache-enterprise-edition)
is allowed to use.

### Cluster supervision options

<small>Introduced in: v3.9.6, v3.10.2</small>

The following new options allow you to delay supervision actions for a
configurable amount of time. This is desirable in case DB-Servers are restarted
or fail and come back quickly because it gives the cluster a chance to get in
sync and fully resilient without deploying additional shard replicas and thus
without causing any data imbalance:

- `--agency.supervision-delay-add-follower`:
  The delay in supervision, before an AddFollower job is executed (in seconds).

- `--agency.supervision-delay-failed-follower`:
  The delay in supervision, before a FailedFollower job is executed (in seconds).

### Edge cache refill options

<small>Introduced in: v3.9.6, v3.10.2</small>

- `--rocksdb.auto-refill-index-caches-on-modify`: Whether to automatically
  (re-)fill in-memory edge cache entries on insert/update/replace operations
  by default. Default: `false`.
- `--rocksdb.auto-refill-index-caches-queue-capacity`: How many changes can be
  queued at most for automatically refilling the edge cache. Default: `131072`.
- `--rocksdb.auto-fill-index-caches-on-startup`: Whether to automatically fill
  the in-memory edge cache with entries on server startup. Default: `false`.
- `--rocksdb.max-concurrent-index-fill-tasks`: The maximum number of index fill
  tasks that can run concurrently on server startup. Default: the number of
  cores divided by 8, but at least `1`.

### Agency option to control whether a failed leader adds a shard follower

<small>Introduced in: v3.9.7, v3.10.2</small>

A `--agency.supervision-failed-leader-adds-follower` startup option has been
added with a default of `true` (behavior as before). If you set this option to
`false`, a `FailedLeader` job does not automatically configure a new shard
follower, thereby preventing unnecessary network traffic, CPU load, and I/O load
for the case that the server comes back quickly. If the server has permanently
failed, an `AddFollower` job is created anyway eventually.

## Miscellaneous changes

### Optimizer rules endpoint

Added the `GET /_api/query/rules` REST API endpoint that returns the available
optimizer rules for AQL queries.

### Additional metrics for caching subsystem

The caching subsystem now provides the following 3 additional metrics:
- `rocksdb_cache_active_tables`: total number of active hash tables used for
  caching index values. There should be 1 table per shard per index for which
  the in-memory cache is enabled. The number also includes temporary tables
  that are built when migrating existing tables to larger equivalents.
- `rocksdb_cache_unused_memory`: total amount of memory used for inactive
  hash tables used for caching index values. Some inactive tables can be kept
  around after use, so they can be recycled quickly. The overall amount of
  inactive tables is limited, so not much memory will be used here.
- `rocksdb_cache_unused_tables`: total number of inactive hash tables used
  for caching index values. Some inactive tables are kept around after use, 
  so they can be recycled quickly. The overall amount of inactive tables is
  limited, so not much memory will be used here.

### Replication improvements

For synchronous replication of document operations in the cluster, the follower
can now return smaller responses to the leader. This change reduces the network
traffic between the leader and its followers, and can lead to slightly faster
turnover in replication.

### Calculation of file hashes (Enterprise Edition)

The calculation of SHA256 file hashes for the .sst files created by RocksDB and
that are required for hot backups has been moved from a separate background
thread into the actual RocksDB operations that write out the .sst files.

The SHA256 hashes are now calculated incrementally while .sst files are being
written, so that no post-processing of .sst files is necessary anymore.
The previous background thread named `Sha256Thread`, which was responsible for
calculating the SHA256 hashes and sometimes for high CPU utilization after
larger write operations, has now been fully removed.

### Traffic accounting metrics

<small>Introduced in: v3.8.9, v3.9.6, v3.10.2</small>

The following metrics for traffic accounting were added:

| Label | Description |
|:------|:------------|
| `arangodb_client_user_connection_statistics_bytes_received` | Bytes received for requests, only user traffic. |
| `arangodb_client_user_connection_statistics_bytes_sent` | Bytes sent for responses, only user traffic.
| `arangodb_http1_connections_total` | Total number of HTTP/1.1 connections accepted. |

### Configurable `CACHE_OBLIVIOUS` option for jemalloc

<small>Introduced in: v3.9.7, v3.10.3</small>

The jemalloc memory allocator supports an option to toggle cache-oblivious large
allocation alignment. It is enabled by default up to v3.10.3, but disabled from
v3.10.4 onwards. Disabling it helps to save 4096 bytes of memory for every
allocation which is at least 16384 bytes large. This is particularly beneficial
for the RocksDB buffer cache.

You can now configure the option by setting a `CACHE_OBLIVIOUS` environment
variable to the string `true` or `false` before starting ArangoDB.

See [ArangoDB Server environment variables](programs-arangod-env-vars.html)
for details.

## Client tools

### arangobench

_arangobench_ has a new `--create-collection` startup option that can be set to `false`
to skip setting up a new collection for the to-be-run workload. That way, some
workloads can be run on already existing collections.

### arangoexport

_arangoexport_ has a new `--custom-query-bindvars` startup option that lets you set
bind variables that you can now use in the `--custom-query` option
(renamed from `--query`):

```bash
arangoexport \
  --custom-query 'FOR book IN @@@@collectionName FILTER book.sold > @@sold RETURN book' \
  --custom-query-bindvars '{"@@collectionName": "books", "sold": 100}' \
  ...
```

Note that you need to escape at signs in command-lines by doubling them (see
[Environment variables as parameters](administration-configuration.html#environment-variables-as-parameters)).

_arangoexport_ now also has a `--custom-query-file` startup option that you can
use instead of `--custom-query`, to read a query from a file. This allows you to
store complex queries and no escaping is necessary in the file:

```aql
// example.aql
FOR book IN @@collectionName
  FILTER book.sold > @sold
  RETURN book
```

```bash
arangoexport \
  --custom-query-file example.aql \
  --custom-query-bindvars '{"@@collectionName": "books", "sold": 100}' \
  ...
```

### arangoimport

_arangoimport_ has a new `--overwrite-collection-prefix` option that is useful
when importing edge collections. This option should be used together with
`--to-collection-prefix` or `--from-collection-prefix`.
If there are vertex collection prefixes in the file you want to import,
you can overwrite them with prefixes specified on the command line. If the option is set
to `false`, only `_from` and `_to` values without a prefix are going to be
prefixed by the entered values.

_arangoimport_ now supports the `--remove-attribute` option when using JSON
as input file format.
For more information, refer to the [_arangoimport_ Options](programs-arangoimport-options.html).

### ArangoDB Starter

_ArangoDB Starter_ has a new feature that allows you to configure the binary
by reading from a configuration file. The default configuration file of the Starter
is `arangodb-starter.conf` and can be changed using the `--configuration` option. 

See the [Starter configuration file](programs-starter-architecture.html#starter-configuration-file)
section for more information about the configuration file format, passing
through command line options, and examples. 

## Internal changes

### C++20 

ArangoDB is now compiled using the `-std=c++20` compile option on Linux and MacOS.
A compiler with c++-20 support is thus needed to compile ArangoDB from source.

### Upgraded bundled library versions

The bundled version of the RocksDB library has been upgraded from 6.8.0 to 7.2.

The bundled version of the Boost library has been upgraded from 1.71.0 to 1.78.0.

The bundled version of the immer library has been upgraded from 0.6.2 to 0.7.0.

The bundled version of the jemalloc library has been upgraded from 5.2.1-dev to 5.3.0.

The bundled version of the zlib library has been upgraded from 1.2.11 to 1.2.12.

For ArangoDB 3.10, the bundled version of rclone is 1.59.0.
