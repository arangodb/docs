---
layout: default
description: RocksDB Storage Engine
---
Highlights
==========

Version 3.2
-----------

- [**RocksDB Storage Engine**](architecture-storageengines.html): You can now use
  as much data in ArangoDB as you can fit on your disk. Plus, you can enjoy
  performance boosts on writes by having only document-level locks

- [**Pregel**](graphs-pregel.html):
  We implemented distributed graph processing with Pregel to discover hidden
  patterns, identify communities and perform in-depth analytics of large graph
  data sets.

- [**Fault-Tolerant Foxx**](../http/foxx.html): The Foxx management
  internals have been rewritten from the ground up to make sure
  multi-coordinator cluster setups always keep their services in sync and
  new coordinators are fully initialized even when all existing coordinators
  are unavailable.

- **Enterprise**: Working with some of our largest customers, we’ve added
  further security and scalability features to ArangoDB Enterprise like
  [LDAP integration](administration-configuration-ldap.html),
  [Encryption at Rest](administration-encryption.html), and the brand new
  [Satellite Collections](administration-replication-synchronous-satellites.html).

Also see [What's New in 3.2](releasenotes-newfeatures32.html).

Version 3.1
-----------

- [**SmartGraphs**](graphs-smartgraphs.html): Scale with graphs to a
  cluster and stay performant. With SmartGraphs you can use the "smartness"
  of your application layer to shard your graph efficiently to your machines
  and let traversals run locally.

- **Encryption Control**: Choose your level of [SSL encryption](administration-configuration-ssl.html)

- [**Auditing**](administration-auditing.html): Keep a detailed log
  of all the important things that happened in ArangoDB.

Also see [What's New in 3.1](releasenotes-newfeatures31.html).

Version 3.0
-----------

- [**self-organizing cluster**](scalability-architecture.html) with
  synchronous replication, master/master setup, shared nothing
  architecture, cluster management agency.

- Deeply integrated, native [**AQL graph traversal**](../aql/graphs.html)

- [**VelocyPack**](https://github.com/arangodb/velocypack){:target="_blank"} as new internal
  binary storage format as well as for intermediate AQL values.

- [**Persistent indexes**](indexing-persistent.html) via RocksDB suitable
  for sorting and range queries.

- [**Foxx 3.0**](foxx.html): overhauled JS framework for data-centric
  microservices

- Significantly improved [**Web Interface**](administration-webinterface.html)
  
Also see [What's New in 3.0](releasenotes-newfeatures30.html).
