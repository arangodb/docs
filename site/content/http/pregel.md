---
fileID: pregel
title: Pregel HTTP API
weight: 2020
description: 
layout: default
---
See [Distributed Iterative Graph Processing (Pregel)](../data-science/pregel/)
for details.

```http-spec
openapi: 3.0.2
paths:
  /_api/control_pregel:
    post:
      description: |2+
        To start an execution you need to specify the algorithm name and a named graph
        (SmartGraph in cluster). Alternatively you can specify the vertex and edge
        collections. Additionally you can specify custom parameters which vary for each
        algorithm, see [Pregel - Available Algorithms](https://www.arangodb.com/docs/stable/graphs-pregel.html#available-algorithms).
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                algorithm:
                  type: string
                  description: |+
                    Name of the algorithm. One of:
                    - `"pagerank"` - Page Rank
                    - `"sssp"` - Single-Source Shortest Path
                    - `"connectedcomponents"` - Connected Components
                    - `"wcc"` - Weakly Connected Components
                    - `"scc"` - Strongly Connected Components
                    - `"hits"` - Hyperlink-Induced Topic Search
                    - `"effectivecloseness"` - Effective Closeness
                    - `"linerank"` - LineRank
                    - `"labelpropagation"` - Label Propagation
                    - `"slpa"` - Speaker-Listener Label Propagation
                graphName:
                  type: string
                  description: |+
                    Name of a graph. Either this or the parameters `vertexCollections` and
                    `edgeCollections` are required.
                    Please note that there are special sharding requirements for graphs in order
                    to be used with Pregel.
                vertexCollections:
                  type: array
                  items:
                    type: string
                  description: |+
                    List of vertex collection names.
                    Please note that there are special sharding requirements for collections in order
                    to be used with Pregel.
                edgeCollections:
                  type: array
                  items:
                    type: string
                  description: |+
                    List of edge collection names.
                    Please note that there are special sharding requirements for collections in order
                    to be used with Pregel.
                params:
                  type: object
                  description: |+
                    General as well as algorithm-specific options.
                    The most important general option is "store", which controls whether the results
                    computed by the Pregel job are written back into the source collections or not.
                    Another important general option is "parallelism", which controls the number of
                    parallel threads that work on the Pregel job at most. If "parallelism" is not
                    specified, a default value may be used. In addition, the value of "parallelism"
                    may be effectively capped at some server-specific value.
                    The option "useMemoryMaps" controls whether to use disk based files to store
                    temporary results. This might make the computation disk-bound, but allows you to
                    run computations which would not fit into main memory. It is recommended to set
                    this flag for larger datasets.
                    The attribute "shardKeyAttribute" specifies the shard key that edge collections are
                    sharded after (default: `"vertex"`).
              required:
              - algorithm
      responses:
        '200':
          description: |2
            HTTP 200 is returned in case the Pregel was successfully created and the reply
            body is a string with the `id` to query for the status or to cancel the
            execution.
        '400':
          description: |2
            An HTTP 400 error is returned if the set of collections for the Pregel job includes
            a system collection, or if the collections to not conform to the sharding requirements
            for Pregel jobs.
        '403':
          description: |2
            An HTTP 403 error is returned if there are not sufficient privileges to access
            the collections specified for the Pregel job.
        '404':
          description: "\nAn HTTP 404 error is returned if the specified \"algorithm\"\
            \ is not found, or the\ngraph specified in \"graphName\" is not found,\
            \ or at least one the collections \nspecified in \"vertexCollections\"\
            \ or \"edgeCollections\" is not found.\n"
      tags:
      - Pregel
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestPregelStartConnectedComponents
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("connectedComponentsGraph");
  var url = "/_api/control_pregel";
  var body = {
    algorithm: "wcc",
    graphName: "connectedComponentsGraph",
    params: {
      maxGSS: graph.components.count(),
      resultField: "component",
    }
  }
  var response = logCurlRequest("POST", url, body);
  assert(response.code === 200);
  logJsonResponse(response);
  var id = JSON.parse(response.body);
  var url = "/_api/control_pregel/" + id;
  while (true) {
    var status = internal.arango.GET(url);
    if (["done", "canceled", "fatal error"].includes(status.state)) {
      assert(status.state == "done");
      break;
    } else {
      print(`Waiting for Pregel job ${id} (${status.state})...`);
      internal.sleep(0.5);
    }
  }
  examples.dropGraph("connectedComponentsGraph");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/control_pregel/{id}:
    get:
      description: |2+
        Returns the current state of the execution, the current global superstep, the
        runtime, the global aggregator values as well as the number of sent and
        received messages.
      parameters:
      - name: id
        schema:
          type: number
        required: true
        description: |+
          Pregel execution identifier.
        in: path
      responses:
        '200':
          description: |2
            HTTP 200 is returned in case the job execution ID was valid and the state is
            returned along with the response.
        '404':
          description: |2
            An HTTP 404 error is returned if no Pregel job with the specified execution number
            is found or the execution number is invalid.
          content:
            application/json:
              schema:
                type: object
                properties:
                  ? ''
                  : $ref: '#/components/schemas/get_api_control_pregel'
                    description: |2+
                required:
                - ''
      tags:
      - Pregel
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestPregelStatusConnectedComponents
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("connectedComponentsGraph");
  var url = "/_api/control_pregel";
  var body = {
    algorithm: "wcc",
    graphName: "connectedComponentsGraph",
    params: {
      maxGSS: graph.components.count(),
      resultField: "component"
    }
  };
  var id = internal.arango.POST(url, body);
  var url = "/_api/control_pregel/" + id;
  while (true) {
    var status = internal.arango.GET(url);
    if (status.error    ["done", "canceled", "fatal error"].includes(status.state)) {
      assert(status.state == "done");
      break;
    } else {
      print(`Waiting for Pregel job ${id} (${status.state})...`);
      internal.sleep(0.5);
    }
  }
  var response = logCurlRequest("GET", url);
  assert(response.code === 200);
  logJsonResponse(response);
  examples.dropGraph("connectedComponentsGraph");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/control_pregel:
    get:
      description: |2+
        Returns a list of currently running and recently finished Pregel jobs without
        retrieving their results.
      responses:
        '200':
          description: |2
            Is returned when the list of jobs can be retrieved successfully.
      tags:
      - Pregel
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestPregelStatusAllConnectedComponents
release: stable
version: '3.10'
---
  var assertInstanceOf = require("jsunity").jsUnity.assertions.assertInstanceOf;
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("connectedComponentsGraph");
  var url = "/_api/control_pregel";
  var body = {
    algorithm: "wcc",
    graphName: "connectedComponentsGraph",
    params: {
      maxGSS: graph.components.count(),
      resultField: "component"
    }
  };
  var id = internal.arango.POST(url, body);
  var url = "/_api/control_pregel/";
  var response = logCurlRequest("GET", url);
  assert(response.code === 200);
  assertInstanceOf(Array, response.parsedBody);
  assert(response.parsedBody.length > 0);
  internal.arango.DELETE(url + id);
  logJsonResponse(response);
  examples.dropGraph("connectedComponentsGraph");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/control_pregel/{id}:
    delete:
      description: |2+
        Cancel an execution which is still running, and discard any intermediate
        results. This immediately frees all memory taken up by the execution, and
        makes you lose all intermediary data.
        You might get inconsistent results if you requested to store the results and
        then cancel an execution when it is already in its `"storing"` state (or
        `"done"` state in versions prior to 3.7.1). The data is written multi-threaded
        into all collection shards at once. This means there are multiple transactions
        simultaneously. A transaction might already be committed when you cancel the
        execution job. Therefore, you might see some updated documents, while other
        documents have no or stale results from a previous execution.
      parameters:
      - name: id
        schema:
          type: number
        required: true
        description: |+
          Pregel execution identifier.
        in: path
      responses:
        '200':
          description: |2
            HTTP 200 is returned if the job execution ID was valid.
        '404':
          description: |2
            An HTTP 404 error is returned if no Pregel job with the specified execution number
            is found or the execution number is invalid.
      tags:
      - Pregel
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestPregelCancelConnectedComponents
release: stable
version: '3.10'
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("connectedComponentsGraph");
  var url = "/_api/control_pregel";
  var body = {
    algorithm: "wcc",
    graphName: "connectedComponentsGraph",
    params: {
      maxGSS: graph.components.count(),
      store: false
    }
  };
  var id = internal.arango.POST(url, body);
  var url = "/_api/control_pregel/" + id;
  var response = logCurlRequest("DELETE", url);
  assert(response.code === 200);
  logJsonResponse(response);
  examples.dropGraph("connectedComponentsGraph");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

