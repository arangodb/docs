---
layout: default
description: ArangoDB v3.12 Release Notes New Features
---
# Features and Improvements in ArangoDB 3.12

The following list shows in detail which features have been added or improved in
ArangoDB 3.12. ArangoDB 3.12 also contains several bug fixes that are not listed
here.

## ArangoSearch

### WAND optimization (Enterprise Edition)

For `arangosearch` Views and inverted indexes (and by extension `search-alias`
Views), you can define a list of sort expressions that you want to optimize.
This is also known as _WAND optimization_.

If you query a View with the `SEARCH` operation in combination with a
`SORT` and `LIMIT` operation, search results can be retrieved faster if the
`SORT` expression matches one of the optimized expressions.

Only sorting by highest rank is supported, that is, sorting by the result
of a scoring function in descending order (`DESC`).

See [Optimizing View and inverted index query performance](arangosearch-performance.html#wand-optimization)
for examples.

This feature is only available in the Enterprise Edition.

## Analyzers



## Web interface



## AQL



## Server options



## Internal changes

