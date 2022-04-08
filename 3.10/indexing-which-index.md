---
layout: default
description: Which Index to use when
---
Which Index to use when
=======================

ArangoDB automatically indexes the `_key` attribute in each collection. There
is no need to index this attribute separately. Please note that a document's
`_id` attribute is derived from the `_key` attribute, and is thus implicitly
indexed, too.

ArangoDB will also automatically create an index on `_from` and `_to` in any
edge collection, meaning incoming and outgoing connections can be determined
efficiently.

Index types
-----------

Users can define additional indexes on one or multiple document attributes.
Several different index types are provided by ArangoDB. These indexes have
different usage scenarios:

- **Persistent index**: a persistent index is a general purpose index type
  that can be used for equality lookups, lookups based on a leftmost prefix 
  of the index attributes, range queries and for sorting.

  The operations in a persistent index have logarithmic complexity.

  Persistent indexes allow you to store additional attributes in the index that
  can be used to cover more queries (`storedValues` index option).
  These additional attributes can be used for projections but not for
  lookups/filtering or sorting.

  You can optionally let persistent indexes cache equality lookups (`==`) to
  speed up index lookups for queries that cover all index attributes
  (`cacheEnabled` index option).

- **TTL index**: the TTL index provided by ArangoDB can be used for automatically
  removing expired documents from a collection.

  The TTL index is set up by setting an `expireAfter` value and by picking a single 
  document attribute which contains the documents' reference timepoint. Documents 
  are expired `expireAfter` seconds after their reference timepoint has been reached.
  The documents' reference timepoint is specified as either a numeric timestamp 
  (Unix timestamp) or a date string in format `YYYY-MM-DDTHH:MM:SS` with optional 
  milliseconds. All date strings will be interpreted as UTC dates.

  For example, if `expireAfter` is set to 600 seconds (10 minutes) and the index
  attribute is "creationDate" and there is the following document:

      { "creationDate" : 1550165973 }

  This document will be indexed with a creation date time value of `1550165973`,
  which translates to the human-readable date `2019-02-14T17:39:33.000Z`. The document
  will expire 600 seconds afterwards, which is at timestamp `1550166573` (or
  `2019-02-14T17:49:33.000Z` in the human-readable version).

  The actual removal of expired documents will not necessarily happen immediately.
  Expired documents will eventually be removed by a background thread that is
  periodically going through all TTL indexes. The frequency for invoking this
  background thread can be configured using the `--ttl.frequency` startup option.

  There is no guarantee when exactly the removal of expired documents will be carried
  out, so queries may still find and return documents that have already expired. These
  will eventually be removed when the background thread kicks in and has capacity to
  remove the expired documents. It is guaranteed however that only documents which are 
  past their expiration time will actually be removed.

  Please note that the numeric date time values for the index attribute has to be
  specified **in seconds** since January 1st 1970 (Unix timestamp). To calculate the current 
  timestamp from JavaScript in this format, there is `Date.now() / 1000`; to calculate it
  from an arbitrary Date instance, there is `Date.getTime() / 1000`. In AQL you can do
  `DATE_NOW() / 1000` or divide an arbitrary Unix timestamp in milliseconds by 1000 to
  convert it to seconds.

  Alternatively, the index attribute values can be specified as a date string in format
  `YYYY-MM-DDTHH:MM:SS`, optionally with milliseconds after a decimal point in the
  format `YYYY-MM-DDTHH:MM:SS.MMM` and an optional timezone offset. All date strings
  without a timezone offset will be interpreted as UTC dates.

  The above example document using a date string attribute value would be
 
      { "creationDate" : "2019-02-14T17:39:33.000Z" }

  In case the index attribute does not contain a numeric value nor a proper date string,
  the document will not be stored in the TTL index and thus will not become a candidate 
  for expiration and removal. Providing either a non-numeric value or even no value for 
  the index attribute is a supported way of keeping documents from being expired and removed.

  TTL indexes are designed exactly for the purpose of removing expired documents from
  a collection. It is *not recommended* to rely on TTL indexes for user-land AQL queries. 
  This is because TTL indexes internally may store a transformed, always numerical version 
  of the index attribute value even if it was originally passed in as a datestring. As a
  result TTL indexes will likely not be used for filtering and sort operations in user-land
  AQL queries.

- **multi-dimensional index** (ZKD): a multi dimensional index allows to
  efficiently intersect multiple range queries. Typical use cases are querying
  intervals that intersect a given point or interval. For example, if intervals
  are stored in documents like

  ```json
  { "from": 12, "to": 45 }
  ```

  then you can create an index over `from, to` utilize it with this query:

  ```js
  FOR i IN intervals FILTER i.from <= t && t <= i.to RETURN i
  ```

  Currently only floating-point numbers (doubles) are supported as underlying
  type for each dimension.

