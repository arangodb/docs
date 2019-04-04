---
layout: default
---
Administration
==============

Tools
-----

Deployments of ArangoDB servers can be managed with the following tools:

- [**Web interface**](programs-web-interface-readme.html):
  [_Arangod_](programs-arangod-readme.html) serves a graphical web interface to
  be accessed with a browser via the server port. It provides basic and advanced
  functionality to interact with the server and its data.
{### TODO: In case of a cluster, the web interface can be reached via any of the coordinators. What about other deployment modes? ###}

- **ArangoShell**: [_Arangosh_](programs-arangosh-readme.html) is a V8 shell to
  interact with any local or remote ArangoDB server through a JavaScript
  interface. It can be used to automate tasks. Some developers may prefer it over
  the web interface, especially for simple CRUD. It is not to be confused with
  general command lines like Bash or PowerShell.

- **RESTful API**: _Arangod_ has an [HTTP interface](../../HTTP/index.html) through
  which it can be fully managed. The official client tools including _Arangosh_ and
  the Web interface talk to this bare metal interface. It is also relevant for
  [driver](../../Drivers/index.html) developers.

- [**ArangoDB Starter**](programs-starter-readme.html): This deployment tool
  helps to start _Arangod_ instances, like for a Cluster or an Active Failover setup.
  
For a full list of tools, please refer to the [Programs & Tools](programs-readme.html) chapter.

Deployment Administration
-------------------------

- [Master/Slave](administration-master-slave-readme.html)
- [Active Failover](administration-active-failover-readme.html)
- [Cluster](administration-cluster-readme.html)
- [Datacenter to datacenter replication](administration-dc2dc-readme.html)
- [ArangoDB Starter Administration](administration-starter-readme.html)

Other Topics
------------

- [Configuration](administration-configuration-readme.html)
- [Backup & Restore](backup-restore-readme.html)
- [Import & Export](administration-import-export.html)
- [User Management](administration-managing-users-readme.html)
- [Switch Storage Engine](administration-engine-switch-engine.html)

