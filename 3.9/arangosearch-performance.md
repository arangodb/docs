---
layout: default
description: You can improve the performance of View queries with a primary sort order, stored values and other optimizations
title: ArangoSearch View Query Performance Optimization
---
# Optimizing View Query Performance

{{ page.description }}
{:class="lead"}

## Primary Sort Order

The index behind an ArangoSearch View can have a primary sort order.
A direction can be specified upon View creation for each uniquely named
attribute (ascending or descending), to enable an optimization for AQL
queries which iterate over a View and sort by one or multiple of the
attributes. If the field(s) and the sorting direction(s) match then the
the data can be read directly from the index without actual sort operation.

{% include youtube.html id="bKeKzexInm0" %}

View definition example:

```json
{
  "links": {
    "coll1": {
      "fields": {
        "text": {}
      }
    },
    "coll2": {
      "fields": {
        "text": {}
      }
    },
    "primarySort": [
      {
        "field": "text",
        "direction": "asc"
      }
    ]
  }
}
```

AQL query example:

```js
FOR doc IN viewName
  SORT doc.name
  RETURN doc
```

Execution plan **without** a sorted index being used:

```
Execution plan:
 Id   NodeType            Est.   Comment
  1   SingletonNode          1   * ROOT
  2   EnumerateViewNode      1     - FOR doc IN viewName   /* view query */
  3   CalculationNode        1       - LET #1 = doc.`val`   /* attribute expression */
  4   SortNode               1       - SORT #1 ASC   /* sorting strategy: standard */
  5   ReturnNode             1       - RETURN doc
```

Execution plan with a the primary sort order of the index being utilized:

```
Execution plan:
 Id   NodeType            Est.   Comment
  1   SingletonNode          1   * ROOT
  2   EnumerateViewNode      1     - FOR doc IN viewName SORT doc.`val` ASC   /* view query */
  5   ReturnNode             1       - RETURN doc
```

To define more than one attribute to sort by, simply add more sub-objects to
the `primarySort` array:

```json
{
  "links": {
    "coll1": {
      "fields": {
        "text": {},
        "date": {}
      }
    },
    "coll2": {
      "fields": {
        "text": {}
      }
    },
    "primarySort": [
      {
        "field": "date",
        "direction": "desc"
      },
      {
        "field": "text",
        "direction": "asc"
      }
    ]
  }
}
```

The optimization can be applied to View queries which sort by both fields as
defined (`SORT doc.date DESC, doc.name`), but also if they sort in descending
order by the `date` attribute only (`SORT doc.date DESC`). Queries which sort
by `text` alone (`SORT doc.name`) are not eligible, because the View is sorted
by `date` first. This is similar to persistent indexes, but inverted sorting
directions are not covered by the View index
(e.g. `SORT doc.date, doc.name DESC`).

Note that the `primarySort` option is immutable: it can not be changed after
View creation. It is therefore not possible to configure it through the Web UI.
The View needs to be created via the HTTP or JavaScript API (arangosh) to set it.

The primary sort data is LZ4 compressed by default (`primarySortCompression` is
`"lz4"`). Set it to `"none"` on View creation to trade space for speed.

You can additionally set the `primarySortCache` option to `true` to always cache
the primary sort columns in memory, which can improve the query performance:

```json
{
  "links": {
    "coll1": {
      "fields": {
        "text": {},
        "date": {}
      }
    },
    "coll2": {
      "fields": {
        "text": {}
      }
    },
    "primarySort": [
      {
        "field": "date",
        "direction": "desc"
      },
      {
        "field": "text",
        "direction": "asc"
      }
    ],
    "primarySortCache": true
  }
}
```

