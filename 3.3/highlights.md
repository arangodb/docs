---
layout: default
description: Datacenter to Datacenter Replication
---
Highlights
==========

Version 3.3
-----------

### Enterprise Edition

- [**Datacenter to Datacenter Replication**](deployment-dc2-dc.html): Replicate
  the entire structure and content of an ArangoDB cluster asynchronously to
  another cluster in a different datacenter with ArangoSync. Multi-datacenter
  support means you can fallback to a replica of your cluster in case of a
  disaster in one datacenter.

- [**Encrypted Backups**](administration-arangodump.html#encryption):
  Arangodump can create backups encrypted with a secret key using AES256
  block cipher.

### All Editions

- [**Server-level Replication**](administration-replication-asynchronous-server-level-setup.html):
  In addition to per-database replication, there is now an additional
  `globalApplier`. Start the global replication on the slave once and all
  current and future databases will be replicated from the master to the
  slave automatically.

- [**Asynchronous Failover**](release-notes-new-features33.html#asynchronous-failover):
  Make a single server instance resilient with a second server instance, one
  as master and the other as asynchronously replicating slave, with automatic
  failover to the slave if the master goes down.

Also see [What's New in 3.3](release-notes-new-features33.html).

Version 3.2
-----------

- [**RocksDB Storage Engine**](architecture-storage-engines.html): You can now use
  as much data in ArangoDB as you can fit on your disk. Plus, you can enjoy
  performance boosts on writes by having only document-level locks

- [**Pregel**](graphs-pregel.html):
  We implemented distributed graph processing with Pregel to discover hidden
  patterns, identify communities and perform in-depth analytics of large graph
  data sets.

- [**Fault-Tolerant Foxx**](http/foxx.html): The Foxx management
  internals have been rewritten from the ground up to make sure
  multi-coordinator cluster setups always keep their services in sync and
  new coordinators are fully initialized even when all existing coordinators
  are unavailable.

- **Enterprise**: Working with some of our largest customers, we’ve added
  further security and scalability features to ArangoDB Enterprise like
  [LDAP integration](administration-configuration-ldap.html),
  [Encryption at Rest](administration-encryption.html), and the brand new
  [SatelliteCollections](administration-replication-synchronous-satellites.html).

Also see [What's New in 3.2](release-notes-new-features32.html).

Version 3.1
-----------

- [**SmartGraphs**](graphs-smart-graphs.html): Scale with graphs to a
  cluster and stay performant. With SmartGraphs you can use the "smartness"
  of your application layer to shard your graph efficiently to your machines
  and let traversals run locally.

- **Encryption Control**: Choose your level of [SSL encryption](administration-configuration-ssl.html)

- [**Auditing**](administration-auditing.html): Keep a detailed log
  of all the important things that happened in ArangoDB.

Also see [What's New in 3.1](release-notes-new-features31.html).

Version 3.0
-----------

- [**self-organizing cluster**](scalability-architecture.html) with
  synchronous replication, master/master setup, shared nothing
  architecture, cluster management agency.

- Deeply integrated, native [**AQL graph traversal**](aql/graphs.html)

- [**VelocyPack**](https://github.com/arangodb/velocypack){:target="_blank"} as new internal
  binary storage format as well as for intermediate AQL values.

- [**Persistent indexes**](indexing-persistent.html) via RocksDB suitable
  for sorting and range queries.

- [**Foxx 3.0**](foxx.html): overhauled JS framework for data-centric
  microservices

- Significantly improved [**Web Interface**](administration-web-interface.html)
  
Also see [What's New in 3.0](release-notes-new-features30.html).
