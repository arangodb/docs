---
layout: default
description: >-
  ArangoDB allows you to create EnterpriseGraphs at scale with automated sharding key selection 
---
# EnterpriseGraphs

{{ page.description }}
{:class="lead"}

{% include hint-ee-arangograph.md feature="Enterprise Graphs" plural=true %}

This chapter describes the `enterprise-graph` module, a specialized version of
[SmartGraphs](graphs-smart-graphs.html).
It will give a vast performance benefit for all graphs sharded
in an ArangoDB Cluster, reducing network hops substantially.

In terms of querying there is no difference between SmartGraphs and EnterpriseGraphs.
For graph querying please refer to [AQL Graph Operations](aql/graphs.html)
and [General Graph Functions](graphs-general-graphs-functions.html) sections.

Creating and modifying the underlying collections of an EnterpriseGraph are
also similar to SmartGraphs. For a detailed API reference, please refer
to [Enterprise Graphs Management](graphs-enterprise-graphs-management.html).

Coming from the Community Edition? 
See [how to migrate](graphs-enterprise-graphs-getting-started.html#migrating-from-community-edition)
from a `general-graph` to an `enterprise-graph`.

## How EnterpriseGraphs work?

The creation and usage of EnterpriseGraphs are similar to [SmartGraphs](graphs-smart-graphs-getting-started.html).
However, the latter requires the selection of an appropriate sharding key.
This is known as the `smartGraphAttribute`, a value that is stored in every vertex,
which ensures data co-location of all vertices sharing this attribute and their
immediate edges.

EnterpriseGraphs come with a concept of "random sharding", meaning that the
sharding key is randomly selected while ensuring that all vertices with the
same sharding key and their adjacent edges are co-located on the same servers,
whenever possible. This approach provides significant advantages as it
minimizes the impact of having suboptimal sharding keys defined when creating
the graph.

This means that, when using EnterpriseGraphs, the `smartGraphAttribute` is
**not** required. As a consequence, you **cannot** define `_key` values on
edges. 

## EnterpriseGraphs using SatelliteCollections

EnterpriseGraphs are capable of using [SatelliteCollections](satellites.html)
within their graph definition. Therefore, edge definitions defined between 
EnterpriseCollections and SatelliteCollections can be created. As SatelliteCollections
(and the edge collections between EnterpriseGraph collections and SatelliteCollections)
are globally replicated to each participating DB-Server, (weighted) graph
traversal and (k-)shortest path(s) query can partially be executed locally on
each DB-Server. This means a larger part of the query can be executed fully
local whenever data from the SatelliteCollections is required.
