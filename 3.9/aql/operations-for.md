---
layout: default
description: The versatile FOR keyword can be used to iterate over a collection or View, all elements of an array or to traverse a graph.
title: FOR Operations in AQL
---
FOR
===

The versatile `FOR` keyword can be used to iterate over a collection or View,
all elements of an array or to traverse a graph.

## Syntax

The general syntax for iterating over collections and arrays is:

<pre><code>FOR <em>variableName</em> IN <em>expression</em></code></pre>

There is also a special variant for [graph traversals](graphs-traversals.html):

<pre><code>FOR <em>vertexVariableName</em> [, <em>edgeVariableName</em> [, <em>pathVariableName</em> ] ] IN <em>traversalExpression</em></code></pre>

For Views, there is a special (optional) [`SEARCH` keyword](operations-search.html):

<pre><code>FOR <em>variableName</em> IN <em>viewName</em> SEARCH <em>searchExpression</em></code></pre>

{% hint 'info' %}
Views cannot be used as edge collections in traversals:

```js
FOR v IN 1..3 ANY startVertex viewName /* invalid! */
```
{% endhint %}

All variants can optionally end with an `OPTIONS { … }` clause.

Usage
-----

Each array element returned by *expression* is visited exactly once. It is
required that *expression* returns an array in all cases. The empty array is
allowed, too. The current array element is made available for further processing 
in the variable specified by *variableName*.

```js
FOR u IN users
  RETURN u
```

This will iterate over all elements from the array `users` (note: this array
consists of all documents from the collection named "users" in this case) and
make the current array element available in variable `u`. `u` is not modified in
this example but simply pushed into the result using the `RETURN` keyword.

Note: When iterating over collection-based arrays as shown here, the order of
documents is undefined unless an explicit sort order is defined using a `SORT`
statement.

The variable introduced by `FOR` is available until the scope the `FOR` is
placed in is closed.

Another example that uses a statically declared array of values to iterate over:

```js
FOR year IN [ 2011, 2012, 2013 ]
  RETURN { "year" : year, "isLeapYear" : year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) }
```

Nesting of multiple `FOR` statements is allowed, too. When `FOR` statements are
nested, a cross product of the array elements returned by the individual `FOR`
statements will be created.

```js
FOR u IN users
  FOR l IN locations
    RETURN { "user" : u, "location" : l }
```

In this example, there are two array iterations: an outer iteration over the array
`users` plus an inner iteration over the array `locations`. The inner array is
traversed as many times as there are elements in the outer array.  For each
iteration, the current values of `users` and `locations` are made available for
further processing in the variable `u` and `l`.

## Options

For collections and Views, the `FOR` construct supports an optional `OPTIONS`
clause to modify behavior. The general syntax is:

<pre><code>FOR <em>variableName</em> IN <em>expression</em> OPTIONS { <em>option</em>: <em>value</em>, <em>...</em> }</code></pre>

### `indexHint`

For collections, index hints can be given to the optimizer with the `indexHint`
option. The value can be a single **index name** or a list of index names in
order of preference:

```js
FOR … IN … OPTIONS { indexHint: "byName" }
```

```js
FOR … IN … OPTIONS { indexHint: ["byName", "byColor"] }
```

Whenever there is a chance to potentially use an index for this `FOR` loop,
the optimizer will first check if the specified index can be used. In case of
an array of indexes, the optimizer will check the feasibility of each index in
the specified order. It will use the first suitable index, regardless of
whether it would normally use a different index.

If none of the specified indexes is suitable, then it falls back to its normal
logic to select another index or fails if `forceIndexHint` is enabled.

### `forceIndexHint`

Index hints are not enforced by default. If `forceIndexHint` is set to `true`,
then an error is generated if `indexHint` does not contain a usable index,
instead of using a fallback index or not using an index at all.

```js
FOR … IN … OPTIONS { indexHint: … , forceIndexHint: true }
```

### `disableIndex`

<small>Introduced in: v3.9.1</small>

In some rare cases it can be beneficial to not do an index lookup or scan,
but to do a full collection scan.
An index lookup can be more expensive than a full collection scan if
the index lookup produces many (or even all documents) and the query cannot
be satisfied from the index data alone.

Consider the following query and an index on the `value` attribute being
present:

```js
FOR doc IN collection 
  FILTER doc.value <= 99 
  RETURN doc.other
```

In this case, the optimizer will likely pick the index on `value`, because
it will cover the query's `FILTER` condition. To return the value for the
`other` attribute, the query must additionally look up the documents for
each index value that passes the `FILTER` condition. If the number of
index entries is large (close or equal to the number of documents in the
collection), then using an index can cause more work than just scanning
over all documents in the collection.

The optimizer will likely prefer index scans over full collection scans,
even if an index scan turns out to be slower in the end.
You can force the optimizer to not use an index for any given `FOR`
loop by using the `disableIndex` hint and setting it to `true`:

```js
FOR doc IN collection OPTIONS { disableIndex: true }
  FILTER doc.value <= 99
  RETURN doc.other
```

Using `disableIndex: false` has no effect on geo indexes or fulltext indexes.

Note that setting `disableIndex: true` plus `indexHint` is ambiguous. In
this case the optimizer will always prefer the `disableIndex` hint.

### `maxProjections`

<small>Introduced in: v3.9.1</small>

By default, the query optimizer will consider up to 5 document attributes
per FOR loop to be used as projections. If more than 5 attributes of a
collection are accessed in a `FOR` loop, the optimizer will prefer to 
extract the full document and not use projections.

The threshold value of 5 attributes is arbitrary and can be adjusted
by using the `maxProjections` hint.
The default value for `maxProjections` is `5`, which is compatible with the
previously hard-coded default value.

For example, using a `maxProjections` hint of 7, the following query will
extract 7 attributes as projections from the original document:

```js
FOR doc IN collection OPTIONS { maxProjections: 7 } 
  RETURN [ doc.val1, doc.val2, doc.val3, doc.val4, doc.val5, doc.val6, doc.val7 ]
```

Normally it is not necessary to adjust the value of `maxProjections`, but
there are a few corner cases where it can make sense:

- It can be beneficial to increase `maxProjections` when extracting many small
  attributes from very large documents, and a full copy of the documents should
  be avoided.
- It can be beneficial to decrease `maxProjections` to _avoid_ using
  projections, if the cost of projections is higher than doing copies of the
  full documents. This can be the case for very small documents.
