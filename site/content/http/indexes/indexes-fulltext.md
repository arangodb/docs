---
fileID: indexes-fulltext
title: Fulltext
weight: 2115
description: 
layout: default
---
<!-- js/actions/api-index.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/index#fulltext:
    post:
      description: |2+
        Creates a fulltext index for the collection *collection-name*, if
        it does not already exist. The call expects an object containing the index
        details.
      operationId: ' createIndex#fulltext'
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
                    must be equal to *"fulltext"*.
                name:
                  type: string
                  description: |+
                    An easy-to-remember name for the index to look it up or refer to it in index hints.
                    Index names are subject to the same character restrictions as collection names.
                    If omitted, a name is auto-generated so that it is unique with respect to the
                    collection, e.g. `idx_832910498`.
                fields:
                  type: array
                  items:
                    type: string
                  description: |+
                    an array of attribute names. Currently, the array is limited
                    to exactly one attribute.
                minLength:
                  type: integer
                  format: int64
                  description: |+
                    Minimum character length of words to index. Will default
                    to a server-defined value if unspecified. It is thus recommended to set
                    this value explicitly when creating the index.
                inBackground:
                  type: boolean
                  description: |+
                    The optional attribute **inBackground** can be set to *true* to create the index
                    in the background, which will not write-lock the underlying collection for
                    as long as if the index is built in the foreground. The default value is *false*.
              required:
              - type
              - fields
              - minLength
      responses:
        '200':
          description: |2
            If the index already exists, then a *HTTP 200* is
            returned.
        '201':
          description: |2
            If the index does not already exist and could be created, then a *HTTP 201*
            is returned.
        '404':
          description: |2
            If the *collection-name* is unknown, then a *HTTP 404* is returned.
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
name: RestIndexCreateNewFulltext
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var url = "/_api/index?collection=" + cn;
    var body = {
      type: "fulltext",
      fields: [ "text" ]
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

