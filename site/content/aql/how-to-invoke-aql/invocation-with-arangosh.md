---
fileID: invocation-with-arangosh
title: Executing queries from _arangosh_
weight: 3450
description: 
layout: default
---
In the ArangoDB shell, you can use the `db._query()` and `db._createStatement()`
methods to execute AQL queries. This chapter also describes
how to use bind parameters, counting, statistics and cursors. 

## With `db._query()`

You can execute queries with the `_query()` method of the `db` object. 
This runs the specified query in the context of the currently
selected database and returns the query results in a cursor.
You can print the results of the cursor using its `toArray()` method:

        
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 01_workWithAQL_all
description: ''
render: input/output
version: '3.10'
release: stable
---
~addIgnoreCollection("mycollection")
db._create("mycollection")
db.mycollection.save({ _key: "testKey", Hello : "World" })
db._query('FOR my IN mycollection RETURN my._key').toArray()
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### `db._query()` bind parameters

To pass bind parameters into a query, you can specify a second argument when
calling the `_query()` method:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 02_workWithAQL_bindValues
description: ''
render: input/output
version: '3.10'
release: stable
---
  db._query('FOR c IN @@collection FILTER c._key == @key RETURN c._key', {
    '@collection': 'mycollection', 
    'key': 'testKey'
  }).toArray();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### ES6 template strings

It is also possible to use ES6 template strings for generating AQL queries. There is
a template string generator function named `aql`. 

The following example demonstrates what the template string function generates:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 02_workWithAQL_aqlTemplateString
description: ''
render: input/output
version: '3.10'
release: stable
---
  var key = 'testKey';
  aql`FOR c IN mycollection FILTER c._key == ${key} RETURN c._key`
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

The next example directly uses the generated result to execute a query:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 02_workWithAQL_aqlQuery
description: ''
render: input/output
version: '3.10'
release: stable
---
  var key = 'testKey';
  db._query(
    aql`FOR c IN mycollection FILTER c._key == ${key} RETURN c._key`
  ).toArray();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Arbitrary JavaScript expressions can be used in queries that are generated with the
`aql` template string generator. Collection objects are handled automatically:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 02_workWithAQL_aqlCollectionQuery
description: ''
render: input/output
version: '3.10'
release: stable
---
  var key = 'testKey';
  db._query(aql`FOR doc IN ${ db.mycollection } RETURN doc`).toArray();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Note: data-modification AQL queries normally do not return a result unless the
AQL query contains a `RETURN` operation at the top-level. Without a `RETURN`
operation, the `toArray()` method returns an empty array.

### Statistics and extra Information

It is always possible to retrieve statistics for a query with the `getExtra()` method:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 03_workWithAQL_getExtra
description: ''
render: input/output
version: '3.10'
release: stable
---
  db._query(`FOR i IN 1..100
    INSERT { _key: CONCAT('test', TO_STRING(i)) } INTO mycollection`
  ).getExtra();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



The meaning of the statistics values is described in
[Query statistics](../execution-and-performance/execution-and-performance-query-statistics).

Query warnings are also reported here. If you design queries on the shell,
be sure to check for warnings.

### Setting a memory limit

To set a memory limit for the query, pass `options` to the `_query()` method.
The memory limit specifies the maximum number of bytes that the query is
allowed to use. When a single AQL query reaches the specified limit value, 
the query will be aborted with a *resource limit exceeded* exception. In a 
cluster, the memory accounting is done per shard, so the limit value is 
effectively a memory limit per query per shard.

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 02_workWithAQL_memoryLimit
description: ''
render: input/output
version: '3.10'
release: stable
---
  db._query(
    'FOR i IN 1..100000 SORT i RETURN i',
    {},
    { memoryLimit: 100000 }
  ).toArray(); // xpError(ERROR_RESOURCE_LIMIT)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



If no memory limit is specified, then the server default value (controlled by
the `--query.memory-limit` startup option) is used for restricting the maximum amount 
of memory the query can use. A memory limit value of `0` means that the maximum
amount of memory for the query is not restricted. 

### Setting options

There are further options that you can pass in the `options` attribute of the `_query()` method:

