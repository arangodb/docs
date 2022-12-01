---
fileID: indexing-multi-dim
title: Multi-dimensional indexes
weight: 520
description: 
layout: default
---
The multi-dimensional index type (also called ZKD) provided by ArangoDB can be
used to efficiently intersect multiple range queries.

A multi-dimensional index is setup by setting the index type to `"zkd"`.
The `fields` attribute describes which fields are used as dimensions.
The value of each dimension has to be a numeric (double) value.

{{% hints/warning %}}
`zkd` indexes are an **experimental** feature in ArangoDB 3.9.
{{% /hints/warning %}}

## Querying documents within a 3D box

Assume we have documents in a collection `points` of the form

{{< tabs >}}
{{% tab name="json" %}}
```json
{"x": 12.9, "y": -284.0, "z": 0.02}
```
{{% /tab %}}
{{< /tabs >}}

and we want to query all documents that are contained within a box defined by
`[x0, x1] * [y0, y1] * [z0, z1]`.

To do so one creates a multi-dimensional index on the attributes `x`, `y` and
`z`, e.g. in _arangosh_:

{{< tabs >}}
{{% tab name="js" %}}
```js
db.collection.ensureIndex({
    type: "zkd",
    fields: ["x", "y", "z"],
    fieldValueTypes: "double"
});
```
{{% /tab %}}
{{< /tabs >}}

Unlike for other indexes the order of the fields does not matter.

`fieldValueTypes` is required and the only allowed value is `"double"`.
Future extensions of the index will allow other types.

Now we can use the index in a query:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR p IN points
    FILTER x0 <= p.x && p.x <= x1
    FILTER y0 <= p.y && p.y <= y1
    FILTER z0 <= p.z && p.z <= z1
    RETURN p
```
{{% /tab %}}
{{< /tabs >}}

## Possible range queries

Having an index on a set of fields does not require you to specify a full range
for every field. For each field you can decide if you want to bound
it from both sides, from one side only (i.e. only an upper or lower bound)
or not bound it at all.

Furthermore you can use any comparison operator. The index supports `<=` and `>=`
naturally, `==` will be translated to the bound `[c, c]`. Strict comparison
is translated to their non-strict counterparts and a post-filter is inserted.

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR p IN points
    FILTER 2 <= p.x && p.x < 9
    FILTER y0 >= 80
    FILTER p.z == 4
    RETURN p
```
{{% /tab %}}
{{< /tabs >}}

## Example Use Case

If you build a calendar using ArangoDB you could create a collection for each user
that contains the appointments. The documents would roughly look as follows:

{{< tabs >}}
{{% tab name="json" %}}
```json
{
    "from": 345365,
    "to": 678934,
    "what": "Dentist",
}
```
{{% /tab %}}
{{< /tabs >}}

`from`/`to` are the timestamps when an appointment starts/ends. Having an
multi-dimensional index on the fields `["from", "to"]` allows you to query
for all appointments within a given time range efficiently.

### Finding all appointments within a time range

Given a time range `[f, t]` we want to find all appointments `[from, to]` that
are completely contained in `[f, t]`. Those appointments clearly satisfy the
condition

{{< tabs >}}
{{% tab name="" %}}
```
f <= from and to <= t
```
{{% /tab %}}
{{< /tabs >}}

Thus our query would be:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR app IN appointments
    FILTER f <= app.from
    FILTER app.to <= t
    RETURN app
```
{{% /tab %}}
{{< /tabs >}}

### Finding all appointments that intersect a time range

Given a time range `[f, t]` we want to find all appointments `[from, to]` that
intersect `[f, t]`. Two intervals `[f, t]` and `[from, to]` intersect if
and only if

{{< tabs >}}
{{% tab name="" %}}
```
f <= to and from <= t
```
{{% /tab %}}
{{< /tabs >}}

Thus our query would be:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR app IN appointments
    FILTER f <= app.to
    FILTER app.from <= t
    RETURN app
```
{{% /tab %}}
{{< /tabs >}}

## Lookahead Index Hint

<small>Introduced in: v3.10.0</small>

Using the lookahead index hint can increase the performance for certain use
cases. Specifying a lookahead value greater than zero makes the index fetch
more documents that are no longer in the search box, before seeking to the
next lookup position. Because the seek operation is computationally expensive,
probing more documents before seeking may reduce the number of seeks, if
matching documents are found. Please keep in mind that it might also affect
performance negatively if documents are fetched unnecessarily.

You can specify the `lookahead` value using the `OPTIONS` keyword:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR app IN appointments OPTIONS { lookahead: 32 }
    FILTER @to <= app.to
    FILTER app.from <= @from
    RETURN app
```
{{% /tab %}}
{{< /tabs >}}

## Limitations

Currently there are a few limitations:

- Using array expansions for attributes is not possible (e.g. `array[*].attr`)
- The `sparse` property is not supported.
- You can only index numeric values that are representable as IEEE-754 double.
- A high number of dimensions (more than 5) can impact the performance considerably.
- The performance can vary depending on the dataset. Densely packed points can
  lead to a high number of seeks. This behavior is typical for indexing using
  space filling curves.
