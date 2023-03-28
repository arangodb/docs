---
layout: default
description: Definitions for important ArangoDB terms
title: ArangoDB Glossary
---
Glossary
========

Collection
----------

A collection consists of documents. It is uniquely identified by its collection identifier. 
It also has a unique name that clients should use to identify and access it. 
Collections can be renamed. It will change the collection name, but not the collection identifier. 
Collections contain documents of a specific type. There are currently two types: document (default) and edge. The type is specified by the user when the collection is created, and cannot be changed later.

Collection Identifier
---------------------

A collection identifier identifies a collection in a database. It is a string value and is unique within the database. Clients should use a collection's unique name to access a collection instead of its identifier.

ArangoDB currently uses 64bit unsigned integer values to maintain collection ids internally. When returning collection ids to clients, ArangoDB will put them into a string to ensure the collection id is not clipped by clients that do not support big integers. Clients should treat the collection ids returned by ArangoDB as
opaque strings when they store or use it locally.

Collection Name
---------------

A collection name identifies a collection in a database. It is a string and is unique within the database. Unlike the collection identifier it is supplied by the creator of the collection. The collection name must consist of letters, digits, and the _ (underscore) and - (dash) characters only. Please refer to [NamingConventions](data-modeling-naming-conventions-collection-and-view-names.html) for more information on valid collection names.

Database
--------

ArangoDB can handle multiple databases in the same server instance. Databases can be used to logically group and separate data. An ArangoDB database consists of collections and dedicated database-specific worker processes.

A database contains its own collections (which cannot be accessed from other databases), Foxx applications, and replication loggers and appliers. Each ArangoDB database contains its own system collections (e.g. _users, _replication, ...).

There will always be at least one database in ArangoDB. This is the default database, named _system. This database cannot be dropped, and provides special operations for creating, dropping, and enumerating databases. Users can create additional databases and give them unique names to access them later. Database management operations cannot be initiated from out of user-defined databases.

When ArangoDB is accessed via its HTTP REST API, the database name is read from the first part of the request URI path (e.g. `/_db/myDB/`). If the request URI does not contain a database name, it defaults to `/_db/_system`.
If a database name is provided in the request URI, the name must be properly
URL-encoded, and, if it contains UTF-8 characters, these must be NFC-normalized.
Any non-NFC-normalized database name will be rejected by _arangod_.

Database Name
-------------

Each database must be given a unique name. This name is used to uniquely
identify a database.

There are two naming conventions available for database names: the **traditional**
and the **extended** naming conventions. Whether the former or the latter is active
depends upon the value of the startup flag `--database.extended-names-databases`.
Starting the server with this flag set to `true` will activate the _extended_
naming convention, which tolerates names with special and UTF-8 characters.
If the flag is set to `false` (the default value), the _traditional_ naming
convention is activated.

Also see [Database Naming Conventions](data-modeling-naming-conventions-database-names.html)

Database Organization
---------------------

A single ArangoDB instance can handle multiple databases in parallel. By default,
there will be at least one database which is named `_system`. 

Data is physically stored in `.sst` files in a sub-directory `engine-rocksdb`
that resides in the instance's data directory. A single file can contain
documents of various collections and databases.

ArangoSearch stores data in database-specific directories underneath the
`databases` folder.

Foxx applications are also organized in database-specific directories but inside
the application path. The filesystem layout could look like this:

```
apps/                   # the instance's application directory
  system/               # system applications (can be ignored)
  _db/                  # sub-directory containing database-specific applications
    <database-dir>/     # sub-directory for a single database
      <mountpoint>/APP  # sub-directory for a single application
      <mountpoint>/APP  # sub-directory for a single application
    <database-dir>/     # sub-directory for another database
      <mountpoint>/APP  # sub-directory for a single application
```

The name of `<database-dir>` will be the database's original name or the
database's ID if its name contains special characters.

Document
--------

Documents in ArangoDB are JSON objects. These objects can be nested (to any depth) and may contain arrays. Each document is uniquely identified by its document handle.

