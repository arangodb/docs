---
layout: default
description: You can query Views and return the most relevant results first based on their ranking score
title: ArangoSearch View Query Result Ranking
redirect_from:
  - views-arango-search.html # 3.4 -> 3.5
---
# Ranking View Query Results

{{ page.description }}
{:class="lead"}

ArangoSearch supports the two most popular ranking schemes:

- [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25){:target="_blank"}
- [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf){:target="_blank"}

Under the hood, both models rely on two main components:

- **Term frequency** (TF):
  in the simplest case defined as the number of times a term occurs in a document
- **Inverse document frequency** (IDF):
  a measure of how relevant a term is, i.e. whether the word is common or rare
  across all documents

## Basic Ranking

To sort View results from most relevant to least relevant, use a
[SORT operation](aql/operations-sort.html) with a call to a
[Ranking function](aql/functions-arangosearch.html#ranking) as expression and
set the order to descending. Ranking functions expect the document emitted by
a `FOR … IN` loop that iterates over a View as first argument.

```js
FOR doc IN viewName
  SEARCH …
  SORT BM25(doc) DESC
  RETURN doc
```

You can also return the ranking score as part of the result.

```js
FOR doc IN viewName
  SEARCH …
  RETURN MERGE(doc, { bm25: BM25(doc), tfidf: TFIDF(doc) })
```

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

**View definition:**

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "description": {
          "analyzers": [
            "text_en"
          ]
        }
      }
    }
  }
}
```

**AQL Queries:**

Search for movies with certain keywords in their description and rank the
results using the [`BM25()` function](aql/functions-arangosearch.html#bm25):

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.description IN TOKENS("amazing action world alien sci-fi science documental galaxy", "text_en"), "text_en")
  SORT BM25(doc) DESC
  LIMIT 10
  RETURN doc
```

Do the same but with the [`TFIDF()` function](aql/functions-arangosearch.html#tfidf):

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.description IN TOKENS("amazing action world alien sci-fi science documental galaxy", "text_en"), "text_en")
  SORT TFIDF(doc) DESC
  LIMIT 10
  RETURN doc
```

## Query Time Relevance Tuning

You can fine-tune the scores computed by the Okapi BM25 and TF-IDF relevance
models at query time via the `BOOST()` AQL function and also calculate a custom
score. In addition, the `BM25()` function lets you adjust the coefficients at
query time.

The `BOOST()` function is similar to the `ANALYZER()` function in that it
accepts any valid `SEARCH` expression as first argument. You can set the boost
factor for that sub-expression via the second parameter. Documents that match
boosted parts of the search expression will get higher scores.

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

**View definition:**

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "description": {
          "analyzers": [
            "text_en"
          ]
        }
      }
    }
  }
}
```

**AQL Queries:**

Prefer `galaxy` over the other keywords:

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.description IN TOKENS("amazing action world alien sci-fi science documental", "text_en")
      OR BOOST(doc.description IN TOKENS("galaxy", "text_en"), 5), "text_en")
  SORT BM25(doc) DESC
  LIMIT 10
  RETURN doc
```

Calculate a custom score based on BM25 and the movie runtime to favor longer
movies:

```js
FOR doc IN imdb
  SEARCH PHRASE(doc.title, "Star Wars", "text_en")
  SORT BM25(doc) * LOG(doc.runtime + 1) DESC
  RETURN doc
```

If you are an information retrieval expert and want to fine-tuning the
weighting schemes at query time, then you can do so. The `BM25()` function
accepts free coefficients as parameters to turn it into BM15 for instance:

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.description IN TOKENS("amazing action world alien sci-fi science documental", "text_en")
      OR BOOST(doc.description IN TOKENS("galaxy", "text_en"), 5), "text_en")
  SORT BM25(doc, 1.2, 0) DESC
  LIMIT 10
  RETURN d
```
