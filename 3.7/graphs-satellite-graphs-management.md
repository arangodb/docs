---
layout: default
description: This chapter describes the JavaScript interface for creating and modifying SatelliteGraphs
title: SatelliteGraphs JS API
---
SatelliteGraph Management
=========================

This chapter describes the `satellite-graph` module, the JavaScript API to
create and modify your SatelliteGraphs in ArangoDB.

To generally understand the concept of the graph modules please see
[General Graph Management](graphs-general-graphs-management.html) first.
In the following only the overloaded functionality is described.
Everything else works alike in both modules.

Create a Graph
--------------

In contrast to General Graphs and SmartGraphs, you do not need to take care of
the sharding and replication properties. The properties `distributeShardsLike`,
`replicationFactor` and `numberOfShards` will be set automatically (also see
[prototype collection](graphs-satellite-graphs-details.html#the-prototype-collection)).

The format of the relations is identical.

```js
var graph_module = require("@arangodb/satellite-graph");
graph_module._create(graphName, edgeDefinitions, orphanCollections);
```

- `graphName` (string):
  Unique identifier of the graph
- `edgeDefinitions` (array):
  List of relation definition objects, may be empty
- `orphanCollections` (array):
  List of additional vertex collection names, may be empty

Both `edgeDefinitions` and `orphanCollections` are optional.
You can also add collections later, after the SatelliteGraph creation took place.

The `edgeDefinitions` can be created using the convenience method `_relation()`
known from the `general-graph` module, which is also available here.

`orphanCollections` again is just a list of additional vertex collections which
are not yet connected via edges but should follow the same sharding to be
connected later on.

All collections used within the creation process are newly created or, if already
available, checked against the collection properties. The process will fail if one
of them already exists, unless they have the correct sharding already. All newly
created collections will immediately be dropped again in the failure case.

**Examples**

Create a graph without relations. Edge definitions can be added later:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementCreate1_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementCreate1_cluster}
        var satelliteGraphModule = require("@arangodb/satellite-graph");
        var graph = satelliteGraphModule._create("satelliteGraph");
        satelliteGraphModule._graph("satelliteGraph");
       ~satelliteGraphModule._drop("satelliteGraph", true);
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementCreate1_cluster
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Create a graph using an edge collection `edges` and a single vertex collection
`vertices` as relation:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementCreate2_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementCreate2_cluster}
        var graph_module = require("@arangodb/satellite-graph");
        var edgeDefinitions = [ graph_module._relation("edges", "vertices", "vertices") ];
        var graph = graph_module._create("myGraph", edgeDefinitions);
        graph_module._graph("myGraph");
       ~graph_module._drop("myGraph", true);
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementCreate2_cluster
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Create a graph with edge definitions and orphan collections:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementCreate3_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementCreate3_cluster}
        var graph_module = require("@arangodb/satellite-graph");
        var edgeDefinitions = [ graph_module._relation("myRelation", ["male", "female"], ["male", "female"]) ];
        var graph = graph_module._create("myGraph", edgeDefinitions, ["sessions"]);
        graph_module._graph("myGraph");
       ~graph_module._drop("myGraph", true);
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementCreate3_cluster
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Modify a SatelliteGraph definition at runtime
---------------------------------------------

After you have created a SatelliteGraph its definition is not immutable. You can
still add or remove relations. This is again identical to General Graphs.

However there is one important difference: You can only add collections that
either *do not exist*, or that have been created with the correct collection
properties (either through the graph module or manually).

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
(either orphan or a vertex collection within a relation) defines the sharding
for all collections within the graph. They have their `distributeShardsLike`
attribute set to the name of the
[prototype collection](graphs-satellite-graphs-details.html#the-prototype-collection)
This collection cannot be dropped as long as other collections follow its sharding
(i.e. they need to be dropped first).

**Examples**

Create a SatelliteGraph and list its orphan collections:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementModify1_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementModify1_cluster}
        var graph_module = require("@arangodb/satellite-graph");
        var relation = graph_module._relation("edges", "vertices", "vertices");
        var graph = graph_module._create("myGraph", [relation], ["other"]);
        graph._orphanCollections();
       ~graph_module._drop("myGraph", true);
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementModify1_cluster
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Remove the orphan collection from the SatelliteGraph and drop the collection:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementModify2_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementModify2_cluster}
       ~var graph_module = require("@arangodb/satellite-graph");
       ~var relation = graph_module._relation("edges", "vertices", "vertices");
       ~var graph = graph_module._create("myGraph", [relation], ["other"]);
        graph._removeVertexCollection("other", true);
        graph_module._graph("myGraph");
       ~graph_module._drop("myGraph", true);
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementModify2_cluster
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Attempting to remove a non-orphan collection results in an error:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementModify3_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementModify3_cluster}
       ~var graph_module = require("@arangodb/satellite-graph");
       ~var relation = graph_module._relation("edges", "vertices", "vertices");
       ~var graph = graph_module._create("myGraph", [relation], []);
        graph._removeVertexCollection("vertices"); // xpError(ERROR_GRAPH_NOT_IN_ORPHAN_COLLECTION)
       ~graph_module._drop("myGraph", true);
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementModify3_cluster
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

