---
layout: default
description: Within the ArangoDB shell, the _query and _createStatement methods of the db object can be used to execute AQL queries
---
# Executing queries from _arangosh_

Within the ArangoDB shell, the *_query* and *_createStatement* methods of the
*db* object can be used to execute AQL queries. This chapter also describes
how to use bind parameters, counting, statistics and cursors. 

With db._query
--------------

One can execute queries with the *_query* method of the *db* object. 
This will run the specified query in the context of the currently
selected database and return the query results in a cursor. The results of the cursor
can be printed using its *toArray* method:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}    
    @startDocuBlockInline 01_workWithAQL_all
    @EXAMPLE_ARANGOSH_OUTPUT{01_workWithAQL_all}
    ~addIgnoreCollection("mycollection")
    db._create("mycollection")
    db.mycollection.save({ _key: "testKey", Hello : "World" })
    db._query('FOR my IN mycollection RETURN my._key').toArray()
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 01_workWithAQL_all
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### db._query Bind parameters

To pass bind parameters into a query, they can be specified as second argument to the
*_query* method:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 02_workWithAQL_bindValues
    @EXAMPLE_ARANGOSH_OUTPUT{02_workWithAQL_bindValues}
    |db._query(
    | 'FOR c IN @@collection FILTER c._key == @key RETURN c._key', {
    |   '@collection': 'mycollection', 
    |   'key': 'testKey'
    }).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 02_workWithAQL_bindValues
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### ES6 template strings

It is also possible to use ES6 template strings for generating AQL queries. There is
a template string generator function named *aql*; we call it once to demonstrate
its result, and once putting it directly into the query:

```js
var key = 'testKey';
aql`FOR c IN mycollection FILTER c._key == ${key} RETURN c._key`;
{ 
  "query" : "FOR c IN mycollection FILTER c._key == @value0 RETURN c._key", 
  "bindVars" : { 
    "value0" : "testKey" 
  } 
}
```

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 02_workWithAQL_aqlQuery
    @EXAMPLE_ARANGOSH_OUTPUT{02_workWithAQL_aqlQuery}
      var key = 'testKey';
      |db._query(
      | aql`FOR c IN mycollection FILTER c._key == ${key} RETURN c._key`
        ).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 02_workWithAQL_aqlQuery
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Arbitrary JavaScript expressions can be used in queries that are generated with the
*aql* template string generator. Collection objects are handled automatically:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 02_workWithAQL_aqlCollectionQuery
    @EXAMPLE_ARANGOSH_OUTPUT{02_workWithAQL_aqlCollectionQuery}
      var key = 'testKey';
      |db._query(aql`FOR doc IN ${ db.mycollection } RETURN doc`
          ).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 02_workWithAQL_aqlCollectionQuery
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Note: data-modification AQL queries normally do not return a result (unless the AQL query 
contains an extra *RETURN* statement). When not using a *RETURN* statement in the query, the 
*toArray* method will return an empty array.

### Statistics and extra Information

It is always possible to retrieve statistics for a query with the *getExtra* method:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 03_workWithAQL_getExtra
    @EXAMPLE_ARANGOSH_OUTPUT{03_workWithAQL_getExtra}
    |db._query(`FOR i IN 1..100
    |             INSERT { _key: CONCAT('test', TO_STRING(i)) }
    |                INTO mycollection`
      ).getExtra();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 03_workWithAQL_getExtra
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

The meaning of the statistics values is described in [Execution statistics](execution-and-performance-query-statistics.html).
You also will find warnings in here; If you're designing queries on the shell be sure to also look at it.

### Setting a memory limit

To set a memory limit for the query, pass *options* to the *_query* method.
The memory limit specifies the maximum number of bytes that the query is
allowed to use. When a single AQL query reaches the specified limit value, 
the query will be aborted with a *resource limit exceeded* exception. In a 
cluster, the memory accounting is done per shard, so the limit value is 
effectively a memory limit per query per shard.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 02_workWithAQL_memoryLimit
    @EXAMPLE_ARANGOSH_OUTPUT{02_workWithAQL_memoryLimit}
    |db._query(
    | 'FOR i IN 1..100000 SORT i RETURN i', {}, {
    |   memoryLimit: 100000
    }).toArray(); // xpError(ERROR_RESOURCE_LIMIT)
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 02_workWithAQL_memoryLimit
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

