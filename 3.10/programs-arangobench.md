---
layout: default
description: arangobench is ArangoDB's benchmark and test tool
---
# arangobench

_arangobench_ is ArangoDB's benchmark and test tool. It can be used to issue
test requests to the database system for performance and server function
testing. It supports parallel querying and batch requests.

_arangobench_ is a client tool which makes network connections to an ArangoDB
server in about the same way as a client application would do via an ArangoDB
client driver. It thus often provides good enough throughput and performance
estimates. It provides different test cases that can be executed, that reflect
a broader set of use cases. It is useful to pick and run the test cases that
most closely resemble typical or expected workloads.

## General configuration

_arangobench_ can be run on the same host as the ArangoDB server, or on a
different host. When using it against a cluster, it must be connected to one of
the cluster's Coordinators. It can communicate over normal (unencrypted) TCP
connections and encrypted SSL/TLS connections.

The most important general _arangobench_ options are:

- `--server.endpoint`: the server endpoint to connect to. This can be a remote
  server or a server running on the same host. The endpoint also specifies
  whether encryption at transit (TLS) should be used. Multiple endpoints can be
  provided. Example:
 
  ```
  arangobench \
    --server.endpoint tcp://[::1]::8529 \
    --server.endpoint tcp://[::1]::8530 \
    --server.endpoint tcp://[::1]::8531 \
    ...
  ``` 

- `--server.username` and `--server.password`: these can be used to authenticate
  with an existing ArangoDB installation.
