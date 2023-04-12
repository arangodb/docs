---
layout: default
description: >-
  Collections allow you to store documents and you can use them to group records
  of similar kinds together
redirect_from:
  - data-modeling-naming-conventions-collection-and-view-names.html # 3.10 -> 3.10
---
# Collections

{{ page.description }}
{:class="lead"}

A collection can contain a set of documents, similar to how a folder contains
files. You can store documents with varying data structures in a single
collection, but a collection is typically used to only store one type of
entities. For example, you can use one collection for products, another for
customers, and yet another for orders.

## Collection types

- The regular type of collection is a **document collection**. If you use
  document collections for a graph, then they are referred to as
  **vertex collections**.

- To store connections between the vertices of a graph, you need to use
  **edge collections**. The documents they contain have a `_from` and a `_to`
  attribute to reference documents by their ID.

- Collection that are used internally by ArangoDB are prefixed with an
  underscore (like `_users`) and are called **system collections**. They can be
  document collections as well as edge collections.

You need to specify whether you want a document collection or an edge collection
when you create the collection. The type cannot be changed later.

## Collection names

You can give each collection a name to identify and access it. The name needs to
be unique within a [database](data-modeling-databases.html), but not globally
for the entire ArangoDB instance.

The namespace for collections is shared with [Views](data-modeling-views.html).
There cannot exist a collection and a View with the same name in the same database.

The collection name needs to be a string that adheres to either the **traditional**
or the **extended** naming constraints. Whether the former or the latter is
active depends on the `--database.extended-names` startup option.
The extended naming constraints are used if enabled, allowing many special and
UTF-8 characters in database, collection, View, and index names. If set to
`false` (default), the traditional naming constraints are enforced.

{% hint 'info' %}
The extended naming constraints are an **experimental** feature but they will
become the norm in a future version. Drivers and client applications
should be prepared for this feature.
{% endhint %}

The restrictions for collection names are as follows:

- For the **traditional** naming constraints:
  - The names must only consist of the letters `A` to `Z` (both in lower 
    and upper case), the digits `0` to `9`, and underscore (`_`) and dash (`-`)
    characters. This also means that any non-ASCII names are not allowed.
  - Names of user-defined collections must always start with a letter.
    System collection names must start with an underscore. You should not use
    system collection names for your own collections.
  - The maximum allowed length of a name is 256 bytes.
  - Collection names are case-sensitive.

- For the **extended** naming constraints:
  - Names can consist of most UTF-8 characters, such as Japanese or Arabic
    letters, emojis, letters with accentuation. Some ASCII characters are
    disallowed, but less compared to the  _traditional_ naming constraints.
  - Names cannot contain the characters `/` or `:` at any position, nor any
    control characters (below ASCII code 32), such as `\n`, `\t`, `\r`, and `\0`.
  - Spaces are accepted, but only in between characters of the name. Leading
    or trailing spaces are not allowed.
  - `.` (dot), `_` (underscore) and the numeric digits `0`-`9` are not allowed
    as first character, but at later positions.
  - Collection names are case-sensitive.
  - Collection names containing UTF-8 characters must be 
    [NFC-normalized](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms){:target="_blank"}.
    Non-normalized names are rejected by the server.
  - The maximum length for a collection name is 256 bytes after normalization. 
    As a UTF-8 character may consist of multiple bytes, this does not necessarily 
    equate to 256 characters.

  Example collection names that can be used with the _extended_ naming constraints:
  `España`, `😀`, `犬`, `كلب`, `@abc123`, `København`, `München`, `Бишкек`, `abc? <> 123!`

{% hint 'warning' %}
While it is possible to change the value of the
`--database.extended-names` option from `false` to `true` to enable
extended names, the reverse is not true. Once the extended names have been
enabled, they remain permanently enabled so that existing databases,
collections, Views, and indexes with extended names remain accessible.

Please be aware that dumps containing extended names cannot be restored
into older versions that only support the traditional naming constraints. In a
cluster setup, it is required to use the same naming constraints for all
Coordinators and DB-Servers of the cluster. Otherwise, the startup is
refused. In DC2DC setups, it is also required to use the same naming constraints
for both datacenters to avoid incompatibilities.
{% endhint %}

You can rename collections (except in cluster deployments). This changes the
collection name, but not the collection identifier.

## Collection identifiers

