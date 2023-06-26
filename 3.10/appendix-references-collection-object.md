---
layout: default
redirect_from:
  - data-modeling-collections-collection-methods.html # 3.11 -> 3.11
  - data-modeling-documents-document-methods.html # 3.11 -> 3.11
---
# The _collection_ object

The JavaScript API returns _collection_ objects when you use the following methods
of the [`db` object](appendix-references-dbobject.html) from the `@arangodb`:

- `db._create(...)` 
- `db._createDocumentCollection(...)` 
- `db._createEdgeCollection(...)` 
- `db._collections(...)` 
- `db._collection(...)`

{% hint 'info' %}
Square brackets in function signatures denote optional arguments.
{% endhint %}

## Collection

### `collection.checksum([withRevisions [, withData]])`

Calculate a checksum for the data in a collection:

The `checksum` operation calculates an aggregate hash value for all document
keys contained in collection `collection`.

If the optional argument `withRevisions` is set to `true`, then the
revision ids of the documents are also included in the hash calculation.

If the optional argument `withData` is set to `true`, then all user-defined
document attributes are also checksummed. Including the document data in
checksumming makes the calculation slower, but is more accurate.

### `collection.compact()`

Compacts the data of a collection in order to reclaim disk space.
The operation compacts the document and index
data by rewriting the underlying .sst files and only keeps the relevant
entries.

Under normal circumstances running a compact operation is not necessary,
as the collection data is eventually compacted anyway. However, in 
some situations, e.g. after running lots of update/replace or remove 
operations, the disk data for a collection may contain a lot of outdated data
for which the space shall be reclaimed. In this case the compaction operation
can be used.

### `collection.drop([options])`

Drops a `collection` and all its indexes and data.
In order to drop a system collection, an `options` object
with attribute `isSystem` set to `true` must be specified.

{% hint 'info' %}
Dropping a collection in a cluster, which is prototype for sharing
in other collections is prohibited. In order to be able to drop
such a collection, all dependent collections must be dropped first.
{% endhint %}

**Examples**

Drop a collection:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDrop
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDrop}
    ~ db._create("example");
      col = db.example;
      col.drop();
      col;
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDrop
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Drop a system collection:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDropSystem
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDropSystem}
    ~ db._create("_example", { isSystem: true });
      col = db._example;
      col.drop({ isSystem: true });
      col;
    ~ db._drop("example", { isSystem: true });
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDropSystem
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.figures([details])`

Returns an object containing statistics about the collection.

Setting `details` to `true` returns extended storage engine-specific
details to the figures (introduced in v3.8.0). The details are intended for
debugging ArangoDB itself and their format is subject to change. By default,
`details` is set to `false`, so no details are returned and the behavior is
identical to previous versions of ArangoDB.

- `indexes.count`: The total number of indexes defined for the
  collection, including the pre-defined indexes (e.g. primary index).
- `indexes.size`: The total memory allocated for indexes in bytes.
<!-- TODO: describe RocksDB figures -->
- `documentsSize`
- `cacheInUse`
- `cacheSize`
- `cacheUsage`

**Examples**

Get the basic collection figures:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionFigures
    @EXAMPLE_ARANGOSH_OUTPUT{collectionFigures}
    ~ require("internal").wal.flush(true, true);
      db.demo.figures()
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionFigures
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Get the detailed collection figures:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionFiguresDetails
    @EXAMPLE_ARANGOSH_OUTPUT{collectionFiguresDetails}
    ~ require("internal").wal.flush(true, true);
      db.demo.figures(true)
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionFiguresDetails
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.getResponsibleShard(document)`

Return the responsible shard for the given document.

Returns a string with the responsible shard's ID. Note that the
returned shard ID is the ID of responsible shard for the document's
shard key values, and it returns even if no such document exists.

{% hint 'info' %}
The `getResponsibleShard()` method can only be used on Coordinators
in clusters.
{% endhint %}

### `collection.load()`

Loads a collection into memory.

{% hint 'info' %}
Cluster collections are loaded at all times.
{% endhint %}

{% hint 'warning' %}
The `load()` function is **deprecated** as of ArangoDB 3.8.0.
The function may be removed in future versions of ArangoDB. There should not be
any need to load a collection with the RocksDB storage engine.
{% endhint %}

### `collection.name()`

Returns the name of the collection as a string.

**Examples**

