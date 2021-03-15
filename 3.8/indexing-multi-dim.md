---
layout: default
description: This is an introduction to ArangoDB's multi-dimensional indexes
---
Multi-dimensional indexes
================

Introduction to Multi-dimensional Indexes
-----------------------------------------

The multi-dimensional index type provided by ArangoDB can be used to efficiently
intersect multiple range queries.

A multi-dimensional index is setup by setting the index type to `zkd`. The `fields`
attribute describes which fields are used as dimensions. The value of each dimension
has to be a double value. (See limitations)


### Querying documents within a 3D box

Assume we have documents in a collection `points` of the form

    {x: 12.9, y: -284.0, z: 0.02}

and we want to query all documents that contained within a box defined by

    [x0, x1] * [y0, y1] * [z0, z1].

To do so one creates a multi-dimensional index on the attributes `x`, `y` and `z`:


    db.collection.ensureIndex({
        type: "zkd",
        fields: ["x", "y", "z"],
        fieldValueTypes: "double"
    });

Unlike for other indexes the order of the fields does not matter. `fieldValueTypes` is required and
future extensions of the index will allow different values. However, for now `double` is the only
allowed value.

Now we can use the index in a query

    FOR p IN points
        FILTER x0 <= p.x && p.x <= x1
        FILTER y0 <= p.y && p.y <= y1
        FILTER z0 <= p.z && p.z <= z1
        RETURN p

### Possible range queries

Having an index on a set of fields does not require you to specify a full range
for every dimension. For each dimension you can decide if you want to only bound
it from one side (i.e. only an upper or lower bound) or not bound it at all.

Futhermore you can use any comparsion operator. The index supports `<=` and `>=`
naturally, `==` will be translated to the bound `[c, c]`. Strict comparsion
is translated to they non-strict counterparts and a post-filter is inserted.

    FOR p IN points
        FILTER 2 <= p.x && p.x < 9
        FILTER y0 >= 80
        FILTER p.z == 4
        RETURN p

### Limitations

Currently there are a few limitations:

- Using array expansions for attributes is not possible.
- The `sparse` property is not supported.
- You can only index numeric values that are representable as IEEE-754 double.




