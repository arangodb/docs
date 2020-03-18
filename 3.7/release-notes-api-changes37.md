---
layout: default
description: ArangoDB v3.7 Release Notes API Changes
---
API Changes in ArangoDB 3.7
===========================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.7.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.7.

### HTTP REST API endpoints added

### HTTP REST API endpoints augmented

The REST API endpoint for inserting documents at POST `/_api/document/<collection>`
will now handle the URL parameter `overwriteMode`. If set to a value of `update`,
this will turn the insert operation into an update operation in case of a primary
key unique constraint violation. If set to a value of `replace`, it will turn the
insert operation into a replace operation in case of a primary key unique constraint
violation. If `overwriteMode` is not set, the insert will fail in case of a primary
key unique constraint violation unless the `overwrite` URL parameter is set. Doing
so will turn the insert into a replace operation.

The REST API endpoints for creating collections at POST `/_api/collection` as well
as listing and changing collection properties at PUT/GET
`/_api/collection/<collection>/properties` will now make use of the additional
attribute `validation`. The attribute can be used so specify document
validation at collection level. See
[Schema Validation](data-modeling-documents-schema-validation.html).

The REST API endpoint for creating a graph at POST `/_api/gharial` is now able to
accept the string value `satellite` as an option parameter for the attribute
`replicationFactor`. Before only numeric values were allowed. Setting the
`replicationFactor` to `satellite` will lead to a Satellite Graph being created.
Satellite Graph creation will ignore the option parameters `numberOfShards`, 
`minReplicationFactor` and `writeConcern`, as all of them will be set automatically.
Additionally, the REST API endpoint for reading the graph definition of a graph at
GET `/_api/gharial/{graph}` will include an additional attribute called `isSatellite`
(boolean).

### HTTP REST API endpoints moved

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

### HTTP REST API endpoints removed

The REST API endpoint at `/_admin/aql/reload` has been removed in ArangoDB 3.7.
There is no necessity to call this endpoint from a driver or a client application
directly.