- **Geo index**: the geo index provided by ArangoDB allows searching for documents
  within a radius around a two-dimensional earth coordinate (point), or to
  find documents with are closest to a point. Document coordinates can either 
  be specified in two different document attributes or in a single attribute, e.g.

      { "latitude": 50.9406645, "longitude": 6.9599115 }

  or

      { "coords": [ 50.9406645, 6.9599115 ] }

  Geo indexes will be invoked via special functions or AQL optimization. The
  optimization can be triggered when a collection with geo index is enumerated
  and a SORT or FILTER statement is used in conjunction with the distance
  function.

  Furthermore, a geo index can also index standard
  [GeoJSON objects](https://datatracker.ietf.org/doc/html/rfc7946){:target="_blank"}.
  GeoJSON uses the JSON syntax to describe geometric objects on the surface
  of the Earth. It supports points, lines, and polygons.
  See [Geo-Spatial Indexes](indexing-geo.html).

- **fulltext index**: a fulltext index can be used to index all words contained in
  a specific attribute of all documents in a collection. Only words with a 
  (specifiable) minimum length are indexed. Word tokenization is done using 
  the word boundary analysis provided by libicu, which is taking into account 
  the selected language provided at server start.

  The index supports complete match queries (full words) and prefix queries.
  Fulltext indexes will only be invoked via special functions.

  Please note that the fulltext index type is deprecated from version 3.10 onwards
  and is superseded by [ArangoSearch](arangosearch.html).

- **View**: [ArangoSearch](arangosearch.html) is a sophisticated search engine
  for full-text, with text pre-processing, ranking capabilities and more.
  It offers more features and configuration options than a fulltext index.
  It indexes documents near real-time, but not immediately as other indexes.

  Comparison with the full-text Index:

  Feature                           | ArangoSearch | Full-text Index
  :---------------------------------|:-------------|:---------------
  Term search                       | Yes          | Yes
  Prefix search                     | Yes          | Yes
  Boolean expressions               | Yes          | Restricted
  Range search                      | Yes          | No
  Phrase search                     | Yes          | No
  Relevance ranking                 | Yes          | No
  Configurable Analyzers            | Yes          | No
  AQL composable language construct	| Yes          | No
  Indexed attributes per collection | Unlimited    | 1
  Indexed collections               | Unlimited    | 1
  Consistency                       | Eventual     | Immediate

Sparse vs. non-sparse indexes
-----------------------------

Persistent indexes can optionally be created sparse. A sparse index
does not contain documents for which at least one of the index attribute is not set
or contains a value of `null`.

As such documents are excluded from sparse indexes, they may contain fewer documents than
their non-sparse counterparts. This enables faster indexing and can lead to reduced memory
usage in case the indexed attribute does occur only in some, but not all documents of the 
collection.

In order to create a sparse index, an object with the attribute `sparse` can be added to
the index creation commands:

```js
db.collection.ensureIndex({ type: "persistent", fields: [ "attributeName" ], sparse: true }); 
db.collection.ensureIndex({ type: "persistent", fields: [ "attributeName1", "attributeName2" ], sparse: true }); 
db.collection.ensureIndex({ type: "persistent", fields: [ "attributeName" ], unique: true, sparse: true }); 
db.collection.ensureIndex({ type: "persistent", fields: [ "attributeName1", "attributeName2" ], unique: true, sparse: true }); 
```

When not explicitly set, the `sparse` attribute defaults to `false` for new indexes.
Indexes other than persistent do not support the `sparse` option.

As sparse indexes may exclude some documents from the collection, they cannot be used for
all types of queries. Sparse hash indexes cannot be used to find documents for which at
least one of the indexed attributes has a value of `null`. For example, the following AQL
query cannot use a sparse index, even if one was created on attribute `attr`:
<!-- TODO Remove above statement? -->

```js
FOR doc In collection
  FILTER doc.attr == null
  RETURN doc
```

If the lookup value is non-constant, a sparse index may or may not be used, depending on
the other types of conditions in the query. If the optimizer can safely determine that
the lookup value cannot be `null`, a sparse index may be used. When uncertain, the optimizer
will not make use of a sparse index in a query in order to produce correct results.

For example, the following queries cannot use a sparse index on `attr` because the optimizer
will not know beforehand whether the values which are compared to `doc.attr` will include `null`:

```js
FOR doc In collection 
  FILTER doc.attr == SOME_FUNCTION(...) 
  RETURN doc
```

```js
FOR other IN otherCollection
  FOR doc In collection
    FILTER doc.attr == other.attr
    RETURN doc
```

Sparse persistent indexes can be used for sorting if the optimizer can safely detect that the
index range does not include `null` for any of the index attributes.

Note that if you intend to use [joins](aql/examples-join.html) it may be clever
to use non-sparsity and maybe even uniqueness for that attribute, else all items containing
the `null` value will match against each other and thus produce large results.
