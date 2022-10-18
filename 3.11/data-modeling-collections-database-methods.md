---
layout: default
description: Database Methods
---
Database Methods
================

Collection
----------

<!-- arangod/V8Server/v8-vocbase.cpp -->

Return a single collection:

`db._collection(collection-name)`

Returns the collection with the given name, or `null` if no such collection
exists.

`db._collection(collection-identifier)`

Returns the collection with the given identifier or `null` if no such
collection exists. Accessing collections by identifier is discouraged for
end users. End users should access collections using the collection name.

**Examples**

Get a collection by name:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseNameKnown
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseNameKnown}
      db._collection("demo");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseNameKnown
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Get a collection by id:

```
arangosh> db._collection(123456);
[ArangoCollection 123456, "demo" (type document, status loaded)]
```

Unknown collection:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseNameUnknown
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseNameUnknown}
      db._collection("unknown");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseNameUnknown
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Create
------

<!-- arangod/V8Server/v8-vocindex.cpp -->

Create a new document or edge collection:

`db._create(collection-name)`

Creates a new document collection named `collection-name`.
If the collection name already exists or if the name format is invalid, an
error is thrown. For more information on valid collection names please refer
to the [naming conventions](data-modeling-naming-conventions.html).

`db._create(collection-name, properties)`

`properties` must be an object with the following attributes:

- `waitForSync` (boolean, _optional_, default `false`): If `true`, creating,
  changing, or removing a document waits until the data is synchronized to disk.

- `keyOptions` (object, _optional_): The options for key generation. If
  specified, then `keyOptions` should be an object containing the
  following attributes:
  - `type` (string): specifies the type of the key generator.
    The available generators are `"traditional"` (default), `"autoincrement"`,
    `"uuid"` and `"padded"`.
    - The `traditional` key generator generates numerical keys in ascending order.
      The sequence of keys is not guaranteed to be gap-free.
    - The `autoincrement` key generator generates numerical keys in ascending order, 
      the initial offset and the spacing can be configured (**note**: 
      `autoincrement` is only supported for non-sharded or 
      single-sharded collections). 
      The sequence of generated keys is not guaranteed to be gap-free, because a new key
      is generated on every document insert attempt, not just for successful
      inserts.
    - The `padded` key generator generates keys of a fixed length (16 bytes) in
      ascending lexicographical sort order. This is ideal for usage with the _RocksDB_
      engine, which slightly benefits keys that are inserted in lexicographically
      ascending order. The key generator can be used in a single-server or cluster.
      The sequence of generated keys is not guaranteed to be gap-free.
    - The `uuid` key generator generates universally unique 128 bit keys, which 
      are stored in hexadecimal human-readable format. This key generator can be used
      in a single-server or cluster to generate "seemingly random" keys. The keys 
      produced by this key generator are not lexicographically sorted.

    Please note that keys are only guaranteed to be truly ascending in single
    server deployments and for collections that only have a single shard (that includes
    collections in a OneShard database).
    The reason is that for collections with more than a single shard, document keys
    are generated on Coordinator(s). For collections with a single shard, the document
    keys are generated on the leader DB-Server, which has full control over the key
    sequence.

  - `allowUserKeys` (boolean, _optional_): If set to `true`, then you are allowed
    to supply own key values in the `_key` attribute of documents. If set to
    `false`, then the key generator is solely responsible for generating keys and
    an error is raised if you supply own key values in the `_key` attribute
    of documents.
  - `increment`: The increment value for the `autoincrement` key generator.
    Not used for other key generator types.
  - `offset`: The initial offset value for the `autoincrement` key generator.
    Not used for other key generator types.

- `schema` (object\|null, _optional_, default: `null`): 
  An object that specifies the collection-level document schema for documents.
  The attribute keys `rule`, `level` and `message` must follow the rules
  documented in [Document Schema Validation](document-schema-validation.html)

- `computedValues` (array\|null, _optional_, default: `null`): An array of objects,
  each representing a [Computed Value](data-modeling-documents-computed-values.html).

