---
layout: default
description: Search for phrases and nearby words in full-text
title: Phrase and Proximity Search ArangoSearch Examples
---
# Phrase and Proximity Search with ArangoSearch

{{ page.description }}
{:class="lead"}

With phrase search, you can query for tokens in a certain order. This allows
you to match partial or full sentences. You can also specify how many arbitrary
tokens may occur between defined tokens for word proximity searches.

## Dataset

[IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

## View definition

### Search Alias View

```js
db.imdb_vertices.ensureIndex({ type: "inverted", name: "inv-text", fields: [ { name: "description", analyzer: "text_en" } ] });
db._createView("imdb", "search-alias", { indexes: [ { collection: "imdb_vertices", index: "inv-text" } ] });
```

### ArangoSearch View

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

### AQL queries

Search for movies that have the (normalized and stemmed) tokens `biggest` and
`blockbust` in their description, in this order:

```aql
FOR doc IN imdb
  SEARCH PHRASE(doc.description, "BIGGEST Blockbuster", "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }
```

| title | description |
|:------|:------------|
| Jurassic Park Series | … Steven Spielberg gives us on of the **biggest blockbusters** of the 1990’s |
| Scary Movie	| … some of Hollywood's **biggest blockbusters**, …

The search phrase can be handed in via a bind parameter, but it can also be
constructed dynamically using a subquery for instance:

```aql
LET p = (
  FOR word IN ["tale", "of", "a", "woman"]
    SORT RAND()
    LIMIT 2
    RETURN word
)
FOR doc IN imdb
  SEARCH ANALYZER(PHRASE(doc.description, p), "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }
```

You will get different results if you re-run this query multiple times.

## Proximity Search

The `PHRASE()` functions lets you specify tokens and the number of wildcard
tokens in an alternating order. You can use this to search for two words with
one arbitrary word in between the two words, for instance.

### AQL queries

Match movies that contain the phrase `epic <something> film` in their
description, where `<something>` can be exactly one arbitrary token:

```aql
FOR doc IN imdb
  SEARCH PHRASE(doc.description, "epic", 1, "film", "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }
```

| title | description |
|:------|:------------|
| O thiasos | The Travelling Players is an **epic Greek film** from director Theo Angelopoulos …
| On Your Mark | … The video feels like a very compressed version of an **epic Miyazaki film**. …
| Double Decade	| … It is with great pride that we present this **epic snowboarding film**. …
| The Apocalypse | In this **epic disaster film** of faith, a mother and father search for their only child …

Analyzer pre-processing is applied automatically to `epic` and `film` based on
the Analyzer context or an optional last argument in the call to `PHRASE()`.

The search phrase can also be dynamic. The following query looks up a
particular movie with the title `Family Business`, tokenizes the title and then
performs a proximity search for movies with the phrase
`family <something> business` or `family <something> <something> business` in
their description:

```aql
LET title = DOCUMENT("imdb_vertices/39967").title // Family Business
FOR doc IN imdb
  SEARCH
    PHRASE(doc.description, INTERLEAVE(TOKENS(title, "text_en"), [1]), "text_en") OR
    PHRASE(doc.description, INTERLEAVE(TOKENS(title, "text_en"), [2]), "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }
```

| title | description |
|:------|:------------|
| Spy Kids 2: The Island of Lost Dreams | … now joined the **family spy business** as … |
| Do Not Disturb | Combining a **family vacation with business**, … |

## Combining Phrase Search with other Techniques

Phrase search is not limited to finding full and exact tokens in a particular
order. It also lets you search for prefixes, strings with wildcards, etc. in
the specified order. See the _object tokens_ description of the
[`PHRASE()` function](aql/functions-arangosearch.html#phrase) for a full list
of options.

### AQL queries

Match movies where the title has a token that starts with `Härr` (normalized to
`harr`), followed by six arbitrary tokens and then a token that contains `eni`:

```aql
FOR doc IN imdb
  SEARCH PHRASE(doc.title, {STARTS_WITH: TOKENS("Härr", "text_en")[0]}, 6, {WILDCARD: "%eni%"}, "text_en")
  RETURN doc.title
```

| Result |
|:-------|
| **Harr**y Potter and the Order of the Pho**eni**x |

The search terms used in object tokens need to be pre-processed manually as
shown above with `STARTS_WITH`.
