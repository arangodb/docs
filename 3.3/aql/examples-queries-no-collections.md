---
layout: default
description: Queries don't necessarily have to involve collections.
title: AQL Queries Without Collections
---
Queries without collections
===========================


Following is a query that returns a string value. The result string is contained in an array
because the result of every valid query is an array:

```js
RETURN "this will be returned"
[ 
  "this will be returned" 
]
```

Here is a query that creates the cross products of two arrays and runs a projection 
on it, using a few of AQL's built-in functions:

```js
FOR year IN [ 2011, 2012, 2013 ]
  FOR quarter IN [ 1, 2, 3, 4 ]
    RETURN {
      year,
      quarter,
      formatted: CONCAT(quarter, " / ", year)
    }
```

```json
[ 
  { "year" : 2011, "quarter" : 1, "formatted" : "1 / 2011" }, 
  { "year" : 2011, "quarter" : 2, "formatted" : "2 / 2011" }, 
  { "year" : 2011, "quarter" : 3, "formatted" : "3 / 2011" }, 
  { "year" : 2011, "quarter" : 4, "formatted" : "4 / 2011" }, 
  { "year" : 2012, "quarter" : 1, "formatted" : "1 / 2012" }, 
  { "year" : 2012, "quarter" : 2, "formatted" : "2 / 2012" }, 
  { "year" : 2012, "quarter" : 3, "formatted" : "3 / 2012" }, 
  { "year" : 2012, "quarter" : 4, "formatted" : "4 / 2012" }, 
  { "year" : 2013, "quarter" : 1, "formatted" : "1 / 2013" }, 
  { "year" : 2013, "quarter" : 2, "formatted" : "2 / 2013" }, 
  { "year" : 2013, "quarter" : 3, "formatted" : "3 / 2013" }, 
  { "year" : 2013, "quarter" : 4, "formatted" : "4 / 2013" } 
]
```
