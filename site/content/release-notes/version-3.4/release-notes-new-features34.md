---
fileID: release-notes-new-features34
title: Features and Improvements in ArangoDB 3.4
weight: 11905
description: 
layout: default
---
### AQL query profiling

AQL queries can now be executed with optional profiling, using ArangoDB 3.4's new
`db._queryProfile()` function.

This new function is a hybrid of the already existing `db._query()` and `db._explain()`
functions:

* `db._query()` will execute an AQL query, but not show the execution plan nor
  runtime profile information
* `db._explain()` will show the query's execution plan, but not execute the query
* `db._queryProfile()` will run the query, collect the runtime costs of each component
  of the query, and finally show the query's execution plan with actual runtime information.
  This is very useful for debugging AQL query performance and optimizing queries.

For more information please refer to the [Query Profiling](../../aql/execution-and-performance/execution-and-performance-query-profiler)
page.

### Revised cluster-internal AQL protocol

When running an AQL query in a cluster, the Coordinator has to distribute the
individual parts of the AQL query to the relevant shards that will participate
in the execution of the query.

Up to including ArangoDB 3.3, the Coordinator has deployed the query parts to the
individual shards one by one. The more shards were involved in a query, the more
cluster-internal requests this required, and the longer the setup took.

In ArangoDB 3.4 the Coordinator will now only send a single request to each of
the involved DB-Servers (in contrast to one request per shard involved).
This will speed up the setup phase of most AQL queries, which will be noticable for
queries that affect a lot of shards.

The AQL setup has been changed from a two-step protocol to a single-step protocol,
which additionally reduces the total number of cluster-internal requests necessary
for running an AQL query.

The internal protocol and APIs have been adjusted so that AQL queries can now get
away with less cluster-internal requests than in 3.3 also after the setup phase.

Finally, there is now an extra optimization for trivial AQL queries that will only
access a single document by its primary key (see below).

### AQL functions added

The following AQL functions have been added in ArangoDB 3.4:

* `TO_BASE64`: creates the base64-encoded representation of a value
* `TO_HEX`: creates a hex-encoded string representation of a value
* `ENCODE_URI_COMPONENT`: URI-encodes a string value, for later usage in URLs
* `SOUNDEX`: calculates the soundex fingerprint of a string value
* `ASSERT`: aborts a query if a condition is not met
* `WARN`: makes a query produce a warning if a condition is not met
* `IS_KEY`: this function checks if the value passed to it can be used as a document
  key, i.e. as the value of the `_key` attribute for a document
* `SORTED`: will return a sorted version of the input array using AQL's internal
  comparison order
* `SORTED_UNIQUE`: same as `SORTED`, but additionally removes duplicates
* `COUNT_DISTINCT`: counts the number of distinct / unique items in an array
* `LEVENSHTEIN_DISTANCE`: calculates the Levenshtein distance between two string values
* `REGEX_MATCHES`: finds matches in a string using a regular expression
* `REGEX_SPLIT`: splits a string using a regular expression
* `UUID`: generates a universally unique identifier value
* `TOKENS`: splits a string into tokens using a language-specific text Analyzer
* `VERSION`: returns the server version as a string
 
The following AQL functions have been added to make working with geographical 
data easier:

* `GEO_POINT`
* `GEO_MULTIPOINT`
* `GEO_POLYGON`
* `GEO_LINESTRING`
* `GEO_MULTILINESTRING`
* `GEO_CONTAINS`
* `GEO_INTERSECTS`
* `GEO_EQUALS`.

The first five functions will produce GeoJSON objects from coordinate data. The
latter three functions can be used for querying and comparing GeoJSON objects.

The following AQL functions can now be used as aggregation functions in a
COLLECT statement:

* `UNIQUE`
* `SORTED_UNIQUE`
* `COUNT_DISTINCT`

The following function aliases have been created for existing AQL functions:

* `CONTAINS_ARRAY` is an alias for `POSITION`
* `KEYS` is an alias for `ATTRIBUTES`

### Distributed COLLECT

In the general case, AQL COLLECT operations are expensive to execute in a cluster,
because the DB-Servers need to send all shard-local data to the Coordinator
for a centralized aggregation.

