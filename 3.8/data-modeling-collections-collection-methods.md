---
layout: default
description: Collection Methods
---
Collection Methods
==================

Drop
----

<!-- arangod/V8Server/v8-collection.cpp -->

drops a collection
`collection.drop(options)`

Drops a *collection* and all its indexes and data.
In order to drop a system collection, an *options* object
with attribute *isSystem* set to *true* must be specified.

{% hint 'info' %}
Dropping a collection in a cluster, which is prototype for sharing
in other collections is prohibited. In order to be able to drop
such a collection, all dependent collections must be dropped first.
{% endhint %}

**Examples**

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

Truncate
--------

<!-- js/server/modules/@arangodb/arango-collection.js-->


truncates a collection
`collection.truncate()`

Truncates a *collection*, removing all documents but keeping all its
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

Compact
-------

<!-- js/server/modules/@arangodb/arango-collection.js-->

<small>Introduced in: v3.4.5</small>

Compacts the data of a collection
`collection.compact()`

Compacts the data of a collection in order to reclaim disk space.
The operation will compact the document and index
data by rewriting the underlying .sst files and only keeping the relevant
entries.

Under normal circumstances running a compact operation is not necessary,
as the collection data will eventually get compacted anyway. However, in 
some situations, e.g. after running lots of update/replace or remove 
operations, the disk data for a collection may contain a lot of outdated data
for which the space shall be reclaimed. In this case the compaction operation
can be used.

Properties
----------

gets or sets the properties of a collection
`collection.properties()`

Returns an object containing all collection properties.

- *waitForSync*: If *true* creating a document will only return
  after the data was synced to disk.

* *keyOptions* (optional) additional options for key generation. This is
  a JSON object containing the following attributes (note: some of the
  attributes are optional):
  * *type*: the type of the key generator used for the collection.
  * *allowUserKeys*: if set to *true*, then it is allowed to supply
    own key values in the *_key* attribute of a document. If set to
    *false*, then the key generator will solely be responsible for
    generating keys and supplying own key values in the *_key* attribute
    of documents is considered an error.
  * *lastValue*: the current offset value of the `autoincrement` or `padded`
    key generator. This an internal property for restoring dumps properly.
  * *increment*: increment value for *autoincrement* key generator.
    Not used for other key generator types.
  * *offset*: initial offset value for *autoincrement* key generator.
    Not used for other key generator types.

* *schema* (optional, default is *null*): 
  Object that specifies the collection level document schema for documents.
  The attribute keys `rule`, `level` and `message` must follow the rules
  documented in [Document Schema Validation](data-modeling-documents-schema-validation.html)

* *cacheEnabled*: Whether the in-memory hash cache for documents is
  enabled for this collection (default: `false`).

* *isSystem*: Whether the collection is a system collection.

* *syncByRevision*: Whether the newer revision-based replication protocol is
  enabled for this collection. This is an internal property.

* *globallyUniqueId*: A unique identifier of the collection.
  This is an internal property.

In a cluster setup, the result will also contain the following attributes:

* *numberOfShards*: the number of shards of the collection.

* *shardKeys*: contains the names of document attributes that are used to
  determine the target shard for documents.

* *replicationFactor*: determines how many copies of each shard are kept
  on different DB-Servers. Has to be in the range of 1-10 or the string
  `"satellite"` for a SatelliteCollection (Enterprise Edition only).
  _(cluster only)_

* *writeConcern*: determines how many copies of each shard are required to be
  in sync on the different DB-Servers. If there are less then these many copies
  in the cluster a shard will refuse to write. Writes to shards with enough
  up-to-date copies will succeed at the same time however. The value of
  *writeConcern* can not be larger than *replicationFactor*. _(cluster only)_

* *shardingStrategy*: the sharding strategy selected for the collection.
  This attribute will only be populated in cluster mode and is not populated
  in single-server mode. _(cluster only)_

* *distributeShardsLike*:
  The name of another collection. This collection uses the `replicationFactor`,
  `numberOfShards` and `shardingStrategy` properties of the other collection and
  the shards of this collection are distributed in the same way as the shards of
  the other collection.

* *isSmart*: Whether the collection belongs to a SmartGraph
  (Enterprise Edition only). This is an internal property.

* *isDisjoint*: Whether the SmartGraph this collection belongs to is disjoint
  (Enterprise Edition only). This is an internal property.

- *smartGraphAttribute*:
  The attribute that is used for sharding: vertices with the same value of
  this attribute are placed in the same shard. All vertices are required to
  have this attribute set and it has to be a string. Edges derive the
  attribute from their connected vertices.

  This feature can only be used in the *Enterprise Edition*.

- *smartJoinAttribute*:
  In an *Enterprise Edition* cluster, this attribute determines an attribute
  of the collection that must contain the shard key value of the referred-to
  SmartJoin collection.

---

`collection.properties(properties)`

Changes the collection properties. *properties* must be an object with
one or more of the following attribute(s):

* *waitForSync*: If *true* creating a document will only return
  after the data was synced to disk.

* *replicationFactor*: Change the number of shard copies kept on
  different DB-Servers. Valid values are integer numbers in the range of 1-10
  or the string `"satellite"` for a SatelliteCollection (Enterprise Edition only).
  _(cluster only)_

* *writeConcern*: change how many copies of each shard are required to be
  in sync on the different DB-Servers. If there are less then these many copies
  in the cluster a shard will refuse to write. Writes to shards with enough
  up-to-date copies will succeed at the same time however. The value of
  *writeConcern* can not be larger than *replicationFactor*. _(cluster only)_

* *schema*: An object that specifies the collection level document schema for
  documents. The attribute keys `rule`, `level` and `message` must follow the rules
  documented in [Document Schema Validation](data-modeling-documents-schema-validation.html)

