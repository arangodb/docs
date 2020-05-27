---
layout: default
description: ArangoSearch is integrated into AQL and used mainly through the use of special functions.
title: ArangoSearch related AQL Functions
redirect_from:
  - /3.7/views-arango-search-scorers.html # 3.4 -> 3.5
  - /3.7/aql/views-arango-search.html # 3.4 -> 3.5
---
ArangoSearch Functions
======================

ArangoSearch AQL functions take either an expression or an
attribute path expression as first argument.

```js
ANALYZER(<expression>, …)
STARTS_WITH(doc.attribute, …)
```

If an expression is expected, it means that search conditions can expressed in
AQL syntax. They are typically function calls to ArangoSearch search functions,
possibly nested and/or using logical operators for multiple conditions.

```js
STARTS_WITH(doc.text, "avoca") OR STARTS_WITH(doc.text, "arang")
```

The default Analyzer that will be used for searching is `"identity"`.
While many ArangoSearch functions accept an Analyzer argument, it is often
easier and cleaner to wrap a search (sub-)expressions with an `ANALYZER()` call
to set the Analyzer for these functions. Their Analyzer argument can then be
left out.

```js
// Analyzer specified in each function call
PHRASE(doc.text, "avocado dish", "text_en") AND PHRASE(doc.text, "lemon", "text_en")

// Analyzer specified using ANALYZER()
ANALYZER(PHRASE(doc.text, "avocado dish") AND PHRASE(doc.text, "lemon")
```

Certain expressions do not require any ArangoSearch functions, such as basic
comparisons. However, the Analyzer used for searching will be `"identity"`
unless `ANALYZER()` is used to set a different one.

```js
// The "identity" Analyzer will be used by default
SEARCH doc.text == "avocado"

// Use the "text_en" Analyzer for searching instead
SEARCH ANALYZER(doc.text == "avocado", "text_en")
```

If an attribute path expressions is needed, then you have to reference a
document object emitted by a View like `FOR doc IN viewName` and then specify
which attribute you want to test for as an unquoted string literal. For example
`doc.attr` or `doc.deeply.nested.attr` but not `"doc.attr"`. You can also use
the bracket notation `doc["attr"]`.

```js
FOR doc IN viewName
  SEARCH STARTS_WITH(doc.deeply.nested["attr"], "avoca")
  RETURN doc
```

Search Functions
----------------

Search functions can be used in a [SEARCH operation](operations-search.html)
to form an ArangoSearch expression to filter a View. The functions control the
ArangoSearch functionality without having a returnable value in AQL.

### ANALYZER()

`ANALYZER(expr, analyzer)`

Sets the Analyzer for the given search expression. The default Analyzer is
`identity` for any ArangoSearch expression. This utility function can be used
to wrap a complex expression to set a particular Analyzer. It also sets it for
all the nested functions which require such an argument to avoid repeating the
Analyzer parameter. If an Analyzer argument is passed to a nested function
regardless, then it takes precedence over the Analyzer set via `ANALYZER()`.

The `TOKENS()` function is an exception. It requires the Analyzer name to be
passed in in all cases even if wrapped in an `ANALYZER()` call, because it is
not an ArangoSearch function but a regular string function which can be used
outside of `SEARCH` operations.

- **expr** (expression): any valid search expression
- **analyzer** (string): name of an [Analyzer](../arangosearch-analyzers.html).
- returns nothing: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

Assuming a View definition with an Analyzer whose name and type is `delimiter`:

```json
{
  "links": {
    "coll": {
      "analyzers": [ "delimiter" ],
      "includeAllFields": true,
    }
  },
  ...
}
```

… with the Analyzer properties `{ "delimiter": "|" }` and an example document
`{ "text": "foo|bar|baz" }` in the collection `coll`, the following query would
return the document:

```js
FOR doc IN viewName
  SEARCH ANALYZER(doc.text == "bar", "delimiter")
  RETURN doc
```