If no memory limit is specified, then the server default value (controlled by
startup option *--query.memory-limit* will be used for restricting the maximum amount 
of memory the query can use. A memory limit value of *0* means that the maximum
amount of memory for the query is not restricted. 

### Setting options

There are further options that can be passed in the *options* attribute of the *_query* method:

- `fullCount`: if set to _true_ and the query contains a _LIMIT_ clause, then the
  result will have an extra attribute with the sub-attributes _stats_ and _fullCount_,
  `{ ... , "extra": { "stats": { "fullCount": 123 } } }`. The _fullCount_ attribute will
  contain the number of documents in the result before the last top-level LIMIT in the
  query was applied. It can be used to count the number of documents that match certain
  filter criteria, but only return a subset of them, in one go. It is thus similar to
  MySQL's _SQL_CALC_FOUND_ROWS_ hint. Note that setting the option will disable a few
  LIMIT optimizations and may lead to more documents being processed, and thus make
  queries run longer. Note that the _fullCount_ attribute may only be present in the
  result if the query has a top-level LIMIT clause and the LIMIT clause is actually
  used in the query.

- `failOnWarning`: when set to *true*, this will make the query throw an exception and
  abort in case a warning occurs. This option should be used in development to catch
  errors early. If set to *false*, warnings will not be propagated to exceptions and
  will be returned with the query results. There is also a server configuration option 
  `--query.fail-on-warning` for setting the default value for *failOnWarning* so it does
  not need to be set on a per-query level.

- `cache`: if set to *true*, this will put the query result into the query result cache
  if the query result is eligible for caching and the query cache is running in demand 
  mode. If set to *false*, the query result will not be inserted into the query result
  cache. Note that query results will never be inserted into the query result cache if
  the query result cache is disabled, and that they will be automatically inserted into
  the query result cache when it is active in non-demand mode.

- `fillBlockCache`: if set to *true* or not specified, this will make the query store
  the data it reads via the RocksDB storage engine in the RocksDB block cache. This is
  usually the desired behavior. The option can be set to *false* for queries that are
  known to either read a lot of data that would thrash the block cache, or for queries
  that read data known to be outside of the hot set. By setting the option
  to *false*, data read by the query will not make it into the RocksDB block cache if
  it is not already in there, thus leaving more room for the actual hot set.

- `profile`: if set to *true* or *1*, returns extra timing information for the query. The timing
  information is accessible via the *getExtra* method of the query result. Set to *2* the query will
  include execution stats per query plan node in sub-attribute *stats.nodes* of the *extra* return attribute.
  Additionally the query plan is returned in the sub-attribute *extra.plan*.

- `maxWarningCount`: limits the number of warnings that are returned by the query if
  *failOnWarning* is not set to *true*. The default value is *10*.

- `maxNumberOfPlans`: limits the number of query execution plans the optimizer will
  create at most. Reducing the number of query execution plans may speed up query plan
  creation and optimization for complex queries, but normally there is no need to adjust
  this value.

- `optimizer`: Options related to the query optimizer.

  - `rules`: A list of to-be-included or to-be-excluded optimizer rules can be put into
  this attribute, telling the optimizer to include or exclude specific rules. To disable
  a rule, prefix its name with a `-`, to enable a rule, prefix it with a `+`. There is also
  a pseudo-rule `all`, which matches all optimizer rules. `-all` disables all rules.

- `stream`: Specify *true* and the query will be executed in a **streaming** fashion. The query result is
  not stored on the server, but calculated on the fly. *Beware*: long-running queries will
  need to hold the collection locks for as long as the query cursor exists. It is advisable
  to *only* use this option on short-running queries *or* without exclusive locks.
  When set to *false* the query will be executed right away in its entirety. 
  In that case query results are either returned right away (if the result set is small enough),
  or stored on the arangod instance and accessible via the cursor API. 

  Please note that the query options `cache`, `count` and `fullCount` will not work on streaming
  queries. Additionally query statistics, warnings and profiling data will only be available
  after the query is finished. 
  The default value is *false*

- `maxRuntime`: The query has to be executed within the given runtime or it will be killed.
  The value is specified in seconds. The default value is *0.0* (no timeout).

- `maxNodesPerCallstack`: The number of execution nodes in the query plan after
  that stack splitting is performed to avoid a potential stack overflow.
  Defaults to the configured value of the startup option
  `--query.max-nodes-per-callstack`.
  
  This option is only useful for testing and debugging and normally does not need
  any adjustment.

- `maxTransactionSize`: transaction size limit in bytes

- `intermediateCommitSize`: maximum total size of operations after which an intermediate
  commit is performed automatically

- `intermediateCommitCount`: maximum number of operations after which an intermediate
  commit is performed automatically

In the ArangoDB Enterprise Edition there is an additional parameter:

- `skipInaccessibleCollections`: AQL queries (especially graph traversals) will treat
  collection to which a user has **no access** rights as if these collections were empty.
  Instead of returning a *forbidden access* error, your queries will execute normally.
  This is intended to help with certain use-cases: A graph contains several collections
  and different users execute AQL queries on that graph. You can now naturally limit the 
  accessible results by changing the access rights of users on collections.

- `satelliteSyncWait`: This Enterprise Edition parameter allows to configure how long
  a DB-Server will have time to bring the SatelliteCollections involved in the query
  into sync. The default value is 60.0 (seconds). When the max time has been reached
  the query will be stopped.

Additional parameters for spilling data from the query onto disk
-----------------------------------------------------------------

Starting from ArangoDB 3.10, there are two additional parameters that allow spilling 
intermediate data from a query onto a disk to descrease the memory usage.
  
{% hint 'info' %}
The option of spilling data from RAM onto disk is experimental and is turned off 
by default. This parameter currently only has effect for sorting - 
for a query that uses the SORT keyword, but without LIMIT.
Also, the query results are still built up entirely in RAM on coordinators
and single servers for non-streaming queries. To avoid the buildup of
the entire query result in RAM, a streaming query should be used.
{% endhint %}

- `spillOverThresholdNumRows`: This parameter allows for input data and 
  intermediate results to be spilled onto disk for a query execution
  after the number of rows reaches the specified value. This is 
  used for decreasing the memory usage during the query execution. In a query 
  that iterates over a collection that contains documents, each row is a 
  document and, in a query that iterates over temporary values 
  (i.e. `FOR i IN 1..100`), each row is one of such temporary values. 
  This parameter is experimental and is only taken into account if a path for a
  directory to store the temporary data is provided with the  `--temp.intermediate-results-path`
  server startup option. 
  Default value: 5000000 rows.


- `spillOverThresholdMemoryUsage`: This parameter allows for input data and 
  intermediate results to be spilled onto disk for a query execution 
  after the memory usage reaches the specified value (in bytes). This 
  is used for decreasing the memory usage during the query execution. This 
  parameter is experimental and is only taken into account if a path for a 
  directory to store the temporary data is provided with the `--temp.intermediate-results-path`
  server startup option. 
  Default value: 128MB.


With _createStatement (ArangoStatement)
---------------------------------------

The *_query* method is a shorthand for creating an ArangoStatement object,
executing it and iterating over the resulting cursor. If more control over the
result set iteration is needed, it is recommended to first create an
ArangoStatement object as follows:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 04_workWithAQL_statements1
    @EXAMPLE_ARANGOSH_OUTPUT{04_workWithAQL_statements1}
    |stmt = db._createStatement( {
        "query": "FOR i IN [ 1, 2 ] RETURN i * 2" } );
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 04_workWithAQL_statements1
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

To execute the query, use the *execute* method of the statement:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 05_workWithAQL_statements2
    @EXAMPLE_ARANGOSH_OUTPUT{05_workWithAQL_statements2}
    ~var stmt = db._createStatement( { "query": "FOR i IN [ 1, 2 ] RETURN i * 2" } );
    c = stmt.execute();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 05_workWithAQL_statements2
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Cursors

Once the query executed the query results are available in a cursor. 
The cursor can return all its results at once using the *toArray* method.
This is a short-cut that you can use if you want to access the full result
set without iterating over it yourself.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 05_workWithAQL_statements3
    @EXAMPLE_ARANGOSH_OUTPUT{05_workWithAQL_statements3}
    ~var stmt = db._createStatement( { "query": "FOR i IN [ 1, 2 ] RETURN i * 2" } );
    ~var c = stmt.execute();
    c.toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 05_workWithAQL_statements3
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}    