The AQL query optimizer can push some parts of certain COLLECT operations to the
DB-Servers so they can do a per-shard aggregation. The DB-Servers can
then send only the already aggregated results to the Coordinator for a final aggregation.
For several queries this will reduce the amount of data that has to be transferred
between the DB-Servers servers and the Coordinator by a great extent, and thus
will speed up these queries. Work on this has started with ArangoDB 3.3.5, but
ArangoDB 3.4 allows more cases in which COLLECT operations can partially be pushed to
the DB-Servers.

In ArangoDB 3.3, the following aggregation functions could make use of a distributed
COLLECT in addition to `COLLECT WITH COUNT INTO` and `RETURN DISTINCT`:

* `COUNT`
* `SUM`
* `MIN`
* `MAX`

ArangoDB 3.4 additionally enables distributed COLLECT queries that use the following
aggregation functions:

* `AVERAGE`
* `VARIANCE`
* `VARIANCE_SAMPLE`
* `STDDEV`
* `STDDEV_SAMPLE`

### Native AQL function implementations

All built-in AQL functions now have a native implementation in C++.
Previous versions of ArangoDB had AQL function implementations in both C++ and
in JavaScript.

The JavaScript implementations of AQL functions were powered by the V8 JavaScript
engine, which first required the conversion of all function input into V8's own
data structures, and a later conversion of the function result data into ArangoDB's
native format.

As all AQL functions are now exclusively implemented in native C++, no more
conversions have to be performed to invoke any of the built-in AQL functions.
This will considerably speed up the following AQL functions and any AQL expression
that uses any of these functions:

* `APPLY`
* `CALL`
* `CURRENT_USER`
* `DATE_ADD`
* `DATE_COMPARE`
* `DATE_DAYOFWEEK`
* `DATE_DAYOFYEAR`
* `DATE_DAYS_IN_MONTH`
* `DATE_DAY`
* `DATE_DIFF`
* `DATE_FORMAT`
* `DATE_HOUR`
* `DATE_ISO8601`
* `DATE_ISOWEEK`
* `DATE_LEAPYEAR`
* `DATE_MILLISECOND`
* `DATE_MINUTE`
* `DATE_MONTH`
* `DATE_NOW`
* `DATE_QUARTER`
* `DATE_SECOND`
* `DATE_SUBTRACT`
* `DATE_TIMESTAMP`
* `DATE_YEAR`
* `IS_DATESTRING`
* `IS_IN_POLYGON`
* `LTRIM`
* `RTRIM`
* `FIND_FIRST`
* `FIND_LAST`
* `REVERSE`
* `SPLIT`
* `SUBSTITUTE`
* `SHA512`
* `TRANSLATE`
* `WITHIN_RECTANGLE`

Additionally, the AQL functions `FULLTEXT`, `NEAR` and `WITHIN` now use the native
implementations even when executed in a cluster. In previous versions of ArangoDB,
these functions had native implementations for single-server setups only, but fell
back to using the JavaScript variants in a cluster environment.

Apart from saving conversion overhead, another side effect of adding native
implementations for all built-in AQL functions is, that AQL does not require the usage
of V8 anymore, except for user-defined functions.

If no user-defined functions are used in AQL, end users do not need to put aside
dedicated V8 contexts for executing AQL queries with ArangoDB 3.4, making server
configuration less complex and easier to understand.

### AQL optimizer query planning improvements
 
The AQL query optimizer will by default now create at most 128 different execution
plans per AQL query. In previous versions the maximum number of plans was 192.

Normally the AQL query optimizer will generate a single execution plan per AQL query, 
but there are some cases in which it creates multiple competing plans. More plans
can lead to better optimized queries, however, plan creation has its costs. The
more plans are created and shipped through the optimization pipeline, the more
time will be spent in the optimizer.
To make the optimizer better cope with some edge cases, the maximum number of plans
created is now strictly enforced and was lowered compared to previous versions of
ArangoDB. This helps a specific class of complex queries.

Note that the default maximum value can be adjusted globally by setting the startup 
option `--query.optimizer-max-plans` or on a per-query basis by setting a query's
`maxNumberOfPlans` option.

### Condition simplification

The query optimizer rule `simplify-conditions` has been added to simplify certain
expressions inside CalculationNodes, which can speed up runtime evaluation of these
expressions.

The optimizer rule `fuse-filters` has been added to merge adjacent FILTER conditions
into a single FILTER condition where possible, allowing to save some runtime registers.

### Single document optimizations

