---
layout: default
description: >-
  An overview of ArangoDB's deployment modes
---
# Architecture

{{ page.description }}
{:class="lead"}

## Deployment modes

ArangoDB supports many resilient deployment modes to meet the exact needs of
your project. 

### Single Instance

A [Single Instance deployment](architecture-deployment-modes-single-instance.html)
is the most simple way
to get started. Unlike other setups, which require some specific procedures,
deploying a stand-alone instance is straightforward and can be started manually
or by using the ArangoDB Starter tool.   

### Active Failover

[Active Failover deployments](architecture-deployment-modes-active-failover.html)
use ArangoDB's
multi-node technology to provide high availability for smaller projects with
fast asynchronous replication from the leading node to multiple replicas.
If the leader fails, then a replicant takes over seamlessly.

### Cluster

[Cluster deployments](architecture-deployment-modes-cluster-architecture.html)
are designed for large scale
operations and analytics, allowing you to scale elastically with your
applications and data models. ArangoDB's synchronously-replicating cluster
technology runs on premises, on Kubernetes, and in the cloud on ArangoGraph - 
ArangoDB's fully managed service. 

Clustering ArangoDB not only delivers better performance and capacity improvements,
but it also provides resilience through replication and automatic failover.
You can deploy systems that dynamically scale up and down according to demand.

### Multiple Datacenters

With ArangoDB's [multi-datacenter](arangosync.html) support, you can replicate
your data to any other datacenter. The leading datacenter asynchronously
replicates to any number of following datacenters for optimal write performance.