Cursors can also be used to iterate over the result set document-by-document.
To do so, use the *hasNext* and *next* methods of the cursor:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 05_workWithAQL_statements4
    @EXAMPLE_ARANGOSH_OUTPUT{05_workWithAQL_statements4}
    ~var stmt = db._createStatement( { "query": "FOR i IN [ 1, 2 ] RETURN i * 2" } );
    ~var c = stmt.execute();
    while (c.hasNext()) { require("@arangodb").print(c.next()); }
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 05_workWithAQL_statements4
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Please note that you can iterate over the results of a cursor only once, and that
the cursor will be empty when you have fully iterated over it. To iterate over
the results again, the query needs to be re-executed.

Additionally, the iteration can be done in a forward-only fashion. There is no 
backwards iteration or random access to elements in a cursor.    

### ArangoStatement parameters binding

To execute an AQL query using bind parameters, you need to create a statement first
and then bind the parameters to it before execution:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 05_workWithAQL_statements5
    @EXAMPLE_ARANGOSH_OUTPUT{05_workWithAQL_statements5}
    |var stmt = db._createStatement( {
        "query": "FOR i IN [ @one, @two ] RETURN i * 2" } );
    stmt.bind("one", 1);
    stmt.bind("two", 2);
    c = stmt.execute();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 05_workWithAQL_statements5
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