In a cluster, the cost of setting up a distributed query can be considerable for
trivial AQL queries that will only access a single document, e.g.

    FOR doc IN collection FILTER doc._key == ... RETURN doc
    FOR doc IN collection FILTER doc._key == ... RETURN 1

    FOR doc IN collection FILTER doc._key == ... REMOVE doc IN collection
    FOR doc IN collection FILTER doc._key == ... REMOVE doc._key IN collection
    REMOVE... IN collection

    FOR doc IN collection FILTER doc._key == ... UPDATE doc WITH { ... } IN collection
    FOR doc IN collection FILTER doc._key == ... UPDATE doc._key WITH { ... } IN collection
    UPDATE ... WITH { ... } IN collection

    FOR doc IN collection FILTER doc._key == ... REPLACE doc WITH { ... } IN collection
    FOR doc IN collection FILTER doc._key == ... REPLACE doc._key WITH { ... } IN collection
    REPLACE ... WITH { ... } IN collection

    INSERT { ... } INTO collection

All of the above queries will affect at most a single document, identified by its
primary key. The AQL query optimizer can now detect this, and use a specialized
code path for directly carrying out the operation on the participating DB-Server(s). This special code path bypasses the general AQL query cluster setup and
shutdown, which would have prohibitive costs for these kinds of queries.

In case the optimizer makes use of the special code path, the explain output will
contain a node of the type `SingleRemoteOperationNode`, and the optimizer rules
will contain `optimize-cluster-single-document-operations`.

The optimization will fire automatically only for queries with the above patterns.
It will only fire when using `_key` to identify a single document,
and will be most effective if `_key` is also used as the collection's shard key.

### Subquery optimizations

The AQL query optimizer can now optimize certain subqueries automatically so that
they perform less work.

The new optimizer rule `optimize-subqueries` will fire in the following situations:

* in case only a few results are used from a non-modifying subquery, the rule will
  automatically add a LIMIT statement into the subquery.

  For example, the unbounded subquery

      LET docs = (
        FOR doc IN collection
          FILTER ...
          RETURN doc
      )
      RETURN docs[0]

  will be turned into a subquery that only produces a single result value:

      LET docs = (
        FOR doc IN collection
          FILTER ...
          LIMIT 1
          RETURN doc
      )
      RETURN docs[0]

* in case the result returned by a subquery is not used later but only the number
  of subquery results, the optimizer will modify the result value of the subquery
  so that it will return constant values instead of potentially more expensive
  data structures.

  For example, the following subquery returning entire documents

        RETURN LENGTH(
          FOR doc IN collection
            FILTER ...
            RETURN doc
        )

    will be turned into a subquery that returns only simple boolean values:

        RETURN LENGTH(
          FOR doc IN collection
            FILTER ...
            RETURN true
        )

  This saves fetching the document data from disk in first place, and copying it
  from the subquery to the outer scope.
  There may be more follow-up optimizations.

### COLLECT INTO ... KEEP optimization

When using an AQL COLLECT ... INTO without a `KEEP` clause, then the AQL query
optimizer will now automatically detect which sub-attributes of the `INTO` variables 
are used later in the query. The optimizer will add automatic `KEEP` clauses to
the COLLECT statement then if possible.
    
For example, the query

    FOR doc1 IN collection1
      FOR doc2 IN collection2
        COLLECT x = doc1.x INTO g
        RETURN { x, all: g[*].doc1.y }
    
will automatically be turned into

    FOR doc1 IN collection1
      FOR doc2 IN collection2
        COLLECT x = doc1.x INTO g KEEP doc1
        RETURN { x, all: g[*].doc1.y }
   
This prevents variable `doc2` from being temporarily stored in the variable `g`,
which saves processing time and memory, especially for big result sets.

### Fullcount changes

The behavior of the `fullCount` option for AQL query cursors was adjusted to conform
to users' demands. The value returned in the `fullCount` result attribute will now
be produced only by the last `LIMIT` statement on the upper most level of the query -
hence `LIMIT` statements in subqueries will not have any effect on the
`fullCount` results any more.

This is a change to previous versions of ArangoDB, in which the `fullCount`
value was produced by the sequential last `LIMIT` statement in a query,
regardless if the `LIMIT` was on the top level of the query or in a subquery.

The `fullCount` result value will now also be returned for queries that are served
from the query results cache.

