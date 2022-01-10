---
layout: default
description: In this chapter we describe various possibilities to deploy ArangoDB
---
Deployment
==========

In this chapter we describe various possibilities to deploy ArangoDB.
In particular for the cluster mode, there are different ways
and we want to highlight their advantages and disadvantages.
We even document in detail, how to set up a cluster by simply starting
various ArangoDB processes on different machines, either directly
or using Docker containers.

- [Single Instance](deployment-single.html)
- [Single Instance vs. Cluster](architecture-single-instance-vs-cluster.html)
- [Cluster](deployment-cluster.html)
  - [Generic & Docker](deployment-arango-dbstarter.html)
  - [Advanced Topics](deployment-advanced.html)
    - [Standalone Agency](deployment-agency.html)
    - [Test setup on a local machine](deployment-local.html)
    - [Starting processes on different machines](deployment-distributed.html)
    - [Launching an ArangoDB cluster using Docker containers](deployment-docker.html)
- [Multiple Datacenters](deployment-dc2-dc.html)
