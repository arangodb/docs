---
fileID: graphs-satellite-graphs-management
title: SatelliteGraph Management
weight: 640
description: 
layout: default
---
This chapter describes the `satellite-graph` module, the JavaScript API to
create and modify your SatelliteGraphs in ArangoDB.

To generally understand the concept of the graph modules please see
[General Graph Management](../general-graphs/graphs-general-graphs-management) first.
In the following only the overloaded functionality is described.
Everything else works alike in both modules.

## Create a Graph

In contrast to General Graphs and SmartGraphs, you do not need to take care of
the sharding and replication properties. The properties `distributeShardsLike`,
`replicationFactor` and `numberOfShards` will be set automatically (also see
[prototype collection](graphs-satellite-graphs-details#the-prototype-collection)).

The format of the relations is identical.

{{< tabs >}}
{{% tab name="js" %}}
```js
var graph_module = require("@arangodb/satellite-graph");
graph_module._create(graphName, edgeDefinitions, orphanCollections);
```
{{% /tab %}}
{{< /tabs >}}

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

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: satelliteGraphManagementCreate1_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
var satelliteGraphModule = require("@arangodb/satellite-graph");
var graph = satelliteGraphModule._create("satelliteGraph");
satelliteGraphModule._graph("satelliteGraph");
   ~satelliteGraphModule._drop("satelliteGraph", true);
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
name: satelliteGraphManagementCreate2_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
var graph_module = require("@arangodb/satellite-graph");
var edgeDefinitions = [ graph_module._relation("edges", "vertices", "vertices") ];
var graph = graph_module._create("myGraph", edgeDefinitions);
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
name: satelliteGraphManagementCreate3_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
var graph_module = require("@arangodb/satellite-graph");
var edgeDefinitions = [ graph_module._relation("myRelation", ["male", "female"], ["male", "female"]) ];
var graph = graph_module._create("myGraph", edgeDefinitions, ["sessions"]);
graph_module._graph("myGraph");
   ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## Modify a SatelliteGraph definition at runtime

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
[prototype collection](graphs-satellite-graphs-details#the-prototype-collection)
This collection cannot be dropped as long as other collections follow its sharding
(i.e. they need to be dropped first).

**Examples**

Create a SatelliteGraph and list its orphan collections:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: satelliteGraphManagementModify1_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
var graph_module = require("@arangodb/satellite-graph");
var relation = graph_module._relation("edges", "vertices", "vertices");
var graph = graph_module._create("myGraph", [relation], ["other"]);
graph._orphanCollections();
   ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Remove the orphan collection from the SatelliteGraph and drop the collection:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: satelliteGraphManagementModify2_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
   ~var graph_module = require("@arangodb/satellite-graph");
   ~var relation = graph_module._relation("edges", "vertices", "vertices");
   ~var graph = graph_module._create("myGraph", [relation], ["other"]);
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
name: satelliteGraphManagementModify3_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
   ~var graph_module = require("@arangodb/satellite-graph");
   ~var relation = graph_module._relation("edges", "vertices", "vertices");
   ~var graph = graph_module._create("myGraph", [relation], []);
graph._removeVertexCollection("vertices"); // xpError(ERROR_GRAPH_NOT_IN_ORPHAN_COLLECTION)
   ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

You cannot drop the prototype collection (`vertices`) as long as it defines the
sharding for other collections (`edges`).

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: satelliteGraphManagementModify4_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
var graph_module = require("@arangodb/satellite-graph");
var relation = graph_module._relation("edges", "vertices", "vertices");
var graph = graph_module._create("myGraph", [relation], []);
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
the second argument in the call to `_drop()` to `true`. This will only drop
collections that are in the graph definition at that point. Remember to manually
drop collections that you might have removed from the graph beforehand.

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: satelliteGraphManagementModify5_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
var graph_module = require("@arangodb/satellite-graph");
var relation = graph_module._relation("edges", "vertices", "vertices");
var graph = graph_module._create("myGraph", [relation], []);
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
  If true the collection will be dropped if it is not used in any other graph.
  Default: false.

**Examples**

Create a SatelliteGraph, then delete the edge definition and drop the edge collection:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: satelliteGraphManagementModify6_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
var graph_module = require("@arangodb/satellite-graph");
var relation = graph_module._relation("edges", "vertices", "vertices");
var graph = graph_module._create("myGraph", [relation], []);
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
name: satelliteGraphManagementModify7_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
   ~var graph_module = require("@arangodb/satellite-graph");
   ~var relation = graph_module._relation("edges", "vertices", "vertices");
   ~var graph = graph_module._create("myGraph", [relation], []);
graph._deleteEdgeDefinition("edges");
graph._removeVertexCollection("vertices");
   ~graph_module._drop("myGraph", true);
   ~db._drop("edges");
   ~db._drop("vertices");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Keep in mind that you can not drop the `vertices` collection until no other
collection references it anymore (`distributeShardsLike` collection property).

## Remove a Graph

Remove a SatelliteGraph:

`graph_module._drop(graphName, dropCollections)`

- `graphName` (string):
  Name of the Graph.
- `dropCollections` (bool, _optional_):
  Define if collections should be dropped. Default: false.

**Examples**

Delete a SatelliteGraph and drop its collections:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: satelliteGraphManagementRemove1_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
   ~var graph_module = require("@arangodb/satellite-graph");
   ~var relation = graph_module._relation("edges", "vertices", "vertices");
   ~var graph = graph_module._create("myGraph", [relation], ["other"]);
graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Note that removing a graph with the option to drop the collections fails if
you removed collections from the graph but did not drop these collections.
This is because their `distributeShardsLike` attribute still references
collections that are part of the graph. Dropping collections while others
point to them in this way is not allowed. Make sure to drop the referencing
collections first.

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: satelliteGraphManagementRemove2_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
   ~var graph_module = require("@arangodb/satellite-graph");
   ~var relation = graph_module._relation("edges", "vertices", "vertices");
   ~var graph = graph_module._create("myGraph", [relation], ["other"]);
graph._removeVertexCollection("other");
graph_module._drop("myGraph", true); // xpError(ERROR_CLUSTER_MUST_NOT_DROP_COLL_OTHER_DISTRIBUTESHARDSLIKE)
   ~db._drop("other");
   ~db._drop("vertices");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    
