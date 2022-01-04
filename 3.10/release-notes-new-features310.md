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

### C++20 

ArangoDB is now compiled using the `-std=c++20` compile option on Linux and MacOS.
A compiler with c++-20 support is thus needed to compile ArangoDB from source.

### Upgraded bundled library versions

The bundled version of the Boost library has been upgraded from 1.71.0 to 1.77.0.

The bundled version of the immer library has been upgraded from 0.6.2 to 0.7.0.
