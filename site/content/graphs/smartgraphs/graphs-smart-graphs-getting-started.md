---
fileID: graphs-smart-graphs-getting-started
title: ArangoDB SmartGraphs - Getting Started
weight: 845
description: 
layout: default
---
## Getting started

SmartGraphs **cannot use existing collections**. When switching to SmartGraph from an
existing dataset you have to import the data into a fresh SmartGraph.

All collections that are being used in SmartGraphs need to be part of the same
`distributeShardslike` group. The `smartGraphAttribute` and the number of shards are immutable.
The `smartGraphAttribute` attribute is used to inform the database how to shard data and, as a 
consequence, all vertices must have this attribute. The `_from` and `_to` attributes that 
point _from_ one document _to_ another document stored in vertex collections are set by
default, following the same smart sharding pattern. 

## Create a SmartGraph

In contrast to General Graphs we have to add more options when creating the
SmartGraph. The two options `smartGraphAttribute` and `numberOfShards` are
required and cannot be modified later. 


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphCreateGraphHowTo1_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/smart-graph");
  var graph = graph_module._create("myGraph", [], [], {smartGraphAttribute: "region", numberOfShards: 9});
  graph_module._graph("myGraph");
 ~graph_module._drop("myGraph");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Create a Disjoint SmartGraph

In contrast to regular SmartGraphs we have to add one option when creating the
graph. The boolean option `isDisjoint` is required, needs to be set to `true`
and cannot be modified later. 


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphCreateGraphHowToDisjoint1_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/smart-graph");
  var graph = graph_module._create("myGraph", [], [], {smartGraphAttribute: "region", numberOfShards: 9, isDisjoint: true});
  graph_module._graph("myGraph");
 ~graph_module._drop("myGraph");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Add vertex collections

This is analogous to General Graphs. Unlike with General Graphs, the
**collections must not exist** when creating the SmartGraph. The SmartGraph
module will create them for you automatically to set up the sharding for all
these collections correctly. If you create collections via the SmartGraph
module and remove them from the graph definition, then you may re-add them
without trouble however, as they will have the correct sharding.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphCreateGraphHowTo2_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
 ~var graph_module = require("@arangodb/smart-graph");
 ~var graph = graph_module._create("myGraph", [], [], {smartGraphAttribute: "region", numberOfShards: 9});
  graph._addVertexCollection("shop");
  graph._addVertexCollection("customer");
  graph._addVertexCollection("pet");
  graph_module._graph("myGraph");
 ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Define relations on the Graph

Adding edge collections works the same as with General Graphs, but again, the
collections are created by the SmartGraph module to set up sharding correctly
so they must not exist when creating the SmartGraph (unless they have the
correct sharding already).


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: smartGraphCreateGraphHowTo3_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
 ~var graph_module = require("@arangodb/smart-graph");
 ~var graph = graph_module._create("myGraph", [], [], {smartGraphAttribute: "region", numberOfShards: 9});
 ~graph._addVertexCollection("shop");
 ~graph._addVertexCollection("customer");
 ~graph._addVertexCollection("pet");
  var rel = graph_module._relation("isCustomer", ["shop"], ["customer"]);
  graph._extendEdgeDefinitions(rel);
  graph_module._graph("myGraph");
 ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



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

{{% hints/info %}}
When providing a satellite collection that is not used in a relation,
it will not be created. If you create the collection in a following
request, only then the option will count.
{{% /hints/info %}}


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: hybridSmartGraphCreateGraphHowTo1_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/smart-graph");
  var rel = graph_module._relation("isCustomer", "shop", "customer")
  var graph = graph_module._create("myGraph", [rel], [], {satellites: ["shop", "customer"], smartGraphAttribute: "region", numberOfShards: 9});
  graph_module._graph("myGraph");
 ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



### Create a Disjoint SmartGraph using SatelliteCollections

The option `isDisjoint` needs to be set to `true` in addition to the other
options for a SmartGraph using SatelliteCollections. Only the `shop` vertex collection is created
as a SatelliteCollection in this example:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: hybridSmartGraphCreateGraphHowTo2_cluster
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/smart-graph");
  var rel = graph_module._relation("isCustomer", "shop", "customer")
  var graph = graph_module._create("myGraph", [rel], [], {satellites: ["shop"], smartGraphAttribute: "region", isDisjoint: true, numberOfShards: 9});
  graph_module._graph("myGraph");
 ~graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 

