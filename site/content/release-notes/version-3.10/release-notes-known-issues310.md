---
fileID: release-notes-known-issues310
title: Known Issues in ArangoDB 3.10
weight: 11590
description: 
layout: default
---
| Issue      |
|------------|
| **Date Added:** 2018-09-05 <br> **Component:** AQL <br> **Deployment Mode:** Cluster <br> **Description:** In a very uncommon edge case there is an issue with an optimization rule in the cluster. If you are running a cluster and use a custom shard key on a collection (default is `_key`) **and** you provide a wrong shard key in a modifying query (`UPDATE`, `REPLACE`, `DELETE`) **and** the wrong shard key is on a different shard than the correct one, a `DOCUMENT NOT FOUND` error is returned instead of a modification (example query: `UPDATE { _key: "123", shardKey: "wrongKey"} WITH { foo: "bar" } IN mycollection`). Note that the modification always happens if the rule is switched off, so the suggested  workaround is to [deactivate the optimizing rule](../../aql/execution-and-performance/execution-and-performance-optimizer#turning-specific-optimizer-rules-off) `restrict-to-single-shard`. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x, 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/arangodb#6399](https://github.com/arangodb/arangodb/issues/6399) |

## Upgrading

| Issue      |
|------------|
| **Date Added:** 2019-05-16 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** Bugfix release upgrades such as 3.4.4 to 3.4.5 may not create a backup of the database directory even if they should. Please create a copy manually before upgrading. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x, 3.7.x, 3.8.x, 3.9.x, 3.10.x (Windows and Linux) <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/planning#3745](https://github.com/arangodb/planning/issues/3745) (internal) |
| **Date Added:** 2019-12-10 <br> **Component:** Installer <br> **Deployment Mode:** All <br> **Description:** The NSIS installer for Windows may fail to upgrade an existing installation, e.g. from 3.4.a to 3.4.b (patch release), with the error message: "failed to detect whether we need to Upgrade" <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x, 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/release-qa#183](https://github.com/arangodb/release-qa/issues/183) (internal) |
| **Date Added:** 2020-01-07 <br> **Component:** Installer <br> **Deployment Mode:** All <br> **Description:** The NSIS installer for Windows can fail to add the path to the ArangoDB binaries to the `PATH` environment variable, silently or with an error. <br> **Affected Versions:** 3.4.x, 3.5.x, 3.6.x, 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/release-qa#183](https://github.com/arangodb/release-qa/issues/183) (internal) |

## Hot Backup

| Issue      |
|------------|
| **Date Added:** 2019-10-09 <br> **Component:** Hot Backup API / arangobackup <br> **Deployment Mode:** All <br> **Description:** The Hot Backup feature is not supported in the Windows version of ArangoDB at this point in time. <br> **Affected Versions:** 3.5.x, 3.6.x, 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-10-09 <br> **Component:** Hot Backup API / arangobackup <br> **Deployment Mode:** DC2DC <br> **Description:** Hot Backup functionality in Datacenter-to-Datacenter Replication setups is experimental and may not work. <br> **Affected Versions:** 3.5.x, 3.6.x, 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-10-09 <br> **Component:** arangobackup <br> **Deployment Mode:** All <br> **Description:** The startup option `--operation` works as positional argument only, e.g. `arangobackup list`. The alternative syntax `arangobackup --operation list` is not accepted. <br> **Affected Versions:** 3.5.x, 3.6.x, 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |

## Schema Validation

| Issue      |
|------------|
| **Date Added:** 2019-03-17 <br> **Component:** Schema Validation <br> **Deployment Mode:** All <br> **Description:** The schema validation cannot pin-point which part of a rule made it fail. This is under investigation but very hard to solve for complex schemas. For example, when using `not` and `anyOf`, this would result in trees of possible errors. For now users should fall back to tools like [jsonschemavalidator.net](https://www.jsonschemavalidator.net/) <br> **Affected Versions:** 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-03-17 <br> **Component:** Schema Validation <br> **Deployment Mode:** All <br> **Description:** Remote schemas are not supported for security reasons. This limitation will likely remain unfixed. <br> **Affected Versions:** 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-06-25 <br> **Component:** Schema Validation <br> **Deployment Mode:** All <br> **Description:** When using arangorestore for a collection with a defined schema, schema validation is not executed. <br> **Affected Versions:** 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |

## Other

| Issue      |
|------------|
| **Date Added:** 2019-05-16 <br> **Component:** Starter <br> **Deployment Mode:** All <br> **Description:** The ArangoDB Starter falls back to the IP `[::1]` under macOS. If there is no entry `::1  localhost` in the `/etc/hosts` file or the option `--starter.disable-ipv6` is passed to the starter to use IPv4, then it will hang during startup. <br> **Affected Versions:** 0.14.3 (macOS only) <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-05-24 <br> **Component:** Web Interface <br> **Deployment Mode:** Active Failover <br> **Description:** The web interface shows a wrong replication mode in the replication tab in Active Failover deployments sometimes. It may display Leader/Follower mode (the default value) because of timeouts if `/_api/cluster/endpoints` is requested too frequently. <br> **Affected Versions:** 3.5.x, 3.6.x, 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2019-04-03 <br> **Component:** arangod <br> **Deployment Mode:** Cluster <br> **Description:** Updating the properties of a collection in the cluster may return before the properties are updated consistently on all shards. This is especially visible when setting a schema for a collection with multiple shards, and then instantly starting to store non-conforming documents into the collection. These may be accepted until the properties change has been fully propagated to all shards. <br> **Affected Versions:** 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** N/A |
| **Date Added:** 2021-04-07 <br> **Component:** arangod <br> **Deployment Mode:** All <br> **Description:** The Batch API (HTTP endpoint `/_api/batch`) cannot be used in combination with Stream transactions to submit batched requests, because the required header `x-arango-trx-id` is not forwarded. It only processes `Content-Type` and `Content-Id`. <br> **Affected Versions:** 3.5.x, 3.6.x, 3.7.x, 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** [arangodb/arangodb#13552](https://github.com/arangodb/arangodb/issues/13552) |
| **Date Added:** 2021-08-06 <br> **Component:** Installer <br> **Deployment Mode:** Single Server <br> **Description:** The Windows installer fails during database initialization with the error `failed to locate tzdata` if there are non-ASCII characters in the destination path. <br> **Affected Versions:** 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** [BTS-531](https://arangodb.atlassian.net/browse/BTS-531) (internal) |
| **Date Added:** 2022-09-29 <br> **Component:** Web Interface <br> **Deployment Mode:** All <br> **Description:** In the web interface for ArangoSearch Views, it's not possible to create a link to a collection, if the collection has only one letter in its name. <br> **Affected Versions:** 3.10.0 <br> **Fixed in Versions:** 3.10.1 <br> **Reference:** [BTS-1008](https://arangodb.atlassian.net/browse/BTS-1008) (internal) |
| **Date Added:** 2022-09-29 <br> **Component:** ArangoDB Starter <br> **Deployment Mode:** All <br> **Description:** The ArangoDB Starter may fail to pick a Docker container name from cgroups. <br> **Affected Versions:** 3.8.x, 3.9.x, 3.10.x <br> **Fixed in Versions:** - <br> **Reference:** [GT-207](https://arangodb.atlassian.net/browse/GT-207) (internal) |
