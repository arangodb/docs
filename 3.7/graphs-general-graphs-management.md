---
layout: default
description: This chapter describes the JavaScript interface for creating and modifying named graphs
title: General Graph JS API
---
Graph Management
================

This chapter describes the javascript interface for creating and modifying
[named graphs](graphs.html#named-graphs).

Edge Definitions
----------------

An edge definition is always a directed relation of a graph. Each graph can
have arbitrary many relations defined within the edge definitions array.

### Initialize the List

Create a list of edge definitions to construct a graph:

`graph_module._edgeDefinitions(relation1, relation2, ..., relationN)`

- `relation` (object, _optional_):
  An object representing a definition of one relation in the graph

The list of edge definitions of a graph can be managed by the graph module
itself. This function is the entry point for the management and will return
the correct list.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphEdgeDefinitionsSimple
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphEdgeDefinitionsSimple}
      var graph_module = require("@arangodb/general-graph");
      directed_relation = graph_module._relation("lives_in", "user", "city");
      undirected_relation = graph_module._relation("knows", "user", "user");
      edgedefinitions = graph_module._edgeDefinitions(directed_relation, undirected_relation);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphEdgeDefinitionsSimple
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Extend the List

Extend the list of edge definitions to construct a graph:

`graph_module._extendEdgeDefinitions(edgeDefinitions, relation1, relation2, ..., relationN)`

- `edgeDefinitions` (array):
  A list of relation definition objects.
- `relationX` (object):
  An object representing a definition of one relation in the graph

In order to add more edge definitions to the graph before creating
this function can be used to add more definitions to the initial list.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphEdgeDefinitionsExtend
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphEdgeDefinitionsExtend}
      var graph_module = require("@arangodb/general-graph");
      directed_relation = graph_module._relation("lives_in", "user", "city");
      undirected_relation = graph_module._relation("knows", "user", "user");
      edgedefinitions = graph_module._edgeDefinitions(directed_relation);
      edgedefinitions = graph_module._extendEdgeDefinitions(undirected_relation);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphEdgeDefinitionsExtend
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Relation

Define a directed relation:

`graph_module._relation(relationName, fromVertexCollections, toVertexCollections)`

- `relationName` (string):
  The name of the edge collection where the edges should be stored.
  Will be created if it does not yet exist.
- `fromVertexCollections` (string\|array):
  One or a list of collection names. Source vertices for the edges
  have to be stored in these collections. Collections will be created if they
  do not exist.
- `toVertexCollections` (string\|array):
  One or a list of collection names. Target vertices for the edges
  have to be stored in these collections. Collections will be created if they
  do not exist.

The *relationName* defines the name of this relation and references to the
underlying edge collection. The *fromVertexCollections* is an Array of document
collections holding the start vertices. The *toVertexCollections* is an array
of document collections holding the target vertices. Relations are only allowed
in the direction from any collection in *fromVertexCollections* to any
collection in *toVertexCollections*.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphRelationDefinitionSave
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphRelationDefinitionSave}
    var graph_module = require("@arangodb/general-graph");
    graph_module._relation("has_bought", ["Customer", "Company"], ["Groceries", "Electronics"]);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphRelationDefinitionSave
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphRelationDefinitionSingle
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphRelationDefinitionSingle}
    var graph_module = require("@arangodb/general-graph");
    graph_module._relation("has_bought", "Customer", "Product");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphRelationDefinitionSingle
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create a Graph
--------------

`graph_module._create(graphName, edgeDefinitions, orphanCollections)`

- `graphName` (string):
  Unique identifier of the graph
- `edgeDefinitions` (array, _optional_):
  List of relation definition objects
- `orphanCollections` (array, _optional_):
  List of additional vertex collection names

The creation of a graph requires the name of the graph and a definition of
its edges.

For every type of edge definition a convenience method exists that can be used
to create a graph. Optionally a list of vertex collections can be added, which
are not used in any edge definition. These collections are referred to as
orphan collections within this chapter. All collections used within the
creation process are created if they do not exist.

