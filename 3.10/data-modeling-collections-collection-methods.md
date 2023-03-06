---
layout: default
description: Collection Methods
---
Collection Methods
==================

Drop
----

Drops a collection:

`collection.drop(options)`

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

Truncate
--------

Truncate a collection:

`collection.truncate()`

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

Compact
-------

Compacts the data of a collection:

`collection.compact()`

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

Properties
----------

Get or set the properties of a collection:

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
  `writeConcern` cannot be larger than `replicationFactor`. _(cluster only)_

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
  `writeConcern` cannot be larger than `replicationFactor`. _(cluster only)_

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

Figures
-------

Return the figures of a collection:

`collection.figures(details)`

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

GetResponsibleShard
-------------------

Return the responsible shard for the given document:

`collection.getResponsibleShard(document)`

Returns a string with the responsible shard's ID. Note that the
returned shard ID is the ID of responsible shard for the document's
shard key values, and it returns even if no such document exists.

{% hint 'info' %}
The `getResponsibleShard()` method can only be used on Coordinators
in clusters.
{% endhint %}

Shards
------

Return the available shards for the collection:

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

Load a collection:

`collection.load()`

Loads a collection into memory.

{% hint 'info' %}
Cluster collections are loaded at all times.
{% endhint %}

{% hint 'warning' %}
The `load()` function is **deprecated** as of ArangoDB 3.8.0.
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

Return the revision ID of a collection:

`collection.revision()`

Returns the revision ID of the collection

The revision ID is updated when the document data is modified, either by
inserting, deleting, updating or replacing documents in it.

The revision ID of a collection can be used by clients to check whether
data in a collection has changed or if it is still unmodified since a
previous fetch of the revision ID.

The revision ID returned is a string value. Clients should treat this value
as an opaque string, and only use it for equality/non-equality comparisons.

Checksum
--------

Calculate a checksum for the data in a collection:

`collection.checksum(withRevisions, withData)`

The `checksum` operation calculates an aggregate hash value for all document
keys contained in collection `collection`.

If the optional argument `withRevisions` is set to `true`, then the
revision ids of the documents are also included in the hash calculation.

If the optional argument `withData` is set to `true`, then all user-defined
document attributes are also checksummed. Including the document data in
checksumming makes the calculation slower, but is more accurate.

Unload
------

Unload a collection:

`collection.unload()`

Starts unloading a collection from memory. Note that unloading is deferred
until all queries have finished.

{% hint 'info' %}
Cluster collections cannot be unloaded.
{% endhint %}

{% hint 'warning' %}
The `unload()` function is **deprecated** as of ArangoDB 3.8.0.
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

Rename a collection:

`collection.rename(new-name)`

Renames a collection using the `new-name`. The `new-name` must not
already be used for a different collection. `new-name` must also be a
valid collection name. For more information on valid collection names please
refer to the [naming conventions](data-modeling-naming-conventions.html).

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
