---
layout: default
description: ArangoDB v3.9 Release Notes API Changes
---
API Changes in ArangoDB 3.9
===========================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.9.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.9.

## HTTP RESTful API

### Extended naming convention for databases

There is a new startup option allowing database names to contain most UTF-8
characters. The option name is `--database.extended-names-databases`.

The feature is disabled by default for compatibility with existing client
drivers and applications that only support ASCII names according to the
traditional database naming convention of previous ArangoDB versions.

However, if the feature is enabled, then any endpoints that contain database
names in the URL may contain special characters that were previously not allowed
(percent-encoded). They are also to be expected in payloads that feature
database names. Additionally, when creating new databases via the REST API,
database names containing UTF-8 characters must be 
[NFC-normalized](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms){:target="_blank"}.
Non-normalized names will be rejected by arangod.

Also see [Database Naming Conventions](data-modeling-naming-conventions-database-names.html).

### Privilege changes

### Endpoint return value changes

All collections in ArangoDB are now always in the "loaded" state. APIs return
return a collection's status will now return it as "loaded", unconditionally.

The HTTP endpoints for loading and unloading collections (i.e. HTTP PUT
`/_api/collection/<collection>/load` and HTTP PUT `/_api/collection/<collection>/unload`)
have been turned into no-ops. They still exist in ArangoDB 3.9, but do not
serve any purpose and are deprecated.

### Endpoints added

The HTTP REST API endpoint `GET /_admin/support-info` was added for retrieving
deployment information for support purposes. The endpoint returns data about the
ArangoDB version used, the host (operating system, server ID, CPU and storage capacity,
current utilization, a few metrics) and the other servers in the deployment
(in case of active failover or cluster deployments).

As this API may reveal sensitive data about the deployment, it can only be 
accessed from inside the `_system` database. In addition, there is a policy control 
startup option `--server.support-info-api` that controls if and to whom the API 
is made available. This option can have the following values:

- `disabled`: support info API is disabled.
- `jwt`: support info API can only be accessed via superuser JWT.
- `hardened` (default): if `--server.harden` is set, the support info API can only be
  accessed via superuser JWT. Otherwise it can be accessed by admin users only.
- `public`: everyone with access to the `_system` database can access the support info API.

### Endpoints augmented

The HTTP REST API endpoint `POST /_api/cursor` can now handle an 
additional sub-attribute `fillBlockCache` for its `options` attribute.
`fillBlockCache` controls whether the to-be-executed query should
populate the RocksDB block cache with the data read by the query.
This is an optional attribute, and its default value is `true`, meaning
that the block cache will be populated. This functionality was also backported
to v3.8.1.

The HTTP REST API endpoint `POST /_api/cursor` can also handle the
sub-attribute `maxNodesPerCallstack`, which controls after how many
execution nodes in a query a stack split should be performed. This is
only relevant for very large queries. If this option is not specified,
the default value is 200 on MacOS, and 250 for other platforms.

The HTTP REST API endpoint `PUT /_admin/log/level` can now handle the
pseudo log topic `"all"`. Setting the log level for the "all" log topic will
adjust the log level for **all existing log topics**.
For example, sending the JSON object to this API

```json
{"all":"debug"}
```

will set all log topics to log level "debug".

### Endpoints moved

#### Cluster API redirects

Since ArangoDB 3.7, some cluster APIs were made available under different
paths. The old paths were left in place and simply redirected to the new
address. These redirects have now been removed in ArangoDB 3.9.

The following list shows the old, now dysfunctional paths and their
replacements:

- `/_admin/clusterNodeVersion`: replaced by `/_admin/cluster/nodeVersion`
- `/_admin/clusterNodeEngine`: replaced by `/_admin/cluster/nodeEngine`
- `/_admin/clusterNodeStats`: replaced by `/_admin/cluster/nodeStatistics`
- `/_admin/clusterStatistics`: replaced by `/_admin/cluster/statistics`

Using the replacements will work from ArangoDB 3.7 onwards already, so
any client applications that still call the old addresses can be adjusted
to call the new addresses from 3.7 onwards.

### Endpoints removed

The following API redirect endpoints have been removed in ArangoDB 3.9.
These endpoints have been only been redirections since ArangoDB 3.7. Any
caller of these API endpoints should use the updated endpoints:

- `/_admin/clusterNodeVersion`: use `/_admin/cluster/nodeVersion`
- `/_admin/clusterNodeEngine`: use `/_admin/cluster/nodeEngine`
- `/_admin/clusterNodeStats`: use `/_admin/cluster/nodeStatistics`
- `/_admin/clusterStatistics`: use `/_admin/cluster/statistics`

The REST API endpoint `/_msg/please-upgrade-handler` has been removed in 
ArangoDB 3.9 as it is no longer needed. Its purpose was to display a static 
message.

#### Export API

The REST API endpoint `/_api/export` has been removed in ArangoDB 3.9.
This endpoint was previously only present in single server, but never
supported in cluster deployments.

The purpose of the endpoint was to provide the full data of a collection
without holding collection locks for a long time, which was useful for
the MMFile storage engine with its collection-level locks.

The MMFiles engine is gone since ArangoDB 3.7, and the only remaining
storage engine since then is RocksDB. For the RocksDB engine, the
`/_api/export` endpoint internally used a streaming AQL query such as

```js
FOR doc IN @@collection RETURN doc
```

anyway. To remove API redundancy, the API endpoint has been deprecated
in ArangoDB 3.8 and is now removed. If the functionality is still required
by client applications, running a streaming AQL query can be used as a
substitution.

## JavaScript API

All collections in ArangoDB are now always in the "loaded" state. Any 
JavaScript functions for returning a collection's status will now return 
"loaded", unconditionally.

The JavaScript functions for loading and unloading collections (i.e. 
`db.<collection>.load()` and `db.<collection>.unload()`) have been turned 
into no-ops. They still exist in ArangoDB 3.9, but do not serve any purpose 
and are deprecated.
