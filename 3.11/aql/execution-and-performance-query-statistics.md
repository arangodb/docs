---
layout: default
description: Query statistics
---
Query statistics
================

A query that has been executed will always return execution statistics. Execution statistics
can be retrieved by calling `getExtra()` on the cursor. The statistics are returned in the
return value's `stats` attribute:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 06_workWithAQL_statementsExtra
    @EXAMPLE_ARANGOSH_OUTPUT{06_workWithAQL_statementsExtra}
    | db._query(`
    |   FOR i IN 1..@count INSERT
    |     { _key: CONCAT('anothertest', TO_STRING(i)) }
    |     INTO mycollection`,
    |  { count: 100 },
    |  {},
    |  { fullCount: true }
      ).getExtra();
    | db._query({
    |   "query": `FOR i IN 200..@count INSERT
    |             { _key: CONCAT('anothertest', TO_STRING(i)) }
    |             INTO mycollection`,
    |  "bindVars": { count: 300 },
    |  "options": { fullCount: true }
      }).getExtra();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 06_workWithAQL_statementsExtra
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

The meaning of the statistics attributes is as follows:

- **writesExecuted**: The total number of data-modification operations successfully executed.
  This is equivalent to the number of documents created, updated, or removed by `INSERT`,
  `UPDATE`, `REPLACE`, `REMOVE`, or `UPSERT` operations.
- **writesIgnored**: The total number of data-modification operations that were unsuccessful,
  but have been ignored because of the `ignoreErrors` query option.
- **scannedFull**: The total number of documents iterated over when scanning a collection 
  without an index. Documents scanned by subqueries are included in the result, but
  operations triggered by built-in or user-defined AQL functions are not.
- **scannedIndex**: The total number of documents iterated over when scanning a collection using
  an index. Documents scanned by subqueries are included in the result, but operations
  triggered by built-in or user-defined AQL functions are not.
- **cursorsCreated**: The total number of cursor objects created during query execution. Cursor
  objects are created for index lookups.
- **cursorsRearmed**: The total number of times an existing cursor object was repurposed.
  Repurposing an existing cursor object is normally more efficient compared to destroying an
  existing cursor object and creating a new one from scratch.
- **cacheHits**: The total number of index entries read from in-memory caches for indexes
  of type edge or persistent. This value is only non-zero when reading from indexes
  that have an in-memory cache enabled, and when the query allows using the in-memory
  cache (i.e. using equality lookups on all index attributes).
- **cacheMisses**: The total number of cache read attempts for index entries that could not
  be served from in-memory caches for indexes of type edge or persistent. This value
  is only non-zero when reading from indexes that have an in-memory cache enabled, the
  query allows using the in-memory cache (i.e. using equality lookups on all index attributes)
  and the looked up values are not present in the cache.
- **filtered**: The total number of documents removed after executing a filter condition
  in a `FilterNode` or another node that post-filters data. Note that nodes of the
  `IndexNode` type can also filter documents by selecting only the required index range 
  from a collection, and the `filtered` value only indicates how much filtering was done by a
  post-filter in the `IndexNode` itself or following `FilterNode` nodes. 
  Nodes of the `EnumerateCollectionNode` and `TraversalNode` types can also apply
  filter conditions and can report the number of filtered documents.
- **httpRequests**: The total number of cluster-internal HTTP requests performed.
- **fullCount** (_optional_): The total number of documents that matched the search condition if the query's
  final top-level `LIMIT` operation were not present.
  This attribute may only be returned if the `fullCount` option was set when starting the 
  query and only contains a sensible value if the query contains a `LIMIT` operation on
  the top level.
- **executionTime**: The query execution time (wall-clock time) in seconds.
- **peakMemoryUsage**: The maximum memory usage of the query while it was running. In a cluster,
  the memory accounting is done per shard, and the memory usage reported is the peak
  memory usage value from the individual shards.
  Note that to keep things light-weight, the per-query memory usage is tracked on a relatively 
  high level, not including any memory allocator overhead nor any memory used for temporary
  results calculations (e.g. memory allocated/deallocated inside AQL expressions and function 
  calls).
- **intermediateCommits**:
  The total number of intermediate commits the query has performed. This number
  can only be greater than zero for data-modification queries that perform
  modifications beyond the `--rocksdb.intermediate-commit-count` or
  `--rocksdb.intermediate-commit-size` thresholds. In a cluster, the
  intermediate commits are tracked per DB-Server that participates in the query
  and are summed up in the end.
- **nodes** (_optional_): When the query is executed with the option `profile` set to at least `2`,
  then this value contains runtime statistics per query execution node.
  For a human readable output you can execute `db._profileQuery(<query>, <bind-vars>)`
  in the arangosh.
  - **id**: The execution node ID to correlate the statistics with the `plan` returned in
    the `extra` attribute.
  - **calls**: The number of calls to this node.
  - **items**: The number of items returned by this node. Items are the temporary results
    returned at this stage.
  - **runtime**: The execution time of this node in seconds.
