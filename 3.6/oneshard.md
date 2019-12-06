---
layout: default
description: queries using the OneShard feature can be faster
---

OneShard enterpise-feature
==========================

What is the OneShard feature?
-----------------------------

Under certain conditions big parts of the execution can be pushed to a single
db-servers. This can result in big performance gains because usually multiple
db-servers and a coordinator are involved in the execution of a query.

Without the OneShard feature query processing works as follows. The coordinator
accepts and analyses the query. If collections are accessed the coordinator
distributes the accesses to collections to different db-servers that hold parts
(shards) of the collections in question.
This distributed access requires network-traffic from coordinator to dbservers
and back from dbserves to coordinators and is therefore expensive. Another cost
factor is the memory and cpu-time required on the coordinator, when it has to
process several concurrent complex queries. In such situations coordinators
might become a bottleneck in query processing. Because they need to send and
receive data on several connections, build up results for collection accesses
from the received parts followed by further processing.
If the one shard feature can be used for a query then the whole query is pushed
to a db-server and executed on the server. The coordinator will only get back
the final result. This can reduce resource usage and communication overhead
for the coordinator dramatically as show in the [example]() below.



How to use the OneShard feature?
--------------------------------

In order to use the OneShard feature you just need to have the ArangoDB enterprise
edition installed. Then the optimizer will automatically make use of the of the
OneShard feature if the collections used in the query are eligible. To be eligible
the single shards of all the collections in question have to be on the same dbserver.


### Setting up Databases and Collections

The easiest way to make use of the OneShard Feature is to create a database
with the extra option `{ sharding: "single" }`. As done in the following
example:

```
127.0.0.1:8529@_system> db._createDatabase("oneShardDB", { sharding: "single" } )
true

127.0.0.1:8529@_system> db._useDatabase("oneShardDB")
true

127.0.0.1:8529@oneShardDB> db._properties()
{
  "id" : "6010005",
  "name" : "oneShardDB",
  "isSystem" : false,
  "sharding" : "single",
  "replicationFactor" : 1,
  "writeConcern" : 1,
  "path" : ""
}
```

Now we can go ahead and create a collection as it usually done:

```
127.0.0.1:8529@oneShardDB> db._create("example1")
[ArangoCollection 6010029, "example1" (type document, status loaded)]

127.0.0.1:8529@oneShardDB> db.example1.properties()
{
  "isSmart" : false,
  "isSystem" : false,
  "waitForSync" : false,
  "shardKeys" : [
    "_key"
  ],
  "numberOfShards" : 1,
  "keyOptions" : {
    "allowUserKeys" : true,
    "type" : "traditional"
  },
  "replicationFactor" : 2,
  "minReplicationFactor" : 1,
  "writeConcern" : 1,
  "distributeShardsLike" : "_graphs",
  "shardingStrategy" : "hash",
  "cacheEnabled" : false
}
```

As you can see the `numberOfShards` is set to `1` and `distributeShardsLike` is set to `_graphs`.
These attributes have been automatically been set because we specified the `{ "sharding" : "single" }`
options object when creating the database. To do this manually one would create a collection in the
following way `db._create("example2", {"numberOfShards":1 , "distributeShardsLike":"_graphs"})`
Here we used again the `_graphs` collection, but any other existing collection, that has not been
created with the `distributesShardsLike` option could have been used here.


### Running Queries

First we insert a few documents into a collection, create a query and explain
what will be done.