### Relaxed restrictions for LIMIT values

The `offset` and `count` values used in an AQL LIMIT clause can now be expressions, as
long as the expressions can be resolved at query compile time.
For example, the following query will now work:

    FOR doc IN collection
      LIMIT 0, CEIL(@percent * @count / 100) 
      RETURN doc

Previous versions of ArangoDB required the `offset` and `count` values to be
either number literals or numeric bind parameter values.

### Improved sparse index support

The AQL query optimizer can now use sparse indexes in more cases than it was able to
in ArangoDB 3.3. If a sparse index is not used in a query because the query optimizer
cannot prove itself that the index attribute value cannot be `null`, it is now often
useful to add an extra filter condition to the query that requires the sparse index'
attribute to be non-null.

For example, if for the following query there is a sparse index on `value` in any
of the collections, the optimizer cannot prove that `value` can never be `null`:

    FOR doc1 IN collection1
      FOR doc2 IN collection2
        FILTER doc1.value == doc2.value
        RETURN [doc1, doc2]

By adding an extra filter condition to the query that excludes `null` values explicitly,
the optimizer in 3.4 will now be able to use a sparse index on `value`:

    FOR doc1 IN collection1
      FOR doc2 IN collection2
        FILTER doc1.value == doc2.value
        FILTER doc2.value != null
        RETURN [doc1, doc2]

The optimizer in 3.3 was not able to detect this, and refused to use sparse indexes
for such queries.

### Query results cache

The AQL query results cache in ArangoDB 3.4 has got additional parameters to 
control which queries should be stored in the cache.

In addition to the already existing configuration option `--query.cache-entries`
that controls the maximum number of query results cached in each database's
query results cache, there now exist the following extra options:

- `--query.cache-entries-max-size`: maximum cumulated size of the results stored
  in each database's query results cache
- `--query.cache-entry-max-size`: maximum size for an individual cache result
- `--query.cache-include-system-collections`: whether or not results of queries
  that involve system collections should be stored in the query results cache

These options allow more effective control of the amount of memory used by the
query results cache, and can be used to better utilitize the cache memory.

The cache configuration can be changed at runtime using the `properties` function
of the cache. For example, to limit the per-database number of cache entries to
256 MB and to limit the per-database cumulated size of query results to 64 MB, 
and the maximum size of each individual cache entry to 1MB, the following call
could be used:

```
require("@arangodb/aql/cache").properties({
  maxResults: 256,
  maxResultsSize: 64 * 1024 * 1024,
  maxEntrySize: 1024 * 1024,
  includeSystem: false
});
```

The contents of the query results cache can now also be inspected at runtime using 
the cache's new `toArray` function:

```
require("@arangodb/aql/cache").toArray();
```

This will show all query results currently stored in the query results cache of
the current database, along with their query strings, sizes, number of results
and original query run times.

The functionality is also available via HTTP REST APIs.


### Miscellaneous changes

When creating query execution plans for a query, the query optimizer was fetching
the number of documents of the underlying collections in case multiple query
execution plans were generated. The optimizer used these counts as part of its 
internal decisions and execution plan costs calculations. 

Fetching the number of documents of a collection can have measurable overhead in a
cluster, so ArangoDB 3.4 now caches the "number of documents" that are referred to
when creating query execution plans. This may save a few roundtrips in case the
same collections are frequently accessed using AQL queries. 

The "number of documents" value was not and is not supposed to be 100% accurate 
in this stage, as it is used for rough cost estimates only. It is possible however
that when explaining an execution plan, the "number of documents" estimated for
a collection is using a cached stale value, and that the estimates change slightly
over time even if the underlying collection is not modified.


## Streaming AQL Cursors

AQL query cursors created by client applications traditionally executed an AQL query,
and built up the entire query result in memory. Once the query completed, the results
were sent back to the client application in chunks of configurable size.

This approach was a good fit for the MMFiles engine with its collection-level locks,
and usually smaller-than-RAM query results. For the RocksDB engine with its document-level
locks and lock-free reads and potentially huge query results, this approach does not always
fit.

ArangoDB 3.4 allows to optionally execute AQL queries initiated via the cursor API in a
streaming fashion. The query result will then be calculated on the fly, and results are
sent back to the client application as soon as they become available on the server, even
if the query has not yet completed.

