---
fileID: administration
title: Administration
weight: 1625
description: 
layout: default
---
## Tools

Deployments of ArangoDB servers can be managed with the following tools:

- [**Web interface**](../programs-tools/web-interface/):
  [_arangod_](../programs-tools/arangodb-server/) serves a graphical web interface to
  be accessed with a browser via the server port. It provides basic and advanced
  functionality to interact with the server and its data.
  
  {{% comment %}}TODO: In case of a cluster, the web interface can be reached via any of the Coordinators. What about other deployment modes?{{% /comment %}}

- **ArangoShell**: [_arangosh_](../programs-tools/arangodb-shell/) is a V8 shell to
  interact with any local or remote ArangoDB server through a JavaScript
  interface. It can be used to automate tasks. Some developers may prefer it over
  the web interface, especially for simple CRUD. It is not to be confused with
  general command lines like Bash or PowerShell.

- **RESTful API**: _arangod_ has an [HTTP interface](../about-arangodb/) through
  which it can be fully managed. The official client tools including _arangosh_ and
  the Web interface talk to this bare metal interface. It is also relevant for
  [driver](../about-arangodb/) developers.

- [**ArangoDB Starter**](../programs-tools/arangodb-starter/): This deployment tool
  helps to start _arangod_ instances, like for a Cluster or an Active Failover setup.
  
For a full list of tools, please refer to the [Programs & Tools](../programs-tools/) chapter.

## Deployment Administration

- [Active Failover](administration-active-failover)
- [Cluster](administration-cluster)
- [Datacenter-to-Datacenter Replication](../arangosync/administration-dc2dc)
- [ArangoDB Starter Administration](arangodb-starter-administration/)

## Other Topics

- [Configuration](administration-configuration)
- [License Management](administration-license)
- [Backup & Restore](../backup-restore/)
- [Import & Export](administration-import-export)
- [User Management](user-management/)
