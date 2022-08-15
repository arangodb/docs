---
layout: default
---
# Features and Capabilities

ArangoDB is a NoSQL graph database for online transactional processing (OLTP)
as well as analytical workloads, with a rich ecosystem of projects, integrations,
and drivers
{:class="lead"}

## Editions

ArangoDB is freely available in a **Community Edition** under the Apache 2.0
open-source license. It is a fully-featured version without time or size
restrictions and includes cluster support.

ArangoDB is also available in a commercial version, called the
**Enterprise Edition**. It includes additional features for performance and
security, such as for scaling graphs and managing your data safely.

|     Community     ||     Enterprise     |
|-------------------||--------------------|
| ✔ Open source under a permissive license || ✔ Includes all Community Edition features |
| ✔ One database core for all graph, document, key-value, and search needs || ✔ Performance options to smartly shard and replicate graphs and datasets for optimal data locality |
| ✔ A single composable query language for all data models || ✔ Multi-tenant deployment option for the transactional guarantees and performance of a single server |
| ✔ Extensible through microservices with custom REST APIs and user-definable query functions || ✔ Enhanced data security with on-disk and backup encryption, key rotation, audit logging, and LDAP authentication |
| ✔ Cluster deployments for high availability and resilience || ✔ Incremental backups without downtime and off-site replication
| See all [Community Edition Features](features-community-edition.html) || See all [Enterprise Edition Features](features-enterprise-edition.html) |

## On-Premise versus Cloud

You can install ArangoDB on your local machine or run it in a Docker container
for development purposes. You can deploy it on-premise as a
[single server](architecture-deployment-modes-single-instance.html), optionally
as a resilient pair with asynchronous replication and automatic failover
([Active Failover](architecture-deployment-modes-active-failover-architecture.html)),
or as a [cluster](architecture-deployment-modes-cluster-architecture.html)
comprised of multiple nodes with synchronous replication and automatic failover
for high availability and resilience. For the highest level of data safety,
you can additionally set up off-site replication for your entire cluster
([Datacenter-to-Datacenter Replication](arangosync.html)).

If you do not want to operate your own ArangoDB instances on-premise, then
you may use our fully managed multi-cloud service **ArangoDB Oasis**.
It runs the Enterprise Edition of ArangoDB, lets you deploy clusters with a
few clicks, and is operated by a dedicated team of ArangoDB engineers day and
night. To learn more, go to <https://cloud.arangodb.com/>{:target="_blank"}.
