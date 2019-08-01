---
layout: default
description: ArangoSearch Views in AQL
redirect_from: /3.4/aql/views-arango-search.html
---
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

ArangoSearch value analysis
---------------------------

A concept of value 'analysis' that is meant to break up a given value into
a set of sub-values internally tied together by metadata which influences both
the search and sort stages to provide the most appropriate match for the
specified conditions, similar to queries to web search engines.

In plain terms this means a user can for example:

- request documents where the 'body' attribute best matches 'a quick brown fox'
- request documents where the 'dna' attribute best matches a DNA sub sequence
- request documents where the 'name' attribute best matches gender
- etc. (via custom analyzers)

To a limited degree the concept of 'analysis' is even available in
non-ArangoSearch AQL, e.g. the TOKENS(...) function will utilize the power of
IResearch to break up a value into an AQL array that can be used anywhere in the
AQL query.

In plain terms this means a user can match a document attribute when its
value matches at least one entry from a set,
e.g. to match docs with 'word == quick' OR 'word == brown' OR 'word == fox'

    FOR doc IN someCollection
      FILTER doc.word IN TOKENS('a quick brown fox', 'text_en')
      RETURN doc