Document Etag
-------------

The document revision (`_rev` value) enclosed in double quotes. The revision is returned by several HTTP API methods in the Etag HTTP header.

Document Handle
---------------

A document handle uniquely identifies a document in the database. It is a string and consists of the collection's name and the document key (`_key` attribute) separated by /. The document handle is stored in a document's `_id` attribute.

Document Key
------------

A document key is a string that uniquely identifies a document in a
given collection. It can and should be used by clients when specific
documents are searched. Document keys are stored in the `_key` attribute
of documents. The key values are automatically indexed by ArangoDB in
a collection's primary index. Thus looking up a document by its key is
regularly a fast operation. The `_key` value of a document is immutable
once the document has been created.

By default, ArangoDB will auto-generate a document key if no `_key`
attribute is specified, and use the user-specified `_key` value
otherwise.

This behavior can be changed on a per-collection level by creating
collections with the `keyOptions` attribute.

Using `keyOptions` it is possible to disallow user-specified keys completely, or to force a specific regime for auto-generating the `_key` values.

There are some restrictions for user-defined
keys (see 
[NamingConventions for document keys](data-modeling-naming-conventions-document-keys.html)).

Document Revision
-----------------

Every document in ArangoDB has a revision, stored in the system attribute
`_rev`. It is fully managed by the server and read-only for the user.

Its value should be treated as opaque, no guarantees regarding its format
and properties are given except that it will be different after a
document update. More specifically, `_rev` values are unique across all
documents and all collections in a single server setup. In a cluster setup,
within one shard it is guaranteed that two different document revisions
have a different `_rev` string, even if they are written in the same
millisecond.

The `_rev` attribute can be used as a pre-condition for queries, to avoid
_lost update_ situations. That is, if a client fetches a document from the server,
modifies it locally (but with the `_rev` attribute untouched) and sends it back
to the server to update the document, but meanwhile the document has been changed by
another operation, then the revisions do not match anymore and the operation
is cancelled by the server. Without this mechanism, the client would
accidentally overwrite changes made to the document without knowing about it.

When an existing document is updated or replaced, ArangoDB writes a new
version of this document to the write-ahead logfile (regardless of the
storage engine). When the new version of the document has been written, the
old version(s) is still present, at least on disk. The same is true when
an existing document (version) gets removed: the old version of the document
plus the removal operation are on disk for some time.

On disk it is therefore possible that multiple revisions of the same document
(as identified by the same `_key` value) exist at the same time. However,
stale revisions **are not accessible**. Once a document has been updated or removed
successfully, no query or other data retrieval operation done by the user
is able to see it any more. Furthermore, after some time, old revisions
are removed internally. This is to avoid ever-growing disk usage.

{% hint 'warning' %}
From a **user perspective**, there is just **one single document revision
present per different `_key`** at every point in time. There is no built-in
system to automatically keep a history of all changes done to a document
and old versions of a document cannot be restored via the `_rev` value.
{% endhint %}

Edge
----

Edges are special documents used for connecting other documents into a graph. An edge describes the connection between two documents using the `_from` and `_to` system attributes. These contain document handles, namely the start-point and the end-point of the edge.

Edge Collection
---------------

Edge collections are collections that store edges.

Edge Definition
---------------

Edge definitions are parts of the definition of `named graphs`. They describe which edge collections connect which vertex collections.

General Graph
-------------

Module maintaining graph setup in the `_graphs` collection - aka `named graphs`. Configures which edge collections relate to which vertex collections. Ensures graph consistency in modification queries.

Named Graphs
------------

Named graphs enforce consistency between edge collections and vertex collections, so if you remove a vertex, edges pointing to it will be removed too.

Index
-----

Indexes are used to allow fast access to documents in a collection. All collections have a primary index, which is the document's _key attribute. This index cannot be dropped or changed.

Edge collections will also have an automatically created edges index, which cannot be modified. This index provides quick access to documents via the `_from` and `_to` attributes.

