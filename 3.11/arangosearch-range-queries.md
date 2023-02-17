---
layout: default
description: Match values that are above, below or between a minimum and a maximum value
title: ArangoSearch Range Query Examples
---
# Range Queries with ArangoSearch

{{ page.description }}
{:class="lead"}

The primary use case for range queries is to search **numeric** values in
documents that are
- greater than (exclusive),
- greater than or equal (inclusive),
- less than (exclusive),
- less than or equal (inclusive) to a reference number, or
- between two numbers (inclusive or exclusive)

Range queries are also possible for string values.

## Comparing to a Number

Numbers are not processed by Analyzers. They even bypass the `identity`
Analyzer. Therefore, you do not need to specify Analyzers in View definitions
and no Analyzer context in queries with the `ANALYZER()` function for numeric
fields.

### Dataset

[IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)

### View definition

#### `search-alias` View

```js
db.imdb_vertices.ensureIndex({ name: "inv-exact-runtime", type: "inverted", fields: [ "runtime" ] });
db._createView("imdb", "search-alias", { indexes: [ { collection: "imdb_vertices", index: "inv-exact-runtime" } ] });
```

#### `arangosearch` View

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "runtime": { }
      }
    }
  }
}
```

You can add a field with an empty object `{}` as shown above, or explicitly set
no Analyzer using an empty array `[]` as shown below.

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "runtime": {
          "analyzers": [ ]
        }
      }
    }
  }
}
```

### AQL queries

Match movies with a runtime of exactly `5` minutes:

```aql
FOR doc IN imdb
  SEARCH doc.runtime == 5
  RETURN {
    title: doc.title,
    runtime: doc.runtime
  }
```

| title | runtime |
|:------|:--------|
| The Spirit of Christmas | 5 |
| Super Rhino | 5 |
| Gone Nutty | 5 |
| She and Her Cat | 5 |
| … | … |

Note that no Analyzer context is set as numeric values are not processed by
Analyzers at all.

Match movies with a runtime of `12`, `24` or `77` minutes:

```aql
FOR doc IN imdb
  SEARCH doc.runtime IN [12, 24, 77]
  RETURN {
    title: doc.title,
    runtime: doc.runtime
  }
```

| title | runtime |
|:------|:--------|
| Frankenstein Punk | 12 |
| The Vagabond | 24 |
| The Rescuers Down Under | 77 |
| The Olsen Gang | 77 |

Match movies with a runtime over `300` minutes and sort them from longest to
shortest runtime:

```aql
FOR doc IN imdb
  SEARCH doc.runtime > 300
  SORT doc.runtime DESC
  RETURN {
    title: doc.title,
    runtime: doc.runtime
  }
```

| title | runtime |
|:------|:--------|
| Planet of the Apes Series | 605 |
| North and South | 561 |
| Into the West | 552 |
| … | … |
| The Manns - Novel of a Century | 312 |
| Legenda o Tile | 311 |
| Nárcisz és Psyché | 302 |

Any of the following comparison operators can be used: `>`, `>=`, `<`, `<=`,
`==`, `!=`, `IN`, `NOT IN`.

## Comparing to a Numeric Range

