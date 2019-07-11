---
layout: default
description: ArangoSearch is integrated into AQL and used mainly through the use of special functions.
title: ArangoSearch related AQL Functions
---
ArangoSearch Functions
======================



ArangoSearch filters
--------------------



### ANALYZER()

`ANALYZER(searchExpression, analyzer)`

Override analyzer in a context of **searchExpression** with another one,
denoted by a specified **analyzer** argument, making it available for search
functions.

- *searchExpression* - any valid search expression
- *analyzer* - string with the analyzer to imbue, i.e. *"text_en"* or one of the
  other [available string analyzers](../views-arango-search-analyzers.html)

By default, context contains `Identity` analyzer.

### BOOST()

`BOOST(searchExpression, boost)`

Override boost in a context of **searchExpression** with a specified value,
making it available for scorer functions.

- *searchExpression* - any valid search expression
- *boost* - numeric boost value

By default, context contains boost value equal to `1.0`.

The supported search functions are:

### EXISTS()

Note: Will only match values when the specified attribute has been processed
with the link property **storeValues** set to **"id"** (by default it's
**"none"**).

`EXISTS(doc.someAttr)`

Match documents **doc** where the attribute **someAttr** exists in the
document.

This also works with sub-attributes, e.g.

`EXISTS(doc.someAttr.anotherAttr)`

as long as the field is processed by the view with **storeValues** not
**none**.

`EXISTS(doc.someAttr, "analyzer", analyzer)`

Match documents where **doc.someAttr** exists in the document _and_ was indexed
by the specified **analyzer**. **analyzer** is optional and defaults to the
current context analyzer (e.g. specified by `ANALYZER` function).

`EXISTS(doc.someAttr, type)`

Match documents where the **doc.someAttr** exists in the document
 and is of the specified type.

- *doc.someAttr* - the path of the attribute to exist in the document
- *analyzer* - string with the analyzer used, i.e. *"text_en"* or one of the
  other [available string analyzers](../views-arango-search-analyzers.html)
- *type* - data type as string; one of:
    - **bool**
    - **boolean**
    - **numeric**
    - **null**
    - **string**

In case if **analyzer** isn't specified, current context analyzer (e.g.
specified by `ANALYZER` function) will be used.

### PHRASE()

```
PHRASE(doc.someAttr, 
       phrasePart [, skipTokens] [, phrasePart | , phrasePart, skipTokens]*
       [, analyzer])
```

Search for a phrase in the referenced attributes. 

The phrase can be expressed as an arbitrary number of *phraseParts* separated by
*skipToken* number of tokens.

- *doc.someAttr* - the path of the attribute to compare against in the document
- *phrasePart* - a string to search in the token stream; may consist of several
  words; will be split using the specified *analyzer*
- *skipTokens* number of words or tokens to treat as wildcards
- *analyzer* - string with the analyzer used, i.e. *"text_en"* or one of the
  other [available string analyzers
  ](../views-arango-search-analyzers.html)

For example, given a document `doc` containing the text `"Lorem ipsum dolor sit
amet, consectetur adipiscing elit"`, the following expression will be `true`:

```js
PHRASE(doc.text, "ipsum", 1, "sit", 2, "adipiscing", "text_de")
```

Specifying deep attributes like `doc.some.deep.attr` is also allowed. The
attribute has to be processed by the view as specified in the link.

### STARTS_WITH()

`STARTS_WITH(doc.someAttr, prefix)`

Match the value of the **doc.someAttr** that starts with **prefix**

- *doc.someAttr* - the path of the attribute to compare against in the document
- *prefix* - a string to search at the start of the text

Specifying deep attributes like `doc.some.deep.attr` is also allowed. The
attribute has to be processed by the view as specified in the link.

### TOKENS()

`TOKENS(input, analyzer)`

Split the **input** string with the help of the specified **analyzer** into an
Array. The resulting Array can i.e. be used in subsequent `FILTER` or `SEARCH`
statements with the **IN** operator. This can be used to better understand how
the specific analyzer is going to behave.
- *input* string to tokenize
- *analyzer* one of the [available string_analyzers](../views-arango-search-analyzers.html)

### MIN_MATCH()

`MIN_MATCH(searchExpression [, searchExpression]*, minMatchCount)`

Match documents where at least **minMatchCount** of the specified
**searchExpression**s are satisfied.

- *searchExpression* - any valid search expression
- *minMatchCount* - minimum number of *searchExpression*s that should be
  satisfied

For example,

