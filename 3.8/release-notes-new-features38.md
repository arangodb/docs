---
layout: default
description: ArangoDB v3.8 Release Notes New Features
---
Features and Improvements in ArangoDB 3.8
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.8. ArangoDB 3.8 also contains several bug fixes that are not listed
here.

AQL window operations
---------------------

The `WINDOW` keyword can be used for aggregations over related rows, usually
preceding and / or following rows.

The `WINDOW` operation performs a `COLLECT AGGREGATE`-like operation on a set
of query rows. However, whereas a `COLLECT` operation groups multiple query
rows into a single result group, a `WINDOW` operation produces a result for
each query row:

- The row for which function evaluation occurs is called the current row.
- The query rows related to the current row over which function evaluation
  occurs, comprise the window frame for the current row.

Window frames are determined with respect to the current row:

- By defining a window frame to be all rows from the query start to the current
  row, you can compute running totals for each row.
- By defining a frame as extending *N* rows on either side of the current row,
  you can compute rolling averages.

See [`WINDOW` operation](aql/operations-window.html).

Weighted Traversals
-------------------

The graph traversal option `bfs` is now deprecated and superseded by the new
option `order`. It supports a new traversal type `"weighted"`, which enumerate
paths by increasing weights.

The cost of an edge can be read from an attribute which can be specified with
the `weightAttribute` option.

```js
FOR x, v, p IN 0..10  "places/York" GRAPH "kShortestPathsGraph"
    OPTIONS {
      order: "weighted",
      weightAttribute: "travelTime",
      uniqueVertices: "path"
    }
    FILTER p.edges[*].travelTime ALL < 3
    LET totalTime = LAST(p.weights)
    FILTER totalTime < 6
    SORT totalTime DESC
    RETURN {
      path: p.vertices[*]._key,
      weight: LAST(p.weights),
      weights: p.edges[*].travelTime
    }
```

`path` | `weight` | `weights`
:------|:---------|:---------
`["York","London","Birmingham","Carlisle"]` | `5.3` | `[1.8,2.5,1]`
`["York","London","Birmingham"]`            | `4.3` | `[1.8,2.5]`
`["York","London","Brussels"]`              | `4.3` | `[1.8,2.5]`
`["York","London"]`                         | `1.8` | `[1.8]`
`["York"]`                                  |   `0` | `[]`

The preferred way to start a breadth-first search from now on is with
`order: "bfs"`. The default remains depth-first search if no `order` is
specified, but can also be explicitly requested with `order: "dfs"`.

Also see [AQL graph traversals](aql/graphs-traversals.html)

ArangoSearch
------------

### Pipeline Analyzer

Added new Analyzer type `"pipeline"` for chaining effects of multiple Analyzers
into one. It allows you to combine text normalization for a case insensitive
search with ngram tokenization, or to split text at multiple delimiting
characters followed by stemming.

