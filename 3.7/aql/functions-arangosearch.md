---
layout: default
description: ArangoSearch offers various AQL functions for search queries to control the search context, for filtering and scoring
title: ArangoSearch related AQL Functions
page-toc:
  max-headline-level: 3
redirect_from:
  - ../views-arango-search-scorers.html # 3.4 -> 3.5
  - views-arango-search.html # 3.4 -> 3.5
---
ArangoSearch Functions
======================

{{ page.description }}
{:class="lead"}

You can form search expressions to filter Views by composing ArangoSearch
function calls, logical operators and comparison operators.

The AQL [`SEARCH` operation](operations-search.html) accepts search expressions
such as `ANALYZER(PHRASE(doc.text, "foo bar"), "text_en")`. You can
combine filter and context functions as well as operators like `AND` and `OR`
to form complex search conditions.

Scoring functions allow you to rank matches and to sort results by relevance.

Most functions can also be used without a View and the `SEARCH` keyword, but
will then not be accelerated by a View index.

See [Information Retrieval with ArangoSearch](../arangosearch.html) for an
introduction.

Context Functions
-----------------

### ANALYZER()

`ANALYZER(expr, analyzer) → retVal`

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
- **analyzer** (string): name of an [Analyzer](../analyzers.html).
- returns **retVal** (any): the expression result that it wraps

#### Example: Using a custom Analyzer

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

#### Example: Setting the Analyzer context with and without `ANALYZER()`

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

#### Example: Analyzer precedence and specifics of the `TOKENS()` function

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
for the `TOKENS()` function itself. This is because the `TOKENS()` function
is a regular string function that does not take the Analyzer context into
account:

```js
FOR doc IN viewName
  SEARCH ANALYZER(doc.text IN TOKENS("foo", "text_en"), "text_en")
  RETURN doc
```

### BOOST()

`BOOST(expr, boost) → retVal`

Override boost in the context of a search expression with a specified value,
making it available for scorer functions. By default, the context has a boost
value equal to `1.0`.

- **expr** (expression): any valid search expression
- **boost** (number): numeric boost value
- returns **retVal** (any): the expression result that it wraps

#### Example: Boosting a search sub-expression

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

Filter Functions
----------------

### EXISTS()

{% hint 'info' %}
`EXISTS()` will only match values when the specified attribute has been
processed with the link property **storeValues** set to `"id"` in the
View definition (the default is `"none"`).
{% endhint %}

#### Testing for attribute presence

`EXISTS(path)`

Match documents where the attribute at **path** is present.

- **path** (attribute path expression): the attribute to test in the document
- returns nothing: the function evaluates to a boolean, but this value cannot be
  returned. The function can only be called in a search expression. It throws
  an error if used outside of a [SEARCH operation](operations-search.html).

```js
FOR doc IN viewName
  SEARCH EXISTS(doc.text)
  RETURN doc
```

#### Testing for attribute type

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
- returns nothing: the function evaluates to a boolean, but this value cannot be
  returned. The function can only be called in a search expression. It throws
  an error if used outside of a [SEARCH operation](operations-search.html).

```js
FOR doc IN viewName
  SEARCH EXISTS(doc.text, "string")
  RETURN doc
```

#### Testing for Analyzer index status

`EXISTS(path, "analyzer", analyzer)`

Match documents where the attribute at **path** is present _and_ was indexed
by the specified **analyzer**.

- **path** (attribute path expression): the attribute to test in the document
- **type** (string): string literal `"analyzer"`
- **analyzer** (string, _optional_): name of an [Analyzer](../analyzers.html).
  Uses the Analyzer of a wrapping `ANALYZER()` call if not specified or
  defaults to `"identity"`
- returns nothing: the function evaluates to a boolean, but this value cannot be
  returned. The function can only be called in a search expression. It throws
  an error if used outside of a [SEARCH operation](operations-search.html).

```js
FOR doc IN viewName
  SEARCH EXISTS(doc.text, "analyzer", "text_en")
  RETURN doc
```

### IN_RANGE()

`IN_RANGE(path, low, high, includeLow, includeHigh) → included`

Match documents where the attribute at **path** is greater than (or equal to)
**low** and less than (or equal to) **high**.

You can use `IN_RANGE()` for searching more efficiently compared to an equivalent
expression that combines two comparisons with a logical conjunction:

