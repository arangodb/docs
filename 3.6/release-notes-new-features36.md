---
layout: default
description: ArangoDB v3.6 Release Notes New Features
---
Features and Improvements in ArangoDB 3.6
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.6. ArangoDB 3.6 also contains several bug fixes that are not listed
here.

ArangoSearch
------------

AQL
---

### Early pruning of non-matching documents

Previously, AQL queries with filter conditions that could not be satisfied by any index
required all documents to be copied from the storage engine into the AQL scope in order
to be fed into the filter.

An example query execution plan for such query from ArangoDB 3.5 looks like this:

```
Query String (75 chars, cacheable: true):
 FOR doc IN test FILTER doc.value1 > 9 && doc.value2 == 'test854' RETURN doc

Execution plan:
 Id   NodeType                    Est.   Comment
  1   SingletonNode                  1   * ROOT
  2   EnumerateCollectionNode   100000     - FOR doc IN test   /* full collection scan */
  3   CalculationNode           100000       - LET #1 = ((doc.`value1` > 9) && (doc.`value2` == "test854"))
  4   FilterNode                100000       - FILTER #1
  5   ReturnNode                100000       - RETURN doc
```

ArangoDB 3.6 adds an optimizer rule `move-filters-into-enumerate` which allows applying
the filter condition directly while scanning the documents, so copying of any documents
that don't match the filter condition can be avoided.

The query execution plan for the above query from 3.6 with that optimizer rule applied
looks as follows:

```
Query String (75 chars, cacheable: true):
 FOR doc IN test FILTER doc.value1 > 9 && doc.value2 == 'test854' RETURN doc

Execution plan:
 Id   NodeType                    Est.   Comment
  1   SingletonNode                  1   * ROOT
  2   EnumerateCollectionNode   100000     - FOR doc IN test   /* full collection scan */   FILTER ((doc.`value1` > 9) && (doc.`value2` == "test854"))   /* early pruning */
  5   ReturnNode                100000       - RETURN doc
```

Note that in this execution plan the scanning and filtering are combined in one node, so
the copying of all non-matching documents from the storage engine into the AQL scope is
completely avoided.

This optimization will be beneficial if the filter condition is very selective and will
filter out many documents, and if documents are large. In this case a lot of copying will
be avoided.

The optimizer rule also works if an index is used, but there are also filter conditions
that cannot be satisfied by the index alone.

Here is a 3.5 query execution plan for a query using a filter on an indexed value plus a
filter on a non-indexed value:

```
Query String (101 chars, cacheable: true):
 FOR doc IN test FILTER doc.value1 > 10000 && doc.value1 < 30000 && doc.value2 == 'test854' RETURN
 doc

Execution plan:
 Id   NodeType           Est.   Comment
  1   SingletonNode         1   * ROOT
  6   IndexNode         26666     - FOR doc IN test   /* hash index scan */
  7   CalculationNode   26666       - LET #1 = (doc.`value2` == "test854")   
  4   FilterNode        26666       - FILTER #1
  5   ReturnNode        26666       - RETURN doc

Indexes used:
 By   Name                      Type   Collection   Unique   Sparse   Selectivity   Fields         Ranges
  6   idx_1649353982658740224   hash   test         false    false       100.00 %   [ `value1` ]   ((doc.`value1` > 10000) && (doc.`value1` < 30000))
```

In 3.6, the same query will be executed using a combined index scan & filtering approach, again
avoiding any copies of non-matching documents:
```
Query String (101 chars, cacheable: true):
 FOR doc IN test FILTER doc.value1 > 10000 && doc.value1 < 30000 && doc.value2 == 'test854' RETURN
 doc

Execution plan:
 Id   NodeType         Est.   Comment
  1   SingletonNode       1   * ROOT
  6   IndexNode       26666     - FOR doc IN test   /* hash index scan */   FILTER (doc.`value2` == "test854")   /* early pruning */
  5   ReturnNode      26666       - RETURN doc

Indexes used:
 By   Name                      Type   Collection   Unique   Sparse   Selectivity   Fields         Ranges
  6   idx_1649353982658740224   hash   test         false    false       100.00 %   [ `value1` ]   ((doc.`value1` > 10000) && (doc.`value1` < 30000))
```


HTTP API extensions
-------------------

Web interface
-------------

JavaScript
----------

Client tools
------------

Startup option changes
----------------------

Miscellaneous
-------------

Internal
--------

We have moved from C++14 to C++17, which allows us to use some of the simplifications,
features and guarantees that this standard has in stock.
To compile ArangoDB 3.6 from source, a compiler that supports C++17 is now required.

The bundled JEMalloc memory allocator used in ArangoDB release packages has been
upgraded from version 5.2.0 to version 5.2.1.

The bundled version of the Boost library has been upgraded from 1.69.0 to 1.71.0.

The bundled version of xxhash has been upgraded from 0.5.1 to 0.7.2.
