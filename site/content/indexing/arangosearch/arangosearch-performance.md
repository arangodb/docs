---
fileID: arangosearch-performance
title: Optimizing View and inverted index query performance
weight: 760
description: >-
  You can improve the performance of View and inverted index queries with a
  primary sort order, stored values and other optimizations
layout: default
---
## Primary Sort Order

Inverted indexes and `arangosearch` Views can have a primary sort order.
A direction can be specified upon their creation for each uniquely named
attribute (ascending or descending), to enable an optimization for AQL
queries which iterate over a collection or View and sort by one or multiple of the
indexed attributes. If the field(s) and the sorting direction(s) match, then the
the data can be read directly from the index without actual sort operation.

{{<  youtube id="bKeKzexInm0" >}}

`arangosearch` View definition example:

```json
{
  "links": {
    "coll1": {
      "fields": {
        "text": {
        }
      }
    },
    "coll2": {
      "fields": {
        "text": {
      }
    }
  },
  "primarySort": [
    {
      "field": "text",
      "direction": "asc"
    }
  ]
}
```

AQL query example:

```aql
FOR doc IN viewName
  SORT doc.text
  RETURN doc
```

Execution plan **without** a sorted index being used:

```aql
Execution plan:
 Id   NodeType            Est.   Comment
  1   SingletonNode          1   * ROOT
  2   EnumerateViewNode      1     - FOR doc IN viewName   /* view query */
  3   CalculationNode        1       - LET #1 = doc.`text`   /* attribute expression */
  4   SortNode               1       - SORT #1 ASC   /* sorting strategy: standard */
  5   ReturnNode             1       - RETURN doc
```

Execution plan with a the primary sort order of the index being utilized:

```aql
Execution plan:
 Id   NodeType            Est.   Comment
  1   SingletonNode          1   * ROOT
  2   EnumerateViewNode      1     - FOR doc IN viewName SORT doc.`text` ASC   /* view query */
  5   ReturnNode             1       - RETURN doc
```

To define more than one attribute to sort by, simply provide multiple
sub-objects in the `primarySort` array:

```json
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
```

You can also define a primary sort order for inverted indexes and utilize it
via a `search-alias` View:

```js
db.coll.ensureIndex({
  name: "inv-idx",
  type: "inverted",
  fields: ["text", "date"],
  primarySort: {
    fields: [
      { field: "date", direction: "desc" },
      { field: "text", direction: "asc" }
    ]
  }
});
```

AQL query example:

```aql
FOR doc IN coll OPTIONS { indexHint: "inv-idx", forceIndexHint: true }
  SORT doc.name
  RETURN doc
```

If you add the inverted index to a `search-alias` View, then the query example
is the same as for the `arangosearch` View:

```js
db._createView("viewName", "search-alias", { indexes: [
  { collection: "coll", index: "inv-idx" }
] });

db._query(`FOR doc IN viewName
  SORT doc.text
  RETURN doc`);
```

The optimization can be applied to queries which sort by both fields as
defined (`SORT doc.date DESC, doc.name`), but also if they sort in descending
order by the `date` attribute only (`SORT doc.date DESC`). Queries which sort
by `text` alone (`SORT doc.name`) are not eligible, because the index is sorted
by `date` first. This is similar to persistent indexes, but inverted sorting
directions are not covered by the View index
(e.g. `SORT doc.date, doc.name DESC`).

Note that the `primarySort` option is immutable: it can not be changed after
View creation. Index definitions are generally immutable, so it cannot be
changed for inverted indexes after creation either.

The primary sort data is LZ4 compressed by default.
- `arangosearch` Views: `primarySortCompression: "lz4"`
- Inverted indexes: `primarySort: { compression: "lz4" }`

Set it to `"none"` on View or index creation to trade space for speed. 

## Stored Values

It is possible to directly store the values of document attributes in View
indexes with the View property `storedValues` (not to be confused with
`storeValues`).

View indexes may fully cover `SEARCH` queries for improved performance.
While late document materialization reduces the amount of fetched documents,
this optimization can avoid to access the storage engine entirely.

_`arangosearch` View:_

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

_`search-alias` View:_

```js
db.articles.ensureIndex({
  name: "inv-idx",
  type: "inverted",
  fields: ["categories"],
  primarySort: {
    fields: [
      { field: "publishedAt", direction: "desc" }
    ]
  },
  storedValues: [
    {
      fields: [ "title", "categories" ]
    }
  ]
});

db._createView("articlesView", "search-alias", { indexes: [
  { collection: "articles", index: "inv-idx" }
] });
```

In above View definitions, the document attribute *categories* is indexed for
searching, *publishedAt* is used as primary sort order and *title* as well as
*categories* are stored in the View using the new `storedValues` property.

```aql
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

```aql
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

## Condition Optimization Options

The `SEARCH` operation in AQL accepts an option `conditionOptimization` to
give you control over the search criteria optimization:

```aql
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

Also see [SEARCH operation](../../aql/high-level-operations/operations-search#search-options).

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

```aql
FOR doc IN viewName
  SEARCH doc.name == "Carol"
  OPTIONS { countApproximate: "cost" }
  COLLECT WITH COUNT INTO count
  RETURN count
```

<!-- TODO: The Analyzer feature "norm" has some performance implications -->
