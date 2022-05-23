---
layout: default 
description: SmartGraphs enable you to manage graphs at scale. 
title: ArangoDB SmartGraphs
---
SmartGraphs
===========

{% include hint-ee-oasis.md feature="SmartGraphs" plural=true %}

This chapter describes the `smart-graph` module, which enables you to manage graphs at scale. It will give a vast
performance benefit for all graphs sharded in an ArangoDB Cluster. On a single server this feature is pointless,
however, it is possible to create a SmartGraph also on a single server for testing and then to port it to a cluster, see
[SmartGraphs and SatelliteGraphs on a Single Server](smart-and-satellite-graphs-single-server.html).

In terms of querying there is no difference between SmartGraphs and General Graphs. The former is a transparent
replacement for the latter. For graph querying please refer to [AQL Graph Operations](aql/graphs.html)
and [General Graph Functions](graphs-general-graphs-functions.html) sections. The optimizer is clever enough to identify
whether it is a SmartGraph or not.

The difference is only in the management section: creating and modifying the underlying collections of the graph. For a
detailed API reference please refer to [SmartGraph Management](graphs-smart-graphs-management.html).

Do the hands-on
[ArangoDB SmartGraphs Tutorial](https://www.arangodb.com/using-smartgraphs-arangodb/){:target="_blank"}
to learn more.

What makes a graph smart?
-------------------------

Most graphs have one feature that divides the entire graph into several smaller subgraphs. These subgraphs have a large
amount of edges that only connect vertices in the same subgraph and only have few edges connecting vertices from other
subgraphs.

Examples for such graphs are:

- **Social Networks**<br>
  Typically the feature here is the region/country users live in. Every user typically has more contacts in the same
  region/country than in other regions/countries.

- **Transport Systems**<br>
  Also for transport systems the feature is the region/country. Typically, there are many local connections, but only a
  few go across the borders.

- **E-Commerce**<br>
  In this case the category of products may be a good feature. Products of the same category are often bought together.

If such a feature is known, SmartGraphs can make use if it.

When creating a SmartGraph you have to define a smartAttribute, which is the name of an attribute stored in every
vertex. The graph will then be automatically sharded in such a way that all vertices with the same value of this
attribute and all edges between them are stored on the same physical machine. During a query execution the query
optimizer and the query executor know which document is stored on which machine and can thereby minimize network
overhead. Everything that can be computed locally will be computed locally.

Benefits of SmartGraphs
-----------------------

Because of the above described guaranteed sharding, the performance of queries that only cover a subgraph stored on one
machine have a performance almost equal to a purely local computation. Queries that cover subgraphs from different
machines still require some network overhead. The more different machines are touched the more network cost will apply.
However the overall performance is never worse than the same query using a General Graph.

Hybrid SmartGraphs
-------------------------------

Hybrid SmartGraphs are capable of using SatelliteCollections within their graph definition. SatelliteCollections are
globally replicated to each participating DB-Server and so are edge collections between a SmartGraph collection and a
SatelliteCollection or between two SatelliteCollections. Thus a larger part of a
(weighted) graph traversal or a (k-)shortest path(s) query can be executed fully locally on each DB-Server
(in parallel) whenever data from the SatelliteCollections is involved.

Disjoint SmartGraphs
--------------------------------

Disjoint SmartGraphs are a specialized type of SmartGraphs.

In addition to the guaranteed sharding in SmartGraphs, a Disjoint SmartGraph prohibits edges between vertices with
different `smartGraphAttribute` values.

This ensures that graph traversals, shortest path, and k-shortest-paths queries can be executed locally on a DB-Server,
achieving an improved performance.

Hybrid Disjoint SmartGraphs
---------------------------------------

Hybrid Disjoint SmartGraphs are like Hybrid SmartGraphs but also prohibit edges between vertices _from non-satellite
collections_ with different `smartGraphAttribute` values. Edges between vertices at least one of which is in a satellite
collection are always possible. Edges having at least one end in a satellite collection are kept on a DB-server only if
the other end is also on the same DB-server (in particular, if that other end is also in a satellite collection).

In other words, each disjoint component can only have connections within itself, there is no switching of components in
any traversals. If a satellite vertex is shared between two components they cannot see each other's edges, so each
traversal and (k-)shortest path(s) query are executed locally.

Note a special case where the term _disjoint_ should be understood in a somewhat unusual sense: if we _start_ a
traversal from a satellite vertex, the search will continue from this vertex in all shards (components) in parallel.
However, if we visit a vertex from a satellite collection later, this does not make the search continue from this vertex
in other components.

Getting started
---------------

First of all, SmartGraphs **cannot use existing collections**. When switching to SmartGraph from an existing dataset you
have to import the data into a fresh SmartGraph. This switch can be easily achieved with
[arangodump](programs-arangodump.html) and
[arangorestore](programs-arangorestore.html). The only thing you have to change in this pipeline is that you create the
new collections with the SmartGraph module before starting `arangorestore`. That is, the steps are:

1. Dump the collections to be included into the graph.
2. Create the SmartGraph using the SmartGraph module including the collections into the graph.
3. Restore the dumped collections with `arangorestore` using the flags `--create-collection false`
   and `--import-data true`.

**Create a SmartGraph**

In contrast to General Graphs we have to add more options when creating the graph. The two options `smartGraphAttribute`
and `numberOfShards` are required and cannot be modified later.

{% arangoshexample examplevar="examplevar" script="script" result="result" %} 
  @startDocuBlockInline smartGraphCreateGraphHowTo1_cluster 
  @EXAMPLE_ARANGOSH_OUTPUT{smartGraphCreateGraphHowTo1_cluster} 
    var graph_module = require("@arangodb/smart-graph"); 
    var graph = graph_module._create("myGraph", [], [], {smartGraphAttribute: "region", numberOfShards: 9}); 
    graph_module._graph("myGraph");
    ~graph_module._drop("myGraph"); 
  @END_EXAMPLE_ARANGOSH_OUTPUT 
  @endDocuBlock smartGraphCreateGraphHowTo1_cluster 
{% endarangoshexample %} 
{% include arangoshexample.html id=examplevar script=script result=result %}

**Create a Disjoint SmartGraph**

In contrast to regular SmartGraphs we have to add one option when creating the graph. The boolean option `isDisjoint` is
required, needs to be set to `true`
and cannot be modified later.

{% arangoshexample examplevar="examplevar" script="script" result="result" %} 
  @startDocuBlockInline smartGraphCreateGraphHowToDisjoint1_cluster 
  @EXAMPLE_ARANGOSH_OUTPUT{smartGraphCreateGraphHowToDisjoint1_cluster} 
    var graph_module = require("@arangodb/smart-graph"); 
    var graph = graph_module._create("myGraph", [], [], {smartGraphAttribute: "region", numberOfShards: 9, isDisjoint: true}); 
    graph_module._graph("myGraph");
    ~graph_module._drop("myGraph"); 
  @END_EXAMPLE_ARANGOSH_OUTPUT 
  @endDocuBlock smartGraphCreateGraphHowToDisjoint1_cluster
{% endarangoshexample %} 
{% include arangoshexample.html id=examplevar script=script result=result %}

**Add vertex collections**

This is analogous to General Graphs. Unlike with General Graphs, the
**collections must not exist** when creating the SmartGraph. The SmartGraph module will create them for you
automatically to set up the sharding for all these collections correctly. If you create collections via the SmartGraph
module and remove them from the graph definition, then you may re-add them without trouble however, as they will have
the correct sharding.

{% arangoshexample examplevar="examplevar" script="script" result="result" %} 
  @startDocuBlockInline smartGraphCreateGraphHowTo2_cluster 
  @EXAMPLE_ARANGOSH_OUTPUT{smartGraphCreateGraphHowTo2_cluster}
    ~var graph_module = require("@arangodb/smart-graph");
    ~var graph = graph_module._create("myGraph", [], [], {smartGraphAttribute: "region", numberOfShards: 9});
    graph._addVertexCollection("shop"); 
    graph._addVertexCollection("customer"); 
    graph._addVertexCollection("pet"); 
    graph_module._graph("myGraph");
    ~graph_module._drop("myGraph", true); 
  @END_EXAMPLE_ARANGOSH_OUTPUT 
  @endDocuBlock smartGraphCreateGraphHowTo2_cluster 
{% endarangoshexample %} 
{% include arangoshexample.html id=examplevar script=script result=result %}

**Define relations on the Graph**

Adding edge collections works the same as with General Graphs, but again, the collections are created by the SmartGraph
module to set up sharding correctly, so they must not exist when creating the SmartGraph (unless they have the correct
sharding already).

{% arangoshexample examplevar="examplevar" script="script" result="result" %} 
  @startDocuBlockInline smartGraphCreateGraphHowTo3_cluster 
  @EXAMPLE_ARANGOSH_OUTPUT{smartGraphCreateGraphHowTo3_cluster}
    ~var graph_module = require("@arangodb/smart-graph");
    ~var graph = graph_module._create("myGraph", [], [], {smartGraphAttribute: "region", numberOfShards: 9});
    ~graph._addVertexCollection("shop");
    ~graph._addVertexCollection("customer");
    ~graph._addVertexCollection("pet"); 
    var rel = graph_module._relation("isCustomer", ["shop"], ["customer"]); 
    graph._extendEdgeDefinitions(rel); 
    graph_module._graph("myGraph");
    ~graph_module._drop("myGraph", true); 
@END_EXAMPLE_ARANGOSH_OUTPUT 
@endDocuBlock smartGraphCreateGraphHowTo3_cluster 
{% endarangoshexample %} 
{% include arangoshexample.html id=examplevar script=script result=result %}

**Create a Hybrid SmartGraph**

In addition to the attributes you would set to create a SmartGraph, there is an additional attribute `satellites` you
need to set. It needs to be an array of one or more collection names. These names can be used in edge definitions
(relations) and these collections will be created as SatelliteCollections. In this example, both vertex collections are
created as SatelliteCollections:

{% arangoshexample examplevar="examplevar" script="script" result="result" %} 
  @startDocuBlockInline hybridSmartGraphCreateGraphHowTo1_cluster 
  @EXAMPLE_ARANGOSH_OUTPUT{hybridSmartGraphCreateGraphHowTo1_cluster} 
    var graph_module = require("@arangodb/smart-graph"); 
    var rel = graph_module._relation("isCustomer", "shop", "customer");
    var graph = graph_module._create("myGraph", [rel], [], {satellites: ["shop", "customer"], smartGraphAttribute: "region", numberOfShards: 9}); 
    graph_module._graph("myGraph");
    ~graph_module._drop("myGraph", true); 
  @END_EXAMPLE_ARANGOSH_OUTPUT 
  @endDocuBlock hybridSmartGraphCreateGraphHowTo1_cluster 
{% endarangoshexample %} 
{% include arangoshexample.html id=examplevar script=script result=result %}

**Create a Hybrid Disjoint SmartGraph**

The option `isDisjoint` needs to be set to `true` in addition to the other options for a Hybrid SmartGraph. Only
the `shop` vertex collection is created as a SatelliteCollection in this example:

{% arangoshexample examplevar="examplevar" script="script" result="result" %} 
  @startDocuBlockInline hybridSmartGraphCreateGraphHowTo2_cluster 
  @EXAMPLE_ARANGOSH_OUTPUT{hybridSmartGraphCreateGraphHowTo2_cluster} 
    var graph_module = require("@arangodb/smart-graph"); 
    var rel = graph_module._relation("isCustomer", "shop", "customer");
    var graph = graph_module._create("myGraph", [rel], [], {satellites: ["shop"], smartGraphAttribute: "region", isDisjoint: true, numberOfShards: 9}); 
    graph_module._graph("myGraph");
    ~graph_module._drop("myGraph", true); 
  @END_EXAMPLE_ARANGOSH_OUTPUT @endDocuBlock hybridSmartGraphCreateGraphHowTo2_cluster 
  {% endarangoshexample %} 
{% include arangoshexample.html id=examplevar script=script result=result %}
