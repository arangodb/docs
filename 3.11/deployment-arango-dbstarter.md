---
layout: default
description: >-
  The ArangoDB Starter is designed to make it easy to start and maintain
  ArangoDB deployments
---
# Deploying using the ArangoDB Starter

{{ page.description }}
{:class="lead"}

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