```
127.0.0.1:8529@oneShardDB> for(let i=0; i<10000; i++) { db.example.insert( {"value":i} ) }
{
  "_id" : "example/6010134",
  "_key" : "6010134",
  "_rev" : "_ZrqaOt2---"
}

127.0.0.1:8529@oneShardDB> q="FOR doc IN @@collection FILTER doc.value % 2 == 0 SORT doc.value ASC LIMIT 10 RETURN doc"
FOR doc IN @@collection FILTER doc.value % 2 == 0 SORT doc.value ASC LIMIT 10 RETURN doc

127.0.0.1:8529@oneShardDB> db._explain(q, { "@collection":"example" })
Query String (88 chars, cacheable: true):
 FOR doc IN @@collection FILTER doc.value % 2 == 0 SORT doc.value ASC LIMIT 10 RETURN doc

Execution plan:
 Id   NodeType                  Site   Est.   Comment
  1   SingletonNode             DBS       1   * ROOT
  2   EnumerateCollectionNode   DBS   10000     - FOR doc IN example   /* full collection scan, 1 shard(s) */   FILTER ((doc.`value` % 2) == 0)   /* early pruning */
  5   CalculationNode           DBS   10000       - LET #3 = doc.`value`   /* attribute expression */   /* collections used: doc : example */
  6   SortNode                  DBS   10000       - SORT #3 ASC   /* sorting strategy: constrained heap */
  7   LimitNode                 DBS      10       - LIMIT 0, 10
  9   RemoteNode                COOR     10       - REMOTE
 10   GatherNode                COOR     10       - GATHER
  8   ReturnNode                COOR     10       - RETURN doc

Indexes used:
 none

Optimization rules applied:
 Id   RuleName
  1   move-calculations-up
  2   move-filters-up
  3   move-calculations-up-2
  4   move-filters-up-2
  5   cluster-one-shard
  6   sort-limit
  7   move-filters-into-enumerate

```

As it can be seen in the explain output almost the complete query is executed
on the dbserver (`DBS` for nodes 1-7) and only 10 documents are transferred to
the coordinator. In case we do the same with a collection that consists of
several shards we get a different result:

```
127.0.0.1:8529@_system> db._create("example", { numberOfShards : 5})
[ArangoCollection 6863477, "example" (type document, status loaded)]

127.0.0.1:8529@_system> for(let i=0; i<10000; i++) { db.example.insert( {"value":i} ) }
{
  "_id" : "example/6873482",
  "_key" : "6873482",
  "_rev" : "_ZrrC_0K---"
}

127.0.0.1:8529@_system> db._explain(q, { "@collection":"example" })
Query String (88 chars, cacheable: true):
 FOR doc IN @@collection FILTER doc.value % 2 == 0 SORT doc.value ASC LIMIT 10 RETURN doc

Execution plan:
 Id   NodeType                  Site   Est.   Comment
  1   SingletonNode             DBS       1   * ROOT
  2   EnumerateCollectionNode   DBS   10000     - FOR doc IN example   /* full collection scan, 5 shard(s) */   FILTER ((doc.`value` % 2) == 0)   /* early pruning */
  5   CalculationNode           DBS   10000       - LET #3 = doc.`value`   /* attribute expression */   /* collections used: doc : example */
  6   SortNode                  DBS   10000       - SORT #3 ASC   /* sorting strategy: constrained heap */
 11   RemoteNode                COOR  10000       - REMOTE
 12   GatherNode                COOR  10000       - GATHER #3 ASC  /* parallel, sort mode: heap */
  7   LimitNode                 COOR     10       - LIMIT 0, 10
  8   ReturnNode                COOR     10       - RETURN doc

Indexes used:
 none

Optimization rules applied:
 Id   RuleName
  1   move-calculations-up
  2   move-filters-up
  3   move-calculations-up-2
  4   move-filters-up-2
  5   scatter-in-cluster
  6   distribute-filtercalc-to-cluster
  7   distribute-sort-to-cluster
  8   remove-unnecessary-remote-scatter
  9   sort-limit
 10   move-filters-into-enumerate
 11   parallelize-gather
```

Without the oneshard feature all documents have potentially to be send to the
coordinator for further processing. With this simple query this is actually not
true, because we do some super awesome optimization that is able to reduce
the number of documents, but when the queries become more complex and more
collections are involved the optimizer will not be able to help as much.
