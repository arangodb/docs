---
layout: default
description: >-
  You can use inverted indexes to speed up a broad range of AQL queries,
  from simple to complex, including full-text search
---
# Inverted indexes

{{ page.description }}
{:class="lead"}

Documents hold attributes, mapping attribute keys to values.
Inverted indexes store mappings from values (of document attributes) to their
locations in collections. You can create these indexes to accelerate queries
like value lookups, range queries, case-insensitive and fuzzy search, as well
as for sophisticated full-text search with the ability to search for words,
phrases, and more.

## Defining inverted indexes

Inverted indexes are defined per collection. You can add an arbitrary number of
document attributes to each index. Every attribute can optionally be processed
with an [Analyzer](analyzers.html), for instance, to tokenize text into words.


For example, you can create an inverted index on the attributes `value1` and
`value2` with the following command in arangosh:

```js
collection.ensureIndex({ type: "inverted", fields: ["value1", "value2"] });
```

You can expand an array 

### Storing additional values in indexes

Inverted indexes allow you to store additional attributes in the index that
can be used to satisfy projections of the document. They cannot be used for
index lookups or for sorting, but for projections only. They allow inverted
indexes to fully cover more queries and avoid extra document lookups. This can
have a great positive effect on index scan performance if the number of scanned
index entries is large.

You can set the `storedValues` option and specify the additional attributes as
an array of attribute paths when creating a new inverted index:

```js
db.<collection>.ensureIndex({
  type: "persistent",
  fields: ["value1"],
  storedValues: ["value2"]
});
```

This indexes the `value1` attribute in the traditional sense, so that the index 
can be used for looking up by `value1` or for sorting by `value1`. The index also
supports projections on `value1` as usual.

In addition, due to `storedValues` being used here, the index can now also 
supply the values for the `value2` attribute for projections without having to
look up the full document. Non-existing attributes are stored as `null` values.

You cannot specify the same attribute path in both, the `fields` and the
`storedValues` option. If there is an overlap, the index creation aborts
with an error message.

## Utilizing inverted indexes in queries

Unlike other index types in ArangoDB, inverted indexes are not utilized
automatically, even if they are eligible for a query. The reason is that AQL
queries may produce different results with and without an inverted index,
because of differences in how `FILTER` operations work for inverted indexes,
the eventual-consistent nature of this index type, and for backward compatibility.

To use an inverted index, add an `OPTIONS` clause to the `FOR` operation that
you want to speed up. It needs to be a loop over a collection, not an array or
a View. Specify the desired index as an `indexHint`, using its name. If any of
the attributes you filter by is processed by an Analyzer other than `identity`,
then you need to enable the `forceIndexHint` option.

```aql
FOR doc IN coll OPTIONS { indexHint: "inverted_index_name", forceIndexHint: true }
  FILTER doc.value == 42 AND PHRASE(doc.text, ["meaning", 1, "life"])
  RETURN doc
```



## Accessing Persistent Indexes from the Shell

Ensures that a unique persistent index exists:

`collection.ensureIndex({ type: "persistent", fields: [ "field1", ..., "fieldn" ], unique: true })`

Creates a unique persistent index on all documents using *field1*, ... *fieldn*
as attribute paths. At least one attribute path has to be given. The index will
be non-sparse by default.

All documents in the collection must differ in terms of the indexed 
attributes. Creating a new document or updating an existing document will
will fail if the attribute uniqueness is violated. 

To create a sparse unique index, set the *sparse* attribute to `true`:

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


<!-- js/server/modules/@arangodb/arango-collection.js-->


Ensures that a non-unique persistent index exists:

`collection.ensureIndex({ type: "persistent", fields: [ "field1", ..., "fieldn" ] })`

Creates a non-unique persistent index on all documents using *field1*, ...
*fieldn* as attribute paths. At least one attribute path has to be given.
The index will be non-sparse by default.

To create a sparse unique index, set the *sparse* attribute to `true`.

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
