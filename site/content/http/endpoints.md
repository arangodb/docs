---
fileID: endpoints
title: HTTP Interface for Endpoints
weight: 2285
description: 
layout: default
---
The API `/_api/endpoint` is *deprecated*. For cluster mode there
is `/_api/cluster/endpoints` to find all current Coordinator endpoints
(see below).

The ArangoDB server can listen for incoming requests on multiple *endpoints*.

The endpoints are normally specified either in ArangoDB's configuration
file or on the command-line, using the "--server.endpoint" option.
The default endpoint for ArangoDB is *tcp://127.0.0.1:8529* or
*tcp://localhost:8529*.

Please note that all endpoint management operations can only be accessed via
the default database (*_system*) and none of the other databases.

## Asking about Endpoints via HTTP

<!-- js/actions/api-cluster.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/cluster/endpoints:
    get:
      description: |2+
        Returns an object with an attribute `endpoints`, which contains an
        array of objects, which each have the attribute `endpoint`, whose value
        is a string with the endpoint description. There is an entry for each
        Coordinator in the cluster. This method only works on Coordinators in
        cluster mode. In case of an error the `error` attribute is set to
        `true`.
      operationId: ' handleCommandEndpoints:listClusterEndpoints'
      responses:
        '200':
          description: |2+
            is returned when everything went well.
          content:
            application/json:
              schema:
                type: object
                properties:
                  endpoints:
                    type: array
                    schema:
                      $ref: '#/components/schemas/cluster_endpoints_struct'
                    description: |+
                      A list of active cluster endpoints.
                required:
                - endpoints
      tags:
      - Administration
```



<!-- arangod/RestHandler/RestEndpointHandler.h -->
```http-spec
openapi: 3.0.2
paths:
  /_api/endpoint:
    get:
      description: |2+
        Returns an array of all configured endpoints the server is listening on.
        The result is a JSON array of JSON objects, each with `"entrypoint"` as
        the only attribute, and with the value being a string describing the
        endpoint.
        **Note**: retrieving the array of all endpoints is allowed in the system database
        only. Calling this action in any other database will make the server return
        an error.
      operationId: ' retrieveEndpoints'
      responses:
        '200':
          description: |2+
            is returned when the array of endpoints can be determined successfully.
        '400':
          description: |2+
            is returned if the action is not carried out in the system database.
      tags:
      - Administration
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestEndpointGet
release: stable
version: '3.10'
---
    var url = "/_api/endpoint";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

