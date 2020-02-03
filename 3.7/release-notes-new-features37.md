---
layout: default
description: ArangoDB v3.7 Release Notes New Features
---
Features and Improvements in ArangoDB 3.7
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.7. ArangoDB 3.7 also contains several bug fixes that are not listed
here.

Cluster
-------

### Parallel Move Shard

Shards can now move in parallel. The old locking mechanism was replaced by a
read-write lock and thus allows multiple jobs for the same destination server.
The actual transfer rates are still limited on DB-Server side but there is a
huge overall speedup. This also affects `CleanOutServer` and
`ResignLeadership` jobs.

General
-------

### JWT secret rotation (Enterprise Edition)

There are now new APIs and startup options for JWT secrets. The new option
`--server.jwt-secret-folder` can be used to specify a path for more than one
JWT secret file.

Additionally the `/_admin/server/jwt` API can be used to reload the JWT secrets
of a local arangod process without having to restart it (hot-reload). This may
be used to roll out new JWT secrets throughout an ArangoDB cluster.
