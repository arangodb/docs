---
fileID: advanced-array-operators
title: Array Operators
weight: 3785
description: 
layout: default
---
## Array expansion

In order to access a named attribute from all elements in an array easily, AQL
offers the shortcut operator `[*]` for array variable expansion.

Using the `[*]` operator with an array variable will iterate over all elements 
in the array, thus allowing to access a particular attribute of each element.  It is
required that the expanded variable is an array.  The result of the `[*]`
operator is again an array.

To demonstrate the array expansion operator, let's go on with the following three 
example *users* documents:

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "name": "john",
    "age": 35,
    "friends": [
      { "name": "tina", "age": 43 },
      { "name": "helga", "age": 52 },
      { "name": "alfred", "age": 34 }
    ]
  },
  {
    "name": "yves",
    "age": 24,
    "friends": [
      { "name": "sergei", "age": 27 },
      { "name": "tiffany", "age": 25 }
    ]
  },
  {
    "name": "sandra",
    "age": 40,
    "friends": [
      { "name": "bob", "age": 32 },
      { "name": "elena", "age": 48 }
    ]
  }
]
```
{{% /tab %}}
{{< /tabs >}}

With the `[*]` operator it becomes easy to query just the names of the
friends for each user:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
  RETURN { name: u.name, friends: u.friends[*].name }
```
{{% /tab %}}
{{< /tabs >}}

This will produce:

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  { "name" : "john", "friends" : [ "tina", "helga", "alfred" ] },
  { "name" : "yves", "friends" : [ "sergei", "tiffany" ] },
  { "name" : "sandra", "friends" : [ "bob", "elena" ] }
]
```
{{% /tab %}}
{{< /tabs >}}

This is a shortcut for the longer, semantically equivalent query:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
  RETURN { name: u.name, friends: (FOR f IN u.friends RETURN f.name) }
```
{{% /tab %}}
{{< /tabs >}}

## Array contraction

In order to collapse (or flatten) results in nested arrays, AQL provides the `[**]` 
operator. It works similar to the `[*]` operator, but additionally collapses nested
arrays.

How many levels are collapsed is determined by the amount of asterisk characters used.
`[**]` collapses one level of nesting - just like `FLATTEN(array)` or `FLATTEN(array, 1)`
would do -, `[***]` collapses two levels - the equivalent to `FLATTEN(array, 2)` - and
so on.

Let's compare the array expansion operator with an array contraction operator.
For example, the following query produces an array of friend names per user:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
  RETURN u.friends[*].name
```
{{% /tab %}}
{{< /tabs >}}

As we have multiple users, the overall result is a nested array:

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  [
    "tina",
    "helga",
    "alfred"
  ],
  [
    "sergei",
    "tiffany"
  ],
  [
    "bob",
    "elena"
  ]
]
```
{{% /tab %}}
{{< /tabs >}}

If the goal is to get rid of the nested array, we can apply the `[**]` operator on the 
result. But simply appending `[**]` to the query won't help, because *u.friends*
is not a nested (multi-dimensional) array, but a simple (one-dimensional) array. Still, 
the `[**]` can be used if it has access to a multi-dimensional nested result.

We can extend above query as follows and still create the same nested result:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN (
  FOR u IN users RETURN u.friends[*].name
)
```
{{% /tab %}}
{{< /tabs >}}

By now appending the `[**]` operator at the end of the query...

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN (
  FOR u IN users RETURN u.friends[*].name
)[**]
```
{{% /tab %}}
{{< /tabs >}}

... the query result becomes:

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  [
    "tina",
    "helga",
    "alfred",
    "sergei",
    "tiffany",
    "bob",
    "elena"
  ]
]
```
{{% /tab %}}
{{< /tabs >}}

Note that the elements are not de-duplicated. For a flat array with only unique
elements, a combination of [UNIQUE()](../functions/functions-array#unique) and
[FLATTEN()](../functions/functions-array#flatten) is advisable.

## Inline expressions

It is possible to filter elements while iterating over an array, to limit the amount
of returned elements and to create a projection using the current array element.
Sorting is not supported by this shorthand form.

These inline expressions can follow array expansion and contraction operators
`[* ...]`, `[** ...]` etc. The keywords `FILTER`, `LIMIT` and `RETURN`
must occur in this order if they are used in combination, and can only occur once:

<code><em>anyArray</em>[* FILTER <em>conditions</em> LIMIT <em>skip</em>,<em>limit</em> RETURN <em>projection</em>]</code>

Example with nested numbers and array contraction:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
LET arr = [ [ 1, 2 ], 3, [ 4, 5 ], 6 ]
RETURN arr[** FILTER CURRENT % 2 == 0]
```
{{% /tab %}}
{{< /tabs >}}

All even numbers are returned in a flat array:

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  [ 2, 4, 6 ]
]
```
{{% /tab %}}
{{< /tabs >}}

Complex example with multiple conditions, limit and projection:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
    RETURN {
        name: u.name,
        friends: u.friends[* FILTER CONTAINS(CURRENT.name, "a") AND CURRENT.age > 40
            LIMIT 2
            RETURN CONCAT(CURRENT.name, " is ", CURRENT.age)
        ]
    }
```
{{% /tab %}}
{{< /tabs >}}