A collection identifier lets you refer to a collection in a database, similar to
the name. It is a string value and is unique within a database. Unlike
collection names, ArangoDB assigns collection IDs automatically and you have no
control over them.

ArangoDB internally uses collection IDs to look up collections. However, you
should use the collection name to access a collection instead of its identifier.

ArangoDB uses 64-bit unsigned integer values to maintain collection IDs
internally. When returning collection IDs to clients, ArangoDB returns them as
strings to ensure the identifiers are not clipped or rounded by clients that do
not support big integers. Clients should treat the collection IDs returned by
ArangoDB as opaque strings when they store or use them locally.

## Key generators

ArangoDB allows using key generators for each collection. Key generators
have the purpose of auto-generating values for the `_key` attribute of a document
if none was specified by the user. By default, ArangoDB uses the traditional
key generator. The traditional key generator auto-generates key values that
are strings with ever-increasing numbers. The increment values it uses are
non-deterministic.

Contrary, the auto-increment key generator auto-generates deterministic key
values. Both the start value and the increment value can be defined when the
collection is created. The default start value is `0` and the default increment
is `1`, meaning the key values it creates by default are:

1, 2, 3, 4, 5, ...

When creating a collection with the auto-increment key generator and an
increment of `5`, the generated keys would be:

1, 6, 11, 16, 21, ...

The auto-increment values are increased and handed out on each document insert
attempt. Even if an insert fails, the auto-increment value is never rolled back.
That means there may exist gaps in the sequence of assigned auto-increment values
if inserts fails.

## Collections API

The following descriptions cover the JavaScript interface for collections that
you can use to handle collections from the _arangosh_ command-line tool, as
well as in server-side JavaScript code like Foxx microservices.
For other languages see the corresponding language API.

### Create a collection

`db._create(collection-name)`

This call creates a new collection called `collection-name`.
This method is a database method and is documented in detail at
[Database Methods](data-modeling-collections-database-methods.html#create).

### Get a collection

`db._collection(collection-name)`

A collection is created by a [`db._create()`](data-modeling-collections-database-methods.html) call.

For example: Assume that the collection identifier is `7254820` and the name is
`demo`, then the collection can be accessed as follows:

```js
db._collection("demo")
```

If no collection with such a name exists, then `null` is returned.

---

There is a short-cut that you can use used for non-system collections:

`db.collection-name`

This call will either return the collection named `db.collection-name` or create
a new one with that name and a set of default properties.

{% hint 'info' %}
Creating a collection on the fly using `db.collection-name` is not recommend and
does not work in _arangosh_. To create a new collection, please use `db._create()`.
{% endhint %}

### Synchronous replication of collections

Distributed ArangoDB setups offer synchronous replication,
which means that there is the option to replicate all data
automatically within an ArangoDB cluster. This is configured for sharded
collections on a per-collection basis by specifying a **replication factor**.
A replication factor of `k` means that altogether `k` copies of each shard are
kept in the cluster on `k` different servers, and are kept in sync. That is,
every write operation is automatically replicated on all copies.

This is organized using a leader/follower model. At all times, one of the
servers holding replicas for a shard is "the leader" and all others
are "followers", this configuration is held in the Agency (see 
[Cluster](architecture-deployment-modes-cluster-architecture.html) for details of the ArangoDB
cluster architecture). Every write operation is sent to the leader
by one of the Coordinators, and then replicated to all followers
before the operation is reported to have succeeded. The leader keeps
a record of which followers are currently in sync. In case of network
problems or a failure of a follower, a leader can and will drop a follower 
temporarily after 3 seconds, such that service can resume. In due course,
the follower will automatically resynchronize with the leader to restore
resilience.

If a leader fails, the cluster Agency automatically initiates a failover
routine after around 15 seconds, promoting one of the followers to
leader. The other followers (and the former leader, when it comes back),
automatically resynchronize with the new leader to restore resilience.
Usually, this whole failover procedure can be handled transparently
for the Coordinator, such that the user code does not even see an error 
message.

This fault tolerance comes at a cost of increased latency.
Each write operation needs an additional network roundtrip for the
synchronous replication of the followers (but all replication operations
to all followers happen concurrently). Therefore, the default replication
factor is `1`, which means no replication.

For details on how to switch on synchronous replication for a collection,
see the database method `db._create(collection-name)` in the section about 
[Database Methods](data-modeling-collections-database-methods.html#create).