- `fullCount`: if set to `true` and if the query contains a `LIMIT` operation, then the
  result has an extra attribute with the sub-attributes `stats` and `fullCount`, like
  `{ ... , "extra": { "stats": { "fullCount": 123 } } }`. The `fullCount` attribute
  contains the number of documents in the result before the last top-level `LIMIT` in the
  query was applied. It can be used to count the number of documents that match certain
  filter criteria, but only return a subset of them, in one go. It is thus similar to
  MySQL's `SQL_CALC_FOUND_ROWS` hint. Note that setting the option disables a few
  `LIMIT` optimizations and may lead to more documents being processed, and thus make
  queries run longer. Note that the `fullCount` attribute may only be present in the
  result if the query has a top-level `LIMIT` operation and the `LIMIT` operation
  is actually used in the query.

- `failOnWarning`: when set to `true`, this makes the query throw an exception and
  abort in case a warning occurs. You should use this option in development to catch
  errors early. If set to `false`, warnings don't propagate to exceptions and are
  returned with the query results. There is also a `--query.fail-on-warning`
  startup options for setting the default value for `failOnWarning`, so that you
  don't need to set it on a per-query level.

- `cache`: if set to `true`, this puts the query result into the query result cache
  if the query result is eligible for caching and the query cache is running in demand 
  mode. If set to `false`, the query result is not inserted into the query result
  cache. Note that query results are never inserted into the query result cache if
  the query result cache is disabled, and that they are automatically inserted into
  the query result cache if it is active in non-demand mode.

- `fillBlockCache`: if set to `true` or not specified, this makes the query store
  the data it reads via the RocksDB storage engine in the RocksDB block cache. This is
  usually the desired behavior. You can set the option to `false` for queries that are
  known to either read a lot of data that would thrash the block cache, or for queries
  that read data known to be outside of the hot set. By setting the option
  to `false`, data read by the query does not make it into the RocksDB block cache if
  it is not already in there, thus leaving more room for the actual hot set.

- `profile`: if set to `true` or `1`, returns extra timing information for the query.
  The timing information is accessible via the `getExtra()` method of the query
  result. If set to `2`, the query includes execution statistics per query plan
  execution node in `stats.nodes` sub-attribute of the `extra` return attribute.
  Additionally, the query plan is returned in the `extra.plan` sub-attribute.

- `maxWarningCount`: limits the number of warnings that are returned by the query if
  `failOnWarning` is not set to `true`. The default value is `10`.

- `maxNumberOfPlans`: limits the number of query execution plans the optimizer
  creates at most. Reducing the number of query execution plans may speed up query plan
  creation and optimization for complex queries, but normally there is no need to adjust
  this value.

- `optimizer`: Options related to the query optimizer.

  - `rules`: A list of to-be-included or to-be-excluded optimizer rules can be put into
  this attribute, telling the optimizer to include or exclude specific rules. To disable
  a rule, prefix its name with a `-`, to enable a rule, prefix it with a `+`. There is also
  a pseudo-rule `all`, which matches all optimizer rules. `-all` disables all rules.

- `stream`: Specify `true` and the query is executed in a **streaming** fashion. The query result is
  not stored on the server, but calculated on the fly. **Warning**: long-running queries
  need to hold the collection locks for as long as the query cursor exists. It is advisable
  to *only* use this option on short-running queries *or* without exclusive locks.
  When set to `false`, the query is executed right away in its entirety.
  In that case, the query results are either returned right away (if the result
  set is small enough), or stored on the arangod instance and can be accessed
  via the cursor API. 

  Please note that the query options `cache`, `count` and `fullCount` don't work on streaming
  queries. Additionally, query statistics, warnings, and profiling data is only
  available after the query has finished. The default value is `false`.

- `maxRuntime`: The query has to be executed within the given runtime or it is killed.
  The value is specified in seconds. The default value is `0.0` (no timeout).

- `maxNodesPerCallstack`: The number of execution nodes in the query plan after
  that stack splitting is performed to avoid a potential stack overflow.
  Defaults to the configured value of the startup option
  `--query.max-nodes-per-callstack`.
  
  This option is only useful for testing and debugging and normally does not need
  any adjustment.

- `maxTransactionSize`: The transaction size limit in bytes.

- `intermediateCommitSize`: The maximum total size of operations after which an intermediate
  commit is performed automatically.

- `intermediateCommitCount`: The maximum number of operations after which an intermediate
  commit is performed automatically.

In the ArangoDB Enterprise Edition, there are additional parameters:

- `skipInaccessibleCollections`: Let AQL queries (especially graph traversals) treat
  collection to which a user has **no access** rights for as if these collections are empty.
  Instead of returning a *forbidden access* error, your queries execute normally.
  This is intended to help with certain use-cases: A graph contains several collections
  and different users execute AQL queries on that graph. You can naturally limit the 
  accessible results by changing the access rights of users on collections.

- `satelliteSyncWait`: This Enterprise Edition parameter allows to configure how long
  a DB-Server has time to bring the SatelliteCollections involved in the query
  into sync. The default value is `60.0` seconds. When the maximal time is reached,
  the query is stopped.

## Additional parameters for spilling data from the query onto disk

Starting from ArangoDB 3.10, there are two additional parameters that allow spilling 
intermediate data from a query onto a disk to decrease the memory usage.
  
{{% hints/info %}}
The option of spilling data from RAM onto disk is experimental and is turned off 
by default. This parameter currently only has effect for sorting - 
for a query that uses the `SORT` operation but without `LIMIT`.
Also, the query results are still built up entirely in RAM on Coordinators
and single servers for non-streaming queries. To avoid the buildup of
the entire query result in RAM, a streaming query should be used.
{{% /hints/info %}}

- `spillOverThresholdNumRows`: This option allows queries to store intermediate
  and final results temporarily on disk if the number of rows produced by the
  query exceeds the specified value. This is
  used for decreasing the memory usage during the query execution. In a query 
  that iterates over a collection that contains documents, each row is a 
  document, and, in a query that iterates over temporary values 
  (i.e. `FOR i IN 1..100`), each row is one of such temporary values. 
  This feature is experimental and is only enabled if you set a path for the
  directory to store the temporary data in with the
  [`--temp.intermediate-results-path` startup option](../../programs-tools/arangodb-server/programs-arangod-options#--tempintermediate-results-path).

  Default value: `5000000` rows.

- `spillOverThresholdMemoryUsage`: This option allows queries to store
  intermediate and final results temporarily on disk if the amount of memory
  used in bytes exceeds the specified value. This
  is used for decreasing the memory usage during the query execution. This 
  feature is experimental and is only enabled if you set a path for the
  directory to store the temporary data in with the
  [`--temp.intermediate-results-path` startup option](../../programs-tools/arangodb-server/programs-arangod-options#--tempintermediate-results-path).

  Default value: 128 MiB.

## With `db._createStatement()` (ArangoStatement)

The `_query()` method is a shorthand for creating an `ArangoStatement` object,
executing it and iterating over the resulting cursor. If more control over the
result set iteration is needed, it is recommended to first create an
`ArangoStatement` object as follows:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 04_workWithAQL_statements1
description: ''
render: input/output
version: '3.10'
release: stable
---
  stmt = db._createStatement( { "query": "FOR i IN [ 1, 2 ] RETURN i * 2" } );
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

To execute the query, use the `execute()` method of the statement:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 05_workWithAQL_statements2
description: ''
render: input/output
version: '3.10'
release: stable
---
~ var stmt = db._createStatement( { "query": "FOR i IN [ 1, 2 ] RETURN i * 2" } );
  cursor = stmt.execute();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### Cursors

Once the query executed the query results are available in a cursor. 
The cursor can return all its results at once using the `toArray()` method.
This is a short-cut that you can use if you want to access the full result
set without iterating over it yourself.

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 05_workWithAQL_statements3
description: ''
render: input/output
version: '3.10'
release: stable
---
~ var stmt = db._createStatement( { "query": "FOR i IN [ 1, 2 ] RETURN i * 2" } );
~ var cursor = stmt.execute();
  cursor.toArray();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 

    

Cursors can also be used to iterate over the result set document-by-document.
To do so, use the `hasNext()` and `next()` methods of the cursor:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 05_workWithAQL_statements4
description: ''
render: input/output
version: '3.10'
release: stable
---
~ var stmt = db._createStatement( { "query": "FOR i IN [ 1, 2 ] RETURN i * 2" } );
~ var c = stmt.execute();
  while (c.hasNext()) { require("@arangodb").print(c.next()); }
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Please note that you can iterate over the results of a cursor only once, and that
the cursor will be empty when you have fully iterated over it. To iterate over
the results again, the query needs to be re-executed.

Additionally, the iteration can be done in a forward-only fashion. There is no 
backwards iteration or random access to elements in a cursor.    

### ArangoStatement parameters binding

To execute an AQL query using bind parameters, you need to create a statement first
and then bind the parameters to it before execution:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 05_workWithAQL_statements5
description: ''
render: input/output
version: '3.10'
release: stable
---
  var stmt = db._createStatement( { "query": "FOR i IN [ @one, @two ] RETURN i * 2" } );
  stmt.bind("one", 1);
  stmt.bind("two", 2);
  cursor = stmt.execute();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

The cursor results can then be dumped or iterated over as usual, e.g.:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 05_workWithAQL_statements6
description: ''
render: input/output
version: '3.10'
release: stable
---
~ var stmt = db._createStatement( { "query": "FOR i IN [ @one, @two ] RETURN i * 2" } );
~ stmt.bind("one", 1);
~ stmt.bind("two", 2);
~ var cursor = stmt.execute();
  cursor.toArray();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

or

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 05_workWithAQL_statements7
description: ''
render: input/output
version: '3.10'
release: stable
---
~ var stmt = db._createStatement( { "query": "FOR i IN [ @one, @two ] RETURN i * 2" } );
~ stmt.bind("one", 1);
~ stmt.bind("two", 2);
~ var cursor = stmt.execute();
  while (cursor.hasNext()) { require("@arangodb").print(cursor.next()); }
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Please note that bind parameters can also be passed into the `_createStatement()`
method directly, making it a bit more convenient:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 05_workWithAQL_statements8
description: ''
render: input/output
version: '3.10'
release: stable
---
  stmt = db._createStatement( { 
    "query": "FOR i IN [ @one, @two ] RETURN i * 2", 
    "bindVars": { 
  "one": 1, 
  "two": 2 
    } 
  });
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### Counting with a cursor

Cursors also optionally provide the total number of results. By default, they do not. 
To make the server return the total number of results, you may set the `count` attribute to 
`true` when creating a statement:

        
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 05_workWithAQL_statements9
description: ''
render: input/output
version: '3.10'
release: stable
---
  stmt = db._createStatement( {
    "query": "FOR i IN [ 1, 2, 3, 4 ] RETURN i",
"count": true } );
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

After executing this query, you can use the `count` method of the cursor to get the 
number of total results from the result set:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 05_workWithAQL_statements10
description: ''
render: input/output
version: '3.10'
release: stable
---
~ var stmt = db._createStatement( { "query": "FOR i IN [ 1, 2, 3, 4 ] RETURN i", "count": true } );
  var cursor = stmt.execute();
  cursor.count();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Please note that the `count` method returns nothing if you did not specify the `count`
attribute when creating the query.

This is intentional so that the server may apply optimizations when executing the query and 
construct the result set incrementally. Incremental creation of the result sets
is no possible
if all of the results need to be shipped to the client anyway. Therefore, the client
has the choice to specify `count` and retrieve the total number of results for a query (and
disable potential incremental result set creation on the server), or to not retrieve the total
number of results and allow the server to apply optimizations.

Please note that at the moment the server will always create the full result set for each query so 
specifying or omitting the `count` attribute currently does not have any impact on query execution.
This may change in the future. Future versions of ArangoDB may create result sets incrementally 
on the server-side and may be able to apply optimizations if a result set is not fully fetched by 
a client.

### Using cursors to obtain additional information on internal timings

Cursors can also optionally provide statistics of the internal execution phases. By default, they do not. 
To get to know how long parsing, optimization, instantiation and execution took,
make the server return that by setting the `profile` attribute to
`true` when creating a statement:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 06_workWithAQL_statements11
description: ''
render: input/output
version: '3.10'
release: stable
---
  stmt = db._createStatement( {
    "query": "FOR i IN [ 1, 2, 3, 4 ] RETURN i",
options: {"profile": true}} );
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

After executing this query, you can use the `getExtra()` method of the cursor to get the 
produced statistics:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 06_workWithAQL_statements12
description: ''
render: input/output
version: '3.10'
release: stable
---
~ var stmt = db._createStatement( { "query": "FOR i IN [ 1, 2, 3, 4 ] RETURN i", options: {"profile": true}} );
  var cursor = stmt.execute();
  cursor.getExtra();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Query validation

The `_parse()` method of the `db` object can be used to parse and validate a
query syntactically, without actually executing it.

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 06_workWithAQL_statements13
description: ''
render: input/output
version: '3.10'
release: stable
---
  db._parse( "FOR i IN [ 1, 2 ] RETURN i" );
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    