This is especially useful for queries that produce big result sets (e.g.
`FOR doc IN collection RETURN doc` for big collections). Such queries will take very long
to complete without streaming, because the entire query result will be computed first and
stored in memory. Executing such queries in non-streaming fashion may lead to client
applications timing out before receiving the first chunk of data from the server. Additionally,
creating a huge query result set on the server may make it run out of memory, which is also
undesired. Creating a streaming cursor for such queries will solve both problems.

Please note that streaming cursors will use resources all the time till you
fetch the last chunk of results.

Depending on the storage engine used this has different consequences:

- **MMFiles**: While before collection locks would only be held during the creation of the cursor
  (the first request) and thus until the result set was well prepared,
  they will now be held until the last chunk requested
  by the client through the cursor is processed.

  While Multiple reads are possible, one write operation will effectively stop
  all other actions from happening on the collections in question.
- **RocksDB**: Reading occurs on the state of the data when the query
  was started. Writing however will happen during working with the cursor.
  Thus be prepared for possible conflicts if you have other writes on the collections,
  and probably overrule them by `ignoreErrors: True`, else the query
  will abort by the time the conflict happenes.

Taking into account the above consequences, you shouldn't use streaming
cursors light-minded for data modification queries.

Please note that the query options `cache`, `count` and `fullCount` will not work with streaming
cursors. Additionally, the query statistics, warnings and profiling data will only be available
when the last result batch for the query is sent. Using a streaming cursor will also prevent
the query results being stored in the AQL query results cache.

By default, query cursors created via the cursor API are non-streaming in ArangoDB 3.4,
but streaming can be enabled on a per-query basis by setting the `stream` attribute
in the request to the cursor API at endpoint `/_api/cursor`.

However, streaming cursors are enabled automatically for the following parts of ArangoDB in 3.4:

* when exporting data from collections using the arangoexport binary
* when using `db.<collection>.toArray()` from the Arango shell

Please note that AQL queries consumed in a streaming fashion have their own, adjustable
"slow query" threshold. That means the "slow query" threshold can be configured separately for 
regular queries and streaming queries.

## Native implementations

The following internal and user-facing functionality has been ported from 
JavaScript-based implementations to C++-based implementations in ArangoDB 3.4:

* the statistics gathering background thread
* the REST APIs for
  - managing user defined AQL functions
  - graph management  at `/_api/gharial` that also does:
    - vertex management
    - edge management
* the implementations of all built-in AQL functions
* all other parts of AQL except user-defined functions
* database creation and setup
* all the DB-Server internal maintenance tasks for shard creation, index
  creation and the like in the cluster

By making the listed functionality not use and not depend on the V8 JavaScript 
engine, the respective functionality can now be invoked more efficiently in the
server, without requiring the conversion of data between ArangoDB's native format 
and V8's internal formats. For the maintenance operations this will lead to
improved stability in the cluster.

As a consequence, ArangoDB Agency and DB-Server nodes in an ArangoDB 3.4 
cluster will now turn off the V8 JavaScript engine at startup entirely and automatically.
The V8 engine will still be enabled on cluster Coordinators, single servers and
active failover instances. But even the latter instance types will not require as 
many V8 contexts as previous versions of ArangoDB.
This should reduce problems with servers running out of available V8 contexts or
using a lot of memory just for keeping V8 contexts around.


## Foxx

The functions `uuidv4` and `genRandomBytes` have been added to the `crypto` module.

The functions `hexSlice`, `hexWrite` have been added to the `Buffer` object.

The functions `Buffer.from`, `Buffer.of`, `Buffer.alloc` and `Buffer.allocUnsafe`
have been added to the `Buffer` object for improved compatibility with node.js.


## Security

### Ownership for cursors, jobs and tasks

Cursors for AQL query results created by the API at endpoint `/_api/cursor` 
are now tied to the user that first created the cursor.

Follow-up requests to consume or remove data of an already created cursor will
now be denied if attempted by a different user.

The same mechanism is also in place for the following APIs:

- jobs created via the endpoint `/_api/job`
- tasks created via the endpoint `/_api/tasks`


### Dropped support for SSLv2

ArangoDB 3.4 will not start when attempting to bind the server to a Secure Sockets
Layer (SSL) v2 endpoint. Additionally, the client tools (arangosh, arangoimport,
arangodump, arangorestore etc.) will refuse to connect to an SSLv2-enabled server.

