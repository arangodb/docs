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

### Www-Authenticate response header

ArangoDB 3.8 adds back the `Www-Authenticate` response header for HTTP server
responses with a status code of 401. Returning the `Www-Authenticate` header for
401 responses is required by the HTTP/1.1 specification and was also advertised
functionality in the ArangoDB documentation, but wasn't happening in practice.

Now the functionality of returning `Www-Authenticate` response headers for HTTP
401 responses is restored, along with the already advertised functionality of
suppressing this header in case the client sends an `X-Omit-Www-Authenticate`
header with the request.

This change should not have any impact for client applications that use ArangoDB
as a database only. It may have an effect for Foxx applications that use HTTP
401 status code responses and that will now see this extra header getting returned.

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

The endpoint `/_api/transaction` previously would allow users to list, query,
commit, and abort transactions operating in any database as long as the user had
sufficient permissions. Now the endpoint will restrict operations to
transactions within the current database.

The HTTP API for starting a Pregel run `/_api/control-pregel` now returns the
Pregel execution number as a stringified execution number, e.g. "12345" instead 
of 12345. 
This is not downwards-compatible, so all client applications that depend
on the return value being a numeric value need to be adjusted to handle
a string return value and convert that string into a number.

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