- `cacheEnabled` (boolean): Whether the in-memory hash cache for documents should be
  enabled for this collection (default: `false`). Can be controlled globally
  with the `--cache.size` startup option. The cache can speed up repeated reads
  of the same documents via their document keys. If the same documents are not
  fetched often or are modified frequently, then you may disable the cache to
  avoid the maintenance costs.

- `isSystem` (boolean, _optional_, default: `false`): If `true`, create a
  system collection. In this case, the collection name should start with
  an underscore. End-users should normally create non-system collections
  only. API implementors may be required to create system collections in
  very special occasions, but normally a regular collection is sufficient.

- `syncByRevision` (boolean, _optional_, default: `true`):
  Whether the newer revision-based replication protocol
  is enabled for this collection. This is an internal property.

- `numberOfShards` (number, _optional_, default `1`): In a cluster, this value
  determines the number of shards to create for the collection. In a single
  server setup, this option is meaningless.

- `shardKeys` (array, _optional_, default: `["_key"]`): In a cluster, this
  attribute determines which document attributes are used to determine the
  target shard for documents. Documents are sent to shards based on the
  values they have in their shard key attributes. The values of all shard
  key attributes in a document are hashed, and the hash value is used to
  determine the target shard. Note that values of shard key attributes cannot
  be changed once set.
  This option is meaningless in a single server setup.

  When choosing the shard keys, you must be aware of the following
  rules and limitations: In a sharded collection with more than
  one shard it is not possible to set up a unique constraint on
  an attribute that is not the one and only shard key given in
  `shardKeys`. This is because enforcing a unique constraint
  would otherwise make a global index necessary or need extensive
  communication for every single write operation. Furthermore, if
  `_key` is not the one and only shard key, then it is not possible
  to set the `_key` attribute when inserting a document, provided
  the collection has more than one shard. Again, this is because
  the database has to enforce the unique constraint on the `_key`
  attribute and this can only be done efficiently if this is the
  only shard key by delegating to the individual shards.

- `replicationFactor` (number\|string, _optional_, default `1`): In a cluster, this
  attribute determines how many copies of each shard are kept on 
  different DB-Servers. The value 1 means that only one copy (no
  synchronous replication) is kept. A value of k means that
  k-1 replicas are kept. Any two copies reside on different DB-Servers.
  Replication between them is synchronous, that is, every write operation
  to the "leader" copy is replicated to all "follower" replicas,
  before the write operation is reported successful.

  If a server fails, this is detected automatically and one of the
  servers holding copies take over, usually without an error being
  reported.

  When using the *Enterprise Edition* of ArangoDB the replicationFactor
  may be set to "satellite" making the collection locally joinable
  on every DB-Server. This reduces the number of network hops
  dramatically when using joins in AQL at the costs of reduced write
  performance on these collections.

- `writeConcern` (number, _optional_, default `1`): In a cluster, this
  attribute determines how many copies of each shard are required
  to be in sync on the different DB-Servers. If there are less then these
  many copies in the cluster, a shard refuses to write. The value of
  `writeConcern` can not be larger than `replicationFactor`.
  Please note: during server failures this might lead to writes
  not being possible until the failover is sorted out and might cause
  write slow downs in trade for data durability.

- `shardingStrategy` (optional): specifies the name of the sharding
  strategy to use for the collection. Since ArangoDB 3.4 there are
  different sharding strategies to select from when creating a new 
  collection. The selected `shardingStrategy` value remains
  fixed for the collection and cannot be changed afterwards. This is
  important to make the collection keep its sharding settings and
  always find documents already distributed to shards using the same
  initial sharding algorithm.

  The available sharding strategies are:
  - `"community-compat"`: default sharding used by ArangoDB
    Community Edition before version 3.4
  - `"enterprise-compat"`: default sharding used by ArangoDB
    Enterprise Edition before version 3.4
  - `"enterprise-smart-edge-compat"`: default sharding used by smart edge
    collections in ArangoDB Enterprise Edition before version 3.4
  - `"hash"`: default sharding used for new collections starting from version 3.4
    (excluding smart edge collections)
  - `"enterprise-hash-smart-edge"`: default sharding used for new
    smart edge collections starting from version 3.4
  - `enterprise-hex-smart-vertex`: sharding used for vertex collections of
    EnterpriseGraphs

  If no sharding strategy is specified, the default is `hash` for
  all normal collections, `enterprise-hash-smart-edge` for all smart edge
  collections, and `enterprise-hex-smart-vertex` for EnterpriseGraph
  vertex collections (the latter two require the *Enterprise Edition* of ArangoDB).
  Manually overriding the sharding strategy does not yet provide a 
  benefit, but it may later in case other sharding strategies are added.
  
  In single-server mode, the `shardingStrategy` attribute is meaningless 
  and is ignored.

