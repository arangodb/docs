---
layout: default
description: This chapter describes various possibilities to deploy ArangoDB.
title: ArangoDB Deployment
---
# Deployment options

This chapter describes various possibilities to deploy ArangoDB.

For installation instructions, please refer to the [Installation](installation.html) _Chapter_.

For _production_ deployments, please also carefully check the
[ArangoDB Production Checklist](deployment-production-checklist.html).

Also check the description of
[Single Instance vs. Cluster](architecture-single-instance-vs-cluster.html).

## By ArangoDB _Deployment Mode_

ArangoDB can be deployed in different configurations, depending on your needs.

- [Single instance](architecture-deployment-modes-single-instance.html)
- [Active Failover](architecture-deployment-modes-active-failover.html)
- [Cluster](deployment-cluster.html)
- [Multiple Datacenters](deployment-dc2dc.html) 
- [Standalone Agency](deployment-standalone-agency.html) 

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

### Deploy using the ArangoDB Starter

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
- [ArangoGraph Insights Platform](https://cloud.arangodb.com/home?utm_source=docs&utm_medium=cluster_pages&utm_campaign=docs_traffic){:target="_blank"},
  fully managed, available on AWS, Azure & GCP

### Kubernetes

- [ArangoDB Kubernetes Operator](deployment-kubernetes.html)