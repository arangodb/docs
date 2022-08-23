---
layout: default
description: 
title: Nested Search ArangoSearch Examples
---
# Nested search with ArangoSearch

{{ page.description }}
{:class="lead"}

By default, ArangoSearch Views index arrays as if the parent attribute had
multiple values at once. With `trackListPositions` set to `true`, every array
element is indexed individually and can be queried separately using the
respective array index. With the new nested search feature, you get another
option for indexing arrays, in particular nested objects in arrays.

You can let the View index the sub-objects in a way that lets you query for
co-occurring values. For example, you can search the sub-objects and all the
conditions need to be met by a single sub-object instead of across all of them.
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

This query matches the above document despite the height being 35. The reason is
that each condition is true for at least one of the nested objects. There is no
check whether the conditions are true for the same object, however. You could
add a `FILTER` statement to remove false positive matches from the search
results, but it is cumbersome to check the conditions for every sub-object:

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
new question mark operator to query the nested objects.
