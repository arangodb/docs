---
layout: default
description: A multi dimensional index allows to efficiently intersect multiple range queries
---
# Multi-dimensional indexes

The multi-dimensional index type (also called ZKD) provided by ArangoDB can be
used to efficiently intersect multiple range queries.

A multi-dimensional index is setup by setting the index type to `"zkd"`.
The `fields` attribute describes which fields are used as dimensions.
The value of each dimension has to be a numeric (double) value.

{% hint 'warning' %}
`zkd` indexes are an **experimental** feature in ArangoDB 3.9.
{% endhint %}

## Querying documents within a 3D box

Assume we have documents in a collection `points` of the form

```json
{"x": 12.9, "y": -284.0, "z": 0.02}
```

and we want to query all documents that are contained within a box defined by
`[x0, x1] * [y0, y1] * [z0, z1]`.

To do so one creates a multi-dimensional index on the attributes `x`, `y` and
`z`, e.g. in _arangosh_:

```js
db.collection.ensureIndex({
    type: "zkd",
    fields: ["x", "y", "z"],
    fieldValueTypes: "double"
});
```

Unlike for other indexes the order of the fields does not matter.

`fieldValueTypes` is required and the only allowed value is `"double"`.
Future extensions of the index will allow other types.

Now we can use the index in a query:

```js
FOR p IN points
    FILTER x0 <= p.x && p.x <= x1
    FILTER y0 <= p.y && p.y <= y1
    FILTER z0 <= p.z && p.z <= z1
    RETURN p
```

## Possible range queries

Having an index on a set of fields does not require you to specify a full range
for every field. For each field you can decide if you want to bound
it from both sides, from one side only (i.e. only an upper or lower bound)
or not bound it at all.

Furthermore you can use any comparison operator. The index supports `<=` and `>=`
naturally, `==` will be translated to the bound `[c, c]`. Strict comparison
is translated to their non-strict counterparts and a post-filter is inserted.

```js
FOR p IN points
    FILTER 2 <= p.x && p.x < 9
    FILTER y0 >= 80
    FILTER p.z == 4
    RETURN p
```

## Example Use Case

If you build a calendar using ArangoDB you could create a collection for each user
that contains her appointments. The documents would roughly look as follows:

```json
    {
        "from": 345365,
        "to": 678934,
        "what": "Dentist",
    }
```

`from`/`to` are the timestamps when an appointment starts/ends. Having an
multi-dimensional index on the fields `["from", "to"]` allows you to query
for all appointments within a given time range efficiently.

### Finding all appointments within a time range

Given a time range `[f, t]` we want to find all appointments `[from, to]` that
are completely contained in `[f, t]`. Those appointments clearly satisfy the
condition

```
f <= from and to <= t
```

Thus our query would be:

```js
FOR app IN appointments
    FILTER f <= app.from
    FILTER app.to <= t
    RETURN app
```

### Finding all appointments that intersect a time range

Given a time range `[f, t]` we want to find all appointments `[from, to]` that
intersect `[f, t]`. Two intervals `[f, t]` and `[from, to]` intersect if
and only if

```
f <= to and from <= t
```

Thus our query would be:

```js
FOR app IN appointments
    FILTER f <= app.to
    FILTER app.from <= t
    RETURN app
```

## Limitations

Currently there are a few limitations:

- Using array expansions for attributes is not possible (e.g. `array[*].attr`)
- The `sparse` property is not supported.
- You can only index numeric values that are representable as IEEE-754 double.
- A high number of dimensions (more than 5) can impact the performance considerably.
- The performance can vary depending on the dataset. Densely packed points can
  lead to a high number of seeks. This behavior is typical for indexing using
  space filling curves.
