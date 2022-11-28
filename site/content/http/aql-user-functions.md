---
fileID: aql-user-functions
title: HTTP Interface for AQL User Functions Management
weight: 2140
description: 
layout: default
---
## AQL User Functions Management
This is an introduction to ArangoDB's HTTP interface for managing AQL
user functions. AQL user functions are a means to extend the functionality
of ArangoDB's query language (AQL) with user-defined JavaScript code.
 
For an overview of how AQL user functions and their implications, please refer to
the [Extending AQL](../aql/user-functions/) chapter.

The HTTP interface provides an API for adding, deleting, and listing
previously registered AQL user functions.

All user functions managed through this interface will be stored in the 
system collection *_aqlfunctions*. Documents in this collection should not
be accessed directly, but only via the dedicated interfaces.

<!-- js/actions/api-aqlfunction.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/aqlfunction:
    post:
      description: |2+
        In case of success, HTTP 200 is returned.
        If the function isn't valid etc. HTTP 400 including a detailed error message will be returned.
      operationId: ' RestAqlUserFunctionsHandler:create'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: |+
                    the fully qualified name of the user functions.
                code:
                  type: string
                  description: |+
                    a string representation of the function body.
                isDeterministic:
                  type: boolean
                  description: |+
                    an optional boolean value to indicate whether the function
                    results are fully deterministic (function return value solely depends on
                    the input value and return value is the same for repeated calls with same
                    input). The *isDeterministic* attribute is currently not used but may be
                    used later for optimizations.
              required:
              - name
              - code
      responses:
        '200':
          description: |2+
            If the function already existed and was replaced by the
            call, the server will respond with *HTTP 200*.
        '201':
          description: |2+
            If the function can be registered by the server, the server will respond with
            *HTTP 201*.
        '400':
          description: |2+
            If the JSON representation is malformed or mandatory data is missing from the
            request, the server will respond with *HTTP 400*.
          content:
            application/json:
              schema:
                type: object
                properties:
                  errorNum:
                    type: integer
                    schema:
                      $ref: '#/components/schemas/int64'
                    description: |+
                      the server error number
                required:
                - errorNum
      tags:
      - AQL
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestAqlfunctionCreate
release: stable
version: '3.10'
---
  var url = "/_api/aqlfunction";
  var body = {
    name: "myfunctions::temperature::celsiustofahrenheit",
    code : "function (celsius) { return celsius * 1.8 + 32; }",
    isDeterministic: true
  };
  var response = logCurlRequest('POST', url, body);
  assert(response.code === 200    response.code === 201    response.code === 202);
  logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-aqlfunction.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/aqlfunction/{name}:
    delete:
      description: |2+
        Removes an existing AQL user function or function group, identified by *name*.
      operationId: ' RestAqlUserFunctionsHandler:Remove'
      parameters:
      - name: name
        schema:
          type: string
        required: true
        description: |+
          the name of the AQL user function.
        in: path
      - name: group
        schema:
          type: string
        required: false
        description: |+
          - *true* The function name provided in *name* is treated as
            a namespace prefix, and all functions in the specified namespace will be deleted.
            The returned number of deleted functions may become 0 if none matches the string.
          - *false* The function name provided in *name* must be fully
            qualified, including any namespaces. If none matches the *name*, HTTP 404 is returned.
        in: query
      responses:
        '200':
          description: |2+
            If the function can be removed by the server, the server will respond with
            *HTTP 200*.
        '400':
          description: |2+
            If the user function name is malformed, the server will respond with *HTTP 400*.
        '404':
          description: |2+
            If the specified user user function does not exist, the server will respond with *HTTP 404*.
          content:
            application/json:
              schema:
                type: object
                properties:
                  errorNum:
                    type: integer
                    schema:
                      $ref: '#/components/schemas/int64'
                    description: |+
                      the server error number
                required:
                - errorNum
      tags:
      - AQL
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestAqlfunctionDelete
release: stable
version: '3.10'
---
  var url = "/_api/aqlfunction/square::x::y";
  var body = {
    name : "square::x::y",
    code : "function (x) { return x*x; }"
  };
  db._connection.POST("/_api/aqlfunction", body);
  var response = logCurlRequest('DELETE', url);
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
name: RestAqlfunctionDeleteFails
release: stable
version: '3.10'
---
  var url = "/_api/aqlfunction/myfunction::x::y";
  var response = logCurlRequest('DELETE', url);
  assert(response.code === 404);
  logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-aqlfunction.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/aqlfunction:
    get:
      description: |2+
        Returns all registered AQL user functions.
        The call will return a JSON array with status codes and all user functions found under *result*.
      operationId: ' RestAqlUserFunctionsHandler:List'
      parameters:
      - name: namespace
        schema:
          type: string
        required: false
        description: |+
          Returns all registered AQL user functions from namespace *namespace* under *result*.
        in: query
      responses:
        '200':
          description: |2+
            on success *HTTP 200* is returned.
        '400':
          description: |2+
            If the user function name is malformed, the server will respond with *HTTP 400*.
          content:
            application/json:
              schema:
                type: object
                properties:
                  errorNum:
                    type: integer
                    schema:
                      $ref: '#/components/schemas/int64'
                    description: |+
                      the server error number
                required:
                - errorNum
      tags:
      - AQL
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestAqlfunctionsGetAll
release: stable
version: '3.10'
---
  var url = "/_api/aqlfunction/test";
  var response = logCurlRequest('GET', url);
  assert(response.code === 200);
  logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

