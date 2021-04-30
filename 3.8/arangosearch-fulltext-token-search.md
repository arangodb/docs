---
layout: default
description: Search for tokens in full-text that can occur in any order
title: Full-text Search ArangoSearch Examples
redirect_from:
  - arangosearch-phrase-search.html # TODO: Temporary
---
# Searching Full-text with ArangoSearch

{{ page.description }}
{:class="lead"}

Full-text strings can be tokenized by `text` Analyzers so that each token
(usually a word) gets indexed separately. Subsequently, it becomes possible to
search for individual tokens. This is also possible with arrays of strings,
where each element is one token (or multiple, additionally tokenized by a
`text` Analyzer).

There are two ways to search for tokens:

- **Token search**:
  The tokens can occur in any order. The words you search for merely need to
  be contained in the source string somehow.
- **Phrase search**:
  The order of the tokens needs to match the query. This allows you to search
  for partial or full sentences.

Token search is covered below. For phrase search see
[Phrase and Proximity Search](arangosearch-phrase-and-proximity-search.html).

## Token Search

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

Search for movies with `dinosaur` or `park` (or both) in their description:

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.description IN TOKENS("dinosaur park", "text_en"), "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }
```

Search for movies with both `dinosaur` and `park` in their description:

```js
FOR doc IN imdb
  SEARCH ANALYZER(TOKENS("dinosaur park", "text_en") ALL == doc.description , "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }
```

The results will be the same if you use `park dinosaur` as search terms,
as the tokens can be ordered arbitrarily.
