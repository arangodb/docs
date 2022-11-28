---
fileID: arangosearch-wildcard-search
title: Wildcard Search with ArangoSearch
weight: 715
description: Search for strings with placeholders that stand for one or many arbitrary characters
layout: default
---
You can use the `LIKE()` function for this search technique to find strings
that start with, contain or end with a certain substring, but it can do more
than that. You can place the special characters `_` and `%` as wildcards for
single or zero-or-more characters in the search string to match multiple
partial strings.

The [ArangoSearch `LIKE()` function](../../aql/functions/functions-arangosearch#like)
is backed by View indexes. In contrast, the
[String `LIKE()` function](../../aql/functions/functions-string#like) cannot utilize any
sort of index. Another difference is that the ArangoSearch variant does not
accept a third argument to make matching case-insensitive. You can control this
via Analyzers instead, also see
[Case-insensitive Search with ArangoSearch](arangosearch-case-sensitivity-and-diacritics).
Which of the two equally named functions is used is determined by the context.
It is the ArangoSearch variant in `SEARCH` operations and the String variant
everywhere else.

## Wildcard Syntax

- `_`: A single arbitrary character
- `%`: Zero, one or many arbitrary characters
- `\\_`: A literal underscore
- `\\%`: A literal percent sign

{{% hints/info %}}
Literal backlashes require different amounts of escaping depending on the
context:
- `\` in bind variables (_Table_ view mode) in the web interface (automatically
  escaped to `\\` unless the value is wrapped in double quotes and already
  escaped properly)
- `\\` in bind variables (_JSON_ view mode) and queries in the web interface
- `\\` in bind variables in arangosh
- `\\\\` in queries in arangosh
- Double the amount compared to arangosh in shells that use backslashes for
escaping (`\\\\` in bind variables and `\\\\\\\\` in queries)
{{% /hints/info %}}

## Wildcard Search Examples

### Dataset

[IMDB movie dataset](arangosearch-example-datasets#imdb-movie-dataset)

### View definition

#### `search-alias` View

```js
db.imdb_vertices.ensureIndex({ name: "inv-exact", type: "inverted", fields: [ "title" ] });
db._createView("imdb", "search-alias", { indexes: [ { collection: "imdb_vertices", index: "inv-exact" } ] });
```

#### `arangosearch` View

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

### AQL queries

Match all titles that starts with `The Matr` using `LIKE()`,
where `_` stands for a single wildcard character and `%` for an arbitrary amount:

```aql
FOR doc IN imdb
  SEARCH LIKE(doc.title, "The Matr%")
  RETURN doc.title
```

| Result |
|:-------|
| **The Matr**ix Revisited |
| **The Matr**ix |
| **The Matr**ix Reloaded |
| **The Matr**ix Revolutions |
| **The Matr**ix Trilogy |

You can achieve the same with the `STARTS_WITH()` function:

```aql
FOR doc IN imdb
  SEARCH STARTS_WITH(doc.title, "The Matr")
  RETURN doc.title
```

Match all titles that contain `Mat` using `LIKE()`:

```aql
FOR doc IN imdb
  SEARCH LIKE(doc.title, "%Mat%")
  RETURN doc.title
```

| Result |
|:-------|
| The **Mat**rix Revisited |
| Gray **Mat**ters |
| Show: A Night In The Life of **Mat**chbox Twenty |
| The **Mat**ing Habits of the Earthbound Human |
| Dark **Mat**ter |
| Dave **Mat**thews & Tim Reynolds: Live at Radio City |
| Once Upon A **Mat**tress |
| Tarzan and His **Mat**e |
| Donald in **Mat**hmagic Land |
| Das Geheimnis der **Mat**erie |
| … |

Match all titles that end with `rix` using `LIKE()`:

```aql
FOR doc IN imdb
  SEARCH LIKE(doc.title, "%rix")
  RETURN doc.title
```

| Result |
|:-------|
| Ben 10: Secret of the Omnit**rix** |
| Pinchcliffe Grand P**rix** |
| Hend**rix** |
| The Mat**rix** |
| The Animat**rix** |
| Les Douze travaux d'Asté**rix** |
| Vercingéto**rix** |

Match all titles that have an `H` as first letter, followed by two arbitrary
characters, followed by `ry` and any amount of characters after that. It will
match titles starting with `Harry` and `Henry`:

```aql
FOR doc IN imdb
  SEARCH LIKE(doc.title, "H__ry%")
  RETURN doc.title
```

| Result |
|:-------|
| **Henry** & June |
| **Henry** Rollins: Live in the Conversation Pit |
| **Henry** Rollins: Uncut from NYC |
| **Harry** Potter and the Sorcerer's Stone |
| **Harry** Potter and the Chamber Of Secrets |
| … |

Use a bind parameter as input, but escape the characters with special meaning
and perform a contains-style search by prepending and appending a percent sign:

```aql
FOR doc IN imdb
  SEARCH LIKE(doc.title, CONCAT("%", SUBSTITUTE(@term, ["_", "%"], ["\\_", "\\%"]), "%"))
  RETURN doc.title
```

Bind parameters:

```json
{ "term": "y_" }
```

The query constructs the wildcard string `%y\\_%` and will match `Cry_Wolf`.
