---
layout: default
description: The SORT statement will force a sort of the array of already producedintermediate results in the current block
---

SORT
====

The `SORT` statement will force a sort of the array of already produced
intermediate results in the current block. `SORT` allows specifying one or
multiple sort criteria and directions.

Syntax
------

The general syntax is:

<pre><code>SORT <em>expression</em> <em>direction</em></code></pre>

Usage
-----

Example query that is sorting by lastName (in ascending order), then firstName
(in ascending order), then by id (in descending order):

```js
FOR u IN users
  SORT u.lastName, u.firstName, u.id DESC
  RETURN u
```

Specifying the *direction* is optional. The default (implicit) direction for a
sort expression is the ascending order. To explicitly specify the sort direction, 
the keywords `ASC` (ascending) and `DESC` can be used. Multiple sort criteria can be
separated using commas. In this case the direction is specified for each
expression separately. For example

```js
SORT doc.lastName, doc.firstName
```

will first sort documents by lastName in ascending order and then by
firstName in ascending order.

```js
SORT doc.lastName DESC, doc.firstName
```

will first sort documents by lastName in descending order and then by
firstName in ascending order.

```js
SORT doc.lastName, doc.firstName DESC
```

will first sort documents by lastName in ascending order and then by
firstName in descending order.


{% hint 'warning' %}
When iterating over collection-based arrays, the order of documents is
always **undefined unless an explicit sort order is defined** using `SORT`.
{% endhint %}

Constant `SORT` expressions can be used to indicate that no particular
sort order is desired.

```js
SORT null
```

Constant `SORT` expressions will be optimized away by the AQL
optimizer during optimization, but specifying them explicitly may enable further
optimizations if the optimizer does not need to take into account any particular
sort order. This is especially the case after a `COLLECT` statement, which is 
supposed to produce a sorted result. Specifying an extra `SORT null` after the
`COLLECT` statement allows to AQL optimizer to remove the post-sorting of the
collect results altogether. Also see [`COLLECT` option `method`](operations-collect.html#method).

Constant `SORT` expressions will be optimized away by the AQL
optimizer during optimization, but specifying them explicitly may enable further
optimizations if the optimizer does not need to take into account any particular
sort order. This is especially the case after a `COLLECT` statement, which is
supposed to produce a sorted result. Specifying an extra `SORT null` after the
`COLLECT` statement allows to AQL optimizer to remove the post-sorting of the
collect results altogether. Also see [`COLLECT` option `method`](operations-collect.html#method).

In case of a sequence of SORT expressions, the last one will always be the one
that will be performed, unless a former SORT expressions is more accurate.
If the optimization rules `remove-redundant-sorts` and `remove-redundant-sorts-2`
are deactivated in the query's execution, then the last SORT will always be the one
that winds, despite the accuracy.
As in the example:
```aql
FOR friend in friends SORT friend.friend.name, friend.id, friend.age 
SORT friend.age, friend.id SORT friend.age
RETURN friend
```
In the example above, we start with the last SORT. If the optimization rules
mentioned above are deactivated, then this is the SORT that will operate, and
the collection will be sorted by the field `friend.age`.        
Otherwise, if the rules are activated, then the second SORT will be the one that
operates, because it covers the same field, `friend.age`, but with an extra one,
making it more accurate. If the fields in the second SORT were in opposite order,
as in `SORT friend.id, friend.age`, then the last SORT would win.

