---
layout: default
description: >-
  This chapter walks you through the first steps you need to follow to create an EnterpriseGraph
---
# Getting Started with EnterpriseGraphs

{{ page.description }}
{:class="lead"}

EnterpriseGraphs **cannot use existing collections**. When switching to
EnterpriseGraph from an existing dataset, you have to import the data into a
fresh EnterpriseGraph.

When creating an EnterpriseGraph, you cannot have different number of shards per
collection. To preserve the sharding pattern, the `_from` and `_to` attributes
of the edges cannot be defined or modified. 
You can define any `_key` value on vertices, including existing ones.

## Migrating from Community Edition

When migrating from the Community Edition to the Enterprise Edition, you can
bring data from existing collections using the command-line tools `arangoexport`
and `arangoimport`.

`arangoexport` allows you to export collections to formats like JSON or CSV.
Once you have exported your data to the desired format, you need to exclude
the *_key* values from edges. The `enterprise-graph` module does not allow
custom *_key* values on edges. This is necessary for the initial data replication
when using `arangoimport` because these values are immutable.

Example: to be added

## Collections in EnterpriseGraphs

In contrast to General Graphs, you **cannot use existing collections**.
When switching from an existing dataset, you have to import the data into a
fresh EnterpriseGraph.

The creation of an EnterpriseGraph graph requires the name of the graph and a
definition of its edges. All collections used within the creation process are
automatically created by the `enterprise-graph` module. Make sure to only use
non-existent collection names for both vertices and edges.

## Create an EnterpriseGraph using the Web Interface

The Web Interface (also called Web UI) allows you to easily create and manage
EnterpriseGraphs. To get started, follow the steps outlined below.

1. In the main page of the Web Interface, go to the left sidebar 
menu and select the **Graphs** tab.
2. To add a new graph, click **Add Graph**.
3. In the **Create Graph** dialog that appears, select the
**EnterpriseGraph** tab.
4. Fill in all required fields:
   - For **Name**, enter a name for the EnterpriseGraph.
   - For **Shards**, enter the number of shards the graph is using.
   - Optional: For **Replication factor**, enter the total number of
   desired copies of the data in the cluster.
   - Optional: For **Write concern**, enter the total number of copies
   of the data in the cluster required for each write operation.
   - Optional: For **Satellite collections**, insert vertex collections
   that are being used in your edge definitions. These collections are
   then created as satellites, and thus replicated to all DB-Servers.
   - For **Edge definitions**, enter a non-existent name to define
   the relation of the graph. This automatically creates a new edge
   collection, which is displayed in the **Collections** tab of the
   left sidebar menu.
   {% hint 'tip' %}
   To add multiple edge definitions, press the green plus button.
   {% endhint %}
   - For **fromCollections**, enter a non-existent collection name
   that contains the start vertices of the relation. This automatically
   creates a new vertex collection, which is displayed in the
   **Collections** tab of the left sidebar menu.
   - For **toCollections**, enter a non-existent collection name that
   contains the end vertices of the relation. This automatically
   creates a new vertex collection, which is displayed in the
   **Collections** tab of the left sidebar menu.
   - For **Vertex collections** (orphan collections), insert the name of
   a vertex collection that is part of the graph but not used in any
   edge definition.
5. Click **Create**. 
6. Open the graph and use the functions of the Graph Viewer to visually
interact with the graph and manage the graph data.
   
## Create an EntepriseGraph using *arangosh*

Compared to SmartGraphs, the option `isSmart: true` is required but the
`smartGraphAttribute` is forbidden. 

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline enterpriseGraphCreateGraphHowTo1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{enterpriseGraphCreateGraphHowTo1_cluster}
      var graph_module = require("@arangodb/enterprise-graph");
      var graph = graph_module._create("myGraph", [], [], {isSmart: true, numberOfShards: 9});
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock enterpriseGraphCreateGraphHowTo1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Add vertex collections

The **collections must not exist** when creating the EnterpriseGraph. The EnterpriseGraph
module will create them for you automatically to set up the sharding for all
these collections correctly. If you create collections via the EnterpriseGraph
module and remove them from the graph definition, then you may re-add them
without trouble however, as they will have the correct sharding.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline enterpriseGraphCreateGraphHowTo2_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{enterpriseGraphCreateGraphHowTo2_cluster}
     ~var graph_module = require("@arangodb/enterprise-graph");
     ~var graph = graph_module._create("myGraph", [], [], {isSmart: true, numberOfShards: 9});
      graph._addVertexCollection("shop");
      graph._addVertexCollection("customer");
      graph._addVertexCollection("pet");
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock enterpriseGraphCreateGraphHowTo2_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Define relations on the Graph

Adding edge collections works the same as with General Graphs, but again, the
collections are created by the EnterpriseGraph module to set up sharding correctly
so they must not exist when creating the EnterpriseGraph (unless they have the
correct sharding already).

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline enterpriseGraphCreateGraphHowTo3_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{enterpriseGraphCreateGraphHowTo3_cluster}
     ~var graph_module = require("@arangodb/enterprise-graph");
     ~var graph = graph_module._create("myGraph", [], [], {isSmart: true, numberOfShards: 9});
     ~graph._addVertexCollection("shop");
     ~graph._addVertexCollection("customer");
     ~graph._addVertexCollection("pet");
      var rel = graph_module._relation("isCustomer", ["shop"], ["customer"]);
      graph._extendEdgeDefinitions(rel);
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock enterpriseGraphCreateGraphHowTo3_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Create an EnterpriseGraph using SatelliteCollections

When creating a collection, you can decide whether it's a SatelliteCollection
or not. For example, a vertex collection can be satellite as well. 
SatelliteCollections don't require sharding as the data will be distributed
globally on all DB-Servers. The `smartGraphAttribute` is also not required.

In addition to the attributes you would set to create a EnterpriseGraph, there is an
additional attribute `satellites` you can optionally set. It needs to be an array of
one or more collection names. These names can be used in edge definitions
(relations) and these collections will be created as SatelliteCollections.
However, all vertex collections on one side of the relation have to be of
the same type - either all satellite or all smart. This is because `_from`
and `_to` can have different types based on the sharding pattern.

In this example, both vertex collections are created as SatelliteCollections.

{% hint 'info' %}
When providing a satellite collection that is not used in a relation,
it will not be created. If you create the collection in a following
request, only then the option will count.
{% endhint %}

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline enterpriseGraphCreateGraphHowTo4_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{enterpriseGraphCreateGraphHowTo4_cluster}
      var graph_module = require("@arangodb/enterprise-graph");
      var rel = graph_module._relation("isCustomer", "shop", "customer")
      var graph = graph_module._create("myGraph", [rel], [], {satellites: ["shop", "customer"], isSmart: true, numberOfShards: 9});
      graph_module._graph("myGraph");
     ~graph_module._drop("myGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock enterpriseGraphCreateGraphHowTo4_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
