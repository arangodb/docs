---
layout: default
description: The RETURN statement can be used to produce the result of a query
---
RETURN
======

The `RETURN` statement can be used to produce the result of a query.
It is mandatory to specify a `RETURN` statement at the end of each block in a
data-selection query, otherwise the query result would be undefined. Using 
`RETURN` on the main level in data-modification queries is optional.

Syntax
------

The general syntax for `RETURN` is:

<pre><code>RETURN <em>expression</em></code></pre>

There is also a variant [`RETURN DISTINCT`](#return-distinct).

The *expression* returned by `RETURN` is produced for each iteration in the block the
`RETURN` statement is placed in. That means the result of a `RETURN` statement
is **always an array**. This includes an empty array if no documents matched the
query and a single return value returned as array with one element.

To return all elements from the currently iterated array without modification,
the following simple form can be used:

<pre><code>FOR <em>variableName</em> IN <em>expression</em>
  RETURN <em>variableName</em></code></pre>

As `RETURN` allows specifying an expression, arbitrary computations can be
performed to calculate the result elements. Any of the variables valid in the
scope the `RETURN` is placed in can be used for the computations.

Usage
-----

To iterate over all documents of a collection called *users* and return the
full documents, you can write:

```aql
FOR u IN users
  RETURN u
```

In each iteration of the for-loop, a document of the *users* collection is
assigned to a variable *u* and returned unmodified in this example. To return
only one attribute of each document, you could use a different return expression:

```aql
FOR u IN users
  RETURN u.name
```

Or to return multiple attributes, an object can be constructed like this:

```aql
FOR u IN users
  RETURN { name: u.name, age: u.age }
```

Note: `RETURN` will close the current scope and eliminate all local variables in it.
This is important to remember when working with [subqueries](examples-combining-queries.html).

[Dynamic attribute names](fundamentals-data-types.html#objects--documents) are
supported as well:

```aql
FOR u IN users
  RETURN { [ u._id ]: u.age }
```

The document *_id* of every user is used as expression to compute the
attribute key in this example:

```json
[
  {
    "users/9883": 32
  },
  {
    "users/9915": 27
  },
  {
    "users/10074": 69
  }
]
```

The result contains one object per user with a single key/value pair each.
This is usually not desired. For a single object, that maps user IDs to ages,
the individual results need to be merged and returned with another `RETURN`:

```aql
RETURN MERGE(
  FOR u IN users
    RETURN { [ u._id ]: u.age }
)
```

```json
[
  {
    "users/10074": 69,
    "users/9883": 32,
    "users/9915": 27
  }
]
```

Keep in mind that if the key expression evaluates to the same value multiple
times, only one of the key/value pairs with the duplicate name will survive
[MERGE()](functions-document.html#merge). To avoid this, you can go without
dynamic attribute names, use static names instead and return all document
properties as attribute values:

```aql
FOR u IN users
  RETURN { name: u.name, age: u.age }
```

```json
[
  {
    "name": "John Smith",
    "age": 32
  },
  {
    "name": "James Hendrix",
    "age": 69
  },
  {
    "name": "Katie Foster",
    "age": 27
  }
]
```

`RETURN DISTINCT`
-----------------

`RETURN` can optionally be followed by the `DISTINCT` keyword.
The `DISTINCT` keyword will ensure uniqueness of the values returned by the
`RETURN` statement:

<pre><code>FOR <em>variableName</em> IN <em>expression</em>
  RETURN DISTINCT <em>expression</em></code></pre>

`RETURN DISTINCT` is not allowed on the top-level of a query if there is no `FOR`
loop preceding it.

Below example returns `["foo", "bar", "baz"]`:

```aql
FOR value IN ["foo", "bar", "bar", "baz", "foo"]
  RETURN DISTINCT value
```

{% hint 'tip' %}
`RETURN DISTINCT` will not change the order of the results it is applied on,
unlike [`COLLECT`](operations-collect.html#collect-vs-return-distinct).
{% endhint %}

If the `DISTINCT` is applied on an expression that itself is an array or a subquery, 
the `DISTINCT` will not make the values in each array or subquery result unique, but instead
ensure that the result contains only distinct arrays or subquery results. To make
the result of an array or a subquery unique, simply apply the `DISTINCT` for the
array or the subquery.

For example, the following query will apply `DISTINCT` on its subquery results,
but not inside the subquery:

```aql
FOR what IN 1..2
  RETURN DISTINCT (
    FOR i IN [ 1, 2, 3, 4, 1, 3 ] 
      RETURN i
  )
```

Here we will have a `FOR` loop with two iterations that each execute a subquery. The
`DISTINCT` here is applied on the two subquery results. Both subqueries return the
same result value (that is `[ 1, 2, 3, 4, 1, 3 ]`), so after `DISTINCT` there will
only be one occurrence of the value `[ 1, 2, 3, 4, 1, 3 ]` left:

```json
[
  [ 1, 2, 3, 4, 1, 3 ]
]
```

If the goal is to apply the `DISTINCT` inside the subquery, it needs to be moved
there:

```aql
FOR what IN 1..2
  LET sub = (
    FOR i IN [ 1, 2, 3, 4, 1, 3 ] 
      RETURN DISTINCT i
  ) 
  RETURN sub
```

In the above case, the `DISTINCT` will make the subquery results unique, so that
each subquery will return a unique array of values (`[ 1, 2, 3, 4 ]`). As the subquery
is executed twice and there is no `DISTINCT` on the top-level, that array will be
returned twice:

```json
[
  [ 1, 2, 3, 4 ],
  [ 1, 2, 3, 4 ]
]
```
