---
layout: default
description: This chapter describes the JavaScript interface for creating and modifying SatelliteGraphs
title: SatelliteGraphs JS API
---
Satellite Graph Management
======================

This chapter describes the JavaScript interface for creating and modifying
SatelliteGraphs. A SatelliteGraph is a specialised version of a GeneralGraph,
which means all of the GeneralGraph functionality is available on a
SatelliteGraph as well. The major difference of both modules is handling of
the underlying collections:


- GeneralGraphs do not enforce or maintain any sharding of the collections and
  can therefore combine arbitrary sets of existing collections.
- SatelliteGraphs enforce and rely on a special properties of the underlying
  collections and hence can only work with collections that are created through
  the SatelliteGraph itself or manually created collections which perfectly fit
  to the rules of a SatelliteGraph collection (Rules described in: SatelliteGraphs in detail).
  This means that in comparison to SmartGraphs, SatelliteGraphs can be overlapping.
  A collection can exist in one SatelliteGraph and also in another as well. If you
  have a quite huge SatelliteGraph and want to create an additional "Sub-SatelliteGraph"
  of it, you can do that (Section: Create an advanced graph).

To generally understand the concept of this module please read the chapter
about [General Graph Management](graphs-general-graphs-management.html) first.
In the following we will only describe the overloaded functionality.
Everything else works identical in both modules.

Create a Graph
--------------

In contrast to GeneralGraphs and SmartGraphs, you do not need to take care of the
sharding and replication properties. The properties `distributeShardsLike`,
`replicationFactor` and `numberOfShards` will be set automatically. The format of
the relations is identical. The only difference is that all collections used within
the relations to create a new SatelliteGraph must fit the collection rules of the
Satellite. Using the SatelliteGraph module to create the Graph collections, will take
care of the correct collection properties.

`graph_module._create(graphName, edgeDefinitions, orphanCollections)`

- `graphName` (string):
  Unique identifier of the graph
- `edgeDefinitions` (array):
  List of relation definition objects, may be empty
- `orphanCollections` (array):
  List of additional vertex collection names, may be empty

API `edgeDefinitions` and `orphanCollections` can be given, but both are optional.
You can also add collections later, after the SatelliteGraph creation took place.

The `edgeDefinitions` can be created using the convenience method `_relation`
known from the `general-graph` module, which is also available here.

`orphanCollections` again is just a list of additional vertex collections which
are not yet connected via edges but should follow the same sharding to be
connected later on.

All collections used within the creation process are newly created or if already
available checked against the collection properties. The process will fail if one
of them already exists, unless they have the correct sharding already. All newly
created collections will immediately be dropped again in the failure case.

**Examples**

Create a graph without relations. Edge definitions can be added later:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphCreateManagement_1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphCreateManagement_1_cluster}
    var satelliteGraphModule = require("@arangodb/satellite-graph");
    var graph = satelliteGraphModule._create("satelliteGraph");
    satelliteGraphModule._graph("satelliteGraph");
    ~satelliteGraphModule._drop("satelliteGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphCreate1_1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create a graph using an edge collection `edges` and a single vertex collection
`vertices` as relation:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphCreateManagement_2_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphCreateManagement_2_cluster}
      var graph_module = require("@arangodb/satellite-graph");
      var edgeDefinitions = [ graph_module._relation("edges", "vertices", "vertices") ];
      var graph = graph_module._create("myGraph", edgeDefinitions);
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphCreateManagement_2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create a graph with edge definitions and orphan collections:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphCreateManagement_3_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphCreateManagement_3_cluster}
      var graph_module = require("@arangodb/satellite-graph");
      var edgeDefinitions = [ graph_module._relation("myRelation", ["male", "female"], ["male", "female"]) ];
      var graph = graph_module._create("myGraph", edgeDefinitions, ["sessions"]);
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphCreateManagement_3_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Modify a graph definition at runtime
------------------------------------

After you have created a SmartGraph its definition is not immutable. You can
still add or remove relations. This is again identical to General Graphs.

However there is one important difference: You can only add collections that
either *do not exist*, or that have been created by this graph earlier. The
latter can be achieved if you for example remove an orphan collection from this
graph, without dropping the collection itself. Than after some time you decide
to add it again, it can be used. This is because the enforced sharding is still
applied to this vertex collection, hence it is suitable to be added again.

### Remove a vertex collection

Remove a vertex collection from the graph:

`graph._removeVertexCollection(vertexCollectionName, dropCollection)`

- `vertexCollectionName` (string):
  Name of vertex collection.
- `dropCollection` (bool, _optional_):
  If true the collection will be dropped if it is not used in any other graph.
  Default: false.

In most cases this function works identically to the General Graph one.
But there is one special case: The first vertex collection added to the graph
(either orphan or within a relation) defines the sharding for all collections
within the graph. They have their `distributeShardsLike` attribute set to the
name of the initial collection. This collection can not be dropped as long as
other collections follow its sharding (i.e. they need to be dropped first).

**Examples**

