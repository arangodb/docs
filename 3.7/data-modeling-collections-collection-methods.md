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

Compacts the data of a collection in order to reclaim disk space. For the
MMFiles storage engine, the operation will reset the collection's last
compaction timestamp, so it will become a candidate for compaction. For the
RocksDB storage engine, the operation will compact the document and index
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

<!-- arangod/V8Server/v8-collection.cpp -->

{% docublock collectionProperties %}

Figures
-------

<!-- arangod/V8Server/v8-collection.cpp -->

returns the figures of a collection
`collection.figures(details)`

Returns an object containing statistics about the collection.

Setting `details` to `true` will return extended storage engine-specific
details to the figures (introduced in v3.7.3). The details are intended for
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

Path
----

returns the physical path of the collection
`collection.path()`

The *path* operation returns a string with the physical storage path for
the collection data.

{% hint 'info' %}
The `path()` method will return nothing meaningful in a cluster.
In a single-server ArangoDB, this method will only return meaningful data
for the MMFiles storage engine.
{% endhint %}

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

The checksum calculation algorithm changed in ArangoDB 3.0, so checksums from
3.0 and earlier versions for the same data will differ.

{% hint 'info' %}
The `checksum()` method can not be used in clusters.
{% endhint %}

Unload
------

<!-- arangod/V8Server/v8-collection.cpp -->

unloads a collection
`collection.unload()`

Starts unloading a collection from memory. Note that unloading is deferred
until all query have finished.

{% hint 'info' %}
Cluster collections cannot be unloaded.
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
