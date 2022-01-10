---
layout: default
description: Pregel enables you to do online analytical processing directly on graphs stored in ArangoDB.
title: Distributed Iterative Graph Processing (Pregel)
---
Distributed Iterative Graph Processing (Pregel)
===============================================

Distributed graph processing enables you to do online analytical processing
directly on graphs stored in ArangoDB. This is intended to help you gain
analytical insights on your data, without having to use external processing
systems. Examples of algorithms to execute are PageRank, Vertex Centrality,
Vertex Closeness, Connected Components, Community Detection.

Check out the hands-on
[ArangoDB Pregel Tutorial](https://www.arangodb.com/pregel-community-detection/){:target="_blank"}
to learn more.

The processing system inside ArangoDB is based on:
[Pregel: A System for Large-Scale Graph Processing](http://www.dcs.bbk.ac.uk/~dell/teaching/cc/paper/sigmod10/p135-malewicz.pdf){:target="_blank"}
– Malewicz et al. (Google), 2010.
This concept enables us to perform distributed graph processing, without the
need for distributed global locking.

This system is not useful for typical online queries, where you just work on
a small set of vertices. These kind of tasks are better suited for
[AQL traversals](aql/graphs.html).

Prerequisites
-------------

If you run a single ArangoDB instance in single-server mode, there are no
requirements regarding the modeling of your data. All you need is at least one
vertex collection and one edge collection.

In cluster mode, the collections need to be sharded in a specific way to ensure
correct results: The outgoing edges of a vertex need to be on the same DB-Server
as the vertex. This is guaranteed by [SmartGraphs](graphs-smart-graphs.html).

{% include hint-ee.md feature="SmartGraphs (and thus Pregel in cluster deployments)" plural=true %}

Note that the performance may be better, if the number of your shards /
collections matches the number of CPU cores.

Arangosh API
------------

### Starting an Algorithm Execution

The Pregel API is accessible through the `@arangodb/pregel` package.

To start an execution you need to specify the **algorithm** name and a
named graph (SmartGraph in cluster). Alternatively you can specify the vertex
and edge collections. Additionally you can specify custom parameters which vary
for each algorithm. The `start()` method will always return a unique ID which
can be used to interact with the algorithm and later on.

The below variant of the `start()` method can be used for named graphs:

```js
var pregel = require("@arangodb/pregel");
var params = {};
var execution = pregel.start("<algorithm>", "<yourgraph>", params);
```

`params` needs to be an object, the valid keys are mentioned below in the
section [Available Algorithms](#available-algorithms).

Alternatively you might want to specify the vertex and edge collections
directly. The call syntax of the `start()` method changes in this case.
The second argument must be an object with the keys `vertexCollections`
and `edgeCollections`.

```js
var pregel = require("@arangodb/pregel");
var params = {};
var execution = pregel.start("<algorithm>", {vertexCollections:["vertices"], edgeCollections:["edges"]}, params);
```

The last argument is still the parameter object. See below for a list of
algorithms and parameters.

### Status of an Algorithm Execution

The code returned by the `pregel.start(...)` method can be used to track the
status of your algorithm.

```js
var execution = pregel.start("sssp", "demograph", {source: "vertices/V"});
var status = pregel.status(execution);
```

The result will tell you the current status of the algorithm execution.
It will tell you the current `state` of the execution, the current
global superstep, the runtime, the global aggregator values as well as the
number of send and received messages.

The `state` field has one of the following values:

| State          | Description    |
|:---------------|:---------------|
| `"running"`    | Algorithm is executing normally.
| `"in error"`   | The execution is in an error state. This can be caused by primary DB-Servers being not reachable or being non responsive. The execution might recover later, or switch to "canceled" if it was not able to recover successfully
| `"recovering"` | The execution is actively recovering, will switch back to "running" if the recovery was successful
| `"canceled"`   | The execution was permanently canceled, either by the user or by an error.
| `"storing"`    | The algorithm finished, but the results are still being written back into the collections. Occurs if the `store` parameter is set to `true` only.
| `"done"`       | The execution is done. In version 3.7.1 and later, this means that storing is also done. In earlier versions, the results may not be written back into the collections yet. This event is announced in the server log (requires at least *info* log level for the *pregel* topic).

The object returned by the `status()` method might for example look something
like this:

```json
{
  "state" : "running",
  "gss" : 12,
  "totalRuntime" : 123.23,
  "aggregators" : {
    "converged" : false,
    "max" : true,
    "phase" : 2
  },
  "sendCount" : 3240364978,
  "receivedCount" : 3240364975
}
```

### Canceling an Execution / Discarding results

To cancel an execution which is still running, and discard any intermediate
results you can use the `cancel()` method. This will immediately free all
memory taken up by the execution, and will make you lose all intermediary data.

```js
// start a single source shortest path job
var execution = pregel.start("sssp", "demograph", {source: "vertices/V"});
pregel.cancel(execution);
```

You might get inconsistent results if you requested to store the results and
then cancel an execution when it is already in its `storing` state (or `done`
state in versions prior to 3.7.1). The data is written multi-threaded into all
collection shards at once. This means there are multiple transactions
simultaneously. A transaction might already be committed when you cancel the
execution job. Therefore, you might see some updated documents, while other
documents have no or stale results from a previous execution.

AQL integration
---------------

When the graph processing subsystem finishes executing an algorithm, the
results can either be written back into documents or kept in memory only.
If the data is persisted, then you can query the documents normally to get
access to the results.

If you do not want to store results, then they are only held temporarily,
until you call the `cancel()` method. The in-memory results can be accessed
via the `PREGEL_RESULT()` AQL function.

The result field names depend on the algorithm in both cases.

For example, you might want to query only nodes with the highest rank from the
result set of a PageRank execution:

```js
FOR v IN PREGEL_RESULT(<handle>)
  FILTER v.result >= 0.01
  RETURN v._key
```

By default, the `PREGEL_RESULT()` AQL function will return the `_key` of each
vertex plus the result of the computation. In case the computation was done for
vertices from different vertex collection, just the `_key` values may not be
sufficient to tell vertices from different collections apart. In  this case,
`PREGEL_RESULT()` can be given a second parameter `withId`, which will make it
return the `_id` values of the vertices as well:

```js
FOR v IN PREGEL_RESULT(<handle>, true)
  FILTER v.result >= 0.01
  RETURN v._id
```

Algorithm Parameters
--------------------

There are a number of general parameters which apply to almost all algorithms:

- `store` (bool): Defaults to *true*. If true, the Pregel engine will write
  results back to the database. If the value is *false* then you can query the
  results with `PREGEL_RESULT()` in AQL. See [AQL integration](#aql-integration)
- `maxGSS` (number): Maximum number of global iterations for this algorithm
- `parallelism` (number): Number of parallel threads to use per worker.
  Does not influence the number of threads used to load or store data from the
  database (this depends on the number of shards).
- `async` (bool): Algorithms which support asynchronous mode will run without
  synchronized global iterations. Might lead to performance increases if you
  have load imbalances.
- `resultField` (string): Most algorithms use this as attribute name for the
  result. Some use it as prefix for multiple result attributes. Defaults to
  `"result"`.
- `useMemoryMaps` (bool): Use disk based files to store temporary results.
  This might make the computation disk-bound, but allows you to run computations
  which would not fit into main memory. It is recommended to set this flag for
  larger datasets.
- `shardKeyAttribute` (string): shard key that edge collections are sharded
  after (default: `"vertex"`)

Available Algorithms
--------------------

### Page Rank

PageRank is a well known algorithm to rank documents in a graph. The algorithm
will run until the execution converges. Specify a custom threshold with the
parameter `threshold`, to run for a fixed number of iterations use the
`maxGSS` parameter.

```js
var pregel = require("@arangodb/pregel");
pregel.start("pagerank", "graphname", {maxGSS: 100, threshold: 0.00000001, resultField: "rank"})
```

#### Seeded PageRank

It is possible to specify an initial distribution for the vertex documents in
your graph. To define these seed ranks / centralities you can specify a
`sourceField` in the properties for this algorithm. If the specified field is
set on a document _and_ the value is numeric, then it will be used instead of
the default initial rank of `1 / numVertices`.

```js
var pregel = require("@arangodb/pregel");
pregel.start("pagerank", "graphname", {maxGSS: 20, threshold: 0.00000001, sourceField: "seed", resultField: "rank"})
```

### Single-Source Shortest Path

Calculates the shortest path length between the source and all other vertices.
The distance to the source vertex itself is returned as `0` and a length above
`9007199254740991` (max safe integer) means that there is no connection between
a pair of vertices.

The algorithm will run until it converges, the iterations are bound by the
diameter (the longest shortest path) of your graph.

Requires a `source` document ID parameter. The result field needs to be
specified in `_resultField` (note the underscore).

```js
var pregel = require("@arangodb/pregel");
pregel.start("sssp", "graphname", {source: "vertices/1337", _resultField: "distance"});
```

### Connected Components

There are three algorithms to find connected components in a graph:

1. If your graph is effectively undirected (you have edges in both directions
   between vertices) then the simple **connected components** algorithm named
   `"connectedcomponents"` is suitable.

   It is a very simple and fast algorithm, but will only work correctly on
   undirected graphs. Your results on directed graphs may vary, depending on
   how connected your components are.

2. To find **weakly connected components** (WCC) you can use the algorithm
   named `"wcc"`. Weakly connected means that there exists a path from every
   vertex pair in that component.

   This algorithm will work on directed graphs but requires a greater amount of
   traffic between your DB-Servers.

3. To find **strongly connected components** (SCC) you can use the algorithm
   named `"scc"`. Strongly connected means every vertex is reachable from any
   other vertex in the same component.

   The algorithm is more complex than the WCC algorithm and requires more
   memory, because each vertex needs to store much more state. Consider using
   WCC if you think your data may be suitable for it.

All above algorithms will assign a component ID to each vertex.

```js
var pregel = require("@arangodb/pregel");

// connected components
pregel.start("connectedcomponents", "graphname", {resultField: "component"});

// weakly connected components
pregel.start("wcc", "graphname", {resultField: "component_weak"});

// strongly connected components
pregel.start("scc", "graphname", {resultField: "component_strong"});
```

### Hyperlink-Induced Topic Search (HITS)

HITS is a link analysis algorithm that rates Web pages, developed by
Jon Kleinberg. The algorithm is also known as _Hubs and Authorities_.

The idea behind Hubs and Authorities comes from the typical structure of the web:
Certain websites known as hubs, serve as large directories that are not actually
authoritative on the information that they hold. These hubs are used as
compilations of a broad catalog of information that leads users direct to other
authoritative webpages.

The algorithm assigns each vertex two scores: The authority score and the
hub score. The authority score rates how many good hubs point to a particular
vertex (or webpage), the hub score rates how good (authoritative) the vertices
pointed to are. Also see
[en.wikipedia.org/wiki/HITS_algorithm](https://en.wikipedia.org/wiki/HITS_algorithm){:target="_blank"}

ArangoDB's version of the algorithm converges after a certain amount of time.
The parameter *threshold* can be used to set a limit for the convergence
(measured as maximum absolute difference of the hub and authority scores
between the current and last iteration).

When you specify the result field name, the hub score will be stored in
`<resultField>_hub` and the authority score in `<resultField>_auth`.

The algorithm can be executed like this:

```js
var pregel = require("@arangodb/pregel");
var handle = pregel.start("hits", "yourgraph", {threshold:0.00001, resultField: "score"});
```

### Vertex Centrality

Centrality measures help identify the most important vertices in a graph.
They can be used in a wide range of applications: For example they can be used
to identify *influencers* in social networks, or *middle-men* in terrorist
networks.

There are various definitions for centrality, the simplest one being the
vertex degree. These definitions were not designed with scalability in mind.
It is probably impossible to discover an efficient algorithm which computes
them in a distributed way. Fortunately there are scalable substitutions
available, which should be equally usable for most use cases.

![Illustration of an execution of different centrality measures (Freeman 1977)](images/centrality_visual.png)

#### Effective Closeness

A common definitions of centrality is the **closeness centrality**
(or closeness). The closeness of a vertex in a graph is the inverse average
length of the shortest path between the vertex and all other vertices.
For vertices *x*, *y* and shortest distance `d(y, x)` it is defined as:

![Vertex Closeness Formula](images/closeness.png)

Effective Closeness approximates the closeness measure. The algorithm works by
iteratively estimating the number of shortest paths passing through each vertex.
The score will approximates the real closeness score, since it is not possible
to actually count all shortest paths due to the horrendous `O(n^2 * d)` memory
requirements. The algorithm is from the paper
*Centralities in Large Networks: Algorithms and Observations (U Kang et.al. 2011)*.

ArangoDBs implementation approximates the number of shortest path in each
iteration by using a HyperLogLog counter with 64 buckets. This should work well
on large graphs and on smaller ones as well. The memory requirements should be
**O(n * d)** where *n* is the number of vertices and *d* the diameter of your
graph. Each vertex will store a counter for each iteration of the algorithm.

The algorithm can be used like this:

```js
const pregel = require("@arangodb/pregel");
const handle = pregel.start("effectivecloseness", "yourgraph", {resultField: "closeness"});
```

#### LineRank

Another common measure is the [betweenness* centrality](https://en.wikipedia.org/wiki/Betweenness_centrality){:target="_blank"}:
It measures the number of times a vertex is part of shortest paths between any
pairs of vertices. For a vertex *v* betweenness is defined as:

![Vertex Betweenness Formula](images/betweenness.png)

Where the &sigma; represents the number of shortest paths between *x* and *y*,
and &sigma;(v) represents the number of paths also passing through a vertex *v*.
By intuition a vertex with higher betweenness centrality will have more
information passing through it.

**LineRank** approximates the random walk betweenness of every vertex in a
graph. This is the probability that someone starting on an arbitrary vertex,
will visit this node when he randomly chooses edges to visit.

The algorithm essentially builds a line graph out of your graph
(switches the vertices and edges), and then computes a score similar to PageRank.
This can be considered a scalable equivalent to vertex betweenness, which can
be executed distributedly in ArangoDB. The algorithm is from the paper
*Centralities in Large Networks: Algorithms and Observations (U Kang et.al. 2011)*.

```js
const pregel = require("@arangodb/pregel");
const handle = pregel.start("linerank", "yourgraph", {resultField: "linerank"});
```

### Community Detection

Graphs based on real world networks often have a community structure.
This means it is possible to find groups of vertices such that each vertex
group is internally more densely connected than outside the group.
This has many applications when you want to analyze your networks, for example
Social networks include community groups (the origin of the term, in fact)
based on common location, interests, occupation, etc.

#### Label Propagation

*Label Propagation* can be used to implement community detection on large
graphs. The idea is that each vertex should be in the community that most of
his neighbors are in. We iteratively determine this by first assigning random
Community ID's. Then each iteration, a vertex will send it's current community
ID to all its neighbor vertices. Then each vertex adopts the community ID it
received most frequently during the iteration.

The algorithm runs until it converges, which likely never really happens on
large graphs. Therefore you need to specify a maximum iteration bound which
suits you. The default bound is 500 iterations, which is likely too large for
your application. It should work best on undirected graphs, results on directed
graphs might vary depending on the density of your graph.

```js
const pregel = require("@arangodb/pregel");
const handle = pregel.start("labelpropagation", "yourgraph", {maxGSS: 100, resultField: "community"});
```

#### Speaker-Listener Label Propagation

The [Speaker-listener Label Propagation](https://arxiv.org/pdf/1109.5720.pdf){:target="_blank"}
(SLPA) can be used to implement community detection. It works similar to the
label propagation algorithm, but now every node additionally accumulates a
memory of observed labels (instead of forgetting all but one label).

Before the algorithm run, every vertex is initialized with an unique ID
(the initial community label).
During the run three steps are executed for each vertex:

1. Current vertex is the listener all other vertices are speakers
2. Each speaker sends out a label from memory, we send out a random label with a
   probability proportional to the number of times the vertex observed the label
3. The listener remembers one of the labels, we always choose the most
   frequently observed label

```js
const pregel = require("@arangodb/pregel");
const handle = pregel.start("slpa", "yourgraph", {maxGSS:100, resultField: "community"});
```

You can also execute SLPA with the `maxCommunities` parameter to limit the
number of output communities. Internally the algorithm will still keep the
memory of all labels, but the output is reduced to just he `n` most frequently
observed labels.

```js
const pregel = require("@arangodb/pregel");
const handle = pregel.start("slpa", "yourgraph", {maxGSS: 100, resultField: "community", maxCommunities: 1});
// check the status periodically for completion
pregel.status(handle);
```

Limits
------

Pregel algorithms in ArangoDB will by default store temporary vertex and edge
data in main memory. For large datasets this is going to cause problems, as
servers may run out of memory while loading the data.

To avoid servers from running out of memory while loading the dataset, a Pregel
job can be started with the attribute `useMemoryMaps` set to `true`. This will
make the algorithm use memory-mapped files as a backing storage in case of huge
datasets. Falling back to memory-mapped files might make the computation
disk-bound, but may be the only way to complete the computation at all.

Parts of the Pregel temporary results (aggregated messages) may also be
stored in main memory, and currently the aggregation cannot fall back to
memory-mapped files. That means if an algorithm needs to store a lot of
result messages temporarily, it may consume a lot of main memory.

In general it is also recommended to set the `store` attribute of Pregel jobs
to `true` to make a job store its value on disk and not just in main memory.
This way the results are removed from main memory once a Pregel job completes.
If the `store` attribute is explicitly set to `false`, result sets of completed
Pregel runs will not be removed from main memory until the result set is
explicitly discarded by a call to the `cancel()` method
(or a shutdown of the server).
