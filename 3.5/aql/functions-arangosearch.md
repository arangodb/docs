---
layout: default
description: ArangoSearch is integrated into AQL and used mainly through the use of special functions.
title: ArangoSearch related AQL Functions
---
ArangoSearch Functions
======================

Filter Functions
----------------

### ANALYZER()

`ANALYZER(expr, analyzer) → err

Sets the analyzer for the given search expression.

- **expr** (expression): any valid search expression
- **analyzer** (string): name of an [analyzer](../views-arango-search-analyzers.html)
- returns **err**: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

<!-- TODO: By default, context contains `Identity` analyzer. -->

### BOOST()

`BOOST(searchExpression, boost) → err`

Override boost in a context of **searchExpression** with a specified value,
making it available for scorer functions.

- *searchExpression* - any valid search expression
- *boost* - numeric boost value
- returns **err**: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

By default, context contains boost value equal to `1.0`.

The supported search functions are:

### EXISTS()

Note: Will only match values when the specified attribute has been processed
with the link property **storeValues** set to **"id"** (by default it's
**"none"**).

`EXISTS(doc.someAttr) → err`

Match documents **doc** where the attribute **someAttr** exists in the
document.

This also works with sub-attributes, e.g.

`EXISTS(doc.someAttr.anotherAttr) → err`

as long as the field is processed by the view with **storeValues** not
**none**.

`EXISTS(doc.someAttr, "analyzer", analyzer) → err`

Match documents where **doc.someAttr** exists in the document _and_ was indexed
by the specified **analyzer**. **analyzer** is optional and defaults to the
current context analyzer (e.g. specified by `ANALYZER` function).

`EXISTS(doc.someAttr, type) → err`

Match documents where the **doc.someAttr** exists in the document
 and is of the specified type.

- **path** (attribute path): the path of the attribute to test in the document
- **analyzer** (string): name of an [analyzer](../views-arango-search-analyzers.html)
- **type** (string): data type to test for, can be one of:
    - `"bool"`
    - `"boolean"`
    - `"numeric"`
    - `"null"`
    - `"string"`
- returns **err**: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

In case if **analyzer** isn't specified, current context analyzer (e.g.
specified by `ANALYZER` function) will be used.

### IN_RANGE()

`IN_RANGE(path, low, high, includeLow, includeHigh) → err`

- **path** (attribute path): the path of the attribute to test in the document
- **low** (number\|string): minimum value of the desired range
- **high** (number\|string): maximum value of the desired range
- **includeLow** (bool): whether the minimum value shall be included in
  the range (left-closed interval) or not (left-open interval)
- **includeHigh** (bool): whether the maximum value shall be included in
  the range (right-closed interval) or not (right-open interval)
- returns **err**: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

### MIN_MATCH()

`MIN_MATCH(expr1, ... exprN, minMatchCount) → err`

Match documents where at least **minMatchCount** of the specified
search expressions are satisfied.

- **expr** (expression, *repeatable*): any valid search expression
- **minMatchCount** (number): minimum number of search expressions that should
  be satisfied
- returns **err**: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

For example,

```js
MIN_MATCH(doc.text == 'quick', doc.text == 'brown', doc.text == 'fox', 2)
```

if `doc.text`, as analyzed by the current analyzer, contains 2 out of 'quick',
'brown' and 'fox', it will be included as matched one.

### PHRASE()

`PHRASE(path, phrasePart, analyzer) → err`

`PHRASE(path, phrasePart1, skipTokens1, ... phrasePartN, skipTokensN, analyzer) → err`

Search for a phrase in the referenced attribute. 

The phrase can be expressed as an arbitrary number of *phraseParts* separated by
*skipToken* number of tokens.

- **path** (attribute path): the path of the attribute to test in the document
- **phrasePart** (string): text to search for in the token stream; may consist of several
  words; will be split using the specified *analyzer*
- **skipTokens** (number): amount of words or tokens to treat as wildcards
- **analyzer** (string): name of an [analyzer](../views-arango-search-analyzers.html)
- returns **err**: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

For example, given a document `doc` containing the text
`"Lorem ipsum dolor sit amet, consectetur adipiscing elit"`, the following expression
will be `true`:

```js
PHRASE(doc.text, "ipsum", 1, "sit", 2, "adipiscing", "text_de")
```

Specifying deep attributes like `doc.some.deep.attr` is also allowed. The
attribute has to be processed by the view as specified in the link.

### STARTS_WITH()

`STARTS_WITH(path, prefix) → err`

Match the value of the attribute that starts with **prefix**.

- **path** (attribute path): the path of the attribute to compare against in the document
- **prefix** (string): a string to search at the start of the text
- returns **err**: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

Specifying deep attributes like `doc.some.deep.attr` is also allowed. The
attribute has to be processed by the view as specified in the link.

### TOKENS()

`TOKENS(input, analyzer) → tokenArray`

Split the **input** string with the help of the specified **analyzer** into an
array. The resulting array can i.e. be used in subsequent `FILTER` or `SEARCH`
statements with the **IN** operator. This can be used to better understand how
the specific analyzer is going to behave.

- **input** (string): text to tokenize
- **analyzer** (string): name of an [analyzer](../views-arango-search-analyzers.html)
- returns **tokenArray** (array): array of strings, each element being a token

Sorting Functions
-----------------

### BM25()

`BM25(doc, k, b) → score`

Sorts documents using the [**Best Matching 25** algorithm](https://en.wikipedia.org/wiki/Okapi_BM25){:target="_blank"}.
See the [`BM25()` section in ArangoSearch Scorers](../views-arango-search-scorers.html)
for details.

- **doc** (document): must be emitted by `FOR doc IN someView`
- **k** (number, *optional*): calibrates the text term frequency scaling. The default is
  *1.2*. A *k* value of 0 corresponds to a binary model (no term frequency), and a large
  value corresponds to using raw term frequency
- **b** (number, *optional*): determines the scaling by the total text length. The default
  is *0.75*. At the extreme values of the coefficient *b*, BM25 turns into the ranking
  functions known as
  - BM11 (for *b* = `1`, corresponds to fully scaling the term weight
    by the total text length) and
  - BM15 (for *b* = `0`, corresponds to no length normalization)
- returns **score** (number): computed ranking value

### TFIDF()

Sorts documents using the
[**term frequency–inverse document frequency** algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"}.
See the [`TFIDF()` section in ArangoSearch Scorers](../views-arango-search-scorers.html)
for details.

`TFIDF(doc, withNorms) → score`

- **doc** (document): must be emitted by `FOR doc IN someView`
- **withNorms** (bool, *optional*): specifying whether scores should be
  normalized. The default is *false*.
- returns **score** (number): computed ranking value
