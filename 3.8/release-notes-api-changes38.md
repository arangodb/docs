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

- The endpoint `/_api/replication/clusterInventory` returns, among other things,
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

- The endpoint `/_api/transaction` previously would allow users to list, query,
  commit, and abort transactions operating in any database as long as the user had
  sufficient permissions. Now the endpoint will restrict operations to
  transactions within the current database.

- The HTTP API for starting a Pregel run `/_api/control-pregel` now returns the
  Pregel execution number as a stringified execution number, e.g. "12345" instead
  of 12345.
  This is not downwards-compatible, so all client applications that depend
  on the return value being a numeric value need to be adjusted to handle
  a string return value and convert that string into a number.

### Endpoints added

The following REST endpoints for retrieving cluster shard statistics have been added 
in ArangoDB 3.8:

- Added endpoint for retrieving cluster shard statistics for the current database.

  `GET /_api/database/shardDistribution` will return the number of collections,
  shards, leaders and followers for the database it is run inside. The request
  can optionally be restricted to include data from only a single DB-Server, by
  passing the `DBserver` URL parameter and setting it to the name of a DB-Server.

  This API can only be used on Coordinators, and requires read access to the
  database it is run inside.

- Added endpoint for retrieving cluster-wide shard statistics.

  `GET /_admin/cluster/shardDistribution` will return global statistics on the
  current shard distribution, providing the total number of databases,
  collections, shards, leader and follower shards for the entire cluster.
  The results can optionally be restricted to include data from only a single
  DB-Server, by passing the `DBserver` URL parameter and setting it to the name
  of a DB-Server. By setting the `details` URL parameter, the response will not
  contain aggregates, but instead one entry per available database will be
  returned, so that the statistics are split across all available databases.

  This API can only be used in the `_system` database on Coordinators and
  requires admin user privileges.

- The new REST endpoint at GET `/_admin/log/entries` can be used to retrieve
  server log messages in a more intuitive format than the already existing API
  at GET `/_admin/log`.

  The new API returns all matching log messages in an array, with one array
  entry per log message. Each log message is returned as an object containing
  the properties of the log message:

  ```json
  { 
    "total" : 13,
    "messages": [
      {
        "id" : 12,
        "topic" : "general",
        "level" : "INFO",
        "date" : "2021-02-07T01:00:21Z",
        "message" : "[cf3f4] {general} ArangoDB (version 3.8.0-devel enterprise [linux]) is ready for business. Have fun!"
      },
      {
        "id" : 11,
        "topic" : "general",
        "level" : "INFO",
        "date" : "2021-02-07T01:00:21Z",
        "message" : "[99d80] {general} You are using a milestone/alpha/beta/preview version ('3.8.0-devel') of ArangoDB"
      }
    ]
  }
  ```

  The previous API returned an object with 5 attributes at the top-level
  instead, which contained arrays with the attribute values of all log
  messages:

  ```json
  {
    "totalAmount" : 13,
    "lid" : [
      12, 
      11
    ],
    "topic" : [
      "general", 
      "general"
    ],
    "level" : [
      3, 
      3
    ],
    "timestamp" : [
      1612659621, 
      1612659621
    ],
    "text" : [
      "[cf3f4] {general} ArangoDB (version 3.8.0-devel enterprise [linux]) is ready for business. Have fun!", 
      "[99d80] {general} You are using a milestone/alpha/beta/preview version ('3.8.0-devel') of ArangoDB"
    ]
  }
  ```

  The old API endpoint GET `/_admin/log` for retrieving log messages is now
  deprecated, although it will stay available for some time.

### Endpoints augmented

- The REST endpoint at GET `/_api/engine/stats` now returns useful information in cluster
  setups too. Previously calling this API on a Coordinator always produced an empty JSON
  object result, whereas now it will produce a JSON object with one key per DB-Server.
  The mapped value per DB-Server are the engine statistics for this particular server.

  The return value structure is different to the return value structure in single server,
  where the return value is a simple JSON object with the statistics at the top level.

- The REST endpoint for creating indexes, POST `/_api/index`, can now handle the attribute
  `estimates`, which determines if the to-be-created index should maintain selectivity
  estimates or not. If not specified, the default value for this attribute is `true` for
  indexes of type "persistent", so that selectivity estimates are maintained. They can be
  optionally turned off by setting the attribute to `false`. Turning off selectivity 
  estimates can have a slightly positive effect on write performance. The attribute will
  only be picked up for indexes of type "persistent", "hash" and "skiplist" (where the
  latter two are aliases for "persistent" nowadays).

### Endpoints moved

### Endpoints removed

## JavaScript API

- The JavaScript API for starting a Pregel run `/_api/control-pregel` now returns the
  Pregel execution number as a stringified execution number, e.g. "12345" instead
  of 12345.
  This is not downwards-compatible. Foxx services, arangosh scripts etc. that depend
  on the return value being a numeric value may need to be adjusted to handle
  a string return value and convert that string into a number.

## ArangoDB Server Environment Variables

The new environment variable `TZ_DATA` can be used to specify the path to the 
directory containing the timezone information database for ArangoDB. That directory 
is normally named `tzdata` and is shipped with ArangoDB releases. It is normally not
required to set this environment variable, but it may be necessary in unusual setups 
with non-conventional directory layouts and paths.
