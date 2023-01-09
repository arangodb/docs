---
fileID: architecture-deployment-modes
title: Deployments
weight: 770
description: >-
  This chapter describes various possibilities to deploy ArangoDB
layout: default
---
ArangoDB supports many resilient deployment modes to meet the exact needs of
your project. 

For installation instructions, please refer to the [Installation](../installation/) _Chapter_.

For _production_ deployments, please also carefully check the
[ArangoDB Production Checklist](deployment-production-checklist).

## By ArangoDB _Deployment Mode_

ArangoDB can be deployed in different configurations, depending on your needs.

### Single Instance

A [Single Instance deployment](single-instance/)
is the most simple way
to get started. Unlike other setups, which require some specific procedures,
deploying a stand-alone instance is straightforward and can be started manually
or by using the ArangoDB Starter tool.   

### Active Failover

[Active Failover deployments](active-failover/)
use ArangoDB's
multi-node technology to provide high availability for smaller projects with
fast asynchronous replication from the leading node to multiple replicas.
If the leader fails, then a replicant takes over seamlessly.

### Cluster

[Cluster deployments](cluster/)
are designed for large scale
operations and analytics, allowing you to scale elastically with your
applications and data models. ArangoDB's synchronously-replicating cluster
technology runs on premises, on Kubernetes, and in the cloud on ArangoGraph - 
ArangoDB's fully managed service. 

Clustering ArangoDB not only delivers better performance and capacity improvements,
but it also provides resilience through replication and automatic failover.
You can deploy systems that dynamically scale up and down according to demand.

### Datacenter-to-Datacenter

With ArangoDB's [Datacenter-to-Datacenter](../arangosync/) support, you can replicate
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
[ArangoGraph Platform](https://cloud.arangodb.com) offers a 
fully managed cloud service, available on AWS, Microsoft Azure, and Google Cloud Platform.

### Manual Deployment

**Single Instance:**

- [Manually created processes](single-instance/deployment-single-instance-manual-start)
- [Manually created Docker containers](single-instance/deployment-single-instance-manual-start#manual-start-in-docker)

**Active Failover:**

- [Manually created processes](active-failover/deployment-active-failover-manual-start)
- [Manually created Docker containers](active-failover/deployment-active-failover-manual-start#manual-start-in-docker)

**Cluster:**

- [Manually created processes](cluster/deployment/deployment-cluster-manual-start)
- [Manually created Docker containers](cluster/deployment/deployment-cluster-manual-start#manual-start-in-docker)

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
[GitHub releases page](https://github.com/arangodb-helper/arangodb/releases).

**Single Instance:**

- [_Starter_ using processes](single-instance/deployment-single-instance-using-the-starter)
- [_Starter_ using Docker containers](single-instance/deployment-single-instance-using-the-starter#using-the-arangodb-starter-in-docker)

**Active Failover:**

- [_Starter_ using processes](active-failover/deployment-active-failover-using-the-starter)
- [_Starter_ using Docker containers](active-failover/deployment-active-failover-using-the-starter#using-the-arangodb-starter-in-docker)

**Cluster:**

- [_Starter_ using processes](cluster/deployment/deployment-cluster-using-the-starter)
- [_Starter_ using Docker containers](cluster/deployment/deployment-cluster-using-the-starter#using-the-arangodb-starter-in-docker)


### In the _Cloud_

- [AWS and Azure](deployment-cloud)
- [ArangoGraph Insights Platform](https://cloud.arangodb.com),
  fully managed, available on AWS, Azure & GCP

### Kubernetes

- [ArangoDB Kubernetes Operator](kubernetes/)