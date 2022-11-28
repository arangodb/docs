---
fileID: batch-request
title: HTTP Interface for Batch Requests
weight: 2165
description: 
layout: default
---
{{% hints/warning %}}
The batch request API is deprecated from version 3.8.0 on.
This endpoint should no longer be used.
To send multiple documents at once to an ArangoDB instance, please use the
[HTTP Interface for Documents](../documents/document-working-with-documents#bulk-document-operations)
that can insert, update, replace or remove arrays of documents.
{{% /hints/warning %}}

Clients normally send individual operations to ArangoDB in individual
HTTP requests. This is straightforward and simple, but has the
disadvantage that the network overhead can be significant if many
small requests are issued in a row.

To mitigate this problem, ArangoDB offers a batch request API that
clients can use to send multiple operations in one batch to
ArangoDB. This method is especially useful when the client has to send
many HTTP requests with a small body/payload and the individual
request results do not depend on each other.

Clients can use ArangoDB's batch API by issuing a multipart HTTP POST
request to the URL */_api/batch* handler. The handler will accept the
request if the Content-type is *multipart/form-data* and a boundary
string is specified. ArangoDB will then decompose the batch request
into its individual parts using this boundary. This also means that
the boundary string itself must not be contained in any of the parts.
When ArangoDB has split the multipart request into its individual
parts, it will process all parts sequentially as if it were a
standalone request.  When all parts are processed, ArangoDB will
generate a multipart HTTP response that contains one part for each
part operation result.  For example, if you send a multipart request
with 5 parts, ArangoDB will send back a multipart response with 5
parts as well.

The server expects each part message to start with exactly the
following "header": 

    Content-type: application/x-arango-batchpart

You can optionally specify a *Content-Id* "header" to uniquely
identify each part message. The server will return the *Content-Id* in
its response if it is specified. Otherwise, the server will not send a
Content-Id "header" back. The server will not validate the uniqueness
of the Content-Id.  After the mandatory *Content-type* and the
optional *Content-Id* header, two Windows line breaks
(i.e. *\r\n\r\n*) must follow.  Any deviation of this structure
might lead to the part being rejected or incorrectly interpreted. The
part request payload, formatted as a regular HTTP request, must follow
the two Windows line breaks literal directly.

Note that the literal *Content-type: application/x-arango-batchpart*
technically is the header of the MIME part, and the HTTP request
(including its headers) is the body part of the MIME part.

An actual part request should start with the HTTP method, the called
URL, and the HTTP protocol version as usual, followed by arbitrary
HTTP headers. Its body should follow after the usual *\r\n\r\n*
literal. Part requests are therefore regular HTTP requests, only
embedded inside a multipart message.

The following example will send a batch with 3 individual document
creation operations. The boundary used in this example is
*XXXsubpartXXX*.

*Examples*

```js
> curl -X POST --data-binary @- --header "Content-type: multipart/form-data; boundary=XXXsubpartXXX" http://localhost:8529/_api/batch
--XXXsubpartXXX
Content-type: application/x-arango-batchpart
Content-Id: 1

POST /_api/document?collection=xyz HTTP/1.1

{"a":1,"b":2,"c":3}
--XXXsubpartXXX
Content-type: application/x-arango-batchpart
Content-Id: 2

POST /_api/document?collection=xyz HTTP/1.1

{"a":1,"b":2,"c":3,"d":4}
--XXXsubpartXXX
Content-type: application/x-arango-batchpart
Content-Id: 3

POST /_api/document?collection=xyz HTTP/1.1

{"a":1,"b":2,"c":3,"d":4,"e":5}
--XXXsubpartXXX--
```

The server will then respond with one multipart message, containing
the overall status and the individual results for the part
operations. The overall status should be 200 except there was an error
while inspecting and processing the multipart message. The overall
status therefore does not indicate the success of each part operation,
but only indicates whether the multipart message could be handled
successfully.

Each part operation will return its own status value. As the part
operation results are regular HTTP responses (just included in one
multipart response), the part operation status is returned as a HTTP
status code. The status codes of the part operations are exactly the
same as if you called the individual operations standalone. Each part
operation might also return arbitrary HTTP headers and a body/payload:

*Examples*

```js
HTTP/1.1 200 OK
Connection: Keep-Alive
Content-type: multipart/form-data; boundary=XXXsubpartXXX
Content-length: 1055

--XXXsubpartXXX
Content-type: application/x-arango-batchpart
Content-Id: 1

HTTP/1.1 202 Accepted
Content-type: application/json; charset=utf-8
Etag: "9514299"
Content-length: 53

{"error":false,"_id":"xyz/9514299","_key":"9514299","_rev":"9514299"}
--XXXsubpartXXX
Content-type: application/x-arango-batchpart
Content-Id: 2

HTTP/1.1 202 Accepted
Content-type: application/json; charset=utf-8
Etag: "9579835"
Content-length: 53

{"error":false,"_id":"xyz/9579835","_key":"9579835","_rev":"9579835"}
--XXXsubpartXXX
Content-type: application/x-arango-batchpart
Content-Id: 3

HTTP/1.1 202 Accepted
Content-type: application/json; charset=utf-8
Etag: "9645371"
Content-length: 53

{"error":false,"_id":"xyz/9645371","_key":"9645371","_rev":"9645371"}
--XXXsubpartXXX--
```

In the above example, the server returned an overall status code of
200, and each part response contains its own status value (202 in the
example):

When constructing the multipart HTTP response, the server will use the
same boundary that the client supplied. If any of the part responses
has a status code of 400 or greater, the server will also return an
HTTP header *x-arango-errors* containing the overall number of part
requests that produced errors:

*Examples*

```js
> curl -X POST --data-binary @- --header "Content-type: multipart/form-data; boundary=XXXsubpartXXX" http://localhost:8529/_api/batch
--XXXsubpartXXX
Content-type: application/x-arango-batchpart

POST /_api/document?collection=nonexisting

{"a":1,"b":2,"c":3}
--XXXsubpartXXX
Content-type: application/x-arango-batchpart

POST /_api/document?collection=xyz

{"a":1,"b":2,"c":3,"d":4}
--XXXsubpartXXX--
```

In this example, the overall response code is 200, but as some of the
part request failed (with status code 404), the *x-arango-errors*
header of the overall response is *1*:

*Examples*

```js
HTTP/1.1 200 OK
x-arango-errors: 1
Content-type: multipart/form-data; boundary=XXXsubpartXXX
Content-length: 711

--XXXsubpartXXX
Content-type: application/x-arango-batchpart

HTTP/1.1 404 Not Found
Content-type: application/json; charset=utf-8
Content-length: 111

{"error":true,"code":404,"errorNum":1203,"errorMessage":"collection \/_api\/collection\/nonexisting not found"}
--XXXsubpartXXX
Content-type: application/x-arango-batchpart

HTTP/1.1 202 Accepted
Content-type: application/json; charset=utf-8
Etag: "9841979"
Content-length: 53

{"error":false,"_id":"xyz/9841979","_key":"9841979","_rev":"9841979"}
--XXXsubpartXXX--
```

Please note that the database used for all part operations of a batch
request is determined by scanning the original URL (the URL that contains
*/_api/batch*). It is not possible to override the
[database name](../../appendix/appendix-glossary#database-name) in
part operations of a batch. When doing so, any other database name used 
in a batch part will be ignored.
```http-spec
openapi: 3.0.2
paths:
  /_api/batch:
    post:
      description: |2+
        Executes a batch request. A batch request can contain any number of
        other requests that can be sent to ArangoDB in isolation. The benefit of
        using batch requests is that batching requests requires less client/server
        roundtrips than when sending isolated requests.
        All parts of a batch request are executed serially on the server. The
        server will return the results of all parts in a single response when all
        parts are finished.
        Technically, a batch request is a multipart HTTP request, with
        content-type `multipart/form-data`. A batch request consists of an
        envelope and the individual batch part actions. Batch part actions
        are "regular" HTTP requests, including full header and an optional body.
        Multiple batch parts are separated by a boundary identifier. The
        boundary identifier is declared in the batch envelope. The MIME content-type
        for each individual batch part must be `application/x-arango-batchpart`.
        Please note that when constructing the individual batch parts, you must
        use CRLF (`\r\n`) as the line terminator as in regular HTTP messages.
        The response sent by the server will be an `HTTP 200` response, with an
        optional error summary header `x-arango-errors`. This header contains the
        number of batch part operations that failed with an HTTP error code of at
        least 400. This header is only present in the response if the number of
        errors is greater than zero.
        The response sent by the server is a multipart response, too. It contains
        the individual HTTP responses for all batch parts, including the full HTTP
        result header (with status code and other potential headers) and an
        optional result body. The individual batch parts in the result are
        seperated using the same boundary value as specified in the request.
        The order of batch parts in the response will be the same as in the
        original client request. Client can additionally use the `Content-Id`
        MIME header in a batch part to define an individual id for each batch part.
        The server will return this id is the batch part responses, too.
      operationId: ' RestBatchHandler'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                body:
                  type: string
                  description: |+
                    The multipart batch request, consisting of the envelope and the individual
                    batch parts.
              required:
              - body
      responses:
        '200':
          description: |2+
            is returned if the batch was received successfully. HTTP 200 is returned
            even if one or multiple batch part actions failed.
        '400':
          description: |2+
            is returned if the batch envelope is malformed or incorrectly formatted.
            This code will also be returned if the content-type of the overall batch
            request or the individual MIME parts is not as expected.
      tags:
      - Bulk
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input
name: RestBatchMultipartHeader
release: stable
version: '3.10'
---
    var parts = [
      "Content-Type: application/x-arango-batchpart\r\n" +
      "Content-Id: myId1\r\n\r\n" +
      "GET /_api/version HTTP/1.1\r\n",
      "Content-Type: application/x-arango-batchpart\r\n" +
      "Content-Id: myId2\r\n\r\n" +
      "DELETE /_api/collection/products HTTP/1.1\r\n",
      "Content-Type: application/x-arango-batchpart\r\n" +
      "Content-Id: someId\r\n\r\n" +
      "POST /_api/collection/products HTTP/1.1\r\n\r\n" +
      "{\"name\": \"products\" }\r\n",
      "Content-Type: application/x-arango-batchpart\r\n" +
      "Content-Id: nextId\r\n\r\n" +
      "GET /_api/collection/products/figures HTTP/1.1\r\n",
      "Content-Type: application/x-arango-batchpart\r\n" +
      "Content-Id: otherId\r\n\r\n" +
      "DELETE /_api/collection/products HTTP/1.1\r\n"
    ];
    var boundary = "SomeBoundaryValue";
    var headers = { "Content-Type" : "multipart/form-data; boundary=" +
    boundary };
    var body = "--" + boundary + "\r\n" +
               parts.join("\r\n" + "--" + boundary + "\r\n") +
               "--" + boundary + "--\r\n";
    var response = logCurlRequestPlain('POST', '/_api/batch', body, headers);
    assert(response.code === 200);
    logPlainResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input
name: RestBatchImplicitBoundary
release: stable
version: '3.10'
---
    var parts = [
      "Content-Type: application/x-arango-batchpart\r\n\r\n" +
         "DELETE /_api/collection/notexisting1 HTTP/1.1\r\n",
      "Content-Type: application/x-arango-batchpart\r\n\r\n" +
         "DELETE _api/collection/notexisting2 HTTP/1.1\r\n"
    ];
    var boundary = "SomeBoundaryValue";
    var body = "--" + boundary + "\r\n" +
               parts.join("\r\n" + "--" + boundary + "\r\n") +
               "--" + boundary + "--\r\n";
    var response = logCurlRequestPlain('POST', '/_api/batch', body);
    assert(response.code === 200);
    assert(response.headers['x-arango-errors'] == 2);
    logPlainResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

