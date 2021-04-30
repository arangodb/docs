---
layout: default
description: Search for exact strings, numbers or number ranges, as well as booleans without Analyzer transformations applied
title: Exact Value Matching ArangoSearch Examples
---
# Matching Exact Values with ArangoSearch

{{ page.description }}
{:class="lead"}

If you want to find strictly equal values, then the `identity` Analyzer is what
you need. It will not apply any transformations. It is a no-operation Analyzer
that passes everything through unaltered.

## Matching Exact Strings

You can index and search strings with the `identity` Analyzer for exact
matching, that is case-sensitive, with accented characters as-is, and only if
the entire string is equal (not matching substrings).

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

**AQL queries:**

Match exact movie title (case-sensitive, full string):

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.title == "The Matrix", "identity")
  RETURN doc.title
```

Match multiple exact movie titles using `OR`:

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.title == "The Matrix" OR doc.title == "The Matrix Reloaded", "identity")
  RETURN doc.title
```

Match multiple exact movie titles using `IN`:

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.title IN ["The Matrix", "The Matrix Reloaded"], "identity")
  RETURN doc.title
```
