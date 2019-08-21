---
layout: default
description: Known issues of ArangoDB version 3.5.x products
---
Known Issues in ArangoDB 3.5
============================

This page lists important issues affecting the 3.5.x versions of the ArangoDB suite of products.
It is not a list of all open issues.

Critical issues (ArangoDB Technical & Security Alerts) are also found at [arangodb.com/alerts](https://www.arangodb.com/alerts/){:target="_blank"}.

ArangoSearch
------------

| Issue      |
|------------|
| **Date Added:** 2018-12-19 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Single-server <br> **Description:** Value of `_id` attribute indexed by ArangoSearch view may become inconsistent after renaming a collection <br> **Affected Versions:** >= 3.5.0 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#514](https://github.com/arangodb/backlog/issues/514){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Cluster <br> **Description:** Score values evaluated by corresponding score functions (BM25/TFIDF) may differ in single-server and cluster with a collection having more than 1 shard <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#508](https://github.com/arangodb/backlog/issues/508){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Cluster <br> **Description:** ArangoSearch index consolidation does not work during creation of a link on existing collection which may lead to massive file descriptors consumption <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#509](https://github.com/arangodb/backlog/issues/509){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Cluster <br> **Description:** Long-running DML transactions on collections (linked with ArangoSearch view) block "ArangoDB flush thread" making impossible to refresh data "visible" by a view <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** 3.5.0 <br> **Reference:** [arangodb/backlog#510](https://github.com/arangodb/backlog/issues/510){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** ArangoSearch index format included starting from 3.4.0-RC.4 is incompatible to earlier released 3.4.0 release candidates. Dump and restore is needed when upgrading from 3.4.0-RC.4 to a newer 3.4.0.x release <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** RocksDB recovery fails sometimes after renaming a view <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** 3.5.0 <br> **Reference:** [arangodb/backlog#469](https://github.com/arangodb/backlog/issues/469){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** Using a loop variable in expressions within a corresponding SEARCH condition is not supported <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#318](https://github.com/arangodb/backlog/issues/318){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** Using score functions (BM25/TFIDF) in ArangoDB expression is not supported <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** 3.5.0 <br> **Reference:** [arangodb/backlog#316](https://github.com/arangodb/backlog/issues/316){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** ArangoSearch index format included starting from 3.4.0-RC.3 is incompatible to earlier released 3.4.0 release candidates. Dump and restore is needed when upgrading from 3.4.0-RC.2 to a newer 3.4.0.x release <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-06-25 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** The `primarySort` attribute in ArangoSearch View definitions can not be set via the web interface. The option is immutable, but the web interface does not allow to set any View properties upfront (it creates a View with default parameters before the user has a chance to configure it). <br> **Affected Versions:** 3.5.0 <br> **Fixed in Versions:** - <br> **Reference:** N/A |

Upgrading
---------

| Issue      |
|------------|
| **Date Added:** 2019-05-16 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** Upgrading ArangoSearch Views from 3.4.x to 3.5.0 pre-releases is not supported for the time being. You may recreate them manually however. If the server encounters views in an upgrade, it will fail with the following message: <br>`FATAL [7db7c] {arangosearch} Upgrading views is not supported in 3.5RC1, please drop all the existing views and manually recreate them after the upgrade is complete` <br> **Affected Versions:** 3.5.0-RC.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-05-16 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** Bugfix release upgrades such as 3.4.4 to 3.4.5 may not create a backup of the database directory even if they should. Please create a copy manually before upgrading. <br> **Affected Versions:** 3.4.x (Windows and Linux) <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/planning#3745](https://github.com/arangodb/planning/issues/3745){:target="_blank"} (internal) |

Stream Transactions
-------------------

| Issue      |
|------------|
| **Date Added:** 2019-08-19 <br> **Component:** Transactions <br> **Deployment Mode:** All <br> **Description:** Stream Transactions currently do not honor the limits described in the documentation. Currently the idle timeout of 10 seconds will not be enforced, neither will the maximum size of transaction be enforced. It is planned to add the enforcements of the limits with ArangoDB 3.5.1. <br> **Affected Versions:** 3.5.0 RC1 to 3.5.0 (including) <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-08-19 <br> **Component:** Transactions <br> **Deployment Mode:** All <br> **Description:** Stream Transactions currently do not support the graph operations that are initiated via the `general-graph` JavaScript module or via the REST API at `/_api/gharial`. Right now these operations will act as if no stream transaction is present. Stream transaction support for these operations will be added later. <br> **Affected Versions:** 3.5.0 RC1 to 3.5.0 (including) <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-08-19 <br> **Component:** Transactions <br> **Deployment Mode:** All <br> **Description:** Stream Transactions currently do not support user restrictions. Any authenticated user may access any ongoing transaction so long as they have access to the database in question. A fix for this is forthcoming.<br> **Affected Versions:** 3.5.0 RC1 to 3.5.0 (including) <br> **Fixed in Versions:** - <br> **Reference:** N/A |

Other
-----

| Issue      |
|------------|
| **Date Added:** 2019-05-16 <br> **Component:** Starter <br> **Deployment Mode:** All <br> **Description:** The ArangoDB Starter falls back to the IP `[::1]` under macOS. If there is no entry `::1  localhost` in the `/etc/hosts` file or the option `--starter.disable-ipv6` is passed to the starter to use IPv4, then it will hang during startup. <br> **Affected Versions:** 0.14.3 (macOS only) <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-05-16 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** Calling a shutdown endpoint may not result in a proper shutdown while the node/server is still under load. The server processes must be ended manually. <br> **Affected Versions:** 3.5.0-RC.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-05-24 <br> **Component:** Web UI <br> **Deployment Mode:** Active Failover <br> **Description:** The web interface shows a wrong replication mode in the replication tab in Active Failover deployments sometimes. It may display Master/Slave mode (the default value) because of timeouts if `/_api/cluster/endpoints` is requested too frequently. <br> **Affected Versions:** 3.5.0-RC.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-05-24 <br> **Component:** Web UI <br> **Deployment Mode:** All <br> **Description:** The LOGS menu entry in the web interface does not work. <br> **Affected Versions:** 3.5.0-RC.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
