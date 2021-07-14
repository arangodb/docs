---
layout: default
description: >-
  Combine aggregation with search queries to retrieve how often values occur
  overall
title: Faceted Search ArangoSearch Examples
---
# Faceted Search with ArangoSearch

{{ page.description }}
{:class="lead"}

A popular method for filtering items in an online shop is to display product
categories in a list, together with the number of items in each category.
This way, users get an idea of how many items will be left after applying a
certain filter before they actually enable it. This concept can be extended to
any properties, also called facets.

To implement such a feature in ArangoDB, you can use a `COLLECT` operation
to group and count how many documents share an attribute value. This is also
possible with ArangoSearch Views by simply iterating over a View instead of a
collection.

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

**View definition:**

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "genre": {
          "analyzers": [
            "identity"
          ]
        }
      }
    }
  }
}
```

**AQL Queries:**

Find out all genre values by grouping by the `genre` attribute and count the
number of occurrences:

```js
FOR doc IN imdb
  COLLECT genre = doc.genre WITH COUNT INTO count
  RETURN { genre, count }
```

| genre     | count |
|:----------|------:|
| null      | 51287 |
| Action    |  2449 |
| Adventure |   312 |
| Animation |   426 |
| British   |     1 |
| Comedy    |  3188 |
| …         |     … |

The `COLLECT` operation is applied as a post-operation. In other words, it is
not accelerated by the View index. On the other hand, the `genre` field does
not need to be indexed for this query.

To look up a specific genre, the field needs to be indexed. The lookup itself
utilizes the View index, but the `COLLECT` operation is still a post-operation:

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.genre == "Action", "identity")
  COLLECT WITH COUNT INTO count
  RETURN count
```

```json
[
  2690
]
```

For above query with a single, simple condition, there is an optimization you
can enable that can accurately determine the count from index data faster than
the standard `COLLECT`. Also see
[Count Approximation](arangosearch-performance.html#count-approximation).

```js
FOR doc IN imdb
  SEARCH ANALYZER(doc.genre == "Action", "identity")
  OPTIONS { countApproximate: "cost" }
  COLLECT WITH COUNT INTO count
  RETURN count
```

To apply this optimization to the faceted search paradigm over all genres, you
can run and **cache** the following query that determines all unique genre
values:

```js
FOR doc IN imdb
  RETURN DISTINCT doc.genre
```

You may use the AQL query cache if the data does not change much, or you could
execute above query periodically and store the result in a separate collection.
The numbers will not be fully up to date in that case, but it is often an
acceptable tradeoff for a faceted search.

You can then use the genre list to look up each genre and retrieve the count
while utilizing the count approximation optimization:

```js
LET genres = [ "Action", "Adventure", "Animation", /* ... */ ]
FOR genre IN genres
  LET count = FIRST(
    FOR doc IN imdb
      SEARCH ANALYZER(doc.genre == genre, "identity")
      OPTIONS { countApproximate: "cost" }
      COLLECT WITH COUNT INTO count
      RETURN count
  )
  RETURN { genre, count }
```
