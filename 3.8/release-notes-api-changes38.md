---
layout: default
description: ArangoDB v3.8 Release Notes API Changes
---
API Changes in ArangoDB 3.8
===========================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.8.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.8.

## HTTP RESTful API

### Endpoint return value changes

The endpoint `/_api/replication/clusterInventory` returns, among other things,
an array of the existing collections. Each collection has a `planVersion`
attribute, which in ArangoDB 3.8 is now hard-coded to the value of 1.

Before 3.7, the most recent Plan version from the agency was returned inside
`planVersion` for each collection. In 3.7, the attribute contained the Plan
version that was in use when the in-memory LogicalCollection object was last
constructed. The object was always reconstructed in case the underlying Plan
data for the collection changed, or when a collection contained links to
ArangoSearch Views. This made the attribute relatively useless for any
real-world use cases, and so we are now hard-coding it to simplify the internal
code. Using the attribute in client applications is also deprecated.

### Endpoints added

### Endpoints augmented

The REST endpoint at GET `/_api/engine/stats` now returns useful information in cluster
setups too. Previously calling this API on a Coordinator always produced an empty JSON
object result, whereas now it will produce a JSON object with one key per DB-Server.
The mapped value per DB-Server are the engine statistics for this particular server.

The return value structure is different to the return value structure in single server,
where the return value is a simple JSON object with the statistics at the top level.

### Endpoints moved

### Endpoints removed

## JavaScript API

## ArangoDB Server Environment Variables