- *cacheEnabled*: Whether the in-memory hash cache for documents should be
  enabled for this collection. Can be controlled globally
  with the `--cache.size` startup option. The cache can speed up repeated reads
  of the same documents via their document keys. If the same documents are not
  fetched often or are modified frequently, then you may disable the cache to
  avoid the maintenance costs.

**Note**: some other collection properties, such as *type*,
*keyOptions*, *numberOfShards* or *shardingStrategy* cannot be changed once
the collection is created.

**Examples**

Read all properties

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

Change a property

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

Figures
-------

<!-- arangod/V8Server/v8-collection.cpp -->

returns the figures of a collection
`collection.figures(details)`

Returns an object containing statistics about the collection.

Setting `details` to `true` will return extended storage engine-specific
details to the figures (introduced in v3.8.0). The details are intended for
debugging ArangoDB itself and their format is subject to change. By default,
`details` is set to `false`, so no details are returned and the behavior is
identical to previous versions of ArangoDB.

* *indexes.count*: The total number of indexes defined for the
  collection, including the pre-defined indexes (e.g. primary index).
* *indexes.size*: The total memory allocated for indexes in bytes.
<!-- TODO: describe RocksDB figures -->
* *documentsSize*
* *cacheInUse*
* *cacheSize*
* *cacheUsage*

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionFigures
    @EXAMPLE_ARANGOSH_OUTPUT{collectionFigures}
    ~ require("internal").wal.flush(true, true);
      db.demo.figures()
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionFigures
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionFiguresDetails
    @EXAMPLE_ARANGOSH_OUTPUT{collectionFiguresDetails}
    ~ require("internal").wal.flush(true, true);
      db.demo.figures(true)
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionFiguresDetails
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

GetResponsibleShard
-------------------

<!-- arangod/V8Server/v8-collection.cpp -->

returns the responsible shard for the given document.
`collection.getResponsibleShard(document)`

Returns a string with the responsible shard's ID. Note that the
returned shard ID is the ID of responsible shard for the document's
shard key values, and it will be returned even if no such document exists.

{% hint 'info' %}
The `getResponsibleShard()` method can only be used on Coordinators
in clusters.
{% endhint %}

Shards
------

<!-- arangod/V8Server/v8-collection.cpp -->

returns the available shards for the collection.
`collection.shards(details)`

If `details` is not set, or set to `false`, returns an array with the names of 
the available shards of the collection.

If `details` is set to `true`, returns an object with the shard names as
object attribute keys, and the responsible servers as an array mapped to each
shard attribute key.

The leader shards are always first in the arrays of responsible servers.

{% hint 'info' %}
The `shards()` method can only be used on Coordinators in clusters.
{% endhint %}

Load
----

<!-- arangod/V8Server/v8-collection.cpp -->

loads a collection
`collection.load()`

Loads a collection into memory.

{% hint 'info' %}
Cluster collections are loaded at all times.
{% endhint %}

{% hint 'warning' %}
The *load()* function is **deprecated** as of ArangoDB 3.8.0.
The function may be removed in future versions of ArangoDB. There should not be
any need to load a collection with the RocksDB storage engine.
{% endhint %}

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionLoad
    @EXAMPLE_ARANGOSH_OUTPUT{collectionLoad}
    ~ db._create("example");
      col = db.example;
      col.load();
      col;
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionLoad
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Revision
--------

<!-- arangod/V8Server/v8-collection.cpp -->

returns the revision id of a collection
`collection.revision()`

Returns the revision id of the collection

The revision id is updated when the document data is modified, either by
inserting, deleting, updating or replacing documents in it.

The revision id of a collection can be used by clients to check whether
data in a collection has changed or if it is still unmodified since a
previous fetch of the revision id.

The revision id returned is a string value. Clients should treat this value
as an opaque string, and only use it for equality/non-equality comparisons.

Checksum
--------

<!-- arangod/V8Server/v8-query.cpp -->

calculates a checksum for the data in a collection
`collection.checksum(withRevisions, withData)`

The *checksum* operation calculates an aggregate hash value for all document
keys contained in collection *collection*.

If the optional argument *withRevisions* is set to *true*, then the
revision ids of the documents are also included in the hash calculation.

If the optional argument *withData* is set to *true*, then all user-defined
document attributes are also checksummed. Including the document data in
checksumming will make the calculation slower, but is more accurate.

Unload
------

<!-- arangod/V8Server/v8-collection.cpp -->

unloads a collection
`collection.unload()`

Starts unloading a collection from memory. Note that unloading is deferred
until all queries have finished.

{% hint 'info' %}
Cluster collections cannot be unloaded.
{% endhint %}

{% hint 'warning' %}
The *unload()* function is **deprecated** as of ArangoDB 3.8.0.
The function may be removed in future versions of ArangoDB. There should not be
any need to unload a collection with the RocksDB storage engine.
{% endhint %}

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline CollectionUnload
    @EXAMPLE_ARANGOSH_OUTPUT{CollectionUnload}
    ~ db._create("example");
      col = db.example;
      col.unload();
      col;
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock CollectionUnload
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Rename
------

<!-- arangod/V8Server/v8-collection.cpp -->

renames a collection
`collection.rename(new-name)`

Renames a collection using the *new-name*. The *new-name* must not
already be used for a different collection. *new-name* must also be a
valid collection name. For more information on valid collection names please
refer to the [naming conventions](data-modeling-naming-conventions.html).

If renaming fails for any reason, an error is thrown.
If renaming the collection succeeds, then the collection is also renamed in
all graph definitions inside the `_graphs` collection in the current
database.

{% hint 'info' %}
The `rename()` method can not be used in clusters.
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
