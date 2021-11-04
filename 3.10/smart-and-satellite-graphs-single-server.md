---
layout: default 
description: Test SmartGraphs and SatelliteGraphs on a single server, port them to an ArangoDB Cluster  
title: SmartGraphs and SatelliteGraphs on a Single Server
---

# General Idea

Simulate a SmartGraph or a SatelliteGraph on a single server and then to port it to an ArangoDB
Cluster
{:class="lead"}

The graphs are created in a single server instance and tested there. Internally, the graphs are, basically, General
Graphs supplemented by formal properties as `isSmart` that, however, play no role in the behavior of the graphs. The
same is true for vertex and edge collections: they have the corresponding properties, which are non-functional.

After a test phase such a graph can be dumped and then restored in a cluster instance. The graph itself and the vertex
and edge collections obtain now true SmartGraph or SatelliteGraph sharding properties as if they had been created in the
cluster.

# The Procedure

[SmartGraphs](graphs-smart-graphs-management.html) or [SatelliteGraphs](graphs-satellite-graphs-management.html)
graphs can be created in the usual way, e.g., using `arangosh`, just on a single server. Although not on a cluster, all
cluster relevant properties of graphs and collections can be set: `numberOfShards`, `isSmart`,
`isSatellite`, `replicationFactor`, `smartGraphAttribute`, `satellites` and `shardingStrategy`. Then the
graphs are [dumped](programs-arangodump-examples.html) with `arangodump`, again in the usual way.

Now a running instance of ArangoDB Cluster is used and the dumped data
are [restored](programs-arangorestore-examples.html) into this instance. All cluster relevant properties are restored
correctly and affect now the sharding and the performance.

