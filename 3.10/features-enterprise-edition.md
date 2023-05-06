---
layout: default
description: >-
  The commercial version of ArangoDB offers performance, compliance, and
  security features for larger or more sensitive datasets, as well as additional
  query capabilities
---
# Enterprise Edition Features

{{ page.description }}
{:class="lead"}

The Enterprise Edition has all the features of the
[Community Edition](features-community-edition.html) and, on top of that, the
features outlined below. For additional information, see
[arangodb.com/enterprise-server/](https://www.arangodb.com/enterprise-server/){:target="_blank"}.

## Performance

- [**SmartGraphs**](graphs-smart-graphs.html):
  Value-based sharding of large graph datasets for better data locality when
  traversing graphs.

- [**EnterpriseGraphs**](graphs-enterprise-graphs.html):
  A specialized version of SmartGraphs, with an automatic sharding key selection.

- [**SmartGraphs using SatelliteCollections**](graphs-smart-graphs.html):
  Collections replicated on all cluster nodes can be combined with graphs
  sharded by document attributes to enable more local execution of graph queries.

- [**SatelliteGraphs**](graphs-satellite-graphs.html):
  Graphs replicated on all cluster nodes to execute graph traversals locally.

- [**SatelliteCollections**](satellites.html):
  Collections replicated on all cluster nodes to execute joins with sharded
  data locally.

- [**SmartJoins**](smartjoins.html):
  Co-located joins in a cluster using identically sharded collections.

- [**OneShard**](deployment-oneshard.html):
  Option to store all collections of a database on a single cluster node, to
  combine the performance of a single server and ACID semantics with a
  fault-tolerant cluster setup.

- [**Traversal**](release-notes-new-features37.html#traversal-parallelization-enterprise-edition)
  [**Parallelization**](release-notes-new-features310.html#parallelism-for-sharded-graphs-enterprise-edition):
  Parallel execution of traversal queries with many start vertices, leading to
  faster results.

- [**Traversal Projections**](release-notes-new-features310.html#traversal-projections-enterprise-edition):
  Optimized data loading for AQL traversal queries if only a few document
  attributes are accessed.

- [**Parallel index creation**](release-notes-new-features310.html#parallel-index-creation-enterprise-edition):
  Non-unique indexes can be created with multiple threads in parallel.

- [**`minhash` Analyzer**](analyzers.html#minhash):
  Jaccard similarity approximation for entity resolution, such as for finding
  duplicate records, based on how many elements they have in common

- [**`geo_s2` Analyzer**](analyzers.html#geo_s2):
  Efficiently index geo-spatial data using different binary formats, tuning the
  size on disk, the precision, and query performance.

- [**ArangoSearch column cache**](release-notes-new-features310.html#arangosearch-column-cache-enterprise-edition):
  Always cache field normalization values, Geo Analyzer auxiliary data,
  stored values, primary sort columns, and primary key columns in memory to
  improve the performance of Views and inverted indexes.

## Querying

- [**Pregel in Cluster**](graphs-pregel.html#prerequisites):
  Distributed iterative graph analytics for cluster deployments.

- [**Search highlighting**](arangosearch-search-highlighting.html):
  Get the substring positions of matched terms, phrases, or _n_-grams.

- [**Nested search**](arangosearch-nested-search.html):
  Match arrays of objects with all the conditions met by a single sub-object,
  and define for how many of the elements this must be true.

{% comment %} Experimental feature
- **[`classification`](analyzers.html#classification) and [`nearest_neighbors` Analyzers](analyzers.html#nearest_neighbors)**:
  Classification of text tokens and finding similar tokens using supervised
  fastText word embedding models.
{% endcomment %}

- [**Skip inaccessible collections**](aql/invocation-with-arangosh.html#skipinaccessiblecollections):
  Let AQL queries like graph traversals pretend that collections are empty if
  the user has no access to them instead of failing the query.

## Security

- [**DC2DC**](arangosync.html):
  Datacenter-to-Datacenter Replication for disaster recovery.

- [**Auditing**](security-auditing.html):
  Audit logs of all server interactions.

- [**LDAP Authentication**](programs-arangod-ldap.html):
  ArangoDB user authentication with an LDAP server.

- [**Encryption at Rest**](security-encryption.html):
  Hardware-accelerated on-disk encryption for your data.

- [**Encrypted Backups**](programs-arangodump-examples.html#encryption):
  Data dumps can be encrypted using a strong 256-bit AES block cipher.

- [**Hot Backups**](backup-restore.html#hot-backups):
  Consistent, incremental data backups without downtime for single servers and clusters.

- [**Enhanced Data Masking**](programs-arangodump-maskings.html#masking-functions):
  Extended data masking capabilities for attributes containing sensitive data
  / PII when creating backups.

- **Advanced Encryption and Security Configuration**:
  Key rotation for [JWT secrets](http/authentication.html#hot-reload-jwt-secrets)
  and [on-disk encryption](http/security.html#encryption-at-rest),
  as well as [Server Name Indication (SNI)](programs-arangod-options.html#--sslserver-name-indication).