Create a SmartGraph and list its orphan collections:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify1_cluster}
      var graph_module = require("@arangodb/smart-graph");
      var relation = graph_module._relation("edges", "vertices", "vertices");
      var graph = graph_module._create("myGraph", [relation], ["other"], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._orphanCollections();
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Remove the orphan collection from the SmartGraph and drop the collection:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify2_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify2_cluster}
     ~var graph_module = require("@arangodb/smart-graph");
     ~var relation = graph_module._relation("edges", "vertices", "vertices");
     ~var graph = graph_module._create("myGraph", [relation], ["other"], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._removeVertexCollection("other", true);
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Attempting to remove a non-orphan collection results in an error:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify3_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify3_cluster}
     ~var graph_module = require("@arangodb/smart-graph");
     ~var relation = graph_module._relation("edges", "vertices", "vertices");
     ~var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._removeVertexCollection("vertices"); // xpError(ERROR_GRAPH_NOT_IN_ORPHAN_COLLECTION)
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify3_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

You cannot drop the initial collection (`vertices`) as long as it defines the
sharding for other collections (`edges`).

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify4_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify4_cluster}
      var graph_module = require("@arangodb/smart-graph");
      var relation = graph_module._relation("edges", "vertices", "vertices");
      var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._deleteEdgeDefinition("edges");
      graph._removeVertexCollection("vertices");
      db._drop("vertices"); // xpError(ERROR_CLUSTER_MUST_NOT_DROP_COLL_OTHER_DISTRIBUTESHARDSLIKE)
     ~graph_module._drop("myGraph", true);
     ~db._drop("edges");
     ~db._drop("vertices");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify4_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

You may drop the complete graph, but remember to drop collections that you
might have removed from the graph beforehand, as they will not be part of the
graph definition anymore and thus not be dropped for you. Alternatively, you
can `truncate` the graph if you just want to get rid of the data.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify5_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify5_cluster}
      var graph_module = require("@arangodb/smart-graph");
      var relation = graph_module._relation("edges", "vertices", "vertices");
      var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._deleteEdgeDefinition("edges");
      graph._removeVertexCollection("vertices");
      graph_module._drop("myGraph", true); // does not drop any collections
      db._drop("edges"); // drop before sharding-defining 'vertices' collection
      db._drop("vertices");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify5_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Remove an edge collection

Delete an edge definition from the graph:

`graph._deleteEdgeDefinition(edgeCollectionName, dropCollection)`

- `edgeCollectionName` (string):
  Name of edge collection.
- `dropCollection` (bool, _optional_):
  If true the collection will be dropped if it is not used in any other graph.
  Default: false.

**Examples**

Create a SmartGraph, then delete the edge definition and drop the edge collection:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify6_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify6_cluster}
      var graph_module = require("@arangodb/smart-graph");
      var relation = graph_module._relation("edges", "vertices", "vertices");
      var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._deleteEdgeDefinition("edges", true);
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify6_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

It is allowed to remove the vertex collection `vertices` if it's not used in
any relation (i.e. after the deletion of the edge definition):

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify7_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify7_cluster}
     ~var graph_module = require("@arangodb/smart-graph");
     ~var relation = graph_module._relation("edges", "vertices", "vertices");
     ~var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._deleteEdgeDefinition("edges");
      graph._removeVertexCollection("vertices");
     ~graph_module._drop("myGraph", true);
     ~db._drop("edges");
     ~db._drop("vertices");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify7_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Keep in mind that you can not drop the `vertices` collection until no other
collection references it anymore (`distributeShardsLike` collection property).

### Remove a Graph

Remove a SmartGraph:

`graph_module._drop(graphName, dropCollections)`

- `graphName` (string):
  Name of the Graph.
- `dropCollections` (bool, _optional_):
  Define if collections should be dropped. Default: false.

**Examples**

Delete a SmartGraph and drop its collections:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphRemove1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphRemove1_cluster}
     ~var graph_module = require("@arangodb/smart-graph");
     ~var relation = graph_module._relation("edges", "vertices", "vertices");
     ~var graph = graph_module._create("myGraph", [relation], ["other"], {smartGraphAttribute: "region", numberOfShards: 9});
      graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphRemove1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Note that removing a Graph with the option to drop the collections fails if
you removed collections from the Graph but did not drop these collections.
This is because their `distributeShardsLike` attribute still references
collections that are part of the Graph. Dropping collections while others
point to them in this way is not allowed. Make sure to drop the referencing
collections first.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphRemove2_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphRemove2_cluster}
     ~var graph_module = require("@arangodb/smart-graph");
     ~var relation = graph_module._relation("edges", "vertices", "vertices");
     ~var graph = graph_module._create("myGraph", [relation], ["other"], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._removeVertexCollection("other");
      graph_module._drop("myGraph", true); // xpError(ERROR_CLUSTER_MUST_NOT_DROP_COLL_OTHER_DISTRIBUTESHARDSLIKE)
     ~db._drop("other");
     ~db._drop("vertices");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphRemove2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
