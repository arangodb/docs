---
layout: default
---
# Community Edition Features

<https://www.arangodb.com/community-server/>

## General

- **Graph Database**:
  You can model complex domains because edges are documents without any
  restrictions in complexity.

- **Document Database**:

- **Schema-free**:
  Flexible data modeling: model your data as combination of key-value pairs,
  documents or graphs - perfect for social relations. Optional document
  validation using JSON Schema (draft-4, without remote schema support).

- **Data Format**:
  JSON, internally stored in a binary format invented by ArangoDB called
  VelocyPack.

- **Data Storage**:
  RocksDB storage engine with journaling to persist data and indexes on disk,
  with a hot set in memory.

- **Multi-Platform**:
  Available for Linux, macOS, and Windows. <!-- TODO: Limitations? -->

## Scalability & High Availability

- **Auto-Sharding**:
  Spread bigger datasets across multiple servers using consistent hashing on
  the default or custom shard keys.

- **Synchronous Replication**:
  Synchronous replication works on a per-shard basis. One configures for each
  collection, how many copies of each shard are kept in the cluster.

- **Active Failover**:
  Run a single server with asynchronous replication to one or more passive
  single servers for automatic failover.

- **Automatic Failover Cluster**

- **Master/Master Conflict Resolution**

- **Load-Balancer Support**:
  Round-robin load-balancer support for cloud environments.

- **High-performance Request Handling**:
  Low-latency request handling using a boost-ASIO server infrastructure.

## Querying

- **Declarative Query Language for all Data Models**
  Powerful query language (AQL) to retrieve and modify data.
  Graph traversals, full-text searches, geo-spatial queries, and aggregations
  can be composed in a single query.
  Support for sliding window queries to aggregate adjacent documents, value
  ranges and time intervals.
  Cluster-distributed aggregation queries.

- **Query Optimizer**:
  Cost-based query optimizer that takes index selectivity estimates into account.
  <!-- TODO: Explain, batching?, lazy evaluation (stream)? -->

- **Query Profiling**
  Show detailed runtime information.

- **Upsert Operations**:
  Support for insert-or-update (upsert), insert-or-replace (repsert), and
  insert-or-ignore requests, that result in one or the other operation depending
  on whether the target document exists already.

- **Graph Relations**:
  <!-- TODO: does this refer to the data model, graph traversals, or something else? -->
  Edges can connect vertex and even edge documents.
  Graphs can be traversed with AQL to retrieve direct and indirect neighbor
  nodes, using depth-first search, breadth-first search, or in order of
  increasing edge weights ("Weighted Traversals").
  Stop condition support for graph traversals (pruning).

- **Relational Joins**

- **Advanced Path-Finding with Multiple Algorithms**:
  Graph traversal algorithms
  to get a shortest path, multiple shortest paths ("k Shortest Paths"), and
  to enumerate all paths between two vertices ("k Paths")

- **Pregel**:
  Iterative graph processing for single servers with pre-built algorithms like
  PageRank, Connected Components, and Label Propagation.

- **ArangoSearch for Text Search and Ranking**:
  Wildcard and fuzzy search support for full-text search.
  Edge _n_-gram support.
  Flexible data field pre-processing with custom queries and the ability to
  chain built-in and custom analyzers.
  Geo-spatial queries can be combined with full-text search.
  Language-agnostic tokenization of text.

- **GeoJSON Support**

## Transactions

- **ACID Transactions**
  Using a single instance of ArangoDB, multi-document / multi-collection
  queries are guaranteed to be fully ACID. In cluster mode, single-document
  operations are also fully ACID. Multi-document / multi-collection queries in
  a cluster are not ACID, which is equally the case with competing database
  systems. Note that for non-sharded collections in a cluster, the
  transactional properties of a single server apply (fully ACID).

- **Multi-Document Transactions**

- **Multi-Collection Transactions**

  Automatic deadlock detection for single servers.

- **Stream Transactions**:
  Multi-document transactions with individual begin and commit / abort commands.

## Performance

- **Persistent Indexes**:
  Indexes are stored on disk to enable fast server restarts. You can create
  secondary indexes over one or multiple fields, optionally with a uniqueness
  constraint. A "sparse" option to only index non-null values is also available.
  The elements of an array can be indexed individually.

- **Vertex-centric Indexes**:
  Secondary indexes for more efficient graph traversals with filter conditions.

- **Time-to-live Indexes**:
  Time-based removal of expired documents.

- **Geo-spatial Indexes**:
  Accelerated geo-spatial queries for coordinates and GeoJSON objects, based on
  the S2 library. <!-- TODO: list supported queries? Centroid-limitations? -->
  Support for composable, distance-based geo-queries ("geo cursors").

- **Background Indexing**:
  Indexes can be created in the background to not block queries in the meantime.

- **Extensive Query Optimization**: <!-- TODO, move to Querying? -->
  Late document materialization to only fetch the relevant documents from
  SORT/LIMIT queries. Early pruning of non-matching documents in full
  collection scans. Inlining of certain subqueries to improve execution time.


## Extensibility

- **Microservice Support with ArangoDB Foxx**:
  Use ArangoDB as an application server and fuse your application and database
  together for maximal throughput.
  With fault-tolerant cluster support.

- **Server-Side Functions**:
  You can extend AQL with user-defined functions written in JavaScript.

## Security

- **Authentication**

- **TLS Encryption**:
  Internal and external communication over encrypted network connections.

- **Role-based Access Control**

  ArangoDB supports all basic security requirements. By using ArangoDB's Foxx
  microservice framework users can achieve very high security standards
  fitting individual needs.

## Administration

- **Web-based User Interface**:
  Graphical UI for your browser to work with ArangoDB. It allows you to
  view, create, and modify databases, collections, documents, graphs, etc.
  You can also run, explain, and profile AQL queries. Includes a graph viewer
  with WebGL support.

- **Cluster-friendly User Interface**

- **Backup and Restore Tools**

  Multi-threaded dump and restore operations.
  Data masking capabilities for attributes containing sensitive data / PII when
  creating backups.
  Consistent cluster backups. <!-- TODO -->

- **Import and Export Tools**
  CLI utilities to load and export data for multiple formats. <!-- TODO: List formats? -->
