---
layout: default
description: The SEARCH keyword starts the language construct to filter Views of type ArangoSearch.
title: The SEARCH operation in AQL
redirect_from:
  - /3.5/aql/views.html
  - /3.5/aql/views-arango-search.html
---
SEARCH
======

The `SEARCH` keyword starts the language construct to filter Views of type
ArangoSearch. Conceptually, a View is just another document data source,
similar to an array or a document/edge collection, over which you can iterate
using a [FOR operation](operations-for.html) in AQL:

```js
FOR doc IN viewName
  RETURN doc
```

The optional `SEARCH` operation provides the capabilities to:

- filter documents based on AQL Boolean expressions and functions
- match documents located in different collections backed by a fast index
- sort the result set based on how closely each document matched the
  search conditions

See [ArangoSearch Views](../arangosearch-views.html) on how to set up a View.

General Syntax
--------------

The `SEARCH` keyword is followed by an ArangoSearch filter expressions, which
is mostly comprised of calls to ArangoSearch AQL functions.

```
FOR doc IN viewName
  SEARCH expression
  ...
```

The `SEARCH` statement, in contrast to `FILTER`, is treated as a part of the
`FOR` operation, not as an individual statement. It can not be placed freely
in a query nor multiple times in the body of a `FOR` loop. `FOR ... IN` must be
followed by the name of a View, not a collection. The `SEARCH` operation has to
follow next, other operations before `SEARCH` such as `FILTER`, `COLLECT` etc.
are not allowed in this position. Subsequent operations are possible after
`SEARCH` and the expression however, including `SORT` to order the search
results based on a ranking value computed by the ArangoSearch View.

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

Handling of non-indexed fields
------------------------------

Document attributes which are not configured to be indexed by a View are
treated by `SEARCH` as non-existent. This affects tests against the documents
emitted from the View only.


For example, given a collection `myCol` with the following documents:

```js
{ "someAttr": "One", "anotherAttr": "One" }
{ "someAttr": "Two", "anotherAttr": "Two" }
```

… with a View where `someAttr` is indexed by the following View `myView`:

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

… a search on `someAttr` yields the following result:

```js
FOR doc IN myView
  SEARCH doc.someAttr == "One"
  RETURN doc
```

```json
[ { "someAttr": "One", "anotherAttr": "One" } ]
```

A search on `anotherAttr` yields an empty result because only `someAttr`
is indexed by the View:

```js
FOR doc IN myView
  SEARCH doc.anotherAttr == "One"
  RETURN doc
```

```json
[]
```

You can use the special `includeAllFields`
[View property](../arangosearch-views.html#link-properties) to index all
(sub-)fields of the source documents if desired.

Arrays and trackListPositions
-----------------------------

Array elements are indexed individually and can be searched for as if the
attribute had each single value at the same time. They behave like a
_disjunctive superposition_ of their values as long as the
[**trackListPositions**](../arangosearch-views.html#link-properties) View
setting is `false` (default).

Therefore, array comparison operators such as `ALL IN` or `ANY ==` aren't
really necessary. Consider the following document:

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
FOR doc IN viewName
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

You can set `trackListPositions` to `true` if you want to query for a value
at a specific array index:

```js
doc.value.nested.deep[0] == 1
```

<!-- TODO no index disallowed? -->

String tokens (see [Analyzers](../arangosearch-analyzers.html)) are also
indexed individually. <!-- TODO regardless of trackListPositions? Query with index? -->

When a field is processed by a specific Analyzer, comparison tests are done
per word. For example, given the field `text` is analyzed with `"text_en"`
and contains the string `"a quick brown fox jumps over the lazy dog"`,
the following expression will be true:

```js
ANALYZER(doc.text == 'fox', "text_en")
```

Note that the `"text_en"` Analyzer stems the words, so this is also true:

```js
ANALYZER(doc.text == 'jump', "text_en")
```

So a comparison will actually test if a word is contained in the text. With
`trackListPositions: false`, this means for arrays if the word is contained in
any element of the array. For example, given:

```json
{"text": [ "a quick", "brown fox", "jumps over the", "lazy dog" ] }
```

… the following will be true:

```js
ANALYZER(doc.text == 'jump', "text_en")
```

With `trackListPositions: true` you would need to specify the index of the
array element `"jumps over the"` to be true:

```js
ANALYZER(doc.text[2] == 'jump', "text_en")
```

SEARCH with SORT
----------------

The document search via the `SEARCH` keyword and the sorting via the
ArangoSearch functions, namely `BM25()` and `TFIDF()`, are closely intertwined.
The query given in the `SEARCH` expression is not only used to filter documents,
but also is used with the sorting functions to decide which document matches
the query best. Other documents in the View also affect this decision.

Therefore the ArangoSearch sorting functions can work _only_ on documents
emitted from a View, as both the corresponding `SEARCH` expression and the View
itself are consulted in order to sort the results.

The [BOOST() function](functions-arangosearch.html#boost) can be used to
fine-tune the resulting ranking by weighing sub-expressions in `SEARCH`
differently.



<!-- TODO multiple scores, ASC, DESC, view doc attrs -->
