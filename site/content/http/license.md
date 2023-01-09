---
fileID: license
title: HTTP Interface for License Management
weight: 2225
description: 
layout: default
---
The License Management REST API allows you to view the current license status
and update the license of your ArangoDB Enterprise Edition deployment.

```http-spec
openapi: 3.0.2
paths:
  /_admin/license:
    get:
      description: |2+
        View the license information and status of an Enterprise Edition instance.
        Can be called on single servers, Coordinators, and DB-Servers.
      operationId: ' getLicense'
      responses:
        '200':
          description: |2+
          content:
            application/json:
              schema:
                type: object
                properties:
                  features:
                    $ref: '#/components/schemas/license_features'
                    description: |2+
                  license:
                    type: string
                    description: |+
                      The encrypted license key in Base64 encoding.
                  version:
                    type: number
                    description: |+
                      The license version number.
                required:
                - features
                - license
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
name: RestAdminLicenseGet_cluster
release: stable
version: '3.10'
---
    var assertTypeOf = require("jsunity").jsUnity.assertions.assertTypeOf;
    var url = "/_admin/license";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    var body = JSON.parse(response.body);
    assertTypeOf("string", body.license);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_admin/license:
    put:
      description: |2+
        Set a new license for an Enterprise Edition instance.
        Can be called on single servers, Coordinators, and DB-Servers.
      operationId: ' putLicense'
      parameters:
      - name: force
        schema:
          type: boolean
        required: false
        description: |+
          Set to `true` to change the license even if it expires sooner than the current one.
        in: query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                license:
                  type: string
                  description: |+
                    The body has to contain the Base64 encoded string wrapped in double quotes.
              required:
              - license
      responses:
        '400':
          description: |2
            If the license expires earlier than the previously installed one.
        '201':
          description: |2
            License successfully deployed.
      tags:
      - Administration
```


