---
layout: default
description: SmartJoins allow to execute co-located join operations among identically sharded collections.
title: SmartJoins for ArangoDB Clusters
---
SmartJoins
==========

{% include hint-ee-arangograph.md feature="SmartJoins" plural=true %}

SmartJoins allow to execute co-located join operations among identically
sharded collections.

`arangosearch` Views are eligible for SmartJoins, provided that their underlying
collections are eligible too.

Cluster joins without being smart
---------------------------------

When doing joins in an ArangoDB cluster, data has to be exchanged between different servers.
Joins between different collections in a cluster normally require roundtrips between the 
shards of these collections for fetching the data. Requests are routed through an extra
Coordinator hop.

For example, with two collections `c1` and `c2` with 4 shards each, the Coordinator 
initially contacts the 4 shards of `c1`. In order to perform the join, the DB-Server nodes 
which manage the actual data of `c1` need to pull the data from the other collection, `c2`.
This causes extra roundtrips via the Coordinator, which then pulls the data for `c2` 
from the responsible shards:

```js
arangosh> db._explain("FOR doc1 IN c1 FOR doc2 IN c2 FILTER doc1._key == doc2._key RETURN doc1");

Query String:
  FOR doc1 IN c1 FOR doc2 IN c2 FILTER doc1._key == doc2._key RETURN doc1

Execution plan:
  Id   NodeType                  Site  Est.   Comment
   1   SingletonNode             DBS      1   * ROOT
   3   EnumerateCollectionNode   DBS      0     - FOR doc2 IN c2   /* full collection scan, 4 shard(s) */
  14   RemoteNode                COOR     0       - REMOTE
  15   GatherNode                COOR     0       - GATHER
   8   ScatterNode               COOR     0       - SCATTER
   9   RemoteNode                DBS      0       - REMOTE
   7   IndexNode                 DBS      0       - FOR doc1 IN c1   /* primary index scan, 4 shard(s) */
  10   RemoteNode                COOR     0         - REMOTE
  11   GatherNode                COOR     0         - GATHER
   6   ReturnNode                COOR     0         - RETURN doc1
```

This is the general query execution, and it makes sense if there is no further
information available about how the data is actually distributed to the individual
shards. It works in case `c1` and `c2` have a different amount of shards, or use 
different shard keys or strategies. However, it comes with the additional cost of 
having to do 4 x 4 requests to perform the join.


Sharding two collections identically using distributeShardsLike
---------------------------------------------------------------

In the specific case that the two collections have the same number of shards, the 
data of the two collections can be co-located on the same server for the same shard 
key values. In this case, the extra hop via the Coordinator is not necessary.

The query optimizer removes the extra hop for the join in case it can prove
that data for the two collections is co-located.

The first step is thus to make the two collections shard their data alike. This can 
be achieved by making the `distributeShardsLike` attribute of one of the collections
refer to the other collection.

Here is an example setup for this, using arangosh:

```js
arangosh> db._create("c1", {numberOfShards: 4, shardKeys: ["_key"]});
arangosh> db._create("c2", {shardKeys: ["_key"], distributeShardsLike: "c1"});
```

Now the collections `c1` and `c2` not only have the same shard keys, but they
also locate their data for the same shard keys values on the same server.

Let's check how the data actually gets distributed now. We first confirm that the
two collections have 4 shards each, which in this example are evenly distributed
across two servers:
 
```js
arangosh> db.c1.shards(true)
{ 
  "s2011661" : [ 
    "PRMR-64d19f43-3aa0-4abb-81f6-4b9966d32175" 
  ], 
  "s2011662" : [ 
    "PRMR-5f30caa0-4c93-4fdd-98f3-a2130c1447df" 
  ], 
  "s2011663" : [ 
    "PRMR-64d19f43-3aa0-4abb-81f6-4b9966d32175" 
  ], 
  "s2011664" : [ 
    "PRMR-5f30caa0-4c93-4fdd-98f3-a2130c1447df" 
  ] 
}

arangosh> db.c2.shards(true)
{ 
  "s2011666" : [ 
    "PRMR-64d19f43-3aa0-4abb-81f6-4b9966d32175" 
  ], 
  "s2011667" : [ 
    "PRMR-5f30caa0-4c93-4fdd-98f3-a2130c1447df" 
  ], 
  "s2011668" : [ 
    "PRMR-64d19f43-3aa0-4abb-81f6-4b9966d32175" 
  ], 
  "s2011669" : [ 
    "PRMR-5f30caa0-4c93-4fdd-98f3-a2130c1447df" 
  ] 
}
```

