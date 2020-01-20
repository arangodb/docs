---
layout: default
description: ArangoDB v3.7 Release Notes New Features
---
Features and Improvements in ArangoDB 3.7
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.7. ArangoDB 3.7 also contains several bug fixes that are not listed
here.

AQL
---

### Subquery optimizations


### Syntax enhancements

AQL now supports trailing commas in array and object definitions.

This is especially convenient for editing multi-line array/object definitions, since
there doesn't need to be a distinction between the last element and all others just
for the comma.
That means definitions such as the following are now supported:
```
[
  1,
  2,
  3,
]

{ 
  "a": 1,
  "b": 2,
  "c": 3,
}
```
Previous versions of ArangoDB did not support trailing commas in AQL queries and
threw query parse errors when they were used.


ArangoSearch
------------


Cluster
-------