**Examples**

Create an empty graph, edge definitions can be added at runtime:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphCreateGraphNoData
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphCreateGraphNoData}
      var graph_module = require("@arangodb/general-graph");
      graph = graph_module._create("myGraph");
    ~ graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphCreateGraphNoData
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create a graph using an edge collection `edges` and a single
vertex collection `vertices`:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphCreateGraphSingle
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphCreateGraphSingle}
    ~ db._drop("edges");
    ~ db._drop("vertices");
      var graph_module = require("@arangodb/general-graph");
      var edgeDefinitions = [ { collection: "edges", "from": [ "vertices" ], "to" : [ "vertices" ] } ];
      graph = graph_module._create("myGraph", edgeDefinitions);
    ~ graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphCreateGraphSingle
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create a graph with edge definitions and orphan collections:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphCreateGraph2
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphCreateGraph2}
      var graph_module = require("@arangodb/general-graph");
    | graph = graph_module._create("myGraph",
      [graph_module._relation("myRelation", ["male", "female"], ["male", "female"])], ["sessions"]);
    ~ graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphCreateGraph2
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Complete Example to Create a Graph

Example call:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline general_graph_create_graph_example1
    @EXAMPLE_ARANGOSH_OUTPUT{general_graph_create_graph_example1}
      var graph_module = require("@arangodb/general-graph");
      var edgeDefinitions = graph_module._edgeDefinitions();
      graph_module._extendEdgeDefinitions(edgeDefinitions, graph_module._relation("friend_of", "Customer", "Customer"));
    | graph_module._extendEdgeDefinitions(
    | edgeDefinitions, graph_module._relation(
      "has_bought", ["Customer", "Company"], ["Groceries", "Electronics"]));
      graph_module._create("myStore", edgeDefinitions);
    ~ graph_module._drop("myStore");
    ~ db._drop("Electronics");
    ~ db._drop("Customer");
    ~ db._drop("Groceries");
    ~ db._drop("Company");
    ~ db._drop("has_bought");
    ~ db._drop("friend_of");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock general_graph_create_graph_example1
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Alternative call:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline general_graph_create_graph_example2
    @EXAMPLE_ARANGOSH_OUTPUT{general_graph_create_graph_example2}
      var graph_module = require("@arangodb/general-graph");
    |  var edgeDefinitions = graph_module._edgeDefinitions(
    |  graph_module._relation("friend_of", ["Customer"], ["Customer"]), graph_module._relation(
       "has_bought", ["Customer", "Company"], ["Groceries", "Electronics"]));
      graph_module._create("myStore", edgeDefinitions);
    ~ graph_module._drop("myStore");
    ~ db._drop("Electronics");
    ~ db._drop("Customer");
    ~ db._drop("Groceries");
    ~ db._drop("Company");
    ~ db._drop("has_bought");
    ~ db._drop("friend_of");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock general_graph_create_graph_example2
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

List available Graphs
---------------------

List all graphs:

`graph_module._list()`

Lists all graph names stored in this database.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphList
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphList}
      var graph_module = require("@arangodb/general-graph");
      graph_module._list();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphList
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Load a Graph
------------

Get a graph by its name:

`graph_module._graph(graphName)`

- `graphName` (string):
  Unique identifier of the graph

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphLoadGraph
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphLoadGraph}
    ~ var examples = require("@arangodb/graph-examples/example-graph.js");
    ~ var g1 = examples.loadGraph("social");
      var graph_module = require("@arangodb/general-graph");
      graph = graph_module._graph("social");
    ~ examples.dropGraph("social");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphLoadGraph
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Remove a Graph
--------------

Drop a Graph by its name:

`graph_module._drop(graphName, dropCollections)`

- `graphName` (string):
  Unique identifier of the graph
