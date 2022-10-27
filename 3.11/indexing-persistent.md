---
layout: default
description: It is possible to define a persistent index on one or more attributes (or paths) of documents
---
Persistent indexes
==================

It is possible to define a persistent index on one or more document attributes
(or attribute paths).
The index is then used in queries to locate documents with a specific index attribute value
or to find documents whose index attribute value(s) are in a given range. 

For example, you can create a persistent index on the attributes `value1` and
`value2` with the following command:

```js
collection.ensureIndex({ type: "persistent", fields: ["value1", "value2"] });
```

If you declare an index to be `unique`, then no two documents are allowed to have
the same set of attribute values. Creating a new document or updating a document
will fail if the uniqueness is violated:

```js
collection.ensureIndex({ type: "persistent", fields: ["value1", "value2"], unique: true });
```

If you declare an index to be `sparse`, a document will be excluded from the index
and no uniqueness checks will be performed if any index attribute value is not
set or has a value of `null`:

```js
collection.ensureIndex({ type: "persistent", fields: ["value1", "value2"], sparse: true });
```

To store additional attributes in the index, you can set the `storedValues`
option:

```js
collection.ensureIndex({ type: "persistent", fields: ["value1", "value2"], storedValues: ["value3"] });
```

To enable in-memory caching of index entries, which can be used when doing point
lookups on the index, you can set the `cacheEnabled` option:


```js
collection.ensureIndex({ type: "persistent", fields: [ "value1", "value2" ], cacheEnabled: true });
```

## Storing additional values in indexes

<small>Introduced in: v3.10.0</small>

Persistent indexes allow you to store additional attributes in the index that
can be used to satisfy projections of the document. They cannot be used for
index lookups or for sorting, but for projections only. They allow persistent
indexes to fully cover more queries and avoid extra document lookups. This can
have a great positive effect on index scan performance if the number of scanned
index entries is large.

You can set the `storedValues` option and specify the additional attributes as
an array of attribute paths when creating a new persistent index, similar to
the `fields` option:

```js
db.<collection>.ensureIndex({
  type: "persistent",
  fields: ["value1"],
  storedValues: ["value2"]
});
```

This will index the `value1` attribute in the traditional sense, so that the index 
can be used for looking up by `value1` or for sorting by `value1`. The index also
supports projections on `value1` as usual.

In addition, due to `storedValues` being used here, the index can now also 
supply the values for the `value2` attribute for projections without having to
look up the full document. Non-existing attributes are stored as `null` values.

The maximum number of attributes that you can use in `storedValues` is 32.
You cannot specify the same attribute path in both, the `fields` and the
`storedValues` option. If there is an overlap, the index creation will abort
with an error message.

In unique indexes, only the index attributes in `fields` are checked for
uniqueness. The index attributes in `storedValues` are not checked for their
uniqueness.

You can not create multiple persistent indexes with the same `fields` attributes
and uniqueness option but different `storedValues` settings. That means the
value of `storedValues` is not considered by calls to `ensureIndex()` when
checking if an index is already present or needs to be created.

## Caching of index values

<small>Introduced in: v3.10.0</small>

You can optionally put an in-memory hash cache in front of persistent indexes.
By default, persistent indexes will not have an in-memory cache. You can enable
it when creating an index by setting the `cacheEnabled` option to `true`:

```js
db.<collection>.ensureIndex({
  type: "persistent",
  fields: ["name"],
  cacheEnabled: true
});
```

You cannot create multiple persistent indexes with the same `fields` attributes
and uniqueness option but different `cacheEnabled` settings. That means the
value of `cacheEnabled` is not considered by calls to `ensureIndex()` when
checking if an index is already present or needs to be created.

The in-memory cache for an index will be initially empty, even if the index
contains data. The cache will be populated lazily upon querying data from the
index when using equality lookups for all index attributes. Cache entries get 
invalidated when modifying data in the underlying collection. Only the affected
index entries will get invalidated.

As the cache is hash-based and unsorted, it cannot be used for full or partial
range scans, for sorting, or for lookups that do not include all index attributes.

Filling the caches upon cache misses during lookups and upon writing to the
collection can mean extra overhead, so it is recommended to use an in-memory cache
only for collections that are accessed mostly for reading via equality lookups,
and that are not often written to.

For AQL queries that will use indexes with an enabled in-memory cache and that are
known to not benefit from using using the cache, you may turn off the usage of
the cache for individual query parts. This can be achieved
via the `useCache` hint that can be provided to an AQL `FOR` loop:

```aql
FOR doc IN collection OPTIONS { useCache: false }
  FILTER doc.value == @lookup
  ...
```

Using the `useCache` option will have no effect for indexes that do not have a
cache enabled, or for queries that are not eligible to use caches.

The number of index cache hits and misses is also reported when profiling queries.
You can use this information to assess the effectiveness of the cache for
particular queries.

You can control the maximum combined memory usage of all in-memory caches via
the existing `--cache.size` startup option, which not only controls the maximum
memory usage for all edge caches, but additionally also the memory usage for all
caches for persistent indexes.