The expression `doc.text == "bar"` has to be wrapped by `ANALYZER()` in order
to set the Analyzer to `delimiter`. Otherwise the expression would be evaluated
with the default `identity` Analyzer. `"foo|bar|baz" == "bar"` would not match,
but the View does not even process the indexed fields with the `identity`
Analyzer. The following query would also return an empty result because of
the Analyzer mismatch:

```js
FOR doc IN viewName
  SEARCH doc.text == "foo|bar|baz"
  //SEARCH ANALYZER(doc.text == "foo|bar|baz", "identity")
  RETURN doc
```

In below query, the search expression is swapped by `ANALYZER()` to set the
`text_en` Analyzer for both `PHRASE()` functions:

```js
FOR doc IN viewName
  SEARCH ANALYZER(PHRASE(doc.text, "foo") OR PHRASE(doc.text, "bar"), "text_en")
  RETURN doc
```

Without the usage of `ANALYZER()`:

```js
FOR doc IN viewName
  SEARCH PHRASE(doc.text, "foo", "text_en") OR PHRASE(doc.text, "bar", "text_en")
  RETURN doc
```

In the following example `ANALYZER()` is used to set the Analyzer `text_en`,
but in the second call to `PHRASE()` a different Analyzer is set (`identity`)
which overrules `ANALYZER()`. Therefore, the `text_en` Analyzer is used to find
the phrase *foo* and the `identity` Analyzer to find *bar*:

```js
FOR doc IN viewName
  SEARCH ANALYZER(PHRASE(doc.text, "foo") OR PHRASE(doc.text, "bar", "identity"), "text_en")
  RETURN doc
```

Despite the wrapping `ANALYZER()` function, the Analyzer name can not be
omitted in calls to the `TOKENS()` function. Both occurrences of `text_en`
are required, to set the Analyzer for the expression `doc.text IN ...` and
for the `TOKENS()` function itself:

```js
FOR doc IN viewName
  SEARCH ANALYZER(doc.text IN TOKENS("foo", "text_en"), "text_en")
  RETURN doc
```

### BOOST()

`BOOST(expr, boost)`

Override boost in the context of a search expression with a specified value,
making it available for scorer functions. By default, the context has a boost
value equal to `1.0`.

- **expr** (expression): any valid search expression
- **boost** (number): numeric boost value
- returns nothing: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

```js
FOR doc IN viewName
  SEARCH ANALYZER(BOOST(doc.text == "foo", 2.5) OR doc.text == "bar", "text_en")
  LET score = BM25(doc)
  SORT score DESC
  RETURN { text: doc.text, score }
```

Assuming a View with the following documents indexed and processed by the
`text_en` Analyzer:

```js
{ "text": "foo bar" }
{ "text": "foo" }
{ "text": "bar" }
{ "text": "foo baz" }
{ "text": "baz" }
```

… the result of above query would be:

```json
[
  {
    "text": "foo bar",
    "score": 2.787301540374756
  },
  {
    "text": "foo baz",
    "score": 1.6895781755447388
  },
  {
    "text": "foo",
    "score": 1.525835633277893
  },
  {
    "text": "bar",
    "score": 0.9913395643234253
  }
]
```

### EXISTS()

{% hint 'info' %}
`EXISTS()` will only match values when the specified attribute has been
processed with the link property **storeValues** set to `"id"` in the
View definition (the default is `"none"`).
{% endhint %}

`EXISTS(path)`

Match documents where the attribute at **path** is present.

- **path** (attribute path expression): the attribute to test in the document
- returns nothing: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

```js
FOR doc IN viewName
  SEARCH EXISTS(doc.text)
  RETURN doc
```

`EXISTS(path, type)`

Match documents where the attribute at **path** is present _and_ is of the
specified data type.

