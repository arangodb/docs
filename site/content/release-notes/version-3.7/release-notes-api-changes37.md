---
fileID: release-notes-api-changes37
title: API Changes in ArangoDB 3.7
weight: 11675
description: 
layout: default
---
This document summarizes the HTTP API changes and other API changes in ArangoDB 3.7.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.7.

## UTF-8 validation

The ArangoDB server will now perform more strict UTF-8 string validation for
incoming JSON and VelocyPack data. Attribute names or string attribute values
with incorrectly encoded UTF-8 sequences will be rejected by default, and
incoming requests containing such invalid data will be responded to with errors
by default.

In case an ArangoDB deployment already contains UTF-8 data from previous
versions, this will be a breaking change. For this case, there is the startup
option `--server.validate-utf8-strings` which can be set to `false` in order to
ensure operability until any invalid UTF-8 string data has been fixed.

## Metrics

The following existing metrics for monitoring that are exposed via the HTTP
REST endpoint `/_admin/metrics` have been renamed in ArangoDB 3.7:

- `agency_agent_read_no_leader`
- `agency_agent_read_ok`
- `agency_agent_write_hist`
- `agency_agent_write_no_leader`
- `agency_agent_write_ok`

The new names are:

- `arangodb_agency_agent_read_no_leader`
- `arangodb_agency_agent_read_ok`
- `arangodb_agency_agent_write_hist`
- `arangodb_agency_agent_write_no_leader`
- `arangodb_agency_agent_write_ok`

This change was made to put the metrics into the "arangodb" namespace, so
that metrics from different systems can unambiguously combined into a single
monitoring system.

The REST endpoint `/_admin/metrics` also returns additional metrics in 3.7,
compared to the list of metrics that it returned in 3.6.

## HTTP RESTful API

### Privilege changes

The access privileges for the REST API endpoint at `/_admin/cluster/numberOfServers`
can now be controlled via the `--server.harden` startup option. The behavior is
as follows:

- for HTTP GET requests, all authenticated users can access the API if `--server.harden`
  is `false` (which is the default).
- for HTTP GET requests, only admin users can access the API if `--server.harden`
  is `true`. This is a change compared to previous versions.
- for HTTP PUT requests, only admin users can access the API, regardless of the value
  of `--server.harden`.

### Endpoints API return value changes

The REST API endpoint at `/_api/cluster/endpoints` will now return HTTP 501 (Not
implemented) on single server instead of HTTP 403 (Forbidden), which it returned
previously.

When invoked via the PUT HTTP verb with an empty JSON object, the REST API
endpoint at `/_admin/cluster/numberOfServers` will now return with the
following response body:

```json
{"error":false,"code":200}
```

In previous releases, calling that endpoint with an empty JSON object as
the request body returned a JSON response that was just `true`.

### Precondition failed error message changes

The REST API endpoints for updating, replacing and removing documents using a
revision ID guard value now may return a different error message string in case
the document exists on the server with a revision ID value other than the
specified one. The API still returns HTTP 412, and ArangoDB error code 1200 as
previously, but the error message string in the `errorMessage` return value
attribute may change from "precondition failed" to "conflict",
"write-write conflict" or other values.

### REST endpoints added

The following REST API endpoints have been added in 3.7:

- HTTP POST `/_admin/server/tls`: this endpoint can be used to change the 
  TLS keyfile (secret key as well as public certificates) at run time. The API
  basically makes the `arangod` server reload the keyfile from disk.
