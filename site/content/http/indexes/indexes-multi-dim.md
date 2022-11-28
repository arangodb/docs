---
fileID: indexes-multi-dim
title: Working with multi-dimensional Indexes
weight: 2375
description: 
layout: default
---
```http-spec
openapi: 3.0.2
paths:
  /_api/index#multi-dim:
    post:
      description: |2+
        Creates a multi-dimensional index for the collection *collection-name*, if
        it does not already exist. The call expects an object containing the index
        details.
      operationId: ' createIndex#multi-dim'
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
                    must be equal to *"zkd"*.
                fields:
                  type: array
                  description: |+
                    an array of attribute names used for each dimension. Array expansions are not allowed.
                unique:
                  type: boolean
                  description: |+
                    if *true*, then create a unique index.
                inBackground:
                  type: boolean
                  description: |+
                    The optional attribute **inBackground** can be set to *true* to create the index
                    in the background, which will not write-lock the underlying collection for
                    as long as if the index is built in the foreground. The default value is *false*.
                fieldValueTypes:
                  type: string
                  description: |+
                    must be equal to *"double"*. Currently only doubles are supported as values.
              required:
              - type
              - fields
              - fieldValueTypes
      responses:
        '200':
          description: |2+
            If the index already exists, then a *HTTP 200* is
            returned.
        '201':
          description: |2+
            If the index does not already exist and could be created, then a *HTTP 201*
            is returned.
        '404':
          description: |2+
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
name: RestIndexCreateNewZkd
release: stable
version: '3.10'
---
var cn = "intervals";
db._drop(cn);
db._create(cn);
    var url = "/_api/index?collection=" + cn;
    var body = {
      type: "zkd",
      fields: [ "from", "to" ],
      fieldValueTypes: "double"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

