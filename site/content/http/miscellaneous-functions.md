---
fileID: miscellaneous-functions
title: HTTP Interface for Miscellaneous functions
weight: 2365
description: 
layout: default
---
This is an overview of ArangoDB's HTTP interface for miscellaneous functions.

<!-- lib/Admin/RestVersionHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/version:
    get:
      description: |2+
        Returns the server name and version number. The response is a JSON object
        with the following attributes:
      operationId: ' RestVersionHandler'
      parameters:
      - name: details
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, the response will contain a *details* attribute with
          additional information about included components and their versions. The
          attribute names and internals of the *details* object may vary depending on
          platform and ArangoDB version.
        in: query
      responses:
        '200':
          description: |2+
            is returned in all cases.
          content:
            application/json:
              schema:
                type: object
                properties:
                  details:
                    type: object
                    schema:
                      $ref: '#/components/schemas/version_details_struct'
                    description: |+
                      an optional JSON object with additional details. This is
                      returned only if the *details* query parameter is set to *true* in the
                      request.
                required: []
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
name: RestVersion
release: stable
version: '3.10'
---
    var response = logCurlRequest('GET', '/_api/version');
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestVersionDetails
release: stable
version: '3.10'
---
    var response = logCurlRequest('GET', '/_api/version?details=true');
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- lib/Admin/RestEngineHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/engine:
    get:
      description: |2+
        Returns the storage engine the server is configured to use.
        The response is a JSON object with the following attributes:
      operationId: ' RestEngineHandler'
      responses:
        '200':
          description: |2+
            is returned in all cases.
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
name: RestEngine
release: stable
version: '3.10'
---
    var response = logCurlRequest('GET', '/_api/engine');
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-system.js -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/time:
    get:
      description: |2+
        The call returns an object with the attribute *time*. This contains the
        current system time as a Unix timestamp with microsecond precision.
      operationId: ' RestTimeHandler'
      responses:
        '200':
          description: |2+
            Time was returned successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    schema:
                      $ref: '#/components/schemas/int64'
                    description: |+
                      the HTTP status code
                required:
                - code
      tags:
      - Administration
```



<!-- js/actions/api-system.js -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/echo:
    post:
      description: |2+
        The call returns an object with the servers request information
      operationId: ' adminEchoJs'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                body:
                  type: object
                  description: |+
                    The body can be any type and is simply forwarded.
              required:
              - body
      responses:
        '200':
          description: |2+
            Echo was returned successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  rawSuffix:
                    type: array
                    description: |+
                      A list of the percent-encoded URL path suffixes
                required:
                - rawSuffix
      tags:
      - Administration
```


```http-spec
openapi: 3.0.2
paths:
  /_admin/database/target-version:
    get:
      description: |2+
        Returns the database version that this server requires.
        The version is returned in the *version* attribute of the result.
      operationId: ' RestAdminDatabaseHandler'
      tags:
      - Administration
```



<!-- lib/Admin/RestShutdownHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/shutdown:
    delete:
      description: |2+
        This call initiates a clean shutdown sequence. Requires administrative privileges.
      operationId: ' RestShutdownHandler'
      parameters:
      - name: soft
        schema:
          type: boolean
        required: false
        description: |+
          <small>Introduced in v3.7.12, v3.8.1, v3.9.0</small>
          If set to `true`, this initiates a soft shutdown. This is only available
          on Coordinators. When issued, the Coordinator tracks a number of ongoing
          operations, waits until all have finished, and then shuts itself down
          normally. It will still accept new operations.
          This feature can be used to make restart operations of Coordinators less
          intrusive for clients. It is designed for setups with a load balancer in front
          of Coordinators. Remove the designated Coordinator from the load balancer before
          issuing the soft-shutdown. The remaining Coordinators will internally forward
          requests that need to be handled by the designated Coordinator. All other
          requests will be handled by the remaining Coordinators, reducing the designated
          Coordinator's load.
          The following types of operations are tracked
           - AQL cursors (in particular streaming cursors)
           - Transactions (in particular stream transactions)
           - Pregel runs (conducted by this Coordinator)
           - Ongoing asynchronous requests (using the `x-arango-async store` HTTP header
           - Finished asynchronous requests, whose result has not yet been
             collected
           - Queued low priority requests (most normal requests)
           - Ongoing low priority requests
        in: query
      tags:
      - Administration
```



<!-- lib/Admin/RestShutdownHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/shutdown:
    get:
      description: |2+
        <small>Introduced in: v3.7.12, v3.8.1, v3.9.0</small>
        This call reports progress about a soft Coordinator shutdown (see
        documentation of `DELETE /_admin/shutdown?soft=true`).
        In this case, the following types of operations are tracked:
         - AQL cursors (in particular streaming cursors)
         - Transactions (in particular stream transactions)
         - Pregel runs (conducted by this Coordinator)
         - Ongoing asynchronous requests (using the `x-arango-async: store` HTTP header
         - Finished asynchronous requests, whose result has not yet been
           collected
         - Queued low priority requests (most normal requests)
         - Ongoing low priority requests
        This API is only available on Coordinators.
      operationId: ' RestGetShutdownHandler'
      responses:
        '200':
          description: |2+
            The response indicates the fact that a soft shutdown is ongoing and the
            number of active operations of the various types. Once all numbers have gone
            to 0, the flag `allClear` is set and the Coordinator shuts down automatically.
          content:
            application/json:
              schema:
                type: object
                properties:
                  lowPrioQueuedRequests:
                    type: number
                    description: |+
                      Number of ongoing low priority requests.
                required:
                - lowPrioQueuedRequests
      tags:
      - Administration
```



<!-- js/actions/api-system.js -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/execute:
    post:
      description: |2+
        Executes the javascript code in the body on the server as the body
        of a function with no arguments. If you have a *return* statement
        then the return value you produce will be returned as content type
        *application/json*. If the parameter *returnAsJSON* is set to
        *true*, the result will be a JSON object describing the return value
        directly, otherwise a string produced by JSON.stringify will be
        returned.
        Note that this API endpoint will only be present if the server was
        started with the option `--javascript.allow-admin-execute true`.
        The default value of this option is `false`, which disables the execution of
        user-defined code and disables this API endpoint entirely.
        This is also the recommended setting for production.
      operationId: ' RestAdminExecuteHandler'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                body:
                  type: string
                  description: |+
                    The body to be executed.
              required:
              - body
      responses:
        '200':
          description: |2+
            is returned when everything went well, or if a timeout occurred. In the
            latter case a body of type application/json indicating the timeout
            is returned. depending on *returnAsJSON* this is a json object or a plain string.
        '403':
          description: |2+
            is returned if ArangoDB is not running in cluster mode.
      tags:
      - Administration
```



<!-- /_admin/status -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/status:
    get:
      description: |2+
        Returns status information about the server.
      operationId: ' RestStatusHandler'
      responses:
        '200':
          description: |2+
            Status information was returned successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  agent:
                    type: object
                    schema:
                      $ref: '#/components/schemas/get_admin_status_agent'
                    description: |+
                      Information about the Agents.
                      *Cluster only* (Agents)
                required: []
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
name: RestAdminStatus_cluster
release: stable
version: '3.10'
---
    var url = "/_admin/status";
    var response = logCurlRequest("GET", url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