- HTTP POST `/_admin/server/jwt`: can be used to
  [reload the JWT secrets](../../http/general#hot-reload-of-jwt-secrets)
  of a local arangod process without having to restart it (hot-reload).
  This may be used to roll out new JWT secrets throughout an ArangoDB cluster.
  This endpoint is available only in the Enterprise Edition.
- HTTP POST `/_admin/server/encryption` can be used to
  [reload the user-supplied key(s)](../../http/administration-monitoring/#encryption-at-rest)
  used for encryption at rest, after they have been changed on disk.
  This endpoint is available only in the Enterprise Edition.

Using these endpoints requires superuser privileges.

### REST endpoints augmented

The REST API endpoint for inserting documents at POST `/_api/document/<collection>`
will now handle the URL parameter `overwriteMode`.

This URL parameter supports the following values:

- `"ignore"`: if a document with the specified `_key` value exists already,
  nothing will be done and no write operation will be carried out. The
  insert operation will return success in this case. This mode does not
  support returning the old document version using the `returnOld`
  attribute. `returnNew` will only set the `new` attribute in the response
  if a new document was inserted.
- `"replace"`: if a document with the specified `_key` value exists already,
  it will be overwritten with the specified document value. This mode will
  also be used when no overwrite mode is specified but the `overwrite`
  flag is set to `true`.
- `"update"`: if a document with the specified `_key` value exists already,
  it will be patched (partially updated) with the specified document value.
- `"conflict"`: if a document with the specified `_key` value exists already,
  return a unique constraint violation error so that the insert operation
  fails. This is also the default behavior in case the overwrite mode is
  not set, and the *overwrite* flag is *false* or not set either.

If `overwriteMode` is not set, the behavior is as follows:

- if the `overwrite` URL parameter is not set, the insert will implicitly
  use the `"conflict"` overwrite mode, i.e. the insert will fail in case of a
  primary key unique constraint violation.
- if the `overwrite` URL parameter is set to true, the insert will implicitly
  use the `"replace"` overwrite mode, i.e. the insert will replace the existing
  document in case a primary key unique constraint violation occurs.

The main use case of inserting documents with overwrite mode `"ignore"` is
to make sure that certain documents exist in the cheapest possible way.
In case the target document already exists, the `"ignore"` mode is most
efficient, as it will not retrieve the existing document from storage and
not write any updates to it.

Note that operations with `overwrite` or `overwriteMode` parameter require
a `_key` attribute in the request payload, therefore they can only be performed
on collections sharded by `_key`.

The REST API endpoints for creating collections at POST `/_api/collection` as well
as listing and changing collection properties at PUT/GET
`/_api/collection/<collection>/properties` will now make use of the additional
attribute `schema`. The attribute can be used so specify document schema
validation at collection level. See
[Schema Validation](../../getting-started/data-modeling/documents/data-modeling-documents-schema-validation).

The REST API endpoint for creating a graph at POST `/_api/gharial` is now able
to accept the string value `"satellite"` as an option parameter for the
attribute `replicationFactor`. Only numeric values were allowed before. Setting
the `replicationFactor` to `"satellite"` will lead to a SatelliteGraph being
created. SatelliteGraph creation will ignore the option parameters
`numberOfShards`, `minReplicationFactor` and `writeConcern`, as all of them
will be set automatically. Additionally, the REST API endpoint for reading the
graph definitions of all graphs at GET `GET /_api/gharial` or a graph
definition of a single graph at `/_api/gharial/{graph}` will include an
additional boolean attribute called `isSatellite`.

The REST API endpoint for creating a graph at POST `/_api/gharial` accepts a
new boolean parameter `isDisjoint`. In combination with `smartGraphAttribute`
it allows to create the newly introduced graph type **Disjoint SmartGraph**.
`isDisjoint` defaults to `false`, which will create a regular **SmartGraph**.
Additionally, the REST API endpoint for reading the graph definitions of all
graphs at GET `/_api/gharial` or a graph definition of a single graph at
GET `/_api/gharial/{graph}` will include an additional boolean attribute
called `isDisjoint` in case of **Disjoint SmartGraphs**.

The REST endpoint `/_admin/metrics` also returns additional metrics in 3.7,
compared to the list of metrics that it returned in 3.6.

### REST endpoints moved

The following existing REST APIs have moved in ArangoDB 3.7 to improve API
naming consistency:

- the endpoint at `/_admin/clusterNodeVersion` is now merely redirecting requests
  to the `/_admin/cluster/nodeVersion` endpoint. The new endpoint will handle
  incoming requests in the same way the old endpoint did.
- the endpoint at `/_admin/clusterNodeEngine` is now merely redirecting requests
  to the endpoint `/_admin/cluster/nodeEngine`. The new endpoint will handle
  incoming requests in the same way the old endpoint did.
- the endpoint at `/_admin/clusterNodeStats` is now merely redirecting requests
  to the endpoint `/_admin/cluster/nodeStatistics`. The new endpoint will handle
  incoming requests in the same way the old endpoint did.
- the endpoint at `/_admin/clusterStatistics` is now merely redirecting requests
  to the endpoint `/_admin/cluster/statistics`. The new endpoint will handle
  incoming requests in the same way the old endpoint did.

The above endpoints are part of ArangoDB's exposed REST API, however, they are
not supposed to be called directly by drivers or client

### REST endpoints removed

The REST API endpoint at `/_admin/aql/reload` has been removed in ArangoDB 3.7.
There is no necessity to call this endpoint from a driver or a client application
directly.

The REST API endpoint at `/_api/collection/<collection>/rotate` has been removed
in ArangoDB 3.7. This endpoint was previously only available for the MMFiles
storage engine, but not for the RocksDB storage engine.

## JavaScript API

### Functions removed

The `rotate` function has been removed on the ArangoCollection object. This
means the following JavaScript code will not work in ArangoDB 3.7, neither in
the ArangoShell nor in arangod (when using Foxx):

```js
db.<collection>.rotate();
```

The `rotate` function was previously only supported for the MMFiles storage
engine, but not for the RocksDB storage engine.

## ArangoDB Server Environment Variables

### Variables added

The following [ArangoDB Server environment variables](../../programs-tools/arangodb-server/programs-arangod-env-vars)
have been added:

- `ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY` can be used to override the
  automatic detection of the total amount of RAM present on the system.
- `ARANGODB_OVERRIDE_DETECTED_NUMBER_OF_CORES` can be used to override the
  automatic detection of the number of CPU cores present on the system.
- `ARANGODB_OVERRIDE_CRASH_HANDLER` can be used to toggle the presence
  of the built-in crash handler on Linux deployments.
