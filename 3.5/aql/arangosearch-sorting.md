---
layout: default
title: Using ArangoSearch Scorers for Sorting
---
ArangoSearch sorting
--------------------

A major feature of ArangoSearch Views is their capability of sorting results
based on the creation-time search conditions and zero or more sorting functions.
The ArangoSearch sorting functions available are `TFIDF()` and `BM25()`.

Note: The first argument to any ArangoSearch sorting function is _always_ the
document emitted by a `FOR` operation over an ArangoSearch View.

Note: An ArangoSearch sorting function is _only_ allowed as an argument to a
`SORT` operation. But they can be mixed with other arguments to `SORT`.

So the following examples are valid:

```js
FOR doc IN someView
    SORT TFIDF(doc)
```

```js
FOR a IN viewA
    FOR b IN viewB
        SORT BM25(a), TFIDF(b)
```

```js
FOR a IN viewA
    FOR c IN someCollection
        FOR b IN viewB
            SORT TFIDF(b), c.name, BM25(a)
```

while these will _not_ work:

```js
FOR doc IN someCollection
    SORT TFIDF(doc) // !!! Error
```
```js
FOR doc IN someCollection
    RETURN BM25(doc) // !!! Error
```
```js
FOR doc IN someCollection
    SORT BM25(doc.someAttr) // !!! Error
```
```js
FOR doc IN someView
    SORT TFIDF("someString") // !!! Error
```
```js
FOR doc IN someView
    SORT BM25({some: obj}) // !!! Error
```

The following sorting methods are available:

### Literal sorting
You can sort documents by simply specifying arbitrary values or expressions, as
you do in other places.

### BM25()

`BM25(doc, k, b)`

- *k* (number, _optional_): calibrates the text term frequency scaling, the default is
_1.2_. A *k* value of _0_ corresponds to a binary model (no term frequency), and a large
value corresponds to using raw term frequency
- *b* (number, _optional_): determines the scaling by the total text length, the default
is _0.75_. At the extreme values of the coefficient *b*, BM25 turns into ranking
functions known as BM11 (for *b* = `1`,  corresponds to fully scaling the term weight by
the total text length) and BM15 (for *b* = `0`, corresponds to no length normalization)

Sorts documents using the [**Best Matching 25** algorithm](https://en.wikipedia.org/wiki/Okapi_BM25){:target="_blank"}.
See the [`BM25()` section in ArangoSearch Scorers](../views-arango-search-scorers.html)
for details.

### TFIDF()

`TFIDF(doc, withNorms)`

- *doc* (document): must be emitted by `FOR doc IN someView`
- *withNorms* (bool, _optional_): specifying whether scores should be
  normalized, the default is _false_

Sorts documents using the
[**term frequency–inverse document frequency** algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"}.
See the
[`TFIDF()` section in ArangoSearch Scorers](../views-arango-search-scorers.html)
for details.


### Sorting examples

to sort documents by the value of the 'name' attribute

    FOR doc IN someView
      SORT doc.name
      RETURN doc

or

    FOR doc IN someView
      SORT doc['name']
      RETURN doc

to sort documents via the
[BM25 algorithm](https://en.wikipedia.org/wiki/Okapi_BM25){:target="_blank"}

    FOR doc IN someView
      SORT BM25(doc)
      RETURN doc

to sort documents via the
[BM25 algorithm](https://en.wikipedia.org/wiki/Okapi_BM25){:target="_blank"}
with 'k' = 1.2 and 'b' = 0.75

    FOR doc IN someView
      SORT BM25(doc, 1.2, 0.75)
      RETURN doc

to sort documents via the
[TFIDF algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"}

    FOR doc IN someView
      SORT TFIDF(doc)
      RETURN doc

to sort documents via the
[TFIDF algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"} with norms

    FOR doc IN someView
      SORT TFIDF(doc, true)
      RETURN doc

to sort documents by value of 'name' and then by the
[TFIDF algorithm](https://en.wikipedia.org/wiki/TF-IDF){:target="_blank"} where 'name' values are
equivalent

    FOR doc IN someView
      SORT doc.name, TFIDF(doc)
      RETURN doc
