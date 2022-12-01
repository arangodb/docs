---
fileID: arangosearch-fulltext-token-search
title: Searching Full-text with ArangoSearch
weight: 570
description: Search for tokens in full-text that can occur in any order
layout: default
---
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
[Phrase and Proximity Search](arangosearch-phrase-and-proximity-search).

## Token Search

### Dataset

[IMDB movie dataset](arangosearch-example-datasets#imdb-movie-dataset)

### View definition

#### `search-alias` View

{{< tabs >}}
{{% tab name="js" %}}
```js
db.imdb_vertices.ensureIndex({ name: "inv-text", type: "inverted", fields: [ { name: "description", analyzer: "text_en" } ] });
db._createView("imdb_alias", "search-alias", { indexes: [ { collection: "imdb_vertices", index: "inv-text" } ] });
```
{{% /tab %}}
{{< /tabs >}}

#### `arangosearch` View

{{< tabs >}}
{{% tab name="json" %}}
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
{{% /tab %}}
{{< /tabs >}}

### AQL queries

#### Example: Match one out of multiple tokens

Search for movies with `dinosaur` or `park` (or both) in their description.

_`search-alias` View:_

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR doc IN imdb_alias
  SEARCH doc.description IN TOKENS("dinosaur park", "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }
```
{{% /tab %}}
{{< /tabs >}}

_`arangosearch` View:_

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR doc IN imdb
  SEARCH ANALYZER(doc.description IN TOKENS("dinosaur park", "text_en"), "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }
```
{{% /tab %}}
{{< /tabs >}}

| title | description |
|:------|:------------|
| Alone in the Wilderness | … the Aleutian Peninsula, in what is now Lake Clark National **Park**. … |
| Madagascar Collection | … The plot follows the adventures of story of four Central **Park** Zoo animals … |
| Sea Monsters: A Prehistoric Adventure | Journey 80 million years back in time to an age when mighty **dinosaurs** dominated the land … |
| Land of the Lost | … their only ally in a world full of **dinosaurs** and other fantastic creatures. |
| … | … |

#### Example: Match multiple tokens

Search for movies with both `dinosaur` and `park` in their description:

_`search-alias` View:_

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR doc IN imdb_alias
  SEARCH TOKENS("dinosaur park", "text_en") ALL == doc.description
  RETURN {
    title: doc.title,
    description: doc.description
  }
```
{{% /tab %}}
{{< /tabs >}}

_`arangosearch` View:_

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR doc IN imdb
  SEARCH ANALYZER(TOKENS("dinosaur park", "text_en") ALL == doc.description, "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }
```
{{% /tab %}}
{{< /tabs >}}

| title | description |
|:------|:------------|
| Jurassic Park Series | … the Jurassic **Park** films. This trilogy of films brings all our childhood fantasies to life with **dinosaurs** … |
| Jurassic Park | A wealthy entrepreneur secretly creates a theme **park** featuring living **dinosaurs** … |
| The Lost World: Jurassic Park | Four years after Jurassic **Park's** genetically bred **dinosaurs** ran amok … |
| Cesta do pravěku | … Four young boys visit a **dinosaur** exhibit … They then row out onto Central **Park** Lake … |

The results will be the same if you use `park dinosaur` as search terms,
as the tokens can be ordered arbitrarily.
