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

### "disableIndex" hint

In some rare cases it can be advantageous to not do an index lookup or scan, 
but to do a full collection scan in an AQL query.
An index lookup can be more expensive than a full collection scan in case
the index lookup produces many (or even all documents) and the query cannot 
be satisfied from the index data alone.

Consider the following query and an index on the `value` attribute being
present:

```js
FOR doc IN collection 
  FILTER doc.value <= 99 
  RETURN doc.other
```

In this case, the optimizer will likely pick the index on `value`, because
it will cover the query's FILTER condition. To return the value for the
`other` attribute, the query must additionally look up the documents for
each index value that passes the FILTER condition. In case the number of
index entries is large (close or equal to the number of documents in the
collection), then using an index can cause work work than just scanning
over all documents in the collection.

The optimizer will likely prefer index scans over full collection scans,
even if an index scan turns out to be slower in the end. Since ArangoDB
3.10, the optimizer can be forced to not use an index for any given FOR
loop by using the `disableIndex` hint and setting it to `true`:

```js
FOR doc IN collection OPTIONS { disableIndex: true } 
  FILTER doc.value <= 99 
  RETURN doc.other
```

Using `disableIndex: false` has no effect on geo indexes or fulltext 
indexes.

Note that setting `disableIndex: true` plus `indexHint` is ambiguous. In
this case the optimizer will always prefer the `disableIndex` hint.

### "maxProjections" hint

By default, the query optimizer will consider up to 5 document attributes
per FOR loop to be used as projections. If more than 5 attributes of a
collection are accessed in a FOR loop, the optimizer will prefer to 
extract the full document and not use projections.

The threshold value of 5 attributes is arbitrary and can be adjusted 
since ArangoDB 3.10 by using the `maxProjections` hint.
The default value for `maxProjections` is `5`, which is compatible with the
previously hard-coded default value.

For example, using a `maxProjections` hint of 7, the following query will
extract the 7 attributes as projections from the original document:

```js
FOR doc IN collection OPTIONS { maxProjections: 7 } 
  RETURN [ doc.val1, doc.val2, doc.val3, doc.val4, doc.val5, doc.val6, doc.val7 ]
```

Normally it is not necessary to adjust the value of `maxProjections`, but
there are a few edge cases where it can make sense:

It can be advantageous to increase `maxProjections` when extracting many small 
attributes from very large documents, and a full copy of the documents should
be avoided. 
It can also be advantageous to decrease `maxProjections` to _avoid_ using
projections if the cost of projections is higher than doing copies of the
full documents. This can be the case for very small documents.


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