- `dropCollections` (bool, _optional_):
  Define if collections should be dropped (default: false)

This can drop all collections contained in the graph as long as they are not
used within other graphs. To drop the collections only belonging to this graph,
the optional parameter *drop-collections* has to be set to *true*.

**Examples**

Drop a graph and keep collections:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphDropGraphKeep
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphDropGraphKeep}
    ~ var examples = require("@arangodb/graph-examples/example-graph.js");
    ~ var g1 = examples.loadGraph("social");
      var graph_module = require("@arangodb/general-graph");
      graph_module._drop("social");
      db._collection("female");
      db._collection("male");
      db._collection("relation");
    ~ db._drop("female");
    ~ db._drop("male");
    ~ db._drop("relation");
    ~ examples.dropGraph("social");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphDropGraphKeep
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphDropGraphDropCollections
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphDropGraphDropCollections}
    ~ var examples = require("@arangodb/graph-examples/example-graph.js");
    ~ var g1 = examples.loadGraph("social");
      var graph_module = require("@arangodb/general-graph");
      graph_module._drop("social", true);
      db._collection("female");
      db._collection("male");
      db._collection("relation");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphDropGraphDropCollections
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Modify a Graph definition at runtime
------------------------------------

After you have created an graph its definition is not immutable.
You can still add, delete or modify edge definitions and vertex collections.

### Extend the Edge Definitions

Add another edge definition to the graph:

`graph._extendEdgeDefinitions(edgeDefinition)`

- `edgeDefinition` (object):
  The relation definition to extend the graph

Extends the edge definitions of a graph. If an orphan collection is used in this
edge definition, it will be removed from the orphanage. If the edge collection of
the edge definition to add is already used in the graph or used in a different
graph with different *from* and/or *to* collections an error is thrown.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline general_graph__extendEdgeDefinitions
    @EXAMPLE_ARANGOSH_OUTPUT{general_graph__extendEdgeDefinitions}
      var graph_module = require("@arangodb/general-graph")
    ~ if (graph_module._exists("myGraph")){var blub = graph_module._drop("myGraph", true);}
      var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
      var ed2 = graph_module._relation("myEC2", ["myVC1"], ["myVC3"]);
      var graph = graph_module._create("myGraph", [ed1]);
      graph._extendEdgeDefinitions(ed2);
    ~ var blub = graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock general_graph__extendEdgeDefinitions
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Modify an Edge Definition

Modify a relation definition:

`graph_module._editEdgeDefinitions(edgeDefinition)`

- `edgeDefinition` (object):
  The edge definition to replace the existing edge definition with the same
  attribute *collection*.

Edits one relation definition of a graph. The edge definition used as argument will
replace the existing edge definition of the graph which has the same collection.
Vertex Collections of the replaced edge definition that are not used in the new
definition will transform to an orphan. Orphans that are used in this new edge
definition will be deleted from the list of orphans. Other graphs with the same edge
definition will be modified, too.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline general_graph__editEdgeDefinition
    @EXAMPLE_ARANGOSH_OUTPUT{general_graph__editEdgeDefinition}
      var graph_module = require("@arangodb/general-graph")
    ~ if (graph_module._exists("myGraph")){var blub = graph_module._drop("myGraph", true);}
      var original = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
      var modified = graph_module._relation("myEC1", ["myVC2"], ["myVC3"]);
      var graph = graph_module._create("myGraph", [original]);
      graph._editEdgeDefinitions(modified);
    ~ var blub = graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock general_graph__editEdgeDefinition
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Delete an Edge Definition

Delete one relation definition:

`graph_module._deleteEdgeDefinition(edgeCollectionName, dropCollection)`

- `edgeCollectionName` (string):
  Name of edge collection in the relation definition.
- `dropCollection` (bool, _optional_):
  Define if the edge collection should be dropped. Default: false

Deletes a relation definition defined by the edge collection of a graph. If the
collections defined in the edge definition (collection, from, to) are not used
in another edge definition of the graph, they will be moved to the orphanage.

