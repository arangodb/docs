---
fileID: graphs-general-graphs
title: General Graphs
weight: 810
description: 
layout: default
---
This chapter describes the [general-graph](../) module.
It allows you to define a graph that is spread across several edge and document collections.
This allows you to structure your models in line with your domain and group them logically in collections giving you the power to query them in the same graph queries.
There is no need to include the referenced collections within the query, this module will handle it for you.

New to ArangoDB? Take the free
[ArangoDB Graph Course](https://www.arangodb.com/arangodb-graph-course)
for freshers.

## Three Steps to create a graph

**Create a graph**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphCreateGraphHowTo1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var graph_module = require("@arangodb/general-graph");
  var graph = graph_module._create("myGraph");
  graph;
~ graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

**Add some vertex collections**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphCreateGraphHowTo2
description: ''
render: input/output
version: '3.10'
release: stable
---
~ var graph_module = require("@arangodb/general-graph");
~ var graph = graph_module._create("myGraph");
  graph._addVertexCollection("shop");
  graph._addVertexCollection("customer");
  graph._addVertexCollection("pet");
  graph = graph_module._graph("myGraph");
~ graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

**Define relations on the Graph**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphCreateGraphHowTo3
description: ''
render: input/output
version: '3.10'
release: stable
---
~ var graph_module = require("@arangodb/general-graph");
~ var graph = graph_module._create("myGraph");
~ graph._addVertexCollection("pet");
  var rel = graph_module._relation("isCustomer", ["shop"], ["customer"]);
  graph._extendEdgeDefinitions(rel);
  graph = graph_module._graph("myGraph");
~ graph_module._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    
