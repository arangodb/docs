---
layout: default
description: How to create and use a SmartGraph
title: SatelliteGraphs In Detail
---
SatelliteGraph Details
======================

Below you find usage examples and advanced configuration possibilities for
SatelliteGraphs. The examples use _arangosh_ and the
`@arangodb/satellite-graph` module. You can also manage SatelliteGraphs via
the [HTTP API](http/gharial.html).

How to create a SatelliteGraph
------------------------------

### Create a graph

To create a SatelliteGraph in arangosh, use the `satellite-graph` module:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphCreate1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphCreate1_cluster}
    var satelliteGraphModule = require("@arangodb/satellite-graph");
    var graph = satelliteGraphModule._create("satelliteGraph");
    satelliteGraphModule._graph("satelliteGraph");
    ~satelliteGraphModule._drop("satelliteGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphCreate1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

In contrast to General Graphs and SmartGraphs, you do not need to take care of
the sharding and replication properties. The properties `distributeShardsLike`,
`replicationFactor` and `numberOfShards` will be set automatically.

### Add vertex collections

Adding vertex collections is analogous to General Graphs:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphCreate2_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphCreate2_cluster}
    ~var satelliteGraphModule = require("@arangodb/satellite-graph");
    var graph = satelliteGraphModule._create("satelliteGraph");
    graph._addVertexCollection("aVertexCollection");
    ~satelliteGraphModule._drop("satelliteGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphCreate2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

<!-- TODO

Only collections which do not violate the rules are allowed to be added (Details in section: [SatelliteGraphs in detail](graphs-satellite-graphs-details.html)).
Using the SatelliteGraph module to add new collections, the module will do all the configuration automatically: 

Compared to General Graphs, SatelliteGraphs do have some rules regarding a few
collection properties. By using the SatelliteGraph module (or the Gharial HTTP
API), you don't need to manage those properties manually by yourself. This will be
important for more advanced setups which will be described in the advanced section.
This is important if you want to transform an existing GeneralGraph or SmartGraph to a
SatelliteGraph. To be able to switch to a SatelliteGraph you need to dump and restore
your previous graph. This switch can be easily achieved with arangodump and arangorestore.
The only thing you have to change in this pipeline is that you create the new collections
during creation with the SatelliteGraph module or add collections manually to the
SatelliteGraph before starting the arangorestore process.

 -->

### Define relations

Adding edge collections works the same as with GeneralGraphs, but again, the
collections are created by the SatelliteGraph module to fit the collection
rules here as well.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphCreate3_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphCreate3_cluster}
    ~var satelliteGraphModule = require("@arangodb/satellite-graph");
    var graph = satelliteGraphModule._create("satelliteGraph");
    var relation = satelliteGraphModule._relation("isFriend", ["person"], ["person"]);
    graph._extendEdgeDefinitions(relation);
    ~satelliteGraphModule._drop("satelliteGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphCreate3_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

New collections cannot violate the rules, existing ones can be added. But you
need to take care of the correct collection properties. This is explained in
the next section.

The prototype collection
------------------------

To create a SatelliteGraph manually we'll explain a little bit more about
the technical insights. Very important is: A SatelliteGraph always needs
a leading document collection. First, this collection needs to have the
`replicationFactor` to be set to `"satellite"`. This automatically leads
to the collection having an exact amount of one shard per collection. This
collection is selected as prototype. All additional collections that are part
of the SatelliteGraph need to inherit the behavior of their prototype
collection by pointing to it via the `distributeShardsLike` property.

Every SatelliteGraph needs exactly one leading collection.

### Prototype collection example

If you are going to use the SatelliteGraph module to create and modify the
SatelliteGraph, the module itself will take care of the initial collection
and all the necessary collection configuration. 

1. Creating an empty SatelliteGraph: No initial collection will be promoted.

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

2. Creating an empty SatelliteGraph, then adding a document (vertex) collection.
   Below code leads to the creation of an initial collection `myNewInitialCol`:

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

3. Creating an empty SatelliteGraph, then adding an edge definition.
  This will lead to the collection `person` to be selected as the initial one,
  as it is the only appearing document (vertex) collection. If you supply more
  than one document collection, a collection will be randomly chosen to be the `initial` one.

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

The prototype collection can and also will be automatically selected during the
graph creation process if at least one document (vertex) collection is supplied
directly. If more then one are available, they will be chosen randomly as well,
regardless whether they are set inside the edge definition itself or set as a
vertex/orphan collection.

Utilizing SatelliteGraphs
-------------------------

Obviously, a SatelliteGraph must be created and be used in a query. Valid
operations that can then be optimized are (k-)shortest path(s) computation and
traversals. Both also allow for combination with local joins or other SatelliteGraph statements.

If you want to take a look at the details during query execution, here is
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
