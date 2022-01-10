---
layout: default
description: The SEARCH keyword starts the language construct to filter Views of type ArangoSearch.
title: The SEARCH operation in AQL
redirect_from:
  - views.html
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

Syntax
------

The `SEARCH` keyword is followed by an ArangoSearch filter expressions, which
is mostly comprised of calls to ArangoSearch AQL functions.

<pre><code>FOR <em>doc</em> IN <em>viewName</em>
  SEARCH <em>expression</em>
  OPTIONS { … }
  ...</code></pre>

Usage
-----

The `SEARCH` statement, in contrast to `FILTER`, is treated as a part of the
`FOR` operation, not as an individual statement. It can not be placed freely
in a query nor multiple times in the body of a `FOR` loop. `FOR ... IN` must be
followed by the name of a View, not a collection. The `SEARCH` operation has to
follow next, other operations before `SEARCH` such as `FILTER`, `COLLECT` etc.
are not allowed in this position. Subsequent operations are possible after
`SEARCH` and the expression however, including `SORT` to order the search
results based on a ranking value computed by the ArangoSearch View.

*expression* must be an ArangoSearch expression. The full power of ArangoSearch
is harnessed and exposed via special [ArangoSearch functions](functions-arangosearch.html),
during both the search and sort stages. On top of that, common AQL operators
are supported.

Note that inline expressions and a few other things are not supported by
`SEARCH`. The server will raise a query error in case of an invalid expression.