While you can combine a greater than (or equal) and a less than (or equal)
condition with a logical `AND`, it is more efficient to perform such range
queries using a single condition. You can use the range operator `..` to query
for an inclusive range of values. You can also use the
[`IN_RANGE()` function](aql/functions-arangosearch.html#in_range) that allows
you to specify individually whether the minimum and maximum value shall be
included or excluded in the range.

### AQL queries

Match movies with a runtime of `4` to `6` minutes with the range operator:

```aql
FOR doc IN imdb
  SEARCH doc.runtime IN 4..6
  RETURN {
    title: doc.title,
    runtime: doc.runtime
  }
```

| title | runtime |
|:------|:--------|
| Katedra | 6 |
| The Spirit of Christmas | 4 |
| The Spirit of Christmas | 5 |
| Hell's Bells | 6 |
| … | … |

While the dataset only has whole numbers, this query would also find decimal
fractions within the defined range, e.g. `5.5`. This is different to how
`FILTER doc.runtime IN 4..6` works, which defines an integer range and only
matches `4`, `5` and `6`.

Match movies with a runtime of `4` to `6` minutes with the `IN_RANGE()`
function (inclusive on both ends):

```aql
FOR doc IN imdb
  SEARCH IN_RANGE(doc.runtime, 4, 6, true, true)
  RETURN {
    title: doc.title,
    runtime: doc.runtime
  }
```

| title | runtime |
|:------|:--------|
| Katedra | 6 |
| The Spirit of Christmas | 4 |
| The Spirit of Christmas | 5 |
| Hell's Bells | 6 |
| … | … |

The standard comparison operators are still necessary for other kinds of range
queries, such as for searching for values below and above a range. It is
possible to express this with `IN_RANGE()` and a negation (`NOT`), but it is
less efficient than using two comparisons and the negation makes it include
documents that do not have a runtime attribute (implicitly `null`).

Match movies with a runtime of `5` minutes or less, as well as `500` minutes
or more, but not with a runtime of `0` minutes. Sort the matches by runtime in
ascending order:

```aql
FOR doc IN imdb
  SEARCH (doc.runtime <= 5 OR doc.runtime >= 500) AND doc.runtime != 0
  SORT doc.runtime
  RETURN {
    title: doc.title,
    runtime: doc.runtime
  }
```

| title | runtime |
|:------|:--------|
| La Sortie des usines Lumière | 1 |
| L'Arrivée d'un train à la Ciotat | 1 |
| … | … |
| Zippeldy & Fetterig | 5 |
| Coda | 5 |
| WWE: Greatest Wrestling Stars of the '90s | 540 |
| Shogun | 547 |
| Into the West | 552 |
| North and South | 561 |
| Planet of the Apes Series | 605 |

The search expression could alternative be written in the following ways
with the same result:

- `doc.runtime > 0 AND doc.runtime <= 5 OR doc.runtime >= 500`
- `IN_RANGE(doc.runtime, 0, 5, false, true) OR doc.runtime >= 500`
- `NOT(IN_RANGE(doc.runtime, 5, 500, false, false)) AND doc.runtime > 0`

## Comparing Strings

Comparison operators and the `IN_RANGE()` function can also be used with
strings. Beware that the results can be unexpected in some cases, because the
internal sort order of ArangoSearch is different to how `FILTER`, `SORT` and
other operations work.

{% hint 'warning' %}
The alphabetical order of characters is not taken into account by ArangoSearch,
i.e. range queries in SEARCH operations against Views will not follow the
language rules as per the defined Analyzer locale (except for the
[`collation` Analyzer](analyzers.html#collation)) nor the server language
(startup option `--default-language`)!
Also see [Known Issues](release-notes-known-issues311.html#arangosearch).
{% endhint %}

### View definition

#### `search-alias` View

```js
db.imdb_vertices.ensureIndex({ name: "inv-exact-name", type: "inverted", fields: [ "name" ] });
db._createView("imdb", "search-alias", { indexes: [ { collection: "imdb_vertices", index: "inv-exact-name" } ] });
```

#### `arangosearch` View

```json
{
  "links": {
    "imdb_vertices": {
      "fields": {
        "name": {
          "analyzers": [ "identity" ]
        }
      }
    }
  }
}
```

**AQL queries**

Match movies where the name is `>= Wu` and `< Y`:

```aql
FOR doc IN imdb
  SEARCH IN_RANGE(doc.name, "Wu", "Y", true, false)
  RETURN doc.name
```

| Result |
|:-------|
| … |
| Wu Zun |
| Xiong Xin-Xin |
| Wyatt |
| Xander Berkeley |
| Xzibit |
| Xian Gao |
| Wylie Watson |
| Wyclef Jean |
| … |
