---
fileID: edge-working-with-edges
title: Working with Edges using REST
weight: 1995
description: 
layout: default
---
This is documentation to ArangoDB's
[REST interface for edges](../../graphs/graphs-edges).

Edges are documents with two additional attributes: *_from* and *_to*.
These attributes are mandatory and must contain the document-handle
of the from and to vertices of an edge.

Use the general document
[REST api](../documents/document-working-with-documents)
for create/read/update/delete.

<!-- Rest/Graph edges -->
```http-spec
openapi: 3.0.2
paths:
  /_api/edges/{collection-id}:
    get:
      description: |2+
        Returns an array of edges starting or ending in the vertex identified by
        *vertex*.
      parameters:
      - name: collection-id
        schema:
          type: string
        required: true
        description: |+
          The id of the collection.
        in: path
      - name: vertex
        schema:
          type: string
        required: true
        description: |+
          The id of the start vertex.
        in: query
      - name: direction
        schema:
          type: string
        required: false
        description: |+
          Selects *in* or *out* direction for edges. If not set, any edges are
          returned.
        in: query
      - name: x-arango-allow-dirty-read
        schema:
          type: boolean
        required: false
        description: |+
          Set this header to `true` to allow the Coordinator to ask any shard replica for
          the data, not only the shard leader. This may result in "dirty reads".
        in: header
      responses:
        '200':
          description: |2
            is returned if the edge collection was found and edges were retrieved.
        '400':
          description: |2
            is returned if the request contains invalid parameters.
        '404':
          description: |2
            is returned if the edge collection was not found.
      tags:
      - Graph Edges
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestEdgesReadEdgesAny
release: stable
version: '3.10'
---
    var db = require("@arangodb").db;
    db._create("vertices");
    db._createEdgeCollection("edges");
    db.vertices.save({_key: "1"});
    db.vertices.save({_key: "2"});
    db.vertices.save({_key: "3"});
    db.vertices.save({_key: "4"});
    db.edges.save({_from: "vertices/1", _to: "vertices/3", _key: "5", "$label": "v1 -> v3"});
    db.edges.save({_from: "vertices/2", _to: "vertices/1", _key: "6", "$label": "v2 -> v1"});
    db.edges.save({_from: "vertices/4", _to: "vertices/1", _key: "7", "$label": "v4 -> v1"});
    var url = "/_api/edges/edges?vertex=vertices/1";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop("edges");
    db._drop("vertices");
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
name: RestEdgesReadEdgesIn
release: stable
version: '3.10'
---
    var db = require("@arangodb").db;
    db._create("vertices");
    db._createEdgeCollection("edges");
    db.vertices.save({_key: "1"});
    db.vertices.save({_key: "2"});
    db.vertices.save({_key: "3"});
    db.vertices.save({_key: "4"});
    db.edges.save({_from: "vertices/1", _to: "vertices/3", _key: "5", "$label": "v1 -> v3"});
    db.edges.save({_from: "vertices/2", _to: "vertices/1", _key: "6", "$label": "v2 -> v1"});
    db.edges.save({_from: "vertices/4", _to: "vertices/1", _key: "7", "$label": "v4 -> v1"});
    var url = "/_api/edges/edges?vertex=vertices/1&direction=in";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop("edges");
    db._drop("vertices");
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
name: RestEdgesReadEdgesOut
release: stable
version: '3.10'
---
    var db = require("@arangodb").db;
    db._create("vertices");
    db._createEdgeCollection("edges");
    db.vertices.save({_key: "1"});
    db.vertices.save({_key: "2"});
    db.vertices.save({_key: "3"});
    db.vertices.save({_key: "4"});
    db.edges.save({_from: "vertices/1", _to: "vertices/3", _key: "5", "$label": "v1 -> v3"});
    db.edges.save({_from: "vertices/2", _to: "vertices/1", _key: "6", "$label": "v2 -> v1"});
    db.edges.save({_from: "vertices/4", _to: "vertices/1", _key: "7", "$label": "v4 -> v1"});
    var url = "/_api/edges/edges?vertex=vertices/1&direction=out";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop("edges");
    db._drop("vertices");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

