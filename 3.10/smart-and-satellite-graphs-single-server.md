---
layout: default 
description: >-
  Simulate SmartGraphs and SatelliteGraphs on a single server to make it easier
  to port them to an ArangoDB cluster later
title: SmartGraphs and SatelliteGraphs on a Single Server
---
# SmartGraphs and SatelliteGraphs on a Single Server

{{ page.description }}
{:class="lead"}

{% include hint-ee-arangograph.md feature="This feature" %}

## General idea

You can create SmartGraphs and SatelliteGraphs in a single server instance and
test them there. Internally, the graphs are General Graphs, supplemented by
formal properties such as `isSmart`, which play no role in the behavior of the
graphs, however. The same is true for vertex and edge collections: they have the
corresponding properties, but they are non-functional.

After a test phase, you can dump such graphs and then restore them in a cluster
instance. The graphs themselves and the vertex and edge collections obtain true
SmartGraph or SatelliteGraph sharding properties as if they were created in the
cluster.

## The Procedure

On a single server, create [SmartGraphs](graphs-smart-graphs-management.html) or
[SatelliteGraphs](graphs-satellite-graphs-management.html) graphs by using
`arangosh` as usual. Then you can set all the cluster-relevant properties of
graphs and collections:

- `numberOfShards`
- `isSmart`
- `isSatellite`
- `replicationFactor`
- `smartGraphAttribute`
- `satellites`
- `shardingStrategy`

After that, you can [dump](programs-arangodump-examples.html) the graphs with
`arangodump` as usual.

[Restore](programs-arangorestore-examples.html) the dumped data into a running
ArangoDB cluster. As a result, all cluster relevant properties are restored
correctly and affect the sharding and the performance as expected.
