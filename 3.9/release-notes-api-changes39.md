---
layout: default
description: ArangoDB v3.9 Release Notes API Changes
---
API Changes in ArangoDB 3.9
===========================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.9.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.9.

## HTTP RESTful API

### GRAPH API (Gharial)

The following changes affect the behavior of the RESTful graph APIs at
endpoints starting with path `/_api/gharial/`:

The options object now supports a new field: `satellites`, when creating a graph (POST).
The value of satellites is optional. In case it is defined, it needs to be an array
of collection names. Each defined collection name must be a string. This value is
only valid in case of SmartGraphs (Enterprise-Only). In a community based graph it
will be ignored.

Using `satellites` during SmartGraph creation will result in a Hybrid Smart Graph.
Using `satellites` during Disjoint SmartGraph creation will result in a Hybrid
Disjoint SmartGraph.

Hybrid (Disjoint) SmartGraphs are capable of having Satellite collections in their
graph definitions. If a collection is found in `satellites` and they are also being
used in the graph definition itself (e.g. EdgeDefinition), this collection will be
created as a satellite collection. Hybrid (Disjoint) Smart Graphs are then capable
of executing all type of graph queries between the regular SmartCollections and
Satellite collections.

The following changes affect the behavior of the RESTful graph APIs at
endpoints starting with path `/_api/gharial/{graph}/edge`:

Creating and modifying a new edge definition (POST / PUT):
Added new optional options object. This was not available in previous ArangoDB
versions. The options object currently can contain a field called `satellites`.
The field must be an array and contain collection name(s) written down as strings.
If an EdgeDefinition does contain a collection name, which is also defined in
the satellites option entry, it will be created as a Satellite collection.
Otherwise, it will be ignored. This option only takes effect using SmartGraphs.

The following changes affect the behavior of the RESTful graph APIs at
endpoints starting with path `/_api/gharial/{graph}/vertex`:

Creating a new vertex collection (POST):
Added new optional options object. This was not available in previous ArangoDB
versions. The options object currently can contain a field called `satellites`.
The field must be an array and contain collection name(s) written down as strings.
If the vertex to add is also defined in the satellites option entry, it will be
created as a Satellite collection. Otherwise, it will be ignored. This option
only takes effect using SmartGraphs.


### Privilege changes

### Endpoint return value changes

### Endpoints added

### Endpoints augmented

### Endpoints moved

### Endpoints removed

#### Export API

The REST API endpoint `/_api/export` has been removed in ArangoDB 3.9.
This endpoint was previously only present in single server, but never
supported in cluster deployments.

The purpose of the endpoint was to provide the full data of a collection
without holding collection locks for a long time, which was useful for
the MMFile storage engine with its collection-level locks.

The MMFiles engine is gone since ArangoDB 3.7, and the only remaining
storage engine since then is RocksDB. For the RocksDB engine, the
`/_api/export` endpoint internally used a streaming AQL query such as

```js
FOR doc IN @@collection RETURN doc
```

anyway. To remove API redundancy, the API endpoint has been deprecated
in ArangoDB 3.8 and is now removed. If the functionality is still required
by client applications, running a streaming AQL query can be used as a
substitution.

#### Redirects

Since ArangoDB 3.7, some cluster APIs were made available under different
paths. The old paths were left in place and simply redirected to the new
address. These redirects have now been removed in ArangoDB 3.9.

The following list shows the old, now dysfunctional paths and their
replacements:

- `/_admin/clusterNodeVersion`: replaced by `/_admin/cluster/nodeVersion`
- `/_admin/clusterNodeEngine`: replaced by `/_admin/cluster/nodeEngine`
- `/_admin/clusterNodeStats`: replaced by `/_admin/cluster/nodeStatistics`
- `/_admin/clusterStatistics`: replaced by `/_admin/cluster/statistics`

Using the replacements will work from ArangoDB 3.7 onwards already, so
any client applications that still call the old addresses can be adjusted
to call the new addresses from 3.7 onwards.
