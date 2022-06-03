---
layout: default
description: ArangoDB v3.10 Release Notes New Features
---
Features and Improvements in ArangoDB 3.10
==========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.10. ArangoDB 3.10 also contains several bug fixes that are not listed
here.

ArangoSearch
------------



UI
--



AQL
---

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

### Number of filtered documents in profiling output

The AQL query profiling output now shows the number of filtered inputs for each execution node
separately, so that it is more visible how often filter conditions are invoked and how effective
they are. Previously the number of filtered inputs was only available as a total value in the
profiling output, and it wasn't clear which execution node caused which amount of filtering.

For example, consider the following query:

```js
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

```js
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

When profiling an AQL query via `db._profileQuery(...)` command or via the web UI, the
query profile output will now contain the number of index entries read from
in-memory caches (usable for edge and persistent indexes) plus the number of cache misses.

In the following example query, there are in-memory caches present for both indexes used in
the query. However, only the innermost index node #13 can use the cache, because the outer
FOR loop does not use an equality lookup.

```
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

### Lookahead for Multi-Dimensional Indexes

The multi-dimensional index type `zkd` (experimental) now supports an optional
index hint for tweaking performance:

```js
FOR … IN … OPTIONS { lookahead: 32 }
```

See [Lookahead Index Hint](indexing-multi-dim.html#lookahead-index-hint).

### New AQL Functions

AQL functions added in 3.10:

- [`KEEP_RECURSIVE()`](aql/functions-document.html#keep_recursive):
  a document function to recursively keep attributes from objects/documents,
  as a counterpart to `UNSET_RECURSIVE()`

Indexes
-------

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

SmartGraphs (Enterprise Edition)
--------------------------------

### SmartGraphs and SatelliteGraphs on a single server

It is now possible to test [SmartGraphs](graphs-smart-graphs.html) and
[SatelliteGraphs](graphs-satellite-graphs.html) on a single server and then to
port them to a cluster with multiple servers.

You can create SmartGraphs, Disjoint SmartGraphs, Hybrid SmartGraphs,
Hybrid Disjoint SmartGraphs, as well as SatelliteGraphs in the usual way, using
`arangosh` for instance, but on a single server, then dump them, start a cluster
(with multiple servers) and restore the graphs in the cluster. The graphs and
the collections will keep all properties that are kept when the graph is already
created in a cluster.

This feature is only available in the Enterprise Edition.

Server options
--------------

### Responses early during instance startup

The HTTP interface of _arangod_ instances can now optionally be started earlier
during the startup process, so that ping probes from monitoring tools can
already be responded to when the instance has not fully started.

You can set the new `--server.early-connections` startup option to `true` to
let the instance respond to the `/_api/version`, `/_admin/version`, and
`/_admin/status` REST APIs early.

See [Responding to Liveliness Probes](http/general.html#responding-to-liveliness-probes).

### RocksDB startup options

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

The new `--rocksdb.use-range-delete-in-wal` startup option controls whether the collection 
truncate operation in a cluster can use RangeDelete operations in RocksDB. Using RangeDeletes
is fast and reduces the algorithmic complexity of the truncate operation to O(1), compared to
O(n) when this option is turned off (with n being the number of documents in the 
collection/shard).
Previous versions of ArangoDB used RangeDeletes only on a single server, but never in a cluster. 

The default value for this startup option is `true`, and the option should only be changed in
case of emergency. This option is only honored in the cluster. Single server and active failover
deployments will use RangeDeletes regardless of the value of this option.

Note that it is not guaranteed that all truncate operations will use a RangeDelete operation. 
For collections containing a low number of documents, the O(n) truncate method may still be used.

Miscellaneous changes
---------------------

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

### Calculation of file hashes

The calculation of SHA256 file hashes for the .sst files created by RocksDB and
that are required for hot backups has been moved from a separate background
thread into the actual RocksDB operations that write out the .sst files.

The SHA256 hashes are now calculated incrementally while .sst files are being
written, so that no post-processing of .sst files is necessary anymore.
The previous background thread named `Sha256Thread`, which was responsible for
calculating the SHA256 hashes and sometimes for high CPU utilization after
larger write operations, has now been fully removed.

Client tools
------------

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

```js
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

Internal changes
----------------

### C++20 

ArangoDB is now compiled using the `-std=c++20` compile option on Linux and MacOS.
A compiler with c++-20 support is thus needed to compile ArangoDB from source.

### Upgraded bundled library versions

The bundled version of the RocksDB library has been upgraded from 6.8.0 to 6.29.0.

The bundled version of the Boost library has been upgraded from 1.71.0 to 1.78.0.

The bundled version of the immer library has been upgraded from 0.6.2 to 0.7.0.

The bundled version of the jemalloc library has been upgraded from 5.2.1-dev to 5.3.0.

The bundled version of the zlib library has been upgraded from 1.2.11 to 1.2.12.
