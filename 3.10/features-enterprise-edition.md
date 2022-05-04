---
layout: default
---
# Enterprise Edition Features

<https://www.arangodb.com/enterprise-server/>

The Enterprise Edition has all the features of the Community Edition and the
following on top:

## Performance

- **Pregel in Cluster**:
  Distributed iterative graph analytics for cluster deployments.

- **SmartGraphs**:
  Value-based sharding of large graph datasets for better data locality when
  traversing graphs.

- **Hybrid SmartGraphs**:
  Collections replicated on all cluster nodes can be combined with graphs
  sharded by document attributes to enable more local execution of graph queries.

- **SatelliteGraphs**:
  Graphs replicated on all cluster nodes to execute graph traversals locally.

- **SatelliteCollections**:
  Collections replicated on all cluster nodes to execute joins with sharded
  data locally.

- **SmartJoins**:
  Co-located joins in a cluster using identically sharded collections.

- **OneShard**:
  Option to store all collections of a database on a single cluster node, to
  combine the performance of a single server and ACID semantics with a
  fault-tolerant cluster setup.

- **Traversal Parallelization**
  Parallel execution of traversal queries in single server and OneShard
  deployments.

## Security

- **DC2DC**:
  Datacenter to Datacenter Replication for disaster recovery.

- **Auditing**:
  Audit log of all server interactions.

- **LDAP Authentication**:
  ArangoDB user authentication with an LDAP server.

- **Encryption at Rest**:
  Hardware-accelerated on-disk encryption for your data.

- **Encrypted Backups**:
  Data dumps can be encrypted using a strong 256-bit AES block cipher.

- **Hot Backups**:
  Incremental data backups without downtime for single servers and clusters.

- **Enhanced Data Masking**:
  Extended data masking capabilities for attributes containing sensitive data
  / PII when creating backups.

- **Advanced Encryption Configuration**:
  Key rotation for super-user JWT tokens, TLS certificates, and on-disk
  encryption.
