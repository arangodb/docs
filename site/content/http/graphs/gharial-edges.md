---
fileID: gharial-edges
title: Handling Edges
weight: 2285
description: 
layout: default
---
Examples will explain the REST API for [manipulating edges](../../graphs/general-graphs/graphs-general-graphs-functions)
of the [graph module](../../graphs/)
on the [knows graph](../../graphs/#the-knows_graph):

![Social Example Graph](images/knows_graph.png)
```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}/edge/{collection}:
    post:
      description: |2+
        Creates a new edge in the collection.
        Within the body the edge has to contain a *_from* and *_to* value referencing to valid vertices in the graph.
        Furthermore the edge has to be valid in the definition of the used edge collection.
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
          The name of the edge collection the edge belongs to.
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
                _from:
                  type: string
                  description: |+
                    The source vertex of this edge. Has to be valid within
                    the used edge definition.
                _to:
                  type: string
                  description: |+
                    The target vertex of this edge. Has to be valid within
                    the used edge definition.
              required:
              - _from
              - _to
      responses:
        '201':
          description: |2+
            Returned if the edge could be created and waitForSync is true.
        '202':
          description: |2+
            Returned if the request was successful but waitForSync is false.
        '400':
          description: |2+
            Returned if the input document is invalid.
            This can for instance be the case if the `_from` or `_to` attribute is missing
            or malformed, or if the referenced vertex collection is not part of the graph.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to insert edges into the graph  you at least need to have the following privileges
            1. `Read Only` access on the Database.
            2. `Write` access on the given collection.
        '404':
          description: |2+
            Returned in any of the following cases
            * no graph with this name could be found.
            * the edge collection is not part of the graph.
            * the vertex collection is part of the graph, but does not exist.
            * `_from` or `_to` vertex does not exist.
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
name: HttpGharialAddEdge
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
~ require("internal").db._drop("relation");
~ require("internal").db._drop("female");
~ require("internal").db._drop("male");
  examples.loadGraph("social");
  var url = "/_api/gharial/social/edge/relation";
  body = {
    type: "friend",
    _from: "female/alice",
    _to: "female/diana"
  };
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
  /_api/gharial/{graph}/edge/{collection}/{edge}:
    get:
      description: |2+
        Gets an edge from the given collection.
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
          The name of the edge collection the edge belongs to.
        in: path
      - name: edge
        schema:
          type: string
        required: true
        description: |+
          The *_key* attribute of the edge.
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
          you can supply the Etag in an attribute rev in the URL.
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
            Returned if the edge could be found.
        '304':
          description: |2+
            Returned if the if-none-match header is given and the
            currently stored edge still has this revision value.
            So there was no update between the last time the edge
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
            * The edge does not exist.
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
name: HttpGharialGetEdge
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var any = require("@arangodb").db.relation.any();
  var url = "/_api/gharial/social/edge/relation/" + any._key;
  var response = logCurlRequest('GET', url);
  assert(response.code === 200);
  logJsonResponse(response);
  examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


Examples will explain the API on the [social graph](../../graphs/#the-social-graph):

![Social Example Graph](images/social_graph.png)
```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}/edge/{collection}/{edge}:
    patch:
      description: |2+
        Updates the data of the specific edge in the collection.
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
          The name of the edge collection the edge belongs to.
        in: path
      - name: edge
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
          If this parameter is false the attribute(s) will instead be deleted from the
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
                edge:
                  type: object
                  description: |+
                    The body has to contain a JSON object containing exactly the attributes that should be overwritten, all other attributes remain unchanged.
              required:
              - edge
      responses:
        '200':
          description: |2+
            Returned if the edge could be updated, and waitForSync is false.
        '202':
          description: |2+
            Returned if the request was successful but waitForSync is false.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to update edges in the graph  you at least need to have the following privileges
            1. `Read Only` access on the Database.
            2. `Write` access on the given collection.
        '404':
          description: |2+
            Returned in the following cases
            * No graph with this name could be found.
            * This collection is not part of the graph.
            * The edge to update does not exist.
            * either `_from` or `_to` vertex does not exist (if updated).
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
name: HttpGharialPatchEdge
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var any = require("@arangodb").db.relation.any();
  var url = "/_api/gharial/social/edge/relation/" + any._key;
  body = {
    since: "01.01.2001"
  }
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
  /_api/gharial/{graph}/edge/{collection}/{edge}:
    put:
      description: |2+
        Replaces the data of an edge in the collection.
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
          The name of the edge collection the edge belongs to.
        in: path
      - name: edge
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
                _from:
                  type: string
                  description: |+
                    The source vertex of this edge. Has to be valid within
                    the used edge definition.
                _to:
                  type: string
                  description: |+
                    The target vertex of this edge. Has to be valid within
                    the used edge definition.
              required:
              - _from
              - _to
      responses:
        '201':
          description: |2+
            Returned if the request was successful but waitForSync is true.
        '202':
          description: |2+
            Returned if the request was successful but waitForSync is false.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to replace edges in the graph  you at least need to have the following privileges
              1. `Read Only` access on the Database.
              2. `Write` access on the given collection.
        '404':
          description: |2+
            Returned in the following cases
            * No graph with this name could be found.
            * This collection is not part of the graph.
            * The edge to replace does not exist.
            * either `_from` or `_to` vertex does not exist.
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
name: HttpGharialPutEdge
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var any = require("@arangodb").db.relation.any();
  var url = "/_api/gharial/social/edge/relation/" + any._key;
  body = {
    type: "divorced",
    _from: "female/alice",
    _to: "male/bob"
  }
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
  /_api/gharial/{graph}/edge/{collection}/{edge}:
    delete:
      description: |2+
        Removes an edge from the collection.
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
          The name of the edge collection the edge belongs to.
        in: path
      - name: edge
        schema:
          type: string
        required: true
        description: |+
          The *_key* attribute of the edge.
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
            Returned if the edge could be removed.
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
            * The edge to remove does not exist.
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
name: HttpGharialDeleteEdge
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var any = require("@arangodb").db.relation.any();
  var url = "/_api/gharial/social/edge/relation/" + any._key;
  var response = logCurlRequest('DELETE', url);
  assert(response.code === 202);
  logJsonResponse(response);
  examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

