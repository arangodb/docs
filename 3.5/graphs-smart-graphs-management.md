---
layout: default
description: This chapter describes the JavaScript interface for creating and modifying SmartGraphs
title: SmartGraphs JS API
---
Smart Graph Management
======================

This chapter describes the JavaScript interface for creating and modifying
SmartGraphs. A SmartGraph is a specialized version of a General Graph, which
means all of the General Graph functionality is available on a SmartGraph as
well. The major difference of both modules is handling of the underlying
collections:

- General Graphs do not enforce or maintain any sharding of the collections
  and can therefore combine arbitrary sets of existing collections.
- SmartGraphs enforce and rely on a special sharding of the underlying
  collections and hence can only work with collections that are created
  through the SmartGraph itself. This also means that SmartGraphs cannot be
  overlapping. A collection can either be sharded for one SmartGraph or for
  another. If you need to make sure that all queries can be executed with
  SmartGraph performance, just create one large SmartGraph covering everything
  and query it stating the subset of edge collections explicitly.

To generally understand the concept of this module please read the chapter
about [General Graph Management](graphs-general-graphs-management.html) first.
In the following we will only describe the overloaded functionality.
Everything else works identical in both modules.

Create a Graph
--------------

SmartGraphs also require edge relations to be created. The format of the
relations is identical. The only difference is that all collections used within
the relations to create a new SmartGraph must not exist yet. You have to let
the SmartGraph module create the Graph collections for you, so that it can
enforce the correct sharding.

`graph_module._create(graphName, edgeDefinitions, orphanCollections, smartOptions)`

- `graphName` (string):
  Unique identifier of the graph
- `edgeDefinitions` (array):
  List of relation definition objects, may be empty
- `orphanCollections` (array):
  List of additional vertex collection names, may be empty
- `smartOptions` (object):
  A JSON object having the following keys:
  - `numberOfShards` (number):
    The number of shards that will be created for each collection. To maintain
    the correct sharding all collections need an identical number of shards.
    This cannot be modified after creation of the graph.
  - `smartGraphAttribute` (string):
    The attribute that will be used for sharding. All vertices are required to
    have this attribute set and it has to be a string. Edges derive the
    attribute from their connected vertices.

The creation of a graph requires the name and some SmartGraph options.
Due to the API `edgeDefinitions` and `orphanCollections` have to be given, but
both can be empty arrays and be added later.

The `edgeDefinitions` can be created using the convenience method `_relation`
known from the `general-graph` module, which is also available here.

`orphanCollections` again is just a list of additional vertex collections which
are not yet connected via edges but should follow the same sharding to be
connected later on.

All collections used within the creation process are newly created.
The process will fail if one of them already exists.
All newly created collections will immediately be dropped again in the failure case.

**Examples**

Create an empty graph, edge definitions can be added at runtime:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphCreate1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphCreate1_cluster}
      var graph_module = require("@arangodb/smart-graph");
      var graph = graph_module._create("myGraph", [], [], {smartGraphAttribute: "region", numberOfShards: 9});
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphCreate1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create a graph using an edge collection `edges` and a single vertex collection
`vertices`:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphCreate2_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphCreate2_cluster}
      var graph_module = require("@arangodb/smart-graph");
      var edgeDefinitions = [ graph_module._relation("edges", "vertices", "vertices") ];
      var graph = graph_module._create("myGraph", edgeDefinitions, [], {smartGraphAttribute: "region", numberOfShards: 9});
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphCreate2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create a graph with edge definitions and orphan collections:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphCreate3_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphCreate3_cluster}
      var graph_module = require("@arangodb/smart-graph");
      var edgeDefinitions = [ graph_module._relation("myRelation", ["male", "female"], ["male", "female"]) ];
      var graph = graph_module._create("myGraph", edgeDefinitions, ["sessions"], {smartGraphAttribute: "region", numberOfShards: 9});
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphCreate3_cluster
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
within the graph. This collection can never be removed from the graph.

**Examples**

The following example lists the orphan collections and shows that you may
remove them, but also that you cannot drop the initial collection.
You can only drop the complete graph, or `truncate` it if you just want to
get rid of the data.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify1_cluster}
      var graph_module = require("@arangodb/smart-graph")
      var relation = graph_module._relation("edges", "vertices", "vertices");
      var graph = graph_module._create("myGraph", [relation], ["other"], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._orphanCollections();
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify2_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify2_cluster}
     ~var graph_module = require("@arangodb/smart-graph")
     ~var relation = graph_module._relation("edges", "vertices", "vertices");
     ~var graph = graph_module._create("myGraph", [relation], ["other"], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._removeVertexCollection("other", true);
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify3_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify3_cluster}
     ~var graph_module = require("@arangodb/smart-graph")
     ~var relation = graph_module._relation("edges", "vertices", "vertices");
     ~var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._removeVertexCollection("vertices") };
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify3_cluster
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

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify4_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify4_cluster}
      var graph_module = require("@arangodb/smart-graph")
      var relation = graph_module._relation("edges", "vertices", "vertices");
      var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._deleteEdgeDefinition("edges");
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
     ~db._drop("edges");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify4_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Even after deleting the edge definition, it is still not allowed to remove the
initial vertex collection `vertices`:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphModify5_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphModify5_cluster}
     ~var graph_module = require("@arangodb/smart-graph")
     ~var relation = graph_module._relation("edges", "vertices", "vertices");
     ~var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
     ~graph._deleteEdgeDefinition("edges");
      graph._removeVertexCollection("vertices");
     ~graph_module._drop("myGraph", true);
     ~db._drop("edges");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphModify5_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Remove a Graph

Remove a SmartGraph:

`graph_module._drop(graphName, dropCollections)`

- `graphName` (string):
  Name of the Graph.
- `dropCollections` (bool, _optional_):
  Define if collections should be dropped. Default: false.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline smartGraphRemove1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{smartGraphRemove1_cluster}
     ~var graph_module = require("@arangodb/smart-graph")
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
     ~var graph_module = require("@arangodb/smart-graph")
     ~var relation = graph_module._relation("edges", "vertices", "vertices");
     ~var graph = graph_module._create("myGraph", [relation], ["other"], {smartGraphAttribute: "region", numberOfShards: 9});
      graph._removeVertexCollection("other");
      graph_module._drop("myGraph", true);
     ~db._drop("other");
     ~graph_module._drop("myGraph", true)
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock smartGraphRemove2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
