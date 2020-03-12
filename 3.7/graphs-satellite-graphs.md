---
layout: default
description: Graphs synchronously replicated to all servers, available in the Enterprise Edition
title: ArangoDB Satellite Graphs
---
Satellite Graphs
=====================

{% hint 'info' %}
Satellite Graphs are only available in the
[**Enterprise Edition**](https://www.arangodb.com/why-arangodb/arangodb-enterprise/){:target="_blank"},
and the [**ArangoDB Cloud**](https://cloud.arangodb.com/){:target="_blank"}.
{% endhint %}

Satellite Graphs are the natural extension of the concept of Satellite
collections to graphs. All of the usual benefits and caveats apply.

When doing joins involving graph traversals, shortest paths, or k-shortest paths
in an ArangoDB cluster, data has to be exchanged between different servers. In particular
graph traversals are usually executed on a Coordinator, because they need global information. 

This results in a lot of network traffic and slow query execution.

Satellite graphs are synchronously replicated to all DB-Servers that are part of
a cluster, which enables DB-Servers to execute parts of joins locally.

This greatly improves performance for such joins.

To create a satellite graph in arangosh, use the `satelliteGraph` module.

    arangosh> satGM = require("@arangodb/satellite-graph")
    arangosh> satGM._create("satelliteGraph", [ satGM._relation("edges", "vertices", "vertices") ], [], {});

You can also create vertex and edge collections manually, and set their `replicationFactor` to
`satellite`

    arangosh> db._createDocumentCollection("vertices2", { replicationFactor: "satellite" });
    arangosh> db._createEdgeCollection("edges2", { replicationFactor: "satellite" });

A full example
--------------

    arangosh> var explain = require("@arangodb/aql/explainer").explain
    arangosh> graphModule = require("@arangodb/general-graph");
    arangosh> satGraphModule = require("@arangodb/satellite-graph");
    arangosh> graphModule._create("normalGraph", [ graphModule._relation("edges", "vertices", "vertices") ], [], {});
    arangosh> satGraphModule._create("satelliteGraph", [ satGM._relation("satEdges", "satVertices", "satVertices") ], [], {});
    arangosh> db._create("collection", {numberOfShards: 8})
    arangosh> db._create("collection2", {numberOfShards: 8})

Let's analyse a join involving a traversal.

```
arangosh> explain(`FOR doc in collection FOR v,e,p IN OUTBOUND "vertices/start" GRAPH "normalGraph" RETURN [doc,v,e,p]`)

Query String (99 chars, cacheable: true):
 FOR doc in collection FOR v,e,p IN OUTBOUND "vertices/start" GRAPH "normalGraph" RETURN [doc,v,e,p]

Execution plan:
 Id   NodeType                  Site  Est.   Comment
  1   SingletonNode             DBS      1   * ROOT
  2   EnumerateCollectionNode   DBS      0     - FOR doc IN collection   /* full collection scan, 8 shard(s) */
  8   RemoteNode                COOR     0       - REMOTE
  9   GatherNode                COOR     0       - GATHER 
  3   TraversalNode             COOR     0       - FOR v  /* vertex */, e  /* edge */, p  /* paths */ IN 1..1  /* min..maxPathDepth */ OUTBOUND 'vertices/start' /* startnode */  GRAPH 'normalGraph'
  4   CalculationNode           COOR     0         - LET #6 = [ doc, v, e, p ]   /* simple expression */   /* collections used: doc : collection */
  5   ReturnNode                COOR     0         - RETURN #6

Indexes used:
 By   Name   Type   Collection   Unique   Sparse   Selectivity   Fields        Ranges
  3   edge   edge   edges        false    false       100.00 %   [ `_from` ]   base OUTBOUND

Traversals on graphs:
 Id  Depth  Vertex collections  Edge collections  Options                                  Filter / Prune Conditions
 3   1..1   vertices            edges             uniqueVertices: none, uniqueEdges: path                           

Optimization rules applied:
 Id   RuleName
  1   scatter-in-cluster
  2   remove-unnecessary-remote-scatter
```

You can see that the `TraversalNode` (number 3) is executed on a Coordinator, and only
the `EnumerateCollectionNode` is executed on DB-Server. This will happen for each of the 
8 shards in `collection`.

Let's now have a look at the same query using satellite graphs:

```
arangosh> explain(`FOR doc in collection FOR v,e,p IN OUTBOUND "vertices/start" GRAPH "satelliteGraph" RETURN [doc,v,e,p]`)

Query String (102 chars, cacheable: true):
 FOR doc in collection FOR v,e,p IN OUTBOUND "vertices/start" GRAPH "satelliteGraph" RETURN 
 [doc,v,e,p]

Execution plan:
 Id   NodeType                  Site  Est.   Comment
  1   SingletonNode             DBS      1   * ROOT
  2   EnumerateCollectionNode   DBS      0     - FOR doc IN collection   /* full collection scan, 8 shard(s) */
 10   TraversalNode             DBS      0       - FOR v  /* vertex */, e  /* edge */, p  /* paths */ IN 1..1  /* min..maxPathDepth */ OUTBOUND 'vertices/start' /* startnode */  edges
 13   RemoteNode                COOR     0         - REMOTE
 14   GatherNode                COOR     0         - GATHER 
  4   CalculationNode           COOR     0         - LET #6 = [ doc, v, e, p ]   /* simple expression */   /* collections used: doc : collection */
  5   ReturnNode                COOR     0         - RETURN #6

Indexes used:
 By   Name   Type   Collection   Unique   Sparse   Selectivity   Fields        Ranges
 10   edge   edge   edges        false    false       100.00 %   [ `_from` ]   base OUTBOUND

Traversals on graphs:
 Id  Depth  Vertex collections  Edge collections  Options                                  Filter / Prune Conditions
 10  1..1                       edges             uniqueVertices: none, uniqueEdges: path                           

Optimization rules applied:
 Id   RuleName
  1   scatter-in-cluster
  2   remove-unnecessary-remote-scatter
  3   scatter-satellite-graphs
  4   remove-satellite-joins
```

Note that now the `TraversalNode` (with id 10) is executed on each DBServer, leading to a great reduction in
required network communication, and hence potential gains in query performance.

Caveats
-------

The cluster will automatically distribute all satellite graphs to all DBServers, and apply
synchronous replication. 
This means that writes are executed on the leader only, and then have to be replicated
to all followers, leading to degradation in write performance.

There is also a chance that a write has not been replicated in time before a query is executed
and a query involving satellite graphs returns out of date results.