The `OPTIONS` keyword and an object can optionally follow the search expression
to set [Search Options](#search-options).

### Logical operators

Logical or Boolean operators allow you to combine multiple search conditions.

- `AND`, `&&` (conjunction)
- `OR`, `||` (disjunction)
- `NOT`, `!` (negation / inversion)

[Operator precedence](operators.html#operator-precedence) needs to be taken
into account and can be controlled with parentheses.

Consider the following contrived expression:

`doc.value < 0 OR doc.value > 5 AND doc.value IN [-10, 10]`

`AND` has a higher precedence than `OR`. The expression is equivalent to:

`doc.value < 0 OR (doc.value > 5 AND doc.value IN [-10, 10])`

The conditions are thus:
- values less than 0
- values greater than 5, but only if it is 10
  (or -10, but this can never be fulfilled)

Parentheses can be used as follows to apply the `AND` condition to both of the
`OR` conditions:

`(doc.value < 0 OR doc.value > 5) AND doc.value IN [-10, 10]`

The conditions are now:
- values less than 0, but only if it is -10
- values greater than 5, but only if it is 10

### Comparison operators

- `==` (equal)
- `<=` (less than or equal)
- `>=` (greater than or equal)
- `<` (less than)
- `>` (greater than)
- `!=` (unequal)
- `IN` (contained in array or range), also `NOT IN`
- `LIKE` (equal with wildcards, introduced in v3.7.0), also `NOT LIKE`

```js
FOR doc IN viewName
  SEARCH ANALYZER(doc.text == "quick" OR doc.text == "brown", "text_en")
  // -- or --
  SEARCH ANALYZER(doc.text IN ["quick", "brown"], "text_en")
  RETURN doc
```

{% hint 'warning' %}
The alphabetical order of characters is not taken into account by ArangoSearch,
i.e. range queries in SEARCH operations against Views will not follow the
language rules as per the defined Analyzer locale nor the server language
(startup option `--default-language`)!
Also see [Known Issues](../release-notes-known-issues39.html#arangosearch).
{% endhint %}

### Array comparison operators

[Array comparison operators](operators.html#array-comparison-operators) are
supported (introduced in v3.6.0):

```js
LET tokens = TOKENS("some input", "text_en")                 // ["some", "input"]
FOR doc IN myView SEARCH tokens  ALL IN doc.text RETURN doc // dynamic conjunction
FOR doc IN myView SEARCH tokens  ANY IN doc.text RETURN doc // dynamic disjunction
FOR doc IN myView SEARCH tokens NONE IN doc.text RETURN doc // dynamic negation
FOR doc IN myView SEARCH tokens  ALL >  doc.text RETURN doc // dynamic conjunction with comparison
FOR doc IN myView SEARCH tokens  ANY <= doc.text RETURN doc // dynamic disjunction with comparison
FOR doc IN myView SEARCH tokens NONE <  doc.text RETURN doc // dynamic negation with comparison
```

The following operators are equivalent in `SEARCH` expressions:
- `ALL IN`, `ALL ==`, `NONE !=`, `NONE NOT IN`
- `ANY IN`, `ANY ==`
- `NONE IN`, `NONE ==`, `ALL !=`, `ALL NOT IN`
- `ALL >`, `NONE <=`
- `ALL >=`, `NONE <`
- `ALL <`, `NONE >=`
- `ALL <=`, `NONE >`

The stored attribute referenced on the right side of the operator is like a
single, primitive value. In case of multiple tokens, it is like having multiple
such values as opposed to an array of values, even if the actual document
attribute is an array. `IN` and `==` as part of array comparison operators are
treated the same in `SEARCH` expressions for ease of use. The behavior is
different outside of `SEARCH`, where `IN` needs to be followed by an array.

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

SEARCH with SORT
----------------

The documents emitted from a View can be sorted by attribute values with the
standard [SORT() operation](operations-sort.html), using one or multiple
attributes, in ascending or descending order (or a mix thereof).

```js
FOR doc IN viewName
  SORT doc.text, doc.value DESC
  RETURN doc
```

If the (left-most) fields and their sorting directions match up with the
[primary sort order](../arangosearch-performance.html#primary-sort-order) definition
of the View then the `SORT` operation is optimized away.

Apart from simple sorting, it is possible to sort the matched View documents by
relevance score (or a combination of score and attribute values if desired).
The document search via the `SEARCH` keyword and the sorting via the
[ArangoSearch Scoring Functions](functions-arangosearch.html#scoring-functions),
namely `BM25()` and `TFIDF()`, are closely intertwined.
The query given in the `SEARCH` expression is not only used to filter documents,
but also is used with the scoring functions to decide which document matches
the query best. Other documents in the View also affect this decision.

Therefore the ArangoSearch scoring functions can work _only_ on documents
emitted from a View, as both the corresponding `SEARCH` expression and the View
itself are consulted in order to sort the results.

```js
FOR doc IN viewName
  SEARCH ...
  SORT BM25(doc) DESC
  RETURN doc
```

The [BOOST() function](functions-arangosearch.html#boost) can be used to
fine-tune the resulting ranking by weighing sub-expressions in `SEARCH`
differently.

If there is no `SEARCH` operation prior to calls to scoring functions or if
the search expression does not filter out documents (e.g. `SEARCH true`) then
a score of `0` will be returned for all documents.

Search Options
--------------

The `SEARCH` operation accepts an options object with the following attributes:

- `collections` (array, _optional_): array of strings with collection names to
  restrict the search to certain source collections
- `conditionOptimization` (string, _optional_): controls how search criteria
  get optimized (introduced in v3.6.2). Possible values:
  - `"auto"` (default): convert conditions to disjunctive normal form (DNF) and
    apply optimizations. Removes redundant or overlapping conditions, but can
    take quite some time even for a low number of nested conditions.
  - `"none"`: search the index without optimizing the conditions.
  <!-- Internal only: nodnf, noneg -->
- `countApproximate` (string, _optional_): controls how the total count of rows
  is calculated if the `fullCount` option is enabled for a query or when
  a `COLLECT WITH COUNT` clause is executed (introduced in v3.7.6)
  - `"exact"` (default): rows are actually enumerated for a precise count.
  - `"cost"`: a cost-based approximation is used. Does not enumerate rows and
    returns an approximate result with O(1) complexity. Gives a precise result
    if the `SEARCH` condition is empty or if it contains a single term query
    only (e.g. `SEARCH doc.field == "value"`), the usual eventual consistency
    of Views aside.

**Examples**

Given a View with three linked collections `coll1`, `coll2` and `coll3` it is
possible to return documents from the first two collections only and ignore the
third using the `collections` option:

```js
FOR doc IN viewName
  SEARCH true OPTIONS { collections: ["coll1", "coll2"] }
  RETURN doc
```

The search expression `true` matches all View documents. You can use any valid
expression here while limiting the scope to the chosen source collections.
