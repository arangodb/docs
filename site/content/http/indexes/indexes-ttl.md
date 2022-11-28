---
fileID: indexes-ttl
title: Working with TTL (time-to-live) Indexes
weight: 2370
description: 
layout: default
---
```http-spec
openapi: 3.0.2
paths:
  /_api/index#ttl:
    post:
      description: |2+
        Creates a TTL index for the collection *collection-name* if it
        does not already exist. The call expects an object containing the index
        details.
      operationId: ' createIndex:ttl'
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The collection name.
        in: query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                type:
                  type: string
                  description: |+
                    must be equal to *"ttl"*.
                fields:
                  type: array
                  description: |+
                    an array with exactly one attribute path.
                expireAfter:
                  type: number
                  description: |+
                    The time interval (in seconds) from the point in time stored in the `fields`
                    attribute after which the documents count as expired. Can be set to `0` to let
                    documents expire as soon as the server time passes the point in time stored in
                    the document attribute, or to a higher number to delay the expiration.
                inBackground:
                  type: boolean
                  description: |+
                    The optional attribute **inBackground** can be set to *true* to create the index
                    in the background, which will not write-lock the underlying collection for
                    as long as if the index is built in the foreground. The default value is *false*.
              required:
              - type
              - fields
              - expireAfter
      responses:
        '200':
          description: |2+
            If the index already exists, then a *HTTP 200* is returned.
        '201':
          description: |2+
            If the index does not already exist and could be created, then a *HTTP 201*
            is returned.
        '400':
          description: |2+
            If the collection already contains another TTL index, then an *HTTP 400* is
            returned, as there can be at most one TTL index per collection.
      tags:
      - Indexes
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestIndexCreateNewTtlIndex
release: stable
version: '3.10'
---
    var cn = "sessions";
    db._drop(cn);
    db._create(cn);
    var url = "/_api/index?collection=" + cn;
    var body = {
      type: "ttl",
      expireAfter: 3600,
      fields : [ "createdAt" ]
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

