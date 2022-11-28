---
fileID: aql-query-cursor-accessing-cursors
title: Accessing Cursors via HTTP
weight: 2125
description: 
layout: default
---
<!-- js/actions/api-cursor.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/cursor:
    post:
      description: |2+
        The query details include the query string plus optional query options and
        bind parameters. These values need to be passed in a JSON representation in
        the body of the POST request.
      operationId: ' createQueryCursor'
      parameters:
      - name: x-arango-allow-dirty-read
        schema:
          type: boolean
        required: false
        description: |+
          Set this header to `true` to allow the Coordinator to ask any shard replica for
          the data, not only the shard leader. This may result in "dirty reads".
          The header is ignored if this operation is part of a Stream Transaction
          (`x-arango-trx-id` header). The header set when creating the transaction decides
          about dirty reads for the entire transaction, not the individual read operations.
        in: header
      - name: x-arango-trx-id
        schema:
          type: string
        required: false
        description: |+
          To make this operation a part of a Stream Transaction, set this header to the
          transaction ID returned by the `POST /_api/transaction/begin` call.
        in: header
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                query:
                  type: string
                  description: |+
                    contains the query string to be executed
                count:
                  type: boolean
                  description: |+
                    indicates whether the number of documents in the result set should be returned in
                    the "count" attribute of the result.
                    Calculating the "count" attribute might have a performance impact for some queries
                    in the future so this option is turned off by default, and "count"
                    is only returned when requested.
                batchSize:
                  type: integer
                  description: |+
                    maximum number of result documents to be transferred from
                    the server to the client in one roundtrip. If this attribute is
                    not set, a server-controlled default value will be used. A *batchSize* value of
                    *0* is disallowed.
                ttl:
                  type: integer
                  description: |+
                    The time-to-live for the cursor (in seconds). If the result set is small enough
                    (less than or equal to `batchSize`) then results are returned right away.
                    Otherwise they are stored in memory and will be accessible via the cursor with
                    respect to the `ttl`. The cursor will be removed on the server automatically
                    after the specified amount of time. This is useful to ensure garbage collection
                    of cursors that are not fully fetched by clients. If not set, a server-defined
                    value will be used (default 30 seconds).
                cache:
                  type: boolean
                  description: |+
                    flag to determine whether the AQL query results cache
                    shall be used. If set to *false*, then any query cache lookup will be skipped
                    for the query. If set to *true*, it will lead to the query cache being checked
                    for the query if the query cache mode is either *on* or *demand*.
                memoryLimit:
                  type: integer
                  description: |+
                    the maximum number of memory (measured in bytes) that the query is allowed to
                    use. If set, then the query will fail with error "resource limit exceeded" in
                    case it allocates too much memory. A value of *0* indicates that there is no
                    memory limit.
                bindVars:
                  type: array
                  description: |+
                    key/value pairs representing the bind parameters.
                options:
                  type: object
                  schema:
                    $ref: '#/components/schemas/post_api_cursor_opts'
                  description: |+
                    key/value object with extra options for the query.
              required:
              - query
      responses:
        '201':
          description: |2+
            is returned if the result set can be created by the server.
        '400':
          description: |2+
            is returned if the JSON representation is malformed or the query specification is
            missing from the request.
            If the JSON representation is malformed or the query specification is
            missing from the request, the server will respond with *HTTP 400*.
            The body of the response will contain a JSON object with additional error
            details. The object has the following attributes
        '404':
          description: |2+
            The server will respond with *HTTP 404* in case a non-existing collection is
            accessed in the query.
        '405':
          description: |2+
            The server will respond with *HTTP 405* if an unsupported HTTP method is used.
        '410':
          description: "\nThe server will respond with *HTTP 410* if a server which\
            \ processes the query\nor is the leader for a shard which is used in the\
            \ query stops responding, but \nthe connection has not been closed.\n\n"
          content:
            application/json:
              schema:
                type: object
                properties:
                  errorMessage:
                    type: string
                    schema:
                      $ref: '#/components/schemas/string'
                    description: |+
                      A descriptive error message.
                      If the query specification is complete, the server will process the query. If an
                      error occurs during query processing, the server will respond with *HTTP 400*.
                      Again, the body of the response will contain details about the error.
                required:
                - errorMessage
      tags:
      - Cursors
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCursorCreateCursorForLimitReturnSingle
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.save({"hello1":"world1"});
    db.products.save({"hello2":"world1"});
    var url = "/_api/cursor";
    var body = {
      query: "FOR p IN products LIMIT 2 RETURN p",
      count: true,
      batchSize: 2
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
  ~ db._drop(cn);
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
name: RestCursorCreateCursorForLimitReturn
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.save({"hello1":"world1"});
    db.products.save({"hello2":"world1"});
    db.products.save({"hello3":"world1"});
    db.products.save({"hello4":"world1"});
    db.products.save({"hello5":"world1"});
    var url = "/_api/cursor";
    var body = {
      query: "FOR p IN products LIMIT 5 RETURN p",
      count: true,
      batchSize: 2
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
  ~ db._drop(cn);
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
name: RestCursorCreateCursorOption
release: stable
version: '3.10'
---
    var url = "/_api/cursor";
    var body = {
      query: "FOR i IN 1..1000 FILTER i > 500 LIMIT 10 RETURN i",
      count: true,
      options: {
        fullCount: true
      }
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
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
name: RestCursorOptimizerRules
release: stable
version: '3.10'
---
    var url = "/_api/cursor";
    var body = {
      query: "FOR i IN 1..10 LET a = 1 LET b = 2 FILTER a + b == 3 RETURN i",
      count: true,
      options: {
        maxPlans: 1,
        optimizer: {
          rules: [ "-all", "+remove-unnecessary-filters" ]
        }
      }
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
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
name: RestCursorProfileQuery
release: stable
version: '3.10'
---
    var url = "/_api/cursor";
    var body = {
      query: "LET s = SLEEP(0.25) LET t = SLEEP(0.5) RETURN 1",
      count: true,
      options: {
        profile: 2
      }
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
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
name: RestCursorDeleteQuery
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.save({"hello1":"world1"});
    db.products.save({"hello2":"world1"});
    var url = "/_api/cursor";
    var body = {
      query: "FOR p IN products REMOVE p IN products"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    assert(JSON.parse(response.body).extra.stats.writesExecuted === 2);
    assert(JSON.parse(response.body).extra.stats.writesIgnored === 0);
    logJsonResponse(response);
  ~ db._drop(cn);
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
name: RestCursorDeleteIgnore
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.save({ _key: "foo" });
    var url = "/_api/cursor";
    var body = {
      query: "REMOVE 'bar' IN products OPTIONS { ignoreErrors: true }"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    assert(JSON.parse(response.body).extra.stats.writesExecuted === 0);
    assert(JSON.parse(response.body).extra.stats.writesIgnored === 1);
    logJsonResponse(response);
  ~ db._drop(cn);
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
name: RestCursorCreateCursorMissingBody
release: stable
version: '3.10'
---
    var url = "/_api/cursor";
    var response = logCurlRequest('POST', url, '');
    assert(response.code === 400);
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
name: RestCursorCreateCursorUnknownCollection
release: stable
version: '3.10'
---
    var url = "/_api/cursor";
    var body = {
      query: "FOR u IN unknowncoll LIMIT 2 RETURN u",
      count: true,
      batchSize: 2
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 404);
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
name: RestCursorDeleteQueryFail
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.save({ _key: "bar" });
    var url = "/_api/cursor";
    var body = {
      query: "REMOVE 'foo' IN products"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 404);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-cursor.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/cursor/{cursor-identifier}:
    post:
      description: |2+
        If the cursor is still alive, returns an object with the following
        attributes:
        - *id*: a *cursor-identifier*
        - *result*: a list of documents for the current batch
        - *hasMore*: *false* if this was the last batch
        - *count*: if present the total number of elements
        - *code*: an HTTP status code
        - *error*: a boolean flag to indicate whether an error occurred
        - *errorNum*: a server error number (if *error* is *true*)
        - *errorMessage*: a descriptive error message (if *error* is *true*)
        - *extra*: an object with additional information about the query result, with
          the nested objects *stats* and *warnings*. Only delivered as part of the last
          batch in case of a cursor with the *stream* option enabled.
        Note that even if *hasMore* returns *true*, the next call might
        still return no documents. If, however, *hasMore* is *false*, then
        the cursor is exhausted.  Once the *hasMore* attribute has a value of
        *false*, the client can stop.
      operationId: ' modifyQueryCursorPost'
      parameters:
      - name: cursor-identifier
        schema:
          type: string
        required: true
        description: |+
          The name of the cursor
        in: path
      responses:
        '200':
          description: |2+
            The server will respond with *HTTP 200* in case of success.
        '400':
          description: |2+
            If the cursor identifier is omitted, the server will respond with *HTTP 404*.
        '404':
          description: |2+
            If no cursor with the specified identifier can be found, the server will respond
            with *HTTP 404*.
        '410':
          description: "\nThe server will respond with *HTTP 410* if a server which\
            \ processes the query\nor is the leader for a shard which is used in the\
            \ query stops responding, but \nthe connection has not been closed.\n\n"
      tags:
      - Cursors
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCursorPostForLimitReturnCont
release: stable
version: '3.10'
---
    var url = "/_api/cursor";
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.save({"hello1":"world1"});
    db.products.save({"hello2":"world1"});
    db.products.save({"hello3":"world1"});
    db.products.save({"hello4":"world1"});
    db.products.save({"hello5":"world1"});
    var url = "/_api/cursor";
    var body = {
      query: "FOR p IN products LIMIT 5 RETURN p",
      count: true,
      batchSize: 2
    };
    var response = logCurlRequest('POST', url, body);
    var body = response.body.replace(/\\/g, '');
    var _id = JSON.parse(body).id;
    response = logCurlRequest('POST', url + '/' + _id, '');
    assert(response.code === 200);
    logJsonResponse(response);
  ~ db._drop(cn);
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
name: RestCursorPostMissingCursorIdentifier
release: stable
version: '3.10'
---
    var url = "/_api/cursor";
    var response = logCurlRequest('POST', url, '');
    assert(response.code === 400);
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
name: RestCursorPostInvalidCursorIdentifier
release: stable
version: '3.10'
---
    var url = "/_api/cursor/123123";
    var response = logCurlRequest('POST', url, '');
    assert(response.code === 404);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-cursor.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/cursor/{cursor-identifier}:
    put:
      description: |2+
        If the cursor is still alive, returns an object with the following
        attributes:
        - *id*: a *cursor-identifier*
        - *result*: a list of documents for the current batch
        - *hasMore*: *false* if this was the last batch
        - *count*: if present the total number of elements
        - *code*: an HTTP status code
        - *error*: a boolean flag to indicate whether an error occurred
        - *errorNum*: a server error number (if *error* is *true*)
        - *errorMessage*: a descriptive error message (if *error* is *true*)
        - *extra*: an object with additional information about the query result, with
          the nested objects *stats* and *warnings*. Only delivered as part of the last
          batch in case of a cursor with the *stream* option enabled.
        Note that even if *hasMore* returns *true*, the next call might
        still return no documents. If, however, *hasMore* is *false*, then
        the cursor is exhausted.  Once the *hasMore* attribute has a value of
        *false*, the client can stop.
      operationId: ' modifyQueryCursorPut'
      parameters:
      - name: cursor-identifier
        schema:
          type: string
        required: true
        description: |+
          The name of the cursor
        in: path
      responses:
        '200':
          description: |2+
            The server will respond with *HTTP 200* in case of success.
        '400':
          description: |2+
            If the cursor identifier is omitted, the server will respond with *HTTP 404*.
        '404':
          description: |2+
            If no cursor with the specified identifier can be found, the server will respond
            with *HTTP 404*.
        '410':
          description: "\nThe server will respond with *HTTP 410* if a server which\
            \ processes the query\nor is the leader for a shard which is used in the\
            \ query stops responding, but \nthe connection has not been closed.\n\n"
      tags:
      - Cursors
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCursorForLimitReturnCont
release: stable
version: '3.10'
---
    var url = "/_api/cursor";
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.save({"hello1":"world1"});
    db.products.save({"hello2":"world1"});
    db.products.save({"hello3":"world1"});
    db.products.save({"hello4":"world1"});
    db.products.save({"hello5":"world1"});
    var url = "/_api/cursor";
    var body = {
      query: "FOR p IN products LIMIT 5 RETURN p",
      count: true,
      batchSize: 2
    };
    var response = logCurlRequest('POST', url, body);
    var body = response.body.replace(/\\/g, '');
    var _id = JSON.parse(body).id;
    response = logCurlRequest('PUT', url + '/' + _id, '');
    assert(response.code === 200);
    logJsonResponse(response);
  ~ db._drop(cn);
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
name: RestCursorMissingCursorIdentifier
release: stable
version: '3.10'
---
    var url = "/_api/cursor";
    var response = logCurlRequest('PUT', url, '');
    assert(response.code === 400);
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
name: RestCursorInvalidCursorIdentifier
release: stable
version: '3.10'
---
    var url = "/_api/cursor/123123";
    var response = logCurlRequest('PUT', url, '');
    assert(response.code === 404);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-cursor.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/cursor/{cursor-identifier}:
    delete:
      description: |2+
        Deletes the cursor and frees the resources associated with it.
        The cursor will automatically be destroyed on the server when the client has
        retrieved all documents from it. The client can also explicitly destroy the
        cursor at any earlier time using an HTTP DELETE request. The cursor id must
        be included as part of the URL.
        Note: the server will also destroy abandoned cursors automatically after a
        certain server-controlled timeout to avoid resource leakage.
      operationId: ' deleteQueryCursor'
      parameters:
      - name: cursor-identifier
        schema:
          type: string
        required: true
        description: |+
          The id of the cursor
        in: path
      responses:
        '202':
          description: |2+
            is returned if the server is aware of the cursor.
      tags:
      - Cursors
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCursorDelete
release: stable
version: '3.10'
---
    var url = "/_api/cursor";
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.save({"hello1":"world1"});
    db.products.save({"hello2":"world1"});
    db.products.save({"hello3":"world1"});
    db.products.save({"hello4":"world1"});
    db.products.save({"hello5":"world1"});
    var url = "/_api/cursor";
    var body = {
      query: "FOR p IN products LIMIT 5 RETURN p",
      count: true,
      batchSize: 2
    };
    var response = logCurlRequest('POST', url, body);
    logJsonResponse(response);
    var body = response.body.replace(/\\/g, '');
    var _id = JSON.parse(body).id;
    response = logCurlRequest('DELETE', url + '/' + _id);
    assert(response.code === 202);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