- `IN_RANGE(path, low, high, true, true)` instead of `low <= value AND value <= high`
- `IN_RANGE(path, low, high, true, false)` instead of `low <= value AND value < high`
- `IN_RANGE(path, low, high, false, true)` instead of `low < value AND value <= high`
- `IN_RANGE(path, low, high, false, false)` instead of `low < value AND value < high`

*low* and *high* can be numbers or strings (technically also `null`, `true`
and `false`), but the data type must be the same for both.

{% hint 'warning' %}
The alphabetical order of characters is not taken into account by ArangoSearch,
i.e. range queries in SEARCH operations against Views will not follow the
language rules as per the defined Analyzer locale nor the server language
(startup option `--default-language`)!
Also see [Known Issues](../release-notes-known-issues37.html#arangosearch).
{% endhint %}

There is a corresponding [`IN_RANGE()` Miscellaneous Function](functions-miscellaneous.html#in_range)
that is used outside of `SEARCH` operations.

- **path** (attribute path expression):
  the path of the attribute to test in the document
- **low** (number\|string): minimum value of the desired range
- **high** (number\|string): maximum value of the desired range
- **includeLow** (bool): whether the minimum value shall be included in
  the range (left-closed interval) or not (left-open interval)
- **includeHigh** (bool): whether the maximum value shall be included in
  the range (right-closed interval) or not (right-open interval)
- returns **included** (bool): whether *value* is in the range

If *low* and *high* are the same, but *includeLow* and/or *includeHigh* is set
to `false`, then nothing will match. If *low* is greater than *high* nothing will
match either.

#### Example: Using numeric ranges

To match documents with the attribute `value >= 3` and `value <= 5` using the
default `"identity"` Analyzer you would write the following query:

```js
FOR doc IN viewName
  SEARCH IN_RANGE(doc.value, 3, 5, true, true)
  RETURN doc.value
```

This will also match documents which have an array of numbers as `value`
attribute where at least one of the numbers is in the specified boundaries.

#### Example: Using string ranges

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

`MIN_MATCH(expr1, ... exprN, minMatchCount) → fulfilled`

Match documents where at least **minMatchCount** of the specified
search expressions are satisfied.

There is a corresponding [`MIN_MATCH()` Miscellaneous function](functions-miscellaneous.html#min_match)
that is used outside of `SEARCH` operations.

- **expr** (expression, _repeatable_): any valid search expression
- **minMatchCount** (number): minimum number of search expressions that should
  be satisfied
- returns **fulfilled** (bool): whether at least **minMatchCount** of the
  specified expressions are `true`

#### Example: Matching a subset of search sub-expressions

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

`NGRAM_MATCH(path, target, threshold, analyzer) → fulfilled`

Match documents whose attribute value has an
[_n_-gram similarity](https://webdocs.cs.ualberta.ca/~kondrak/papers/spire05.pdf){:target="_blank"}
higher than the specified threshold compared to the target value.

The similarity is calculated by counting how long the longest sequence of
matching _n_-grams is, divided by the target's total _n_-gram count.
Only fully matching _n_-grams are counted.

The _n_-grams for both attribute and target are produced by the specified
Analyzer. Increasing the _n_-gram length will increase accuracy, but reduce
error tolerance. In most cases a size of 2 or 3 will be a good choice.

{% hint 'info' %}
Use an Analyzer of type `ngram` with `preserveOriginal: false` and `min` equal
to `max`. Otherwise, the similarity score calculated internally will be lower
than expected.

The Analyzer must have the `"position"` and `"frequency"` features enabled or
the `NGRAM_MATCH()` function will not find anything.
{% endhint %}

Also see the String Functions
[`NGRAM_POSITIONAL_SIMILARITY()`](functions-string.html#ngram_positional_similarity)
and [`NGRAM_SIMILARITY()`](functions-string.html#ngram_similarity)
for calculating _n_-gram similarity that cannot be accelerated by a View index.

- **path** (attribute path expression\|string): the path of the attribute in
  a document or a string
- **target** (string): the string to compare against the stored attribute
- **threshold** (number, _optional_): value between `0.0` and `1.0`. Defaults
  to `0.7` if none is specified.
- **analyzer** (string): name of an [Analyzer](../analyzers.html).
- returns **fulfilled** (bool): `true` if the evaluated _n_-gram similarity value
  is greater or equal than the specified threshold, `false` otherwise

#### Example: Using a custom bigram Analyzer

Given a View indexing an attribute `text`, a custom _n_-gram Analyzer `"bigram"`
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

#### Example: Using constant values

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

### PHRASE()

`PHRASE(path, phrasePart, analyzer)`

`PHRASE(path, phrasePart1, skipTokens1, ... phrasePartN, skipTokensN, analyzer)`

`PHRASE(path, [ phrasePart1, skipTokens1, ... phrasePartN, skipTokensN ], analyzer)`

Search for a phrase in the referenced attribute. It only matches documents in
which the tokens appear in the specified order. To search for tokens in any
order use [`TOKENS()`](functions-string.html#tokens) instead.

The phrase can be expressed as an arbitrary number of *phraseParts* separated by
*skipTokens* number of tokens (wildcards), either as separate arguments or as
array as second argument.

- **path** (attribute path expression): the attribute to test in the document
- **phrasePart** (string\|array\|object): text to search for in the tokens.
  Can also be an [array](#example-using-phrase-with-an-array-of-tokens)
  comprised of string, array and [object tokens](#object-tokens), or tokens
  interleaved with numbers of *skipTokens*. The specified *analyzer* is applied
  to string and array tokens, but not for object tokens.
- **skipTokens** (number, _optional_): amount of tokens to treat
  as wildcards (introduced in v3.6.0)
- **analyzer** (string, _optional_): name of an [Analyzer](../analyzers.html).
  Uses the Analyzer of a wrapping `ANALYZER()` call if not specified or
  defaults to `"identity"`
- returns nothing: the function evaluates to a boolean, but this value cannot be
  returned. The function can only be called in a search expression. It throws
  an error if used outside of a [SEARCH operation](operations-search.html).

{% hint 'info' %}
The selected Analyzer must have the `"position"` and `"frequency"` features
enabled. The `PHRASE()` function will otherwise not find anything.
{% endhint %}

#### Object tokens

<small>Introduced in v3.7.0</small>

- `{IN_RANGE: [low, high, includeLow, includeHigh]}`:
  see [IN_RANGE()](#in_range). *low* and *high* can only be strings.
- `{LEVENSHTEIN_MATCH: [token, maxDistance, transpositions, maxTerms, prefix]}`:
  - `token` (string): a string to search
  - `maxDistance` (number): maximum Levenshtein / Damerau-Levenshtein distance
  - `transpositions` (bool, _optional_): if set to `false`, a Levenshtein
    distance is computed, otherwise a Damerau-Levenshtein distance (default)
  - `maxTerms` (number, _optional_): consider only a specified number of the
    most relevant terms. One can pass `0` to consider all matched terms, but it may
    impact performance negatively. The default value is `64`.
  - `prefix` (string, _optional_): if defined, then a search for the exact
    prefix is carried out, using the matches as candidates. The Levenshtein /
    Damerau-Levenshtein distance is then computed for each candidate using the
    remainders of the strings. This option can improve performance in cases where
    there is a known common prefix. The default value is an empty string
    (introduced in v3.7.13, v3.8.1).
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

Also see [Example: Using object tokens](#example-using-object-tokens).

#### Example: Using a text Analyzer for a phrase search

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

#### Example: Skip tokens for a proximity search

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

#### Example: Using `PHRASE()` with an array of tokens

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

#### Example: Handling of arrays with no members

Empty arrays are skipped:

```js
FOR doc IN myView SEARCH PHRASE(doc.title, "quick", 1, [], 1, "jumps", "text_en") RETURN doc
```

The query is equivalent to:

```js
FOR doc IN myView SEARCH PHRASE(doc.title, "quick", 2 "jumps", "text_en") RETURN doc
```

Providing only empty arrays is valid, but will yield no results.

#### Example: Using object tokens

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

`STARTS_WITH(path, prefix) → startsWith`

Match the value of the attribute that starts with *prefix*. If the attribute
is processed by a tokenizing Analyzer (type `"text"` or `"delimiter"`) or if it
is an array, then a single token/element starting with the prefix is sufficient
to match the document.

{% hint 'warning' %}
The alphabetical order of characters is not taken into account by ArangoSearch,
i.e. range queries in SEARCH operations against Views will not follow the
language rules as per the defined Analyzer locale nor the server language
(startup option `--default-language`)!
Also see [Known Issues](../release-notes-known-issues37.html#arangosearch).
{% endhint %}

There is a corresponding [`STARTS_WITH()` String function](functions-string.html#starts_with)
that is used outside of `SEARCH` operations.

- **path** (attribute path expression): the path of the attribute to compare
  against in the document
- **prefix** (string): a string to search at the start of the text
- returns **startsWith** (bool): whether the specified attribute starts with
  the given prefix

---

`STARTS_WITH(path, prefixes, minMatchCount) → startsWith`

<small>Introduced in: v3.7.1</small>

Match the value of the attribute that starts with one of the *prefixes*, or
optionally with at least *minMatchCount* of the prefixes.

- **path** (attribute path expression): the path of the attribute to compare
  against in the document
- **prefixes** (array): an array of strings to search at the start of the text
- **minMatchCount** (number, _optional_): minimum number of search prefixes
  that should be satisfied (see
  [example](#example-searching-for-one-or-multiple-prefixes)). The default is `1`
- returns **startsWith** (bool): whether the specified attribute starts with at
  least *minMatchCount* of the given prefixes

#### Example: Searching for an exact value prefix

To match a document `{ "text": "lorem ipsum..." }` using a prefix and the
`"identity"` Analyzer you can use it like this:

```js
FOR doc IN viewName
  SEARCH STARTS_WITH(doc.text, "lorem ip")
  RETURN doc
```

#### Example: Searching for a prefix in text

This query will match `{ "text": "lorem ipsum" }` as well as
`{ "text": [ "lorem", "ipsum" ] }` given a View which indexes the `text`
attribute and processes it with the `"text_en"` Analyzer:

```js
FOR doc IN viewName
  SEARCH ANALYZER(STARTS_WITH(doc.text, "ips"), "text_en")
  RETURN doc.text
```

Note that it will not match `{ "text": "IPS (in-plane switching)" }` without
modification to the query. The prefixes were passed to `STARTS_WITH()` as-is,
but the built-in `text_en` Analyzer used for indexing has stemming enabled.
So the indexed values are the following:

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

#### Example: Searching for one or multiple prefixes

The `STARTS_WITH()` function accepts an array of prefix alternatives of which
only one has to match:

```js
FOR doc IN viewName
  SEARCH ANALYZER(STARTS_WITH(doc.text, ["something", "ips"]), "text_en")
  RETURN doc.text
```

It will match a document `{ "text": "lorem ipsum" }` but also
`{ "text": "that is something" }`, as at least one of the words start with a
given prefix.

The same query again, but with an explicit `minMatchCount`:

```js
FOR doc IN viewName
  SEARCH ANALYZER(STARTS_WITH(doc.text, ["wrong", "ips"], 1), "text_en")
  RETURN doc.text
```

The number can be increased to require that at least this many prefixes must
be present:

```js
FOR doc IN viewName
  SEARCH ANALYZER(STARTS_WITH(doc.text, ["lo", "ips", "something"], 2), "text_en")
  RETURN doc.text
```

This will still match `{ "text": "lorem ipsum" }` because at least two prefixes
(`lo` and `ips`) are found, but not `{ "text": "that is something" }` which only
contains one of the prefixes (`something`).

### LEVENSHTEIN_MATCH()

<small>Introduced in: v3.7.0</small>

`LEVENSHTEIN_MATCH(path, target, distance, transpositions, maxTerms, prefix) → fulfilled`

Match documents with a [Damerau-Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance){:target=_"blank"}
lower than or equal to *distance* between the stored attribute value and
*target*. It can optionally match documents using a pure Levenshtein distance.

See [LEVENSHTEIN_DISTANCE()](functions-string.html#levenshtein_distance)
if you want to calculate the edit distance of two strings.

- **path** (attribute path expression\|string): the path of the attribute to
  compare against in the document or a string
- **target** (string): the string to compare against the stored attribute
- **distance** (number): the maximum edit distance, which can be between
  `0` and `4` if *transpositions* is `false`, and between `0` and `3` if
  it is `true`
- **transpositions** (bool, _optional_): if set to `false`, a Levenshtein
  distance is computed, otherwise a Damerau-Levenshtein distance (default)
- **maxTerms** (number, _optional_): consider only a specified number of the
  most relevant terms. One can pass `0` to consider all matched terms, but it may
  impact performance negatively. The default value is `64`.
- returns **fulfilled** (bool): `true` if the calculated distance is less than
  or equal to *distance*, `false` otherwise
- **prefix** (string, _optional_): if defined, then a search for the exact
  prefix is carried out, using the matches as candidates. The Levenshtein /
  Damerau-Levenshtein distance is then computed for each candidate using
  the `target` value and the remainders of the strings, which means that the
  **prefix needs to be removed from `target`** (see
  [example](#example-matching-with-prefix-search)). This option can improve
  performance in cases where there is a known common prefix. The default value
  is an empty string (introduced in v3.7.13, v3.8.1).

#### Example: Matching with and without transpositions

The Levenshtein distance between _quick_ and _quikc_ is `2` because it requires
two operations to go from one to the other (remove _k_, insert _k_ at a
different position).

```js
FOR doc IN viewName
  SEARCH LEVENSHTEIN_MATCH(doc.text, "quikc", 2, false) // matches "quick"
  RETURN doc.text
```

The Damerau-Levenshtein distance is `1` (move _k_ to the end).

```js
FOR doc IN viewName
  SEARCH LEVENSHTEIN_MATCH(doc.text, "quikc", 1) // matches "quick"
  RETURN doc.text
```

#### Example: Matching with prefix search

Match documents with a Levenshtein distance of 1 with the prefix `qui`. The edit
distance is calculated using the search term `kc` (`quikc` with the prefix `qui`
removed) and the stored value without the prefix (e.g. `ck`). The prefix `qui`
is constant.

```js
FOR doc IN viewName
  SEARCH LEVENSHTEIN_MATCH(doc.text, "kc", 1, false, 64, "qui") // matches "quick"
  RETURN doc.text
```

You may compute the prefix and suffix from the input string as follows:

```js
LET input = "quikc"
LET prefixSize = 3
LET prefix = LEFT(input, prefixSize)
LET suffix = SUBSTRING(input, prefixSize)
FOR doc IN viewName
  SEARCH LEVENSHTEIN_MATCH(doc.text, suffix, 1, false, 64, prefix) // matches "quick"
  RETURN doc.text
```

#### Example: Basing the edit distance on string length

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
  SEARCH LEVENSHTEIN_MATCH(doc.text, target, maxDistance, true)
  RETURN doc.text
```

### LIKE()

<small>Introduced in: v3.7.2</small>

`LIKE(path, search) → bool`

Check whether the pattern *search* is contained in the attribute denoted by *path*,
using wildcard matching.

- `_`: A single arbitrary character
- `%`: Zero, one or many arbitrary characters
- `\\_`: A literal underscore
- `\\%`: A literal percent sign

{% hint 'info' %}
Literal backlashes require different amounts of escaping depending on the
context:
- `\` in bind variables (_Table_ view mode) in the Web UI (automatically
  escaped to `\\` unless the value is wrapped in double quotes and already
  escaped properly)
- `\\` in bind variables (_JSON_ view mode) and queries in the Web UI
- `\\` in bind variables in arangosh
- `\\\\` in queries in arangosh
- Double the amount compared to arangosh in shells that use backslashes for
escaping (`\\\\` in bind variables and `\\\\\\\\` in queries)
{% endhint %}

Searching with the `LIKE()` function in the context of a `SEARCH` operation
is backed by View indexes. The [String `LIKE()` function](functions-string.html#like)
is used in other contexts such as in `FILTER` operations and cannot be
accelerated by any sort of index on the other hand. Another difference is that
the ArangoSearch variant does not accept a third argument to enable
case-insensitive matching. This can be controlled with Analyzers instead.

- **path** (attribute path expression): the path of the attribute to compare
  against in the document
- **search** (string): a search pattern that can contain the wildcard characters
  `%` (meaning any sequence of characters, including none) and `_` (any single
  character). Literal `%` and `_` must be escaped with backslashes.
- returns **bool** (bool): `true` if the pattern is contained in *text*,
  and `false` otherwise

#### Example: Searching with wildcards

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
(Okapi BM25).

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

#### Example: Sorting by default `BM25()` score

Sorting by relevance with BM25 at default settings:

```js
FOR doc IN viewName
  SEARCH ...
  SORT BM25(doc) DESC
  RETURN doc
```

#### Example: Sorting with tuned `BM25()` ranking

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

#### Example: Sorting by default `TFIDF()` score

Sort by relevance using the TF-IDF score:

```js
FOR doc IN viewName
  SEARCH ...
  SORT TFIDF(doc) DESC
  RETURN doc
```

#### Example: Sorting by `TFIDF()` score with normalization

Sort by relevance using a normalized TF-IDF score:

```js
FOR doc IN viewName
  SEARCH ...
  SORT TFIDF(doc, true) DESC
  RETURN doc
```

#### Example: Sort by value and `TFIDF()`

Sort by the value of the `text` attribute in ascending order, then by the TFIDF
score in descending order where the attribute values are equivalent:

```js
FOR doc IN viewName
  SEARCH ...
  SORT doc.text, TFIDF(doc) DESC
  RETURN doc
```