You cannot drop the prototype collection (`vertices`) as long as it defines the
sharding for other collections (`edges`).

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementModify4_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementModify4_cluster}
        var graph_module = require("@arangodb/satellite-graph");
        var relation = graph_module._relation("edges", "vertices", "vertices");
        var graph = graph_module._create("myGraph", [relation], []);
        graph._deleteEdgeDefinition("edges");
        graph._removeVertexCollection("vertices");
        db._drop("vertices"); // xpError(ERROR_CLUSTER_MUST_NOT_DROP_COLL_OTHER_DISTRIBUTESHARDSLIKE)
       ~graph_module._drop("myGraph", true);
       ~db._drop("edges");
       ~db._drop("vertices");
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementModify4_cluster
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

You may drop the complete graph, but remember to drop collections that you
might have removed from the graph beforehand, as they will not be part of the
graph definition anymore and thus not be dropped for you. Alternatively, you
can `truncate` the graph if you just want to get rid of the data.

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementModify5_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementModify5_cluster}
        var graph_module = require("@arangodb/satellite-graph");
        var relation = graph_module._relation("edges", "vertices", "vertices");
        var graph = graph_module._create("myGraph", [relation], []);
      graph._deleteEdgeDefinition("edges");      // remove edge collection from graph definition
      graph._removeVertexCollection("vertices"); // remove vertex collection from graph definition
      graph_module._drop("myGraph", true);       // does not drop any collections because there are none left in the graph definition
        db._drop("edges"); // drop before sharding-defining 'vertices' collection
        db._drop("vertices");
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementModify5_cluster
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

Create a SatelliteGraph, then delete the edge definition and drop the edge collection:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementModify6_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementModify6_cluster}
        var graph_module = require("@arangodb/satellite-graph");
        var relation = graph_module._relation("edges", "vertices", "vertices");
        var graph = graph_module._create("myGraph", [relation], []);
        graph._deleteEdgeDefinition("edges", true);
        graph_module._graph("myGraph");
       ~graph_module._drop("myGraph", true);
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementModify6_cluster
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

It is allowed to remove the vertex collection `vertices` if it is not used in
any relation (i.e. after the deletion of the edge definition):

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementModify7_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementModify7_cluster}
       ~var graph_module = require("@arangodb/satellite-graph");
       ~var relation = graph_module._relation("edges", "vertices", "vertices");
       ~var graph = graph_module._create("myGraph", [relation], []);
        graph._deleteEdgeDefinition("edges");
        graph._removeVertexCollection("vertices");
       ~graph_module._drop("myGraph", true);
       ~db._drop("edges");
       ~db._drop("vertices");
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementModify7_cluster
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Keep in mind that you can not drop the `vertices` collection until no other
collection references it anymore (`distributeShardsLike` collection property).

Remove a Graph
--------------

Remove a SatelliteGraph:

`graph_module._drop(graphName, dropCollections)`

- `graphName` (string):
  Name of the Graph.
- `dropCollections` (bool, _optional_):
  Define if collections should be dropped. Default: false.

**Examples**

Delete a SatelliteGraph and drop its collections:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementRemove1_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementRemove1_cluster}
       ~var graph_module = require("@arangodb/satellite-graph");
       ~var relation = graph_module._relation("edges", "vertices", "vertices");
       ~var graph = graph_module._create("myGraph", [relation], ["other"]);
        graph_module._drop("myGraph", true);
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementRemove1_cluster
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Note that removing a graph with the option to drop the collections fails if
you removed collections from the graph but did not drop these collections.
This is because their `distributeShardsLike` attribute still references
collections that are part of the graph. Dropping collections while others
point to them in this way is not allowed. Make sure to drop the referencing
collections first.

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
      @startDocuBlockInline satelliteGraphManagementRemove2_cluster
      @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphManagementRemove2_cluster}
       ~var graph_module = require("@arangodb/satellite-graph");
       ~var relation = graph_module._relation("edges", "vertices", "vertices");
       ~var graph = graph_module._create("myGraph", [relation], ["other"]);
        graph._removeVertexCollection("other");
        graph_module._drop("myGraph", true); // xpError(ERROR_CLUSTER_MUST_NOT_DROP_COLL_OTHER_DISTRIBUTESHARDSLIKE)
       ~db._drop("other");
       ~db._drop("vertices");
      @END_EXAMPLE_ARANGOSH_OUTPUT
      @endDocuBlock satelliteGraphManagementRemove2_cluster
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}
