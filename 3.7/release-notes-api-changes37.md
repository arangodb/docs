---
layout: default
description: ArangoDB v3.7 Release Notes API Changes
---
API Changes in ArangoDB 3.7
===========================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.7.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.7.

### HTTP REST API endpoint return value changes

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

### HTTP REST API endpoints added

### HTTP REST API endpoints augmented

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

The REST API endpoints for creating collections at POST `/_api/collection` as well
as listing and changing collection properties at PUT/GET
`/_api/collection/<collection>/properties` will now make use of the additional
attribute `validation`. The attribute can be used so specify document
validation at collection level. See
[Schema Validation](data-modeling-documents-schema-validation.html).

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