- **path** (attribute path expression): the attribute to test in the document
- **type** (string): data type to test for, can be one of:
    - `"null"`
    - `"bool"` / `"boolean"`
    - `"numeric"`
    - `"string"`
    - `"analyzer"` (see below)
- returns nothing: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

```js
FOR doc IN viewName
  SEARCH EXISTS(doc.text, "string")
  RETURN doc
```

`EXISTS(path, "analyzer", analyzer)`

Match documents where the attribute at **path** is present _and_ was indexed
by the specified **analyzer**.

- **path** (attribute path expression): the attribute to test in the document
- **type** (string): string literal `"analyzer"`
- **analyzer** (string, _optional_): name of an [Analyzer](../arangosearch-analyzers.html).
  Uses the Analyzer of a wrapping `ANALYZER()` call if not specified or
  defaults to `"identity"`
- returns nothing: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

```js
FOR doc IN viewName
  SEARCH EXISTS(doc.text, "analyzer", "text_en")
  RETURN doc
```

### IN_RANGE()

`IN_RANGE(path, low, high, includeLow, includeHigh)`

Match documents where the attribute at **path** is greater than (or equal to)
**low** and less than (or equal to) **high**.

*low* and *high* can be numbers or strings (technically also `null`, `true`
and `false`), but the data type must be the same for both.

