---
layout: default
description: >-
  Pregel enables you to do online analytical processing directly on graphs stored in ArangoDB.
---
# Distributed Iterative Graph Processing (Pregel)

{{ page.description }}
{:class="lead"}

Distributed graph processing enables you to do online analytical processing
directly on graphs stored in ArangoDB. This is intended to help you gain
analytical insights on your data, without having to use external processing
systems. Examples of algorithms to execute are PageRank, Vertex Centrality,
Vertex Closeness, Connected Components, Community Detection. 
For more details, see all [available algorithms](graphs-pregel-algorithms.html)
in ArangoDB.

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

_arangosh_ API
--------------

### Starting an Algorithm Execution

The Pregel API is accessible through the `@arangodb/pregel` package.

To start an execution you need to specify the **algorithm** name and a
named graph (SmartGraph in cluster). Alternatively, you can specify the vertex
and edge collections. Additionally, you can specify custom parameters which vary
for each algorithm. The `start()` method always returns a unique ID (a number) which
can be used to interact with the algorithm and later on.

The below variant of the `start()` method can be used for named graphs:

```js
var pregel = require("@arangodb/pregel");
var params = {};
var execution = pregel.start("<algorithm>", "<graphname>", params);
```

`params` needs to be an object, the valid keys are mentioned in the
page [Available Algorithms](graphs-pregel-algorithms.html).

Alternatively, you might want to specify the vertex and edge collections
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

It tells you the current `state` of the execution, the current
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

By default, the `PREGEL_RESULT()` AQL function returns the `_key` of each
vertex plus the result of the computation. In case the computation was done for
vertices from different vertex collections, just the `_key` values may not be
sufficient to distinguish vertices from different collections. In this case,
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