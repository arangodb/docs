---
layout: default
description: The SEARCH keyword is followed by an ArangoSearch expression to filter a View
title: The SEARCH operation in AQL
redirect_from: /3.4/views.html
---

<!--

```json
{
  "value": {
    "nested": {
      "deep": [ 1, 2, 3 ]
    }
  }
}
```

A View which is configured to index the field `value` including sub-fields
will index the individual numbers under the path `value.nested.deep`, which
can be queried for like:

```js
FOR doc IN someView
  SERACH doc.value.nested.deep == 2
  RETURN doc
```

This is different to `FILTER` operations, where you would use an
[array comparison operator](aql/operators.html#array-comparison-operators)
to find an element in the array:

```js
FOR doc IN collection
  FILTER doc.value.nested.deep ANY == 2
  RETURN doc
```


---
layout: default
description: Conceptually a view is just another document data source, similar to anarray or a document/edge collection, e
---
Views in AQL
============

Conceptually a **view** is just another document data source, similar to an
array or a document/edge collection, e.g.:

```js
FOR doc IN exampleView SEARCH ...
  FILTER ...
  SORT ...
  RETURN ...
```

Other than collections, views have an additional but optional `SEARCH` keyword:

```js
FOR doc IN exampleView
  SEARCH ...
  FILTER ...
  SORT ...
  RETURN ...
```

A view is meant to be an abstraction over a transformation applied to documents
of zero or more collections. The transformation is view-implementation specific
and may even be as simple as an identity transformation thus making the view
represent all documents available in the specified set of collections.

Views can be defined and administered on a per view-type basis via
the [web interface](../programs-web-interface.html).

Currently there is a single supported view implementation, namely
`arangosearch` as described in [ArangoSearch View](functions-arangosearch.html). 

Also see the detailed
[ArangoSearch tutorial](https://www.arangodb.com/tutorials/arangosearch/){:target="_blank"}
to learn more.


-->

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
- `IN` (array or range), also `NOT IN`

Note that array comparison operators, inline expressions and a few other things
are not supported by `SEARCH`. The server will raise a query error in case of
an invalid expression.
