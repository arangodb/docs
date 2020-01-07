---
layout: default
description: These functions implement the HTTP API for accessing collections
---
# Accessing collections

These functions implement the
[HTTP API for accessing collections](../http/collection-getting.html).

## database.collection

`database.collection(collectionName): Collection`

Returns a `Collection` instance for the given collection name.

**Arguments**

- **collectionName**: `string`

  Name of the edge collection.

**Examples**

```js
const db = new Database();
const collection = db.collection("potatoes");
```

When using TypeScript the result can be cast to a `DocumentCollection` or
`EdgeCollection` for stricter type safety:

```ts
interface Person {
  name: string;
}
interface Spouse {
  startDate: number;
  endDate?: number;
}
const db = new Database();
const documents = db.collection("person") as DocumentCollection<Person>;
const edges = db.collection("spouse") as EdgeCollection<Spouse>;
```

## database.createCollection

`async database.createCollection(collectionName, options?): Collection`

Creates a new collection with the given _collectionName_ and _options_,
then returns a `Collection` instance for the new collection.

When using TypeScript, a `DocumentCollection` or `EdgeCollection` object
will be returned depending on the value of _options.type_.

**Arguments**

- **collectionName**: `string`

  Name of the new collection.

- **options**: `object` (optional)

  An object with the following properties:

  - **type**: `CollectionType` (Default: `CollectionType.DOCUMENT_COLLECTION`)

    Type of collection to create.

    One of `CollectionType.DOCUMENT_COLLECTION` or
    `CollectionType.EDGE_COLLECTION`.

  - **waitForSync**: `boolean` (Default: `false`)

    If set to `true`, data will be synchronized to disk before returning from
    a document create, update, replace or removal operation.

  - **isSystem**: `boolean` (Default: `false`)

    Whether the collection should be created as a system collection.

    End users should normally create non-system collections only.

  - **indexBuckets**: `number` (Default: `16`)

    Number of buckets into which indexes using hash tables are split.

    Must be a power of 2 and less than or equal to `1024`.

  - **keyOptions**: `object` (optional)

    An object with the following properties:

    - **type**: `string` (optional)

      Type of key generator to use.

      One of `"traditional"`, `"autoincrement"`, `"uuid"` or `"padded"`.

    - **allowUserKeys**: `boolean` (Default: `true`)

      Unless set to `false`, documents can be created with a user-specified
      `_key` attribute.

    If the type is `"autoincrement"`, the object has the following additional
    properties:

    - **increment**: `number` (optional)

      How many steps to increment the key each time.

    - **offset**: `number` (optional)

      The initial offset for the key.

  If ArangoDB is running in a cluster configuration, the object has the
  following additional properties:

  - **waitForSyncReplication**: `boolean` (Default: `true`)

    Unless set to `false`, the server will wait for all replicas to create the
    collection before returning.

  - **enforceReplicationFactor**: `boolean` (Default: `true`)

    Unless set to `false`, the server will check whether enough replicas are
    available at creation time and bail out otherwise.

  - **numberOfShards**: `number` (Default: `1`)

    Number of shards to distribute the collection across.

  - **shardKeys**: `Array<string>` (Default: `["_key"]`)

    Document attributes to use to determine the target shard for each document.

  - **replicationFactor**: `number` (Default: `1`)

    How many copies of each document should be kept in the cluster.

  - **shardingStrategy**: `string` (optional)

    Sharding strategy to use.

    One of `"community-compat"`, `"hash"`, `"enterprise-compat"`,
    `"enterprise-smart-edge-compat"` or `"enterprise-hash-smart-edge"`.

  If ArangoDB is running in an Enterprise Edition cluster configuration, the
  object has the following additional properties:

  - **distributeShardsLike**: `string` (optional)

    If set to a collection name, sharding of the new collection will follow
    the rules for that collection. As long as the new collection exists, the
    indicated collection can not be dropped.

  - **smartJoinAttribute**: `string` (optional)

    Attribute containing the shard key value of the referred-to smart join
    collection.

  If ArangoDB is using the MMFiles storage engine, the object has the following
  additional properties:

  - **doCompact**: `boolean` (Default: `true`)

    Whether the collection will be compacted.

  - **journalSize**: `number` (optional)

    The maximum size for each journal or datafile in bytes.

    Must be a number greater than or equal to `1048576` (1 MiB).

  - **isVolatile**: `boolean` (Default: `false`)

    If set to `true`, the collection will only be kept in-memory and discarded
    when unloaded, resulting in full data loss.

## database.createEdgeCollection

`async database.createEdgeCollection(collectionName, options?): EdgeCollection`

Creates a new edge collection with the given _collectionName_ and _options_,
then returns an `EdgeCollection` object for the new collection.

This is a shorthand for calling `database.createCollection` with
_options.type_ set to `CollectionType.EDGE_COLLECTION`.

## database.listCollections

`async database.listCollections(excludeSystem?): Array<object>`

Fetches all collections from the database and returns an array of collection
descriptions.

**Arguments**

- **excludeSystem**: `boolean` (Default: `true`)

  Whether system collections should be excluded.

**Examples**

```js
const db = new Database();

const collections = await db.listCollections();
// collections is an array of collection descriptions
// not including system collections

// -- or --

const collections = await db.listCollections(false);
// collections is an array of collection descriptions
// including system collections
```

## database.collections

`async database.collections(excludeSystem?): Array<Collection>`

Fetches all collections from the database and returns an array of
`DocumentCollection` and `EdgeCollection` instances for the collections.

**Arguments**

- **excludeSystem**: `boolean` (Default: `true`)

  Whether system collections should be excluded.

**Examples**

```js
const db = new Database();

const collections = await db.collections();
// collections is an array of DocumentCollection
// and EdgeCollection instances
// not including system collections

// -- or --

const collections = await db.collections(false);
// collections is an array of DocumentCollection
// and EdgeCollection instances
// including system collections
```

When using TypeScript, the `Collection` instances can be cast to more specific
`DocumentCollection` and `EdgeCollection` types individually for stricter type
safety. Check the examples for the _database.collection_ method for more
information.
