---
layout: default
description: The SEARCH keyword is followed by an ArangoSearch expression to filter a View
title: The SEARCH operation in AQL
redirect_from:
  - /3.5/aql/views.html
  - /3.5/aql/views-arango-search.html
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


ArangoSearch Views in AQL
=========================

Views of type `arangosearch` are an integration layer meant to seamlessly
integrate with and natively expose the full power of the
[IResearch library](https://github.com/iresearch-toolkit/iresearch){:target="_blank"}
to the ArangoDB user.

They provide the capability to:

- evaluate together documents located in different collections
- search documents based on AQL boolean expressions and functions
- sort the result set based on how closely each document matched the search

Overview and Significance
-------------------------

Looking up documents in an ArangoSearch View is done via the `FOR` keyword:

```js
FOR doc IN someView
  ...
```

`FOR` operations over ArangoSearch Views have an additional, optional, `SEARCH`
keyword:

```js
FOR doc IN someView
  SEARCH searchExpression
```

ArangoSearch views cannot be used as edge collections in traversals:

```js
FOR v IN 1..3 ANY startVertex someView /* invalid! */
```

### SEARCH

`SEARCH` expressions look a lot like `FILTER` operations, but have some noteable
differences.

First of all, filters and functions in `SEARCH`, when applied to documents
_emitted from an ArangoSearch View_, work _only_ on attributes linked in the
view.

For example, given a collection `myCol` with the following documents:

```js
[
  { someAttr: 'One', anotherAttr: 'One' },
  { someAttr: 'Two', anotherAttr: 'Two' }
]
```

with a view, where `someAttr` is indexed by the following view `myView`:

```js
{
  "type": "arangosearch",
  "links": {
    "myCol": {
      "fields": {
        "someAttr": {}
      }
    }
  }
}
```

Then, a search on `someAttr` yields the following result:

```js
FOR doc IN myView
  SEARCH doc.someAttr == 'One'
  RETURN doc
```

```js
[ { someAttr: 'One', anotherAttr: 'One' } ]
```

While a search on `anotherAttr` yields an empty result:

```js
FOR doc IN myView
  SEARCH doc.anotherAttr == 'One'
  RETURN doc
```

```js
[]
```

- This only applies to the expression after the `SEARCH` keyword.
- This only applies to tests regarding documents emitted from a view. Other
  tests are not affected.
- In order to use `SEARCH` using all attributes of a linked sources, the special
  `includeAllFields` [link property](../arangosearch-views.html#link-properties)
  was designed.

### SORT

The document search via the `SEARCH` keyword and the sorting via the
ArangoSearch functions, namely `BM25()` and `TFIDF()`, are closely intertwined.
The query given in the `SEARCH` expression is not only used to filter documents,
but also is used with the sorting functions to decide which document matches
the query best. Other documents in the view also affect this decision.

Therefore the ArangoSearch sorting functions can work _only_ on documents
emitted from a view, as both the corresponding `SEARCH` expression and the view
itself are consulted in order to sort the results.

The `BOOST()` function, described below, can be used to fine-tune the resulting
ranking by weighing sub-expressions in `SEARCH` differently.

### Arrays and trackListPositions

Unless [**trackListPositions**](../arangosearch-views.html#link-properties)
is set to `true`, which it is not by default, arrays behave differently. Namely
they behave like a disjunctive superposition of their values - this is best
shown with an example.

With `trackListPositions: false`, which is the default, and given a document
`doc` containing

```js
{ attr: [ 'valueX', 'valueY', 'valueZ' ] }
```

in a `SEARCH` clause, the expression

```js
doc.attr == 'valueX'
```

will be true, as will be

```js
doc.attr == 'valueY'
```

and `== valueZ`. With `trackListPositions: true`,

```js
doc.attr[0] == 'valueX'
```

would work as usual.

### Comparing analyzed fields

As described in [value analysis](#arangosearch-value-analysis), when a field is
processed by a specific analyzer, comparison tests are done per word. For
example, given the field `text` is analyzed with `"text_en"` and contains the
string `"a quick brown fox jumps over the lazy dog"`, the following expression
will be true:

```js
ANALYZER(d.text == 'fox', "text_en")
```

Note also, that the words analyzed in the text are stemmed, so this is also
true:

```js
ANALYZER(d.text == 'jump', "text_en")
```

So a comparison will actually test if a word is contained in the text. With
`trackListPositions: false`, this means for arrays if the word is contained in
any element of the array. For example, given

```js
d.text = [ "a quick", "brown fox", "jumps over the", "lazy dog"]
```

the following will be true:

```js
ANALYZER(d.text == 'jump', "text_en")
```

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
