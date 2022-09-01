---
layout: default
description: >-
  You can search for nested objects in arrays that satisfy multiple conditions
  each, and define how often these conditions should be fulfilled for the entire
  array
title: Nested Search ArangoSearch Examples
---
# Nested search with ArangoSearch

{{ page.description }}
{:class="lead"}

{% include hint-ee.md feature="Nested search with View index acceleration" %}

By default, ArangoSearch Views index arrays as if the parent attribute had
multiple values at once. With `trackListPositions` set to `true`, every array
element is indexed individually and can be queried separately using the
respective array index. With the nested search feature, you get another
option for indexing arrays, in particular nested objects in arrays.

You can let the View index the sub-objects in a way that lets you query for
co-occurring values. For example, you can search the sub-objects and all the
conditions need to be met by a single sub-object instead of across all of them.

## Using nested search

Consider the following document:

```json
{
  "dimensions": [
    { "type": "height", "value": 35 },
    { "type": "width", "value": 60 }
  ]
}
```

You would normally index the `dimensions` field and its sub-fields with a
View definition like the following:

```json
{
  "links": {
    "<collection>": {
      "fields": {
        "dimensions": {
          "fields": {
            "type": {},
            "value": {}
          }
        }
      }
    }
  },
  ...
}
```

You might then write a query like the following to find documents where the
height is greater than 40:

```aql
FOR doc IN viewName
  SEARCH doc.dimensions.type == "height" AND doc.dimensions.value > 40
  RETURN doc
```

This query matches the above document despite the height only being 35. The reason is
that each condition is true for at least one of the nested objects. There is no
check whether both conditions are true for the same object, however. You could
add a `FILTER` statement to remove false positive matches from the search
results, but it is cumbersome to check the conditions again, for every sub-object:

```aql
FOR doc IN viewName
  SEARCH doc.dimensions.type == "height" AND doc.dimensions.value > 40
  FILTER LENGTH(doc.dimensions[* FILTER CURRENT.type == "height" AND CURRENT.value > 40]) > 0
  RETURN doc
```

The nested search feature allows you to condense the query while utilizing the
View index:

```aql
FOR doc IN viewName
  SEARCH doc.dimensions[? FILTER CURRENT.type == "height" AND CURRENT.value > 40]
  RETURN doc
```

The required View definition for this to work is as follows:

```json
{
  "links": {
    "<collection>": {
      "fields": {
        "dimensions": {
          "nested": {
            "type": {},
            "value": {}
          }
        }
      }
    }
  }
}
```

Note the `nested` property instead of a `fields` property, configuring the View
to index the objects in the `dimensions` array so that you can use the
[Question mark operator](aql/advanced-array-operators.html#question-mark-operator)
to query the nested objects. The default `identity` Analyzer is used for the
fields because none is specified explicitly.

## Defining how often the conditions need to be true

You can optionally specify a quantifier to define how often the conditions need
to be true for the entire array. The following query matches documents that have
one or two nested objects with a height greater than 40:

```aql
FOR doc IN viewName
  SEARCH doc.dimensions[? 1..2 FILTER CURRENT.type == "height" AND CURRENT.value > 40]
  RETURN doc
```

If you leave out the quantifier, it defaults to `ANY`. The conditions need to be
fulfilled by at least one sub-object, but more than one sub-object may meet the
conditions. With a quantity of `1`, it would need to be one match exactly.
Similarly, ranges require an exact match between the minimum and maximum number,
including the specified boundaries. To require two or more sub-objects to
fulfill the conditions, you can use `AT LEAST (2)`, and so on.

{% hint 'info' %}
The `ALL` quantifier of the Question mark operator is not supported in View queries.

Using the question mark operator without quantifier and filter conditions (`[?]`)
cannot utilize View indexes.
{% endhint %}

## Searching deeply nested data

You can index and search for multiple levels of objects in arrays.
Consider the following document:

```json
{
  "dimensions": [
    {
      "part": "frame",
      "measurements": [
        { "type": "height", "value": 47 },
        { "type": "width", "value": 72 }
      ],
      "comments": "Slightly damaged at the bottom right corner."
    },
    {
      "part": "canvas",
      "measurements": [
        { "type": "height", "value": 35 },
        { "type": "width", "value": 60 }
      ]
    }
  ]
}
```

To index the array of dimension objects and the nested array of measurement
objects, you can use a View definition like the following:

```json
{
  "links": {
    "<collection>": {
      "fields": {
        "dimensions": {
          "nested": {
            "measurements": {
              "nested": {
                "type": {},
                "value": {}
              }
            },
            "part": {},
            "comments": {
              "analyzers": [
                "text_en"
              ]
            }
          }
        }
      }
    }
  }
}
```

The default `identity` Analyzer is used for the `type`, `value`, and `part`
attributes, and the built-in `text_en` is used for the `comments`.

A possible query is to search for frames with damaged corners that are not wider
than 80, using a question mark operator to check the `part` and `comments`, and
a nested question mark operator to check the `type` and `value`:

```aql
FOR doc IN viewName
  SEARCH doc.dimensions[? FILTER CURRENT.part == "frame" AND
         ANALYZER(TOKENS("corner damage", "text_en") ALL == CURRENT.comments, "text_en") AND
         CURRENT.measurements[? FILTER CURRENT.type == "width" AND CURRENT.value <= 80]]
  RETURN doc
```

The conditions of the inner question mark operator need to be satisfied by a
single measurement object. The conditions of the outer question mark operator
need to be satisfied by a single dimension object, including the measurement
conditions of the inner operator. The example document does match these
conditions.
