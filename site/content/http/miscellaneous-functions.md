---
fileID: miscellaneous-functions
title: HTTP Interface for Miscellaneous functions
weight: 2275
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
          description: |2
            is returned in all cases.
          content:
            application/json:
              schema:
                type: object
                properties:
                  server:
                    type: string
                    description: |+
                      will always contain *arango*
                  version:
                    type: string
                    description: |+
                      the server version string. The string has the format
                      "*major*.*minor*.*sub*". *major* and *minor* will be numeric, and *sub*
                      may contain a number or a textual version.
                  details:
                    $ref: '#/components/schemas/version_details_struct'
                    description: |+
                      an optional JSON object with additional details. This is
                      returned only if the *details* query parameter is set to *true* in the
                      request.
                required:
                - server
                - version
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
          description: |2
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
          description: |2
            Time was returned successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: boolean
                    description: |+
                      boolean flag to indicate whether an error occurred (*false* in this case)
                  code:
                    type: integer
                    format: int64
                    description: |+
                      the HTTP status code
                required:
                - error
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
          description: |2
            Echo was returned successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  authorized:
                    type: boolean
                    description: |+
                      Whether the session is authorized
                  user:
                    type: string
                    description: |+
                      The name of the current user that sent this request
                  isAdminUser:
                    type: boolean
                    description: |+
                      Whether the current user is an administrator
                  database:
                    type: string
                    description: |+
                      The name of the database this request was executed on
                  url:
                    type: string
                    description: |+
                      The raw request URL
                  protocol:
                    type: string
                    description: |+
                      The transport protocol, one of `"http"`, `"https"`, `"velocystream"`
                  portType:
                    type: string
                    description: |+
                      The type of the socket, one of `"tcp/ip"`, `"unix"`, `"unknown"`
                  server:
                    $ref: '#/components/schemas/admin_echo_server_struct'
                    description: |+
                      Attributes of the server connection
                  client:
                    $ref: '#/components/schemas/admin_echo_client_struct'
                    description: |+
                      Attributes of the client connection
                  internals:
                    type: object
                    description: |+
                      Contents of the server internals struct
                  prefix:
                    type: object
                    description: |+
                      The prefix of the database
                  headers:
                    type: object
                    description: |+
                      The list of the HTTP headers you sent
                  requestType:
                    type: string
                    description: |+
                      The HTTP method that was used for the request (`"POST"`). The endpoint can be
                      queried using other verbs, too (`"GET"`, `"PUT"`, `"PATCH"`, `"DELETE"`).
                  requestBody:
                    type: string
                    description: |+
                      Stringified version of the request body you sent
                  rawRequestBody:
                    type: object
                    description: |+
                      The sent payload as a JSON-encoded Buffer object
                  parameters:
                    type: object
                    description: |+
                      An object containing the query parameters
                  cookies:
                    type: object
                    description: |+
                      A list of the cookies you sent
                  suffix:
                    type: array
                    items:
                      type: string
                    description: |+
                      A list of the decoded URL path suffixes. You can query the endpoint with
                      arbitrary suffixes, e.g. `/_admin/echo/foo/123`
                  rawSuffix:
                    type: array
                    items:
                      type: string
                    description: |+
                      A list of the percent-encoded URL path suffixes
                required:
                - authorized
                - user
                - isAdminUser
                - database
                - url
                - protocol
                - portType
                - server
                - client
                - internals
                - prefix
                - headers
                - requestType
                - requestBody
                - rawRequestBody
                - parameters
                - cookies
                - suffix
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
      responses:
        '200':
          description: |2
            Is returned in all cases.
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
      responses:
        '200':
          description: |2
            is returned in all cases, `OK` will be returned in the result buffer on success.
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
          description: |2
            The response indicates the fact that a soft shutdown is ongoing and the
            number of active operations of the various types. Once all numbers have gone
            to 0, the flag `allClear` is set and the Coordinator shuts down automatically.
          content:
            application/json:
              schema:
                type: object
                properties:
                  softShutdownOngoing:
                    type: boolean
                    description: |+
                      Whether a soft shutdown of the Coordinator is in progress.
                  AQLcursors:
                    type: number
                    description: |+
                      Number of AQL cursors that are still active.
                  transactions:
                    type: number
                    description: |+
                      Number of ongoing transactions.
                  pendingJobs:
                    type: number
                    description: |+
                      Number of ongoing asynchronous requests.
                  doneJobs:
                    type: number
                    description: |+
                      Number of finished asynchronous requests, whose result has not yet been collected.
                  pregelConductors:
                    type: number
                    description: |+
                      Number of ongoing Pregel jobs.
                  lowPrioOngoingRequests:
                    type: number
                    description: |+
                      Number of queued low priority requests.
                  lowPrioQueuedRequests:
                    type: number
                    description: |+
                      Number of ongoing low priority requests.
                required:
                - softShutdownOngoing
                - AQLcursors
                - transactions
                - pendingJobs
                - doneJobs
                - pregelConductors
                - lowPrioOngoingRequests
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
          description: |2
            is returned when everything went well, or if a timeout occurred. In the
            latter case a body of type application/json indicating the timeout
            is returned. depending on *returnAsJSON* this is a json object or a plain string.
        '403':
          description: |2
            is returned if ArangoDB is not running in cluster mode.
        '404':
          description: |2
            is returned if ArangoDB was not compiled for cluster operation.
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
          description: |2
            Status information was returned successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  server:
                    type: string
                    description: |+
                      Always `"arango"`.
                  license:
                    type: string
                    description: |+
                      ArangoDB Edition, either `"community"` or `"enterprise"`.
                  version:
                    type: string
                    description: |+
                      The server version as a string.
                  mode:
                    type: string
                    description: |+
                      Either `"server"` or `"console"`. **Deprecated**, use `operationMode` instead.
                  operationMode:
                    type: string
                    description: |+
                      Either `"server"` or `"console"`.
                  foxxApi:
                    type: boolean
                    description: |+
                      Whether the Foxx API is enabled.
                  host:
                    type: string
                    description: |+
                      A host identifier defined by the `HOST` or `NODE_NAME` environment variable,
                      or a fallback value using a machine identifier or the cluster/Agency address.
                  hostname:
                    type: string
                    description: |+
                      A hostname defined by the `HOSTNAME` environment variable.
                  pid:
                    type: number
                    description: |+
                      The process ID of _arangod_.
                  serverInfo:
                    $ref: '#/components/schemas/get_admin_status_server_info'
                    description: |+
                      Information about the server status.
                  agency:
                    $ref: '#/components/schemas/get_admin_status_agency'
                    description: |+
                      Information about the Agency.
                      *Cluster only* (Coordinators and DB-Servers).
                  coordinator:
                    $ref: '#/components/schemas/get_admin_status_coordinator'
                    description: |+
                      Information about the Coordinators.
                      *Cluster only* (Coordinators)
                  agent:
                    $ref: '#/components/schemas/get_admin_status_agent'
                    description: |+
                      Information about the Agents.
                      *Cluster only* (Agents)
                required:
                - server
                - license
                - version
                - mode
                - operationMode
                - foxxApi
                - host
                - pid
                - serverInfo
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

