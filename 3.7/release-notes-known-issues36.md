---
layout: default
description: Important issues affecting the 3.6.x versions of the ArangoDB suite of products
title: ArangoDB v3.6 Known Issues
---
Known Issues in ArangoDB 3.6
============================

This page lists important issues affecting the 3.6.x versions of the ArangoDB
suite of products. It is not a list of all open issues.

Critical issues (ArangoDB Technical & Security Alerts) are also found at
[arangodb.com/alerts](https://www.arangodb.com/alerts/){:target="_blank"}.

ArangoSearch
------------

| Issue      |
|------------|
| **Date Added:** 2018-12-19 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Single-server <br> **Description:** Value of `_id` attribute indexed by ArangoSearch view may become inconsistent after renaming a collection <br> **Affected Versions:** 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#514](https://github.com/arangodb/backlog/issues/514){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Cluster <br> **Description:** Score values evaluated by corresponding score functions (BM25/TFIDF) may differ in single-server and cluster with a collection having more than 1 shard <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#508](https://github.com/arangodb/backlog/issues/508){:target="_blank"} (internal) |
| **Date Added:** 2018-12-03 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** Using a loop variable in expressions within a corresponding SEARCH condition is not supported <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#318](https://github.com/arangodb/backlog/issues/318){:target="_blank"} (internal) |
| **Date Added:** 2019-06-25 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** The `primarySort` attribute in ArangoSearch View definitions can not be set via the web interface. The option is immutable, but the web interface does not allow to set any View properties upfront (it creates a View with default parameters before the user has a chance to configure it). <br> **Affected Versions:** 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2020-03-19 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** Operators and functions in `SEARCH` clauses of AQL queries which compare values such as `>`, `>=`, `<`, `<=`, `IN_RANGE()` and `STARTS_WITH()` neither take the server language (`--default-language`) nor the Analyzer locale into account. The alphabetical order of characters as defined by a language is thus not honored and can lead to unexpected results in range queries. <br> **Affected Versions:** 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#679](https://github.com/arangodb/backlog/issues/679){:target="_blank"} (internal) |
| **Date Added:** 2020-05-22 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Cluster <br> **Description:** Immediate recreation of ArangoSearch analyzer in cluster deployments (deleting and immediate creation  with same name but different properties) will cause error during the query execution which involves recreated analyzed. The following workaround can be applied: XXXXX. <br> **Affected Versions:** 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#669](https://github.com/arangodb/backlog/issues/669){:target="_blank"} (internal), [arangodb/backlog#695](https://github.com/arangodb/backlog/issues/695){:target="_blank"} (internal) |

AQL
---

| Issue      |
|------------|
| **Date Added:** 2018-09-05 <br> **Component:** AQL <br> **Deployment Mode:** Cluster <br> **Description:** In a very uncommon edge case there is an issue with an optimization rule in the cluster. If you are running a cluster and use a custom shard key on a collection (default is `_key`) **and** you provide a wrong shard key in a modifying query (`UPDATE`, `REPLACE`, `DELETE`) **and** the wrong shard key is on a different shard than the correct one, a `DOCUMENT NOT FOUND` error is returned instead of a modification (example query: `UPDATE { _key: "123", shardKey: "wrongKey"} WITH { foo: "bar" } IN mycollection`). Note that the modification always happens if the rule is switched off, so the suggested  workaround is to [deactivate the optimizing rule](aql/execution-and-performance-optimizer.html#turning-specific-optimizer-rules-off) `restrict-to-single-shard`. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/arangodb#6399](https://github.com/arangodb/arangodb/issues/6399){:target="_blank"} |
| **Date Added:** 2020-01-07 <br> **Component:** AQL <br> **Deployment Mode:** Cluster <br> **Description:** It is not possible to execute AQL traversals in a cluster using collection sets (anonymous graph) for datasets where edges point to other edges. This is an uncommon use case, but it worked in previous versions. <br> **Affected Versions:** 3.6.0 <br> **Fixed in Versions:** 3.6.1 <br> **Reference:** [arangodb/arangodb#10801](https://github.com/arangodb/arangodb/pull/10801){:target="_blank"} |

Upgrading
---------

| Issue      |
|------------|
| **Date Added:** 2019-05-16 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** Bugfix release upgrades such as 3.4.4 to 3.4.5 may not create a backup of the database directory even if they should. Please create a copy manually before upgrading. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x (Windows and Linux) <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/planning#3745](https://github.com/arangodb/planning/issues/3745){:target="_blank"} (internal) |
| **Date Added:** 2019-12-10 <br> **Component:** Installer <br> **Deployment Mode:** All <br> **Description:** The NSIS installer for Windows may fail to upgrade an existing installation, e.g. from 3.4.a to 3.4.b (patch release), with the error message: "failed to detect whether we need to Upgrade" <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/release-qa#183](https://github.com/arangodb/release-qa/issues/183){:target="_blank"} (internal) |
| **Date Added:** 2020-01-07 <br> **Component:** Installer <br> **Deployment Mode:** All <br> **Description:** The NSIS installer for Windows can fail to add the path to the ArangoDB binaries to the `PATH` environment variable, silently or with an error. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/release-qa#183](https://github.com/arangodb/release-qa/issues/183){:target="_blank"} (internal) |

Hot Backup
----------

| Issue      |
|------------|
| **Date Added:** 2019-10-09 <br> **Component:** Hot Backup API / arangobackup <br> **Deployment Mode:** All <br> **Description:** The Hot Backup feature is not supported in the Windows version of ArangoDB at this point in time. <br> **Affected Versions:** 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-10-09 <br> **Component:** Hot Backup API / arangobackup <br> **Deployment Mode:** DC2DC <br> **Description:** Hot Backup functionality in Datacenter to Datacenter Replication setups is experimental and may not work. <br> **Affected Versions:** 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-10-09 <br> **Component:** arangobackup <br> **Deployment Mode:** All <br> **Description:** The startup option `--operation` works as positional argument only, e.g. `arangobackup list`. The alternative syntax `arangobackup --operation list` is not accepted. <br> **Affected Versions:** 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |

Other
-----

| Issue      |
|------------|
| **Date Added:** 2019-05-16 <br> **Component:** Starter <br> **Deployment Mode:** All <br> **Description:** The ArangoDB Starter falls back to the IP `[::1]` under macOS. If there is no entry `::1  localhost` in the `/etc/hosts` file or the option `--starter.disable-ipv6` is passed to the starter to use IPv4, then it will hang during startup. <br> **Affected Versions:** 0.14.3 (macOS only) <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-05-24 <br> **Component:** Web UI <br> **Deployment Mode:** Active Failover <br> **Description:** The web interface shows a wrong replication mode in the replication tab in Active Failover deployments sometimes. It may display Master/Slave mode (the default value) because of timeouts if `/_api/cluster/endpoints` is requested too frequently. <br> **Affected Versions:** 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-12-10 <br> **Component:** Installer <br> **Deployment Mode:** All <br> **Description:** The DMG package for macOS is not notarized, which prevents the execution of _ArangoDB3-CLI.app_ under macOS 10.15 (Catalina) with error message: "_ArangoDB3-CLI_ can't be opened because Apple cannot check it for malicious software" <br> **Affected Versions:** 3.3.x, 3.4.x, 3.5.x, 3.6.x <br> **Fixed in Versions:** 3.4.10, 3.5.5, 3.6.1 <br> **Reference:** [arangodb/arangodb#10561](https://github.com/arangodb/arangodb/issues/10561){:target="_blank"} |
| **Date Added:** 2020-01-07 <br> **Component:** Installer <br> **Deployment Mode:** All <br> **Description:** V8-based binaries of the client packages (arangosh, arangoinspect, foxx-manager) have an incorrect default value for `javascript.startup-directory` and will thus not find the required JavaScript folder unless specified by the user. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.0 <br> **Fixed in Versions:** 3.4.9, 3.5.4, 3.6.1 <br> **Reference:** [arangodb/release-qa#183](https://github.com/arangodb/release-qa/issues/183){:target="_blank"} (internal) |
| **Date Added:** 2020-01-07 <br> **Component:** Installer <br> **Deployment Mode:** All <br> **Description:** The client packages for Windows miss the arangoinspect binary. As a workaround, you can run arangosh with the following options:<br>`arangosh --server.authentication false --server.ask-jwt-secret --javascript.client-module inspector.js …` <br> **Affected Versions:** 3.3.x, 3.4.x, 3.5.x, 3.6.0 <br> **Fixed in Versions:** 3.3.25, 3.4.10, 3.5.5, 3.6.1 <br> **Reference:** [arangodb/arangodb#10835](https://github.com/arangodb/arangodb/pull/10835){:target="_blank"} |
| **Date Added:** 2020-01-07 <br> **Component:** Foxx <br> **Deployment Mode:** Cluster <br> **Description:** In case of a Foxxmaster failover, jobs in state `'progress'` are not reset to `'pending'` to restart execution. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x <br> **Fixed in Versions:** 3.4.10, 3.5.5, 3.6.1 <br> **Reference:** [arangodb/arangodb#10800](https://github.com/arangodb/arangodb/pull/10800){:target="_blank"} |
| **Date Added:** 2020-04-23 <br> **Component:** arangod <br> **Deployment Mode:** Cluster <br> **Description:** The creation of example graphs fails if `--cluster.min-replication-factor` is set to a value greater than 1, because the system attempts to create the collections with a replication factor of 1 despite the higher minimum. <br> **Affected Versions:** 3.6.x <br> **Fixed in Versions:** 3.6.4 <br> **Reference:** [arangodb/arangodb#11487](https://github.com/arangodb/arangodb/pull/11487){:target="_blank"} |