Get the collection name from a collection object:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionName
    @EXAMPLE_ARANGOSH_OUTPUT{collectionName}
      var coll = db._create("example");
      coll.name();
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionName
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.properties([properties])`

Get or set the properties of a collection.

`collection.properties()`

Returns an object containing all collection properties.

- `waitForSync` (boolean): If `true`, creating, changing, or removing documents waits
  until the data has been synchronized to disk.

- `keyOptions` (object): An object which contains key generation options.
  - `type` (string): Specifies the type of the key generator. Possible values:
    - `"traditional"`
    - `"autoincrement"`
    - `"uuid"`
    - `"padded"`
  - `allowUserKeys` (boolean): If set to `true`, then you are allowed to supply
    own key values in the `_key` attribute of documents. If set to
    `false`, then the key generator is solely responsible for
    generating keys and an error is raised if you supply own key values in the
    `_key` attribute of documents.
  - `increment` (number): The increment value for the `autoincrement` key generator.
    Not used for other key generator types.
  - `offset` (number): The initial offset value for the `autoincrement` key generator.
    Not used for other key generator types.
  - `lastValue` (number): the current offset value of the `autoincrement` or `padded`
    key generator. This an internal property for restoring dumps properly.

- `schema` (object\|null): 
  An object that specifies the collection-level document schema for documents.
  The attribute keys `rule`, `level` and `message` must follow the rules
  documented in [Document Schema Validation](data-modeling-documents-schema-validation.html)

- `computedValues` (array\|null): An array of objects,
  each representing a [Computed Value](data-modeling-documents-computed-values.html).

- `cacheEnabled` (boolean): Whether the in-memory hash cache for documents is
  enabled for this collection (default: `false`).

- `isSystem` (boolean): Whether the collection is a system collection.
  Collection names that starts with an underscore are usually system collections.

- `syncByRevision` (boolean): Whether the newer revision-based replication protocol
  is enabled for this collection. This is an internal property.

- `globallyUniqueId` (string): A unique identifier of the collection.
  This is an internal property.

In a cluster setup, the result also contains the following attributes:

- `numberOfShards` (number): The number of shards of the collection.

- `shardKeys` (array): Contains the names of document attributes that are used to
  determine the target shard for documents.

- `replicationFactor` (number\|string): Determines how many copies of each shard are kept
  on different DB-Servers. Has to be in the range of 1-10 or the string
  `"satellite"` for a SatelliteCollection (Enterprise Edition only).
  _(cluster only)_

- `writeConcern` (number): Determines how many copies of each shard are required to be
  in sync on the different DB-Servers. If there are less then these many copies
  in the cluster, a shard refuses to write. Writes to shards with enough
  up-to-date copies succeed at the same time, however. The value of
  `writeConcern` cannot be greater than `replicationFactor`. _(cluster only)_

- `shardingStrategy` (string): the sharding strategy selected for the collection.
  _(cluster only)_

  Possible values:
  - `"community-compat"`
  - `"enterprise-compat"`
  - `"enterprise-smart-edge-compat"`
  - `"hash"`
  - `"enterprise-hash-smart-edge"`
  - `"enterprise-hex-smart-vertex"`

- `distributeShardsLike` (string):
  The name of another collection. This collection uses the `replicationFactor`,
  `numberOfShards` and `shardingStrategy` properties of the other collection and
  the shards of this collection are distributed in the same way as the shards of
  the other collection.

- `isSmart` (boolean): Whether the collection is used in a SmartGraph or
  EnterpriseGraph (Enterprise Edition only). This is an internal property.

- `isDisjoint` (boolean): Whether the SmartGraph this collection belongs to is
  disjoint (Enterprise Edition only). This is an internal property.

- `smartGraphAttribute` (string):
  The attribute that is used for sharding: vertices with the same value of
  this attribute are placed in the same shard. All vertices are required to
  have this attribute set and it has to be a string. Edges derive the
  attribute from their connected vertices.

  This feature can only be used in the *Enterprise Edition*.

- `smartJoinAttribute` (string):
  In an *Enterprise Edition* cluster, this attribute determines an attribute
  of the collection that must contain the shard key value of the referred-to
  SmartJoin collection.

---

`collection.properties(properties)`

Changes the collection properties. `properties` must be an object and can have
one or more of the following attribute(s):

- `waitForSync` (boolean): If `true`, creating a document only returns
  after the data was synced to disk.

- `replicationFactor` (number\|string): Change the number of shard copies kept on
  different DB-Servers. Valid values are integer numbers in the range of 1-10
  or the string `"satellite"` for a SatelliteCollection (Enterprise Edition only).
  _(cluster only)_

- `writeConcern` (number): Change how many copies of each shard are required to be
  in sync on the different DB-Servers. If there are less then these many copies
  in the cluster, a shard refuses to write. Writes to shards with enough
  up-to-date copies succeed at the same time however. The value of
  `writeConcern` cannot be greater than `replicationFactor`. _(cluster only)_

- `computedValues` (array\|null): An array of objects, each representing a
  [Computed Value](data-modeling-documents-computed-values.html).

- `schema` (object\|null): An object that specifies the collection level document schema for
  documents. The attribute keys `rule`, `level` and `message` must follow the rules
  documented in [Document Schema Validation](data-modeling-documents-schema-validation.html)

- `cacheEnabled` (boolean): Whether the in-memory hash cache for documents should be
  enabled for this collection. Can be controlled globally
  with the `--cache.size` startup option. The cache can speed up repeated reads
  of the same documents via their document keys. If the same documents are not
  fetched often or are modified frequently, then you may disable the cache to
  avoid the maintenance costs.

{% hint 'info' %}
Some other collection properties, such as `type`,
`keyOptions`, `numberOfShards` or `shardingStrategy` cannot be changed once
the collection is created.
{% endhint %}

**Examples**

Read all properties:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionProperties
    @EXAMPLE_ARANGOSH_OUTPUT{collectionProperties}
    ~ db._create("example");
      db.example.properties();
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionProperties
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Change a property:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionProperty
    @EXAMPLE_ARANGOSH_OUTPUT{collectionProperty}
    ~ db._create("example");
      db.example.properties({ waitForSync : true });
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionProperty
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.rename(name)`

