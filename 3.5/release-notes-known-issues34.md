---
layout: default
description: This page lists important issues affecting the 3
---
Known Issues in ArangoDB 3.4
============================

This page lists important issues affecting the 3.4.x versions of the ArangoDB suite of products.
It is not a list of all open issues.

Critical issues (ArangoDB Technical & Security Alerts) are also found at [arangodb.com/alerts](https://www.arangodb.com/alerts/){:target="_blank"}.

ArangoSearch
------------

| Issue      |
|------------|
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Cluster <br> **Description:** Score values evaluated by corresponding score functions (BM25/TFIDF) may differ in single-server and cluster with a collection having more than 1 shard <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#508](https://github.com/arangodb/backlog/issues/508){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Cluster <br> **Description:** ArangoSearch index consolidation does not work during creation of a link on existing collection which may lead to massive file descriptors consumption <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#509](https://github.com/arangodb/backlog/issues/509){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Cluster <br> **Description:** Long-running DML transactions on collections (linked with ArangoSearch view) block "ArangoDB flush thread" making impossible to refresh data "visible" by a view <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#510](https://github.com/arangodb/backlog/issues/510){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** ArangoSearch index format included starting from 3.4.0-RC.4 is incompatible to earlier released 3.4.0 release candidates. Dump and restore is needed when upgrading from 3.4.0-RC.4 to a newer 3.4.0.x release <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** RocksDB recovery fails sometimes after renaming a view <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#469](https://github.com/arangodb/backlog/issues/469){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** ArangoSearch ignores `_id` attribute even if `includeAllFields` is set to `true`  <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#445](https://github.com/arangodb/backlog/issues/445){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** Using a loop variable in expressions within a corresponding SEARCH condition is not supported <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#318](https://github.com/arangodb/backlog/issues/318){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** Using score functions (BM25/TFIDF) in ArangoDB expression is not supported <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#316](https://github.com/arangodb/backlog/issues/316){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** ArangoSearch index format included starting from 3.4.0-RC.3 is incompatible to earlier released 3.4.0 release candidates. Dump and restore is needed when upgrading from 3.4.0-RC.2 to a newer 3.4.0.x release <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-05-16 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** You may experience server slowdowns caused by Views. Removing a collection link from the view configuration mitigates the problem. <br> **Affected Versions:** 3.4.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |


AQL
---

| Issue      |
|------------|
| **Date Added:** 2018-09-05 <br> **Component:** AQL <br> **Deployment Mode:** Cluster <br> **Description:** In a very uncommon edge case there is an issue with an optimization rule in the cluster. If you are running a cluster and use a custom shard key on a collection (default is `_key`) **and** you provide a wrong shard key in a modifying query (`UPDATE`, `REPLACE`, `DELETE`) **and** the wrong shard key is on a different shard than the correct one, a `DOCUMENT NOT FOUND` error is returned instead of a modification (example query: `UPDATE { _key: "123", shardKey: "wrongKey"} WITH { foo: "bar" } IN mycollection`). Note that the modification always happens if the rule is switched off, so the suggested  workaround is to [deactivate the optimizing rule](aql/execution-and-performance-optimizer.html#turning-specific-optimizer-rules-off) `restrict-to-single-shard`. <br> **Affected Versions:** 3.4.0-RC.5 <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/arangodb#6399](https://github.com/arangodb/arangodb/issues/6399){:target="_blank"} |

Upgrading
---------

| **Date Added:** 2019-05-16 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** Upgrading from 3.4.4 to 3.4.5 under CentOS using <code>rpm -U</code> or <code>yum upgrade</code> is unable to succeed because of a problem with the package. The arangodb3 service will not be available anymore. Uninstalling with <code>rpm -e</code> or <code>yum remove</code> may fail or not clean up all of the folders. <br> **Affected Versions:** 3.5.0-RC.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/release-qa#50](https://github.com/arangodb/release-qa/issues/50){:target="_blank"} (internal) |
| **Date Added:** 2019-05-16 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** Major upgrades such as 3.3.22 to 3.4.5 fail to upgrade the database directory under CentOS. The server log suggests to use the script <code>/etc/init.d/arangodb</code> but it is not available under CentOS. Workaround: Add <code>database.auto-upgrade = true</code> to <code>/etc/arangodb3/arangod.conf</code>, restart the service, remove <code>database.auto-upgrade = true</code> from the configuration and restart the service once more. <br> **Affected Versions:** 3.x.x (CentOS only) <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/release-qa#50](https://github.com/arangodb/release-qa/issues/50){:target="_blank"} (internal) |
| **Date Added:** 2019-05-16 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** Bugfix release upgrades such as 3.4.4 to 3.4.5 may not create a backup of the database directory even if they should. Please create a copy manually before upgrading. <br> **Affected Versions:** 3.4.x (Windows and Linux) <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/planning#3745](https://github.com/arangodb/planning/issues/3745){:target="_blank"} (internal) |

Other
-----

| Issue      |
|------------|
| **Date Added:** 2018-12-04 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** Parallel creation of collections using multiple client connections with the same database user may spuriously fail with "Could not update user due to conflict" warnings when setting user permissions on the new collections. A follow-up effect of this may be that access to the just-created collection is denied. <br> **Affected Versions:** 3.4.0 <br> **Fixed in Versions:** 3.4.1 <br> **Reference:** [arangodb/arangodb#5342](https://github.com/arangodb/arangodb/issues/5342){:target="_blank"}  |
| **Date Added:** 2019-02-18 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** There is a clock overflow bug within Facebook's RocksDB storage engine for Windows. The problem manifests under heavy write loads, including long imports. The Windows server will suddenly block all writes for minutes or hours, then begin working again just fine. An immediate workaround is to change the server configuration: <pre><code>[rocksdb]&#13;throttle = false</code></pre> **Affected Versions:** all 3.x versions (Windows only) <br> **Fixed in Versions:** 3.3.23, 3.4.4 <br> **Reference:** [facebook/rocksdb#4983](https://github.com/facebook/rocksdb/issues/4983){:target="_blank"} |
| **Date Added:** 2019-03-13 <br> **Component:** arangod <br> **Deployment Mode:** Active Failover <br> **Description:** A full resync is triggered after a failover, when the former leader instance is brought back online. A full resync may even occur twice sporadically.  <br> **Affected Versions:** all 3.4.x versions <br> **Fixed in Versions:** 3.4.5 <br> **Reference:** [arangodb/planning#3757](https://github.com/arangodb/planning/issues/3757){:target="_blank"} (internal) |
| **Date Added:** 2019-03-13 <br> **Component:** arangod <br> **Deployment Mode:** Active Failover <br> **Description:** The leader instance may hang on shutdown. This behavior was observed in an otherwise successful failover. <br> **Affected Versions:** all 3.4.x versions <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/planning#3756](https://github.com/arangodb/planning/issues/3756){:target="_blank"} (internal) |
| **Date Added:** 2019-05-16 <br> **Component:** Starter <br> **Deployment Mode:** All <br> **Description:** The ArangoDB Starter falls back to the IP <code>[::1]</code> under macOS. If there is no entry <code>::1  localhost</code> in the <code>/etc/hosts</code> file or the option <code>--starter.disable-ipv6</code> is passed to the starter to use IPv4, then it will hang during startup. <br> **Affected Versions:** 0.14.3 (macOS only) <br> **Fixed in Versions:** - <br> **Reference:** N/A |