The cursor results can then be dumped or iterated over as usual, e.g.:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 05_workWithAQL_statements6
    @EXAMPLE_ARANGOSH_OUTPUT{05_workWithAQL_statements6}
    ~var stmt = db._createStatement( { "query": "FOR i IN [ @one, @two ] RETURN i * 2" } );
    ~stmt.bind("one", 1);
    ~stmt.bind("two", 2);
    ~var c = stmt.execute();
    c.toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 05_workWithAQL_statements6
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

or

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 05_workWithAQL_statements7
    @EXAMPLE_ARANGOSH_OUTPUT{05_workWithAQL_statements7}
    ~var stmt = db._createStatement( { "query": "FOR i IN [ @one, @two ] RETURN i * 2" } );
    ~stmt.bind("one", 1);
    ~stmt.bind("two", 2);
    ~var c = stmt.execute();
    while (c.hasNext()) { require("@arangodb").print(c.next()); }
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 05_workWithAQL_statements7
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Please note that bind parameters can also be passed into the *_createStatement* method directly,
making it a bit more convenient:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 05_workWithAQL_statements8
    @EXAMPLE_ARANGOSH_OUTPUT{05_workWithAQL_statements8}
    |stmt = db._createStatement( { 
    |  "query": "FOR i IN [ @one, @two ] RETURN i * 2", 
    |  "bindVars": { 
    |    "one": 1, 
    |    "two": 2 
    |  } 
    } );
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 05_workWithAQL_statements8
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Counting with a cursor

Cursors also optionally provide the total number of results. By default, they do not. 
To make the server return the total number of results, you may set the *count* attribute to 
*true* when creating a statement:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}    
    @startDocuBlockInline 05_workWithAQL_statements9
    @EXAMPLE_ARANGOSH_OUTPUT{05_workWithAQL_statements9}
    |stmt = db._createStatement( {
    | "query": "FOR i IN [ 1, 2, 3, 4 ] RETURN i",
      "count": true } );
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 05_workWithAQL_statements9
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

After executing this query, you can use the *count* method of the cursor to get the 
number of total results from the result set:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 05_workWithAQL_statements10
    @EXAMPLE_ARANGOSH_OUTPUT{05_workWithAQL_statements10}
    ~var stmt = db._createStatement( { "query": "FOR i IN [ 1, 2, 3, 4 ] RETURN i", "count": true } );
    var c = stmt.execute();
    c.count();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 05_workWithAQL_statements10
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Please note that the *count* method returns nothing if you did not specify the *count*
attribute when creating the query.

This is intentional so that the server may apply optimizations when executing the query and 
construct the result set incrementally. Incremental creation of the result sets
is no possible
if all of the results need to be shipped to the client anyway. Therefore, the client
has the choice to specify *count* and retrieve the total number of results for a query (and
disable potential incremental result set creation on the server), or to not retrieve the total
number of results and allow the server to apply optimizations.

Please note that at the moment the server will always create the full result set for each query so 
specifying or omitting the *count* attribute currently does not have any impact on query execution.
This may change in the future. Future versions of ArangoDB may create result sets incrementally 
on the server-side and may be able to apply optimizations if a result set is not fully fetched by 
a client.

### Using cursors to obtain additional information on internal timings

Cursors can also optionally provide statistics of the internal execution phases. By default, they do not. 
To get to know how long parsing, optimization, instantiation and execution took,
make the server return that by setting the *profile* attribute to
*true* when creating a statement:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 06_workWithAQL_statements11
    @EXAMPLE_ARANGOSH_OUTPUT{06_workWithAQL_statements11}
    |stmt = db._createStatement( {
    | "query": "FOR i IN [ 1, 2, 3, 4 ] RETURN i",
      options: {"profile": true}} );
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 06_workWithAQL_statements11
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

After executing this query, you can use the *getExtra()* method of the cursor to get the 
produced statistics:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 06_workWithAQL_statements12
    @EXAMPLE_ARANGOSH_OUTPUT{06_workWithAQL_statements12}
    ~var stmt = db._createStatement( { "query": "FOR i IN [ 1, 2, 3, 4 ] RETURN i", options: {"profile": true}} );
    var c = stmt.execute();
    c.getExtra();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 06_workWithAQL_statements12
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Query validation
----------------

The *_parse* method of the *db* object can be used to parse and validate a
query syntactically, without actually executing it.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 06_workWithAQL_statements13
    @EXAMPLE_ARANGOSH_OUTPUT{06_workWithAQL_statements13}
    db._parse( "FOR i IN [ 1, 2 ] RETURN i" );
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 06_workWithAQL_statements13
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