Renames a collection. The `new-name` must not already be
used for a different collection. `new-name` must also be a valid collection name.
For information about the naming constraints for collections, see
[Collection names](data-modeling-collections.html#collection-names).

If renaming fails for any reason, an error is thrown.
If renaming the collection succeeds, then the collection is also renamed in
all graph definitions inside the `_graphs` collection in the current
database.

{% hint 'info' %}
The `rename()` method cannot be used in clusters.
{% endhint %}

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionRename
    @EXAMPLE_ARANGOSH_OUTPUT{collectionRename}
    ~ db._create("example");
      c = db.example;
      c.rename("better-example");
      c;
    ~ db._drop("better-example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionRename
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.revision()`

Returns the revision ID of the collection

The revision ID is updated when the document data is modified, either by
inserting, deleting, updating or replacing documents in it.

The revision ID of a collection can be used by clients to check whether
data in a collection has changed or if it is still unmodified since a
previous fetch of the revision ID.

The revision ID returned is a string value. Clients should treat this value
as an opaque string, and only use it for equality/non-equality comparisons.

### `collection.shards([details])`

Return the available shards for the collection.

If `details` is not set, or set to `false`, returns an array with the names of 
the available shards of the collection.

If `details` is set to `true`, returns an object with the shard names as
object attribute keys, and the responsible servers as an array mapped to each
shard attribute key.

The leader shards are always first in the arrays of responsible servers.

{% hint 'info' %}
The `shards()` method can only be used on Coordinators in clusters.
{% endhint %}

### `collection.truncate()`

Truncates a `collection`, removing all documents but keeping all its
indexes.

**Examples**

Truncates a collection:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionTruncate
    @EXAMPLE_ARANGOSH_OUTPUT{collectionTruncate}
    ~ db._create("example");
      col = db.example;
      col.save({ "Hello" : "World" });
      col.count();
      col.truncate();
      col.count();
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionTruncate
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.type()`

Returns the type of a collection. Possible values are:

- `2`: document collection
- `3`: edge collection

### `collection.unload()`

Starts unloading a collection from memory. Note that unloading is deferred
until all queries have finished.

{% hint 'info' %}
In cluster deployments, collections cannot be unloaded.
{% endhint %}

{% hint 'warning' %}
The `unload()` function is **deprecated** as of ArangoDB 3.8.0.
The function may be removed in future versions of ArangoDB. There should not be
any need to unload a collection with the RocksDB storage engine.
{% endhint %}

## Indexes

### `collection.ensureIndex(description)`

Creates an index if it doesn't exist already.

See [`collection.ensureIndex()`](indexing-working-with-indexes.html#creating-an-index).

### `collection.indexes([withStats [, withHidden]])`

Lists all indexes of the collection.

See [`collection.indexes()`](indexing-working-with-indexes.html#listing-all-indexes-of-a-collection).

### `collection.getIndexes([withStats [, withHidden]])`

Same as [`collection.indexes([withStats [, withHidden]])`](#collectionindexeswithstats--withhidden).

### `collection.index(index)`

Gets an index by identifier.

See [`collection.index()`](indexing-working-with-indexes.html#index-identifiers).

### `collection.dropIndex(index)`

Drops an index by identifier.

See [`collection.dropIndex()`](indexing-working-with-indexes.html#dropping-an-index-via-a-collection-object).

## Documents

### `collection.all()`

Fetches all documents from a collection and returns a cursor. You can use
`toArray()`, `next()`, or `hasNext()` to access the result. The result
can be limited using the `skip()` and `limit()` operator.

**Examples**

Use `toArray()` to get all documents at once:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 001_collectionAll
    @EXAMPLE_ARANGOSH_OUTPUT{001_collectionAll}
    ~ db._create("five");
      db.five.insert({ name : "one" });
      db.five.insert({ name : "two" });
      db.five.insert({ name : "three" });
      db.five.insert({ name : "four" });
      db.five.insert({ name : "five" });
      db.five.all().toArray();
    ~ db._drop("five");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 001_collectionAll
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Use `limit()` to restrict the documents:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 002_collectionAllNext
    @EXAMPLE_ARANGOSH_OUTPUT{002_collectionAllNext}
    ~ db._create("five");
      db.five.insert({ name : "one" });
      db.five.insert({ name : "two" });
      db.five.insert({ name : "three" });
      db.five.insert({ name : "four" });
      db.five.insert({ name : "five" });
      db.five.all().limit(2).toArray();
    ~ db._drop("five");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 002_collectionAllNext
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.any()`

Returns a random document from the collection or `null` if none exists.

**Note**: this method is expensive when using the RocksDB storage engine.
<!-- TODO: only pseudo-random and there is an optimization for a single doc -->

### `collection.byExample(example)`

Fetches all documents from a collection that match the specified
example and returns a cursor.

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

```js
collection.byExample(path1, value1, ...)
```

As alternative you can supply an array of paths and values.

**Examples**

Use `toArray()` to get all documents at once:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 003_collectionByExample
    @EXAMPLE_ARANGOSH_OUTPUT{003_collectionByExample}
    ~ db._create("users");
      db.users.insert({ name: "Gerhard" });
      db.users.insert({ name: "Helmut" });
      db.users.insert({ name: "Angela" });
      db.users.all().toArray();
      db.users.byExample({ "_id" : "users/20" }).toArray();
      db.users.byExample({ "name" : "Gerhard" }).toArray();
      db.users.byExample({ "name" : "Helmut", "_id" : "users/15" }).toArray();
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 003_collectionByExample
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Use `next()` to loop over all documents:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 004_collectionByExampleNext
    @EXAMPLE_ARANGOSH_OUTPUT{004_collectionByExampleNext}
    ~ db._create("users");
      db.users.insert({ name: "Gerhard" });
      db.users.insert({ name: "Helmut" });
      db.users.insert({ name: "Angela" });
      var a = db.users.byExample( {"name" : "Angela" } );
      while (a.hasNext()) print(a.next());
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 004_collectionByExampleNext
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.count()`

Returns the number of living documents in the collection.

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionCount
    @EXAMPLE_ARANGOSH_OUTPUT{collectionCount}
    ~ db._create("users");
      db.users.count();
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionCount
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.document(object [, options])`

The `document()` method finds a document given an object `object`
containing the `_id` or `_key` attribute. The method returns
the document if it can be found. If both attributes are given,
the `_id` takes precedence, it is an error, if the collection part
of the `_id` does not match the `collection`.

An error is thrown if `_rev` is specified but the document found has a
different revision already. An error is also thrown if no document exists
with the given `_id` or `_key` value.

Please note that if the method is executed on the arangod server (e.g. from
inside a Foxx application), an immutable document object will be returned
for performance reasons. It is not possible to change attributes of this
immutable object. To update or patch the returned document, it needs to be
cloned/copied into a regular JavaScript object first. This is not necessary
if the `document` method is called from out of arangosh or from any other
client.

If you pass `options` as the second argument, it must be an object.

- If the object has the `allowDirtyReads` attribute set to `true`, then the
  Coordinator is allowed to read from any shard replica and not only from
  the leader shard. See [Read from followers](http/document.html#read-from-followers)
  for details.

---

`collection.document(document-identifier [, options])`

Finds a document using a document identifier, optionally with an options passed
as an object.

No revision can be specified in this case.

---

`collection.document(document-key [, options])`

Finds a document using a document key, optionally with an options passed
as an object.

No revision can be specified in this case.

---

`collection.document(array [, options])`

This variant allows you to perform the operation on a whole array of arguments.
The behavior is exactly as if `document()` would have been called on all members
of the array separately and all results are returned in an array. If an error
occurs with any of the documents, no exception is raised! Instead of a document,
an error object is returned in the result array.

**Examples**

Return a document using a document identifier:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionNameValidPlain
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionNameValidPlain}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "2873916"});
      db.example.document("example/2873916");
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionNameValidPlain
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Return a document using a document key:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionNameValidByKey
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionNameValidByKey}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "2873916"});
      db.example.document("2873916");
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionNameValidByKey
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Return a document using an object with a document identifier:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionNameValidByObject
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionNameValidByObject}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "2873916"});
      db.example.document({_id: "example/2873916"});
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionNameValidByObject
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Return multiple documents using an array of document keys:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionNameValidMulti
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionNameValidMulti}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "2873916"});
    ~ var myid = db.example.insert({_key: "2873917"});
      db.example.document(["2873916","2873917"]);
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionNameValidMulti
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

An error is raised if the document is unknown:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionNameUnknown
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionNameUnknown}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "2873916"});
      db.example.document("example/4472917"); // xpError(ERROR_ARANGO_DOCUMENT_NOT_FOUND)
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionNameUnknown
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

An error is raised if the document key or identifier is invalid:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionNameHandle
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionNameHandle}
    ~ db._create("example");
      db.example.document(""); // xpError(ERROR_ARANGO_DOCUMENT_HANDLE_BAD)
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionNameHandle
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.documents(keys)`

Looks up the documents in the specified collection using the array of
keys provided. All documents for which a matching key was specified in
the `keys` array and that exist in the collection will be returned. Keys
for which no document can be found in the underlying collection are
ignored, and no exception will be thrown for them.

{% hint 'info' %}
This method is deprecated in favor of the array variant of
[`document()`](#collectiondocumentobject--options).
{% endhint %}

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionLookupByKeys
    @EXAMPLE_ARANGOSH_OUTPUT{collectionLookupByKeys}
    ~ db._drop("example");
    ~ db._create("example");
      keys = [ ];
    | for (var i = 0; i < 10; ++i) {
    |   db.example.insert({ _key: "test" + i, value: i });
    |   keys.push("test" + i);
      }
      db.example.documents(keys);
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionLookupByKeys
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.documentId(documentKey)`

Converts a document key to a document identifier by prepending the collection's
name and a forward slash to the key.

Raises an error if the document key is invalid. Note that this method does not
check whether the document exists in the collection.

### `collection.exists(object [, options])`

The `exists()` method determines whether a document exists given an object
`object` containing the `_id` or `_key` attribute. If both attributes
are given, the `_id` takes precedence, it is an error, if the collection
part of the `_id` does not match the `collection`.

An error is thrown if `_rev` is specified but the document found has a
different revision already.

Instead of returning the found document or an error, this method will
only return an object with the attributes `_id`, `_key` and `_rev`, or
`false` if no document with the given `_id` or `_key` exists. It can
thus be used for easy existence checks.

This method throws an error if used improperly, e.g. if called
with a string that isn't a document key or identifier, an object with invalid
or missing `_key` or `_id` attribute, or if documents from other collections are 
requested.

If you pass `options` as the second argument, it must be an object. If this
object has the `allowDirtyReads` attribute set to `true`, then the
Coordinator is allowed to read from any shard replica and not only from
the leader shard. See [Read from followers](http/document.html#read-from-followers)
for details.

---

`collection.exists(document-identifier [, options])`

Checks whether a document exists described by a document identifier, optionally
with options passed as an object.

No revision can be specified in this case.

---

`collection.exists(document-key [, options])`

Checks whether a document exists described by a document key, optionally
with options passed as an object.

No revision can be specified in this case.

---

`collection.exists(array [, options])`

This variant allows you to perform the operation on a whole array of arguments.
The behavior is exactly as if `exists()` would have been called on all
members of the array separately and all results are returned in an array. If an error
occurs with any of the documents, the operation stops immediately returning
only an error object.

### `collection.firstExample(example)`

Returns some document of a collection that matches the specified
example. If no such document exists, `null` will be returned.
The example has to be specified as paths and values.
See `byExample` for details.

---

`collection.firstExample(path1, value1, ...)`

As alternative you can supply an array of paths and values.

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionFirstExample
    @EXAMPLE_ARANGOSH_OUTPUT{collectionFirstExample}
    ~ db._create("users");
    ~ db.users.insert({ name: "Gerhard" });
    ~ db.users.insert({ name: "Helmut" });
    ~ db.users.insert({ name: "Angela" });
      db.users.firstExample("name", "Angela");
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionFirstExample
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.insert(data [, options])`

Creates a new document in the `collection` from the given `data`. The
`data` must be an object. The attributes `_id` and `_rev` are ignored
and are automatically generated. A unique value for the attribute `_key`
will be automatically generated if not specified. If specified, there
must not be a document with the given `_key` in the collection.

The method returns a document with the attributes `_id`, `_key` and
`_rev`. The attribute `_id` contains the document identifier of the newly
created document, the attribute `_key` the document key and the
attribute `_rev` contains the document revision.

---

`collection.insert(data, options)`

Creates a new document in the `collection` from the given `data` as
above. The optional `options` parameter must be an object and can be
used to specify the following options:

- `waitForSync`: One can force
  synchronization of the document creation operation to disk even in
  case that the `waitForSync` flag is been disabled for the entire
  collection. Thus, the `waitForSync` option can be used to force
  synchronization of just specific operations. To use this, set the
  `waitForSync` parameter to `true`. If the `waitForSync` parameter
  is not specified or set to `false`, then the collection's default
  `waitForSync` behavior is applied. The `waitForSync` parameter
  cannot be used to disable synchronization for collections that have
  a default `waitForSync` value of `true`.
- `silent`: If this flag is set to `true`, the method does not return
  any output.
- `returnNew`: If this flag is set to `true`, the complete new document
  is returned in the output under the attribute `new`.
- `returnOld`: If this flag is set to `true`, the complete old document
  is returned in the output under the attribute `old`. Only available 
  in combination with the `overwrite` option
- `overwrite`: If set to `true`, the insert becomes a replace-insert.
  If a document with the same `_key` exists already the new document
  is not rejected with unique constraint violated but will replace
  the old document. Note that operations with `overwrite` parameter require
  a `_key` attribute in the request payload, therefore they can only be
  performed on collections sharded by `_key`.
- `overwriteMode`: this optional flag can have one of the following values:
  - `ignore`: if a document with the specified `_key` value exists already,
    nothing will be done and no write operation will be carried out.
    The insert operation will return success in this case. This mode does not
    support returning the old document version using the `returnOld`
    attribute. `returnNew` will only set the `new` attribute in the response
    if a new document was inserted.
  - `replace`: if a document with the specified `_key` value exists already,
    it will be overwritten with the specified document value. This mode will
    also be used when no overwrite mode is specified but the `overwrite`
    flag is set to `true`.
  - `update`: if a document with the specified `_key` value exists already,
    it will be patched (partially updated) with the specified document value.
    The overwrite mode can be further controlled via the `keepNull` and
    `mergeObjects` parameters.
  - `conflict`: if a document with the specified `_key` value exists already,
    return a unique constraint violation error so that the insert operation
    fails. This is also the default behavior in case the overwrite mode is
    not set, and the `overwrite` flag is `false` or not set either.
- `keepNull`: The optional `keepNull` parameter can be used to modify
  the behavior when handling `null` values. Normally, `null` values
  are stored in the database. By setting the `keepNull` parameter to
  `false`, this behavior can be changed so that top-level attributes and
  sub-attributes in `data` with `null` values are removed from the target
  document (but not attributes of objects that are nested inside of arrays).
  This option controls the update-insert behavior only.
- `mergeObjects`: Controls whether objects (not arrays) will be
  merged if present in both the existing and the patch document. If
  set to `false`, the value in the patch document will overwrite the
  existing document's value. If set to `true`, objects will be merged.
  The default is `true`.
  This option controls the update-insert behavior only.

---

`collection.insert(array [, options])`

This variant allows you to perform the operation on a whole array of
arguments. The behavior is exactly as if `insert()` would have been called on all
members of the array separately and all results are returned in an array. If an
error occurs with any of the documents, no exception is raised! Instead of a
document, an error object is returned in the result array.

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionInsertSingle
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionInsertSingle}
    ~ db._create("example");
      db.example.insert({ Hello : "World" });
      db.example.insert({ Hello : "World" }, {waitForSync: true});
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionInsertSingle
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionInsertMulti
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionInsertMulti}
    ~ db._create("example");
      db.example.insert([{ Hello : "World" }, {Hello: "there"}])
      db.example.insert([{ Hello : "World" }, {}], {waitForSync: true});
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionInsertMulti
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionInsertSingleOverwrite
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionInsertSingleOverwrite}
    ~ db._create("example");
      db.example.insert({ _key : "666", Hello : "World" });
      db.example.insert({ _key : "666", Hello : "Universe" }, {overwrite: true, returnOld: true});
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionInsertSingleOverwrite
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.iterate(iterator [, options])`

{% hint 'warning' %}
The `iterate()` method is deprecated from version 3.11.0 onwards and will be
removed in a future version.
{% endhint %}

Iterates over some elements of the collection and apply the function
`iterator` to the elements. The function will be called with the
document as first argument and the current number (starting with 0)
as second argument.

`options` must be an object with the following attributes:

- `limit` (optional, default none): use at most `limit` documents.

- `probability` (optional, default all): a number between `0` and
  `1`. Documents are chosen with this probability.

### `collection.remove(object)`

Removes a document described by the `object`, which must be an object
containing the `_id` or `_key` attribute. There must be a document with
that `_id` or `_key` in the current collection. This document is then
removed.

The method returns a document with the attributes `_id`, `_key` and `_rev`.
The attribute `_id` contains the document identifier of the
removed document, the attribute `_rev` contains the document revision of
the removed document.

If the object contains a `_rev` attribute, the method first checks
that the specified revision is the current revision of that document.
If not, there is a conflict, and an error is thrown.

---

`collection.remove(object, options)`

Removes a document, with additional boolean `options` passed as an object:

- `waitForSync`: One can force
  synchronization of the document creation operation to disk even in
  case that the `waitForSync` flag is been disabled for the entire
  collection. Thus, the `waitForSync` option can be used to force
  synchronization of just specific operations. To use this, set the
  `waitForSync` parameter to `true`. If the `waitForSync` parameter
  is not specified or set to `false`, then the collection's default
  `waitForSync` behavior is applied. The `waitForSync` parameter
  cannot be used to disable synchronization for collections that have
  a default `waitForSync` value of `true`.
- `overwrite`: If this flag is set to `true`, a `_rev` attribute in
  the object is ignored.
- `returnOld`: If this flag is set to `true`, the complete previous
  revision of the document is returned in the output under the
  attribute `old`.
- `silent`: If this flag is set to `true`, no output is returned.

---

`collection.remove(document-identifier [, options])`

Removes a document described by a document identifier, optionally with
additional options passed as an object.

No revision check is performed.

---

`collection.remove(document-key [, options])`

Removes a document described by a document key, optionally with
additional options passed as an object.

No revision check is performed.

---

`collection.remove(array [, options])`

This variant allows you to perform the operation on a whole array of 
document identifiers, document keys, and objects with a `_key` attribute.

The behavior is exactly as if `remove()` would have been called on all
members of the array separately and all results are returned in an array. If an
error occurs with any of the documents, no exception is raised! Instead of a
document, an error object is returned in the result array.

**Examples**

Remove a document:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentDocumentRemoveSimple
    @EXAMPLE_ARANGOSH_OUTPUT{documentDocumentRemoveSimple}
    ~ db._create("example");
      a1 = db.example.insert({ a : 1 });
      db.example.document(a1);
      db.example.remove(a1);
      db.example.document(a1); // xpError(ERROR_ARANGO_DOCUMENT_NOT_FOUND);
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentDocumentRemoveSimple
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Remove a document with a conflict:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentDocumentRemoveConflict
    @EXAMPLE_ARANGOSH_OUTPUT{documentDocumentRemoveConflict}
    ~ db._create("example");
      a1 = db.example.insert({ a : 1 });
      a2 = db.example.replace(a1, { a : 2 });
      db.example.remove(a1);       // xpError(ERROR_ARANGO_CONFLICT);
      db.example.remove(a1, true);
      db.example.document(a1);     // xpError(ERROR_ARANGO_DOCUMENT_NOT_FOUND);
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentDocumentRemoveConflict
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.removeByExample(example)`

Removes all documents matching an example.

---

`collection.removeByExample(document, waitForSync)`

The optional `waitForSync` parameter can be used to force synchronization
of the document deletion operation to disk even in case that the
`waitForSync` flag had been disabled for the entire collection. Thus,
the `waitForSync` parameter can be used to force synchronization of just
specific operations. To use this, set the `waitForSync` parameter to
`true`. If the `waitForSync` parameter is not specified or set to
`false`, then the collection's default `waitForSync` behavior is
applied. The `waitForSync` parameter cannot be used to disable
synchronization for collections that have a default `waitForSync` value
of `true`.

---

`collection.removeByExample(document, waitForSync, limit)`

The optional `limit` parameter can be used to restrict the number of
removals to the specified value. If `limit` is specified but less than the
number of documents in the collection, it is undefined which documents are
removed.

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 010_documentsCollectionRemoveByExample
    @EXAMPLE_ARANGOSH_OUTPUT{010_documentsCollectionRemoveByExample}
    ~ db._create("example");
    ~ db.example.insert({ Hello : "world" });
      db.example.removeByExample( {Hello : "world"} );
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 010_documentsCollectionRemoveByExample
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.removeByKeys(keys)`

Looks up the documents in the specified collection using the array of keys
provided, and removes all documents from the collection whose keys are
contained in the `keys` array. Keys for which no document can be found in
the underlying collection are ignored, and no exception will be thrown for
them.

The method will return an object containing the number of removed documents
in the `removed` sub-attribute, and the number of not-removed/ignored
documents in the `ignored` sub-attribute.

This method is deprecated in favor of the array variant of `remove()`.

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionRemoveByKeys
    @EXAMPLE_ARANGOSH_OUTPUT{collectionRemoveByKeys}
    ~ db._drop("example");
    ~ db._create("example");
      keys = [ ];
    | for (var i = 0; i < 10; ++i) {
    |   db.example.insert({ _key: "test" + i, value: i });
    |   keys.push("test" + i);
      }
      db.example.removeByKeys(keys);
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionRemoveByKeys
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.replace(document, data [, options])`

`collection.replace(object, data)`

Replaces an existing document described by the `object`, which must
be an object containing the `_id` or `_key` attribute. There must be
a document with that `_id` or `_key` in the current collection. This
document is then replaced with the `data` given as second argument.
Any attribute `_id`, `_key` or `_rev` in `data` is ignored.

The method returns a document with the attributes `_id`, `_key`, `_rev`
and `_oldRev`. The attribute `_id` contains the document identifier of the
updated document, the attribute `_rev` contains the document revision of
the updated document, the attribute `_oldRev` contains the revision of
the old (now replaced) document.

If the object contains a `_rev` attribute, the method first checks
that the specified revision is the current revision of that document.
If not, there is a conflict, and an error is thrown.

---

`collection.replace(object, data, options)`

Replaces an existing document, with additional options passed as an object:

- `waitForSync`: One can force
  synchronization of the document creation operation to disk even in
  case that the `waitForSync` flag is been disabled for the entire
  collection. Thus, the `waitForSync` option can be used to force
  synchronization of just specific operations. To use this, set the
  `waitForSync` parameter to `true`. If the `waitForSync` parameter
  is not specified or set to `false`, then the collection's default
  `waitForSync` behavior is applied. The `waitForSync` parameter
  cannot be used to disable synchronization for collections that have
  a default `waitForSync` value of `true`.
- `overwrite`: If this flag is set to `true`, a `_rev` attribute in
  the object is ignored.
- `returnNew`: If this flag is set to `true`, the complete new document
  is returned in the output under the attribute `new`.
- `returnOld`: If this flag is set to `true`, the complete previous
  revision of the document is returned in the output under the
  attribute `old`.
- `silent`: If this flag is set to `true`, no output is returned.

---

`collection.replace(document-identifier, data [, options])`

Replaces an existing document described by a document identifier, optionally
with additional options passed as an object.

No revision check is performed.

---

`collection.replace(document-key, data [, options])`

Replaces an existing document described by a document key, optionally
with additional options passed as an object.

No revision check is performed.

---

`collection.replace(document-array, data-array [, options])`

This variant allows you to perform the replace operation on two whole arrays of
arguments. The two arrays given as `document-array` and `data-array`
must have the same length. The behavior is exactly as if `replace()` would have
been called on all respective members of the two arrays in pairs and all results
are returned in an array. If an error occurs with any of the documents, no
exception is raised! Instead of a document, an error object is returned in the
result array.
 
**Examples**

Create and update a document:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionReplace1
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionReplace1}
    ~ db._create("example");
      a1 = db.example.insert({ a : 1 });
      a2 = db.example.replace(a1, { a : 2 });
      a3 = db.example.replace(a1, { a : 3 }); // xpError(ERROR_ARANGO_CONFLICT);
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionReplace1
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Use a document identifier:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionReplaceHandle
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionReplaceHandle}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "3903044"});
      a1 = db.example.insert({ a : 1 });
      a2 = db.example.replace("example/3903044", { a : 2 });
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionReplaceHandle
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.replaceByExample(example, newValue [, waitForSync [, limit]])`

Replaces all documents matching an example with a new document body.
The entire document body of each document matching the `example` is
replaced with `newValue`. The document meta-attributes `_id`, `_key` and
`_rev` are not replaced.

The optional `waitForSync` parameter can be used to force synchronization
of the document replacement operation to disk even in case that the
`waitForSync` flag had been disabled for the entire collection. Thus,
the `waitForSync` parameter can be used to force synchronization of just
specific operations. To use this, set the `waitForSync` parameter to
`true`. If the `waitForSync` parameter is not specified or set to
`false`, then the collection's default `waitForSync` behavior is
applied. The `waitForSync` parameter cannot be used to disable
synchronization for collections that have a default `waitForSync` value
of `true`.

The optional `limit` parameter can be used to restrict the number of
replacements to the specified value. If `limit` is specified but less than
the number of documents in the collection, it is undefined which documents are
replaced.

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 011_documentsCollectionReplaceByExample
    @EXAMPLE_ARANGOSH_OUTPUT{011_documentsCollectionReplaceByExample}
    ~ db._create("example");
      db.example.insert({ Hello : "world" });
      db.example.replaceByExample({ Hello: "world" }, {Hello: "mars"}, false, 5);
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 011_documentsCollectionReplaceByExample
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.save(data [, options])

See [`collection.insert(data [, options])`](#collectioninsertdata--options).

### `collection.toArray()`

Converts the entire collection into an array of documents.

{% hint 'warning' %}
Avoid calling this method on a collection in production environments as it
creates a copy of your collection data in memory, which may require a
substantial amount of resources depending on the number and size of the
documents in the collection.
{% endhint %}

### `collection.update(document, data [, options])`

`collection.update(object, data)`

Updates an existing document described by the `object`, which must
be an object containing the `_id` or `_key` attribute. There must be
a document with that `_id` or `_key` in the current collection. This
document is then patched with the `data` given as second argument.
Any attribute `_id`, `_key` or `_rev` in `data` is ignored.

The method returns a document with the attributes `_id`, `_key`, `_rev`
and `_oldRev`.
- The `_key` and `_id` attributes contains the document key and
  document identifier of the updated document.
- The `_rev` attribute contains the document revision of
  the updated document
- The `_oldRev` attribute contains the revision of
  the old (now updated) document.

If the object contains a `_rev` attribute, the method first checks
that the specified revision is the current revision of that document.
If not, there is a conflict, and an error is raised.

---

`collection.update(object, data, options)`

Updates an existing document, with additional options passed as
an object:

- `waitForSync`: One can force
  synchronization of the document creation operation to disk even in
  case that the `waitForSync` flag is been disabled for the entire
  collection. Thus, the `waitForSync` option can be used to force
  synchronization of just specific operations. To use this, set the
  `waitForSync` parameter to `true`. If the `waitForSync` parameter
  is not specified or set to `false`, then the collection's default
  `waitForSync` behavior is applied. The `waitForSync` parameter
  cannot be used to disable synchronization for collections that have
  a default `waitForSync` value of `true`.
- `overwrite`: If this flag is set to `true`, a `_rev` attribute in
  the selector is ignored.
- `returnNew`: If this flag is set to `true`, the complete new document
  is returned in the output under the attribute `new`.
- `returnOld`: If this flag is set to `true`, the complete previous
  revision of the document is returned in the output under the
  attribute `old`.
- `silent`: If this flag is set to `true`, no output is returned.
- `keepNull`: The optional `keepNull` parameter can be used to modify
  the behavior when handling `null` values. Normally, `null` values
  are stored in the database. By setting the `keepNull` parameter to
  `false`, this behavior can be changed so that top-level attributes and
  sub-attributes in `data` with `null` values are removed from the target
  document (but not attributes of objects that are nested inside of arrays).
- `mergeObjects`: Controls whether objects (not arrays) will be
  merged if present in both the existing and the patch document. If
  set to `false`, the value in the patch document will overwrite the
  existing document's value. If set to `true`, objects will be merged.
  The default is `true`.

---

`collection.update(document-identifier, data [, options])`

Updates an existing document described by a document identifier, optionally with
additional options passed as an object.

No revision check is performed.

---

`collection.update(document-key, data [, options])`

Updates an existing document described by a document key, optionally with
additional options passed as an object.

No revision check is performed.

---

`collection.update(document-array, data-array [, options])`

This variant allows you to perform the operation on two whole arrays of
arguments. The two arrays given as `document-array` and `data-array`
must have the same length. The behavior is exactly as if `update()` would have
been called on all respective members of the two arrays in pairs and all results are
returned in an array. If an error occurs with any of the documents, no
exception is raised! Instead of a document, an error object is returned in the
result array.

**Examples**

Create and update a document:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollection_UpdateDocument
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollection_UpdateDocument}
    ~ db._create("example");
      a1 = db.example.insert({"a" : 1});
      a2 = db.example.update(a1, {"b" : 2, "c" : 3});
      a3 = db.example.update(a1, {"d" : 4}); // xpError(ERROR_ARANGO_CONFLICT);
      a4 = db.example.update(a2, {"e" : 5, "f" : 6 });
      db.example.document(a4);
      a5 = db.example.update(a4, {"a" : 1, c : 9, e : 42 });
      db.example.document(a5);
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollection_UpdateDocument
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Use a document identifier:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollection_UpdateHandleSingle
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollection_UpdateHandleSingle}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "18612115"});
      a1 = db.example.insert({"a" : 1});
      a2 = db.example.update("example/18612115", { "x" : 1, "y" : 2 });
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollection_UpdateHandleSingle
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Use the `keepNull` parameter to remove attributes with `null` values:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollection_UpdateHandleKeepNull
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollection_UpdateHandleKeepNull}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "19988371"});
      db.example.insert({"a" : 1});
    |db.example.update("example/19988371",
                       { "b" : null, "c" : null, "d" : 3 });
      db.example.document("example/19988371");
      db.example.update("example/19988371", { "a" : null }, false, false);
      db.example.document("example/19988371");
    | db.example.update("example/19988371",
                        { "b" : null, "c": null, "d" : null }, false, false);
      db.example.document("example/19988371");
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollection_UpdateHandleKeepNull
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Patching array values:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollection_UpdateHandleArray
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollection_UpdateHandleArray}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "20774803"});
    |  db.example.insert({"a" : { "one" : 1, "two" : 2, "three" : 3 },
                          "b" : { }});
    | db.example.update("example/20774803", {"a" : { "four" : 4 },
                                             "b" : { "b1" : 1 }});
      db.example.document("example/20774803");
    | db.example.update("example/20774803", { "a" : { "one" : null },
    |                                         "b" : null },
                        false, false);
      db.example.document("example/20774803");
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollection_UpdateHandleArray
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `collection.updateByExample(example, newValue [, options])

`collection.updateByExample(example, newValue [, keepNull [, waitForSync [, limit]]])`

Updates all documents matching an example with a new document body.
Specific attributes in the document body of each document matching the
`example` are updated with the values from `newValue`.
The document meta-attributes `_id`, `_key` and `_rev` cannot be updated.

The optional `keepNull` parameter can be used to modify the behavior when
handling `null` values. Normally, `null` values are stored in the
database. By setting the `keepNull` parameter to `false`, this behavior
can be changed so that top-level attributes and sub-attributes in `data` with
`null` values are removed from the target document (but not attributes of
objects that are nested inside of arrays).

The optional `waitForSync` parameter can be used to force synchronization
of the document replacement operation to disk even in case that the
`waitForSync` flag had been disabled for the entire collection. Thus,
the `waitForSync` parameter can be used to force synchronization of just
specific operations. To use this, set the `waitForSync` parameter to
`true`. If the `waitForSync` parameter is not specified or set to
`false`, then the collection's default `waitForSync` behavior is
applied. The `waitForSync` parameter cannot be used to disable
synchronization for collections that have a default `waitForSync` value
of `true`.

The optional `limit` parameter can be used to restrict the number of
updates to the specified value. If `limit` is specified but less than
the number of documents in the collection, it is undefined which documents are
updated.

---

`collection.updateByExample(document, newValue, options)`

Using this variant, the options for the operation can be passed using
an object with the following sub-attributes:

- `keepNull`
- `waitForSync`
- `limit`
- `mergeObjects`

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 012_documentsCollectionUpdateByExample
    @EXAMPLE_ARANGOSH_OUTPUT{012_documentsCollectionUpdateByExample}
    ~ db._create("example");
      db.example.insert({ Hello : "world", foo : "bar" });
      db.example.updateByExample({ Hello: "world" }, { Hello: "foo", World: "bar" }, false);
      db.example.byExample({ Hello: "foo" }).toArray()
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 012_documentsCollectionUpdateByExample
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

## Edge documents


### `edge-collection.edges(vertex)`

Edges are normal documents that always contain a `_from` and a `_to`
attribute. Therefore, you can use the document methods to operate on
edges. The following methods, however, are specific to edges.

`edge-collection.edges(vertex)`

The `edges()` operator finds all edges starting from (outbound) or ending
in (inbound) `vertex`.

---

`edge-collection.edges(vertices)`

The `edges` operator finds all edges starting from (outbound) or ending
in (inbound) a document from `vertices`, which must be a list of documents
or document identifiers.

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline EDGCOL_02_Relation
    @EXAMPLE_ARANGOSH_OUTPUT{EDGCOL_02_Relation}
      db._create("vertex");
      db._createEdgeCollection("relation");
      var myGraph = {};
      myGraph.v1 = db.vertex.insert({ name : "vertex 1" });
      myGraph.v2 = db.vertex.insert({ name : "vertex 2" });
    | myGraph.e1 = db.relation.insert(myGraph.v1, myGraph.v2,
                                      { label : "knows"});
      db._document(myGraph.e1);
      db.relation.edges(myGraph.e1._id);
    ~ db._drop("relation");
    ~ db._drop("vertex");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock EDGCOL_02_Relation
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `edge-collection.inEdges(vertex)`

The `inEdges()` operator finds all edges ending in (inbound) `vertex`.

---

`edge-collection.inEdges(vertices)`

The `inEdges()` operator finds all edges ending in (inbound) a document from
`vertices`, which must be a list of documents or document identifiers.

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline EDGCOL_02_inEdges
    @EXAMPLE_ARANGOSH_OUTPUT{EDGCOL_02_inEdges}
      db._create("vertex");
      db._createEdgeCollection("relation");
    ~ var myGraph = {};
      myGraph.v1 = db.vertex.insert({ name : "vertex 1" });
      myGraph.v2 = db.vertex.insert({ name : "vertex 2" });
    | myGraph.e1 = db.relation.insert(myGraph.v1, myGraph.v2,
                                      { label : "knows"});
      db._document(myGraph.e1);
      db.relation.inEdges(myGraph.v1._id);
      db.relation.inEdges(myGraph.v2._id);
    ~ db._drop("relation");
    ~ db._drop("vertex");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock EDGCOL_02_inEdges
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `edge-collection.outEdges(vertex)`

The `outEdges()` operator finds all edges starting from (outbound)
`vertices`.

---

`edge-collection.outEdges(vertices)`

The `outEdges()` operator finds all edges starting from (outbound) a document
from `vertices`, which must be a list of documents or document identifiers.

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline EDGCOL_02_outEdges
    @EXAMPLE_ARANGOSH_OUTPUT{EDGCOL_02_outEdges}
      db._create("vertex");
      db._createEdgeCollection("relation");
    ~ var myGraph = {};
      myGraph.v1 = db.vertex.insert({ name : "vertex 1" });
      myGraph.v2 = db.vertex.insert({ name : "vertex 2" });
    | myGraph.e1 = db.relation.insert(myGraph.v1, myGraph.v2,
                                      { label : "knows"});
      db._document(myGraph.e1);
      db.relation.outEdges(myGraph.v1._id);
      db.relation.outEdges(myGraph.v2._id);
    ~ db._drop("relation");
    ~ db._drop("vertex");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock EDGCOL_02_outEdges
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}
