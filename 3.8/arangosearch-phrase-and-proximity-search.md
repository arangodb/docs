---
layout: default
description: Search for phrases and nearby words in full-text
title: Phrase and Proximity Search ArangoSearch Examples
redirect_from:
  - arangosearch-phrase-search.html # TODO: Temporary
---
# Phrase and Proximity Search with ArangoSearch

{{ page.description }}
{:class="lead"}

With phrase search, you can query for tokens in a certain order. This allows
you to match partial or full sentences. You can also specify how many arbitrary
tokens may occur between defined tokens for word proximity searches.

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

## Phrase Search

**AQL Queries:**

Search for movies that have the tokens `biggest` and `blockbluster` in this
order in their description:

```js
FOR doc IN imdb
  SEARCH ANALYZER(PHRASE(doc.description, "biggest blockbuster"), "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }
```

## Proximity Search

The `PHRASE()` functions lets you specify tokens and the number of wildcard
tokens in an alternating order. You can use this to search for two words with
one arbitrary word in between the two words, for instance.

Match movies that contain the phrase `epic <something> film` in their
description, where `<something>` can be exactly one arbitrary token:

```js
FOR doc IN imdb
  SEARCH ANALYZER(PHRASE(doc.description, "epic", 1, "film"), "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }
```
