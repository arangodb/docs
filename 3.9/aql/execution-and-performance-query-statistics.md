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
    |db._query(`
    |   FOR i IN 1..@count INSERT
    |     { _key: CONCAT('anothertest', TO_STRING(i)) }
    |     INTO mycollection`,
    |  {count: 100},
    |  {},
    |  {fullCount: true}
      ).getExtra();
    |db._query({
    |  "query": `FOR i IN 200..@count INSERT
    |              { _key: CONCAT('anothertest', TO_STRING(i)) }
    |              INTO mycollection`,
    |  "bindVars": {count: 300},
    |  "options": { fullCount: true}
      }).getExtra();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 06_workWithAQL_statementsExtra
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

The meaning of the statistics attributes is as follows:

* *writesExecuted*: the total number of data-modification operations successfully executed.
  This is equivalent to the number of documents created, updated or removed by `INSERT`,
  `UPDATE`, `REPLACE` or `REMOVE` operations.
* *writesIgnored*: the total number of data-modification operations that were unsuccessful,
  but have been ignored because of query option `ignoreErrors`.
* *scannedFull*: the total number of documents iterated over when scanning a collection 
  without an index. Documents scanned by subqueries will be included in the result, but not
  no operations triggered by built-in or user-defined AQL functions.
* *scannedIndex*: the total number of documents iterated over when scanning a collection using
  an index. Documents scanned by subqueries will be included in the result, but not
  no operations triggered by built-in or user-defined AQL functions.
* *filtered*: the total number of documents that were removed after executing a filter condition
  in a `FilterNode`. Note that `IndexRangeNode`s can also filter documents by selecting only
  the required index range from a collection, and the `filtered` value only indicates how much
  filtering was done by `FilterNode`s.
* *httpRequests*: the total number of cluster-internal HTTP requests performed.
* *fullCount*: the total number of documents that matched the search condition if the query's
  final top-level `LIMIT` statement were not present.
  This attribute may only be returned if the `fullCount` option was set when starting the 
  query and will only contain a sensible value if the query contained a `LIMIT` operation on
  the top level.
* *executionTime*: the query execution time (wall-clock time) in seconds.
* *peakMemoryUsage*: the maximum memory usage of the query while it was running. In a cluster,
  the memory accounting is done per shard, and the memory usage reported is the peak
  memory usage value from the individual shards.
  Note that to keep things light-weight, the per-query memory usage is tracked on a relatively 
  high level, not including any memory allocator overhead nor any memory used for temporary
  results calculations (e.g. memory allocated/deallocated inside AQL expressions and function 
  calls). The attribute *peakMemoryUsage* is available from v3.4.3.
* *nodes*: _(optional)_ when the query was executed with the option `profile` set to at least *2*,
  then this value contains runtime statistics per query execution node. This field contains the
  node id (in `id`), the number of calls to this node `calls` and the number of items returned
  by this node `items` (Items are the temporary results returned at this stage). You can correlate
  this statistics with the `plan` returned in `extra`. For a human readable output you can execute 
  `db._profileQuery(<query>, <bind-vars>)` in the arangosh.
