---
layout: default
description: Search for strings or tokens that start with one or more substrings
title: Prefix Search ArangoSearch Examples
---
# Prefix Search with ArangoSearch

{{ page.description }}
{:class="lead"}

A typical use case for matching prefixes is to provide word completion
(auto-complete). If the requirement is to find exact prefix matches only then
indexing strings with the `identity` Analyzer is sufficient. The search term
needs to have the original capitalization to match (case-sensitive) in that
case.

Prefix matching can be used together with normalizing Analyzers (`norm`, `text`)
for case-insensitive and accent-insensitive searches. This is often preferable
over exact prefix matching in auto-complete scenarios, because users may type
everything in lower case and not use characters with diacritical marks but just
the base characters.

The fastest option for prefix matching is to use edge _n_-grams, a feature
supported by `text` Analyzers. They make it possible for ArangoSearch Views to
simply look up prefixes in the inverted index. The downsides are that the minimum
and maximum _n_-gram length needs to be defined upfront and only prefixes in
this range will be found, and that edge _n_-grams can take up more space.

## Exact Prefix Matching

In its basic form without case normalization and accent removal, prefix
matching can be done if a field is indexed with just the `identity` Analyzer.
It creates the necessary index data to perform prefix queries with
`STARTS_WITH()` but also wildcard queries with `LIKE()`.

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

**View definition:**

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "title": {
          "analyzers": [
            "identity"
          ]
        }
      }
    }
  }
}
```

**AQL queries**

Match all movie titles that start with `"The Matri"` (case-sensitive):

```js
FOR doc IN imdb
  SEARCH ANALYZER(STARTS_WITH(doc.title, "The Matr"), "identity")
  RETURN doc.title
```

| Result |
|:-------|
| **The Matr**ix |
| **The Matr**ix Reloaded |
| **The Matr**ix Revolutions |
| **The Matr**ix Trilogy |
| **The Matr**ix Revisited |

Match movie titles that start with either `"The Matr"` or `"Harry Pot"`
using `OR`:

```js
FOR doc IN imdb
  SEARCH ANALYZER(STARTS_WITH(doc.title, "The Matr") OR STARTS_WITH(doc.title, "Harry Pot"), "identity")
  RETURN doc.title
```

| Result |
|:-------|
| **The Matr**ix Revisited |
| **The Matr**ix |
| **The Matr**ix Reloaded |
| **The Matr**ix Revolutions |
| **Harry Pot**ter and the Sorcerer's Stone |
| **Harry Pot**ter and the Chamber Of Secrets |
| **Harry Pot**ter and the Prisoner of Azkaban |
| **Harry Pot**ter and the Goblet Of Fire |
| **Harry Pot**ter and the Order of the Phoenix |
| **Harry Pot**ter and the Half-Blood Prince |
| **Harry Pot**ter Collection |
| **The Matr**ix Trilogy |
| **Harry Pot**ter and the Deathly Hallows: Part I |
| **Harry Pot**ter and the Deathly Hallows: Part II |

Match movie titles that start with either `"The Matr"` or `"Harry Pot"`
utilizing the feature of the `STARTS_WITH()` function that allows you to pass
multiple possible prefixes as array of strings, of which one must match:

```js
FOR doc IN imdb
  SEARCH ANALYZER(STARTS_WITH(doc.title, ["The Matr", "Harry Pot"]), "identity")
  RETURN doc.title
```

| Result |
|:-------|
| **The Matr**ix Revisited |
| **The Matr**ix |
| **The Matr**ix Reloaded |
| **The Matr**ix Revolutions |
| **Harry Pot**ter and the Sorcerer's Stone |
| **Harry Pot**ter and the Chamber Of Secrets |
| **Harry Pot**ter and the Prisoner of Azkaban |
| **Harry Pot**ter and the Goblet Of Fire |
| **Harry Pot**ter and the Order of the Phoenix |
| **Harry Pot**ter and the Half-Blood Prince |
| **Harry Pot**ter Collection |
| **The Matr**ix Trilogy |
| **Harry Pot**ter and the Deathly Hallows: Part I |
| **Harry Pot**ter and the Deathly Hallows: Part II |

## Match Multiple Token Prefixes

It is possible to match strings if one out of multiple prefix conditions
is fulfilled with a single call to `STARTS_WITH()`, as it supports an array of
prefixes. The `STARTS_WITH()` function also accepts an optional third argument
to define how many of the given prefixes must match. This is handy if the input
is full-text tokenized by a `text` Analyzer or an array of strings, where
conditions for different tokens can be fulfilled.

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

**View definition:**

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "title": {
          "analyzers": [
            "text_en"
          ]
        }
      }
    }
  }
}
```

