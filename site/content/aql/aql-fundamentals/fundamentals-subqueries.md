---
fileID: fundamentals-subqueries
title: Combining queries with subqueries
weight: 3575
description: 
layout: default
---
## How to use subqueries

Wherever an expression is allowed in AQL, a subquery can be placed. A subquery
is a query part that can introduce its own local variables without affecting
variables and values in its outer scope(s).

It is required that subqueries be put inside parentheses `(` and `)` to
explicitly mark their start and end points:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR p IN persons
  LET recommendations = ( // subquery start
    FOR r IN recommendations
      FILTER p.id == r.personId
      SORT p.rank DESC
      LIMIT 10
      RETURN r
  ) // subquery end
  RETURN { person : p, recommendations : recommendations }
```
{{% /tab %}}
{{< /tabs >}}

A subquery's result can be assigned to a variable with
[`LET`](../high-level-operations/operations-let) as shown above, so that it can be referenced
multiple times or just to improve the query readability.

Function calls also use parentheses and AQL allows you to omit an extra pair if
you want to use a subquery as sole argument for a function, e.g.
`MAX(<subquery>)` instead of `MAX((<subquery>))`:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR p IN persons
  COLLECT city = p.city INTO g
  RETURN {
    city : city,
    numPersons : LENGTH(g),
    maxRating: MAX( // subquery start
      FOR r IN g
      RETURN r.p.rating
    ) // subquery end
  }
```
{{% /tab %}}
{{< /tabs >}}

The extra wrapping is required if there is more than one function argument,
however, e.g. `NOT_NULL((RETURN "ok"), "fallback")`.

Subqueries may also include other subqueries.

## Subquery results and unwinding

Subqueries always return a result **array**, even if there is only
a single return value:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN ( RETURN 1 )
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[ [ 1 ] ]
```
{{% /tab %}}
{{< /tabs >}}

To avoid such a nested data structure, [FIRST()](../functions/functions-array#first)
can be used for example:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN FIRST( RETURN 1 )
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[ 1 ]
```
{{% /tab %}}
{{< /tabs >}}

To unwind the result array of a subquery so that each element is returned as
top-level element in the overall query result, you can use a `FOR` loop:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR elem IN (RETURN 1..3) // [1,2,3]
  RETURN elem
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  1,
  2,
  3
]
```
{{% /tab %}}
{{< /tabs >}}

Without unwinding, the query would be `RETURN (RETURN 1..3)` and the result
a nested array `[ [ 1, 2, 3 ] ]` with a single top-level element.

## Evaluation of subqueries

Subqueries that are used inside expressions are pulled out of these
expressions and executed beforehand. That means that subqueries do not
participate in lazy evaluation of operands, for example in the
[ternary operator](../operators#ternary-operator).

Consider the following query:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN RAND() > 0.5 ? (RETURN 1) : 0
```
{{% /tab %}}
{{< /tabs >}}

It get transformed into something more like this, with the calculation of the
subquery happening before the evaluation of the condition:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
LET temp1 = (RETURN 1)
LET temp2 = RAND() > 0.5 ? temp1 : 0
RETURN temp2
```
{{% /tab %}}
{{< /tabs >}}

The subquery is executed regardless of the condition. In other words, there is
no short-circuiting that would avoid the subquery from running in the case that
the condition evaluates to `false`. You may need to take this into account to
avoid query errors like

> Query: AQL: collection or array expected as operand to FOR loop; you provided
> a value of type 'null' (while executing)

{{< tabs >}}
{{% tab name="aql" %}}
```aql
LET maybe = DOCUMENT("coll/does_not_exist")
LET dependent = maybe ? (
  FOR attr IN ATTRIBUTES(maybe)
    RETURN attr
) : null
RETURN dependent
```
{{% /tab %}}
{{< /tabs >}}

The problem is that the subquery is executed under all circumstances, despite
the check whether `DOCUMENT()` found a document or not. It does not take into
account that `maybe` can be `null`, which cannot be iterated over with `FOR`.
A possible solution is to fall back to an empty array in the subquery to
effectively prevent the loop body from being run:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
LET maybe = DOCUMENT("coll/does_not_exist")
LET dependent = maybe ? (
  FOR attr IN NOT_NULL(ATTRIBUTES(maybe || {}), [])
    RETURN attr
) : "document not found"
RETURN dependent
```
{{% /tab %}}
{{< /tabs >}}

The additional fallback `maybe || {}` prevents a query warning

> invalid argument type in call to function 'ATTRIBUTES()'

that originates from a `null` value getting passed to the `ATTRIBUTES()`
function that expects an object.
