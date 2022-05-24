---
layout: default
description: >-
  The commercial version of ArangoDB offers performance, compliance, and
  security features for larger or more sensitive datasets
---
# Enterprise Edition Features

{{ page.description }}
{:class="lead"}

The Enterprise Edition has all the features of the
[Community Edition](features-community-edition.html) and, on top of that, the
features outlined below. For additional information, see
<https://www.arangodb.com/enterprise-server/>{:target="_blank"}.

## Performance

- **[Pregel in Cluster](graphs-pregel.html#prerequisites)**:
  Distributed iterative graph analytics for cluster deployments.

- [**SmartGraphs**](graphs-smart-graphs.html):
  Value-based sharding of large graph datasets for better data locality when
  traversing graphs.

- [**Hybrid SmartGraphs**](graphs-smart-graphs.html#benefits-of-hybrid-smartgraphs):
  Collections replicated on all cluster nodes can be combined with graphs
  sharded by document attributes to enable more local execution of graph queries.

- [**SatelliteGraphs**](graphs-satellite-graphs.html):
  Graphs replicated on all cluster nodes to execute graph traversals locally.

- [**SatelliteCollections**](satellites.html):
  Collections replicated on all cluster nodes to execute joins with sharded
  data locally.

- [**SmartJoins**](smartjoins.html):
  Co-located joins in a cluster using identically sharded collections.

- [**OneShard**](architecture-deployment-modes-cluster-architecture.html#oneshard):
  Option to store all collections of a database on a single cluster node, to
  combine the performance of a single server and ACID semantics with a
  fault-tolerant cluster setup.

- [**Traversal Parallelization**](release-notes-new-features37.html#traversal-parallelization-enterprise-edition):
  Parallel execution of traversal queries in single server and OneShard
  deployments.

## Security

- [**DC2DC**](architecture-deployment-modes-dc2-dc-introduction.html):
  Datacenter to Datacenter Replication for disaster recovery.

- [**Auditing**](security-auditing.html):
  Audit log of all server interactions.

- [**LDAP Authentication**]():
  ArangoDB user authentication with an LDAP server.

- [**Encryption at Rest**](security-encryption.html):
  Hardware-accelerated on-disk encryption for your data.

- [**Encrypted Backups**]():
  Data dumps can be encrypted using a strong 256-bit AES block cipher.

- [**Hot Backups**](backup-restore.html#hot-backups):
  Incremental data backups without downtime for single servers and clusters.

- [**Enhanced Data Masking**]():
  Extended data masking capabilities for attributes containing sensitive data
  / PII when creating backups.

- **Advanced Encryption and Security Configuration**:
  Key rotation for [JWT secrets](http/general.html#hot-reload-of-jwt-secrets)
  and [on-disk encryption](http/administration-and-monitoring.html#encryption-at-rest),
  as well as [Server Name Indication (SNI)](programs-arangod-ssl.html#server-name-indication-sni).
