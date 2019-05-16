---
layout: default
description: This page lists important issues affecting the 3
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
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Cluster <br> **Description:** Long-running DML transactions on collections (linked with ArangoSearch view) block "ArangoDB flush thread" making impossible to refresh data "visible" by a view <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#510](https://github.com/arangodb/backlog/issues/510){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** ArangoSearch index format included starting from 3.4.0-RC.4 is incompatible to earlier released 3.4.0 release candidates. Dump and restore is needed when upgrading from 3.4.0-RC.4 to a newer 3.4.0.x release <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** RocksDB recovery fails sometimes after renaming a view <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#469](https://github.com/arangodb/backlog/issues/469){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** Using a loop variable in expressions within a corresponding SEARCH condition is not supported <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#318](https://github.com/arangodb/backlog/issues/318){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** Using score functions (BM25/TFIDF) in ArangoDB expression is not supported <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#316](https://github.com/arangodb/backlog/issues/316){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** ArangoSearch index format included starting from 3.4.0-RC.3 is incompatible to earlier released 3.4.0 release candidates. Dump and restore is needed when upgrading from 3.4.0-RC.2 to a newer 3.4.0.x release <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** N/A |

Upgrading
---------

| Issue      |
|------------|
| **Date Added:** 2019-05-16 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** Upgrading ArangoSearch Views from 3.4.x to 3.5.0 pre-releases is not supported for the time being. You may recreate them manually however. If the server encounters views in an upgrade, it will fail with the following message: <pre><code>FATAL [7db7c] {arangosearch} Upgrading views is not supported in 3.5RC1, please drop all the existing views and manually recreate them after the upgrade is complete</code></pre> <br> **Affected Versions:** 3.5.0-RC.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-05-16 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** Bugfix release upgrades such as 3.4.4 to 3.4.5 may not create a backup of the database directory even if they should. Please create a copy manually before upgrading. <br> **Affected Versions:** 3.4.x (Windows and Linux) <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/planning#3745](https://github.com/arangodb/planning/issues/3745){:target="_blank"} (internal) |

Other
-----

| Issue      |
|------------|
| **Date Added:** 2019-05-16 <br> **Component:** Starter <br> **Deployment Mode:** All <br> **Description:** The ArangoDB Starter falls back to the IP <code>[::1]</code> under macOS. If there is no entry <code>::1  localhost</code> in the <code>/etc/hosts</code> file or the option <code>--starter.disable-ipv6</code> is passed to the starter to use IPv4, then it will hang during startup. <br> **Affected Versions:** 0.14.3 (macOS only) <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-05-16 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** Calling a shutdown endpoint may not result in a proper shutdown while the node/server is still under load. The server processes must be ended manually. <br> **Affected Versions:** 3.5.0-RC.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
