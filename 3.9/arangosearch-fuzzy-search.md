---
layout: default
description: Loosely match strings to find partial congruences and to compensate for typing errors
title: Fuzzy Search ArangoSearch Examples
---
# Fuzzy Search with ArangoSearch

{{ page.description }}
{:class="lead"}

Fuzzy search is an umbrella term for various approximate matching algorithms.
What they allow you to do is to find matches even if the search terms are not
spelled exactly like the words in the stored text. This will include terms that
are similar, alternatively spelled, or mistyped but potentially relevant for
the search request as well.

{% hint 'info' %}
If you want to try out fuzzy search with ArangoDB for yourself, then check out
our interactive
[**Fuzzy Search tutorial**](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/FuzzySearch.ipynb){:target="_blank"}.
{% endhint %}

## Similarity Measures

How the approximate string matching algorithms usually work is that they
measure how similar (or different) two strings are. The following similarity
measures are available in ArangoDB:

- **Levenshtein distance** and a variant called Damerau-Levenshtein distance,
  which work best with short strings
- **_n_-gram similarity** and a variant called positional _n_-gram similarity,
  that are well-suited to assess the similarity of longer strings that share
  subsequences

### Levenshtein Distance

The Levenshtein distance is an _edit distance_ string metric. It is informally
defined as the minimum number of single-character edits to go from one string
to the other. The allowed operations are:
- insertions
- deletions
- substitutions

The lowest possible number of the required operations is the Levenshtein
distance. Consider the following two strings:

    galaxy
    galxy

The latter word is misspelled (it is missing the second `a`). We can correct it
by adding an `a`. One operation in total means that the Levenshtein distance is
`1`. It also is for the following pair of strings, but this time requiring the
removal of a character (an extra `l`):

    galaxy
    gallaxy

In the following example, the `e` needs to be replaced with an `a`:

    galaxy
    gelaxy

This is again one operation, so the edit distance is `1`. Here is an example that
requires more than one operation:

    galaxy
    glaaxy

The first `a` and the `l` are in the wrong order, perhaps cause the latter
string was entered hastily. We can remove the `l` from the second position and
insert an `l` at the third position to correct the string. Therefore, the
Levenshtein distance is `2`. We could also substitute the second and third
character instead, but the edit distance remains the same.

### Damerau-Levenshtein Distance

