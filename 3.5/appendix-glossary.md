---
layout: default
description: Definitions for important ArangoDB terms
title: ArangoDB Glossary
---
Glossary
========

Features
--------

Name                  | Description
:---------------------|:---------------------
Active Failover       | Single server instance that is replicated for high availability
Auditing              | Allows a user to monitor access to the database in detail through audit logs _(Enterprise Edition only)_
Anonymous Graph       | Anonymous graph does not have edge definitions describing which vertex collection is connected by which edge collection
AQL                   | ArangoDB query language that can be used to retrieve and modify data stored in ArangoDB database
ArangoSearch          | A C++ based Full-Text search engine including similarity ranking search capabilities natively integrated into ArangoDB
Data Masking          | Used with ArangoDump and allows user to define how sensitive data should be dumped. It is possible to exclude the entire collection, limit the dump to a subset of collection or obfuscate certain fields for a dump
DC2DC                 | Datacenter to datacenter replication
DirectMQ              | Is a message queue developed by ArangoDB in GO and is tailored for DC2DC replication with efficient native networking routines _(Enterprise Edition only)_
distributeShardsLike  | Used to make two collections shard their data alike
Encryption at Rest    | This feature encrypts all data in ArangoDB before it is written to disk with an AES-256-CTR encryption algorithm _(Enterprise Edition only)_
Foxx                  | A microservice framework that allows Application developers to write their data access and domain logic as microservices running within the database with native access to in-memory data
HotBackup             | Ability to take a backup on running servers without the need for downtime _(Enterprise Edition only)_
Joins                 | Creating AQL Query results from multiple collections
Native Multi-Model    | A native multi-model database is a combination of several data stores in one. Because of ArangoDB's native multi-model approach, it is possible to store data as key/value pairs, graphs or documents and access all of it with one declarative query language
Oasis                 | ArangoDB Oasis is the managed service for ArangoDB
OneShard Database     | OneShard database in ArangoDB are databases that fit entirely on a single machine. It is an easy setup of replicated databases that behave like single servers providing local performance andACID transactions
Satellite Collections | A collection with exactly one shard and is replicated across all DB Servers _(Enterprise Edition only)_
SmartGraphs           | Partitions graph based on smart attribute where all vertices with the same value are stored on the same physical machine, along with all edges connecting these vertices. _(Enterprise Edition only)_
SmartJoins            | Allows running joins between two sharded collections with performance close to that of a local join operation. _(Enterprise Edition only)_


Terms / Concepts
=======
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

{% docublock documentRevision %}

Edge
----

Edges are special documents used for connecting other documents into a graph. An edge describes the connection between two documents using the internal attributes: `_from` and `_to`. These contain document handles, namely the start-point and the end-point of the edge.

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

Edges Index
-----------

An edges index is automatically created for edge collections. It contains connections between vertex documents and is invoked when the connecting edges of a vertex are queried. There is no way to explicitly create or delete edges indexes.

Fulltext Index
--------------

A fulltext index can be used to find words, or prefixes of words inside documents. A fulltext index can be defined on one attribute only, and will include all words contained in documents that have a textual value in the index attribute. Since ArangoDB 2.6 the index will also include words from the index attribute if the index attribute is an array of strings, or an object with string value members.

For example, given a fulltext index on the `translations` attribute and the following documents, then searching for `лиса` using the fulltext index would return only the first document. Searching for the index for the exact string `Fox` would return the first two documents, and searching for `prefix:Fox` would return all three documents:
     
    { translations: { en: "fox", de: "Fuchs", fr: "renard", ru: "лиса" } }
    { translations: "Fox is the English translation of the German word Fuchs" }
    { translations: [ "ArangoDB", "document", "database", "Foxx" ] }

If the index attribute is neither a string, an object or an array, its contents will not be indexed. When indexing the contents of an array attribute, an array member will only be included in the index if it is a string. When indexing the contents of an object attribute, an object member value will only be included in the index if it is a string. Other data types are ignored and not indexed.

Only words with a (specifiable) minimum length are indexed. Word tokenization is done using the word boundary analysis provided by libicu, which is taking into account the selected language provided at server start. Words are indexed in their lower-cased form. The index supports complete match queries (full words) and prefix queries.

Geo Index
---------

A geo index is used to find places on the surface of the earth fast.

Index Handle
------------

An index handle uniquely identifies an index in the database. It is a string and consists of a collection name and an index identifier separated by /.

Hash Index
----------

A hash index is used to find documents based on examples. A hash index can be created for one or multiple document attributes.

A hash index will only be used by queries if all indexed attributes are present in the example or search query, and if all attributes are compared using the equality (== operator). That means the hash index does not support range queries.

