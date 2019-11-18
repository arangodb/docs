
Features
-----

Name                  | Description
:---------------------|:---------------------
Active Failover       | Single server instance that is replicated for high availability
Analyzer              | Analyzers parse input values and transform them into sets of sub-values, for example by breaking up text into words.
Anonymous Graph       | Anonymous graph does not have edge definitions describing which vertex collection is connected by which edge collection
AQL                   | ArangoDB query language that can be used to retrieve and modify data stored in ArangoDB database
ArangoSearch          | A C++ based Full-Text search engine including similarity ranking search capabilities natively integrated into ArangoDB
DC2DC                 | Datacenter to datacenter replication
distributeShardsLike  | Used to make two collections shard their data alike
Foxx                  | A microservice framework that allows Application developers to write their data access and domain logic as microservices running within the database with native access to in-memory data
HotBackup             | Ability to take a backup on running servers without the need for downtime _(Enterprise Edition only)_
Joins                 | Creating AQL Query results from multiple collections
Oasis                 | ArangoDB Oasis is the managed service for ArangoDB
Satellite Collections | A collection with exactly one shard and is replicated across all DB Servers _(Enterprise Edition only)_
SmartGraphs           | Partitions graph based on smart attribute where all vertices with the same value are stored on the same physical machine, along with all edges connecting these vertices. _(Enterprise Edition only)_
SmartJoins            | Allows running joins between two sharded collections with performance close to that of a local join operation. _(Enterprise Edition only)_
View                  | A database object that can contain references to documents stored in different collections


Terms | Concepts
---
Name                  | Description
:---------------------|:---------------------
arangod               | Name of the ArangoDB server binary, and thus also the name of a single process
Collection            | A collections stores documents. It is comparable to tables in relational database systems
Agency                | Component that stores the current cluster configuration and manages the entire ArangoDB cluster
Coordinator           | Component of ArangoDB cluster that coordinate tasks such as routing queries and managing Foxx services. When clients communicate with ArangoDB clusters they talk to coordinators
Database              | Database is a set of Collection
Datacenter            | An ArangoDB cluster in a specific region
DBServer              | Data storing node in an ArangoDB cluster
Document              | A document is a single record in an ArangoDB collection. It stores data in JSON format. It is comparable to rows in relational database systems.
Edge                  | Edge is a single document inside an edge collection, it defines which two vertices are connected to through the edge
Edge Collection       | Stores relations between nodes in a graph
Follower              | Secondary copies of the data after replication
Leader                | Primary copy of the data after replication
MMFiles               | MMfiles is a storage engine for ArangoDB. MMFiles (Memory-Mapped Files) engine is optimized for the use-case where the data fits into the main memory
Named Graph           | A named graph has vertex collections and edge collections defining what edges connect what vertices
Node                  | A single machine (physical or virtual) running an ArangoDB process (Agent, Coordiantor or DBServer)
Replication           | Store multiple copies of same data on different machines for high availability
RocksDB               | RocksDB is the default engine for ArangoDB since 3.4. It is a log structure database and is optimized for fast storage.
Shard                 | ArangoDB partitions data into shards. A single Shard consists of subset of partitioned data
Sharding              | Splitting of data useful to store large quantity of data that will not fit on single machine
SmartJoin Attribute   | smartJoinAttribute can be specified for a collection in case the join on that collection must be performed on a non-shard key attribute
Transactions          | A logical unit of work that is independently executed and honors the ACID property.
Traversal             | Traversal is a process of visiting each vertex in a graph
VelocyPack            | A binary format for serialization and storage
Vertex                | Vertex is a single document inside a vertex collection
Write Ahead Log       | The write-ahead log is sequence of append-only files containing all the write operations that were executed on the server.


Tools
---
Name                  | Description
:---------------------|:---------------------
ArangoBackup          | Arangobackup is a command-line client tool for instantaneous and consistent hot backups of the data and structures stored in ArangoDB
ArangoBench           | Arangobench is ArangoDB's benchmark and test tool
arangod               | Name of the ArangoDB server binary, and thus also the name of a single process
ArangoDB Starter      | The ArangoDB Starter is a tool that can help you deploy ArangoDB in an easy way (either in single-instance, active/passive or Cluster mode)
arangodump            | Command line tool to create backups of data and structures stored in ArangoDB
ArangoExport          | Arangoexport is a command-line client tool to export data from ArangoDB servers to formats like JSON, CSV or XML for consumption by third-party tools
ArangoImport          | Arangoimport is a command-line client tool to import data in JSON, CSV and TSV format to ArangoDB servers
ArangoInspect         | Arangoinspect is a command-line client tool that collects information of any ArangoDB server setup to facilitate troubleshooting for the ArangoDB support
ArangoRestore         | Arangorestore is a command-line client tool to restore backups created by Arangodump to ArangoDB servers
arangosh              | Command line tool used for administration of ArangoDB servers
