---
layout: default 
description: ArangoDB v3.10 Release Notes New Features
---
Features and Improvements in ArangoDB 3.10
==========================================

The following list shows in detail which features have been added or improved in ArangoDB 3.10. ArangoDB 3.10 also
contains several bug fixes that are not listed here.

ArangoSearch
------------



UI
--



AQL
---



Server options
--------------



Miscellaneous changes
---------------------



Client tools
------------



Internal changes
----------------

### SmartGraphs and SatelliteGraphs on a single server

Now it is possible to test [SmartGraphs](graphs-smart-graphs.html) and
[SatelliteGraphs](graphs-satellite-graphs.html) on a single server and then to port them to a cluster with multiple
servers. All existing types of SmartGraphs are eligible to this procedure: [SmartGraphs](graphs-smart-graphs.html)
themselves, Disjoint SmartGraphs, [Hybrid SmartGraphs](graphs-smart-graphs.html#benefits-of-hybrid-smartgraphs) and
[Hybrid Disjoint SmartGraphs](graphs-smart-graphs.html#benefits-of-hybrid-disjoint-smartgraphs). One can create a graph
of any of those types in the usual way, e.g., using `arangosh`, but on a single server, then dump it, start a cluster
(with multiple servers) and restore the graph in the cluster. The graph and the collections will keep all properties
that are kept when the graph is already created in a cluster.

This feature is only available in the Enterprise Edition.