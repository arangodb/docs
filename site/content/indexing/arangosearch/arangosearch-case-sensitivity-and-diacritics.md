---
fileID: arangosearch-case-sensitivity-and-diacritics
title: Case-insensitive Search with ArangoSearch
weight: 710
description: You can normalize values for case-insensitive matching and to ignore diacritics, also in combination with other search techniques
layout: default
---
## Normalizing a Single Token

### Dataset

[IMDB movie dataset](arangosearch-example-datasets#imdb-movie-dataset)

### Custom Analyzer

Create a `norm` Analyzer in arangosh to normalize case to all lowercase and to
remove diacritics:

```js
//db._useDatabase("your_database"); // Analyzer will be created in current database
var analyzers = require("@arangodb/analyzers");
analyzers.save("norm_en", "norm", { locale: "en", accent: false, case: "lower" }, ["frequency", "norm", "position"]);
```

### View definition

#### `search-alias` View

```js
db.imdb_vertices.ensureIndex({ name: "inv-ci", type: "inverted", fields: [ { name: "title", analyzer: "norm_en" } ] });
db._createView("imdb_alias", "search-alias", { indexes: [ { collection: "imdb_vertices", index: "inv-ci" } ] });
```

#### `arangosearch` View

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

### AQL queries

#### Example: Full string matching

Match movie title, ignoring capitalization and using the base characters
instead of accented characters (full string).

_`search-alias` View:_

```aql
FOR doc IN imdb_alias
  SEARCH doc.title == TOKENS("thé mäTRïX", "norm_en")[0]
  RETURN doc.title
```

_`arangosearch` View:_

```aql
FOR doc IN imdb
  SEARCH ANALYZER(doc.title == TOKENS("thé mäTRïX", "norm_en")[0], "norm_en")
  RETURN doc.title
```

| Result |
|:-------|
| **The Matrix** |

#### Example: Prefix matching

Match a title prefix (case-insensitive).

_`search-alias` View:_

```aql
FOR doc IN imdb_alias
  SEARCH STARTS_WITH(doc.title, "the matr")
  RETURN doc.title
```

_`arangosearch` View:_

```aql
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

{{% comment %}}
## Normalizing Full-text

{{% /comment %}}
