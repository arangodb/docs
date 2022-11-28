---
fileID: features-enterprise-edition
title: Enterprise Edition Features
weight: 25
description: >-
  The commercial version of ArangoDB offers performance, compliance, and
  security features for larger or more sensitive datasets, as well as additional
  query capabilities
layout: default
---
The Enterprise Edition has all the features of the
[Community Edition](features-community-edition) and, on top of that, the
features outlined below. For additional information, see
[arangodb.com/enterprise-server/](https://www.arangodb.com/enterprise-server/).

## Performance

- [**SmartGraphs**](../../graphs/smartgraphs/):
  Value-based sharding of large graph datasets for better data locality when
  traversing graphs.

- [**EnterpriseGraphs**](../../graphs/enterprisegraphs/):
  A specialized version of SmartGraphs, with an automatic sharding key selection.

- [**SmartGraphs using SatelliteCollections**](../../graphs/smartgraphs/):
  Collections replicated on all cluster nodes can be combined with graphs
  sharded by document attributes to enable more local execution of graph queries.

- [**SatelliteGraphs**](../../graphs/satellitegraphs/):
  Graphs replicated on all cluster nodes to execute graph traversals locally.

- [**SatelliteCollections**](../../satellites/):
  Collections replicated on all cluster nodes to execute joins with sharded
  data locally.

- [**SmartJoins**](../../smartjoins/):
  Co-located joins in a cluster using identically sharded collections.

- [**OneShard**](../../architecture/arangodb-deployment-modes/cluster/architecture-deployment-modes-cluster-architecture#oneshard):
  Option to store all collections of a database on a single cluster node, to
  combine the performance of a single server and ACID semantics with a
  fault-tolerant cluster setup.

- [**Traversal**](../../release-notes/version-3.7/release-notes-new-features37#traversal-parallelization-enterprise-edition)
  [**Parallelization**](../../release-notes/version-3.10/release-notes-new-features310#parallelism-for-sharded-graphs-enterprise-edition):
  Parallel execution of traversal queries with many start vertices, leading to
  faster results.

- [**Traversal Projections**](../../release-notes/version-3.10/release-notes-new-features310#traversal-projections-enterprise-edition):
  Optimized data loading for AQL traversal queries if only a few document
  attributes are accessed.

- [**Parallel index creation**](../../release-notes/version-3.10/release-notes-new-features310#parallel-index-creation-enterprise-edition):
  Non-unique indexes can be created with multiple threads in parallel.

- [**`minhash` Analyzer**](../../analyzers/#minhash):
  Jaccard similarity approximation for entity resolution, such as for finding
  duplicate records, based on how many elements they have in common

## Querying

- [**Pregel in Cluster**](../../data-science/pregel/#prerequisites):
  Distributed iterative graph analytics for cluster deployments.

- [**Search highlighting**](../../indexing/arangosearch/arangosearch-search-highlighting):
  Get the substring positions of matched terms, phrases, or _n_-grams.

- [**Nested search**](../../indexing/arangosearch/arangosearch-nested-search):
  Match arrays of objects with all the conditions met by a single sub-object,
  and define for how many of the elements this must be true.

{{% comment %}} Experimental feature
- **[`classification`](../../analyzers/#classification) and [`nearest_neighbors` Analyzers](../../analyzers/#nearest_neighbors)**:
  Classification of text tokens and finding similar tokens using supervised
  fastText word embedding models.
{{% /comment %}}

- [**Skip inaccessible collections**](../../aql/how-to-invoke-aql/invocation-with-arangosh#setting-options):
  Let AQL queries like graph traversals pretend that collections are empty if
  the user has no access to them instead of failing the query.

## Security

- [**DC2DC**](../../arangosync/):
  Datacenter-to-Datacenter Replication for disaster recovery.

- [**Auditing**](../../security/auditing/):
  Audit log of all server interactions.

- [**LDAP Authentication**](../../programs-tools/arangodb-server/options/programs-arangod-ldap):
  ArangoDB user authentication with an LDAP server.

- [**Encryption at Rest**](../../security/security-encryption):
  Hardware-accelerated on-disk encryption for your data.

- [**Encrypted Backups**](../../programs-tools/arangodump/programs-arangodump-examples#encryption):
  Data dumps can be encrypted using a strong 256-bit AES block cipher.

- [**Hot Backups**](../../backup-restore/#hot-backups):
  Consistent, incremental data backups without downtime for single servers and clusters.

- [**Enhanced Data Masking**](../../programs-tools/arangodump/programs-arangodump-maskings#masking-functions):
  Extended data masking capabilities for attributes containing sensitive data
  / PII when creating backups.

- **Advanced Encryption and Security Configuration**:
  Key rotation for [JWT secrets](../../http/general#hot-reload-of-jwt-secrets)
  and [on-disk encryption](../../http/administration-monitoring/#encryption-at-rest),
  as well as [Server Name Indication (SNI)](../../programs-tools/arangodb-server/options/programs-arangod-ssl#server-name-indication-sni).
