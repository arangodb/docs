---
layout: default
description: ArangoDB v3.6 Release Notes New Features
---
Features and Improvements in ArangoDB 3.6
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.6. ArangoDB 3.6 also contains several bug fixes that are not listed
here.

ArangoSearch
------------

### SmartJoins and Views

ArangoSearch Views are now eligible for SmartJoins in AQL, provided that their
underlying collections are eligible too.

### Dynamic search expressions with arrays

ArangoSearch now accepts expressions with array comparison operators in the
form of:

```
<array> [ ALL|ANY|NONE ] [ <=|<|==|!=|>|>=|IN ] doc.<attribute>
```

i.e. the left-hand side operand is always an array, which can be dynamic.

```js
LET tokens = TOKENS("some input", "text_en")                 // ["some", "input"]
FOR doc IN myView SEARCH tokens  ALL IN doc.title RETURN doc // dynamic conjunction
FOR doc IN myView SEARCH tokens  ANY IN doc.title RETURN doc // dynamic disjunction
FOR doc IN myView SEARCH tokens NONE IN doc.title RETURN doc // dynamic negation
FOR doc IN myView SEARCH tokens  ALL >  doc.title RETURN doc // dynamic conjunction with comparison
FOR doc IN myView SEARCH tokens  ANY <= doc.title RETURN doc // dynamic disjunction with comparison
```

In addition, both the `TOKENS()` and the `PHRASE()` functions were
extended with array support for convenience.

`TOKENS()` accepts recursive arrays of strings as the first argument:

```js
TOKENS("quick brown fox", "text_en")        // [ "quick", "brown", "fox" ]
TOKENS(["quick brown", "fox"], "text_en")   // [ ["quick", "brown"], ["fox"] ]
TOKENS(["quick brown", ["fox"]], "text_en") // [ ["quick", "brown"], [["fox"]] ]
```

In most cases you will want to flatten the resulting array for further usage,
because nested arrays are not accepted in `SEARCH` statements such as
`<array> ALL IN doc.<attribute>`:

```js
LET tokens = TOKENS(["quick brown", ["fox"]], "text_en") // [ ["quick", "brown"], [["fox"]] ]
LET tokens_flat = FLATTEN(tokens, 2)                     // [ "quick", "brown", "fox" ]
FOR doc IN myView SEARCH ANALYZER(tokens_flat ALL IN doc.title, "text_en") RETURN doc
```

`PHRASE()` accepts an array as the second argument:

```js
FOR doc IN myView SEARCH PHRASE(doc.title, ["quick brown fox"], "text_en") RETURN doc
FOR doc IN myView SEARCH PHRASE(doc.title, ["quick", "brown", "fox"], "text_en") RETURN doc

LET tokens = TOKENS("quick brown fox", "text_en") // ["quick", "brown", "fox"]
FOR doc IN myView SEARCH PHRASE(doc.title, tokens, "text_en") RETURN doc
```

It is equivalent to the more cumbersome and static form:

```js
FOR doc IN myView SEARCH PHRASE(doc.title, "quick", 0, "brown", 0, "fox", "text_en") RETURN doc
```

You can optionally specify the number of _skipTokens_ in the array form before
every string element:

```js
FOR doc IN myView SEARCH PHRASE(doc.title, ["quick", 1, "fox", "jumps"], "text_en") RETURN doc
```

It is the same as the following:

```js
FOR doc IN myView SEARCH PHRASE(doc.title, "quick", 1, "fox", 0, "jumps", "text_en") RETURN doc
```

### Analyzers

- Added UTF-8 support and ability to mark beginning/end of the sequence to
  the `ngram` Analyzer type.

  The following optional properties can be provided for an `ngram` Analyzer
  definition:

  - `startMarker` : `<string>`, default: ""<br>
    this value will be prepended to n-grams at the beginning of input sequence

  - `endMarker` : `<string>`, default: ""<br>
    this value will be appended to n-grams at the beginning of input sequence

  - `streamType` : `"binary"|"utf8"`, default: "binary"<br>
    type of the input stream (support for UTF-8 is new)

