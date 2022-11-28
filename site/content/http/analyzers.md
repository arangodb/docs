---
fileID: analyzers
title: HTTP Interface for Analyzers
weight: 2225
description: 
layout: default
---
The RESTful API for managing ArangoSearch Analyzers is accessible via the
`/_api/analyzer` endpoint.

See the description of [Analyzers](../analyzers/) for an
introduction and the available types, properties and features.

## Analyzer Operations

```http-spec
openapi: 3.0.2
paths:
  /_api/analyzer:
    post:
      description: |2+
        Creates a new Analyzer based on the provided configuration.
      operationId: ' RestAnalyzerHandler:Create'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: |+
                    The Analyzer name.
                type:
                  type: string
                  description: |+
                    The Analyzer type.
                properties:
                  type: object
                  description: |+
                    The properties used to configure the specified Analyzer type.
                features:
                  type: array
                  description: |+
                    The set of features to set on the Analyzer generated fields.
                    The default value is an empty array.
              required:
              - name
              - type
      responses:
        '200':
          description: |2+
            An Analyzer with a matching name and definition already exists.
        '201':
          description: |2+
            A new Analyzer definition was successfully created.
        '400':
          description: |2+
            One or more of the required parameters is missing or one or more of the parameters
            is not valid.
      tags:
      - Analyzers
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestAnalyzerPost
release: stable
version: '3.10'
---
  var analyzers = require("@arangodb/analyzers");
  var db = require("@arangodb").db;
  var analyzerName = "testAnalyzer";
  // creation
  var url = "/_api/analyzer";
  var body = {
    name: "testAnalyzer",
    type: "identity"
  };
  var response = logCurlRequest('POST', url, body);
  assert(response.code === 201);
  logJsonResponse(response);
  analyzers.remove(analyzerName, true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/analyzer/{analyzer-name}:
    get:
      description: |2+
        Retrieves the full definition for the specified Analyzer name.
        The resulting object contains the following attributes:
        - *name*: the Analyzer name
        - *type*: the Analyzer type
        - *properties*: the properties used to configure the specified type
        - *features*: the set of features to set on the Analyzer generated fields
      operationId: ' RestAnalyzerHandler:GetDefinition'
      parameters:
      - name: analyzer-name
        schema:
          type: string
        required: true
        description: |+
          The name of the Analyzer to retrieve.
        in: path
      responses:
        '200':
          description: |2+
            The Analyzer definition was retrieved successfully.
      tags:
      - Analyzers
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestAnalyzerGet
release: stable
version: '3.10'
---
  var analyzers = require("@arangodb/analyzers");
  var db = require("@arangodb").db;
  var analyzerName = "testAnalyzer";
  analyzers.save(analyzerName, "identity");
  // retrieval
  var url = "/_api/analyzer/" + encodeURIComponent(analyzerName);
  var response = logCurlRequest('GET', url);
  assert(response.code === 200);
  logJsonResponse(response);
  analyzers.remove(analyzerName, true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/analyzer:
    get:
      description: |2+
        Retrieves a an array of all Analyzer definitions.
        The resulting array contains objects with the following attributes:
        - *name*: the Analyzer name
        - *type*: the Analyzer type
        - *properties*: the properties used to configure the specified type
        - *features*: the set of features to set on the Analyzer generated fields
      operationId: ' RestAnalyzerHandler:List'
      tags:
      - Analyzers
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestAnalyzersGet
release: stable
version: '3.10'
---
  // retrieval
  var url = "/_api/analyzer";
  var response = logCurlRequest('GET', url);
  assert(response.code === 200);
  logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/analyzer/{analyzer-name}:
    delete:
      description: |2+
        Removes an Analyzer configuration identified by *analyzer-name*.
        If the Analyzer definition was successfully dropped, an object is returned with
        the following attributes:
        - *error*: *false*
        - *name*: The name of the removed Analyzer
      operationId: ' RestAnalyzerHandler:Delete'
      parameters:
      - name: analyzer-name
        schema:
          type: string
        required: true
        description: |+
          The name of the Analyzer to remove.
        in: path
      - name: force
        schema:
          type: boolean
        required: false
        description: |+
          The Analyzer configuration should be removed even if it is in-use.
          The default value is *false*.
        in: query
      responses:
        '200':
          description: |2+
            The Analyzer configuration was removed successfully.
        '400':
          description: |2+
            The *analyzer-name* was not supplied or another request parameter was not
            valid.
        '403':
          description: |2+
            The user does not have permission to remove this Analyzer configuration.
        '404':
          description: |2+
            Such an Analyzer configuration does not exist.
      tags:
      - Analyzers
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestAnalyzerDelete
release: stable
version: '3.10'
---
  var analyzers = require("@arangodb/analyzers");
  var db = require("@arangodb").db;
  var analyzerName = "testAnalyzer";
  analyzers.save(analyzerName, "identity");
  // removal
  var url = "/_api/analyzer/" + encodeURIComponent(analyzerName);
  var response = logCurlRequest('DELETE', url);
console.error(JSON.stringify(response));
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
name: RestAnalyzerDeleteForce
release: stable
version: '3.10'
---
  var analyzers = require("@arangodb/analyzers");
  var db = require("@arangodb").db;
  var analyzerName = "testAnalyzer";
  analyzers.save(analyzerName, "identity");
  // create Analyzer reference
  var url = "/_api/collection";
  var body = { name: "testCollection" };
  var response = logCurlRequest('POST', url, body);
  assert(response.code === 200);
  var url = "/_api/view";
  var body = {
    name: "testView",
    type: "arangosearch",
    links: { testCollection: { analyzers: [ analyzerName ] } }
  };
  var response = logCurlRequest('POST', url, body);
  // removal (fail)
  var url = "/_api/analyzer/" + encodeURIComponent(analyzerName) + "?force=false";
  var response = logCurlRequest('DELETE', url);
  assert(response.code === 409);
  // removal
  var url = "/_api/analyzer/" + encodeURIComponent(analyzerName) + "?force=true";
  var response = logCurlRequest('DELETE', url);
  assert(response.code === 200);
  logJsonResponse(response);
  db._dropView("testView");
  db._drop("testCollection");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