- `distributeShardsLike` (string, _optional_, default: `""`):
  The name of another collection. If this property is set in a cluster, the
  collection copies the `replicationFactor`, `numberOfShards` and `shardingStrategy`
  properties from the specified collection (referred to as the _prototype collection_)
  and distributes the shards of this collection in the same way as the shards of
  the other collection. In an Enterprise Edition cluster, this data co-location is
  utilized to optimize queries.

  You need to use the same number of `shardKeys` as the prototype collection, but
  you can use different attributes.

  **Note**: Using this parameter has consequences for the prototype
  collection. It can no longer be dropped, before the sharding-imitating
  collections are dropped. Equally, backups and restores of imitating
  collections alone generate warnings (which can be overridden)
  about a missing sharding prototype.

- `isSmart` (boolean): Whether the collection is for a SmartGraph or
  EnterpriseGraph (Enterprise Edition only). This is an internal property.

- `isDisjoint` (boolean): Whether the collection is for a Disjoint SmartGraph
  (Enterprise Edition only). This is an internal property.

- `smartGraphAttribute` (string, _optional_):
  The attribute that is used for sharding: vertices with the same value of
  this attribute are placed in the same shard. All vertices are required to
  have this attribute set and it has to be a string. Edges derive the
  attribute from their connected vertices.

  This feature can only be used in the *Enterprise Edition*.

- `smartJoinAttribute` (string, _optional_): In an *Enterprise Edition* cluster, this attribute 
  determines an attribute of the collection that must contain the shard key value 
  of the referred-to SmartJoin collection. Additionally, the sharding key 
  for a document in this collection must contain the value of this attribute, 
  followed by a colon, followed by the actual primary key of the document.

  This feature can only be used in the *Enterprise Edition* and requires the
  `distributeShardsLike` attribute of the collection to be set to the name
  of another collection. It also requires the `shardKeys` attribute of the
  collection to be set to a single shard key attribute, with an additional `:`
  at the end.
  A further restriction is that whenever documents are stored or updated in the 
  collection, the value stored in the `smartJoinAttribute` must be a string.

---

`db._create(collection-name, properties, type)`

Specifies the optional `type` of the collection, it can either be `document` 
or `edge`. On default it is document. Instead of giving a type you can also use 
`db._createEdgeCollection()` or `db._createDocumentCollection()`.

---

`db._create(collection-name, properties[, type], options)`

As an optional third (if the `type` string is being omitted) or fourth
parameter you can specify an optional options map that controls how the
cluster creates the collection. These options are only relevant at
creation time and are not persisted:

- `waitForSyncReplication` (default: `true`)
  If enabled, the server only reports success back to the client
  if all replicas have created the collection. Set to `false` if you want faster
  server responses and don't care about full replication.

- `enforceReplicationFactor` (default: `true`)
  If enabled, the server checks if there are enough replicas
  available at creation time and bails out otherwise. Set to `false` to disable
  this extra check.

**Examples**

With defaults:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseCreateSuccess
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseCreateSuccess}
      c = db._create("users");
      c.properties();
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseCreateSuccess
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

With properties:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseCreateProperties
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseCreateProperties}
      c = db._create("users", { waitForSync: true });
      c.properties();
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseCreateProperties
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

With a key generator:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseCreateKey
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseCreateKey}
    | db._create("users",
         { keyOptions: { type: "autoincrement", offset: 10, increment: 5 } });
      db.users.save({ name: "user 1" });
      db.users.save({ name: "user 2" });
      db.users.save({ name: "user 3" });
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseCreateKey
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

