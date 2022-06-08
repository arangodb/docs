---
layout: default
description: SmartGraphs enable you to manage graphs at scale.
title: ArangoDB SmartGraphs - Getting Started
---
Getting started
---------------

Before creating a SmartGraph, there are some general considerations and restrictions
that you need to take into account.

**Criteria and Considerations**
- All vertices must have the `smartGraphAttribute`
- The `_key` attribute changes structure and contains sharding information
- Vertices define the location of the DBServer and edges have to follow
- Edges may be duplicated whenever they are not co-located on the same machine
- The `smartGraphAttribute` and the number of shards are immutable

**Restrictions**
- You cannot use existing collections, as `_key` needs to follow the smart pattern
- `_from` and `_to` are set by default, as they need to contain the correct sharding information
- All collections need to be in the same `distributeShardslike` group
- All collections need to have the smart sharding `'_key': '123:abc'`

When switching to SmartGraph from an existing dataset you have to import the data into a fresh
SmartGraph, as you **cannot use existing collections**. This switch can be easily achieved with
[arangodump](programs-arangodump.html) and
[arangorestore](programs-arangorestore.html).
The only thing you have to change in this pipeline is that you create the new
collections with the SmartGraph module before starting `arangorestore`.

## Create a SmartGraph

In contrast to General Graphs we have to add more options when creating the
SmartGraph. The two options `smartGraphAttribute` and `numberOfShards` are
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

## Create a Disjoint SmartGraph

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

## Add vertex collections

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

## Define relations on the Graph

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

## Using SatelliteCollections in SmartGraphs
When creating a collection, you can decide whether it's a SatelliteCollection
or not. For example, a vertex collection can be satellite as well. 
SatelliteCollections don't require sharding as the data will be distributed
globally on all DB-Servers. The `smartGraphAttribute` is also not required.

### Create a SmartGraph using SatelliteCollections
In addition to the attributes you would set to create a SmartGraph, there is an
additional attribute `satellites` you can optionally set. It needs to be an array of
one or more collection names. These names can be used in edge definitions
(relations) and these collections will be created as SatelliteCollections.
However, all vertex collections on one side of the relation have to be of
the same type - either all satellite or all smart. This is because `_from`
and `_to` can have different types based on the sharding pattern.

In this example, both vertex collections are created as SatelliteCollections.

{% hint 'info' %}
When providing a satellite collection that is not used in a relation,
it will not be created. If you create the collection in a following
request, only then the option will count.
{% endhint %}

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline hybridSmartGraphCreateGraphHowTo1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{hybridSmartGraphCreateGraphHowTo1_cluster}
      var graph_module = require("@arangodb/smart-graph");
      var rel = graph_module._relation("isCustomer", "shop", "customer")
      var graph = graph_module._create("myGraph", [rel], [], {satellites: ["shop", "customer"], smartGraphAttribute: "region", numberOfShards: 9});
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock hybridSmartGraphCreateGraphHowTo1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Create a Disjoint SmartGraph using SatelliteCollections

The option `isDisjoint` needs to be set to `true` in addition to the other
options for a SmartGraph using SatelliteCollections. Only the `shop` vertex collection is created
as a SatelliteCollection in this example:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline hybridSmartGraphCreateGraphHowTo2_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{hybridSmartGraphCreateGraphHowTo2_cluster}
      var graph_module = require("@arangodb/smart-graph");
      var rel = graph_module._relation("isCustomer", "shop", "customer")
      var graph = graph_module._create("myGraph", [rel], [], {satellites: ["shop"], smartGraphAttribute: "region", isDisjoint: true, numberOfShards: 9});
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock hybridSmartGraphCreateGraphHowTo2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}