---
fileID: gharial-vertices
title: Handling Vertices
weight: 2280
description: 
layout: default
---
Examples will explain the REST API to the [graph module](../../graphs/)
on the [social graph](../../graphs/#the-social-graph):

![Social Example Graph](images/social_graph.png)
```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}/vertex/{collection}:
    post:
      description: |2+
        Adds a vertex to the given collection.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name of the vertex collection the vertex should be inserted into.
        in: path
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Define if the request should wait until synced to disk.
        in: query
      - name: returnNew
        schema:
          type: boolean
        required: false
        description: |+
          Define if the response should contain the complete
          new version of the document.
        in: query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                vertex:
                  type: object
                  description: |+
                    The body has to be the JSON object to be stored.
              required:
              - vertex
      responses:
        '201':
          description: |2+
            Returned if the vertex could be added and waitForSync is true.
        '202':
          description: |2+
            Returned if the request was successful but waitForSync is false.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to insert vertices into the graph  you at least need to have the following privileges
            1. `Read Only` access on the Database.
            2. `Write` access on the given collection.
        '404':
          description: |2+
            Returned if no graph with this name could be found.
            Or if a graph is found but this collection is not part of the graph.
          content:
            application/json:
              schema:
                type: object
                properties:
                  errorNum:
                    type: integer
                    description: |+
                      ArangoDB error number for the error that occurred.
                required:
                - errorNum
      tags:
      - Graph
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: HttpGharialAddVertex
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var url = "/_api/gharial/social/vertex/male";
  body = {
    name: "Francis"
  }
  var response = logCurlRequest('POST', url, body);
  assert(response.code === 202);
  logJsonResponse(response);
  examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}/vertex/{collection}/{vertex}:
    get:
      description: |2+
        Gets a vertex from the given collection.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name of the vertex collection the vertex belongs to.
        in: path
      - name: vertex
        schema:
          type: string
        required: true
        description: |+
          The *_key* attribute of the vertex.
        in: path
      - name: rev
        schema:
          type: string
        required: false
        description: |+
          Must contain a revision.
          If this is set a document is only returned if
          it has exactly this revision.
          Also see if-match header as an alternative to this.
        in: query
      - name: if-match
        schema:
          type: string
        required: false
        description: |+
          If the "If-Match" header is given, then it must contain exactly one Etag. The document is returned,
          if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative
          you can supply the Etag in an query parameter *rev*.
        in: header
      - name: if-none-match
        schema:
          type: string
        required: false
        description: |+
          If the "If-None-Match" header is given, then it must contain exactly one Etag. The document is returned,
          only if it has a different revision as the given Etag. Otherwise a HTTP 304 is returned.
        in: header
      responses:
        '200':
          description: |2+
            Returned if the vertex could be found.
        '304':
          description: |2+
            Returned if the if-none-match header is given and the
            currently stored vertex still has this revision value.
            So there was no update between the last time the vertex
            was fetched by the caller.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to update vertices in the graph  you at least need to have the following privileges
            1. `Read Only` access on the Database.
            2. `Read Only` access on the given collection.
        '404':
          description: |2+
            Returned in the following cases
            * No graph with this name could be found.
            * This collection is not part of the graph.
            * The vertex does not exist.
        '412':
          description: |2+
            Returned if if-match header is given, but the stored documents revision is different.
          content:
            application/json:
              schema:
                type: object
                properties:
                  errorNum:
                    type: integer
                    description: |+
                      ArangoDB error number for the error that occurred.
                required:
                - errorNum
      tags:
      - Graph
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: HttpGharialGetVertex
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var url = "/_api/gharial/social/vertex/female/alice";
  var response = logCurlRequest('GET', url);
  assert(response.code === 200);
  logJsonResponse(response);
  examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}/vertex/{collection}/{vertex}:
    patch:
      description: |2+
        Updates the data of the specific vertex in the collection.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name of the vertex collection the vertex belongs to.
        in: path
      - name: vertex
        schema:
          type: string
        required: true
        description: |+
          The *_key* attribute of the vertex.
        in: path
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Define if the request should wait until synced to disk.
        in: query
      - name: keepNull
        schema:
          type: boolean
        required: false
        description: |+
          Define if values set to null should be stored.
          By default (true) the given documents attribute(s) will be set to null.
          If this parameter is false the attribute(s) will instead be delete from the
          document.
        in: query
      - name: returnOld
        schema:
          type: boolean
        required: false
        description: |+
          Define if a presentation of the deleted document should
          be returned within the response object.
        in: query
      - name: returnNew
        schema:
          type: boolean
        required: false
        description: |+
          Define if a presentation of the new document should
          be returned within the response object.
        in: query
      - name: if-match
        schema:
          type: string
        required: false
        description: |+
          If the "If-Match" header is given, then it must contain exactly one Etag. The document is updated,
          if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative
          you can supply the Etag in an attribute rev in the URL.
        in: header
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                vertex:
                  type: object
                  description: |+
                    The body has to contain a JSON object containing exactly the attributes that should be overwritten, all other attributes remain unchanged.
              required:
              - vertex
      responses:
        '200':
          description: |2+
            Returned if the vertex could be updated, and waitForSync is true.
        '202':
          description: |2+
            Returned if the request was successful, and waitForSync is false.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to update vertices in the graph  you at least need to have the following privileges
            1. `Read Only` access on the Database.
            2. `Write` access on the given collection.
        '404':
          description: |2+
            Returned in the following cases
            * No graph with this name could be found.
            * This collection is not part of the graph.
            * The vertex to update does not exist.
        '412':
          description: |2+
            Returned if if-match header is given, but the stored documents revision is different.
          content:
            application/json:
              schema:
                type: object
                properties:
                  errorNum:
                    type: integer
                    description: |+
                      ArangoDB error number for the error that occurred.
                required:
                - errorNum
      tags:
      - Graph
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: HttpGharialModifyVertex
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  body = {
    age: 26
  }
  var url = "/_api/gharial/social/vertex/female/alice";
  var response = logCurlRequest('PATCH', url, body);
  assert(response.code === 202);
  logJsonResponse(response);
  examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}/vertex/{collection}/{vertex}:
    put:
      description: |2+
        Replaces the data of a vertex in the collection.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name of the vertex collection the vertex belongs to.
        in: path
      - name: vertex
        schema:
          type: string
        required: true
        description: |+
          The *_key* attribute of the vertex.
        in: path
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Define if the request should wait until synced to disk.
        in: query
      - name: keepNull
        schema:
          type: boolean
        required: false
        description: |+
          Define if values set to null should be stored. By default the key is not removed from the document.
        in: query
      - name: returnOld
        schema:
          type: boolean
        required: false
        description: |+
          Define if a presentation of the deleted document should
          be returned within the response object.
        in: query
      - name: returnNew
        schema:
          type: boolean
        required: false
        description: |+
          Define if a presentation of the new document should
          be returned within the response object.
        in: query
      - name: if-match
        schema:
          type: string
        required: false
        description: |+
          If the "If-Match" header is given, then it must contain exactly one Etag. The document is updated,
          if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative
          you can supply the Etag in an attribute rev in the URL.
        in: header
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                vertex:
                  type: object
                  description: |+
                    The body has to be the JSON object to be stored.
              required:
              - vertex
      responses:
        '200':
          description: |2+
            Returned if the vertex could be replaced, and waitForSync is true.
        '202':
          description: |2+
            Returned if the vertex could be replaced, and waitForSync is false.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to replace vertices in the graph  you at least need to have the following privileges
            1. `Read Only` access on the Database.
            2. `Write` access on the given collection.
        '404':
          description: |2+
            Returned in the following cases
            * No graph with this name could be found.
            * This collection is not part of the graph.
            * The vertex to replace does not exist.
        '412':
          description: |2+
            Returned if if-match header is given, but the stored documents revision is different.
          content:
            application/json:
              schema:
                type: object
                properties:
                  errorNum:
                    type: integer
                    description: |+
                      ArangoDB error number for the error that occurred.
                required:
                - errorNum
      tags:
      - Graph
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: HttpGharialReplaceVertex
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  body = {
    name: "Alice Cooper",
    age: 26
  }
  var url = "/_api/gharial/social/vertex/female/alice";
  var response = logCurlRequest('PUT', url, body);
  assert(response.code === 202);
  logJsonResponse(response);
  examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}/vertex/{collection}/{vertex}:
    delete:
      description: |2+
        Removes a vertex from the collection.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name of the vertex collection the vertex belongs to.
        in: path
      - name: vertex
        schema:
          type: string
        required: true
        description: |+
          The *_key* attribute of the vertex.
        in: path
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Define if the request should wait until synced to disk.
        in: query
      - name: returnOld
        schema:
          type: boolean
        required: false
        description: |+
          Define if a presentation of the deleted document should
          be returned within the response object.
        in: query
      - name: if-match
        schema:
          type: string
        required: false
        description: |+
          If the "If-Match" header is given, then it must contain exactly one Etag. The document is updated,
          if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative
          you can supply the Etag in an attribute rev in the URL.
        in: header
      responses:
        '200':
          description: |2+
            Returned if the vertex could be removed.
        '202':
          description: |2+
            Returned if the request was successful but waitForSync is false.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to delete vertices in the graph  you at least need to have the following privileges
            1. `Read Only` access on the Database.
            2. `Write` access on the given collection.
        '404':
          description: |2+
            Returned in the following cases
            * No graph with this name could be found.
            * This collection is not part of the graph.
            * The vertex to remove does not exist.
        '412':
          description: |2+
            Returned if if-match header is given, but the stored documents revision is different.
          content:
            application/json:
              schema:
                type: object
                properties:
                  errorNum:
                    type: integer
                    description: |+
                      ArangoDB error number for the error that occurred.
                required:
                - errorNum
      tags:
      - Graph
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: HttpGharialDeleteVertex
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var url = "/_api/gharial/social/vertex/female/alice";
  var response = logCurlRequest('DELETE', url);
  assert(response.code === 202);
  logJsonResponse(response);
  examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

