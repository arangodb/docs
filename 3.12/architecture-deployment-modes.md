---
layout: default
description: >-
  This chapter describes various possibilities to deploy ArangoDB
---
# Deployments

{{ page.description }}
{:class="lead"}

ArangoDB supports many resilient deployment modes to meet the exact needs of
your project. 

For installation instructions, please refer to the [Installation](installation.html) _Chapter_.

For _production_ deployments, please also carefully check the
[ArangoDB Production Checklist](deployment-production-checklist.html).

## By ArangoDB _Deployment Mode_

ArangoDB can be deployed in different configurations, depending on your needs.

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

### Datacenter-to-Datacenter

With ArangoDB's [Datacenter-to-Datacenter](arangosync.html) support, you can replicate
your data to any other datacenter. The leading datacenter asynchronously
replicates to any number of following datacenters for optimal write performance.

## By _Technology_

There are different ways that can be used to deploy an environment. You can
manually start all the needed processes localy or in Docker containers. 
Or use the ArangoDB _Starter_, the _arangodb_ binary program, for
local setups using processes or Docker containers.

If you want to deploy in your Kubernetes cluster, you can use the ArangoDB
Kubernetes Operator (`kube-arangodb`).

The fastest way to get ArangoDB up and running is to run it in the cloud - the
[ArangoGraph Platform](https://cloud.arangodb.com){:target="_blank"} offers a 
fully managed cloud service, available on AWS, Microsoft Azure, and Google Cloud Platform.

### Manual Deployment

**Single Instance:**

- [Manually created processes](deployment-single-instance-manual-start.html)
- [Manually created Docker containers](deployment-single-instance-manual-start.html#manual-start-in-docker)

**Active Failover:**

- [Manually created processes](deployment-active-failover-manual-start.html)
- [Manually created Docker containers](deployment-active-failover-manual-start.html#manual-start-in-docker)

**Cluster:**

- [Manually created processes](deployment-cluster-manual-start.html)
- [Manually created Docker containers](deployment-cluster-manual-start.html#manual-start-in-docker)

### Deploying using the ArangoDB Starter

Setting up an ArangoDB cluster, for example, involves starting various nodes
with different roles (Agents, DB-Servers, and Coordinators). The starter
simplifies this process.

The Starter supports different deployment modes (single server, Active Failover,
cluster) and it can either use Docker containers or processes (using the
`arangod` executable).

Besides starting and maintaining ArangoDB deployments, the Starter also provides
various commands to create TLS certificates and JWT token secrets to secure your
ArangoDB deployments.

The ArangoDB Starter is an executable called `arangodb` and comes with all
current distributions of ArangoDB.

If you want a specific version, download the precompiled executable via the
[GitHub releases page](https://github.com/arangodb-helper/arangodb/releases){:target="_blank"}.

**Single Instance:**

- [_Starter_ using processes](deployment-single-instance-using-the-starter.html)
- [_Starter_ using Docker containers](deployment-single-instance-using-the-starter.html#using-the-arangodb-starter-in-docker)

**Active Failover:**

- [_Starter_ using processes](deployment-active-failover-using-the-starter.html)
- [_Starter_ using Docker containers](deployment-active-failover-using-the-starter.html#using-the-arangodb-starter-in-docker)

**Cluster:**

- [_Starter_ using processes](deployment-cluster-using-the-starter.html)
- [_Starter_ using Docker containers](deployment-cluster-using-the-starter.html#using-the-arangodb-starter-in-docker)


### In the _Cloud_

- [AWS and Azure](deployment-cloud.html)
- [ArangoGraph Insights Platform](https://cloud.arangodb.com){:target="_blank"},
  fully managed, available on AWS, Azure & GCP

### Kubernetes

- [ArangoDB Kubernetes Operator](deployment-kubernetes.html)