**Examples**

Remove an edge definition but keep the edge collection:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline general_graph__deleteEdgeDefinitionNoDrop
    @EXAMPLE_ARANGOSH_OUTPUT{general_graph__deleteEdgeDefinitionNoDrop}
      var graph_module = require("@arangodb/general-graph")
    ~ if (graph_module._exists("myGraph")){var blub = graph_module._drop("myGraph", true);}
      var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
      var ed2 = graph_module._relation("myEC2", ["myVC1"], ["myVC3"]);
      var graph = graph_module._create("myGraph", [ed1, ed2]);
      graph._deleteEdgeDefinition("myEC1");
      db._collection("myEC1");
    ~ db._drop("myEC1");
    ~ var blub = graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock general_graph__deleteEdgeDefinitionNoDrop
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Remove an edge definition and drop the edge collection:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline general_graph__deleteEdgeDefinitionWithDrop
    @EXAMPLE_ARANGOSH_OUTPUT{general_graph__deleteEdgeDefinitionWithDrop}
      var graph_module = require("@arangodb/general-graph")
    ~ if (graph_module._exists("myGraph")){var blub = graph_module._drop("myGraph", true);}
      var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
      var ed2 = graph_module._relation("myEC2", ["myVC1"], ["myVC3"]);
      var graph = graph_module._create("myGraph", [ed1, ed2]);
      graph._deleteEdgeDefinition("myEC1", true);
      db._collection("myEC1");
    ~ db._drop("myEC1");
    ~ var blub = graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock general_graph__deleteEdgeDefinitionWithDrop
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Extend Vertex Collections

Each graph can have an arbitrary amount of vertex collections, which are not
part of any edge definition of the graph. These collections are called orphan
collections. If the graph is extended with an edge definition using one of the
orphans, it will be removed from the set of orphan collection automatically.

#### Add a Vertex Collection

Add a vertex collection to the graph:

`graph._addVertexCollection(vertexCollectionName, createCollection)`

- `vertexCollectionName` (string):
  Name of vertex collection.
- `createCollection` (bool, _optional_):
  If true the collection will be created if it does not exist. Default: true

Adds a vertex collection to the set of orphan collections of the graph. If the
collection does not exist, it will be created. If it is already used by any edge
definition of the graph, an error will be thrown.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline general_graph__addVertexCollection
    @EXAMPLE_ARANGOSH_OUTPUT{general_graph__addVertexCollection}
      var graph_module = require("@arangodb/general-graph");
    ~ if (graph_module._exists("myGraph")){var blub = graph_module._drop("myGraph", true);}
      var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
      var graph = graph_module._create("myGraph", [ed1]);
      graph._addVertexCollection("myVC3", true);
    ~ db._drop("myVC3");
    ~ var blub = graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock general_graph__addVertexCollection
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

#### Get the Orphaned Collections

Get all orphan collections:

`graph._orphanCollections()`

Returns all vertex collections of the graph that are not used in any
edge definition.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline general_graph__orphanCollections
    @EXAMPLE_ARANGOSH_OUTPUT{general_graph__orphanCollections}
      var graph_module = require("@arangodb/general-graph")
    ~ if (graph_module._exists("myGraph")){var blub = graph_module._drop("myGraph", true);}
      var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
      var graph = graph_module._create("myGraph", [ed1]);
      graph._addVertexCollection("myVC3", true);
      graph._orphanCollections();
    ~ var blub = graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock general_graph__orphanCollections
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

#### Remove a Vertex Collection

Remove a vertex collection from the graph:

`graph._removeVertexCollection(vertexCollectionName, dropCollection)`

- `vertexCollectionName` (string):
  Name of vertex collection.
- `dropCollection` (bool, _optional_):
  If true the collection will be dropped if it is not used in any other graph.
  Default: false

