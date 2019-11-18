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
Native Multi-Model    | 
Oasis                 | ArangoDB Oasis is the managed service for ArangoDB
OneShard Cluster      | 
Satellite Collections | A collection with exactly one shard and is replicated across all DB Servers _(Enterprise Edition only)_
SmartGraphs           | Partitions graph based on smart attribute where all vertices with the same value are stored on the same physical machine, along with all edges connecting these vertices. _(Enterprise Edition only)_
SmartJoins            | Allows running joins between two sharded collections with performance close to that of a local join operation. _(Enterprise Edition only)_


Terms / Concepts
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
Driver                | 
Document              | A document is a single record in an ArangoDB collection. It stores data in JSON format. It is comparable to rows in relational database systems.
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