SSLv2 can be considered unsafe nowadays and as such has been disabled in the OpenSSL
library by default in recent versions. ArangoDB is following this step.

Clients that use SSLv2 with ArangoDB should change the protocol from SSLv2 to TLSv12
if possible, by adjusting the value of the `--ssl.protocol` startup option for the
`arangod` server and all client tools.


## Distribution Packages

In addition to the OS-specific packages (eg. _rpm_ for Red Hat / CentOS, _deb_ for
Debian, NSIS installer for Windows etc.) starting from 3.4.0 new `tar.gz` archive packages
are available for Linux and Mac. They correspond to the `.zip` packages for Windows,
which can be used for portable installations, and to easily run different ArangoDB
versions on the same machine (e.g. for testing).


## Client tools

### _arangosh_

Starting with ArangoDB version 3.4.5, the ArangoShell (_arangosh_) provides the option 
`--console.history` for controlling whether the shell's command-line history 
should be loaded from and persisted in a file.

The default value for this option is `true`. Setting it to `false`
will make arangosh not load any command-line history from the history
file, and not store the current session's history when the shell is
exited. The command-line history will then only be available in the
current shell session.

### _arangodump_

_arangodump_ can now dump multiple collections in parallel. This can significantly
reduce the time required to take a backup.

By default, _arangodump_ will use 2 threads for dumping collections. The number of
threads used by _arangodump_ can be adjusted by using the `--threads` option when
invoking it.

### _arangorestore_

_arangorestore_ can now restore multiple collections in parallel. This can significantly
reduce the time required to recover data from a backup.

By default, _arangorestore_ will use 2 threads for restoring collections. The number of
threads used by _arangorestore_ can be adjusted by using the `--threads` option when
invoking it.

### _arangoimport_

_arangoimp_ was renamed to _arangoimport_ for consistency.
The 3.4 release packages will still install `arangoimp` as a symlink so user scripts
invoking `arangoimp` do not need to be changed.

[arangoimport now can pace the data load rate automatically](../../programs-tools/arangoimport/programs-arangoimport-details#automatic-pacing-with-busy-or-low-throughput-disk-subsystems)
based on the actual rate of
data the server can handle. This is useful in contexts when the server has a limited
I/O bandwidth, which is often the case in cloud environments. Loading data too quickly
may lead to the server exceeding its provisioned I/O operations quickly, which will
make the cloud environment throttle the disk performance and slowing it down drastically.
Using a controlled and adaptive import rate allows preventing this throttling.

The pacing algorithm is turned on by default, but can be disabled by manually specifying
any value for the `--batch-size` parameter.

_arangoimport_ also got an extra option `--create-database` so that it can automatically
create the target database should this be desired. Previous versions of _arangoimp_
provided options for creating the target collection only
(`--create-collection`, `--create-collection-type`).

Finally, _arangoimport_ got an option `--latency` which can be used to print microsecond
latency statistics on 10 second intervals for import runs. This can be used to get
additional information about the import run performance and performance development.


## Miscellaneous features

### Logging without escaping non-printable characters

The new option `--log.escape` can be used to enable a slightly different log output
format.

If set to `true` (which is the default value), then the logging will work as in
previous versions of ArangoDB, and the following characters in the log output are
escaped:

* the carriage return character (hex 0d)
* the newline character (hex 0a)
* the tabstop character (hex 09)
* any other characters with an ordinal value less than hex 20

If the `--log.escape` option is set to `false` however, no characters are escaped
when logging them. Characters with an ordinal value less than hex 20 (including
carriage return, newline and tabstop) will not be printed in this mode, but will
be replaced with a space character (hex 20). This is because these characters are
often undesired in logs anyway.
Another positive side effect of turning off the escaping is that it will slightly
reduce the CPU overhead for logging. However, this will only be noticable when the
logging is set to a very verbose level (e.g. log levels debug or trace).


### Active Failover

The _Active Failover_ mode is now officially supported for multiple slaves.

Additionally you can now send read-only requests to followers, so you can
use them for read scaling. To make sure only requests that are intended for
this use-case are served by the follower you need to add a
`X-Arango-Allow-Dirty-Read: true` header to HTTP requests.

For more information see
[Active Failover Architecture](../../architecture/arangodb-deployment-modes/active-failover/architecture-deployment-modes-active-failover-architecture).
