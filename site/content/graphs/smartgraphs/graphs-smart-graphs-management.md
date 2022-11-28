---
fileID: graphs-smart-graphs-management
title: SmartGraph Management
weight: 850
description: 
layout: default
---
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
about [General Graph Management](../general-graphs/graphs-general-graphs-management) first.
In the following, only the overloaded functionality is described.
Everything else works identical in both modules.

## Create a Graph

SmartGraphs require edge relations to be created. The format of the
relations is identical to the format used for General Graphs.
The only difference is that all collections used within
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
    The number of shards that are created for each collection. To maintain
    the correct sharding, all collections need an identical number of shards.
    This cannot be modified after creation of the graph.
  - `smartGraphAttribute` (string):
    The attribute that is used for sharding: vertices with the same value of
    this attribute are placed in the same shard. All vertices are required to
    have this attribute set and it has to be a string. Edges derive the
    attribute from their connected vertices.
  - `isDisjoint` (bool, _optional_):
    If set to `true`, a Disjoint SmartGraph is created. This flag is not
    editable after creation. Default: `false`.
  - `satellites` (array, _optional_):
    An array of collection names that is used to create
    [SatelliteCollections](../../satellites/) for a (Disjoint) SmartGraph
    using SatelliteCollections.
    Each array element must be a string and a valid collection name.
    The collection type cannot be modified later.

The creation of a graph requires the name and some SmartGraph options.
Due to the API `edgeDefinitions` and `orphanCollections` have to be given, but
both can be empty arrays and be added later.

The `edgeDefinitions` can be created using the convenience method `_relation`
known from the `general-graph` module, which is also available here.

`orphanCollections` again is just a list of additional vertex collections which
are not yet connected via edges but should follow the same sharding to be
connected later on. Note that these collections are not necessarily orphans in 
the graph theoretic sense: it is possible to add edges having one end in a collection
that has been declared as orphan. 

All collections used within the creation process are newly created.
The process fails if one of them already exists, unless they have the
correct sharding already. All newly created collections are immediately
be dropped again in the failure case.

**Examples**

Create a graph without relations. Edge definitions can be added later:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphCreate1_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/smart-graph");
  var graph = graph_module._create("myGraph", [], [], {smartGraphAttribute: "region", numberOfShards: 9});
  graph_module._graph("myGraph");
 ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Create a graph using an edge collection `edges` and a single vertex collection
`vertices` as relation:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphCreate2_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/smart-graph");
  var edgeDefinitions = [ graph_module._relation("edges", "vertices", "vertices") ];
  var graph = graph_module._create("myGraph", edgeDefinitions, [], {smartGraphAttribute: "region", numberOfShards: 9});
  graph_module._graph("myGraph");
 ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Create a graph with edge definitions and orphan collections:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphCreate3_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/smart-graph");
  var edgeDefinitions = [ graph_module._relation("myRelation", ["male", "female"], ["male", "female"]) ];
  var graph = graph_module._create("myGraph", edgeDefinitions, ["sessions"], {smartGraphAttribute: "region", numberOfShards: 9});
  graph_module._graph("myGraph");
 ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Modify a graph definition at runtime

After you have created a SmartGraph its definition is not immutable. You can
still add or remove relations. This is again identical to General Graphs.

However there is one important difference: you can only add collections that
either *do not exist*, or that have been created by this graph earlier. The
latter can be the case if you, for example, remove an orphan collection from this
graph, without dropping the collection itself. When after some time you decide
to add it to the graph again, you can do it. This is because the enforced sharding is still
applied to this vertex collection.

### Remove a vertex collection

Remove a vertex collection from the graph:

`graph._removeVertexCollection(vertexCollectionName, dropCollection)`

- `vertexCollectionName` (string):
  Name of vertex collection.
- `dropCollection` (bool, _optional_):
  If `true`, the collection is dropped if it is not used in any other graph.
  Default: `false`.

In most cases this function works identically to the General Graph one.
However there is one special case: The first vertex collection added to the graph
(either orphan or within a relation) defines the sharding for all collections
within the graph. Every other collection has its `distributeShardsLike` attribute set to the
name of the initial collection. This collection cannot be dropped as long as
other collections follow its sharding (i.e. they need to be dropped first).

**Examples**

