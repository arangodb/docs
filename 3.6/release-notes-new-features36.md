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

ArangoSearch Views are now eligible for SmartJoins in AQL, provided that their
underlying collections are eligible too.

AQL
---

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

Additionally, ArangoDB 3.6 provides a new AQL function `DATE_ROUND` to bin a date/time 
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
A subquery becomes unsuitable if it contains a `LIMIT`, `REMOTE`, `GATHER` or a
`COLLECT` node where the operation is `WITH COUNT INTO`. A subquery also becomes
unsuitable if it is contained in an unsuitable subquery.

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

Note in particular the `SubqueryNode`s, followed by a `SingleNode` in
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

ArangoDB 3.6 provides a new AQL function `GEO_AREA` for area calculations.

HTTP API extensions
-------------------

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

JavaScript
----------

Client tools
------------

Startup option changes
----------------------

### Cluster options

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

### One shard option

{% hint 'info' %}
This option is only available in the
[**Enterprise Edition**](https://www.arangodb.com/why-arangodb/arangodb-enterprise/){:target="_blank"},
also available as [**managed service**](https://www.arangodb.com/managed-service/){:target="_blank"}.
{% endhint %}

The option `--cluster.force-one-shard` will force all new collections to be created with 
only a single shard, and make all new collections use a similar sharding distribution. 
The default value for this option is `false`.

TLS v1.3
--------

ArangoDB 3.6 adds support for TLS 1.3 for the arangod server and the client tools.

The arangod server can be started with option `--ssl.protocol 6` to make it require
TLS 1.3 for incoming client connections. The server can be started with option 
`--ssl.protocol 5` to make it require TLS 1.2, as in previous versions of arangod.

The default TLS protocol for the arangod server is now generic TLS
(`--ssl.protocol 9`), which will allow the negotation of the TLS version between
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
