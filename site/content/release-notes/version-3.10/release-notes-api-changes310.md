---
fileID: release-notes-api-changes310
title: API Changes in ArangoDB 3.10
weight: 11510
description: 
layout: default
---
<small>Introduced in: v3.9.6, v3.10.2</small>

The metrics endpoints include the following new edge cache (re-)filling metrics:

- `rocksdb_cache_auto_refill_loaded_total`
- `rocksdb_cache_auto_refill_dropped_total`
- `rocksdb_cache_full_index_refills_total`

#### Pregel API

When loading the graph data into memory, a `"loading"` state is now returned by
the `GET /_api/control_pregel` and `GET /_api/control_pregel/{id}` endpoints.
The state changes to `"running"` when loading finishes.

In previous versions, the state was `"running"` when loading the data as well as
when running the algorithm.

Both endpoints return a new `detail` attribute with additional Pregel run details:

- `detail` (object)
  - `aggregatedStatus` (object)
    - `timeStamp` (string)
    - `graphStoreStatus` (object)
      - `verticesLoaded` (integer)
      - `edgesLoaded` (integer)
      - `memoryBytesUsed` (integer)
      - `verticesStored` (integer)
    - `allGssStatus` (object)
      - `items` (array of objects)
        - `verticesProcessed` (integer)
        - `messagesSent` (integer)
        - `messagesReceived` (integer)
        - `memoryBytesUsedForMessages` (integer)
    - `workerStatus` (object)
      - `<serverId>` (object)
        - (the same attributes like under `aggregatedStatus`)

For a detailed description of the attributes, see
[Pregel HTTP API](../../http/pregel#get-pregel-job-execution-status).

#### Log level API

<small>Introduced in: v3.10.2</small>

The `GET /_admin/log/level` and `PUT /_admin/log/level` endpoints support a new
query parameter `serverId`, to forward log level get and set requests to a
specific server. This makes it easier to adjust the log levels in clusters
because DB-Servers require JWT authentication whereas Coordinators also support
authentication using usernames and passwords.

## JavaScript API

The Computed Values feature extends the collection properties with a new
`computedValues` attribute. See [Computed Values](../../getting-started/data-model-concepts/documents/data-modeling-documents-computed-values#javascript-api)
for details.
