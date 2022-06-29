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

## Matching an Exact String

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

```aql
FOR doc IN imdb
  SEARCH ANALYZER(doc.title == "The Matrix", "identity")
  RETURN doc.title
```

| Result |
|:-------|
| **The Matrix** |

It is not necessary to set the Analyzer context with the `ANALYZER()` function
here, because the default Analyzer is `identity` anyway. The following query
will return the exact same results:

```aql
FOR doc IN imdb
  SEARCH doc.title == "The Matrix"
  RETURN doc.title
```

However, being explicit about the Analyzer context helps with clarity and it
also makes it easier to adjust queries if you want to use something other than
the `identity` Analyzers. A common pitfall is to index a field with a certain
Analyzer, but forgetting to set this Analyzer as context in the query.
The consequence is usually an empty result, because there is nothing in the
View index for the implicitly requested Analyzer. Or the field happens to be
indexed with the `identity` Analyzer as well, but there are no or different
matches because of different Analyzer pre-processing between the indexed data
and the search terms.

## Matching Multiple Strings

You can search for several alternatives by combining multiple conditions with
logical `OR`s, but you can also use the `IN` operator for the same purpose.
The advantage of the `IN` operator is that it scales better with the number of
alternatives and allows you to use a single query for a varying amount of
strings that you want to match.

Match multiple exact movie titles using `OR`:

```aql
FOR doc IN imdb
  SEARCH ANALYZER(doc.title == "The Matrix" OR doc.title == "The Matrix Reloaded", "identity")
  RETURN doc.title
```

| Result |
|:-------|
| The Matrix |
| The Matrix Reloaded |

Match multiple exact movie titles using `IN`:

```aql
FOR doc IN imdb
  SEARCH ANALYZER(doc.title IN ["The Matrix", "The Matrix Reloaded"], "identity")
  RETURN doc.title
```

| Result |
|:-------|
| The Matrix |
| The Matrix Reloaded |

By substituting the array of strings with a bind parameter, it becomes possible
to use the same query for an arbitrary amount of alternative strings to match:

```aql
FOR doc IN imdb
  SEARCH ANALYZER(doc.title IN @titles, "identity")
  RETURN doc.title
```

Bind parameters:

```json
{
  "titles": [
    "The Matrix",
    "The Matrix Reloaded",
    "The Matrix Revolutions",
    "The Matrix Trilogy",
    "The Matrix Revisited"
  ]
}
```

| Result |
|:-------|
| The Matrix Revisited |
| The Matrix |
| The Matrix Reloaded |
| The Matrix Revolutions |
| The Matrix Trilogy |

## Using Negations

Searching for exact values does not end with one or many equality conditions,
but extends to negations as well. You can search for inequality with the `!=`
operator to return everything from the View index but documents that do not
fulfill the criterion. This is also works with multiple alternatives using the
`NOT IN` operator.

Match movies that do not have the title `The Matrix`:

```aql
FOR doc IN imdb
  SEARCH ANALYZER(doc.title != "The Matrix", "identity")
  RETURN doc.title
```

| Result |
|:-------|
| … |
| null |
| null |
| "Ploning" |
| null |
| "Code Rush" |
| null |
| null |
| null |
| null |
| "Ghost in the Shell 2.0" |
| "Christmas in Wonderland" |
| null |
| … |

Note that this includes documents that do not even have a title attribute,
with the effect of returning many `null` values in the result.

Match movies that neither have the title `The Matrix` nor `The Matrix Reloaded`.
Post-filter the results to exclude implicit `null`s:

```aql
FOR doc IN imdb
  SEARCH ANALYZER(doc.title NOT IN ["The Matrix", "The Matrix Reloaded"], "identity")
  FILTER doc.title != null
  RETURN doc.title
```

| Result |
|:-------|
| Ploning |
| Code Rush |
| Ghost in the Shell 2.0 |
| Christmas in Wonderland |
| Hadashi no Gen |
| The Magician |
| … |

A better way to ignore documents without title attribute is to change the View
property `storeValues` (not to be confused with `storedValues`!) from `"none"`
to `"id"`. You can then use the [`EXISTS()` function](aql/functions-arangosearch.html#exists)
to test whether there is a title field or not. On a single server with this
particular dataset, the query is roughly five times faster than the previous
one without `EXISTS()`:

```aql
FOR doc IN imdb
  SEARCH ANALYZER(EXISTS(doc.title) AND doc.title NOT IN ["The Matrix", "The Matrix Reloaded"], "identity")
  RETURN doc.title
```

| Result |
|:-------|
| Ploning |
| Code Rush |
| Ghost in the Shell 2.0 |
| Christmas in Wonderland |
| Hadashi no Gen |
| The Magician |
| … |