Most user-land indexes can be created by defining the names of the attributes which should be indexed. Some index types allow indexing just one attribute (e.g. fulltext index) whereas other index types allow indexing multiple attributes.

Indexing the system attribute `_id` in user-defined indexes is not supported by any index type.

Edge Index
-----------

An edge index is automatically created for edge collections. It contains connections between vertex documents and is invoked when the connecting edges of a vertex are queried. There is no way to explicitly create or delete edge indexes.

Fulltext Index
--------------

{% hint 'warning' %}
The fulltext index type is deprecated from version 3.10 onwards.
{% endhint %}

A fulltext index can be used to find words, or prefixes of words inside documents. A fulltext index can be defined on one attribute only, and will include all words contained in documents that have a textual value in the index attribute. The index will also include words from the index attribute if the index attribute is an array of strings, or an object with string value members.

For example, given a fulltext index on the `translations` attribute and the following documents, then searching for `лиса` using the fulltext index would return only the first document. Searching for the index for the exact string `Fox` would return the first two documents, and searching for `prefix:Fox` would return all three documents:

```json
{ "translations": { "en": "fox", "de": "Fuchs", "fr": "renard", "ru": "лиса" } }
{ "translations": "Fox is the English translation of the German word Fuchs" }
{ "translations": [ "ArangoDB", "document", "database", "Foxx" ] }
```

If the index attribute is neither a string, an object or an array, its contents will not be indexed. When indexing the contents of an array attribute, an array member will only be included in the index if it is a string. When indexing the contents of an object attribute, an object member value will only be included in the index if it is a string. Other data types are ignored and not indexed.

Only words with a (specifiable) minimum length are indexed. Word tokenization is done using the word boundary analysis provided by libicu, which is taking into account the selected language provided at server start. Words are indexed in their lower-cased form. The index supports complete match queries (full words) and prefix queries.

Geo Index
---------

A geo index is used to find places on the surface of the earth fast.

Index Handle
------------

An index handle uniquely identifies an index in the database. It is a string and consists of a collection name and an index identifier separated by /.

Persistent Index
----------------

A persistent index is a sorted index type that can be used to find individual documents by a lookup value,
or multiple documents in a given lookup value range. It can also be used for retrieving documents in a
sorted order.

Anonymous Graphs
----------------

You may use edge collections with vertex collections without the graph management facilities. However, graph consistency is not enforced by these. If you remove vertices, you have to ensure by yourselves edges pointing to this vertex are removed. Anonymous graphs may not be browsed using graph viewer in the webinterface. This may be faster in some scenarios.

View
----

A view is conceptually a transformation function over documents from zero or
more collections. It is uniquely identified by its view identifier. It also has
a unique name that clients should use to identify and access it. Views can be
renamed. Renaming a view will change the view name, but not the view identifier.
The conceptual transformation function employed by a view type is implementation
specific. The type is specified by the user when the view is created, and cannot
be changed later. The following view types are currently supported:
* [`arangosearch`](arangosearch-views.html)

View Identifier
---------------

A view identifier identifies a view in a database. It is a string value and is
unique within the database. Clients should use a view's unique name to access a
view instead of its identifier.

ArangoDB currently uses 64bit unsigned integer values to maintain view ids
internally. When returning view ids to clients, ArangoDB will put them into a
string to ensure the view id is not clipped by clients that do not support big
integers. Clients should treat the view ids returned by ArangoDB as opaque
strings when they store or use them locally.

View Name
---------

A view name identifies a view in a database. It is a string and is unique within
the database. Unlike the view identifier it is supplied by the creator of the
view. The view name must consist of letters, digits, and the _ (underscore)
and - (dash) characters only. Please refer to
[Naming Conventions](data-modeling-naming-conventions-collection-and-view-names.html) for
more information on valid view names, which follow the same guidelines as
collection names.

IFF
---

Short form of [if and only if](https://en.m.wikipedia.org/wiki/If_and_only_if){:target="_blank"}.
