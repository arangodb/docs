---
layout: default
description: Definitions for important ArangoDB terms
title: ArangoDB Glossary
---
Glossary
========

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

