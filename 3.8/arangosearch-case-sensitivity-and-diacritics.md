---
layout: default
description: You can normalize values for case-insensitive matching and to ignore diacritics, also in combination with other search techniques
title: Case-insensitive Search ArangoSearch Examples
---
## Case-insensitive Search with ArangoSearch

{{ page.description }}
{:class="lead"}

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

**Custom Analyzer:**

Create an Analyzer to normalize case to all lowercase and to remove diacritics
in arangosh:

```js
//db._useDatabase("your_database"); // Analyzer will be created in current database
var analyzers = require("@arangodb/analyzers");
analyzers.save("norm_en", "norm", { locale: "en_US.utf-8", accent: false, case: "lower" }, [])
```

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
  SEARCH ANALYZER(doc.title == "thé mäTRïX", "norm_en")
  RETURN doc.title
```

Match a title prefix (case-insensitive):

```js
FOR doc IN imdb
  SEARCH ANALYZER(STARTS_WITH(doc.title, "the matr"), "norm_en")
  RETURN doc.title
```