{% hint 'warning' %}
The alphabetical order of characters is not taken into account by ArangoSearch,
i.e. range queries in SEARCH operations against Views will not follow the
language rules as per the defined Analyzer locale nor the server language
(startup option `--default-language`)!
Also see [Known Issues](../release-notes-known-issues35.html#arangosearch).
{% endhint %}

- **path** (attribute path expression):
  the path of the attribute to test in the document
- **low** (number\|string): minimum value of the desired range
- **high** (number\|string): maximum value of the desired range
- **includeLow** (bool): whether the minimum value shall be included in
  the range (left-closed interval) or not (left-open interval)
- **includeHigh** (bool): whether the maximum value shall be included in
  the range (right-closed interval) or not (right-open interval)
- returns nothing: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

If *low* and *high* are the same, but *includeLow* and/or *includeHigh* is set
to `false`, then nothing will match. If *low* is greater than *high* nothing will
match either.

To match documents with the attribute `value >= 3` and `value <= 5` using the
default `"identity"` Analyzer you would write the following query:

```js
FOR doc IN viewName
  SEARCH IN_RANGE(doc.value, 3, 5, true, true)
  RETURN doc.value
```

This will also match documents which have an array of numbers as `value`
attribute where at least one of the numbers is in the specified boundaries.

Using string boundaries and a text Analyzer allows to match documents which
have at least one token within the specified character range:

```js
FOR doc IN valView
  SEARCH ANALYZER(IN_RANGE(doc.value, "a","f", true, false), "text_en")
  RETURN doc
```

This will match `{ "value": "bar" }` and `{ "value": "foo bar" }` because the
_b_ of _bar_ is in the range (`"a" <= "b" < "f"`), but not `{ "value": "foo" }`
because the _f_ of _foo_ is excluded (*high* is "f" but *includeHigh* is false).

### MIN_MATCH()

`MIN_MATCH(expr1, ... exprN, minMatchCount)`

Match documents where at least **minMatchCount** of the specified
search expressions are satisfied.

- **expr** (expression, _repeatable_): any valid search expression
- **minMatchCount** (number): minimum number of search expressions that should
  be satisfied
- returns nothing: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

Assuming a View with a text Analyzer, you may use it to match documents where
the attribute contains at least two out of three tokens:

```js
FOR doc IN viewName
  SEARCH ANALYZER(MIN_MATCH(doc.text == 'quick', doc.text == 'brown', doc.text == 'fox', 2), "text_en")
  RETURN doc.text
```

This will match `{ "text": "the quick brown fox" }` and `{ "text": "some brown fox" }`,
but not `{ "text": "snow fox" }` which only fulfills one of the conditions.

### NGRAM_MATCH()

<small>Introduced in: v3.7.0</small>

`NGRAM_MATCH(path, target, threshold, analyzer)`

Match documents whose attribute value has an
[ngram similarity](https://webdocs.cs.ualberta.ca/~kondrak/papers/spire05.pdf){:target="_blank"}
higher than the specified threshold compared to the target value.

The similarity is calculated by counting how long the longest sequence of
matching ngrams is, divided by the target's total ngram count.
Only fully matching ngrams are counted.

The ngrams for both attribute and target are produced by the specified
Analyzer. It is recommended to use an Analyzer of type `ngram` with
`preserveOriginal: false` and `min` equal to `max`. Increasing the ngram
length will increase accuracy, but reduce error tolerance. In most cases a
size of 2 or 3 will be a good choice. 

{% hint 'info' %}
The selected Analyzer must have the `"position"` and `"frequency"` features
enabled. The `NGRAM_MATCH()` function will otherwise not find anything.
{% endhint %}

- **path** (attribute path expression\|string): the path of the attribute in
  a document or a string
- **target** (string): the string to compare against the stored attribute
- **threshold** (number, _optional_): value between `0.0` and `1.0`. Defaults
  to `0.7` if none is specified.
- **analyzer** (string): name of an [Analyzer](../arangosearch-analyzers.html).
- returns nothing: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

Given a View indexing an attribute `text`, a custom ngram Analyzer `"bigram"`
(`min: 2, max: 2, preserveOriginal: false, streamType: "utf8"`) and a document
`{ "text": "quick red fox" }`, the following query would match it (with a
threshold of `1.0`):

```js
FOR doc IN viewName
  SEARCH NGRAM_MATCH(doc.text, "quick fox", "bigram")
  RETURN doc.text
```

The following will also match (note the low threshold value):

```js
FOR doc IN viewName
  SEARCH NGRAM_MATCH(doc.text, "quick blue fox", 0.4, "bigram")
  RETURN doc.text
```

The following will not match (note the high threshold value):

```js
FOR doc IN viewName
  SEARCH NGRAM_MATCH(doc.text, "quick blue fox", 0.9, "bigram")
  RETURN doc.text
```

`NGRAM_MATCH()` can be called with constant arguments, but for such calls the
*analyzer* argument is mandatory (even for calls inside of a `SEARCH` clause):

```js
FOR doc IN viewName
  SEARCH NGRAM_MATCH("quick fox", "quick blue fox", 0.9, "bigram")
  RETURN doc.text
```

```js
RETURN NGRAM_MATCH("quick fox", "quick blue fox", "bigram")
```

### NGRAM_POSITIONAL_SIMILARITY()

See [String Functions](functions-arangosearch.html#ngram_positional_similarity).

### NGRAM_SIMILARITY()


See [String Functions](functions-arangosearch.html#ngram_similarity).

### PHRASE()

`PHRASE(path, phrasePart, analyzer)`

`PHRASE(path, phrasePart1, skipTokens1, ... phrasePartN, skipTokensN, analyzer)`

Search for a phrase in the referenced attribute. It only matches documents in
which the tokens appear in the specified order. To search for tokens in any
order use [TOKENS()](#tokens) instead.

The phrase can be expressed as an arbitrary number of *phraseParts* separated by
*skipTokens* number of tokens (wildcards), either as separate arguments or as
array as second argument.

- **path** (attribute path expression): the attribute to test in the document
- **phrasePart** (string\|array\|object): text to search for in the tokens.
  Can also be an array comprised of string, array and object tokens (object
  tokens introduced in v3.7.0, see below) or tokens interleaved with numbers of
  *skipTokens* (introduced in v3.6.0). The specified *analyzer* is applied to
  string and array tokens, but not for object tokens.
- **skipTokens** (number, _optional_): amount of tokens to treat
  as wildcards
- **analyzer** (string, _optional_): name of an [Analyzer](../arangosearch-analyzers.html).
  Uses the Analyzer of a wrapping `ANALYZER()` call if not specified or
  defaults to `"identity"`
- returns nothing: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

{% hint 'info' %}
The selected Analyzer must have the `"position"` and `"frequency"` features
enabled. The `PHRASE()` function will otherwise not find anything.
{% endhint %}

Object tokens:

- `{IN_RANGE: [low, high, includeLow, includeHigh]}`:
  see [IN_RANGE()](#in_range). *low* and *high* can only be strings.
- `{LEVENSHTEIN_MATCH: [token, maxDistance, withTranspositions, maxTerms]}`:
  - `token` (string): a string to search
  - `maxDistance` (number): maximum Levenshtein / Damerau-Levenshtein distance
  - `withTranspositions` (bool, _optional_): whether Damerau-Levenshtein
    distance should be used. The default value is `false` (Levenshtein distance).
  - `maxTerms` (number, _optional_): consider only a specified number of the
    most relevant terms. One can pass `0` to consider all matched terms, but it may
    impact performance negatively. The default value is `64`.
- `{STARTS_WITH: [prefix]}`: see [STARTS_WITH()](#starts_with).
  Array brackets are optional
- `{TERM: [token]}`: equal to `token` but without Analyzer tokenization.
  Array brackets are optional
- `{TERMS: [token1, ..., tokenN]}`: one of `token1, ..., tokenN` can be found
  in specified position. Inside an array the object syntax can be replaced with
  the object field value, e.g., `[..., [token1, ..., tokenN], ...]`.
- `{WILDCARD: [token]}`: see [LIKE()](#like).
  Array brackets are optional

An array token inside an array can be used in the `TERMS` case only.

Given a View indexing an attribute *text* with the `"text_en"` Analyzer and a
document `{ "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit" }`,
the following query would match it:

```js
FOR doc IN viewName
  SEARCH PHRASE(doc.text, "lorem ipsum", "text_en")
  RETURN doc.text
```

However, this search expression does not because the tokens `"ipsum"` and
`"lorem"` do not appear in this order:

```js
PHRASE(doc.text, "ipsum lorem", "text_en")
```

To match `"ipsum"` and `"amet"` with any two tokens in between, you can use the
following search expression:

```js
PHRASE(doc.text, "ipsum", 2, "amet", "text_en")
```

The *skipTokens* value of `2` defines how many wildcard tokens have to appear
between *ipsum* and *amet*. A *skipTokens* value of `0` means that the tokens
must be adjacent. Negative values are allowed, but not very useful. These three
search expressions are equivalent:

```js
PHRASE(doc.text, "lorem ipsum", "text_en")
PHRASE(doc.text, "lorem", 0, "ipsum", "text_en")
PHRASE(doc.text, "ipsum", -1, "lorem", "text_en")
```

`PHRASE(path, [ phrasePart1, skipTokens1, ... phrasePartN, skipTokensN ], analyzer)`

The `PHRASE()` function also accepts an array as second argument with
*phrasePart* and *skipTokens* parameters as elements.

```js
FOR doc IN myView SEARCH PHRASE(doc.title, ["quick brown fox"], "text_en") RETURN doc
FOR doc IN myView SEARCH PHRASE(doc.title, ["quick", "brown", "fox"], "text_en") RETURN doc
```

This syntax variation enables the usage of computed expressions:

```js
LET proximityCondition = [ "foo", ROUND(RAND()*10), "bar" ]
FOR doc IN viewName
  SEARCH PHRASE(doc.text, proximityCondition, "text_en")
  RETURN doc
```

```js
LET tokens = TOKENS("quick brown fox", "text_en") // ["quick", "brown", "fox"]
FOR doc IN myView SEARCH PHRASE(doc.title, tokens, "text_en") RETURN doc
```

Above example is equivalent to the more cumbersome and static form:

```js
FOR doc IN myView SEARCH PHRASE(doc.title, "quick", 0, "brown", 0, "fox", "text_en") RETURN doc
```

You can optionally specify the number of skipTokens in the array form before
every string element:

```js
FOR doc IN myView SEARCH PHRASE(doc.title, ["quick", 1, "fox", "jumps"], "text_en") RETURN doc
```

It is the same as the following:

```js
FOR doc IN myView SEARCH PHRASE(doc.title, "quick", 1, "fox", 0, "jumps", "text_en") RETURN doc
```

Using object tokens `STARTS_WITH`, `WILDCARD`, `LEVENSHTEIN_MATCH`, `TERMS` and
`IN_RANGE`:

```js
FOR doc IN myView SEARCH PHRASE(doc.title,
  {STARTS_WITH: ["qui"]}, 0,
  {WILDCARD: ["b%o_n"]}, 0,
  {LEVENSHTEIN_MATCH: ["foks", 2]}, 0,
  {TERMS: ["jump", "run"]}, 0, // Analyzer not applied!
  {IN_RANGE: ["over", "through", true, false]},
  "text_en") RETURN doc
```

Note that the `text_en` Analyzer has stemming enabled, but for object tokens
the Analyzer isn't applied. `{TERMS: ["jumps", "runs"]}` would not match the
indexed (and stemmed!) attribute value. Therefore, the trailing `s` which would
be stemmed away is removed from both words manually in the example.

Above example is equivalent to:

```js
FOR doc IN myView SEARCH PHRASE(doc.title,
[
  {STARTS_WITH: "qui"}, 0,
  {WILDCARD: "b%o_n"}, 0,
  {LEVENSHTEIN_MATCH: ["foks", 2]}, 0,
  ["jumps", "runs"], 0, // Analyzer is applied using this syntax
  {IN_RANGE: ["over", "through", true, false]}
], "text_en") RETURN doc
```

### STARTS_WITH()

`STARTS_WITH(path, prefix)`

Match the value of the attribute that starts with *prefix*. If the attribute
is processed by a tokenizing Analyzer (type `"text"` or `"delimiter"`) or if it
is an array, then a single token/element starting with the prefix is sufficient
to match the document.

{% hint 'warning' %}
The alphabetical order of characters is not taken into account by ArangoSearch,
i.e. range queries in SEARCH operations against Views will not follow the
language rules as per the defined Analyzer locale nor the server language
(startup option `--default-language`)!
Also see [Known Issues](../release-notes-known-issues35.html#arangosearch).
{% endhint %}

- **path** (attribute path expression): the path of the attribute to compare
  against in the document
- **prefix** (string): a string to search at the start of the text
- returns nothing: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

`STARTS_WITH(path, prefixes, minMatchCount)`

<small>Introduced in: v3.7.1</small>

Match the value of the attribute that starts with one of the *prefixes*, or
optionally with at least *minMatchCount* of the prefixes.

- **path** (attribute path expression): the path of the attribute to compare
  against in the document
- **prefixes** (array): an array of strings to search at the start of the text
- **minMatchCount** (number, _optional_): minimum number of search prefixes
  that should be satisfied. The default is `1`
- returns nothing: the function can only be called in a
  [SEARCH operation](operations-search.html) and throws an error otherwise

To match a document `{ "text": "lorem ipsum..." }` using a prefix and the
`"identity"` Analyzer you can use it like this:

```js
FOR doc IN viewName
  SEARCH STARTS_WITH(doc.text, "lorem ip")
  RETURN doc
```

This query will match `{ "text": "lorem ipsum" }` as well as
`{ "text": [ "lorem", "ipsum" ] }` given a View which indexes the `text`
attribute and processes it with the `"text_en"` Analyzer:

```js
FOR doc IN viewName
  SEARCH ANALYZER(STARTS_WITH(doc.text, "ips"), "text_en")
  RETURN doc.text
```

For `{ "text": "lorem ipsum" }` it is the same as the following:

```js
FOR doc IN viewName
  SEARCH ANALYZER(STARTS_WITH(doc.text, ["wrong", "ips"], 1), "text_en")
  RETURN doc.text
```

Or the following:

```js
FOR doc IN viewName
  SEARCH ANALYZER(STARTS_WITH(doc.text, ["lo", "ips", "other"], 2), "text_en")
  RETURN doc.text
```

Note that it will not match `{ "text": "IPS (in-plane switching)" }` without
modification to the query. The prefixes were passed to `STARTS_WITH()` as-is,
but the Analyzer used for indexing has stemming enabled. So the indexes values
are the following:

```js
RETURN TOKENS("IPS (in-plane switching)", "text_en")
```

```json
[
  [
    "ip",
    "in",
    "plane",
    "switch"
  ]
]
```

The *s* is removed from *ips*, which leads to the prefix *ips* not matching
the indexed token *ip*. You may either create a custom text Analyzer with
stemming disabled to avoid this issue, or apply stemming to the prefixes:

```js
FOR doc IN viewName
  SEARCH ANALYZER(STARTS_WITH(doc.text, TOKENS("ips", "text_en")), "text_en")
  RETURN doc.text
```

### LEVENSHTEIN_MATCH()

<small>Introduced in: v3.7.0</small>

`LEVENSHTEIN_MATCH(path, target, distance, transpositions, maxTerms)`

Match documents with a [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance){:target=_"blank"}
lower than or equal to *distance* between the stored attribute value and
*target*. It can optionally take transpositions into account
(Damerau-Levenshtein distance).

See [LEVENSHTEIN_DISTANCE()](functions-string.html#levenshtein_distance)
if you want to calculate the edit distance of two strings.

- **path** (attribute path expression): the path of the attribute to compare
  against in the document
- **target** (string): the string to compare against the stored attribute
- **distance** (number): the maximum edit distance, which can be between
  `0` and `4` if *transpositions* is `false`, and between `0` and `3` if
  it is `true`
- **transpositions** (bool, _optional_): compute Damerau-Levenshtein distance
  if set to `true`, otherwise Levenshtein distance will be computed (default)
- **maxTerms** (number, _optional_): consider only a specified number of the
  most relevant terms. One can pass `0` to consider all matched terms, but it may
  impact performance negatively. The default value is `64`.

The Levenshtein distance between _quick_ and _quikc_ is `2` because it requires
two operations to go from one to the other (remove _k_, insert _k_ at a
different position).

```js
FOR doc IN viewName
  SEARCH LEVENSHTEIN_MATCH(doc.text, "quikc", 2) // matches "quick"
  RETURN doc.text
```

The Damerau-Levenshtein distance is `1` (move _c_ to the end).

```js
FOR doc IN viewName
  SEARCH LEVENSHTEIN_MATCH(doc.text, "quikc", 1, true) // matches "quick"
  RETURN doc.text
```

You may want to pick the maximum edit distance based on string length.
If the stored attribute is the string _quick_ and the target string is
_quicksands_, then the Levenshtein distance is 5, with 50% of the
characters mismatching. If the inputs are _q_ and _qu_, then the distance
is only 1, although it is also a 50% mismatch.

```js
LET target = "input"
LET targetLength = LENGTH(target)
LET maxDistance = (targetLength > 5 ? 2 : (targetLength >= 3 ? 1 : 0))
FOR doc IN viewName
  SEARCH LEVENSHTEIN_MATCH(doc.text, target, false, maxDistance)
  RETURN doc.text
```

### LIKE()

<small>Introduced in: v3.7.0</small>

`LIKE(path, search)`

Check whether the pattern *search* is contained in the attribute denoted by *path*,
using wildcard matching.

- **path** (attribute path expression): the path of the attribute to compare
  against in the document
- **search** (string): a search pattern that can contain the wildcard characters
  `%` (meaning any sequence of characters, including none) and `_` (any single
  character). Literal `%` and `_` must be escaped with two backslashes (four
  in arangosh).

```js
FOR doc IN viewName
  SEARCH ANALYZER(LIKE(doc.text, "foo%b_r"), "text_en")
  RETURN doc.text
```

`LIKE` can also be used in operator form:

```js
FOR doc IN viewName
  SEARCH ANALYZER(doc.text LIKE "foo%b_r", "text_en")
  RETURN doc.text
```

### TOKENS()

See [String Functions](functions-string.html#tokens).

Scoring Functions
-----------------

Scoring functions return a ranking value for the documents found by a
[SEARCH operation](operations-search.html). The better the documents match
the search expression the higher the returned number.

The first argument to any scoring function is always the document emitted by
a `FOR` operation over an ArangoSearch View.

To sort the result set by relevance, with the more relevant documents coming
first, sort in **descending order** by the score (e.g. `SORT BM25(...) DESC`).

You may calculate custom scores based on a scoring function using document
attributes and numeric functions (e.g. `TFIDF(doc) * LOG(doc.value)`):

```js
FOR movie IN imdbView
  SEARCH PHRASE(movie.title, "Star Wars", "text_en")
  SORT BM25(movie) * LOG(movie.runtime + 1) DESC
  RETURN movie
```

Sorting by more than one score is allowed. You may also sort by a mix of
scores and attributes from multiple Views as well as collections:

```js
FOR a IN viewA
  FOR c IN coll
    FOR b IN viewB
      SORT TFIDF(b), c.name, BM25(a)
      ...
```

### BM25()

`BM25(doc, k, b) → score`

Sorts documents using the
[**Best Matching 25** algorithm](https://en.wikipedia.org/wiki/Okapi_BM25){:target="_blank"}
(BM25).

- **doc** (document): must be emitted by `FOR ... IN viewName`
- **k** (number, _optional_): calibrates the text term frequency scaling.
  The default is `1.2`. A *k* value of `0` corresponds to a binary model
  (no term frequency), and a large value corresponds to using raw term frequency
- **b** (number, _optional_): determines the scaling by the total text length.
  The default is `0.75`. At the extreme values of the coefficient *b*, BM25
  turns into the ranking functions known as:
  - BM11 for *b* = `1` (corresponds to fully scaling the term weight by the
    total text length)
  - BM15 for *b* = `0` (corresponds to no length normalization)
- returns **score** (number): computed ranking value

Sorting by relevance with BM25 at default settings:

```js
FOR doc IN viewName
  SEARCH ...
  SORT BM25(doc) DESC
  RETURN doc
```

Sorting by relevance, with double-weighted term frequency and with full text
length normalization:

```js
FOR doc IN viewName
  SEARCH ...
  SORT BM25(doc, 2.4, 1) DESC
  RETURN doc
```

### TFIDF()

`TFIDF(doc, normalize) → score`

Sorts documents using the
[**term frequency–inverse document frequency** algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"}
(TF-IDF).

- **doc** (document): must be emitted by `FOR ... IN viewName`
- **normalize** (bool, _optional_): specifies whether scores should be
  normalized. The default is *false*.
- returns **score** (number): computed ranking value

Sort by relevance using the TF-IDF score:

```js
FOR doc IN viewName
  SEARCH ...
  SORT TFIDF(doc) DESC
  RETURN doc
```

Sort by relevance using a normalized TF-IDF score:

```js
FOR doc IN viewName
  SEARCH ...
  SORT TFIDF(doc, true) DESC
  RETURN doc
```

Sort by the value of the `text` attribute in ascending order, then by the TFIDF
score in descending order where the attribute values are equivalent:

```js
FOR doc IN viewName
  SEARCH ...
  SORT doc.text, TFIDF(doc) DESC
  RETURN doc
```
