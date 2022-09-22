---
layout: default
description: >-
  ArangoDB is a graph database with a powerful set of features for data management and analytics, 
  supported by a rich ecosystem of integrations and drivers
---
# Features and Capabilities

{{ page.description }}
{:class="lead"}

## Editions

### Community Edition

ArangoDB is freely available in a **Community Edition** under the Apache 2.0
open-source license. It is a fully-featured version without time or size
restrictions and includes cluster support.

- Open source under a permissive license
- One database core for all graph, document, key-value, and search needs
- A single composable query language for all data models
- Extensible through microservices with custom REST APIs and user-definable
  query functions
- Cluster deployments for high availability and resilience

See all [Community Edition Features](features-community-edition.html).

### Enterprise Edition

ArangoDB is also available in a commercial version, called the
**Enterprise Edition**. It includes additional features for performance and
security, such as for scaling graphs and managing your data safely.

- Includes all Community Edition features
- Performance options to smartly shard and replicate graphs and datasets for
  optimal data locality
- Multi-tenant deployment option for the transactional guarantees and
  performance of a single server
- Enhanced data security with on-disk and backup encryption, key rotation,
  audit logging, and LDAP authentication
- Incremental backups without downtime and off-site replication

See all [Enterprise Edition Features](features-enterprise-edition.html).

### Differences between the Editions

| Community Edition | Enterprise Edition |
|-------------------|--------------------|
| Apache 2.0 License | Commercial License |
| Sharding using consistent hashing on the default or custom shard keys | In addition, **smart sharding** for improved data locality |
| Only hash-based graph sharding | **SmartGraphs** to intelligently shard large graph datasets and **EnterpriseGraphs** with an automatic sharding key selection |
| Only regular collection replication without data locality optimizations | **SatelliteCollections** to replicate collections on all cluster nodes and data locality optimizations for queries |
| No optimizations when querying sharded graphs and replicated collections together | **SmartGraphs using SatelliteCollections** to enable more local execution of graph queries |
| Only regular graph replication without local execution optimizations | **SatelliteGraphs** to execute graph traversals locally on a cluster node |
| Collections can be sharded alike but joins do not utilize co-location | **SmartJoins** for co-located joins in a cluster using identically sharded collections |
| Graph traversals without parallel execution | **Parallel execution of traversal queries** with many start vertices |
| Graph traversals always load full documents | **Traversal projections** optimize the data loading of AQL traversal queries if only a few document attributes are accessed |
| Iterative graph processing (Pregel) for single servers | **Pregel graph processing for clusters** and single servers |
| Inverted indexes and Views without support for search highlighting and nested search | **Search highlighting** for getting the substring positions of matches and **nested search** for matching arrays with all the conditions met by a single object |
| Only standard Jaccard index calculation | **Jaccard similarity approximation** with MinHash for entity resolution, such as for finding duplicate records, based on how many common elements they have |
{%- comment %} Experimental feature
| No fastText model support | Classification of text tokens and finding similar tokens using supervised **fastText word embedding models** |
{%- endcomment %}
| Only regular cluster deployments | **OneShard** deployment option to store all collections of a database on a single cluster node, to combine the performance of a single server and ACID semantics with a fault-tolerant cluster setup |
| ACID transactions for multi-document / multi-collection queries on single servers, for single document operations in clusters, and for multi-document queries in clusters for collections with a single shard | In addition, ACID transactions for multi-collection queries using the OneShard feature |
| TLS key and certificate rotation | In addition, **key rotation for JWT secrets** and **server name indication** (SNI) |
| Built-in user management and authentication | Additional **LDAP authentication** option |
| Only server logs | **Audit log** of server interactions |
| No on-disk encryption | **Encryption at Rest** with hardware-accelerated on-disk encryption and key rotation |
| Only regular backups | **Datacenter-to-Datacenter Replication** for disaster recovery |
| Only unencrypted backups and basic data masking for backups | **Hot Backups**, **encrypted backups**, and **enhanced data masking** for backups |

## On-Premises versus Cloud

You can install ArangoDB on your local machine or run it in a Docker container
for development purposes. You can deploy it on-premises as a
[single server](architecture-deployment-modes-single-instance.html), optionally
as a resilient pair with asynchronous replication and automatic failover
([Active Failover](architecture-deployment-modes-active-failover-architecture.html)),
or as a [cluster](architecture-deployment-modes-cluster-architecture.html)
comprised of multiple nodes with synchronous replication and automatic failover
for high availability and resilience. For the highest level of data safety,
you can additionally set up off-site replication for your entire cluster
([Datacenter-to-Datacenter Replication](arangosync.html)).

If you do not want to operate your own ArangoDB instances on-premises, then
you may use our fully managed multi-cloud service **ArangoDB Oasis**.
It runs the Enterprise Edition of ArangoDB, lets you deploy clusters with a
few clicks, and is operated by a dedicated team of ArangoDB engineers day and
night. To learn more, go to [cloud.arangodb.com](https://cloud.arangodb.com/){:target="_blank"}.