With a special key option:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseCreateSpecialKey
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseCreateSpecialKey}
      db._create("users", { keyOptions: { allowUserKeys: false } });
      db.users.save({ name: "user 1" });
      db.users.save({ name: "user 2", _key: "myuser" }); // xpError(ERROR_ARANGO_DOCUMENT_KEY_UNEXPECTED)
      db.users.save({ name: "user 3" });
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseCreateSpecialKey
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

<!-- arangod/V8Server/v8-vocindex.cpp -->

Create a new edge collection:

`db._createEdgeCollection(collection-name)`

Creates a new edge collection named `collection-name`. If the
collection name already exists an error is thrown. The default value
for `waitForSync` is `false`.

`db._createEdgeCollection(collection-name, properties)`

`properties` must be an object with the following attributes:

- `waitForSync` (optional, default: `false`): If `true`, creating
  a document only returns after the data is synced to disk.

<!-- arangod/V8Server/v8-vocindex.cpp -->

Create a new document collection:

`db._createDocumentCollection(collection-name)`

Creates a new document collection named `collection-name`. If the
document name already exists and error is thrown.

All Collections
---------------

<!-- arangod/V8Server/v8-vocbase.cpp -->

Return all collections:

`db._collections()`

Returns all collections of the given database.

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionsDatabaseName
    @EXAMPLE_ARANGOSH_OUTPUT{collectionsDatabaseName}
    ~ db._create("example");
      db._collections();
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionsDatabaseName
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Collection Name
---------------

<!-- arangod/V8Server/v8-vocbase.cpp -->

Select a collection from the database:

`db.collection-name`

Returns the collection with the given `collection-name`. If no such
collection exists, create a collection named `collection-name` with the
default properties.

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseCollectionName
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseCollectionName}
    ~ db._create("example");
      db.example;
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseCollectionName
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Drop
----

<!-- js/server/modules/@arangodb/arango-database.js -->

Drop a collection:

`db._drop(collection)`

Drops a `collection` and all its indexes and data.

`db._drop(collection-identifier)`

Drops a collection identified by `collection-identifier` with all its
indexes and data. No error is thrown if there is no such collection.

`db._drop(collection-name)`

Drops a collection named `collection-name` and all its indexes. No error
is thrown if there is no such collection.

`db._drop(collection-name, options)`

In order to drop a system collection, you must specify an `options` object
with attribute `isSystem` set to `true`. Otherwise it is not possible to
drop system collections.

{% hint 'info' %}
Cluster collection, which are prototypes for collections
with `distributeShardsLike` parameter, cannot be dropped.
{% endhint %}

**Examples**

Drops a collection:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseDropByObject
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseDropByObject}
    ~ db._create("example");
      col = db.example;
      db._drop(col);
      col;
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseDropByObject
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Drops a collection identified by name:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseDropName
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseDropName}
    ~ db._create("example");
      col = db.example;
      db._drop("example");
      col;
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseDropName
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Drops a system collection

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseDropSystem
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseDropSystem}
    ~ db._create("_example", { isSystem: true });
      col = db._example;
      db._drop("_example", { isSystem: true });
      col;
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseDropSystem
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Truncate
--------

<!-- js/server/modules/@arangodb/arango-database.js -->

Truncate a collection:

`db._truncate(collection)`

Truncates a `collection`, removing all documents but keeping all its
indexes.

`db._truncate(collection-identifier)`

Truncates a collection identified by `collection-identified`. No error is
thrown if there is no such collection.

`db._truncate(collection-name)`

Truncates a collection named `collection-name`. No error is thrown if
there is no such collection.

**Examples**

Truncates a collection:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseTruncateByObject
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseTruncateByObject}
    ~ db._create("example");
      col = db.example;
      col.save({ "Hello" : "World" });
      col.count();
      db._truncate(col);
      col.count();
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseTruncateByObject
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Truncates a collection identified by name:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline collectionDatabaseTruncateName
    @EXAMPLE_ARANGOSH_OUTPUT{collectionDatabaseTruncateName}
    ~ db._create("example");
      col = db.example;
      col.save({ "Hello" : "World" });
      col.count();
      db._truncate("example");
      col.count();
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock collectionDatabaseTruncateName
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}