Removes a vertex collection from the graph.
Only collections not used in any relation definition can be removed.
Optionally the collection can be deleted, if it is not used in any other graph.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline general_graph__removeVertexCollections
    @EXAMPLE_ARANGOSH_OUTPUT{general_graph__removeVertexCollections}
      var graph_module = require("@arangodb/general-graph")
    ~ if (graph_module._exists("myGraph")){var blub = graph_module._drop("myGraph", true);}
      var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
      var graph = graph_module._create("myGraph", [ed1]);
      graph._addVertexCollection("myVC3", true);
      graph._addVertexCollection("myVC4", true);
      graph._orphanCollections();
      graph._removeVertexCollection("myVC3");
      graph._orphanCollections();
    ~ db._drop("myVC3");
    ~ var blub = graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock general_graph__removeVertexCollections
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Manipulating Vertices
---------------------

### Save a Vertex

Create a new vertex in *vertexCollectionName*:

`graph.vertexCollectionName.save(data)`

- `data` (object):
  JSON data of vertex.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphVertexCollectionSave
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphVertexCollectionSave}
      var examples = require("@arangodb/graph-examples/example-graph.js");
      var graph = examples.loadGraph("social");
      graph.male.save({name: "Floyd", _key: "floyd"});
    ~ examples.dropGraph("social");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphVertexCollectionSave
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Replace a Vertex

Replaces the data of a vertex in collection *vertexCollectionName*:

`graph.vertexCollectionName.replace(vertexId, data, options)`

- `vertexId` (string):
  *_id* attribute of the vertex
- `data` (object):
  JSON data of vertex.
- `options` (object, _optional_):
  See [collection documentation](data-modeling-documents-document-methods.html)

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphVertexCollectionReplace
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphVertexCollectionReplace}
      var examples = require("@arangodb/graph-examples/example-graph.js");
      var graph = examples.loadGraph("social");
      graph.male.save({neym: "Jon", _key: "john"});
      graph.male.replace("male/john", {name: "John"});
    ~ examples.dropGraph("social");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphVertexCollectionReplace
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Update a Vertex

Updates the data of a vertex in collection *vertexCollectionName*

`graph.vertexCollectionName.update(vertexId, data, options)`

- `vertexId` (string):
  *_id* attribute of the vertex
- `data` (object):
  JSON data of vertex.
- `options` (object, _optional_):
  See [collection documentation](data-modeling-documents-document-methods.html)

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphVertexCollectionUpdate
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphVertexCollectionUpdate}
      var examples = require("@arangodb/graph-examples/example-graph.js");
      var graph = examples.loadGraph("social");
      graph.female.save({name: "Lynda", _key: "linda"});
      graph.female.update("female/linda", {name: "Linda", _key: "linda"});
    ~ examples.dropGraph("social");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphVertexCollectionUpdate
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Remove a Vertex

Removes a vertex in collection *vertexCollectionName*

`graph.vertexCollectionName.remove(vertexId, options)`

- `vertexId` (string):
  *_id* attribute of the vertex
- `options` (object, _optional_):
  See [collection documentation](data-modeling-documents-document-methods.html)

