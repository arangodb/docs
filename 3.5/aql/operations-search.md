---
layout: default
description: The SEARCH keyword is followed by an ArangoSearch expression to filter a View
title: The SEARCH operation in AQL
---
SEARCH
======

The `SEARCH` keyword starts the language construct to filter Views.
It is followed by an ArangoSearch filter expressions, which is comprised of
calls to ArangoSearch AQL functions.

General syntax
--------------

```
FOR doc IN someView
  SEARCH expression
  ...
```

The `SEARCH` statement, in contrast to `FILTER`, is treated as a part of the
`FOR` operation, not as an individual statement. It can not be placed freely
in a query nor multiple times in the body of a `FOR` loop. `FOR ... IN` must be
followed by the name of a [View](../arangosearch-views.html), not a collection.
The `SEARCH` operation has to follow next, other operations before `SEARCH`
such as `FILTER`, `COLLECT` etc. are not allowed in this position. Subsequent
operations are possible after `SEARCH` and the expression however, including
`SORT` to order the search results based on a ranking value computed by the
ArangoSearch View.

`expression` must be an ArangoSearch expression. The full power of ArangoSearch
is harnessed and exposed via special [ArangoSearch functions](functions-arangosearch.html),
during both the search and sort stages. On top of that, common AQL operators
are supported:

- `AND`
- `OR`
- `NOT`
- `==`
- `<=`
- `>=`
- `<`
- `>`
- `!=`
- `IN` (array or range)

Note that array comparison operators, inline expressions and a few other things
are not supported by `SEARCH`. The server will raise a query error in case of
an invalid expression.