Because we have told both collections that distribute their data alike, their
shards are now also populated alike:

```js
arangosh> for (i = 0; i < 100; ++i) { 
  db.c1.insert({ _key: "test" + i }); 
  db.c2.insert({ _key: "test" + i }); 
}

arangosh> db.c1.count(true);
{
  "s2011664" : 22,
  "s2011661" : 21,
  "s2011663" : 27,
  "s2011662" : 30
}

arangosh> db.c2.count(true);
{
  "s2011669" : 22,
  "s2011666" : 21,
  "s2011668" : 27,
  "s2011667" : 30
}
```

We can see that shard 1 of `c1` ("s2011664") has the same number of documents as
shard 1 of `c2` ("s20116692), that shard 2 of `c1` ("s2011661") has the same
number of documents as shard2 of `c2` ("s2011666") etc.
Additionally, we can see from the shard-to-server distribution above that the
corresponding shards from `c1` and `c2` always reside on the same node.
This is a precondition for running joins locally, and thanks to the effects of
`distributeShardsLike` it is now satisfied!

SmartJoins using distributeShardsLike
-------------------------------------

With the two collections in place like this, an AQL query that uses a FILTER condition
that refers from the shard key of the one collection to the shard key of the other collection
and compares the two shard key values by equality is eligible for the query
optimizer's "smart-joins" optimization:

```js
arangosh> db._explain("FOR doc1 IN c1 FOR doc2 IN c2 FILTER doc1._key == doc2._key RETURN doc1");

Query String:
  FOR doc1 IN c1 FOR doc2 IN c2 FILTER doc1._key == doc2._key RETURN doc1

Execution plan:
  Id   NodeType                  Site  Est.   Comment
   1   SingletonNode             DBS      1   * ROOT
   3   EnumerateCollectionNode   DBS      0     - FOR doc2 IN c2   /* full collection scan, 4 shard(s) */
   7   IndexNode                 DBS      0       - FOR doc1 IN c1   /* primary index scan, 4 shard(s) */
  10   RemoteNode                COOR     0         - REMOTE
  11   GatherNode                COOR     0         - GATHER 
   6   ReturnNode                COOR     0         - RETURN doc1
```

As can be seen above, the extra hop via the Coordinator is gone here, which means
less cluster-internal traffic and a faster response time.

SmartJoins also work if the shard key of the second collection is not `_key`,
and even for non-unique shard key values, e.g.:

```js
arangosh> db._create("c1", {numberOfShards: 4, shardKeys: ["_key"]});
arangosh> db._create("c2", {shardKeys: ["parent"], distributeShardsLike: "c1"});
arangosh> db.c2.ensureIndex({ type: "hash", fields: ["parent"] });
arangosh> for (i = 0; i < 100; ++i) { 
  db.c1.insert({ _key: "test" + i }); 
  for (j = 0; j < 10; ++j) {
    db.c2.insert({ parent: "test" + i });
  }
}

arangosh> db._explain("FOR doc1 IN c1 FOR doc2 IN c2 FILTER doc1._key == doc2.parent RETURN doc1");

Query String:
  FOR doc1 IN c1 FOR doc2 IN c2 FILTER doc1._key == doc2.parent RETURN doc1

Execution plan:
  Id   NodeType                  Site  Est.   Comment
   1   SingletonNode             DBS      1   * ROOT
   3   EnumerateCollectionNode   DBS   2000     - FOR doc2 IN c2   /* full collection scan, 4 shard(s) */
   7   IndexNode                 DBS   2000       - FOR doc1 IN c1   /* primary index scan, 4 shard(s) */
  10   RemoteNode                COOR  2000         - REMOTE
  11   GatherNode                COOR  2000         - GATHER 
   6   ReturnNode                COOR  2000         - RETURN doc1
```

{% hint 'tip' %}
All above examples used two collections only. SmartJoins also work when joining
more than two collections/Views which have the same data distribution enforced via their
`distributeShardsLike` attribute and using the shard keys as the join criteria as shown above.
{% endhint %}

SmartJoins using smartJoinAttribute
-----------------------------------

In case the join on the second collection must be performed on a non-shard key
attribute, there is the option to specify a `smartJoinAttribute` for the collection.
Note that for this case, setting `distributeShardsLike` is still required here, and that
only a single `shardKeys` attribute can be used.
The single attribute name specified in the `shardKeys` attribute for the collection must end
with a colon character then.

This `smartJoinAttribute` must be populated for all documents in the collection,
and must always contain a string value. The value of the `_key` attribute for each
document must consist of the value of the `smartJoinAttribute`, a colon character
and then some other user-defined key component.

The setup thus becomes:

```js
  arangosh> db._create("c1", {numberOfShards: 4, shardKeys: ["_key"]});
  arangosh> db._create("c2", {shardKeys: ["_key:"], smartJoinAttribute: "parent", distributeShardsLike: "c1"});
  arangosh> db.c2.ensureIndex({ type: "hash", fields: ["parent"] });
  arangosh> for (i = 0; i < 100; ++i) { 
    db.c1.insert({ _key: "test" + i }); 
    db.c2.insert({ _key: "test" + i + ":" + "ownKey" + i, parent: "test" + i }); 
  }
```

Failure to populate the `smartJoinAttribute` with a string or not at all leads
to a document being rejected on insert, update or replace. Similarly, failure to
prefix a document's `_key` attribute value with the value of the `smartJoinAttribute`
also leads to the document being rejected:

```js
arangosh> db.c2.insert({ parent: 123 });
JavaScript exception in file './js/client/modules/@arangodb/arangosh.js' at 99,7: ArangoError 4008: SmartJoin attribute not given or invalid

arangosh> db.c2.insert({ _key: "123:test1", parent: "124" });
JavaScript exception in file './js/client/modules/@arangodb/arangosh.js' at 99,7: ArangoError 4007: shard key value must be prefixed with the value of the SmartJoin attribute
```

The join can now be performed via the collection's `smartJoinAttribute`:

```js
arangosh> db._explain("FOR doc1 IN c1 FOR doc2 IN c2 FILTER doc1._key == doc2.parent RETURN doc1")

Query String:
  FOR doc1 IN c1 FOR doc2 IN c2 FILTER doc1._key == doc2.parent RETURN doc1

Execution plan:
  Id   NodeType                  Site  Est.   Comment
   1   SingletonNode             DBS      1   * ROOT
   3   EnumerateCollectionNode   DBS    101     - FOR doc2 IN c2   /* full collection scan, 4 shard(s) */
   7   IndexNode                 DBS    101       - FOR doc1 IN c1   /* primary index scan, 4 shard(s) */
  10   RemoteNode                COOR   101         - REMOTE
  11   GatherNode                COOR   101         - GATHER 
   6   ReturnNode                COOR   101         - RETURN doc1
```

Restricting SmartJoins to a single shard
----------------------------------------

If a FILTER condition is used on one of the shard keys, the optimizer also tries
to restrict the queries to just the required shards:

```js
arangosh> db._explain("FOR doc1 IN c1 FOR doc2 IN c2 FILTER doc1._key == 'test' && doc1._key == doc2.value RETURN doc1");

Query String:
FOR doc1 IN c1 FOR doc2 IN c2 FILTER doc1._key == 'test' && doc1._key == doc2.value 
RETURN doc1

Execution plan:
Id   NodeType        Site  Est.   Comment
 1   SingletonNode   DBS      1   * ROOT
 8   IndexNode       DBS      1     - FOR doc1 IN c1   /* primary index scan, shard: s2010246 */
 7   IndexNode       DBS      1       - FOR doc2 IN c2   /* primary index scan, scan only, shard: s2010253 */
12   RemoteNode      COOR     1         - REMOTE
13   GatherNode      COOR     1         - GATHER 
 6   ReturnNode      COOR     1         - RETURN doc1
```

Limitations
-----------

The SmartJoins optimization is currently triggered only for data selection queries,
but not for any data-manipulation operations such as INSERT, UPDATE, REPLACE, REMOVE
or UPSERT, neither traversals or subqueries.

It is only applied when joining two collections with an identical
sharding setup. This requires all involved but one collection to be created
with its `distributeShardsLike` attribute pointing to the collection that is
the exception. All collections forming a View must be sharded in the same way,
otherwise the View is not eligible.

It is restricted to be used with simple shard key attributes (such as `_key`, `productId`),
but not with nested attributes (e.g. `name.first`). There should be exactly one shard
key attribute defined for each collection.

Finally, the SmartJoins optimization requires that the involved collections are
joined on their shard key attributes (or `smartJoinAttribute`) using an equality
comparison.