A unique hash index has an amortized complexity of O(1) for lookup, insert, update, and remove operations.
The non-unique hash index is similar, but amortized lookup performance is O(n), with n being the number of
index entries with the same lookup value.

Skiplist Index
--------------

A skiplist is a sorted index type that can be used to find ranges of documents.


Anonymous Graphs
----------------

Name                  | Description
:---------------------|:---------------------
Agency                | Component that stores the current cluster configuration and manages the entire ArangoDB cluster
Analyzers             | Analyzers parse input values and transform them into sets of sub-values, for example by breaking up text into words
Arango                | An [avocado variety](http://www.avocadosource.com/AvocadoVarieties/QueryDB.asp){:target="_blank"}
Collection            | A collections stores documents. It is comparable to tables in relational database systems
Coordinator           | Component of ArangoDB cluster that coordinate tasks such as routing queries and managing Foxx services. When clients communicate with ArangoDB clusters they talk to coordinators
Database              | Database is a set of Collection
Datacenter            | An ArangoDB cluster in a specific region
DBServer              | Data storing node in an ArangoDB cluster
Driver                | A database driver is a computer program that implements a protocol for a database connection and works like an adaptor which connects a generic interface to a specific database
Document              | A document is a single record in an ArangoDB collection. It stores data in JSON format. It is comparable to rows in relational database systems
Document Collection   | 
Document Store        | 
Edge                  | Edge is a single document inside an edge collection, it defines which two vertices are connected to through the edge
Edge Collection       | Stores relations between nodes in a graph
Edge Index            | 
Follower              | Secondary copies of the data after replication
Full-Text Index       | 
Geo Index             | 
GeoJSON               | 
Graph Store           | 
Hash Index            | 
Index                 | 
JSON                  | 
Key-Value Store       | 
LDAP                  | 
Leader                | Primary copy of the data after replication
MMFiles               | MMFiles is a storage engine for ArangoDB. MMFiles (Memory-Mapped Files) engine is optimized for the use-case where the data fits into the main memory
Named Graph           | A named graph has vertex collections and edge collections defining what edges connect what vertices
Node                  | A single machine (physical or virtual) running an ArangoDB process (Agent, Coordinator or DBServer)
Persistent Index      | 
Primary Index         | 
Replication           | Store multiple copies of same data on different machines for high availability
RocksDB               | RocksDB is the default engine for ArangoDB since 3.4. It is a log structure database and is optimized for fast storage.
Search Engine         | 
Shard                 | ArangoDB partitions data into shards. A single Shard consists of subset of partitioned data
Sharding              | Splitting of data useful to store large quantity of data that will not fit on single machine
Skiplist Index        | 
SmartJoin Attribute   | smartJoinAttribute can be specified for a collection in case the join on that collection must be performed on a non-shard key attribute
Storage Engine        | 
Transaction           | A logical unit of work that is independently executed and honors the ACID property.
Traversal             | Traversal is a process of visiting each vertex in a graph
TTL Index             | 
UDF                   | User-defined AQL function
VelocyPack            | A binary format for serialization and storage
VelocyStream          | 
Vertex                | Vertex is a single document inside a document collection
Vertex Collection     | 
Views                 | A database object that can contain references to documents stored in different collections
Write Ahead Log       | The write-ahead log is sequence of append-only files containing all the write operations that were executed on the server

Tools
-----

Name                  | Description
:---------------------|:---------------------
ArangoBackup          | [Arangobackup](programs-arangobackup.html) is a command-line client tool for instantaneous and consistent hot backups of the data and structures stored in ArangoDB
ArangoBench           | [Arangobench](programs-arangobench.html) is ArangoDB's benchmark and test tool
Arangod               | Name of the [ArangoDB server](programs-arangod.html) binary, and thus also the name of a single process
ArangoDB Starter      | The [ArangoDB Starter](programs-starter.html) is a tool that can help you deploy ArangoDB in an easy way (either in single-instance, active/passive or Cluster mode)
ArangoDump            | [ArangoDump](programs-arangodump.html) Command line tool to create backups of data and structures stored in ArangoDB
ArangoExport          | [ArangoExport](programs-arangoexport.html) is a command-line client tool to export data from ArangoDB servers to formats like JSON, CSV or XML for consumption by third-party tools
ArangoImport          | [ArangoImport](programs-arangoimport.html) is a command-line client tool to import data in JSON, CSV and TSV format to ArangoDB servers
ArangoInspect         | [ArangoInspect](programs-arangoinspect.html) is a command-line client tool that collects information of any ArangoDB server setup to facilitate troubleshooting for the ArangoDB support
ArangoRestore         | [ArangoRestore](programs-arangorestore.html) is a command-line client tool to restore backups created by ArangoDump to ArangoDB servers
ArangoSH              | [ArangoSH](programs-arangosh.html) is a command-line client tool used for administration of ArangoDB servers