See the [`primarySortCache` View property](arangosearch-views.html#view-properties)
for details.

## Stored Values

It is possible to directly store the values of document attributes in View
indexes with the View property `storedValues` (not to be confused with
`storeValues`).

View indexes may fully cover `SEARCH` queries for improved performance.
While late document materialization reduces the amount of fetched documents,
this optimization can avoid to access the storage engine entirely.

```json
{
  "links": {
    "articles": {
      "fields": {
        "categories": {}
      }
    }
  },
  "primarySort": [
    { "field": "publishedAt", "direction": "desc" }
  ],
  "storedValues": [
    { "fields": [ "title", "categories" ] }
  ],
  ...
}
```

In above View definition, the document attribute *categories* is indexed for
searching, *publishedAt* is used as primary sort order and *title* as well as
*categories* are stored in the View using the new `storedValues` property.

```js
FOR doc IN articlesView
  SEARCH doc.categories == "recipes"
  SORT doc.publishedAt DESC
  RETURN {
    title: doc.title,
    date: doc.publishedAt,
    tags: doc.categories
  }
```

The query searches for articles which contain a certain tag in the *categories*
array and returns title, date and tags. All three values are stored in the View
(`publishedAt` via `primarySort` and the two other via `storedValues`), thus
no documents need to be fetched from the storage engine to answer the query.
This is shown in the execution plan as a comment to the *EnumerateViewNode*:
`/* view query without materialization */`

```js
Execution plan:
 Id   NodeType            Est.   Comment
  1   SingletonNode          1   * ROOT
  2   EnumerateViewNode      1     - FOR doc IN articlesView SEARCH (doc.`categories` == "recipes") SORT doc.`publishedAt` DESC LET #1 = doc.`publishedAt` LET #7 = doc.`categories` LET #5 = doc.`title`   /* view query without materialization */
  5   CalculationNode        1       - LET #3 = { "title" : #5, "date" : #1, "tags" : #7 }   /* simple expression */
  6   ReturnNode             1       - RETURN #3

Indexes used:
 none

Optimization rules applied:
 Id   RuleName
  1   move-calculations-up
  2   move-calculations-up-2
  3   handle-arangosearch-views
```

You can additionally enable the ArangoSearch column cache for stored values by
setting the `cache` option in the `storedValues` definition to `true`:

```json
{
  "links": {
    "articles": {
      "fields": {
        "categories": {}
      }
    }
  },
  "primarySort": [
    { "field": "publishedAt", "direction": "desc" }
  ],
  "storedValues": [
    { "fields": [ "title", "categories" ], "cache": true }
  ],
  ...
}
```

The stored are always cached in memory with this option enabled, which can
improve the query performance.

See the [`storedValues` View property](arangosearch-views.html#view-properties)
for details.

## Condition Optimization Options

The `SEARCH` operation in AQL accepts an option `conditionOptimization` to
give you control over the search criteria optimization:

```js
FOR doc IN myView
  SEARCH doc.val > 10 AND doc.val > 5 /* more conditions */
  OPTIONS { conditionOptimization: "none" }
  RETURN doc
```

By default, all conditions get converted into disjunctive normal form (DNF).
Numerous optimizations can be applied, like removing redundant or overlapping
conditions (such as `doc.val > 10` which is included by `doc.val > 5`).
However, converting to DNF and optimizing the conditions can take quite some
time even for a low number of nested conditions which produce dozens of
conjunctions / disjunctions. It can be faster to just search the index without
optimizations.

Also see [SEARCH operation](aql/operations-search.html#search-options).

## Count Approximation

The `SEARCH` operation in AQL accepts an option `countApproximate` to control
how the total count of rows is calculated if the `fullCount` option is enabled
for a query or when a `COLLECT WITH COUNT` clause is executed.

By default, rows are actually enumerated for a precise count. In some cases, an
estimate might be good enough, however. You can set `countApproximate` to
`"cost"` for a cost based approximation. It does not enumerate rows and returns
an approximate result with O(1) complexity. It gives a precise result if the
`SEARCH` condition is empty or if it contains a single term query only
(e.g. `SEARCH doc.field == "value"`), the usual eventual consistency
of Views aside.

```js
FOR doc IN viewName
  SEARCH doc.name == "Carol"
  OPTIONS { countApproximate: "cost" }
  COLLECT WITH COUNT INTO count
  RETURN count
```

## Field normalization value caching

<small>Introduced in: v3.9.5</small>

{% include hint-ee.md feature="ArangoSearch caching" %}

Normalization values are computed for fields which are processed with Analyzers
that have the [`"norm"` feature](analyzers.html#analyzer-features) enabled.
These values are used to score fairer if the same tokens occur repeatedly, to
emphasize these documents less.

You can set the `cache` option to `true` for individual View links or fields to always
cache the field normalization values in memory. This can improve the performance
of scoring and ranking queries:

```json
{
  "links": {
    "coll1": {
      "fields": {
        "categories": {
          "analyzers": ["text_en"],
          "cache": true
        }
      }
    },
    "coll2": {
      "includeAllFields": true,
      "analyzers": ["text_en"],
      "cache": true
    }
  }
}
```

See the [`cache` Link property](arangosearch-views.html#link-properties)
for details.

The `"norm"` Analyzer feature has performance implications even if the cache is
used. You can create custom Analyzers without this feature to disable the
normalization and improve the performance. Make sure that the result ranking
still matches your expectations without normalization. It is recommended to
use normalization for a good scoring behavior.

## Primary key caching

<small>Introduced in: v3.9.6</small>

You can set the `primaryKeyCache` View property to `true` to always cache the
the primary key columns in memory. This can improve the performance of queries
that return many documents:

```json
{
  "links": {
    "articles": {
      "fields": {
        "categories": {}
      }
    }
  },
  "primaryKeyCache": true,
  ...
}
```

See the [`primaryKeyCache` View property](arangosearch-views.html#view-properties)
for details.
