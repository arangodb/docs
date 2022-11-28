---
fileID: gharial-management
title: Manage your graphs
weight: 2095
description: 
layout: default
---
The [graph module](../../graphs/) provides functions dealing with graph structures.
Examples will explain the REST API on the [social graph](../../graphs/#the-social-graph):

![Social Example Graph](/images/social_graph.png)
```http-spec
openapi: 3.0.2
paths:
  /_api/gharial:
    get:
      description: |2+
        Lists all graphs stored in this database.
      responses:
        '200':
          description: |2+
            Is returned if the module is available and the graphs could be listed.
          content:
            application/json:
              schema:
                type: object
                properties:
                  graphs:
                    type: array
                    schema:
                      $ref: '#/components/schemas/graph_list'
                    description: |2+
                required:
                - graphs
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
name: HttpGharialList
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  examples.loadGraph("routeplanner");
  var url = "/_api/gharial";
  var response = logCurlRequest('GET', url);
  assert(response.code === 200);
  logJsonResponse(response);
~ examples.dropGraph("social");
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/gharial:
    post:
      description: |2+
        The creation of a graph requires the name of the graph and a
        definition of its edges.
      parameters:
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          define if the request should wait until everything is synced to disc.
          Will change the success response code.
        in: query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: |+
                    Name of the graph.
                edgeDefinitions:
                  type: array
                  schema:
                    $ref: '#/components/schemas/graph_edge_definition'
                  description: |+
                    An array of definitions for the relations of the graph.
                    Each has the following type
                orphanCollections:
                  type: array
                  description: |+
                    An array of additional vertex collections.
                    Documents within these collections do not have edges within this graph.
                isSmart:
                  type: boolean
                  description: |+
                    Define if the created graph should be smart (Enterprise Edition only).
                isDisjoint:
                  type: boolean
                  description: |+
                    Whether to create a Disjoint SmartGraph instead of a regular SmartGraph
                    (Enterprise Edition only).
                options:
                  type: object
                  schema:
                    $ref: '#/components/schemas/post_api_gharial_create_opts'
                  description: |+
                    a JSON object to define options for creating collections within this graph.
                    It can contain the following attributes
              required:
              - name
      responses:
        '201':
          description: |2+
            Is returned if the graph could be created and waitForSync is enabled
            for the `_graphs` collection, or given in the request.
            The response body contains the graph configuration that has been stored.
        '202':
          description: |2+
            Is returned if the graph could be created and waitForSync is disabled
            for the `_graphs` collection and not given in the request.
            The response body contains the graph configuration that has been stored.
        '400':
          description: |2+
            Returned if the request is in a wrong format.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to create a graph you at least need to have the following privileges
            1. `Administrate` access on the Database.
            2. `Read Only` access on every collection used within this graph.
        '409':
          description: |2+
            Returned if there is a conflict storing the graph. This can occur
            either if a graph with this name is already stored, or if there is one
            edge definition with a the same edge collection but a different signature
            used in any other graph.
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
name: HttpGharialCreate
release: stable
version: '3.10'
---
  var graph = require("@arangodb/general-graph");
  if (graph._exists("myGraph")) {
     graph._drop("myGraph", true);
  }
  var url = "/_api/gharial";
  body = {
    name: "myGraph",
    edgeDefinitions: [{
      collection: "edges",
      from: [ "startVertices" ],
      to: [ "endVertices" ]
    }]
  };
  var response = logCurlRequest('POST', url, body);
  assert(response.code === 202);
  logJsonResponse(response);
  graph._drop("myGraph", true);
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
name: HttpGharialCreateSmart
release: stable
version: '3.10'
---
  var graph = require("@arangodb/general-graph");
  if (graph._exists("smartGraph")) {
     graph._drop("smartGraph", true);
  }
  var url = "/_api/gharial";
  body = {
    name: "smartGraph",
    edgeDefinitions: [{
      collection: "edges",
      from: [ "startVertices" ],
      to: [ "endVertices" ]
    }],
    orphanCollections: [ "orphanVertices" ],
    isSmart: true,
    options: {
      replicationFactor: 2,
      numberOfShards: 9,
      smartGraphAttribute: "region"
    }
  };
  var response = logCurlRequest('POST', url, body);
  assert(response.code === 202);
  logJsonResponse(response);
  graph._drop("smartGraph", true);
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
name: HttpGharialCreateDisjointSmart
release: stable
version: '3.10'
---
var graph = require("@arangodb/general-graph");
  if (graph._exists("disjointSmartGraph")) {
     graph._drop("disjointSmartGraph", true);
}
var url = "/_api/gharial";
body = {
name: "disjointSmartGraph",
edgeDefinitions: [{
collection: "edges",
from: [ "startVertices" ],
to: [ "endVertices" ]
}],
orphanCollections: [ "orphanVertices" ],
isSmart: true,
options: {
isDisjoint: true,
replicationFactor: 2,
numberOfShards: 9,
smartGraphAttribute: "region"
}
};
var response = logCurlRequest('POST', url, body);
assert(response.code === 202);
logJsonResponse(response);
graph._drop("disjointSmartGraph", true);
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
name: HttpGharialCreateSmartWithSatellites
release: stable
version: '3.10'
---
var graph = require("@arangodb/general-graph");
  if (graph._exists("smartGraph")) {
     graph._drop("smartGraph", true);
}
var url = "/_api/gharial";
body = {
name: "smartGraph",
edgeDefinitions: [{
collection: "edges",
from: [ "startVertices" ],
to: [ "endVertices" ]
}],
orphanCollections: [ "orphanVertices" ],
isSmart: true,
options: {
replicationFactor: 2,
numberOfShards: 9,
smartGraphAttribute: "region",
satellites: [ "endVertices" ]
}
};
var response = logCurlRequest('POST', url, body);
assert(response.code === 202);
logJsonResponse(response);
graph._drop("smartGraph", true);
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
name: HttpGharialCreateEnterprise
release: stable
version: '3.10'
---
var graph = require("@arangodb/general-graph");
  if (graph._exists("enterpriseGraph")) {
     graph._drop("enterpriseGraph", true);
}
var url = "/_api/gharial";
body = {
name: "enterpriseGraph",
edgeDefinitions: [{
collection: "edges",
from: [ "startVertices" ],
to: [ "endVertices" ]
}],
orphanCollections: [ ],
isSmart: true,
options: {
replicationFactor: 2,
numberOfShards: 9,
}
};
var response = logCurlRequest('POST', url, body);
assert(response.code === 202);
logJsonResponse(response);
graph._drop("enterpriseGraph", true);
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
name: HttpGharialCreateSatellite
release: stable
version: '3.10'
---
var graph = require("@arangodb/general-graph");
  if (graph._exists("satelliteGraph")) {
     graph._drop("satelliteGraph", true);
}
var url = "/_api/gharial";
body = {
name: "satelliteGraph",
edgeDefinitions: [{
collection: "edges",
from: [ "startVertices" ],
to: [ "endVertices" ]
}],
orphanCollections: [ ],
options: {
replicationFactor: "satellite"
}
};
var response = logCurlRequest('POST', url, body);
assert(response.code === 202);
logJsonResponse(response);
graph._drop("satelliteGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}:
    get:
      description: |2+
        Selects information for a given graph.
        Will return the edge definitions as well as the orphan collections.
        Or returns a 404 if the graph does not exist.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      responses:
        '200':
          description: |2+
            Returns the graph if it could be found.
            The result will have the following format
        '404':
          description: |2+
            Returned if no graph with this name could be found.
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
name: HttpGharialGetGraph
release: stable
version: '3.10'
---
  var graph = require("@arangodb/general-graph");
  if (graph._exists("myGraph")) {
     graph._drop("myGraph", true);
  }
  graph._create("myGraph", [{
    collection: "edges",
    from: [ "startVertices" ],
    to: [ "endVertices" ]
  }]);
  var url = "/_api/gharial/myGraph";
  var response = logCurlRequest('GET', url);
  assert(response.code === 200);
  logJsonResponse(response);
  graph._drop("myGraph", true);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}:
    delete:
      description: |2+
        Drops an existing graph object by name.
        Optionally all collections not used by other graphs
        can be dropped as well.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      - name: dropCollections
        schema:
          type: boolean
        required: false
        description: |+
          Drop collections of this graph as well.  Collections will only be
          dropped if they are not used in other graphs.
        in: query
      responses:
        '201':
          description: |2+
            Is returned if the graph could be dropped and waitForSync is enabled
            for the `_graphs` collection, or given in the request.
        '202':
          description: |2+
            Is returned if the graph could be dropped and waitForSync is disabled
            for the `_graphs` collection and not given in the request.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to drop a graph you at least need to have the following privileges
              1. `Administrate` access on the Database.
        '404':
          description: |2+
            Returned if no graph with this name could be found.
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
name: HttpGharialDrop
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var url = "/_api/gharial/social?dropCollections=true";
  var response = logCurlRequest('DELETE', url);
  assert(response.code === 202);
  logJsonResponse(response);
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}/vertex:
    get:
      description: |2+
        Lists all vertex collections within this graph.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      responses:
        '200':
          description: |2+
            Is returned if the collections could be listed.
        '404':
          description: |2+
            Returned if no graph with this name could be found.
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
name: HttpGharialListVertex
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var url = "/_api/gharial/social/vertex";
  var response = logCurlRequest('GET', url);
  assert(response.code === 200);
  logJsonResponse(response);
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}/vertex:
    post:
      description: |2+
        Adds a vertex collection to the set of orphan collections of the graph.
        If the collection does not exist, it will be created.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                options:
                  type: object
                  schema:
                    $ref: '#/components/schemas/post_api_vertex_create_opts'
                  description: |+
                    A JSON object to set options for creating vertex collections.
              required: []
      responses:
        '201':
          description: |2+
            Is returned if the collection could be created and waitForSync is enabled
            for the `_graphs` collection, or given in the request.
            The response body contains the graph configuration that has been stored.
        '202':
          description: |2+
            Is returned if the collection could be created and waitForSync is disabled
            for the `_graphs` collection, or given in the request.
            The response body contains the graph configuration that has been stored.
        '400':
          description: |2+
            Returned if the request is in an invalid format.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to modify a graph you at least need to have the following privileges
            1. `Administrate` access on the Database.
            2. `Read Only` access on every collection used within this graph.
        '404':
          description: |2+
            Returned if no graph with this name could be found.
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
name: HttpGharialAddVertexCol
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var url = "/_api/gharial/social/vertex";
  body = {
    collection: "otherVertices"
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
  /_api/gharial/{graph}/vertex/{collection}:
    delete:
      description: |2+
        Removes a vertex collection from the graph and optionally deletes the collection,
        if it is not used in any other graph.
        It can only remove vertex collections that are no longer part of edge definitions,
        if they are used in edge definitions you are required to modify those first.
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
          The name of the vertex collection.
        in: path
      - name: dropCollection
        schema:
          type: boolean
        required: false
        description: |+
          Drop the collection as well.
          Collection will only be dropped if it is not used in other graphs.
        in: query
      responses:
        '200':
          description: |2+
            Returned if the vertex collection was removed from the graph successfully
            and waitForSync is true.
        '202':
          description: |2+
            Returned if the request was successful but waitForSync is false.
        '400':
          description: |2+
            Returned if the vertex collection is still used in an edge definition.
            In this case it cannot be removed from the graph yet, it has to be
            removed from the edge definition first.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to drop a vertex you at least need to have the following privileges
              1. `Administrate` access on the Database.
        '404':
          description: |2+
            Returned if no graph with this name could be found.
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
name: HttpGharialRemoveVertexCollection
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  var g = examples.loadGraph("social");
  g._addVertexCollection("otherVertices");
  var url = "/_api/gharial/social/vertex/otherVertices";
  var response = logCurlRequest('DELETE', url);
  assert(response.code === 202);
  logJsonResponse(response);
~ examples.dropGraph("social");
~ db._drop("otherVertices");
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
name: HttpGharialRemoveVertexCollectionFailed
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  var g = examples.loadGraph("social");
  var url = "/_api/gharial/social/vertex/male";
  var response = logCurlRequest('DELETE', url);
  assert(response.code === 400);
  logJsonResponse(response);
  db._drop("male");
  db._drop("female");
  db._drop("relation");
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}/edge:
    get:
      description: |2+
        Lists all edge collections within this graph.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      responses:
        '200':
          description: |2+
            Is returned if the edge definitions could be listed.
        '404':
          description: |2+
            Returned if no graph with this name could be found.
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
name: HttpGharialListEdge
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var url = "/_api/gharial/social/edge";
  var response = logCurlRequest('GET', url);
  assert(response.code === 200);
  logJsonResponse(response);
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/gharial/{graph}/edge:
    post:
      description: |2+
        Adds an additional edge definition to the graph.
        This edge definition has to contain a *collection* and an array of
        each *from* and *to* vertex collections.  An edge definition can only
        be added if this definition is either not used in any other graph, or
        it is used with exactly the same definition. It is not possible to
        store a definition "e" from "v1" to "v2" in the one graph, and "e"
        from "v2" to "v1" in the other graph.
        Additionally, collection creation options can be set.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                collection:
                  type: string
                  description: |+
                    The name of the edge collection to be used.
                from:
                  type: array
                  description: |+
                    One or many vertex collections that can contain source vertices.
                to:
                  type: array
                  description: |+
                    One or many vertex collections that can contain target vertices.
                options:
                  type: object
                  schema:
                    $ref: '#/components/schemas/post_api_edgedef_create_opts'
                  description: |+
                    A JSON object to set options for creating collections within this
                    edge definition.
              required:
              - collection
              - from
              - to
      responses:
        '201':
          description: |2+
            Returned if the definition could be added successfully and
            waitForSync is enabled for the `_graphs` collection.
            The response body contains the graph configuration that has been stored.
        '202':
          description: |2+
            Returned if the definition could be added successfully and
            waitForSync is disabled for the `_graphs` collection.
            The response body contains the graph configuration that has been stored.
        '400':
          description: |2+
            Returned if the definition could not be added.
            This could be because it is ill-formed, or
            if the definition is used in an other graph with a different signature.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to modify a graph you at least need to have the following privileges
            1. `Administrate` access on the Database.
        '404':
          description: |2+
            Returned if no graph with this name could be found.
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
name: HttpGharialAddEdgeCol
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var url = "/_api/gharial/social/edge";
  body = {
    collection: "works_in",
    from: ["female", "male"],
    to: ["city"]
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
  /_api/gharial/{graph}/edge/{definition}#definition:
    put:
      description: |2+
        Change one specific edge definition.
        This will modify all occurrences of this definition in all graphs known to your database.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      - name: definition
        schema:
          type: string
        required: true
        description: |+
          The name of the edge collection used in the definition.
        in: path
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Define if the request should wait until synced to disk.
        in: query
      - name: dropCollections
        schema:
          type: boolean
        required: false
        description: |+
          Drop the collection as well.
          Collection will only be dropped if it is not used in other graphs.
        in: query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                collection:
                  type: string
                  description: |+
                    The name of the edge collection to be used.
                from:
                  type: array
                  description: |+
                    One or many vertex collections that can contain source vertices.
                to:
                  type: array
                  description: |+
                    One or many vertex collections that can contain target vertices.
                options:
                  type: object
                  schema:
                    $ref: '#/components/schemas/post_api_edgedef_modify_opts'
                  description: |+
                    A JSON object to set options for modifying collections within this
                    edge definition.
              required:
              - collection
              - from
              - to
      responses:
        '201':
          description: |2+
            Returned if the request was successful and waitForSync is true.
        '202':
          description: |2+
            Returned if the request was successful but waitForSync is false.
        '400':
          description: |2+
            Returned if the new edge definition is ill-formed and cannot be used.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to drop a vertex you at least need to have the following privileges
              1. `Administrate` access on the Database.
        '404':
          description: |2+
            Returned if no graph with this name could be found, or if no edge definition
            with this name is found in the graph.
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
name: HttpGharialReplaceEdgeCol
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var url = "/_api/gharial/social/edge/relation";
  body = {
    collection: "relation",
    from: ["female", "male", "animal"],
    to: ["female", "male", "animal"]
  };
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
  /_api/gharial/{graph}/edge/{definition}#definition:
    delete:
      description: |2+
        Remove one edge definition from the graph.  This will only remove the
        edge collection, the vertex collections remain untouched and can still
        be used in your queries.
      parameters:
      - name: graph
        schema:
          type: string
        required: true
        description: |+
          The name of the graph.
        in: path
      - name: definition
        schema:
          type: string
        required: true
        description: |+
          The name of the edge collection used in the definition.
        in: path
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Define if the request should wait until synced to disk.
        in: query
      - name: dropCollections
        schema:
          type: boolean
        required: false
        description: |+
          Drop the collection as well.
          Collection will only be dropped if it is not used in other graphs.
        in: query
      responses:
        '201':
          description: |2+
            Returned if the edge definition could be removed from the graph
            and waitForSync is true.
        '202':
          description: |2+
            Returned if the edge definition could be removed from the graph and
            waitForSync is false.
        '403':
          description: |2+
            Returned if your user has insufficient rights.
            In order to drop a vertex you at least need to have the following privileges
              1. `Administrate` access on the Database.
        '404':
          description: |2+
            Returned if no graph with this name could be found,
            or if no edge definition with this name is found in the graph.
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
name: HttpGharialEdgeDefinitionRemove
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
~ examples.dropGraph("social");
  examples.loadGraph("social");
  var url = "/_api/gharial/social/edge/relation";
  var response = logCurlRequest('DELETE', url);
  assert(response.code === 202);
  logJsonResponse(response);
  db._drop("relation");
  examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