The Damerau-Levenshtein distance is like the [Levenshtein distance](#levenshtein-distance)
but with transpositions as additional operation. Consider the following example
where the latter string has the `a` and `l` in the wrong order:

    galaxy
    glaaxy

This can be corrected by shifting the `l` one character to the right. Hence,
the Damerau-Levenshtein distance is only `1`. The pure Levenshtein distance
is `2`.

### N-Gram Similarity

The _n_-grams of a string are all of its possible substrings of a given length.
The `n` in _n_-gram stands for that substring size. _N_-grams of size 2 are
called 2-grams or _bigrams_, and _n_-grams of size 3 are called 3-grams or
_trigrams_.

Here is an example for the word `avocado` that has three trigrams:

    avocado

    avo
     voc
      oca
       cad
        ado

To compare the similarity of two sets of _n_-grams, one can simply count how
many _n_-grams of the target string match the source string (the target string
being the search term and the source string being the stored string), and
divide the sum by the number of the target string's _n_-grams. Only fully
matching _n_-grams count.

Consider the following example with `avocado` as source string and `vocals` as
target string:

    avocado   vocals

    avo       voc
     voc       oca
      oca       cal
       cad       als
        ado

We find the trigrams `voc` and `oca` from the right side also on the left side.
The other two do not have a corresponding trigram on the left side. That means,
`2 / 4` trigrams match, resulting in a similarity of `0.5` using this
similarity measure.

### Positional N-Gram Similarity

Instead of considering only full _n_-gram matches, one can also consider
partial matches where the characters are in the same positions and counting the
longest common sequence.

    avocado	  vocals

    avo       voc
    voc       oca
    oca       cal
    cad       als
    ado

In above example, `voc` and `oca` on the right side have a fully matching
trigram on the left side. `cal` and `als` do not, but there is `cad` which has
a `c` in the first position and an `a` in the second position, and both `avo`
and `ado` have a matching `a` in the first position.

    voc   voc   3 / 3 = 1
    oca   oca   3 / 3 = 1
    cad   cal   2 / 3 = 0.666…
    ado   als   1 / 3 = 0.333…

We sum up the highest similarity we found for each trigram and divide by the
total _n_-gram count, which ever of the two is higher (here the left side with
5 trigrams). The result is `3 / 5` or `0.6` in positional _n_-gram similarity.

## Fuzzy Search in ArangoDB

There are the following AQL string functions to calculate the
[similarity](#similarity-measures) of two arbitrary strings:
- [LEVENSHTEIN_DISTANCE()](aql/functions-string.html#levenshtein_distance)
- [NGRAM_SIMILARITY()](aql/functions-string.html#ngram_similarity)
- [NGRAM_POSITIONAL_SIMILARITY()](aql/functions-string.html#ngram_positional_similarity)

```js
RETURN [
  LEVENSHTEIN_DISTANCE("galaxy", "glaaxy"),           // 1 (with transpositions)
  NGRAM_SIMILARITY("avocado", "vocals", 3)            // 0.5 (using trigrams)
  NGRAM_POSITIONAL_SIMILARITY("avocado", "vocals", 3) // 0.6 (using trigrams)
]
```

To perform fuzzy searches, there are two ArangoSearch functions:
- [LEVENSHTEIN_MATCH()](aql/functions-arangosearch.html#levenshtein_match)
- [NGRAM_MATCH()](aql/functions-arangosearch.html#ngram_match)

They can be used in conjunction with a View for index-accelerated fuzzy search
queries. The string similarity affects the overall `BM25()` / `TFIDF()` score
when [ranking](arangosearch-ranking.html) results.

### Searching with `LEVENSHTEIN_MATCH()`

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

**Custom Analyzer:**

Create a `text` Analyzer in arangosh to tokenize text, normalize case to all
lowercase and to remove diacritics, but with stemming disabled unlike the
built-in `text_en` Analyzer. The search will be accent- and case-insensitive,
and the Levenshtein distance between the stored and searched text will be taken
into account accurately. With stemming enabled, it would be less accurate with
respect to the original strings, but potentially find more matches that are
also relevant.

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline levenshtein_match_sample
    @EXAMPLE_ARANGOSH_OUTPUT{levenshtein_match_sample}
      var analyzers = require("@arangodb/analyzers");
      analyzers.save("text_en_no_stem", "text", { locale: "en", accent: false, case: "lower", stemming: false, stopwords: [] }, ["frequency", "norm"]);
    ~ analyzers.remove("text_en_no_stem");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock levenshtein_match_sample
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

The `frequency` and `norm` [Analyzer features](analyzers.html#analyzer-features)
are set because the following examples require them for the `BM25()` scoring
function to work.

**View definition:**

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "description": {
          "analyzers": [
            "text_en_no_stem"
          ]
        }
      }
    }
  }
}
```

**AQL queries:**

Search for the token `galxy` in the movie descriptions with some fuzziness.
The maximum allowed Levenshtein distance is set to `1`. Everything with a
Levenshtein distance equal to or lower than this value will be a match and the
respective documents will be included in the search result. The query will find
the token `galaxy` as the edit distance to `galxy` is `1`:

```js
FOR doc IN imdb
  SEARCH ANALYZER(
    LEVENSHTEIN_MATCH(
      doc.description,
      TOKENS("galxy", "text_en_no_stem")[0],
      1,    // max distance
      false // without transpositions
    ),
    "text_en_no_stem"
  )
  SORT BM25(doc) DESC
  RETURN {
    title: doc.title,
    description: doc.description
  }
```

| title | description |
|:------|:------------|
| Stargate: The Ark of Truth | … in the Ori's own home **galaxy**. … SG-1 travels to the Ori **galaxy** aboard the Odyssey. … finds themselves in a distant **galaxy** fighting two powerful enemies. |
| The Ice Pirates | … the most precious commodity in the **galaxy** is water. … the unreachable centre of the **galaxy** at the end of the galactic trade wars. The **galaxy** is ruled by an evil emperor … |
| Star Wars: Episode III: Revenge of the Sith | … leading a massive clone army into a **galaxy**-wide battle against the Separatists. When the sinister Sith unveil a thousand-year-old plot to rule the **galaxy**, … |
| … | … |

### Searching with `NGRAM_MATCH()`

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

**Custom Analyzer:**

`NGRAM_MATCH()` requires an `ngram` Analyzer. For this example, create a
trigram Analyzer in arangosh with a minimum and maximum _n_-gram size of 3,
not including the original string:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline ngram_match_sample
    @EXAMPLE_ARANGOSH_OUTPUT{ngram_match_sample}
      var analyzers = require("@arangodb/analyzers");
      analyzers.save("trigram", "ngram", { min: 3, max: 3, preserveOriginal: false, streamType: "utf8" }, ["frequency", "position"]);
    ~ analyzers.remove("trigram");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock ngram_match_sample
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

The `frequency` and `position` [Analyzer features](analyzers.html#analyzer-features)
are set because the following examples require them for the `NGRAM_MATCH()`
filter function to work.

**View definition:**

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "name": {
          "analyzers": [
            "trigram"
          ]
        }
      }
    }
  }
}
```

**AQL queries:**

Search for actor names with an _n_-gram similarity of at least 50%.

```js
FOR doc IN imdb
  SEARCH NGRAM_MATCH(
    doc.name,
    "avocado",
    0.5,      // similarity threshold
    "trigram" // custom n-gram Analyzer
  )
  RETURN {
    name: doc.name
  }
```

| name |
|:-----|
| Nancy S**avoca** |
| John S**avoca** |
