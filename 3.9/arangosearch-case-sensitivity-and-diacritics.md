---
layout: default
description: You can normalize values for case-insensitive matching and to ignore diacritics, also in combination with other search techniques
title: Case-insensitive Search ArangoSearch Examples
---
# Case-insensitive Search with ArangoSearch

{{ page.description }}
{:class="lead"}

## Normalizing a Single Token

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

**Custom Analyzer:**

Create a `norm` Analyzer in arangosh to normalize case to all lowercase and to
remove diacritics:

```js
//db._useDatabase("your_database"); // Analyzer will be created in current database
var analyzers = require("@arangodb/analyzers");
analyzers.save("norm_en", "norm", { locale: "en", accent: false, case: "lower" }, []);
```

No [Analyzer features](analyzers.html#analyzer-features) are set because the
examples on this page don't require them.

**View definition:**

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "title": {
          "analyzers": [
            "norm_en"
          ]
        }
      }
    }
  }
}
```

**AQL queries:**

Match movie title, ignoring capitalization and using the base characters
instead of accented characters (full string):

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.title == TOKENS("thé mäTRïX", "norm_en")[0], "norm_en")
  RETURN doc.title
```

| Result |
|:-------|
| **The Matrix** |

Match a title prefix (case-insensitive):

```js
FOR doc IN imdb
  SEARCH ANALYZER(STARTS_WITH(doc.title, "the matr"), "norm_en")
  RETURN doc.title
```

| Result |
|:-------|
| **The Matrix** Revisited |
| **The Matrix** |
| **The Matrix** Reloaded |
| **The Matrix** Revolutions |
| **The Matrix** Trilogy |

{%- comment %}
## Normalizing Full-text

{%- endcomment %}
