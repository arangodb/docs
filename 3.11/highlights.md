---
layout: default
description: List of top features in Community and Enterprise Edition by release series
title: ArangoDB Highlights
---
# Highlights by Version

The most notable features in the Community and Enterprise Edition of ArangoDB,
grouped by version
{:class="lead"}

## Version 3.11

**All Editions**

- [**Parallel gather**](release-notes-new-features311.html#parallel-gather):
  Faster, more memory-efficient processing of cluster queries by combining
  results on Coordinators in parallel.

- [**Index cache refilling**](release-notes-new-features311.html#index-cache-refilling):
  Automatically repopulate in-memory index caches after writes that affect an
  edge index or cache-enabled persistent indexes to maximize cache hits and thus
  query performance.

**Enterprise Edition**

- [**ArangoSearch WAND optimization**](arangosearch-performance.html#wand-optimization):
  Retrieve search results for the highest-ranking matches from Views faster by
  defining a list of sort expressions to optimize.

- [**ArangoSearch column cache**](release-notes-new-features310.html#arangosearch-column-cache-enterprise-edition):
  Always cache field normalization values, Geo Analyzer auxiliary data,
  stored values, primary sort columns, and primary key columns in memory to
  improve the performance of Views and inverted indexes.

- [**`geo_s2` Analyzer**](analyzers.html#geo_s2):
  Efficiently index geo-spatial data using different binary formats, tuning the
  size on disk, the precision, and query performance.

Also see [What's New in 3.11](release-notes-new-features311.html).

## Version 3.10

**All Editions**

- [**Native ARM Support**](release-notes-new-features310.html#native-arm-support):
  Packages for the ARM architecture are now available, including native support
  for Apple silicon.

- [**Computed Values**](data-modeling-documents-computed-values.html):
  Persistent document attributes that are generated when documents are created
  or modified, using an AQL expression.

- [**Inverted indexes**](indexing-inverted.html):
  A new, eventually consistent index type that can accelerate a broad range of
  queries, providing similar search capabilities as `arangosearch` Views, but
  defined per collection and simpler to use.

- [**`search-alias` Views**](release-notes-new-features310.html#search-alias-views):
  Add inverted indexes to `search-alias` Views for searching multiple collections
  at once, with ranking and search highlighting capabilities, as a lightweight
  alternative to `arangosearch` Views.

- **Persistent indexes**:
  An optional [**In-memory Cache**](indexing-persistent.html#caching-of-index-values)
  for faster lookups and [**Stored Values**](indexing-persistent.html#storing-additional-values-in-indexes)
  to let persistent indexes cover additional attributes of projections.

- **AQL Graph Traversals**:
  [All Shortest Paths](aql/graphs-all-shortest-paths.html) allows you to query
  for all paths of shortest length between two documents.

**Enterprise Edition**

- [**EnterpriseGraphs**](graphs-enterprise-graphs.html): A new specialized version of
  SmartGraphs, with an automatic sharding key selection.

- [**Search highlighting**](arangosearch-search-highlighting.html):
  Get the substring positions of matched terms, phrases, or _n_-grams.

- [**Nested search**](arangosearch-nested-search.html):
  Match arrays of objects with all the conditions met by a single sub-object,
  and define for how many of the elements this must be true.

- **ArangoSearch**:
  New [`minhash` Analyzer](analyzers.html#minhash) for locality-sensitive hashing
  to approximate the Jaccard similarity, with inverted index and
  `arangosearch` View support that allows you to implement entity resolution.

- [**Parallelism for sharded graphs**](release-notes-new-features310.html#parallelism-for-sharded-graphs-enterprise-edition):
  Parallel execution of AQL traversal queries with many start vertices for all
  types of sharded graphs, leading to faster results.

- [**Traversal Projections**](release-notes-new-features310.html#traversal-projections-enterprise-edition): 
  Optimized data loading for AQL traversal queries if only a few document
  attributes are accessed.

Also see [What's New in 3.10](release-notes-new-features310.html).

## Version 3.9

**All Editions**

- **ArangoSearch**:
  New [**Segmentation Analyzer**](analyzers.html#segmentation)
  for language-agnostic tokenization of text.
  A [**Collation Analyzer**](analyzers.html#collation)
  to honor the alphabetical order of the specified language in range queries.

**Enterprise Edition**

- [**(Disjoint) SmartGraphs using SatelliteCollections**](graphs-smart-graphs.html):
  SatelliteCollections can be used in (Disjoint) SmartGraphs to enable more
  local execution of graph queries.

Also see [What's New in 3.9](release-notes-new-features39.html).

## Version 3.8

**All Editions**

- [**Weighted traversals**](release-notes-new-features38.html#weighted-traversals)
  and [**k Paths**](release-notes-new-features38.html#k-paths):
  Two new AQL graph traversal methods to emit paths in order of increasing
  weights and to enumerate all paths between a source and a target vertex that
  match a given length.

- **ArangoSearch**:
  New [**Pipeline Analyzer**](analyzers.html#pipeline)
  that allows you to combine multiple Analyzers, enabling case-insensitive
  _n_-gram-based fuzzy search and more. New
  [**AQL Analyzer**](analyzers.html#aql)
  so that you can use an AQL query to pre-process and filter your data for
  indexing. Support for **geo-spatial queries** through new
  [Geo](analyzers.html#geojson)
  [Analyzers](analyzers.html#geopoint) and
  [ArangoSearch Geo functions](aql/functions-arangosearch.html#geo-functions).
  A new [**Stop words Analyzer**](analyzers.html#stopwords) that
  can be used standalone or in an Analyzer pipeline.

- A [**`WINDOW` operation**](aql/operations-window.html) for aggregations over
  adjacent rows, value ranges or time windows.

**Enterprise Edition**

- **Encryption at Rest** utilizes
  [hardware acceleration](release-notes-new-features38.html#encryption-at-rest)
  capabilities of modern CPUs.

Also see [What's New in 3.8](release-notes-new-features38.html).

## Version 3.7

**All Editions**

- **ArangoSearch**:
  [Wildcard](aql/functions-arangosearch.html#like) and fuzzy search
  ([Levenshtein distance](aql/functions-arangosearch.html#levenshtein_match) and
  [_n_-gram based](aql/functions-arangosearch.html#ngram_match)),
  enhanced [phrase and proximity search](aql/functions-arangosearch.html#phrase),
  improved late document materialization and
  [Views covering queries](release-notes-new-features37.html#covering-indexes)
  using their indexes without touching the storage engine, as well as a new
  SIMD-based index format for faster processing and
  [stemming support](release-notes-new-features37.html#stemming-support-for-more-languages)
  for 15 additional languages.

- [**Schema Validation**](data-modeling-documents-schema-validation.html):
  Enforce a JSON Schema for documents on collection level. Invalid documents
  can be rejected automatically by the database system, making it easy to
  maintain data quality.

- [**Insert-Update** and **Insert-Ignore**](release-notes-new-features37.html#insert-update-and-insert-ignore):
  New document API operations to upsert documents and to efficiently insert
  documents while skipping the creation if the document exists already.

- **AQL**:
  Improved [subquery](release-notes-new-features37.html#subquery-optimizations) and
  [graph traversal performance](release-notes-new-features37.html#traversal-optimizations),
  among many optimizations and enhancements.

- [**HTTP/2 support**](release-notes-new-features37.html#http2-support):
  Better load-balancer and Kubernetes compatibility, improved request throughput.

**Enterprise Edition**

- [**SatelliteGraphs**](release-notes-new-features37.html#satellitegraphs):
  Synchronously replicated graphs with local traversal execution.

- [**Disjoint SmartGraphs**](release-notes-new-features37.html#disjoint-smartgraphs):
  Improve traversal execution times for SmartGraphs without edges between
  vertices with different SmartGraph attributes.

- [**Traversal parallelization**](release-notes-new-features37.html#traversal-parallelization-enterprise-edition):
  Optional parallel execution of nested traversals for single servers and
  OneShard clusters.

- **Security**:
  Added support for multiple
  [JWT Secrets](release-notes-new-features37.html#jwt-secret-rotation-enterprise-edition)
  and the ability to hot-reload them from disk,
  [TLS key and certificate rotation](release-notes-new-features37.html#tls-key-and-certificate-rotation),
  [Encryption at rest key rotation](release-notes-new-features37.html#encryption-at-rest-key-rotation-enterprise-edition)
  and [Server Name Indication (SNI)](release-notes-new-features37.html#server-name-indication-enterprise-edition).

Also see [What's New in 3.7](release-notes-new-features37.html).

## Version 3.6

**All Editions**

- **AQL**:
  Improved query performance thanks to
  [early pruning](release-notes-new-features36.html#early-pruning-of-non-matching-documents),
  [subquery splicing](release-notes-new-features36.html#subquery-splicing-optimization),
  [late document materialization](release-notes-new-features36.html#late-document-materialization-rocksdb),
  [parallelization](release-notes-new-features36.html#parallelization-of-cluster-aql-queries) for certain cluster queries
  and more. New server-side [`maxRuntime`](aql/invocation-with-arangosh.html#maxruntime)
  option for queries.

- **ArangoSearch**:
  New [Analyzer options](release-notes-new-features36.html#analyzers) for
  edge _n_-grams (`text` Analyzer), UTF-8 encoded _n_-gram input and optional
  start/end markers (`ngram` Analyzer). Support for
  [dynamic expressions](release-notes-new-features36.html#dynamic-search-expressions-with-arrays)
  using arrays (array comparison operators in `SEARCH` queries and the
  `TOKENS()` / `PHRASE()` functions accept arrays). Views can benefit from the
  SmartJoins optimization.

**Enterprise Edition**

- [**OneShard**](deployment-oneshard.html)
  deployments offer a practicable solution that enables significant performance
  improvements by massively reducing cluster-internal communication. A database
  created with OneShard enabled is limited to a single DB-Server node but still
  replicated synchronously to ensure resilience. This configuration allows
  running transactions with ACID guarantees on shard leaders.

Also see [What's New in 3.6](release-notes-new-features36.html).

## Version 3.5

**All Editions**

- **ArangoSearch**:
  The search and ranking engine received an upgrade and now features
  [Configurable Analyzers](analyzers.html),
  [Sorted Views](arangosearch-performance.html#primary-sort-order)
  and several improvements to the
  [AQL integration](release-notes-new-features35.html#arangosearch).

- **AQL Graph Traversals**:
  [k Shortest Paths](aql/graphs-kshortest-paths.html) allows you to query not
  just for one shortest path between two documents but multiple, sorted by
  length or weight. With [PRUNE](aql/graphs-traversals.html#pruning) you can
  stop walking down certain paths early in a graph traversal to improve its
  efficiency.

- [**Stream Transaction API**](http/transaction-stream-transaction.html):
  Perform multi-document transactions with individual begin and commit / abort
  commands using the new HTTP endpoints or via a supported driver.

- [**Time-to-Live**](indexing-index-basics.html#ttl-time-to-live-index)
  [**Indexes**](indexing-ttl.html):
  TTL indexes can be used to automatically remove documents in collections for
  use cases like expiring sessions or automatic purging of statistics or logs.

- [**Index Hints**](aql/operations-for.html#indexhint) &
  [**Named Indexes**](https://www.arangodb.com/learn/development/index-hints-named-indices/){:target="_blank"}:
  Indexes can be given names and an optional AQL inline query option
  `indexHint` was added to override the internal optimizer decision on which
  index to utilize.

- [**Data Masking**](programs-arangodump-maskings.html):
  arangodump provides a convenient way to extract production data but mask
  critical information that should not be visible.

**Enterprise Edition**

- [**Hot Backups**](backup-restore.html#hot-backups):
  Create automatic, consistent backups of your cluster without noticeable
  impact on your production systems. In contrast to _arangodump_, hot backups
  are taken on the level of the underlying storage engine and hence both backup
  and restore are considerably faster.

- [**SmartJoins**](smartjoins.html):
  Run joins between identically sharded collections with performance close to
  that of a local join operation.

- **Advanced Data Masking**:
  There are additional
  [data masking functions](programs-arangodump-maskings.html#masking-functions)
  available in the Enterprise Edition, such as for substituting email addresses
  and phone numbers with similar looking pseudo-data.

Also see [What's New in 3.5](release-notes-new-features35.html).

## Version 3.4

**All Editions**

- [**ArangoSearch**](arangosearch.html):
  Search and similarity ranking engine integrated natively into ArangoDB and
  AQL. ArangoSearch combines Boolean retrieval capabilities with generalized
  ranking algorithms (BM25, TFDIF). Support of e.g. relevance-based searching,
  phrase and prefix-matching, complex boolean searches and query time relevance
  tuning. Search can be combined with all supported data models in a single
  query. Many specialized language Analyzers are already included for e.g.
  English, German, French, Chinese, Spanish and many other language.

- [**GeoJSON Support**](aql/functions-geo.html) and
  [**S2 Geo Index**](indexing-geo.html): ArangoDB now supports all geo primitives.
  (Multi-)Point, (Multi-)LineStrings, (Multi-)Polygons or intersections can be
  defined and queried for. The Google S2 geo index is optimized for RocksDB and
  enables efficient querying. Geo query results are automatically visualized
  with an OpenStreetMap integration within the Query Editor of the web interface.

- [**Query Profiler**](aql/execution-and-performance-query-profiler.html):
  Enables the analysis of queries and adds additional information for the user
  to identify optimization potentials more easily. The profiler can be accessed
  via _arangosh_ with `db._profileQuery(...)` or via the *Profile* button in the
  Query Editor of the web interface.

- [**Streaming Cursors**](aql/invocation-with-arangosh.html#stream):
  Cursors requested with the stream option on make queries calculate results
  on the fly and make them available for the client in a streaming fashion,
  as soon as possible.

- **RocksDB as Default Storage Engine**: With ArangoDB 3.4 the default
  [storage engine](architecture-storage-engines.html) for fresh installations will
  switch from MMFiles to RocksDB. Many optimizations have been made to RocksDB
  since the first release in 3.2. For 3.4 we optimized the binary storage
  format for improved insertion, implemented "optional caching", reduced the
  replication catch-up time and much more.

Also see [What's New in 3.4](release-notes-new-features34.html).

## Version 3.3

**Enterprise Edition**

- [**Datacenter-to-Datacenter Replication**](deployment-dc2dc.html):
  Replicate the entire structure and content of an ArangoDB cluster
  asynchronously to another cluster in a different datacenter with ArangoSync.
  Multi-datacenter support means you can fallback to a replica of your cluster
  in case of a disaster in one datacenter.

- [**Encrypted Backups**](programs-arangodump-examples.html#encryption):
  _arangodump_ can create backups encrypted with a secret key using AES256
  block cipher.

**All Editions**

- [**Server-level Replication**](release-notes-new-features33.html#server-level-replication):
  In addition to per-database replication, there is now an additional
  `globalApplier`. Start the global replication on the Follower once and all
  current and future databases will be replicated from the Leader to the
  Follower automatically.

- [**Asynchronous Failover**](release-notes-new-features33.html#asynchronous-failover):
  Make a single server instance resilient with a second server instance, one
  as Leader and the other as asynchronously replicating Follower, with automatic
  failover to the Follower if the Leader goes down.

Also see [What's New in 3.3](release-notes-new-features33.html).

## Version 3.2

**All Editions**

- [**RocksDB Storage Engine**](architecture-storage-engines.html): You can now use
  as much data in ArangoDB as you can fit on your disk. Plus, you can enjoy
  performance boosts on writes by having only document-level locks.

- [**Pregel**](graphs-pregel.html):
  We implemented distributed graph processing with Pregel to discover hidden
  patterns, identify communities and perform in-depth analytics of large graph
  data sets.

- [**Fault-Tolerant Foxx**](http/foxx.html): The Foxx management
  internals have been rewritten from the ground up to make sure
  multi-coordinator cluster setups always keep their services in sync and
  new Coordinators are fully initialized even when all existing Coordinators
  are unavailable.

**Enterprise Edition**

- [**LDAP integration**](programs-arangod-ldap.html): Users and permissions
  can be managed from outside ArangoDB with an LDAP server in different
  authentication configurations.

- [**Encryption at Rest**](security-encryption.html): Let the server
  persist your sensitive data strongly encrypted to protect it even if the
  physical storage medium gets stolen.

- [**SatelliteCollections**](satellites.html): Faster join operations when
  working with sharded datasets by synchronously replicating selected
  collections to all DB-Servers in a cluster, so that joins can be
  executed locally.

Also see [What's New in 3.2](release-notes-new-features32.html).

## Version 3.1

**All Editions**

- [**Vertex-centric indexes**](indexing-vertex-centric.html):
  AQL traversal queries can utilize secondary edge collection
  indexes for better performance against graphs with supernodes.

- [**VelocyPack over HTTP**](https://www.arangodb.com/2016/10/updated-java-drivers-with-arangodb-3-1/){:target="_blank"}:
  In addition to JSON, the binary storage format VelocyPack can now also be
  used in transport over the HTTP protocol, as well as streamed using the new
  bi-directional asynchronous binary protocol **VelocyStream**.

**Enterprise Edition**

- [**SmartGraphs**](graphs-smart-graphs.html): Scale with graphs to a
  cluster and stay performant. With SmartGraphs you can use the "smartness"
  of your application layer to shard your graph efficiently to your machines
  and let traversals run locally.

- **Encryption Control**: Choose your level of [SSL encryption](programs-arangod-options.html#ssl)

- [**Auditing**](security-auditing.html): Keep a detailed log
  of all the important things that happened in ArangoDB.

Also see [What's New in 3.1](release-notes-new-features31.html).

## Version 3.0

- [**self-organizing cluster**](architecture-deployment-modes-cluster-architecture.html) with
  synchronous replication, master/master setup, shared nothing
  architecture, cluster management Agency.

- Deeply integrated, native [**AQL graph traversal**](aql/graphs.html)

- [**VelocyPack**](https://github.com/arangodb/velocypack){:target="_blank"} as new internal
  binary storage format as well as for intermediate AQL values.

- [**Persistent indexes**](indexing-persistent.html) via RocksDB suitable
  for sorting and range queries.

- [**Foxx 3.0**](foxx.html): overhauled JS framework for data-centric
  microservices

- Significantly improved [**Web Interface**](programs-web-interface.html)

Also see [What's New in 3.0](release-notes-new-features30.html).
