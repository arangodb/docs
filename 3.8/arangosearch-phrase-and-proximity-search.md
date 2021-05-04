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

**AQL Queries:**

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

Analyzer pre-processing is applied automatically to `epic` and `film` based on
the Analyzer context or an optional last argument in the call to `PHRASE()`.

## Combining Phrase Search with other Techniques

Phrase search is not limited to finding full and exact tokens in a particular
order. It also lets you search for prefixes, strings with wildcards, etc. in
the specified order. See the _object tokens_ description of the
[`PHRASE()` function](aql/functions-arangosearch.html#phrase) for a full list
of options.

**AQL Queries:**

Match movies where the title has a token that starts with `Härr` (normalized to
`harr`), followed by six arbitrary tokens and then a token that contains `eni`:

```js
FOR doc IN imdb
  SEARCH ANALYZER(PHRASE(doc.title, {STARTS_WITH: TOKENS("Härr", "text_en")[0]}, 6, {WILDCARD: "%eni%"}), "text_en")
  RETURN doc.title
```

The search terms used in object tokens need to be pre-processed manually as
shown above with `STARTS_WITH`.
