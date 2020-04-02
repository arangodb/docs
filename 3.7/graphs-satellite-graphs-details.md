---
layout: default
description: This chapter describes the usage of SatelliteGraphs in Detail
title: SatelliteGraphs In Detail
---
Satellite Graph Details
======================

This chapter explains the details of the usage of a SatelliteGraphs, 
including more advanced configuration possibilities.

The Initial Collection
--------------

To create a custom SatelliteGraph we'll explain a little bit more about
the technical insights. Very important is: A SatelliteGraph always needs
a leading document collection. First, this collection needs to have the
`replicationFactor` to be set to `satellite`. This automatically leads
the collection having an exact amount of one shard per collection. This
collection is selected as the `initial` one. Furthermore, all additional
collections that are part of the SatelliteGraph need to inherit the
behavior of their `initial` collection. Those collections are required to
have the collection attribute `distributeShardsLike` pointing to the
`initial` collection.

Every SatelliteGraph needs one leading collection. 

Initial Collection Examples
-------------- 

If you are going to use the SatelliteGraph module to create and modify the
SatelliteGraph, the module itself will take care of the initial collection
and all the necessary collection configuration. 

1.) Creating an empty SatelliteGraph: No initial collection will be promoted.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphInitial3_1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphInitial3_1_cluster}
    var satelliteGraphModule = require("@arangodb/satellite-graph");
    satelliteGraphModule._create("satelliteGraph");
    ~satelliteGraphModule._drop("satelliteGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphInitial3_1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

2.) Creating an empty SatelliteGraph, then adding a document (vertex) collection:
This will lead the collection `myNewInitialCol` to be the initial one. 

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphInitial3_2_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphInitial3_2_cluster}
    var satelliteGraphModule = require("@arangodb/satellite-graph");
    var graph = satelliteGraphModule._create("satelliteGraph");
    graph._addVertexCollection("myNewInitialCol");
    ~satelliteGraphModule._drop("satelliteGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphInitial3_2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

3.) Creating an empty SatelliteGraph, then adding an edge definition: This will
lead the collection `person` to be selected as the initial one, as it is the only
appearing document (vertex) collection. If you supply more than at least one
document collection, a collection will be randomly chosen to be the `initial` one.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphInitial3_3_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphInitial3_3_cluster}
    var satelliteGraphModule = require("@arangodb/satellite-graph");
    var graph = satelliteGraphModule._create("satelliteGraph");
    var relation = satelliteGraphModule._relation("isFriend", ["person"], ["person"]);
    graph._extendEdgeDefinitions(relation);
    ~satelliteGraphModule._drop("satelliteGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphInitial3_3_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

The `initial` collection can and also will be automatically selected during the
graph creation process if at least one document (vertex) collection is supplied
directly. If more then one are available, they will be chosen randomly as well,
regardless whether they are set inside the edge definition itself or set as a
vertex/orphan collection.

What qualifies as a SatelliteGraph traversal
--------------

Obviously, a SatelliteGraph must be created and be used in a query. Valid
operations then can be optimized are (k-)shortest path(s) computation and
joins with traversals.

If you want to take a look at the details during query execution, here is a
an example showing the difference between the execution of a GeneralGraph
and a SatelliteGraph traversal query.

First we setup our graphs and collections.
{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphExplain3_1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphExplain3_1_cluster}
    var graphModule = require("@arangodb/general-graph");
    var satelliteGraphModule = require("@arangodb/satellite-graph");
    graphModule._create("normalGraph", [ graphModule._relation("edges", "vertices", "vertices") ], [], {});
    satelliteGraphModule._create("satelliteGraph", [ satelliteGraphModule._relation("satEdges", "satVertices", "satVertices") ], [], {});
    db._create("collection", {numberOfShards: 8});
    ~db._drop("collection");
    ~satelliteGraphModule._drop("satelliteGraph", true);
    ~graphModule._drop("normalGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphExplain3_1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Let us analyze a query involving a traversal:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphExplain3_2_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphExplain3_2_cluster}
    ~var graphModule = require("@arangodb/general-graph");
    ~var satelliteGraphModule = require("@arangodb/satellite-graph");
    ~graphModule._create("normalGraph", [ graphModule._relation("edges", "vertices", "vertices") ], [], {});
    ~satelliteGraphModule._create("satelliteGraph", [ satelliteGraphModule._relation("satEdges", "satVertices", "satVertices") ], [], {});
    ~db._create("collection", {numberOfShards: 8});
    db._explain(`FOR doc in collection FOR v,e,p IN OUTBOUND "vertices/start" GRAPH "normalGraph" RETURN [doc,v,e,p]`, {}, {colors: false});
    ~db._drop("collection");
    ~satelliteGraphModule._drop("satelliteGraph", true);
    ~graphModule._drop("normalGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphExplain3_2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

You can see that the `TraversalNode` is executed on a Coordinator, and only
the `EnumerateCollectionNode` is executed on DB-Server. This will happen for
each of the 8 shards in `collection`.

Let us now have a look at the same query using a SatelliteGraph:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphExplain3_3_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphExplain3_3_cluster}
    ~var graphModule = require("@arangodb/general-graph");
    ~var satelliteGraphModule = require("@arangodb/satellite-graph");
    ~graphModule._create("normalGraph", [ graphModule._relation("edges", "vertices", "vertices") ], [], {});
    ~satelliteGraphModule._create("satelliteGraph", [ satelliteGraphModule._relation("satEdges", "satVertices", "satVertices") ], [], {});
    ~db._create("collection", {numberOfShards: 8});
    db._explain(`FOR doc in collection FOR v,e,p IN OUTBOUND "vertices/start" GRAPH "satelliteGraph" RETURN [doc,v,e,p]`, {}, {colors: false});
    ~db._drop("collection");
    ~satelliteGraphModule._drop("satelliteGraph", true);
    ~graphModule._drop("normalGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphExplain3_3_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Note that now the `TraversalNode` is executed on each DB-Server, leading to a
great reduction in required network communication, and hence potential gains
in query performance.