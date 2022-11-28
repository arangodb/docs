---
fileID: data-modeling-collections-collection-methods
title: Collection Methods
weight: 60
description: 
layout: default
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
  `writeConcern` can not be larger than `replicationFactor`. _(cluster only)_

- `computedValues` (array\|null): An array of objects, each representing a
  [Computed Value](../documents/data-modeling-documents-computed-values).

- `schema` (object\|null): An object that specifies the collection level document schema for
  documents. The attribute keys `rule`, `level` and `message` must follow the rules
  documented in [Document Schema Validation](../documents/data-modeling-documents-schema-validation)

- `cacheEnabled` (boolean): Whether the in-memory hash cache for documents should be
  enabled for this collection. Can be controlled globally
  with the `--cache.size` startup option. The cache can speed up repeated reads
  of the same documents via their document keys. If the same documents are not
  fetched often or are modified frequently, then you may disable the cache to
  avoid the maintenance costs.

{{% hints/info %}}
Some other collection properties, such as `type`,
`keyOptions`, `numberOfShards` or `shardingStrategy` cannot be changed once
the collection is created.
{{% /hints/info %}}

**Examples**

Read all properties:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: collectionProperties
description: ''
render: input/output
version: '3.10'
release: stable
---
~ db._create("example");
  db.example.properties();
~ db._drop("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Change a property:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: collectionProperty
description: ''
render: input/output
version: '3.10'
release: stable
---
~ db._create("example");
  db.example.properties({ waitForSync : true });
~ db._drop("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## Figures

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

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: collectionFigures
description: ''
render: input/output
version: '3.10'
release: stable
---
~ require("internal").wal.flush(true, true);
  db.demo.figures()
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Get the detailed collection figures:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: collectionFiguresDetails
description: ''
render: input/output
version: '3.10'
release: stable
---
~ require("internal").wal.flush(true, true);
  db.demo.figures(true)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## GetResponsibleShard

Return the responsible shard for the given document:

`collection.getResponsibleShard(document)`

Returns a string with the responsible shard's ID. Note that the
returned shard ID is the ID of responsible shard for the document's
shard key values, and it returns even if no such document exists.

{{% hints/info %}}
The `getResponsibleShard()` method can only be used on Coordinators
in clusters.
{{% /hints/info %}}

## Shards

Return the available shards for the collection:

`collection.shards(details)`

If `details` is not set, or set to `false`, returns an array with the names of 
the available shards of the collection.

If `details` is set to `true`, returns an object with the shard names as
object attribute keys, and the responsible servers as an array mapped to each
shard attribute key.

The leader shards are always first in the arrays of responsible servers.

{{% hints/info %}}
The `shards()` method can only be used on Coordinators in clusters.
{{% /hints/info %}}

## Load

Load a collection:

`collection.load()`

Loads a collection into memory.

{{% hints/info %}}
Cluster collections are loaded at all times.
{{% /hints/info %}}

{{% hints/warning %}}
The `load()` function is **deprecated** as of ArangoDB 3.8.0.
The function may be removed in future versions of ArangoDB. There should not be
any need to load a collection with the RocksDB storage engine.
{{% /hints/warning %}}

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: collectionLoad
description: ''
render: input/output
version: '3.10'
release: stable
---
~ db._create("example");
  col = db.example;
  col.load();
  col;
~ db._drop("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## Revision

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

## Checksum

Calculate a checksum for the data in a collection:

`collection.checksum(withRevisions, withData)`

The `checksum` operation calculates an aggregate hash value for all document
keys contained in collection `collection`.

If the optional argument `withRevisions` is set to `true`, then the
revision ids of the documents are also included in the hash calculation.

If the optional argument `withData` is set to `true`, then all user-defined
document attributes are also checksummed. Including the document data in
checksumming makes the calculation slower, but is more accurate.

## Unload

Unload a collection:

`collection.unload()`

Starts unloading a collection from memory. Note that unloading is deferred
until all queries have finished.

{{% hints/info %}}
Cluster collections cannot be unloaded.
{{% /hints/info %}}

{{% hints/warning %}}
The `unload()` function is **deprecated** as of ArangoDB 3.8.0.
The function may be removed in future versions of ArangoDB. There should not be
any need to unload a collection with the RocksDB storage engine.
{{% /hints/warning %}}

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: CollectionUnload
description: ''
render: input/output
version: '3.10'
release: stable
---
~ db._create("example");
  col = db.example;
  col.unload();
  col;
~ db._drop("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## Rename

Rename a collection:

`collection.rename(new-name)`

Renames a collection using the `new-name`. The `new-name` must not
already be used for a different collection. `new-name` must also be a
valid collection name. For more information on valid collection names please
refer to the [naming conventions](../naming-conventions/).

If renaming fails for any reason, an error is thrown.
If renaming the collection succeeds, then the collection is also renamed in
all graph definitions inside the `_graphs` collection in the current
database.

{{% hints/info %}}
The `rename()` method can not be used in clusters.
{{% /hints/info %}}

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: collectionRename
description: ''
render: input/output
version: '3.10'
release: stable
---
~ db._create("example");
  c = db.example;
  c.rename("better-example");
  c;
~ db._drop("better-example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    