No more than two computed strings based on *friends* with an `a` in their name and
older than 40 years are returned per user:

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "name": "john",
    "friends": [
      "tina is 43",
      "helga is 52"
    ]
  },
  {
    "name": "sandra",
    "friends": [
      "elena is 48"
    ]
  },
  {
    "name": "yves",
    "friends": []
  }
]
```
{{% /tab %}}
{{< /tabs >}}

### Inline filter

To return only the names of friends that have an *age* value
higher than the user herself, an inline `FILTER` can be used:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
  RETURN { name: u.name, friends: u.friends[* FILTER CURRENT.age > u.age].name }
```
{{% /tab %}}
{{< /tabs >}}

The pseudo-variable *CURRENT* can be used to access the current array element.
The `FILTER` condition can refer to *CURRENT* or any variables valid in the
outer scope.

### Inline limit

The number of elements returned can be restricted with `LIMIT`. It works the same
as the [limit operation](../high-level-operations/operations-limit). `LIMIT` must come after `FILTER`
and before `RETURN`, if they are present.

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
  RETURN { name: u.name, friends: u.friends[* LIMIT 1].name }
```
{{% /tab %}}
{{< /tabs >}}

Above example returns one friend each:

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  { "name": "john", "friends": [ "tina" ] },
  { "name": "sandra", "friends": [ "bob" ] },
  { "name": "yves", "friends": [ "sergei" ] }
]
```
{{% /tab %}}
{{< /tabs >}}

A number of elements can also be skipped and up to *n* returned:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
  RETURN { name: u.name, friends: u.friends[* LIMIT 1,2].name }
```
{{% /tab %}}
{{< /tabs >}}

The example query skips the first friend and returns two friends at most
per user:

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  { "name": "john", "friends": [ "helga", "alfred" ] },
  { "name": "sandra", "friends": [ "elena" ] },
  { "name": "yves", "friends": [ "tiffany" ] }
]
```
{{% /tab %}}
{{< /tabs >}}

### Inline projection

To return a projection of the current element, use `RETURN`. If a `FILTER` is
also present, `RETURN` must come later.

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
  RETURN u.friends[* RETURN CONCAT(CURRENT.name, " is a friend of ", u.name)]
```
{{% /tab %}}
{{< /tabs >}}

The above will return:

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  [
    "tina is a friend of john",
    "helga is a friend of john",
    "alfred is a friend of john"
  ],
  [
    "sergei is a friend of yves",
    "tiffany is a friend of yves"
  ],
  [
    "bob is a friend of sandra",
    "elena is a friend of sandra"
  ]
]
```
{{% /tab %}}
{{< /tabs >}}

## Question mark operator

You can use the `[? ... ]` operator on arrays to check whether the elements
fulfill certain criteria, and you can specify how often they should be satisfied.
The operator is similar to an inline filter but with an additional length check
and it evaluates to `true` or `false`.

The following example shows how to check whether two of numbers in the array
are even:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
LET arr = [ 1, 2, 3, 4 ]
RETURN arr[? 2 FILTER CURRENT % 2 == 0] // true
```
{{% /tab %}}
{{< /tabs >}}

The number `2` after the `?` is the quantifier. It is optional and defaults to
`ANY`. The following quantifiers are supported:

- Integer numbers for exact quantities (e.g. `2`)
- Number ranges for a quantity between the two values (e.g. `2..3`)
- `NONE` (equivalent to `0`)
- `ANY`
- `ALL`
- `AT LEAST`

The quantifier needs to be followed by a `FILTER` operation if you want to specify
conditions. You can refer to the current array element via the `CURRENT`
pseudo-variable in the filter expression. If you leave out the quantifier and
`FILTER` operation (only `arr[?]`), then `arr` is checked whether it is an array
and if it has at least one element.

The question mark operator is a shorthand for an inline filter with a
surrounding length check. The following table compares both variants:

| Question mark operator | Inline filter with length check |
|:-----------------------|:--------------------------------|
| `arr[? <number> FILTER <conditions>]` | `LENGTH(arr[* FILTER <conditions>]) == <number>`
| `arr[? <min>..<max> FILTER <conditions>]` | `IN_RANGE(LENGTH(arr[* FILTER <conditions>]), <min>, <max>, true, true)`
| `arr[? NONE FILTER <conditions>]` | `LENGTH(arr[* FILTER <conditions>]) == 0`
| `arr[? ANY FILTER <conditions>]`  | `LENGTH(arr[* FILTER <conditions>]) > 0`
| `arr[? ALL FILTER <conditions>]`  | `LENGTH(arr[* FILTER <conditions>]) == LENGTH(arr)`
| `arr[? AT LEAST (<number>) FILTER <conditions>]` | `LENGTH(arr[* FILTER <conditions>]) >= <number>`
| `arr[?]` | `LENGTH(arr[*]) > 0`

The question mark operator can be used for nested search (Enterprise Edition only):
- [Nested search with ArangoSearch](../../indexing/arangosearch/arangosearch-nested-search) using Views
- Nested search using [Inverted indexes](../../indexing/working-with-indexes/indexing-inverted#nested-search-enterprise-edition)
