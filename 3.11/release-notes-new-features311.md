---
layout: default
description: ArangoDB v3.11 Release Notes New Features
---
# Features and Improvements in ArangoDB 3.11

The following list shows in detail which features have been added or improved in
ArangoDB 3.11. ArangoDB 3.11 also contains several bug fixes that are not listed
here.

## Analyzers

### `geo_s2` Analyzer (Enterprise Edition)

This new Analyzer lets you index GeoJSON data with inverted indexes or Views
similar to the existing `geojson` Analyzer, but it internally uses a format for
storing the geo-spatial data that is more efficient.

You can choose between different formats to make a tradeoff between the size on
disk, the precision, and query performance:

- 8 bytes per coordinate pair using 4-byte integer values, with limited precision.
- 16 bytes per coordinate pair using 8-byte floating-point values, which is still
  more compact than the VelocyPack format used by the `geojson` Analyzer
- 24 bytes per coordinate pair using the native Google S2 format to reduce the number
  of computations necessary when you execute geo-spatial queries.

This feature is only available in the Enterprise Edition.

See [Analyzers](analyzers.html#geo_s2) for details.

## Web interface

### `search-alias` Views

The 3.11 release of ArangoDB introduces a new web interface for Views that lets
you to create and manage [`search-alias` Views](arangosearch-views-search-alias.html).

Through this dialog, you can easily create a new View and add to it one or more
inverted indexes from your collections that you could otherwise do via the HTTP
or JavaScript API.

When opening your newly created View, you can copy mutable properties from
previously created `search-alias` Views, providing a convenient way to apply
the same settings to multiple Views. In addition, the JSON editor offers the
option to directly write the definition of your View in JSON format.

For more information, see the
[detailed guide](arangosearch-views-search-alias.html#create-search-alias-views-using-the-web-interface).

### `arangosearch` Views

The existing way of creating and managing `arangosearch` Views through the
web interface has been redesigned, offering a more straightforward approach to add
or modify the definition of your View. The settings, links, and JSON editor have
been merged into a single page, allowing for a much quicker workflow.

For more information, see the
[detailed guide](arangosearch-views.html#create-arangosearch-views-using-the-web-interface).

### Inverted indexes

The web interface now includes the option for creating
[inverted indexes](indexing-inverted.html) on collections. You can set all the
properties directly in the web interface, which previously required the JavaScript
or HTTP API. It also offers an editor where you can write the definition of
your inverted index in JSON format.

### New sorting mechanism and search box for Saved Queries

When working with **Saved Queries** in the web interface, you can now
configure their sort order so that your saved queries are listed by the
date they were last modified.
This is particularly helpful when you have a large amount of saved custom
queries and want to see which ones have been created or used recently.

In addition, the web interface also offers a search box which helps you
quickly find the query you're looking for. 

## AQL

### Added AQL functions

Added the `DATE_ISOWEEKYEAR()` function that returns the ISO week number,
like `DATE_ISOWEEK()` does, but also the year it belongs to:

```aql
RETURN DATE_ISOWEEKYEAR("2023-01-01") // { "week": 52, "year": 2022 }
```

See [AQL Date functions](aql/functions-date.html#date_isoweekyear) for details.

### Index cache refilling

The [edge cache refilling](release-notes-new-features310.html#edge-cache-refilling-experimental)
feature introduced in v3.9.6 and v3.10.2 is no longer experimental. From v3.11.0
onward, it is called _**index** cache refilling_ and not limited to edge caches
anymore, but also supports in-memory hash caches of persistent indexes
(persistent indexes with the `cacheEnabled` option set to `true`).

### Retry request for result batch

You can retry the request for the latest result batch of an AQL query cursor if
you enable the new `allowRetry` query option. See
[API Changes in ArangoDB 3.11](release-notes-api-changes311.html#cursor-api)
for details.

### `COLLECT ... INTO` can use `hash` method

Grouping with the `COLLECT` operation supports two different methods, `hash` and
`sorted`. For `COLLECT` operations with an `INTO` clause, only the `sorted` method
was previously supported, but the `hash` variant has been extended to now support
`INTO` clauses as well.

```aql
FOR i IN 1..10
  COLLECT v = i % 2 INTO group // OPTIONS { method: "hash" }
  SORT null
  RETURN { v, group }
```

```aql
Execution plan:
 Id   NodeType            Est.   Comment
  1   SingletonNode          1   * ROOT
  2   CalculationNode        1     - LET #3 = 1 .. 10   /* range */   /* simple expression */
  3   EnumerateListNode     10     - FOR i IN #3   /* list iteration */
  4   CalculationNode       10       - LET #5 = (i % 2)   /* simple expression */
  5   CollectNode            8       - COLLECT v = #5 INTO group KEEP i   /* hash */
  8   CalculationNode        8       - LET #9 = { "v" : v, "group" : group }   /* simple expression */
  9   ReturnNode             8       - RETURN #9
```

The query optimizer automatically chooses the `hash` method for the above
example query, but you can also specify your preferred method explicitly.

See the [`COLLECT` options](aql/operations-collect.html#method) for details.

### Parallel gather

On Coordinators in cluster deployments, results from different DB-Servers are
combined into a stream of results. This process is called gathering. It shows as
`GatherNode` nodes in the execution plan of AQL queries.

Previously, a cluster AQL query could only parallelize a `GatherNode` if the
DB-Server query part above it (in terms of query execution plan layout) was a
terminal part of the query. That means that it was not allowed for other nodes of
type `ScatterNode`, `GatherNode`, or `DistributeNode` to be present in the query.

Modification queries were also not allowed to use parallel gather unless the
`--query.parallelize-gather-writes` startup option was enabled, which defaulted
to `false`.

From v3.11.0 onward, these limitations are removed so that parallel gather can be
used in almost all queries. As a result, the feature is enabled by default and
the `--query.parallelize-gather-writes` startup option is now obsolete. You can
still disable the optimization by disabling the `parallelize-gather` AQL
optimizer rule.

The only case where parallel gather is not supported is when using traversals,
although there are some exceptions for Disjoint SmartGraphs where the traversal
can run completely on the local DB-Server (only available in the Enterprise Edition).

The parallel gather optimization can not only speed up queries quite significantly,
but also overcome issues with the previous serial processing within `GatherNode`
nodes, which could lead to high memory usage on Coordinators caused by buffering
of documents for other shards, and timeouts on some DB-Servers because query parts
were idle for too long.

### Optimized access of last element in traversals

If you use a `FOR` operation for an AQL graph traversal like `FOR v, e, p IN ...`
and later access the last vertex or edge via the path variable `p`, like
`FILTER p.vertices[-1].name == "ArangoDB"` or `FILTER p.edges[-1].weight > 5`,
the access is transformed to use the vertex variable `v` or edge variable `e`
instead, like `FILTER v.name == "ArangoDB"` or `FILTER e.weight > 5`. This is
cheaper to compute because the path variable `p` may not need to be computed at
all, and it can enable further optimizations that are not possible on `p`.

The new `optimize-traversal-last-element-access` optimization rule appears in
query execution plans if this optimization is applied.

### Extended peak memory usage reporting

The peak memory usage of AQL queries is now also reported for running queries
and slow queries.

In the web interface, you can find the **Peak memory usage** column in the
**QUERIES** section, in the **Running Queries** and **Slow Query History** tabs.

In the JavaScript and HTTP APIs, the value is reported as `peakMemoryUsage`.
See [API Changes in ArangoDB 3.11](release-notes-api-changes311.html#query-api).

## Server options

### Verify `.sst` files

The new `--rocksdb.verify-sst` startup option lets you validate the `.sst` files
currently contained in the database directory on startup. If set to `true`,
on startup, all SST files in the `engine-rocksdb` folder in the database
directory are validated, then the process finishes execution.
The default value is `false`.

### Support for additional value suffixes

Numeric startup options support suffixes like `m` (megabytes) and `GiB` (gibibytes)
to make it easier to specify values that are expected in bytes. The following
suffixes are now also supported:

- `tib`, `TiB`, `TIB`: tebibytes (factor 1024<sup>4</sup>)
- `t`, `tb`, `T`, `TB`: terabytes (factor 1000<sup>4</sup>)
- `b`, `B`: bytes (factor 1)

Example: `arangod --rocksdb.total-write-buffer-size 2TiB`

See [Suffixes for numeric options](administration-configuration.html#suffixes-for-numeric-options)
for details.

### Disable user-defined AQL functions

The new `--javascript.user-defined-functions` startup option lets you disable
user-defined AQL functions so that no user-defined JavaScript code of
[UDFs](aql/extending.html) runs on the server. Also see
[Server security options](security-security-options.html).

### Configurable status code if write concern not fulfilled

In cluster deployments, you can use a replication factor greater than `1` for
collections. This creates additional shard replicas for redundancy. For write
operations to these collections, you can define how many replicas need to
acknowledge the write for the operation to succeed. This option is called the
write concern. If there are not enough in-sync replicas available, the
write concern cannot be fulfilled. An error with the HTTP `403 Forbidden`
status code is returned immediately in this case.

You can now change the status code via the new
`--cluster.failed-write-concern-status-code` startup option. It defaults to `403`
but you can set it to `503` to use an HTTP `503 Service Unavailable` status code
instead. This signals client applications that it is a temporary error.

Note that no automatic retry of the operation is attempted by the cluster if you
set the startup option to `503`. It only changes the status code to one that
doesn't signal a permanent error like `403` does.
It is up to client applications to retry the operation.

### RocksDB auto-flushing

<small>Introduced in: v3.9.10, v3.10.5</small>

A new feature for automatically flushing RocksDB Write-Ahead Log (WAL) files and
in-memory column family data has been added.

An auto-flush occurs if the number of live WAL files exceeds a certain threshold.
This ensures that WAL files are moved to the archive when there are a lot of
live WAL files present, for example, after a restart. In this case, RocksDB does
not count any previously existing WAL files when calculating the size of WAL
files and comparing its `max_total_wal_size`. Auto-flushing fixes this problem,
but may prevent WAL files from being moved to the archive quickly.

You can configure the feature via the following new startup options:
- `--rocksdb.auto-flush-min-live-wal-files`:
  The minimum number of live WAL files that triggers an auto-flush. Defaults to `10`.
- `--rocksdb.auto-flush-check-interval`:
  The interval (in seconds) in which auto-flushes are executed. Defaults to `3600`.
  Note that an auto-flush is only executed if the number of live WAL files
  exceeds the configured threshold and the last auto-flush is longer ago than
  the configured auto-flush check interval. This avoids too frequent auto-flushes.

## Miscellaneous changes

### Trace logs for graph traversals and path searches

Detailed information is now logged if you run AQL graph traversals
or (shortest) path searches with AQL and set the
log level to `TRACE` for the `graphs` log topic. This information is fairly
low-level but can help to understand correctness and performance issues with
traversal queries. There are also some new log messages for the `DEBUG` level.

To enable tracing for traversals and path searches at startup, you can set
`--log.level graphs=trace`.

To enable or disable it at runtime, you can call the
[`PUT /_admin/log/level`](http/monitoring.html#modify-and-return-the-current-server-log-level)
endpoint of the HTTP API and set the log level using a request body like
`{"graphs":"TRACE"}`.