See [ArangoSearch Pipeline Analyzer](arangosearch-analyzers.html#pipeline)

### AQL Analyzer

Added new Analyzer type `"aql"` capable of running an AQL query (with some
restrictions) to perform data manipulation/filtering.

See [ArangoSearch AQL Analyzer](arangosearch-analyzers.html#aql)

### Geo-spatial queries

Added two Geo Analyzers [`"geojson"`](arangosearch-analyzers.html#geojson)
and [`"geopoint"`](arangosearch-analyzers.html#geopoint) as well as the
following [ArangoSearch Geo functions](aql/functions-arangosearch.html#geo-functions)
which enable geo-spatial queries backed by View indexes:
- `GEO_CONTAINS()`
- `GEO_DISTANCE()`
- `GEO_IN_RANGE()`
- `GEO_INTERSECTS()`

### ArangoSearch thread control

Added new command line options for fine-grained control over ArangoSearch's
maintenance threads, now allowing to set the minimum and maximum number of
threads for committing and consolidation separately:

- `--arangosearch.commit-threads`
- `--arangosearch.commit-threads-idle`
- `--arangosearch.consolidation-threads`
- `--arangosearch.consolidation-threads-idle`

They supersede the options `--arangosearch.threads` and
`--arangosearch.threads-limit`. See
[ArangoDB Server ArangoSearch Options](programs-arangod-arangosearch.html).

Metrics
-------

The following server metrics have been added to the
[Metrics HTTP API](http/administration-and-monitoring-metrics.html)
in ArangoDB 3.8 and can be used for monitoring and alerting:

| Label | Description |
|:------|:------------|
| `arangodb_aql_all_query` | Total number of all AQL queries (including slow queries) |
| `arangodb_aql_query_time` | Histogram with AQL query times distribution (s) |
| `arangodb_aql_slow_query_time` | Histogram with AQL slow query times distribution (s) |
| `arangodb_aql_slow_query` | Total number of slow AQL queries |
| `arangodb_collection_lock_acquisition_micros` | Total amount of collection lock acquisition time (μs) |
| `arangodb_collection_lock_acquisitiontime` | Collection lock acquisition time histogram (s) |
| `arangodb_collection_lock_timeouts_exclusive` | Number of timeouts when trying to acquire collection exclusive locks |
| `arangodb_collection_lock_timeouts_write` | Number of timeouts when trying to acquire collection write locks |
| `arangodb_http_request_statistics_superuser_requests` | Total number of HTTP requests executed by superuser/JWT |
| `arangodb_http_request_statistics_user_requests` | Total number of HTTP requests executed by clients |
| `arangodb_network_forwarded_requests` | Number of requests forwarded from one Coordinator to another in a load-balancing setup |
| `arangodb_refused_followers_count` | Number of refusal answers from a follower during synchronous replication |
| `arangodb_replication_dump_apply_time` | Time required for applying data from replication dump responses (ms) |
| `arangodb_replication_dump_bytes_received` | Number of bytes received in replication dump requests |
| `arangodb_replication_dump_documents` | Number of documents received in replication dump requests |
| `arangodb_replication_dump_request_time` | Wait time for replication dump requests (ms) |
| `arangodb_replication_dump_requests` | Number of replication dump requests made |
| `arangodb_replication_failed_connects` | Number of failed connection attempts and response errors during replication |
| `arangodb_replication_initial_chunks_requests_time` | Wait time for replication key chunks determination requests (ms) |
| `arangodb_replication_initial_docs_requests_time` | Time needed to apply replication docs data (ms) |
| `arangodb_replication_initial_insert_apply_time` | Time needed to apply replication initial sync insertions (ms) |
| `arangodb_replication_initial_keys_requests_time` | Wait time for replication keys requests (ms) |
| `arangodb_replication_initial_lookup_time` | Time needed for replication initial sync key lookups (ms) |
| `arangodb_replication_initial_remove_apply_time` | Time needed to apply replication initial sync removals (ms) |
| `arangodb_replication_initial_sync_bytes_received` | Number of bytes received during replication initial sync |
| `arangodb_replication_initial_sync_docs_inserted` | Number of documents inserted by replication initial sync |
| `arangodb_replication_initial_sync_docs_removed` | Number of documents inserted by replication initial sync |
| `arangodb_replication_initial_sync_docs_requested` | Number of documents requested via replication initial sync requests |
| `arangodb_replication_initial_sync_docs_requests` | Number of replication initial sync docs requests made |
| `arangodb_replication_initial_sync_keys_requests` | Number of replication initial sync keys requests made |
| `arangodb_replication_tailing_apply_time` | Time needed to apply replication tailing markers (ms) |
| `arangodb_replication_tailing_bytes_received` | Number of bytes received for replication tailing requests |
| `arangodb_replication_tailing_documents` | Number of replication tailing document inserts/replaces processed |
| `arangodb_replication_tailing_follow_tick_failures` | Number of replication tailing failures due to missing tick on leader |
| `arangodb_replication_tailing_markers` | Number of replication tailing markers processed |
| `arangodb_replication_tailing_removals` | Number of replication tailing document removals processed |
| `arangodb_replication_tailing_request_time` | Wait time for replication tailing requests (ms) |
| `arangodb_replication_tailing_requests` | Number of replication tailing requests |
| `arangodb_rocksdb_free_disk_space` | Free disk space for the RocksDB database directory mount (bytes) |
| `arangodb_rocksdb_total_disk_space` | Total disk space for the RocksDB database directory mount (bytes) |
| `arangodb_scheduler_threads_started` | Number of scheduler threads started |
| `arangodb_scheduler_threads_stopped` | Number of scheduler threads stopped |
| `arangodb_sync_wrong_checksum` | Number of times a mismatching shard checksum was detected when syncing shards |
| `rocksdb_free_inodes` | Number of free inodes for the file system with the RocksDB database directory (always `0` on Windows) |
| `rocksdb_total_inodes` | Total number of inodes for the file system with the RocksDB database directory (always `0` on Windows) |

Logging
-------

The following logging-related options have been added:

- added option `--log.use-json-format` to switch log output to JSON format.
  Each log message then produces a separate line with JSON-encoded log data,
  which can be consumed by applications.

  The attributes produced for each log message JSON object are:

  | Key        | Value      |
  |:-----------|:-----------|
  | `time`     | date/time of log message, in format specified by `--log.time-format`
  | `prefix`   | only emitted if `--log.prefix` is set
  | `pid`      | process id, only emitted if `--log.process` is set
  | `tid`      | thread id, only emitted if `--log.thread` is set
  | `thread`   | thread name, only emitted if `--log.thread-name` is set
  | `role`     | server role (1 character), only emitted if `--log.role` is set
  | `level`    | log level (e.g. `"WARN"`, `"INFO"`)
  | `file`     | source file name of log message, only emitted if `--log.file-name` is set
  | `line`     | source file line of log message, only emitted if `--log.file-name` is set 
  | `function` | source file function name, only emitted if `--log.file-name` is set
  | `topic`    | log topic name
  | `id`       | log id (5 digit hexadecimal string), only emitted if `--log.ids` is set
  | `message`  | the actual log message payload

- added option `--log.process` to toggle the logging of the process id
  (pid) in log messages. Logging the process ID is useless when running
  arangod in Docker containers, as the pid will always be 1. So one may
  as well turn it off in these contexts with the new option.

- added option `--log.in-memory` to toggle storing log messages in memory,
  from which they can be consumed via the `/_admin/log` HTTP API and by the 
  Web UI. By default, this option is turned on, so log messages are consumable 
  via the API and UI. Turning this option off will disable that functionality,
  save a tiny bit of memory for the in-memory log buffers and prevent potential
  log information leakage via these means.

Timezone conversion
-------------------

Added IANA timezone database [tzdata](https://www.iana.org/time-zones){:target="_blank"}.

The following AQL functions have been added for converting datetimes in UTC to
any timezone in the world including historical daylight saving times and vice
versa:

- [DATE_UTCTOLOCAL()](aql/functions-date.html#date_utctolocal)

  `DATE_UTCTOLOCAL("2020-10-15T01:00:00.999Z", "America/New_York")`
  → `"2020-10-14T21:00:00.999"`

- [DATE_LOCALTOUTC()](aql/functions-date.html#date_localtoutc)

  `DATE_LOCALTOUTC("2020-10-14T21:00:00.999", "America/New_York")`
  → `"2020-10-15T01:00:00.999Z"`

Client tools
------------

### Arangodump concurrency

Since v3.4, _arangodump_ can use multiple threads for dumping database data in 
parallel. To speed up the dump of a database will multiple collections, it is
often beneficial to increase the number of _arangodump_ threads.
The number of threads can be controlled via the **--threads** option, which 
defaults to *2*.

_arangodump_ versions prior to v3.8 will distribute dump jobs for individual
collections to concurrent worker threads, which is optimal for dumping many
collections of approximately the same size, but does not help for dumping few
large collections or few large collections with many shards.

Since v3.8, _arangodump_ can also dispatch dump jobs for individual shards of
each collection, allowing higher parallelism if there are many shards to dump
but only few collections. Keep in mind that even when concurrently dumping the
data from multiple shards of the same collection in parallel, the individual
shards' results will still be written into a single result file for the collection.
With a massive number of concurrent dump threads, some contention on that shared
file should be expected. Also note that when dumping the data of multiple shards
from the same collection, each thread's results will be written to the result 
file in a non-deterministic order. This should not be a problem when restoring
such dump, as _arangorestore_ does not assume any order of input.

### Arangodump output format

Since its inception, _arangodump_ wrapped each dumped document into an extra
JSON envelope, such as follows:
```
{"type":2300,"key":"test","data":{"_key":"test","_rev":..., ...}}
```
This original dump format was useful when there was the MMFiles storage engine,
which could use different *type* values in its datafiles.
However, the RocksDB storage engine only uses *type* 2300 (document) when
dumping data, so the JSON wrapper provides no further benefit except compatibility
with older versions of ArangoDB.

In case a dump taken with v3.8 or higher is known to never be used in older
ArangoDB versions, the JSON envelopes can be turned off.
since v3.8.0 there is the **--envelope** option to control this. The option 
defaults to *true*, meaning dumped documents will be wrapped in envelopes, which
makes v3.8 dumps compatible with older versions of ArangoDB.

If that is not needed, the **-envelope** option can be set to *false*.
In this case, the dump files will only contain the raw documents, without any
envelopes around:
```
{"_key":"test","_rev":..., ...}
```
Disabling the envelopes can reduce dump sizes a lot, especially if documents are
small on average and the relative cost of the envelopes is high.
Omitting the envelopes can also help to save a bit on memory usage and bandwidth
for building up the dump results and sending them over the wire.

As a bonus, turning off the envelopes turns _arangodump_ into a fast, concurrent
JSONL exporter for one or multiple collections:
```
arangodump --collection "collection" --threads 8 --envelope false --compress-output false dump
```
The JSONL format is also supported by _arangoimport_ natively.

Please note that when setting the **--envelope** option to *false**, the resulting
dump cannot be restored into any ArangoDB versions older than v3.8.0.

Miscellaneous
-------------

- Added cluster support for the JavaScript API method `collection.checksum()`
  and the HTTP API endpoint `GET /_api/collection/{collection-name}/checksum`,
  which calculate CRC checksums for collections.
