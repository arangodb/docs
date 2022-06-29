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

### Graph API (Gharial)

The following changes affect the behavior of the RESTful graph APIs at
endpoints starting with path `/_api/gharial/`:

The options object now supports a new optional field `satellites` in the
Enterprise Edition when creating a graph (POST method). If set, it needs to be
an array of collection names. Each name must be a string and valid as collection
name. The `satellites` option is ignored in the Community Edition.

Using `satellites` during SmartGraph creation will result in a SmartGraph
with SatelliteCollections.
Using `satellites` during Disjoint SmartGraph creation will result in a
Disjoint SmartGraph with SatelliteCollections.

(Disjoint) SmartGraphs using SatelliteCollections are capable of having
SatelliteCollections in their
graph definitions. If a collection is named in `satellites` and also used in the
graph definition itself (e.g. EdgeDefinition), this collection will be created
as a SatelliteCollection. (Disjoint) SmartGraphs using SatelliteCollections are
then capable of executing all types of graph queries between the regular
SmartCollections and SatelliteCollections.

The following changes affect the behavior of the RESTful graph APIs at
endpoints starting with path `/_api/gharial/{graph}/edge` and
`/_api/gharial/{graph}/vertex`:

Added new optional `options` object that can be set when creating a new or
modifying an existing edge definition (POST / PUT method), as well as when
creating a new vertex collection (POST method). This was not available in
previous ArangoDB versions. The `options` object can currently contain a field
called `satellites` only.

The `satellites` field must be an array with one or more collection name strings.
If an EdgeDefinition contains a collection name that is also contained in the
`satellites` option, or if the vertex collection to add is contained in the
`satellites` option, the collection will be created as a SatelliteCollection.
Otherwise, it will be ignored. This option only takes effect using SmartGraphs.

Also see [Graph Management](http/gharial-management.html).

### Extended naming convention for databases

There is a new startup option `--database.extended-names-databases` to allow
database names to contain most UTF-8 characters.

The feature is disabled by default to ensure compatibility with existing client
drivers and applications that only support ASCII names according to the
traditional database naming convention used in previous ArangoDB versions.

If the feature is enabled, then any endpoints that contain database names in the URL 
may contain special characters that were previously not allowed
(percent-encoded). They are also to be expected in payloads that contain
database names. 

For client applications and drivers that assemble URLs containing database names,
it is required that database names are properly URL-encoded in URLs. In addition,
database names containing UTF-8 characters must be 
[NFC-normalized](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms){:target="_blank"}.
Non-NFC-normalized names will be rejected by arangod.
This is true for any REST API endpoint in arangod if the extended database naming
convention is used.

{% hint 'info' %}
The extended naming convention is an **experimental** feature in ArangoDB 3.9,
but will become the norm in a future version. Drivers and client applications
should be prepared for this feature.
{% endhint %}

Also see [Database Naming Conventions](data-modeling-naming-conventions-database-names.html).

### Overload control

Starting with version 3.9.0, ArangoDB returns an `x-arango-queue-time-seconds`
HTTP header with all responses. This header contains the most recent request
queueing/dequeuing time (in seconds) as tracked by the server's scheduler.
This value can be used by client applications and drivers to detect server
overload and react on it.

The arangod startup option `--http.return-queue-time-header` can be set to
`false` to suppress these headers in responses sent by arangod.

In a cluster, the value returned in the `x-arango-queue-time-seconds` header
is the most recent queueing/dequeuing request time of the Coordinator the
request was sent to, except if the request is forwarded by the Coordinator to
another Coordinator. In that case, the value will indicate the current
queueing/dequeuing time of the forwarded-to Coordinator.

In addition, client applications and drivers can optionally augment the
requests they send to arangod with the header `x-arango-queue-time-seconds`.
If set, the value of the header should contain the maximum server-side
queuing time (in seconds) that the client application is willing to accept.
If the header is set in an incoming request, arangod will compare the current
dequeuing time from its scheduler with the maximum queue time value contained
in the request header. If the current queueing time exceeds the value set
in the header, arangod will reject the request and return HTTP 412
(precondition failed) with the error code 21004 (queue time violated).
In a cluster, the `x-arango-queue-time-seconds` request header will be
checked on the receiving Coordinator, before any request forwarding.

### Endpoint return value changes

All collections in ArangoDB are now always in the "loaded" state. APIs return
return a collection's status will now return it as "loaded", unconditionally.

The HTTP endpoints for loading and unloading collections (i.e. HTTP PUT
`/_api/collection/<collection>/load` and HTTP PUT `/_api/collection/<collection>/unload`)
have been turned into no-ops. They still exist in ArangoDB 3.9, but do not
serve any purpose and are deprecated.

### Endpoints added

#### Support Info API

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
- `jwt`: support info API can only be accessed via superuser JWTs.
- `admin` (default): the support info API can only be accessed by admin users and superuser JWTs.
- `public`: everyone with access to the `_system` database can access the support info API.

#### License Management (Enterprise Edition)

Two endpoints were added for the new
[License Management](administration-license.html). They can be called on
single servers, Coordinators and DB-Servers:

- `GET /_admin/license`: Query license information and status.

  ```js
  {
    "features": {
      "expires": 1640255734
    },
    "license": "JD4EOk5fcx...HgdnWw==",
    "version": 1,
    "status": "good"
  }
  ```

  - `features`:
    - `expires`: Unix timestamp (seconds since January 1st, 1970 UTC)
  - `license`: Encrypted and base64-encoded license key
  - `version`: License version number
  - `status`:
    - `good`: The license is valid for more than 2 weeks.
    - `expiring`: The license is valid for less than 2 weeks.
    - `expired`: The license has expired. In this situation, no new
      Enterprise Edition features can be utilized.
    - `read-only`: The license is expired over 2 weeks. The instance is now
      restricted to read-only mode.

- `PUT /_admin/license`: Set a new license key. Expects the key as string in the
  request body (wrapped in double quotes).

  Server reply on success:

  ```json
  {
    "result": {
      "error": false,
      "code": 201
    }
  }
  ```

  If the new license expires sooner than the current one, an error will be
  returned. The query parameter `?force=true` can be set to update it anyway.

  ```json
  {
    "code": 400,
    "error": true,
    "errorMessage": "This license expires sooner than the existing. You may override this by specifying force=true with invocation.",
    "errorNum": 9007
  }
  ```

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
Please note that this option is only useful for testing and debugging 
and normally does not need any adjustment.

The HTTP REST API endpoint `PUT /_admin/log/level` can now handle the
pseudo log topic `"all"`. Setting the log level for the "all" log topic will
adjust the log level for **all existing log topics**.
For example, sending the JSON object to this API

```json
{"all":"debug"}
```

will set all log topics to log level "debug".

The HTTP REST API endpoint `POST /_open/auth` now returns JWTs with a shorter
lifetime of one hour by default. You can adjust the lifetime with the
`--server.session-timeout` startup option.

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

### Endpoints deprecated

The REST API endpoint GET `/_api/replication/logger-follow` is deprecated
since ArangoDB 3.4.0 and will be removed in a future version. Client
applications should use the endpoint `/_api/wal/tail` instead, which is
available since ArangoDB 3.3. This is a reminder to migrate to the other
endpoint.

### Endpoints removed

#### Redirects

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

```aql
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
