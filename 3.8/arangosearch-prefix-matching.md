---
layout: default
description: Search for strings that start with one or more substrings
title: Prefix Search ArangoSearch Examples
---
# Prefix Search with ArangoSearch

## Basic Prefix Matching

If you want to search for text that starts with a certain string, then the the
`identity` is sufficient. However, only the original capitalization will match
(case-sensitive).

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dateset)

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

Match all titles that start with `"The Matri"`:

```js
FOR doc IN imdb
  SEARCH ANALYZER(STARTS_WITH(doc.title, "The Matr"), "identity")
  RETURN doc.title
```

## Edge N-Grams