- Added _edge n-gram_ support to the `text` Analyzer type. The input gets
  tokenized as usual, but then n-grams are generated from each token. UTF-8
  encoding is assumed (whereas the `ngram` Analyzer has a configurable stream
  type and defaults to binary).

  The following optional properties can be provided for a `text`
  Analyzer definition:

  - `edgeNgram` (object, _optional_):
    - `min` (number, _optional_): minimal n-gram length
    - `max` (number, _optional_): maximal n-gram length
    - `preserveOriginal` (boolean, _optional_): include the original token
      if its length is less than *min* or greater than *max*

AQL
---

### Late document materialization (RocksDB)

With the _late document materialization_ optimization ArangoDB tries to
read only documents that are absolutely necessary to compute the query result,
reducing load to the storage engine. This is only supported for the RocksDB
storage engine.

In 3.6 the optimization can only be applied to queries containing a
`SORT`+`LIMIT` combination, e.g:

```js
FOR d IN documentSource // documentSource can be either a collection or an ArangoSearch View
SORT d.foo
LIMIT 100
RETURN d
```

For the collection case the optimization is possible if and only if:
- there is an index of type `primary`, `hash`, `skiplist`, `persistent`
  or `edge` picked by the optimizer
- all attribute accesses can be covered by indexed attributes

```js
// Given we have hash index on attributes [  "foo", "bar", "baz" ]

FOR d IN myCollection
FILTER d.foo == "someValue" // hash index will be picked to optimize filtering
SORT d.baz DESC             // field "baz" will be read from index
LIMIT 100                   // only 100 documents will be materialized
RETURN d
```

For the ArangoSearch View case the optimization is possible if and only if:
- all attribute accesses can be covered by stored attributes
  (e.g. using `primarySort`)

```js
FOR d IN myView
SEARCH d.foo == "baz"
SORT BM25(d) DESC  // BM25(d) will be evaluated by the View node above
LIMIT 100          // only 100 documents will be materialized
RETURN d
```

```js
// Given we have primary sort on fields ["foo", "bar"]
FOR d IN myView
SEARCH d.foo == "baz"
SORT d.bar DESC    // field "bar" will be read from the View
LIMIT 100          // only 100 documents will be materialized
RETURN d
```

