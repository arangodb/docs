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


AQL
---

### Number of filtered documents in profiling output

The AQL query profiling output now shows the number of filtered inputs for each execution node
seperately, so that it is more visible how often filter conditions are invoked and how effective
they are. Previously the number of filtered inputs was only available as a total value in the
profiling output, and it wasn't clear which execution node caused which amount of filtering.

For example, consider the following query:
```
FOR doc1 IN collection
  FILTER doc1.value1 < 1000  /* uses index */
  FILTER doc1.value2 NOT IN [1, 4, 7]  /* post filter */
  FOR doc2 IN collection
    FILTER doc1.value1 == doc2.value2  /* uses index */
    FILTER doc2.value2 != 5  /* post filter */
    RETURN doc2
```

The profiling output for this query now shows how often the filters were invoked for the 
different execution nodes:
```
Execution plan:
 Id   NodeType        Calls   Items   Filtered   Runtime [s]   Comment
  1   SingletonNode       1       1          0       0.00008   * ROOT
 14   IndexNode           1     700        300       0.00574     - FOR doc1 IN collection   /* persistent index scan, projections: `value1`, `value2` */    FILTER (doc1.`value2` not in [ 1, 4, 7 ])   /* early pruning */
 13   IndexNode          61   60000      10000       0.15168       - FOR doc2 IN collection   /* persistent index scan */    FILTER (doc2.`value2` != 5)   /* early pruning */
 12   ReturnNode         61   60000          0       0.00168         - RETURN doc2

Indexes used:
 By   Name                      Type         Collection   Unique   Sparse   Selectivity   Fields         Ranges
 14   idx_1723322976405815296   persistent   collection   false    false        99.99 %   [ `value1` ]   (doc1.`value1` < 1000)
 13   idx_1723322875560067072   persistent   collection   false    false         0.01 %   [ `value2` ]   (doc1.`value1` == doc2.`value2`)

Query Statistics:
 Writes Exec   Writes Ign   Scan Full   Scan Index   Filtered   Peak Mem [b]   Exec Time [s]
           0            0           0        71000      10300          98304         0.16231
```

Indexes
-------

Persistent indexes now allow storing additional attributes in the index that
can be used to satisfy projections of the document.

Additional attributes can be specified in the new `storedValues` array that
can be used when creating a new persistent index. 
The additional attributes cannot be used for index lookups or for sorting,
but only for projections.

For example consider the following index definition:

```
db.<collection>.ensureIndex({ 
  type: "persistent", 
  fields: ["value1"], 
  storedValues: ["value2"] 
});
```
This will index the `value1` attribute in the traditional sense, so the index 
can be used for looking up by `value1` or for sorting by `value1`. The index also
supports projections on `value1` as usual.

In addition, due to `storedValues` being used here, the index can now also 
supply the values for the `value2` attribute for projections without having to
lookup up the full document.

This allows covering index scans in more cases and helps to avoid making
extra lookups for the document(s). This can have a great positive effect on 
index scan performance if the number of scanned index entries is large.

The maximum number of attributes that can be used in `storedValues` is 32. There
must be no overlap between the attributes in the index' `fields` attribute and
the index `storedValues` attributes. If there is an overlap, index creation
will abort with an error message.
It is not possible to create multiple indexes with the same `fields` attributes
and uniqueness but different `storedValues` attributes. That means the value of 
`storedValues` is not considered by calls to `ensureIndex` when checking if an 
index is already present or needs to be created.
In unique indexes, only the index attributes in `fields` are checked for uniqueness,
but the index attributes in `storedValues` are not checked for their uniqueness.


Server options
--------------


Miscellaneous changes
---------------------



Client tools
------------


### arangobench


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

The bundled version of the Boost library has been upgraded from 1.71.0 to 1.78.0.

The bundled version of the immer library has been upgraded from 0.6.2 to 0.7.0.
