---
fileID: graphs-general-graphs-management
title: Graph Management
weight: 625
description: 
layout: default
---
Lists all graph definitions stored in this database:

`graph_module._listObjects()`

**Examples**

List the graph names:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphList
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/general-graph");
~ graph_module._create("myGraph");
~ graph_module._create("myStore");
  graph_module._list();
~ graph_module._drop("myGraph");
~ graph_module._drop("myStore");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

List the graph definitions:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphListObjects
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/general-graph");
~ graph_module._create("myGraph", [ { collection: "edges", "from": [ "vertices" ], "to" : [ "vertices" ] } ]);
~ graph_module._create("myStore", [ { collection: "friend_of", from: [ "Customer" ], to: [ "Customer" ] }, { collection: "has_bought", from: [ "Customer", "Company" ], to: [ "Groceries", "Electronics" ] } ]);
  graph_module._listObjects();
~ graph_module._drop("myGraph", true);
~ graph_module._drop("myStore", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## Load a Graph

Get a graph by its name:

`graph_module._graph(graphName)`

- `graphName` (string):
  Unique identifier of the graph

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphLoadGraph
description: ''
render: input/output
version: '3.10'
release: stable
---
~ var examples = require("@arangodb/graph-examples/example-graph.js");
~ var g1 = examples.loadGraph("social");
  var graph_module = require("@arangodb/general-graph");
  graph = graph_module._graph("social");
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## Remove a Graph

Drop a Graph by its name:

`graph_module._drop(graphName, dropCollections)`

- `graphName` (string):
  Unique identifier of the graph
- `dropCollections` (bool, _optional_):
  Define if collections should be dropped (default: `false`)

This can drop all collections contained in the graph as long as they are not
used within other graphs. To drop the collections only belonging to this graph,
the optional parameter `drop-collections` has to be set to `true`.

**Examples**

Drop a graph and keep collections:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphDropGraphKeep
description: ''
render: input/output
version: '3.10'
release: stable
---
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
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Drop a graph and its collections:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphDropGraphDropCollections
description: ''
render: input/output
version: '3.10'
release: stable
---
~ var examples = require("@arangodb/graph-examples/example-graph.js");
~ var g1 = examples.loadGraph("social");
  var graph_module = require("@arangodb/general-graph");
  graph_module._drop("social", true);
  db._collection("female");
  db._collection("male");
  db._collection("relation");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## Modify a Graph definition at runtime

After you have created a graph its definition is not immutable.
You can still add, delete or modify edge definitions and vertex collections.

### Extend the Edge Definitions

Add another edge definition to the graph:

`graph._extendEdgeDefinitions(edgeDefinition, options)`

- `edgeDefinition` (object):
  The relation definition to extend the graph
- `options` (object):
  Additional options related to the edge definition itself.
  See [Edge Definition Options](#edge-definition-options).

Extends the edge definitions of a graph. If an orphan collection is used in this
edge definition, it is removed from the orphanage. If the edge collection of
the edge definition to add is already used in the graph or used in a different
graph with different `from` and/or `to` collections an error is thrown.

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: general_graph__extendEdgeDefinitions
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/general-graph")
  var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
  var ed2 = graph_module._relation("myEC2", ["myVC1"], ["myVC3"]);
  var graph = graph_module._create("myGraph", [ed1]);
  graph._extendEdgeDefinitions(ed2);
  graph = graph_module._graph("myGraph");
~ graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### Modify an Edge Definition

Modify a relation definition:

`graph_module._editEdgeDefinitions(edgeDefinition, options)`

- `edgeDefinition` (object):
  The edge definition to replace the existing edge definition with the same
  attribute `collection`.
- `options` (object):
  Additional options related to the edge definition itself.
  See [Edge Definition Options](#edge-definition-options).

Edits one relation definition of a graph. The edge definition used as argument
replaces the existing edge definition of the graph which has the same collection.
Vertex Collections of the replaced edge definition that are not used in the new
definition are transformed to an orphan. Orphans that are used in this new edge
definition are deleted from the list of orphans. Other graphs with the same edge
definition are modified, too.

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: general_graph__editEdgeDefinition
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/general-graph")
  var original = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
  var modified = graph_module._relation("myEC1", ["myVC2"], ["myVC3"]);
  var graph = graph_module._create("myGraph", [original]);
  graph._editEdgeDefinitions(modified);
~ graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### Delete an Edge Definition

Delete one relation definition:

`graph_module._deleteEdgeDefinition(edgeCollectionName, dropCollection)`

- `edgeCollectionName` (string):
  Name of edge collection in the relation definition.
- `dropCollection` (bool, _optional_):
  Define if the edge collection should be dropped. Default: `false`

Deletes a relation definition defined by the edge collection of a graph. If the
collections defined in the edge definition (`collection`, `from`, `to`) are not used
in another edge definition of the graph, they are moved to the orphanage.

**Examples**

Remove an edge definition but keep the edge collection:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: general_graph__deleteEdgeDefinitionNoDrop
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/general-graph")
  var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
  var ed2 = graph_module._relation("myEC2", ["myVC1"], ["myVC3"]);
  var graph = graph_module._create("myGraph", [ed1, ed2]);
  graph._deleteEdgeDefinition("myEC1");
  db._collection("myEC1");
~ db._drop("myEC1");
~ graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Remove an edge definition and drop the edge collection:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: general_graph__deleteEdgeDefinitionWithDrop
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/general-graph")
  var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
  var ed2 = graph_module._relation("myEC2", ["myVC1"], ["myVC3"]);
  var graph = graph_module._create("myGraph", [ed1, ed2]);
  graph._deleteEdgeDefinition("myEC1", true);
  db._collection("myEC1");
~ db._drop("myEC1");
~ graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### Extend Vertex Collections

Each graph can have an arbitrary amount of vertex collections, which are not
part of any edge definition of the graph. These collections are called orphan
collections. If the graph is extended with an edge definition using one of the
orphans, it is removed from the set of orphan collection automatically.

#### Add a Vertex Collection

Add a vertex collection to the graph:

`graph._addVertexCollection(vertexCollectionName, createCollection, options)`

- `vertexCollectionName` (string):
  Name of vertex collection.
- `createCollection` (bool, _optional_):
  If `true`, the collection is created if it does not exist. Default: `true`
- `options` (object, _optional_):
  Additional options related to the edge definition itself.
  See [Edge Definition Options](#edge-definition-options).

Adds a vertex collection to the set of orphan collections of the graph. If the
collection does not exist, it is created. If it is already used by any edge
definition of the graph, an error is thrown.

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: general_graph__addVertexCollection
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/general-graph");
  var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
  var graph = graph_module._create("myGraph", [ed1]);
  graph._addVertexCollection("myVC3", true);
  graph = graph_module._graph("myGraph");
~ db._drop("myVC3");
~ graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

#### Get the Orphaned Collections

Get all orphan collections:

`graph._orphanCollections()`

Returns all vertex collections of the graph that are not used in any
edge definition.

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: general_graph__orphanCollections
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/general-graph")
  var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
  var graph = graph_module._create("myGraph", [ed1]);
  graph._addVertexCollection("myVC3", true);
  graph._orphanCollections();
~ graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

#### Remove a Vertex Collection

Remove a vertex collection from the graph:

`graph._removeVertexCollection(vertexCollectionName, dropCollection)`

- `vertexCollectionName` (string):
  Name of vertex collection.
- `dropCollection` (bool, _optional_):
  If `true`, the collection is dropped if it is not used in any other graph.
  Default: `false`

Removes a vertex collection from the graph.
Only collections not used in any relation definition can be removed.
Optionally the collection can be deleted, if it is not used in any other graph.

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: general_graph__removeVertexCollections
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/general-graph")
  var ed1 = graph_module._relation("myEC1", ["myVC1"], ["myVC2"]);
  var graph = graph_module._create("myGraph", [ed1]);
  graph._addVertexCollection("myVC3", true);
  graph._addVertexCollection("myVC4", true);
  graph._orphanCollections();
  graph._removeVertexCollection("myVC3");
  graph._orphanCollections();
~ db._drop("myVC3");
~ graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## Manipulating Vertices

### Save a Vertex

Create a new vertex in `vertexCollectionName`:

`graph.vertexCollectionName.save(data)`

- `data` (object):
  JSON data of vertex.

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphVertexCollectionSave
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("social");
  graph.male.save({name: "Floyd", _key: "floyd"});
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### Replace a Vertex

Replaces the data of a vertex in collection `vertexCollectionName`:

`graph.vertexCollectionName.replace(vertexId, data, options)`

- `vertexId` (string):
  `_id` attribute of the vertex
- `data` (object):
  JSON data of vertex.
- `options` (object, _optional_):
  See [collection documentation](../../getting-started/data-model-concepts/documents/data-modeling-documents-document-methods)

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphVertexCollectionReplace
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("social");
  graph.male.save({neym: "Jon", _key: "john"});
  graph.male.replace("male/john", {name: "John"});
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### Update a Vertex

Updates the data of a vertex in collection `vertexCollectionName`.

`graph.vertexCollectionName.update(vertexId, data, options)`

- `vertexId` (string):
  `_id` attribute of the vertex
- `data` (object):
  JSON data of vertex.
- `options` (object, _optional_):
  See [collection documentation](../../getting-started/data-model-concepts/documents/data-modeling-documents-document-methods)

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphVertexCollectionUpdate
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("social");
  graph.female.save({name: "Lynda", _key: "linda"});
  graph.female.update("female/linda", {name: "Linda", _key: "linda"});
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### Remove a Vertex

Removes a vertex in collection `vertexCollectionName`.

`graph.vertexCollectionName.remove(vertexId, options)`

- `vertexId` (string):
  `_id` attribute of the vertex
- `options` (object, _optional_):
  See [collection documentation](../../getting-started/data-model-concepts/documents/data-modeling-documents-document-methods)

Additionally removes all ingoing and outgoing edges of the vertex recursively
(see [edge remove](#remove-an-edge)).

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphVertexCollectionRemove
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("social");
  graph.male.save({name: "Kermit", _key: "kermit"});
  db._exists("male/kermit")
  graph.male.remove("male/kermit")
  db._exists("male/kermit")
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## Manipulating Edges

### Save a new Edge

Creates an edge from vertex `data._from` to vertex `data._to` in collection
`edgeCollectionName`.

`graph.edgeCollectionName.save(data, options)`

- `data` (object):
  JSON data of the edge. Needs to include a `_from` attribute with the document
  identifier of the source vertex and a `_to` attribute with the document
  identifier of the target vertex.
- `options` (object, _optional_):
  See [`collection.save()` options](../../getting-started/data-model-concepts/documents/data-modeling-documents-document-methods#insert--save)

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphEdgeCollectionSave1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("social");
  graph.relation.save({
    _from: "male/bob",
    _to: "female/alice",
_key: "bobAndAlice", type: "married" });
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

If the collections of `from` and `to` are not defined in an edge definition
of the graph, the edge is not stored.

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphEdgeCollectionSave2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("social");
    graph.relation.save(
     "relation/aliceAndBob",
      "female/alice",
 {type: "married", _key: "bobAndAlice"}); // xpError(ERROR_GRAPH_INVALID_EDGE)
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### Replace an Edge

Replaces the data of an edge in collection `edgeCollectionName`.
Note that `_from` and `_to` are mandatory.

`graph.edgeCollectionName.replace(edgeId, data, options)`

- `edgeId` (string):
  `_id` attribute of the edge
- `data` (object, _optional_):
  JSON data of the edge
- `options` (object, _optional_):
  See [collection documentation](../../getting-started/data-model-concepts/documents/data-modeling-documents-document-methods)

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphEdgeCollectionReplace
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("social");
  graph.relation.save("female/alice", "female/diana", {typo: "nose", _key: "aliceAndDiana"});
  graph.relation.replace("relation/aliceAndDiana", {type: "knows", _from: "female/alice", _to: "female/diana"});
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### Update an Edge

Updates the data of an edge in collection `edgeCollectionName`.

`graph.edgeCollectionName.update(edgeId, data, options)`

- `edgeId` (string):
  `_id` attribute of the edge
- `data` (object, _optional_):
  JSON data of the edge
- `options` (object, _optional_):
  See [collection documentation](../../getting-started/data-model-concepts/documents/data-modeling-documents-document-methods)

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphEdgeCollectionUpdate
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("social");
  graph.relation.save("female/alice", "female/diana", {type: "knows", _key: "aliceAndDiana"});
  graph.relation.update("relation/aliceAndDiana", {type: "quarreled", _key: "aliceAndDiana"});
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### Remove an Edge

Removes an edge in collection `edgeCollectionName`.

`graph.edgeCollectionName.remove(edgeId, options)`

- `edgeId` (string):
  `_id` attribute of the edge
- `options` (object, _optional_):
  See [collection documentation](../../getting-started/data-model-concepts/documents/data-modeling-documents-document-methods)

If this edge is used as a vertex by another edge, the other edge is removed
(recursively).

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphEdgeCollectionRemove
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("social");
  graph.relation.save("female/alice", "female/diana", {_key: "aliceAndDiana"});
  db._exists("relation/aliceAndDiana")
  graph.relation.remove("relation/aliceAndDiana")
  db._exists("relation/aliceAndDiana")
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    
