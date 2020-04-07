---
layout: default
description: Graphs synchronously replicated to all servers, available in the Enterprise Edition
title: ArangoDB SatelliteGraphs
---
SatelliteGraphs
===============

{% hint 'info' %}
SatelliteGraphs are only available in the
[**Enterprise Edition**](https://www.arangodb.com/why-arangodb/arangodb-enterprise/){:target="_blank"},
and the [**ArangoDB Cloud**](https://cloud.arangodb.com/){:target="_blank"}.
{% endhint %}

This chapter describes the `satellite-graph` module, the tool to create and
modify your SatelliteGraph in ArangoDB. SatelliteGraphs are only available
in cluster mode.

What is a SatelliteGraph?
--------------

A SatelliteGraph is a specialised graph in ArangoDB and adds now a third type
of graph to the ArangoDB graph infrastructure. Currently, there are general
graphs (Community Edition), SmartGraphs (Enterprise Edition) and now so called
SatelliteGraphs (Enterprise Edition). 

All of them are fully working in a clustered environment, yet every one of them
has a reason for being. They are special because their data organisation concept
is unique for each type of graph. 

SatelliteGraphs are the natural extension of the concept of [Satellite collections](satellites.html)
to graphs. All of the usual benefits and caveats apply. A SatelliteGraph will be
distributed across the whole cluster. 

That means that SatelliteGraphs are synchronously replicated to all DB-Servers
that are part of a cluster, which enables DB-Servers to execute graph traversals
locally. This includes (k-)shortest path(s) computation and possibly joins with
traversals and greatly improves performance for such queries.

Why use a SatelliteGraph?
--------------

Briefly, if you are trying to achieve single-server alike query execution times in
a clustered environment.

However, some assumptions have to be made:
* The graph size should be manageable.
* The performance will be the highest if you're not permanently updating the
  graph's structure and content.

When doing joins involving graph traversals, shortest path or k-shortest paths
computation in an ArangoDB cluster, data has to be exchanged between different
servers. In particular graph traversals are usually executed on a Coordinator,
because they need global information. This results in a lot of network traffic
and potentially slow query execution.

A short example:

Take a graph-based permissions use case where you have a large, sharded collection
of documents within your ArangoDB cluster. They don't need to be part of your graph.
You probably want to determine quickly, if a user, group or device has permission to
e.g. access certain information. With SatelliteGraphs you can now replicate your
graph handling the permissions to each DB-Server and execute queries locally.


When to use another graph type?
--------------

Due the fact that we need to replicate graph data to the participating DB-Servers,
performance of writes into the affected graph collections will become slower. Also,
as writes are performed on every DB-Server, you will allocate more storage
distributed around the whole cluster environment.

If you want to distribute a very large graph and you don't want to replicate all
graph data to all participating nodes that are part of your cluster. In that case
please take a look at [SmartGraphs](graphs-smart-graphs.html).

Getting started
--------------

First of all, compared to GeneralGraphs, SatelliteGraphs do have  some rules regarding
a few collection properties. By using the SatelliteGraph module (or the Gharial HTTP
API), you don't need to manage those properties manually by yourself. This will be
important for more advanced setups which will be described in the advanced section.
This is important if you want to transform an existing GeneralGraph or SmartGraph to a
SatelliteGraph. To be able to switch to a SatelliteGraph you need to dump and restore
your previous graph. This switch can be easily achieved with arangodump and arangorestore.
The only thing you have to change in this pipeline is that you create the new collections
during creation with the SatelliteGraph module or add collections manually to the
SatelliteGraph before starting the arangorestore process.

### Create a graph

In contrast to GeneralGraphs and SmartGraphs, you do not need to take care of the sharding
and replication properties. The properties `distributeShardsLike`, `replicationFactor` and
`numberOfShards` will be set automatically. 

To create a SatelliteGraph in arangosh, use the `satelliteGraph` module:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline satelliteGraphCreate1_cluster
    @EXAMPLE_ARANGOSH_OUTPUT{satelliteGraphCreate1_cluster}
    var satelliteGraphModule = require("@arangodb/satellite-graph");
    var graph = satelliteGraphModule._create("satelliteGraph");
    satelliteGraphModule._graph("satelliteGraph");
    ~satelliteGraphModule._drop("satelliteGraph", true);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock satelliteGraphCreate1_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Add vertex collections
This is analogous to GeneralGraphs. Unlike with GeneralGraphs, there are rules for collections.
Only collections which do not violate the rules are allowed to be added (Details in section: [SatelliteGraphs in detail](graphs-satellite-graphs-details.html)).
Using the SatelliteGraph module to add new collections, the module will do all the configuration automatically: 

```
arangosh> let graph = g_module._graph("aSatelliteGraph");
arangosh> graph._addVertexCollection("aVertexCollection");
```

### Define relations on the SatelliteGraph
Adding edge collections works the same as with GeneralGraphs, but again, the collections are created by the SatelliteGraph module to fit the collection rules here as well.

```
arangosh> let graph = g_module._graph("aSatelliteGraph");
arangosh> let relation = g_module._relation("isFriend", ["person"], ["person"]);
arangosh> graph._extendEdgeDefinitions(relation);
```

New collections cannot violate the rules, existing ones can be added. But you need to take care of the correct collection properties. This is explained in the next section.