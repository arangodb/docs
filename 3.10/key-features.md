---
layout: default
---
# Key Features

NoSQL, OLTP, CP

## Editions

ArangoDB is freely available in a **Community Edition** under the Apache 2.0
open-source license. It is a fully-featured version without time or size
restrictions and includes cluster support.

<https://www.arangodb.com/community-server/>

ArangoDB is also available in a commercial version, called the
**Enterprise Edition**. It includes additional features for performance and
security, such as for scaling graphs and encrypting on-disk data.

<https://www.arangodb.com/enterprise-server/>

### Community Edition Features

- General

  - **Graph Database**
    You can model complex domains because edges are documents without any
    restrictions in complexity.

  - **Document Database**

  - **Schema-free**
    Flexible data modeling: model your data as combination of key-value pairs,
    documents or graphs - perfect for social relations. Optional document
    validation using JSON Schema (draft-4, without remote schema support).

  - **Data Format**
    JSON, internally stored in a format invented by ArangoDB called VelocyPack.

  - **Data Storage**
    persistent, RocksDB, journaling

- Scalability & High Availability

  - **Auto-Sharding**
    Spread bigger datasets across multiple servers.

  - **Sync and Async Replication**

    Synchronous replication works on a per-shard basis. One configures for each
    collection, how many copies of each shard are kept in the cluster.
    Asynchronous replication is organized using primary and secondary DB-Servers.

  - **Active Failover**

  - **Automatic Failover Cluster**

  - **Master/Master Conflict Resolution**

- Transactions

  - **ACID Transactions**
    Using a single instance of ArangoDB, multi-document / multi-collection
    queries are guaranteed to be fully ACID. In cluster mode, single-document
    operations are also fully ACID. Multi-document / multi-collection queries in
    a cluster are not ACID, which is equally the case with competing database
    systems. Note that for non-sharded collections in a cluster, the
    transactional properties of a single server apply (fully ACID).


  - **Multi-Document Transactions**

  - **Multi-Collection Transactions**

- Querying

  - **Declarative Query Language for all Data Models**
    Powerful query language (AQL) to retrieve and modify data.
    Support for sliding window queries to aggregate adjacent documents, value
    ranges and time intervals.

  - **Graph Relations**

  - **Relational Joins**

  - **Advanced Path-Finding with Multiple Algorithms**:
    Graph traversal algorithms 
    neighbors?
    to get a shortest path, multiple shortest paths ("k Shortest Paths"),
    to enumerate all paths between two vertices ("k Paths"), and to emit paths
    in order of increasing edge weights ("Weighted Traversals").
    Stop condition support for graph traversals (pruning).

  - **Pregel**

  - **ArangoSearch for Text Search and Ranking**:
    Wildcard and fuzzy search support for full-text search.
    Edge _n_-gram support.
    Flexible data field pre-processing with custom queries and the ability to
    chain built-in and custom analyzers.
    Geo-spatial queries can be combined with full-text search.
    Language-agnostic tokenization of text.

  - **GeoJSON Support**

- Extensibility

  - **Microservice Support with ArangoDB Foxx**
    Use ArangoDB as an application server and fuse your application and database
    together for maximal throughput.

  - **Server-Side Functions**

- Security

  - **Authentication**

  - **TLS Encryption**

  - **Role-based Access Control**

    ArangoDB supports all basic security requirements. By using ArangoDB's Foxx
    microservice framework users can achieve very high security standards
    fitting individual needs.

- Administration

  - **Web-based User Interface**

  - **Cluster-friendly User Interface**

  - **Backup and Restore Tools**

  - **Import and Export Tools**

**Time-to-live indexes**: Time-based removal of expired documents

### Enterprise Edition Features

The Enterprise Edition has all the features of the Community Edition and the
following on top:

- Performance

  - **SmartGraphs**

  - **Hybrid SmartGraphs**:
    Collections replicated on all cluster nodes can be combined with graphs
    sharded by document attributes to enable more local execution of graph queries.

  - **SatelliteGraphs**:
    Graphs replicated on all cluster nodes to execute graph traversals locally.

  - **SatelliteCollections**

  - **SmartJoins**:
    Use identically sharded collections to perform collocated joins in a cluster.

  - **OneShard**:
    Option to store all collections of a database on a single cluster node, to
    combine the performance of a single server and ACID semantics with a
    fault-tolerant cluster setup.

  - **Traversal Parallelization** (?, single server / OneShard only)
    Parallel execution of queries on several cluster nodes.

- Security

  - **Datacenter to Datacenter Replication**

  - **Auditing**

  - **LDAP Authentication**

  - **Encryption at Rest**:
    Hardware-accelerated on-disk encryption for your data.

  - **Encrypted Backups**

  - **Hot Backups**

  - **Enhanced Data Masking**

  - **Advanced Encryption Configuration**:
    Key rotation for super-user JWT tokens, TLS certificates, and on-disk
    encryption keys.

## On-Premise versus Cloud

You can install ArangoDB on your local machine or run it in a Docker container
for development purposes. You can deploy it on-premise as a single server,
optionally with automatic failover, set up an asynchronously replicated ArangoDB
using multiple machines to scale reads, or install it as a cluster with many
nodes and synchronous replication for high availability and resilience.

If you do not want to operate your own ArangoDB instances on-premise, then
you may use our multi-cloud service.
**ArangoDB Oasis**, the fully managed cloud service, runs the Enterprise Edition
of ArangoDB and most of its features are available.

<https://cloud.arangodb.com/>