- `--test-case`: selects the test case to be executed by _arangobench_. A list
  of the available test cases can be retrieved by running _arangobench_ with
  the `--help` option. For detailed descriptions see [Test Cases](#test-cases).
- `--requests`: total number of requests to be executed by _arangobench_ in the
  selected test case. If batching is used, multiple operations will still be
  counted individually, even though they may be sent together in a single
  request.
- `--runs`: number of test case runs to perform. This option defaults to `1`,
  but it can be increased so that result outliers have less influence on the
  test results.

General options that can affect test case performance and throughput:

- `--threads`: number of parallel threads to use by _arangobench_.
  Increasing this value should normally increase throughput, unless some
  saturation or congestion is reached in either _arangobench_ itself, the
  network layer or the ArangoDB instance.
  If increasing `--threads` does not improve throughput or even decreases it,
  it should be determined which part of the setup is the bottleneck.
- `--wait-for-sync`: whether or not all write operations performed by test
  cases should be executed with the `waitForSync` flag. If this is true, write
  operations are blocking and only return once they have been fully
  acknowledged by the server's disk subsystem(s).
  Setting `--wait-for-sync` to `true` will have a large negative impact on
  write performance and is thus not recommended for most use cases.
- `--async`: if set to `true`, it will make _arangobench_ send fire-and-forget
  requests. These requests will be responded directly after having been added
  to the server's request processing queue. _arangobench_ will not wait for the
  operation to be fully executed on the server side. All it checks for is
  whether the server was able to queue the operation(s). The _arangobench_ test
  case may complete before the queued operations have been fully processed on
  the server. In addition, sending more requests than the server can handle for
  a prolonged time may lead to the server's scheduler queue filling up.
  The server-side scheduler queue has a limited capacity, and once it is full,
  any further incoming requests will be rejected by the server with HTTP 503
  "Service unavailable" until there is again some capacity in the queue.
- `--batch-size`: by default, _arangobench_ will send one HTTP request per test
  case operation. This is often okay for test cases that execute a certain AQL
  query or such, when there is naturally no other request to batch the query
  with. However, in some use cases multiple operations can actually be sent
  together in a single HTTP request. The prime example for this is
  bulk-inserting documents, which are normally sent to the server in batches by
  client programs anyway. Any value greater than `1` will make _arangobench_
  send batch requests. Using batching should normally increase the throughput.
- `--complexity`: some test cases can be adjusted via the `--complexity`
  parameter, which often controls the number of document attributes that are
  inserted in document-centric test cases.
- `--keep-alive`: whether or not _arangobench_ should use HTTP keep-alive
  connections. This should always be turned on.

Important cluster-specific options are:

- `--number-of-shards`: number of shards for collections created by
  _arangobench_. This option is only meaningful for test cases that create
  collections.
- `--replication-factor`: number of replicas for each shard in collections
  created by _arangobench_. This option is only meaningful for test cases that
  write into collections. The larger the replication factor is, the more
  expensive write operations will become.

## Test Cases

_arangobench_ provides the following predefined test cases. The test case to be
executed can be selected via the `--test-case` startup option.

Note that these test cases have been added over time, and not all of them may
be fully appropriate for a given workload test. Some test cases are deprecated
and will be removed in a future version.

In order to benchmark custom AQL queries, the appropriate test case to run is
`custom-query`.

| Test Case | Description |
|:----------|:------------|
| `aqlinsert` | performs AQL queries that insert one document per query. The `--complexity` parameter controls the number of attributes per document. The attribute values for the inserted documents will be hard-coded, except `_key`. The total number of documents to be inserted is equal to the value of `--requests`. |
| `collection` | creates as many separate (empty) collections as provided in the value of `--requests`. |
| `custom-query` | executes a custom AQL query, that can be specified either via the `--custom-query` option or be read from a file specified via the `--custom-query-file` option. The query will be executed as many times as the value of `--requests`. The `--complexity` parameter is not used. If the query string contains bind variables, they need to be provided separately via the `--custom-query-bindvars` option, which should contain all bind variables as key/value pairs inside a JSON object. |
| `crud` | will perform a mix of insert, update, get and remove operations for documents. 20% of the operations will be single-document inserts, 20% of the operations will be single-document updates, 40% of the operations are single-document read requests, and 20% of the operations will be single-document removals. There will be a total of `--requests` operations. The `--complexity` parameter can be used to control the number of attributes for the inserted and updated documents. |
| `crud-append` | will perform a mix of insert, update and get operations for documents. 25% of the operations will be single-document inserts, 25% of the operations will be single-document updates, and 50% of the operations are single-document read requests. There will be a total of `--requests` operations. The `--complexity` parameter can be used to control the number of attributes for the inserted and updated documents. |
| `crud-write-read` | will perform a 50-50 mix of insert and retrieval operations for documents. 50% of the operations will be single-document inserts, 50% of the operations will be single-document read requests. There will be a total of `--requests` operations. The `--complexity` parameter can be used to control the number of attributes for the inserted documents. |
| `document` | performs single-document insert operations via the specialized insert API (in contrast to performing inserts via generic AQL). The `--complexity` parameter controls the number of attributes per document. The attribute values for the inserted documents will be hard-coded. The total number of documents to be inserted is equal to the value of `--requests`. |
| `edge-crud` | will perform a mix of insert, update and get operations for edges. 25% of the operations will be single-edge inserts, 25% of the operations will be single-edge updates, and 50% of the operations are single-edge read requests. There will be a total of `--requests` operations. The `--complexity` parameter can be used to control the number of attributes for the inserted and updated edges. |
| `persistent-index` | will perform a mix of insert, update and get operations for documents. The collection created by this test does have an extra, non-unique, non-sparse `persistent` index on one attribute. 25% of the operations will be single-document inserts, 25% of the operations will be single-document updates, and 50% of the operations are single-document read requests. There will be a total of `--requests` operations. The `--complexity` parameter can be used to control the number of attributes for the inserted and updated documents. This test case can be used to determine the effects on write throughput caused by adding a secondary index to a collection. It originally tested a `hash` index, but both the in-memory hash and skiplist index types were removed in favor of the RocksDB-based persistent index type. |
| `import-document` | performs multi-document imports using the specialized import API (in contrast to performing inserts via generic AQL). Each inserted document will have two attributes. The `--complexity` parameter controls the number of documents per import request. The total number of documents to be inserted is equal to the value of `--requests` times the value of `--complexity`. |
| `version` | queries the server version and then instantly returns. In a cluster, this means that Coordinators instantly respond to the requests without ever accessing DB-Servers. This test can be used to establish a baseline for single server or Coordinator throughput. The `--complexity` parameter is not used. |

## Display histogram

By default, displaying the histogram of a test run is switched off. To enable it, set the `--histogram.generate` flag to true.

## Troubleshooting

The test cases provided by _arangobench_ vary significantly in _how_ they
perform operations. For example, inserting documents into ArangoDB can be
achieved by either:

- **single-document inserts**
  (one document per request to `/_api/document`)
- **multi-document inserts**
  (multiple documents per request to `/_api/document` or `/_api/import`)
- **single-document AQL insert queries**
  (one document per AQL query to `/_api/cursor`)
- **multi-document AQL insert queries**
  (multiple documents per AQL query to `/_api/cursor`)

Especially for insert operations, AQL queries will have higher setup and 
teardown costs than plain Document API operations. Thus,
it is likely that higher throughput can be achieved by using the specialized
Document APIs in throughput tests rather than AQL queries.

Many test cases can benefit from using request batching, that can be turned on
in _arangobench_ via the `--batch-size` option. Batching makes sense in cases
where a client application would also send multiple operations in a single
request, e.g. when inserting documents in bulk. Batching is often the easiest
way to improve the throughput.

If increasing `--threads` for a given benchmark does not increase
throughput or even decreases it, it is likely that some saturation or congestion
is occurring somewhere in the stack.
On Linux systems, running `top` during the tests on the participating hosts
should reveal details about CPU usage (user, system, iowait) and memory usage.
This can be used as a quick first probe to see if any of the hosts is maxed out
on a particular resource (CPU power, available RAM, I/O throughput).
The ArangoDB servers also provide detailed metrics about CPU usage, I/O wait,
memory usage etc., which can be monitored during the benchmarks. The most
useful way of analyzing metrics is to have them scraped automatically by a
Prometheus instance and to make them available via Grafana. This allows metrics
to be collected over time and to compare them for multiple test runs with
different configurations. If Prometheus/Grafana cannot be used, the ArangoDB
web interface also provides a way to access the current values of all metrics
for privileged accounts.

A few useful metrics on the ArangoDB server side include:

- `arangodb_process_statistics_resident_set_size`: resident memory usage for an
  _arangod_ process, in bytes. Can be used to determine how much memory was used
  during the tests. If the memory usage is close to the capacity limit, this
  indicates that adding more memory could speed things up.
- `arangodb_process_statistics_resident_set_size_percent`: resident memory
  usage for an _arangod_ process, in percent of available RAM. Can be used to
  determine how much memory was used during the tests. If the memory usage is
  close to the capacity limit, this indicates that adding more memory could
  speed things up.
- `arangodb_scheduler_queue_full_failures_total`: contains the number of
  rejected requests because the scheduler's queue capacity was exceeded.
  If this contains values other than `0`, it indicates overload (i.e. more
  requests coming in than can be handled by the server).
- `arangodb_scheduler_queue_length`: number of requests in scheduler queue at a
  given point. This is expected to deviate from `0` if requests are queued, but
  the closer it is to the configured maximum queue length (default value: `4096`),
  the more close the server is to its processing capacity limit.
- `arangodb_server_statistics_system_percent`: on Linux, provides total %sys
  CPU time for a host (most likely used by _arangod_ or _arangobench_).
- `arangodb_server_statistics_user_percent`: on Linux, provides total %user
  CPU time for a host (most likely used by _arangod_ or _arangobench_).
- `arangodb_server_statistics_iowait_percent`: on Linux, provides total %iowait
  CPU time for a host (most likely used by _arangod_ or _arangobench_).

Another thing to check is the _arangobench_ location: if _arangobench_ runs on
the same host as the ArangoDB server, _arangobench_ and _arangod_ may compete
for the same resources. This may be appropriate if the production use case will
also use a localhost setup. If this is not the case, _arangobench_ should be
executed on a separate host and send its request over the network, in the same
way as the client applications are expected to do later.