Additionally removes all ingoing and outgoing edges of the vertex recursively
(see [edge remove](#remove-an-edge)).

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphVertexCollectionRemove
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphVertexCollectionRemove}
      var examples = require("@arangodb/graph-examples/example-graph.js");
      var graph = examples.loadGraph("social");
      graph.male.save({name: "Kermit", _key: "kermit"});
      db._exists("male/kermit")
      graph.male.remove("male/kermit")
      db._exists("male/kermit")
    ~ examples.dropGraph("social");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphVertexCollectionRemove
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Manipulating Edges
------------------

### Save a new Edge
Creates an edge from vertex `data._from` to vertex `data._to` in collection
`edgeCollectionName`.

`graph.edgeCollectionName.save(data, options)`

- `data` (object):
  JSON data of the edge. Needs to include a `_from` attribute with the document
  identifier of the source vertex and a `_to` attribute with the document
  identifier of the target vertex.
- `options` (object, _optional_):
  See [`collection.save()` options](data-modeling-documents-document-methods.html#insert--save)

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphEdgeCollectionSave1
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphEdgeCollectionSave1}
      var examples = require("@arangodb/graph-examples/example-graph.js");
      var graph = examples.loadGraph("social");
    | graph.relation.save({
    |   _from: "male/bob",
    |   _to: "female/alice",
        _key: "bobAndAlice", type: "married" });
    ~ examples.dropGraph("social");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphEdgeCollectionSave1
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

If the collections of *from* and *to* are not defined in an edge definition
of the graph, the edge will not be stored.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphEdgeCollectionSave2
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphEdgeCollectionSave2}
      var examples = require("@arangodb/graph-examples/example-graph.js");
      var graph = examples.loadGraph("social");
      | graph.relation.save(
      |  "relation/aliceAndBob",
      |   "female/alice",
         {type: "married", _key: "bobAndAlice"}); // xpError(ERROR_GRAPH_INVALID_EDGE)
    ~ examples.dropGraph("social");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphEdgeCollectionSave2
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Replace an Edge

Replaces the data of an edge in collection *edgeCollectionName*.
Note that `_from` and `_to` are mandatory.

`graph.edgeCollectionName.replace(edgeId, data, options)`

- `edgeId` (string):
  *_id* attribute of the edge
- `data` (object, _optional_):
  JSON data of the edge
- `options` (object, _optional_):
  See [collection documentation](data-modeling-documents-document-methods.html)

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphEdgeCollectionReplace
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphEdgeCollectionReplace}
      var examples = require("@arangodb/graph-examples/example-graph.js");
      var graph = examples.loadGraph("social");
      graph.relation.save("female/alice", "female/diana", {typo: "nose", _key: "aliceAndDiana"});
      graph.relation.replace("relation/aliceAndDiana", {type: "knows", _from: "female/alice", _to: "female/diana"});
    ~ examples.dropGraph("social");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphEdgeCollectionReplace
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Update an Edge

Updates the data of an edge in collection *edgeCollectionName*

`graph.edgeCollectionName.update(edgeId, data, options)`

- `edgeId` (string):
  *_id* attribute of the edge
- `data` (object, _optional_):
  JSON data of the edge
- `options` (object, _optional_):
  See [collection documentation](data-modeling-documents-document-methods.html)

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphEdgeCollectionUpdate
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphEdgeCollectionUpdate}
      var examples = require("@arangodb/graph-examples/example-graph.js");
      var graph = examples.loadGraph("social");
      graph.relation.save("female/alice", "female/diana", {type: "knows", _key: "aliceAndDiana"});
      graph.relation.update("relation/aliceAndDiana", {type: "quarreled", _key: "aliceAndDiana"});
    ~ examples.dropGraph("social");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphEdgeCollectionUpdate
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Remove an Edge

Removes an edge in collection edgeCollectionName

`graph.edgeCollectionName.remove(edgeId, options)`

- `edgeId` (string):
  *_id* attribute of the edge
- `options` (object, _optional_):
  See [collection documentation](data-modeling-documents-document-methods.html)

If this edge is used as a vertex by another edge, the other edge will be removed
(recursively).

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline generalGraphEdgeCollectionRemove
    @EXAMPLE_ARANGOSH_OUTPUT{generalGraphEdgeCollectionRemove}
      var examples = require("@arangodb/graph-examples/example-graph.js");
      var graph = examples.loadGraph("social");
      graph.relation.save("female/alice", "female/diana", {_key: "aliceAndDiana"});
      db._exists("relation/aliceAndDiana")
      graph.relation.remove("relation/aliceAndDiana")
      db._exists("relation/aliceAndDiana")
    ~ examples.dropGraph("social");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock generalGraphEdgeCollectionRemove
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