```js
MIN_MATCH(doc.text == 'quick', doc.text == 'brown', doc.text == 'fox', 2)
```

if `doc.text`, as analyzed by the current analyzer, contains 2 out of 'quick',
'brown' and 'fox', it will be included as matched one.

### Searching examples

to match documents which have a 'name' attribute

    FOR doc IN someView SEARCH EXISTS(doc.name)
      RETURN doc

or

    FOR doc IN someView SEARCH EXISTS(doc['name'])
      RETURN doc

to match documents where 'body' was analyzed via the 'text_en' analyzer

    FOR doc IN someView SEARCH EXISTS(doc.body, 'analyzer', 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH EXISTS(doc['body'], 'analyzer', 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH ANALYZER(EXISTS(doc['body'], 'analyzer'), 'text_en')
      RETURN doc

to match documents which have an 'age' attribute of type number

    FOR doc IN someView SEARCH EXISTS(doc.age, 'numeric')
      RETURN doc

or

    FOR doc IN someView SEARCH EXISTS(doc['age'], 'numeric')
      RETURN doc

to match documents where 'description' contains word 'quick' or word
'brown' and has been analyzed with 'text_en' analyzer

    FOR doc IN someView SEARCH ANALYZER(doc.description == 'quick' OR doc.description == 'brown', 'text_en')
      RETURN doc

to match documents where 'description' contains at least 2 of 3 words 'quick', 
'brown', 'fox' and has been analyzed with 'text_en' analyzer

    FOR doc IN someView SEARCH ANALYZER(
        MIN_MATCH(doc.description == 'quick', doc.description == 'brown', doc.description == 'fox', 2),
        'text_en'
      )
      RETURN doc

to match documents where 'description' contains a phrase 'quick brown'

    FOR doc IN someView SEARCH PHRASE(doc.description, [ 'quick brown' ], 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH PHRASE(doc['description'], [ 'quick brown' ], 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH ANALYZER(PHRASE(doc['description'], [ 'quick brown' ]), 'text_en')
      RETURN doc

to match documents where 'body' contains the phrase consisting of a sequence
like this:
'quick' * 'fox jumps' (where the asterisk can be any single word)

    FOR doc IN someView SEARCH PHRASE(doc.body, [ 'quick', 1, 'fox jumps' ], 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH PHRASE(doc['body'], [ 'quick', 1, 'fox jumps' ], 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH ANALYZER(PHRASE(doc['body'], [ 'quick', 1, 'fox jumps' ]), 'text_en')
      RETURN doc

to match documents where 'story' starts with 'In the beginning'

    FOR doc IN someView SEARCH STARTS_WITH(doc.story, 'In the beginning')
      RETURN DOC

or

    FOR doc IN someView SEARCH STARTS_WITH(doc['story'], 'In the beginning')
      RETURN DOC

to watch the analyzer doing its work

    RETURN TOKENS('a quick brown fox', 'text_en')

to match documents where 'description' best matches 'a quick brown fox'

    FOR doc IN someView SEARCH ANALYZER(doc.description IN TOKENS('a quick brown fox', 'text_en'), 'text_en')
      RETURN doc





ArangoSearch Scorers are special functions that allow to sort documents from a
view by their score regarding the analyzed fields.

Details about their usage in AQL can be found in the
[ArangoSearch `SORT` section](aql/views-arango-search.html#arangosearch-sorting).

- BM25: order results based on the [BM25 algorithm](https://en.wikipedia.org/wiki/Okapi_BM25){:target="_blank"}

- TFIDF: order results based on the [TFIDF algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"}

### `BM25()` - Best Matching 25 Algorithm

IResearch provides a 'bm25' scorer implementing the
[BM25 algorithm](https://en.wikipedia.org/wiki/Okapi_BM25){:target="_blank"}. Optionally, free
parameters **k** and **b** of the algorithm typically using for advanced
optimization can be specified as floating point numbers.

`BM25(doc, k, b)`

- *doc* (document): must be emitted by `FOR doc IN someView`

- *k* (number, _optional_): term frequency, the default is _1.2_. *k*
  calibrates the text term frequency scaling. A *k* value of *0* corresponds to
  a binary model (no term frequency), and a large value corresponds to using raw
  term frequency.

- *b* (number, _optional_): determines the scaling by the total text length, the
  default is _0.75_. *b* determines the scaling by the total text length.
  - b = 1 corresponds to fully scaling the term weight by the total text length
  - b = 0 corresponds to no length normalization.

At the extreme values of the coefficient *b*, BM25 turns into the ranking
functions known as BM11 (for b = 1) and BM15 (for b = 0).

### `TFIDF()` - Term Frequency – Inverse Document Frequency Algorithm

Sorts documents using the
[**term frequency–inverse document frequency** algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"}.

`TFIDF(doc, withNorms)`

- *doc* (document): must be emitted by `FOR doc IN someView`
- *withNorms* (bool, _optional_): specifying whether norms should be used via
  **with-norms**, the default is _false_





ArangoSearch sorting
--------------------

A major feature of ArangoSearch Views is their capability of sorting results
based on the creation-time search conditions and zero or more sorting functions.
The ArangoSearch sorting functions available are `TFIDF()` and `BM25()`.

Note: The first argument to any ArangoSearch sorting function is _always_ the
document emitted by a `FOR` operation over an ArangoSearch View.

Note: An ArangoSearch sorting function is _only_ allowed as an argument to a
`SORT` operation. But they can be mixed with other arguments to `SORT`.

So the following examples are valid:

```js
FOR doc IN someView
    SORT TFIDF(doc)
```

```js
FOR a IN viewA
    FOR b IN viewB
        SORT BM25(a), TFIDF(b)
```

```js
FOR a IN viewA
    FOR c IN someCollection
        FOR b IN viewB
            SORT TFIDF(b), c.name, BM25(a)
```

while these will _not_ work:

```js
FOR doc IN someCollection
    SORT TFIDF(doc) // !!! Error
```
```js
FOR doc IN someCollection
    RETURN BM25(doc) // !!! Error
```
```js
FOR doc IN someCollection
    SORT BM25(doc.someAttr) // !!! Error
```
```js
FOR doc IN someView
    SORT TFIDF("someString") // !!! Error
```
```js
FOR doc IN someView
    SORT BM25({some: obj}) // !!! Error
```

The following sorting methods are available:

### Literal sorting
You can sort documents by simply specifying arbitrary values or expressions, as
you do in other places.

### BM25()

`BM25(doc, k, b)`

- *k* (number, _optional_): calibrates the text term frequency scaling, the default is
_1.2_. A *k* value of _0_ corresponds to a binary model (no term frequency), and a large
value corresponds to using raw term frequency
- *b* (number, _optional_): determines the scaling by the total text length, the default
is _0.75_. At the extreme values of the coefficient *b*, BM25 turns into ranking
functions known as BM11 (for *b* = `1`,  corresponds to fully scaling the term weight by
the total text length) and BM15 (for *b* = `0`, corresponds to no length normalization)

Sorts documents using the [**Best Matching 25** algorithm](https://en.wikipedia.org/wiki/Okapi_BM25){:target="_blank"}.
See the [`BM25()` section in ArangoSearch Scorers](../views-arango-search-scorers.html)
for details.

### TFIDF()

`TFIDF(doc, withNorms)`

- *doc* (document): must be emitted by `FOR doc IN someView`
- *withNorms* (bool, _optional_): specifying whether scores should be
  normalized, the default is _false_

Sorts documents using the
[**term frequency–inverse document frequency** algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"}.
See the
[`TFIDF()` section in ArangoSearch Scorers](../views-arango-search-scorers.html)
for details.


### Sorting examples

to sort documents by the value of the 'name' attribute

    FOR doc IN someView
      SORT doc.name
      RETURN doc

or

    FOR doc IN someView
      SORT doc['name']
      RETURN doc

to sort documents via the
[BM25 algorithm](https://en.wikipedia.org/wiki/Okapi_BM25){:target="_blank"}

    FOR doc IN someView
      SORT BM25(doc)
      RETURN doc

to sort documents via the
[BM25 algorithm](https://en.wikipedia.org/wiki/Okapi_BM25){:target="_blank"}
with 'k' = 1.2 and 'b' = 0.75

    FOR doc IN someView
      SORT BM25(doc, 1.2, 0.75)
      RETURN doc

to sort documents via the
[TFIDF algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"}

    FOR doc IN someView
      SORT TFIDF(doc)
      RETURN doc

to sort documents via the
[TFIDF algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"} with norms

    FOR doc IN someView
      SORT TFIDF(doc, true)
      RETURN doc

to sort documents by value of 'name' and then by the
[TFIDF algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"} where 'name' values are
equivalent

    FOR doc IN someView
      SORT doc.name, TFIDF(doc)
      RETURN doc











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
