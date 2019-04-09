---
layout: default
---
Administration
==============

Tools
-----

Deployments of ArangoDB servers can be managed with the following tools:

- [**Web interface**](programs-webinterface.html):
  [_Arangod_](programs-arangod.html) serves a graphical web interface to
  be accessed with a browser via the server port. It provides basic and advanced
  functionality to interact with the server and its data.
{### TODO: In case of a cluster, the web interface can be reached via any of the coordinators. What about other deployment modes? ###}

- **ArangoShell**: [_Arangosh_](programs-arangosh.html) is a V8 shell to
  interact with any local or remote ArangoDB server through a JavaScript
  interface. It can be used to automate tasks. Some developers may prefer it over
  the web interface, especially for simple CRUD. It is not to be confused with
  general command lines like Bash or PowerShell.

- **RESTful API**: _Arangod_ has an [HTTP interface](../http/index.html) through
  which it can be fully managed. The official client tools including _Arangosh_ and
  the Web interface talk to this bare metal interface. It is also relevant for
  [driver](../drivers/index.html) developers.

- [**ArangoDB Starter**](programs-starter.html): This deployment tool
  helps to start _Arangod_ instances, like for a Cluster or an Active Failover setup.
  
For a full list of tools, please refer to the [Programs & Tools](programs.html) chapter.

Deployment Administration
-------------------------

- [Master/Slave](administration-masterslave.html)
- [Active Failover](administration-activefailover.html)
- [Cluster](administration-cluster.html)
- [Datacenter to datacenter replication](administration-dc2dc.html)
- [ArangoDB Starter Administration](administration-starter.html)

Other Topics
------------

- [Configuration](administration-configuration.html)
- [Backup & Restore](backuprestore.html)
- [Import & Export](administration-importexport.html)
- [User Management](administration-managingusers.html)
- [Switch Storage Engine](administration-engine-switchengine.html)