## Accessing Persistent Indexes from the Shell

Ensures that a unique persistent index exists:

`collection.ensureIndex({ type: "persistent", fields: [ "field1", ..., "fieldn" ], unique: true })`

Creates a unique persistent index on all documents using `field1`, ... `fieldn`
as attribute paths. At least one attribute path has to be given. The index will
be non-sparse by default.

All documents in the collection must differ in terms of the indexed 
attributes. Creating a new document or updating an existing document will
will fail if the attribute uniqueness is violated. 

---

To create a sparse unique index, set the `sparse` attribute to `true`:

`collection.ensureIndex({ type: "persistent", fields: [ "field1", ..., "fieldn" ], unique: true, sparse: true })`

In a sparse index all documents will be excluded from the index that do not 
contain at least one of the specified index attributes or that have a value 
of `null` in any of the specified index attributes. Such documents will
not be indexed, and not be taken into account for uniqueness checks.

In a non-sparse index, these documents will be indexed (for non-present
indexed attributes, a value of `null` will be used) and will be taken into
account for uniqueness checks.

In case that the index was successfully created, an object with the index
details, including the index-identifier, is returned.

***Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline ensureUniquePersistentSingle
    @EXAMPLE_ARANGOSH_OUTPUT{ensureUniquePersistentSingle}
    ~db._create("ids");
    db.ids.ensureIndex({ type: "persistent", fields: [ "myId" ], unique: true });
    db.ids.save({ "myId": 123 });
    db.ids.save({ "myId": 456 });
    db.ids.save({ "myId": 789 });
    db.ids.save({ "myId": 123 });  // xpError(ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED)
    ~db._drop("ids");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock ensureUniquePersistentSingle
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

{% arangoshexample examplevar="examplevar" script="script" result="result" %}    
    @startDocuBlockInline ensureUniquePersistentMultiColmun
    @EXAMPLE_ARANGOSH_OUTPUT{ensureUniquePersistentMultiColmun}
    ~db._create("ids");
    db.ids.ensureIndex({ type: "persistent", fields: [ "name.first", "name.last" ], unique: true });
    db.ids.save({ "name" : { "first" : "hans", "last": "hansen" }});
    db.ids.save({ "name" : { "first" : "jens", "last": "jensen" }});
    db.ids.save({ "name" : { "first" : "hans", "last": "jensen" }});
    db.ids.save({ "name" : { "first" : "hans", "last": "hansen" }});  // xpError(ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED)
    ~db._drop("ids");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock ensureUniquePersistentMultiColmun
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

---

Ensures that a non-unique persistent index exists:

`collection.ensureIndex({ type: "persistent", fields: [ "field1", ..., "fieldn" ] })`

Creates a non-unique persistent index on all documents using `field1`, ...
`fieldn` as attribute paths. At least one attribute path has to be given.
The index will be non-sparse by default.

To create a sparse unique index, set the `sparse` attribute to `true`.

In case that the index was successfully created, an object with the index
details, including the index-identifier, is returned.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline ensurePersistent
    @EXAMPLE_ARANGOSH_OUTPUT{ensurePersistent}
    ~db._create("names");
    db.names.ensureIndex({ type: "persistent", fields: [ "first" ] });
    db.names.save({ "first" : "Tim" });
    db.names.save({ "first" : "Tom" });
    db.names.save({ "first" : "John" });
    db.names.save({ "first" : "Tim" });
    db.names.save({ "first" : "Tom" });
    ~db._drop("names");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock ensurePersistent
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Query by example using a persistent index

Constructs a query-by-example using a persistent index:

`collection.byExample(example)`

Selects all documents from the collection that match the specified example 
and returns a cursor. A persistent index will be used if present.

You can use `toArray()`, `next()`, or `hasNext()` to access the
result. The result can be limited using the `skip()` and `limit()`
operator.

An attribute name of the form `a.b` is interpreted as attribute path,
not as attribute. If you use

```json
{ "a" : { "c" : 1 } }
```

as example, then you will find all documents, such that the attribute
`a` contains a document of the form `{ "c" : 1 }`. For example the document

```json
{ "a" : { "c" : 1 }, "b" : 1 }
```

will match, but the document

```json
{ "a" : { "c" : 1, "b" : 1 } }
```

will not.

However, if you use

```json
{ "a.c" : 1 }
```

then you will find all documents, which contain a sub-document in `a`
that has an attribute `c` of value `1`. Both the following documents

```json
{ "a" : { "c" : 1 }, "b" : 1 }
```
and

```json
{ "a" : { "c" : 1, "b" : 1 } }
```
will match.

## Persistent Indexes and Server Language

The order of index entries in persistent indexes adheres to the configured
[server language](programs-arangod-general.html#default-language).
If, however, the server is restarted with a different language setting as when
the persistent index was created, not all documents may be returned anymore and
the sort order of those which are returned can be wrong (whenever the persistent
index is consulted).

To fix persistent indexes after a language change, delete and re-create them.