The respective optimizer rules are called `late-document-materialization`
(collection source) and `late-document-materialization-arangosearch`
(ArangoSearch View source). If applied, you will find `MaterializeNode`s
in [execution plans](aql/execution-and-performance-optimizer.html#list-of-execution-nodes).

### Early pruning of non-matching documents

Previously, AQL queries with filter conditions that could not be satisfied by any index
required all documents to be copied from the storage engine into the AQL scope in order
to be fed into the filter.

An example query execution plan for such query from ArangoDB 3.5 looks like this:

```
Query String (75 chars, cacheable: true):
 FOR doc IN test FILTER doc.value1 > 9 && doc.value2 == 'test854' RETURN doc

Execution plan:
 Id   NodeType                    Est.   Comment
  1   SingletonNode                  1   * ROOT
  2   EnumerateCollectionNode   100000     - FOR doc IN test   /* full collection scan */
  3   CalculationNode           100000       - LET #1 = ((doc.`value1` > 9) && (doc.`value2` == "test854"))
  4   FilterNode                100000       - FILTER #1
  5   ReturnNode                100000       - RETURN doc
```

ArangoDB 3.6 adds an optimizer rule `move-filters-into-enumerate` which allows applying
the filter condition directly while scanning the documents, so copying of any documents
that don't match the filter condition can be avoided.

The query execution plan for the above query from 3.6 with that optimizer rule applied
looks as follows:

```
Query String (75 chars, cacheable: true):
 FOR doc IN test FILTER doc.value1 > 9 && doc.value2 == 'test854' RETURN doc

Execution plan:
 Id   NodeType                    Est.   Comment
  1   SingletonNode                  1   * ROOT
  2   EnumerateCollectionNode   100000     - FOR doc IN test   /* full collection scan */   FILTER ((doc.`value1` > 9) && (doc.`value2` == "test854"))   /* early pruning */
  5   ReturnNode                100000       - RETURN doc
```

Note that in this execution plan the scanning and filtering are combined in one node, so
the copying of all non-matching documents from the storage engine into the AQL scope is
completely avoided.

This optimization will be beneficial if the filter condition is very selective and will
filter out many documents, and if documents are large. In this case a lot of copying will
be avoided.

The optimizer rule also works if an index is used, but there are also filter conditions
that cannot be satisfied by the index alone. Here is a 3.5 query execution plan for a
query using a filter on an indexed value plus a filter on a non-indexed value:

```
Query String (101 chars, cacheable: true):
 FOR doc IN test FILTER doc.value1 > 10000 && doc.value1 < 30000 && doc.value2 == 'test854' RETURN
 doc

Execution plan:
 Id   NodeType           Est.   Comment
  1   SingletonNode         1   * ROOT
  6   IndexNode         26666     - FOR doc IN test   /* hash index scan */
  7   CalculationNode   26666       - LET #1 = (doc.`value2` == "test854")
  4   FilterNode        26666       - FILTER #1
  5   ReturnNode        26666       - RETURN doc

Indexes used:
 By   Name                      Type   Collection   Unique   Sparse   Selectivity   Fields         Ranges
  6   idx_1649353982658740224   hash   test         false    false       100.00 %   [ `value1` ]   ((doc.`value1` > 10000) && (doc.`value1` < 30000))
```

In 3.6, the same query will be executed using a combined index scan & filtering approach, again
avoiding any copies of non-matching documents:

```
Query String (101 chars, cacheable: true):
 FOR doc IN test FILTER doc.value1 > 10000 && doc.value1 < 30000 && doc.value2 == 'test854' RETURN
 doc

Execution plan:
 Id   NodeType         Est.   Comment
  1   SingletonNode       1   * ROOT
  6   IndexNode       26666     - FOR doc IN test   /* hash index scan */   FILTER (doc.`value2` == "test854")   /* early pruning */
  5   ReturnNode      26666       - RETURN doc

Indexes used:
 By   Name                      Type   Collection   Unique   Sparse   Selectivity   Fields         Ranges
  6   idx_1649353982658740224   hash   test         false    false       100.00 %   [ `value1` ]   ((doc.`value1` > 10000) && (doc.`value1` < 30000))
```

### Parallelization of cluster AQL queries

ArangoDB 3.6 can parallelize work in many cluster AQL queries when there are multiple
database servers involved. The parallelization is done in the GatherNode, which then
can send parallel cluster-internal requests to the database servers attached. The
database servers can then work fully parallel for the different shards involved.

When parallelization is used, one or multiple GatherNodes in a query's execution plan
will be tagged with `parallel` as follows:

```
Query String (26 chars, cacheable: true):
 FOR doc IN test RETURN doc

Execution plan:
 Id   NodeType                  Site     Est.   Comment
  1   SingletonNode             DBS         1   * ROOT
  2   EnumerateCollectionNode   DBS   1000000     - FOR doc IN test   /* full collection scan, 5 shard(s) */
  6   RemoteNode                COOR  1000000       - REMOTE
  7   GatherNode                COOR  1000000       - GATHER   /* parallel */
  3   ReturnNode                COOR  1000000       - RETURN doc
```

Parallelization is currently restricted to certain types and parts of queries. GatherNodes
will go into parallel mode only if the database server query part above it ("above" here
in terms of query execution plan layout) is a terminal part of the query, i.e. when the
database server part above does not itself contain any RemoteNode, ScatterNode, GatherNode
or DistributeNode.

Please note that the parallelization of AQL execution may lead to a different resource
usage pattern for eligible AQL queries in the cluster. In isolation, queries are expected to 
complete faster with parallelization than when executing their work serially on all
involved database servers. However, working on multiple database server in parallel may 
also mean that more work than before is happening at the very same time. If this is not
desired because of resource scarcity, there are options to control the parallelization:

The startup option `--query.parallelize-gather-writes` can be used to control whether
eligible write operation parts will be parallelized. This option defaults to `true`, 
meaning that eligible write operations are also parallelized by default. This can be turned
off so that potential I/O overuse can be avoided for write operations when used together
with a high replication factor.

Additionally, the startup option `--query.optimizer-rules` can be used to globally toggle
the usage of certain optimizer rules for all queries. By default, all optimizations are
turned on. However, specific optimizations can be turned off using the option.
  
For example, to turn off the parallelization entirely, one can use the following configuration:
```
--query.optimizer-rules "-parallelize-gather"
```
This toggle works for any other non-mandatory optimizer rules as well. To specify multiple
optimizer rules, the option can be used multiple times, e.g.
```
--query.optimizer-rules "-parallelize-gather" --query.optimizer-rules "-splice-subqueries"
```

### More efficient execution plans for simple UPDATE and REPLACE queries

AQL query execution plans for simple UPDATE and REPLACE operations that modify multiple
documents and do not use LIMIT are now more efficient as several steps were removed.
The existing optimizer rule `undistribute-remove-after-enum-coll` has been extended to
cover these cases too, in case the collection is sharded by `_key` and the UPDATE/REPLACE
operation is using the document or the `_key` to find it.

For example, a query such as `FOR doc IN test UPDATE doc WITH { updated: true } IN test`
is executed as follows in 3.5:

```
Query String (57 chars, cacheable: false):
 FOR doc IN test UPDATE doc WITH { updated: true } IN test

Execution plan:
 Id   NodeType                  Site     Est.   Comment
  1   SingletonNode             DBS         1   * ROOT
  3   CalculationNode           DBS         1     - LET #3 = { "updated" : true }
  2   EnumerateCollectionNode   DBS   1000000     - FOR doc IN test   /* full collection scan, 5 shard(s) */
 11   RemoteNode                COOR  1000000       - REMOTE
 12   GatherNode                COOR  1000000       - GATHER   /* parallel */
  5   DistributeNode            COOR  1000000       - DISTRIBUTE  /* create keys: false, variable: doc */
  6   RemoteNode                DBS   1000000       - REMOTE
  4   UpdateNode                DBS         0       - UPDATE doc WITH #3 IN test
  7   RemoteNode                COOR        0       - REMOTE
  8   GatherNode                COOR        0       - GATHER
```

In 3.6 the execution plan is streamlined to just

```
Query String (57 chars, cacheable: false):
 FOR doc IN test UPDATE doc WITH { updated: true } IN test

Execution plan:
 Id   NodeType          Site     Est.   Comment
  1   SingletonNode     DBS         1   * ROOT
  3   CalculationNode   DBS         1     - LET #3 = { "updated" : true }
 13   IndexNode         DBS   1000000     - FOR doc IN test   /* primary index scan, index only, projections: `_key`, 5 shard(s) */
  4   UpdateNode        DBS         0       - UPDATE doc WITH #3 IN test
  7   RemoteNode        COOR        0       - REMOTE
  8   GatherNode        COOR        0       - GATHER
```

The optimization will also work with filters:

```
Query String (79 chars, cacheable: false):
 FOR doc IN test FILTER doc.value == 4 UPDATE doc WITH { updated: true } IN test

Execution plan:
 Id   NodeType                  Site     Est.   Comment
  1   SingletonNode             DBS         1   * ROOT
  5   CalculationNode           DBS         1     - LET #5 = { "updated" : true }
  2   EnumerateCollectionNode   DBS   1000000     - FOR doc IN test   /* full collection scan, projections: `_key`, `value`, 5 shard(s) */
  3   CalculationNode           DBS   1000000       - LET #3 = (doc.`value` == 4)
  4   FilterNode                DBS   1000000       - FILTER #3
  6   UpdateNode                DBS         0       - UPDATE doc WITH #5 IN test
  9   RemoteNode                COOR        0       - REMOTE
 10   GatherNode                COOR        0       - GATHER
```

### AQL Date functionality

AQL now enforces a valid date range for working with date/time in AQL. The valid date
ranges for any AQL date/time function are:

- for string date/time values: `"0000-01-01T00:00:00.000Z"` (including) up to
  `"9999-12-31T23:59:59.999Z"` (including)
- for numeric date/time values: -62167219200000 (including) up to 253402300799999
  (including). These values are the numeric equivalents of
  `"0000-01-01T00:00:00.000Z"` and `"9999-12-31T23:59:59.999Z"`.

Any date/time values outside the given range that are passed into an AQL date
function will make the function return `null` and trigger a warning in the query,
which can optionally be escalated to an error and stop the query.

Any date/time operations that produce date/time outside the valid ranges stated
above will make the function return `null` and trigger a warning too. An example
for this is

    DATE_SUBTRACT("2018-08-22T10:49:00+02:00", 100000, "years")

The performance of AQL date operations that work on date strings has been improved
compared to previous versions.

Finally, ArangoDB 3.6 provides a new AQL function `DATE_ROUND()` to bin a date/time
into a set of equal-distance buckets.

### Subquery Splicing Optimization

In earlier versions of ArangoDB, on every execution of a subquery the following
happened for each input row:

- The subquery tree issues one initializeCursor cascade through all nodes
- The subquery node pulls rows until the subquery node is empty for this input

On subqueries with many results per input row (10000 or more) the
above steps did not contribute significantly to query execution time.
On subqueries with few results per input, there was a serious performance impact.

Subquery splicing inlines the execution of subqueries using an optimizer rule
called `splice-subqueries`. Only suitable queries can be spliced.
A subquery becomes unsuitable if it contains a `LIMIT` node or a
`COLLECT WITH COUNT INTO …` construct (but not due to a
`COLLECT var = <expr> WITH COUNT INTO …`). A subquery *also* becomes
unsuitable if it is contained in a (sub)query containing unsuitable parts
*after* the subquery.

Consider the following query to illustrates the difference.

```js
FOR x IN c1
  LET firstJoin = (
    FOR y IN c2
      FILTER y._id == x.c2_id
      LIMIT 1
      RETURN y
  )
  LET secondJoin = (
    FOR z IN c3
      FILTER z.value == x.value
      RETURN z
  )
  RETURN { x, firstJoin, secondJoin }
```

The execution plan **without** subquery splicing:

```js
Execution plan:
 Id   NodeType                  Est.   Comment
  1   SingletonNode                1   * ROOT
  2   EnumerateCollectionNode      0     - FOR x IN c1   /* full collection scan */
  9   SubqueryNode                 0       - LET firstJoin = ...   /* subquery */
  3   SingletonNode                1         * ROOT
 18   IndexNode                    0           - FOR y IN c2   /* primary index scan */
  7   LimitNode                    0             - LIMIT 0, 1
  8   ReturnNode                   0             - RETURN y
 15   SubqueryNode                 0       - LET secondJoin = ...   /* subquery */
 10   SingletonNode                1         * ROOT
 11   EnumerateCollectionNode      0           - FOR z IN c3   /* full collection scan */
 12   CalculationNode              0             - LET #11 = (z.`value` == x.`value`)   /* simple expression */   /* collections used: z : c3, x : c1 */
 13   FilterNode                   0             - FILTER #11
 14   ReturnNode                   0             - RETURN z
 16   CalculationNode              0       - LET #13 = { "x" : x, "firstJoin" : firstJoin, "secondJoin" : secondJoin }   /* simple expression */   /* collections used: x : c1 */
 17   ReturnNode                   0       - RETURN #13

Optimization rules applied:
 Id   RuleName
  1   use-indexes
  2   remove-filter-covered-by-index
  3   remove-unnecessary-calculations-2
```

Note in particular the `SubqueryNode`s, followed by a `SingletonNode` in
both cases.

When using the optimizer rule `splice-subqueries` the plan is as follows:

```js
Execution plan:
 Id   NodeType                  Est.   Comment
  1   SingletonNode                1   * ROOT
  2   EnumerateCollectionNode      0     - FOR x IN c1   /* full collection scan */
  9   SubqueryNode                 0       - LET firstJoin = ...   /* subquery */
  3   SingletonNode                1         * ROOT
 18   IndexNode                    0           - FOR y IN c2   /* primary index scan */
  7   LimitNode                    0             - LIMIT 0, 1
  8   ReturnNode                   0             - RETURN y
 19   SubqueryStartNode            0       - LET secondJoin = ( /* subquery begin */
 11   EnumerateCollectionNode      0         - FOR z IN c3   /* full collection scan */
 12   CalculationNode              0           - LET #11 = (z.`value` == x.`value`)   /* simple expression */   /* collections used: z : c3, x : c1 */
 13   FilterNode                   0           - FILTER #11
 20   SubqueryEndNode              0       - ) /* subquery end */
 16   CalculationNode              0       - LET #13 = { "x" : x, "firstJoin" : firstJoin, "secondJoin" : secondJoin }   /* simple expression */   /* collections used: x : c1 */
 17   ReturnNode                   0       - RETURN #13

Optimization rules applied:
 Id   RuleName
  1   use-indexes
  2   remove-filter-covered-by-index
  3   remove-unnecessary-calculations-2
  4   splice-subqueries
```

The first subquery is unsuitable for the optimization because it contains
a `LIMIT` statement and is therefore not spliced. The second subquery is
suitable and hence is spliced – which one can tell from the different node
type `SubqueryStartNode` (beginning of spliced subquery). Note how it is
not followed by a `SingletonNode`. The end of the spliced subquery is
marked by a `SubqueryEndNode`.

### Miscellaneous AQL changes

In addition, ArangoDB 3.6 provides the following new AQL functionality:

- a function `GEO_AREA()` for [area calculations](aql/functions-geo.html#geo_area)
- a [query option](aql/invocation-with-arangosh.html#setting-options) `maxRuntime`
  to restrict the execution to a given time in seconds. Also see
  [HTTP API](http/aql-query-cursor-accessing-cursors.html#create-cursor).
- a startup option `--query.optimizer-rules` to turn certain AQL query optimizer
  rules off (or on) by default. This can be used to turn off certain optimizations
  that would otherwise lead to undesired changes in server resource usage patterns.

HTTP API
--------

The following APIs have been expanded:

- Database creation API, HTTP route `POST /_api/database`

  The database creation API now handles the `replicationFactor`, `writeConcern`
  and `sharding` attributes. All these attributes are optional, and only
  meaningful in a cluster.

  The values provided for the attributes `replicationFactor` and `writeConcern`
  will be used as default values when creating collections in that database,
  allowing to omit these attributes when creating collections. However, the
  values set here are just defaults for new collections in the database.
  The values can still be adjusted per collection when creating new collections
  in that database via the web UI, the arangosh or drivers.

  In an Enterprise Edition cluster, the `sharding` attribute can be given a
  value of `"single"`, which will make all new collections in that database use
  the same shard distribution and use one shard by default. This can still be
  overridden by setting the values of `distributeShardsLike` when creating new
  collections in that database via the web UI, the arangosh or drivers.

- Database properties API, HTTP route `GET /_api/database/current`

  The database properties endpoint returns the new additional attributes
  `replicationFactor`, `writeConcern` and `sharding` in a cluster.
  A description of these attributes can be found above.

- Collection APIs

  `minReplicationFactor` has been renamed to `writeConcern` for consistency.
  The old attribute name is still accepted and returned for compatibility.

Web interface
-------------

The web interface now shows the shards of all collections (including system collections)
in the shard distribution view. Displaying system collections here is necessary to access
the prototype collections of a collection sharded via `distributeShardsLike` in case the
prototype is a system collection, and the prototype collection shall be moved to another
server using the web interface.

The web interface now also allows setting a default replication factor when a creating
a new database. This default replication factor will be used for all collections created
in the new database, unless explicitly overridden.

Startup options
---------------

### OneShard Cluster

{% hint 'info' %}
This option is only available in the
[**Enterprise Edition**](https://www.arangodb.com/why-arangodb/arangodb-enterprise/){:target="_blank"},
also available as [**managed service**](https://www.arangodb.com/managed-service/){:target="_blank"}.
{% endhint %}

The option `--cluster.force-one-shard` enables the new OneShard Cluster feature.

When set to `true`, forces the cluster into creating all future collections
with only a single shard and using the same database server as these collections'
shards leader. All collections created this way will be eligible for specific AQL
query optimizations that can improve query performance and provide advanced
transactional guarantees.

### Cluster upgrade

The new options `--cluster.upgrade` toggles the cluster upgrade mode for
coordinators. It supports the following values:

- `auto`:
  perform a cluster upgrade and shut down afterwards if the startup option
  `--database.auto-upgrade` is set to true. Otherwise, don't perform an upgrade.

- `disable`:
  never perform a cluster upgrade, regardless of the value of
  `--database.auto-upgrade`.

- `force`:
  always perform a cluster upgrade and shut down, regardless of the value of
  `--database.auto-upgrade`.

- `online`:
  always perform a cluster upgrade but don't shut down afterwards

The default value is `auto`. The option only affects coordinators. It does not have
any affect on single servers, agents or database servers.

### Other cluster options

Added startup options to control the minimum and maximum replication factors used for
new collections, and the maximum number of shards for new collections.

The following options have been added:

- `--cluster.max-replication-factor`: maximum replication factor for new collections.
  A value of `0` means that there is no restriction. The default value is `10`.

- `--cluster.min-replication-factor`: minimum replication factor for new collections.
  The default value is `1`. This option can be used to prevent the creation of
  collections that do not have any or enough replicas.

- `--cluster.write-concern`: default write concern value used for new collections.
  This option controls the number of replicas that must successfully acknowledge writes
  to a collection. If any write operation gets less acknowledgements than configured
  here, the collection will go into read-only mode until the configured number of
  replicas are available again. The default value is `1`, meaning that writes to just
  the leader are sufficient. To ensure that there is at least one extra copy (i.e. one
  follower), set this option to `2`.

- `--cluster.max-number-of-shards`: maximum number of shards allowed for new collections.
  A value of `0` means that there is no restriction. The default value is `1000`.

Note that the above options only have an effect when set for coordinators, and only for
collections that are created after the options have been set. They do not affect
already existing collections.

Furthermore, the following network related options have been added:

- `--network.idle-connection-ttl`: default time-to-live for idle cluster-internal
  connections (in milliseconds). The default value is `60000`.

- `--network.io-threads`: number of I/O threads for cluster-internal network requests.
  The default value is `2`.

- `--network.max-open-connections`: maximum number of open network connections for
  cluster-internal requests. The default value is `1024`.

- `--network.verify-hosts`: if set to `true`, this will verify peer certificates for
  cluster-internal requests when TLS is used. The default value is `false`.

### RocksDB exclusive writes

The new option `--rocksdb.exclusive-writes` allows to make all writes to the RocksDB storage
exclusive and therefore avoids write-write conflicts. This option was introduced to open
a way to upgrade from MMFiles to RocksDB storage engine without modifying client application code.
Otherwise it should best be avoided as the use of exclusive locks on collections will
introduce a noticeable throughput penalty.
The option may be removed in a future ArangoDB release.

### AQL options

The new startup option `--query.optimizer-rules` can be used to to selectively enable or disable
AQL query optimizer rules by default. The option can be specified multiple times, and takes
the same input as the query option of the same name.

For example, to turn off the rule `use-indexes-for-sort`, use

    --query.optimizer-rules "-use-indexes-for-sort"

The purpose of this startup option is to be able to enable potential future experimental
optimizer rules, which may be shipped in a disabled-by-default state.

HotBackup
---------

### View Data

HotBackup now includes View data. Previously the Views had to be rebuilt after a
restore. Now the Views are available immediately.

### Force Backup

When creating backups there is an additional option `force`. This option **aborts**
all ongoing transactions to obtain the global lock for creating the backup. Most
likely this is _not_ what you want to do, but maybe someone wants to.

TLS v1.3
--------

ArangoDB 3.6 adds support for TLS 1.3 for the arangod server and the client tools.

The arangod server can be started with option `--ssl.protocol 6` to make it require
TLS 1.3 for incoming client connections. The server can be started with option
`--ssl.protocol 5` to make it require TLS 1.2, as in previous versions of arangod.

The default TLS protocol for the arangod server is now generic TLS
(`--ssl.protocol 9`), which will allow the negotiation of the TLS version between
the client and the server.

All client tools also support TLS 1.3, by using the `--ssl.protocol 6` option when
invoking them. The client tools will use TLS 1.2 by default, in order to be
compatible with older versions of ArangoDB that may be contacted by these tools.

To configure the TLS version for arangod instances started by the ArangoDB starter,
one can use the `--all.ssl.protocol=VALUE` startup option for the ArangoDB starter,
where VALUE is one of the following:

- 4 = TLSv1
- 5 = TLSv1.2
- 6 = TLSv1.3
- 9 = generic TLS

Note: TLS v1.3 support has been added in ArangoDB v3.5.1 already, but the default TLS
version in ArangoDB 3.5 was still TLS v1.2. ArangoDB v3.6 uses "generic TLS" as its
default TLS version, which will allows clients to negotiate the TLS version with the
server, dynamically choosing the **highest** mutually supported version of TLS.

Miscellaneous
-------------

- Remove operations for documents in the cluster will now use an optimization,
  if all sharding keys are specified. Should the sharding keys not match the values in
  the actual document, a not found error will be returned.

- Collection names in ArangoDB can now be up to 256 characters long, instead of 64 characters
  in previous versions.

- Disallow using `_id` or `_rev` as shard keys in clustered collections.

  Using these attributes for sharding was not supported before, but didn't trigger
  any errors. Instead, collections were created and silently using `_key` as
  the shard key, without making the caller aware of that an unsupported shard
  key was used.

- Make the scheduler enforce the configured queue lengths. The values of the options
  `--server.scheduler-queue-size`, `--server.prio1-size` and `--server.maximal-queue-size`
  will now be honored and not exceeded.

  The default queue sizes in the scheduler for requests buffering have
  also been changed as follows:

      request type        before      now
      -----------------------------------
      high priority          128     4096
      medium priority    1048576     4096
      low priority          4096     4096

  The queue sizes can still be adjusted at server start using the above-
  mentioned startup options.

Internal
--------

Release packages are now built using inter-procedural optimizations (IPO).

We have moved from C++14 to C++17, which allows us to use some of the simplifications,
features and guarantees that this standard has in stock.
To compile ArangoDB 3.6 from source, a compiler that supports C++17 is now required.

The bundled JEMalloc memory allocator used in ArangoDB release packages has been
upgraded from version 5.2.0 to version 5.2.1.

The bundled version of the Boost library has been upgraded from 1.69.0 to 1.71.0.

The bundled version of xxhash has been upgraded from 0.5.1 to 0.7.2.
