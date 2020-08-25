---
layout: default
description: How to fill a collection with dummy documents
title: Create Test Data with AQL
redirect_from:
  - /3.8/cookbook/aql-creating-test-data.html # 3.5 -> 3.5
---
Create Test Data with AQL
=========================

We assume that there is already a collection to the hold documents called
`myCollection` in below example queries.

One of the easiest ways to fill a collection with test data is to use an AQL
query that iterates over a range.

Run the following AQL query e.g. from the _AQL Editor_ in the web interface
to insert 1,000 documents into the collection:

```js
FOR i IN 1..1000
  INSERT { name: CONCAT("test", i) } IN myCollection
```

The number of documents to create can be modified easily be adjusting the range
boundary values.

If you want to inspect the result immediately, add `RETURN NEW` at the end of
the query.

To create more complex test data, adjust the AQL query. Let us say we also want
a `status` attribute, and fill it with integer values between `1` to `5`
(inclusive), with equal distribution. A good way to achieve this is to use
the modulo operator (`%`):

```js
FOR i IN 1..1000
  INSERT {
    name: CONCAT("test", i),
    status: 1 + (i % 5)
  } IN myCollection
```

To create pseudo-random values, use the `RAND()` function. It creates
pseudo-random numbers between `0` and `1`. Use some factor to scale the random
numbers, and `FLOOR()` to convert the scaled number back to an integer.

For example, the following query populates the `value` attribute with numbers
between 100 and 150 (inclusive):

```js
FOR i IN 1..1000
  INSERT {
    name: CONCAT("test", i),
    value: 100 + FLOOR(RAND() * (150 - 100 + 1))
  } IN myCollection
```

After the test data has been created, it is often helpful to verify it. The
`RAND()` function is also a good candidate for retrieving a random sample of
the documents in the collection. This query will retrieve 10 random documents:

```js
FOR doc IN myCollection
  SORT RAND()
  LIMIT 10
  RETURN doc
```

The `COLLECT` clause is an easy mechanism to run an aggregate analysis on some
attribute. Let us say we wanted to verify the data distribution inside the
`status` attribute. In this case we could run:

```js
FOR doc IN myCollection
  COLLECT value = doc.value WITH COUNT INTO count
  RETURN {
    value: value,
    count: count
  }
```

The above query will provide the number of documents per distinct `value`.

We can make the JSON result a bit more compact by using the value as attribute
key, the count as attribute value and merge everything into a single result
object. Note that attribute keys can only be strings, but for our purposes here
it is acceptable.

```js
RETURN MERGE(
  FOR doc IN myCollection
    COLLECT value = doc.value WITH COUNT INTO count
    RETURN {
      [value]: count
    }
)
```
