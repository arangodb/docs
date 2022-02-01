---
layout: default
description: ArangoDB v3.10 Release Notes New Features
---
Features and Improvements in ArangoDB 3.10
==========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.10. ArangoDB 3.10 also contains several bug fixes that are not listed
here.

ArangoSearch
------------



UI
--

### Rebalance shards

The rebalance shards section displays a button for rebalancing shards. A new DB-Server will not have any shards. With the rebalance functionality, 
the cluster will start to rebalance shards including empty DB-Servers. You can specify the maximum number of shards that can be 
moved in each operation by using the `--cluster.max-number-of-move-shards` flag in arangod (the default value is 10).
When the button is clicked, the number of scheduled move shards operations is shown, or it is displayed that 
no move operations have been scheduled if they are not necessary.


AQL
---

### GeoJSON changes

Our use of [GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946) has
been clarified and cleaned up. See [GeoJSON
Mode](./indexing-geo.html#geojson-mode) for details.

There are basically two fundamental changes:

 1. The syntax of GeoJSON objects is interpreted such that lines on the
    sphere are geodesics (pieces of great circles). This is in
    particular true for boundaries of polygons. No special treatment
    of longitude-latitude-rectangles is done any more.

 2. Linear rings in polygons are no longer automatically normalized such
    that the "smaller" of the two connected components is the interior.
    This allows to specify polygons which cover more than half of
    the surface of the earth and conforms to the GeoJSON standard.

As a consequence, geo indexes need to be dropped and recreated after an
upgrade. See [Legacy Polygons](indexing-geo.html#legacy-polygons) for
details and for hints for upgrades from versions before 3.10 to a
version 3.10 or later.

Quite a few bugs producing wrong results in geo queries with geo indexes
have been fixed.


Server options
--------------

### Rebalance shards

The `--cluster.max-number-of-move-shards` flag limits the maximum number of move shards operations which can be made when the **Rebalance Shards** button is clicked in the web UI. For backwards compatibility purposes, the default value is 10. If the value is 0, the tab containing this button will be inactive and the button cannot be clicked.


Miscellaneous changes
---------------------



Client tools
------------


### arangobench

Histograms are now switched off by default (the `--histogram.generate` flag set to `false`). To display them, set the flag to `true`.
If this option is disabled, but other histogram flags are used to invoke arangobench (e.g. `--histogram.interval-size 500`), everything will still run normally, but a warning message will be displayed, stating that histograms are switched off by default and using other histogram options has no effect.


### arangoexport

Added a new option called `--custom-query-bindvars` to arangoexport, so queries given via `--custom-query` can have bind variables in them. 


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

### C++20 

ArangoDB is now compiled using the `-std=c++20` compile option on Linux and MacOS.
A compiler with c++-20 support is thus needed to compile ArangoDB from source.

### Upgraded bundled library versions

The bundled version of the RocksDB library has been upgraded from 6.8.0 to 6.27.0.

The bundled version of the Boost library has been upgraded from 1.71.0 to 1.77.0.

The bundled version of the immer library has been upgraded from 0.6.2 to 0.7.0.
