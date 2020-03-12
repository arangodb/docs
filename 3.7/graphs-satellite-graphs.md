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

When doing queries involving graph traversals, shortest paths, or k-shortest paths
in an ArangoDB cluster, data has to be exchanged between different servers. In particular
graph traversals are usually executed on a Coordinator, because they need global information. 

This results in a lot of network traffic and slow query execution.

Satellite graphs are synchronously replicated to all DB-Servers that are part of
a cluster, which enables DB-Servers to execute graph traversals, shortest paths,
and k-shortest paths locally.

This greatly improves performance for such queries.

To create a satellite graph in arangosh, use the `satelliteGraph` module.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphCreate1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphCreate1_cluster}
      const satelliteGraphModule = require("@arangodb/satellite-graph")
      var graph = satelliteGraphModule._create("satelliteGraph", [], [], {})
      satelliteGraphModule._graph("satelliteGraph")
      ~satelliteGraphModule._drop("satelliteGraph", true)
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphCreate1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

You can also add vertex and edge collections to a satellite graph manually. To
achieve this, create them with `replicationFactor` set to `satellite`, and
`distributeShardsLike` to the lead vertex collection of the graph, i.e. the
first vertex collection.

A full example
--------------

First we setup our graphs and collections.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphExplain1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphExplain1_cluster}
    const explain = require("@arangodb/aql/explainer").explain
    graphModule = require("@arangodb/general-graph")
    satelliteGraphModule = require("@arangodb/satellite-graph")
    graphModule._create("normalGraph", [ graphModule._relation("edges", "vertices", "vertices") ], [], {})
    satelliteGraphModule._create("satelliteGraph", [ satelliteGraphModule._relation("satEdges", "satVertices", "satVertices") ], [], {})
    db._create("collection", {numberOfShards: 8})
    ~db._drop("collection")
    ~satelliteGraphModule._drop("satelliteGraph")
    ~graphModule._drop("normalGraph")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphExplain1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Let's analyse a query involving a traversal:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphExplain2_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphExplain2_cluster}
    ~const explain = require("@arangodb/aql/explainer").explain
    ~const graphModule = require("@arangodb/general-graph")
    ~const satelliteGraphModule = require("@arangodb/satellite-graph")
    ~graphModule._create("normalGraph", [ graphModule._relation("edges", "vertices", "vertices") ], [], {})
    ~satelliteGraphModule._create("satelliteGraph", [ satelliteGraphModule._relation("satEdges", "satVertices", "satVertices") ], [], {})
    ~db._create("collection", {numberOfShards: 8})
    explain(`FOR doc in collection FOR v,e,p IN OUTBOUND "vertices/start" GRAPH "normalGraph" RETURN [doc,v,e,p]`)
    ~db._drop("collection")
    ~satelliteGraphModule._drop("satelliteGraph")
    ~graphModule._drop("normalGraph")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphExplain2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

You can see that the `TraversalNode` is executed on a Coordinator, and only
the `EnumerateCollectionNode` is executed on DB-Server. This will happen for each of the 
8 shards in `collection`.

Let's now have a look at the same query using satellite graphs:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphExplain3_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphExplain3_cluster}
    ~const explain = require("@arangodb/aql/explainer").explain
    ~const graphModule = require("@arangodb/general-graph")
    ~const satelliteGraphModule = require("@arangodb/satellite-graph")
    ~graphModule._create("normalGraph", [ graphModule._relation("edges", "vertices", "vertices") ], [], {})
    ~satelliteGraphModule._create("satelliteGraph", [ satelliteGraphModule._relation("satEdges", "satVertices", "satVertices") ], [], {})
    ~db._create("collection", {numberOfShards: 8})
    explain(`FOR doc in collection FOR v,e,p IN OUTBOUND "vertices/start" GRAPH "satelliteGraph" RETURN [doc,v,e,p]`)
    ~db._drop("collection")
    ~satelliteGraphModule._drop("satelliteGraph")
    ~graphModule._drop("normalGraph")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphExplain3_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Note that now the `TraversalNode` is executed on each DBServer, leading to a great reduction in
required network communication, and hence potential gains in query performance.

Caveats
-------

The cluster will automatically distribute all satellite graphs to all DBServers, and apply
synchronous replication. 
This means that writes are executed on the leader only, and then have to be replicated
to all followers, leading to degradation in write performance.

There is also a chance that a write has not been replicated in time before a query is instantiated
leading to different DB-Servers seeing inconsistent states of satellite graphs involved. This leads to
inconsistent query results depending on which DB-Server a query snippet is executed.