Create a SmartGraph and list its orphan collections:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphModify1_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/smart-graph");
  var relation = graph_module._relation("edges", "vertices", "vertices");
  var graph = graph_module._create("myGraph", [relation], ["other"], {smartGraphAttribute: "region", numberOfShards: 9});
  graph._orphanCollections();
 ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Remove the orphan collection from the SmartGraph and drop the collection:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphModify2_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
 ~var graph_module = require("@arangodb/smart-graph");
 ~var relation = graph_module._relation("edges", "vertices", "vertices");
 ~var graph = graph_module._create("myGraph", [relation], ["other"], {smartGraphAttribute: "region", numberOfShards: 9});
  graph._removeVertexCollection("other", true);
  graph_module._graph("myGraph");
 ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Attempting to remove a non-orphan collection results in an error:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphModify3_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
 ~var graph_module = require("@arangodb/smart-graph");
 ~var relation = graph_module._relation("edges", "vertices", "vertices");
 ~var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
  graph._removeVertexCollection("vertices"); // xpError(ERROR_GRAPH_NOT_IN_ORPHAN_COLLECTION)
 ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



You cannot drop the initial collection (`vertices`) as long as it defines the
sharding for other collections (`edges`).


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphModify4_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/smart-graph");
  var relation = graph_module._relation("edges", "vertices", "vertices");
  var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
  graph._deleteEdgeDefinition("edges");
  graph._removeVertexCollection("vertices");
  db._drop("vertices"); // xpError(ERROR_CLUSTER_MUST_NOT_DROP_COLL_OTHER_DISTRIBUTESHARDSLIKE)
 ~graph_module._drop("myGraph", true);
 ~db._drop("edges");
 ~db._drop("vertices");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



You may drop the complete graph including the underlying collections by setting
the second argument in the call to `_drop()` to `true`. This only drops
collections that are in the graph definition at that point. Remember to manually
drop collections that you might have removed from the graph beforehand.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphModify5_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/smart-graph");
  var relation = graph_module._relation("edges", "vertices", "vertices");
  var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
  graph._deleteEdgeDefinition("edges");  // Remove edge collection from graph definition
  graph._removeVertexCollection("vertices"); // Remove vertex collection from graph definition
  graph_module._drop("myGraph", true);   // Does not drop any collections because none are left in the graph definition
  db._drop("edges"); // Manually clean up the collections that were left behind, drop 'edges' before sharding-defining 'vertices' collection
  db._drop("vertices");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Alternatively, you can `truncate()` all collections of the graph if you just
want to get rid of the data but keep the collections and graph definition.

### Remove an edge collection

Delete an edge definition from the graph:

`graph._deleteEdgeDefinition(edgeCollectionName, dropCollection)`

- `edgeCollectionName` (string):
  Name of edge collection.
- `dropCollection` (bool, _optional_):
  If `true`, the collection is dropped if it is not used in any other graph.
  Default: `false`.

**Examples**

Create a SmartGraph, then delete the edge definition and drop the edge collection:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphModify6_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/smart-graph");
  var relation = graph_module._relation("edges", "vertices", "vertices");
  var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
  graph._deleteEdgeDefinition("edges", true);
  graph_module._graph("myGraph");
 ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



It is allowed to remove the vertex collection `vertices` if it is not used in
any relation (i.e. after the deletion of the edge definition):


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphModify7_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
 ~var graph_module = require("@arangodb/smart-graph");
 ~var relation = graph_module._relation("edges", "vertices", "vertices");
 ~var graph = graph_module._create("myGraph", [relation], [], {smartGraphAttribute: "region", numberOfShards: 9});
  graph._deleteEdgeDefinition("edges");
  graph._removeVertexCollection("vertices");
 ~graph_module._drop("myGraph", true);
 ~db._drop("edges");
 ~db._drop("vertices");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Keep in mind that you cannot drop the `vertices` collection until no other
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


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphRemove1_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
 ~var graph_module = require("@arangodb/smart-graph");
 ~var relation = graph_module._relation("edges", "vertices", "vertices");
 ~var graph = graph_module._create("myGraph", [relation], ["other"], {smartGraphAttribute: "region", numberOfShards: 9});
  graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Note that removing a Graph with the option to drop the collections fails if
you removed collections from the Graph but did not drop these collections.
This is because their `distributeShardsLike` attribute still references
collections that are part of the Graph. Dropping collections while others
point to them in this way is not allowed. Make sure to drop the referencing
collections first.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphRemove2_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
 ~var graph_module = require("@arangodb/smart-graph");
 ~var relation = graph_module._relation("edges", "vertices", "vertices");
 ~var graph = graph_module._create("myGraph", [relation], ["other"], {smartGraphAttribute: "region", numberOfShards: 9});
  graph._removeVertexCollection("other");
  graph_module._drop("myGraph", true); // xpError(ERROR_CLUSTER_MUST_NOT_DROP_COLL_OTHER_DISTRIBUTESHARDSLIKE)
 ~db._drop("other");
 ~db._drop("vertices");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 