**AQL queries**

Match movie titles that contain three out of five prefixes:

```js
FOR doc IN imdb
  SEARCH ANALYZER(STARTS_WITH(doc.title, TOKENS("Sec Cham Har Pot Phoe", "text_en"), 3), "text_en")
  RETURN doc.title
```

| Result |
|:-------|
| **Har**ry **Pot**ter and the **Cham**ber Of **Sec**rets |
| **Har**ry **Pot**ter and the Order of the **Phoe**nix |

You can calculate the number of prefixes that need to match dynamically, for
example to require that all prefixes must match:

```js
LET prefixes = TOKENS("Brot Blu", "text_en")
FOR doc IN imdb
  SEARCH ANALYZER(STARTS_WITH(doc.title, prefixes, LENGTH(prefixes)), "text_en")
  RETURN doc.title
```

| Result |
|:-------|
| The **Blu**es **Brot**hers |
| **Blu**es **Brot**hers 2000 |

## Edge N-Grams

Edge _n_-grams is a feature of the `text` Analyzer type. It generates _n_-grams
for each token (usually a word), but anchored to the beginning of the token.
It thus creates prefix _n_-grams only and not all _n_-grams for the input.

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

**Custom Analyzer:**

Create a `text` Analyzer in arangosh to normalize case to all lowercase, remove
diacritics, with no stemming, with edge _n_-grams of size 3 to 6 for example and
including the original string as well:

```js
//db._useDatabase("your_database"); // Analyzer will be created in current database
var analyzers = require("@arangodb/analyzers");
analyzers.save("edge_ngram", "text", { locale: "en.utf-8", accent: false, case: "lower", stemming: false, edgeNgram: { min: 3, max: 6, preserveOriginal: true } }, ["frequency", "norm", "position"]);
```

Test the Analyzer:

```js
db._query(`RETURN TOKENS("Ocean Equilibrium", "edge_ngram")`);
```

```json
[
  [
    "oce",
    "ocea",
    "ocean",
    "equ",
    "equi",
    "equil",
    "equili",
    "equilibrium"
  ]
]
```

**View definition:**

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "title": {
          "analyzers": [
            "edge_ngram"
          ]
        }
      }
    }
  }
}
```

**AQL queries**

Match movie titles that have a word starting with `"ocea"`:

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.title == "ocea", "edge_ngram")
  RETURN doc.title
```

| Result |
|:-------|
| **Ocea**n Voyagers |
| **Ocea**n's Eleven |
| **Ocea**n's Twelve |
| **Ocea**n's Thirteen |
| **Ocea**n's Eleven |
| **Ocea**n's Collection |

Note that the search term must be normalized in order to match something.
You can create a `text` Analyzer that matches the configuration of the
edge _n_-gram `text` Analyzer to pre-process the search terms in the same way,
but without creating any _n_-grams:

```js
//db._useDatabase("your_database"); // Analyzer will be created in current database
var analyzers = require("@arangodb/analyzers");
analyzers.save("match_edge_ngram", "text", { locale: "en.utf-8", accent: false, case: "lower", stemming: false }, ["frequency", "norm", "position"]);
```

Now we can also match movie titles that start with `"Oceä"`
(normalized to `"ocea"`):

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.title == TOKENS("Oceä", "match_edge_ngram")[0], "edge_ngram")
  RETURN doc.title
```

| Result |
|:-------|
| **Ocea**n Voyagers |
| **Ocea**n's Eleven |
| **Ocea**n's Twelve |
| **Ocea**n's Thirteen |
| **Ocea**n's Eleven |
| **Ocea**n's Collection |

What we cannot match search terms that are longer than the maximum edge _n_-gram
size (or shorter than the minimum edge _n_-gram size), except for full tokens
if `preserveOriginal` is enabled. For example, this query does not match
anything because the longest indexed edge _n_-gram is `"equili"` but the search
term is nine characters long:

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.title == TOKENS("Equilibri", "match_edge_ngram")[0], "edge_ngram")
  RETURN doc.title
```

Searching for `"Equilibrium"` does match because the full token `"equilibrium"`
is indexed by our custom Analyzer thanks to `preserveOriginal`. We can take
advantage of the full token being indexed with the `STARTS_WITH()` function:

```js
FOR doc IN imdb
  SEARCH ANALYZER(STARTS_WITH(doc.title, TOKENS("Equilibri", "match_edge_ngram")), "edge_ngram")
  RETURN doc.title
```

| Result |
|:-------|
| Equilibrium |

Note however, that this will not be as fast as matching an edge _n_-gram
directly.
