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
| **Date Added:** 2020-05-22 <br> **Component:** ArangoSearch <br> **Deployment Mode:** Cluster <br> **Description:** The immediate recreation of ArangoSearch Analyzers in cluster deployments (deleting and shortly after creating one with the same name but different properties) causes errors in queries which involve such recreated Analyzers. For a workaround see [Purge Analyzer cache](#purge-analyzer-cache) below. <br> **Affected Versions:** 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/backlog#669](https://github.com/arangodb/backlog/issues/669){:target="_blank"} (internal), [arangodb/backlog#695](https://github.com/arangodb/backlog/issues/695){:target="_blank"} (internal) |
| **Date Added:** 2020-07-31 <br> **Component:** ArangoSearch <br> **Deployment Mode:** All <br> **Description:** AQL queries with subqueries or joins in SEARCH expressions may return incorrect results. As a workaround, you can disable the optimizer rule which causes the problem with the following query options: `{ optimizer: { rules: [ "-inline-subqueries" ] } }` <br> **Affected Versions:** 3.5.x, 3.6.x, 3.7.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/arangodb#12247](https://github.com/arangodb/arangodb/issues/12247){:target="_blank"} |

### Purge Analyzer cache

To fix query errors caused by an immediately re-created Analyzer, the
DB-Servers need to be forced to clear their Analyzer caches. This can be
achieved by using below code in _arangosh_:

1. Connect to a Coordinator with `arangosh`
2. `var analyzers = require("@arangodb/analyzers");`
3. `analyzers.remove("<PROBLEMATIC ANALYZER>");`
4. `var dummy = "dummy_analyzer_" + Date.now();`
4. `analyzers.save(dummy, "identity", {});`
5. `db._query("FOR d IN <ANY EXISTING VIEW> SEARCH ANALYZER(STARTS_WITH(d.test, 'something'), @a) RETURN d", {a: dummy});`

   This query with a new Analyzer will force cache purging. If this query
   reports an error about a missing Analyzer, then wait for a minute and
   retry until it succeeds.
6. Re-create your Analyzer (`<PROBLEMATIC ANALYZER>`) with the new,
   correct properties.
7. `analyzers.remove(dummy);`
8. Check if the original query still fails. It is possible that it reports a
   missing Analyzer, but the problem should go away in a minute and the query
   execute normally.

AQL
---

| Issue      |
|------------|
| **Date Added:** 2018-09-05 <br> **Component:** AQL <br> **Deployment Mode:** Cluster <br> **Description:** In a very uncommon edge case there is an issue with an optimization rule in the cluster. If you are running a cluster and use a custom shard key on a collection (default is `_key`) **and** you provide a wrong shard key in a modifying query (`UPDATE`, `REPLACE`, `DELETE`) **and** the wrong shard key is on a different shard than the correct one, a `DOCUMENT NOT FOUND` error is returned instead of a modification (example query: `UPDATE { _key: "123", shardKey: "wrongKey"} WITH { foo: "bar" } IN mycollection`). Note that the modification always happens if the rule is switched off, so the suggested  workaround is to [deactivate the optimizing rule](aql/execution-and-performance-optimizer.html#turning-specific-optimizer-rules-off) `restrict-to-single-shard`. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/arangodb#6399](https://github.com/arangodb/arangodb/issues/6399){:target="_blank"} |
| **Date Added:** 2020-01-07 <br> **Component:** AQL <br> **Deployment Mode:** Cluster <br> **Description:** It is not possible to execute AQL traversals in a cluster using collection sets (anonymous graph) for datasets where edges point to other edges. This is an uncommon use case, but it worked in previous versions. <br> **Affected Versions:** 3.6.0 <br> **Fixed in Versions:** 3.6.1 <br> **Reference:** [arangodb/arangodb#10801](https://github.com/arangodb/arangodb/pull/10801){:target="_blank"} |
| **Date Added:** 2020-07-22 <br> **Component:** AQL <br> **Deployment Mode:** Cluster <br> **Description:** When explicitly destroying an AQL Cursor created with `stream: true` in a cluster deployment, the server does not reply (the request hangs forever). <br> **Affected Versions:** 3.6.x, 3.7.0 <br> **Fixed in Versions:** 3.7.1 <br> **Reference:** [BTS-126](https://arangodb.atlassian.net/browse/BTS-126){:target="_blank"} (internal) |

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
| **Date Added:** 2020-05-18 <br> **Component:** all arangod / arangosh based programs & tools <br> **Deployment Mode:** All <br> **Description:** When using the `--config` option to set the configuration file location the ArangoDB C++ binaries check for `<filename>.local` among other paths. If this path happens to be a directory then the expected configuration can not be read, resulting in an early exit. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x <br> **Fixed in Versions:** 3.4.11, 3.5.6, 3.6.4 <br> **Reference:** [arangodb/arangodb#11632](https://github.com/arangodb/arangodb/pull/11632){:target="_blank"} |
| **Date Added:** 2020-06-19 <br> **Component:** SmartGraphs <br> **Deployment Mode:** Cluster <br> **Description:** When inserting edges into an edge collection of a SmartGraph, the auto-generated `_rev` values for the ingoing and outgoing part of the edge may differ. This can be confusing when querying the `_rev` values of the edges later. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x, 3.7.x <br> **Fixed in Versions:** 3.6.5, 3.7.1 <br> **Reference:** N/A |
| **Date Added:** 2020-06-30 <br> **Component:** SmartGraphs <br> **Deployment Mode:** Cluster <br> **Description:** Changing the collection properties of a smart edge collection did not propagate the changes to child collections for the `waitForSync`, `cacheEnabled` and `schema` attributes. This has been fixed in 3.7.1 for new smart edge collections, created with 3.7.1 or later. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x, 3.7.x <br> **Fixed in Versions:** 3.7.1 <br> **Reference:** [arangodb/arangodb#12065](https://github.com/arangodb/arangodb/pull/12065){:target="_blank"} |
| **Date Added:** 2020-07-31 <br> **Component:** Web UI <br> **Deployment Mode:** All <br> **Description:** The API tab of Foxx services does not render the Swagger UI interface. <br> **Affected Versions:** 3.5.x, 3.6.x, 3.7.x <br> **Fixed in Versions:** 3.5.6, 3.6.6, 3.7.1 <br> **Reference:** [arangodb/arangodb#12297](https://github.com/arangodb/arangodb/issues/12297){:target="_blank"} |
| **Date Added:** 2020-07-31 <br> **Component:** Web UI <br> **Deployment Mode:** All <br> **Description:** The web interface confirms the creation of an index, but then displays an error `404: Not Found` despite of a successful index creation. <br> **Affected Versions:** 3.6.x, 3.7.x <br> **Fixed in Versions:** 3.6.6, 3.7.1 <br> **Reference:** [arangodb/arangodb#12248](https://github.com/arangodb/arangodb/issues/12248){:target="_blank"} |
| **Date Added:** 2020-08-12 <br> **Component:** Web UI <br> **Deployment Mode:** All <br> **Description:** The web interface may show inconsistent results, such as an empty view for a collection with documents while displaying a document count higher than 0, if nginx or Cloudflare proxying with HTTP 2 is used. The Chrome developer console logs the following error when it occurs: `Failed to load resource: net::ERR_HTTP2_PROTOCOL_ERROR`. Version 3.7.0 and above resolve the problem indirectly because of server-side support for the HTTP/2 protocol. <br> **Affected Versions:** 3.6.x <br> **Fixed in Versions:** 3.7.0 <br> **Reference:** [arangodb/arangodb#11636](https://github.com/arangodb/arangodb/issues/11636){:target="_blank"} |
| **Date Added:** 2020-11-20 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** The value of the startup option `--network.io-threads` is clamped to `1`. <br> **Affected Versions:** 3.6.x, 3.7.x <br> **Fixed in Versions:** 3.6.10, 3.7.5 <br> **Reference:** [arangodb/arangodb#13051](https://github.com/arangodb/arangodb/issues/13051){:target="_blank"} |
| **Date Added:** 2020-11-20 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** The `www-authenticate` header is not set for HTTP 401 responses as required by the HTTP specification, despite the documentation claiming this behavior. <br> **Affected Versions:** 3.5.x, 3.6.x, 3.7.x <br> **Fixed in Versions:** 3.8.0 <br> **Reference:** [arangodb/arangodb#13001](https://github.com/arangodb/arangodb/issues/13001){:target="_blank"} |
