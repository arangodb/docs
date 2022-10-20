---
layout: default
description: SmartGraphs enable you to manage graphs at scale.
title: ArangoDB SmartGraphs
---
SmartGraphs
===========

{% include hint-ee-arangograph.md feature="SmartGraphs" plural=true %}

This chapter describes the `smart-graph` module, which enables you to manage
graphs at scale. It will give a vast performance benefit for all graphs sharded
in an ArangoDB Cluster. On a single server this feature is pointless, hence it
is only available in cluster mode.

In terms of querying there is no difference between SmartGraphs and
General Graphs. The former is a transparent replacement for the latter.
For graph querying please refer to [AQL Graph Operations](aql/graphs.html)
and [General Graph Functions](graphs-general-graphs-functions.html) sections.
The optimizer is clever enough to identify whether it is a SmartGraph or not.

The difference is only in the management section: creating and modifying the
underlying collections of the graph. For a detailed API reference please refer
to [SmartGraph Management](graphs-smart-graphs-management.html).

Do the hands-on
[ArangoDB SmartGraphs Tutorial](https://www.arangodb.com/using-smartgraphs-arangodb/){:target="_blank"}
to learn more.

What makes a graph smart?
-------------------------

Most graphs have one feature that divides the entire graph into several smaller
subgraphs. These subgraphs have a large amount of edges that only connect
vertices in the same subgraph and only have few edges connecting vertices from
other subgraphs.

Examples for these graphs are:

- **Social Networks**<br>
  Typically the feature here is the region/country users live in.
  Every user typically has more contacts in the same region/country then she
  has in other regions/countries

- **Transport Systems**<br>
  For those also the feature is the region/country. You have many local
  transportation but only few across countries.

- **E-Commerce**<br>
  In this case probably the category of products is a good feature.
  Often products of the same category are bought together.

If this feature is known, SmartGraphs can make use if it.

When creating a SmartGraph you have to define a smartAttribute, which is the
name of an attribute stored in every vertex. The graph will than be
automatically sharded in such a way that all vertices with the same value are
stored on the same physical machine, all edges connecting vertices with
identical smartAttribute values are stored on this machine as well.
During query time the query optimizer and the query executor both know for
every document exactly where it is stored and can thereby minimize network
overhead. Everything that can be computed locally will be computed locally.

Benefits of SmartGraphs
-----------------------

Because of the above described guaranteed sharding, the performance of queries
that only cover one subgraph have a performance almost equal to an only local
computation. Queries that cover more than one subgraph require some network
overhead. The more subgraphs are touched the more network cost will apply.
However the overall performance is never worse than the same query using a
General Graph.

Benefits of Disjoint SmartGraphs
-------------------------------

Disjoint SmartGraphs are a specialized type of SmartGraphs. 

In addition to the guaranteed sharding in SmartGraphs, a Disjoint SmartGraph
prohibits edges between vertices with different `smartGraphAttribute` values.

This ensures that graph traversals, shortest path, and k-shortest-paths queries
can be executed locally on a DB-Server, achieving improved performance for
these type of queries.

Getting started
---------------

First of all, SmartGraphs **cannot use existing collections**. When switching to
SmartGraph from an existing dataset you have to import the data into a fresh
SmartGraph. This switch can be easily achieved with
[arangodump](programs-arangodump.html) and
[arangorestore](programs-arangorestore.html).
The only thing you have to change in this pipeline is that you create the new
collections with the SmartGraph module before starting `arangorestore`.

**Create a SmartGraph**

In contrast to General Graphs we have to add more options when creating the
graph. The two options `smartGraphAttribute` and `numberOfShards` are
required and cannot be modified later. 

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

In contrast to regular SmartGraphs we have to add one option when creating the
graph. The boolean option `isDisjoint` is required, needs to be set to `true`
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
**collections must not exist** when creating the SmartGraph. The SmartGraph
module will create them for you automatically to set up the sharding for all
these collections correctly. If you create collections via the SmartGraph
module and remove them from the graph definition, then you may re-add them
without trouble however, as they will have the correct sharding.

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

Adding edge collections works the same as with General Graphs, but again, the
collections are created by the SmartGraph module to set up sharding correctly
so they must not exist when creating the SmartGraph (unless they have the
correct sharding already).

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
