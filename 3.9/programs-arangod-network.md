---
layout: default
description: ArangoDB Server Network Options
---
# ArangoDB Server Network Options

## Idle Connection TTL

`--network.idle-connection-ttl`

Default time-to-live of idle cluster-internal connections (in milliseconds).

## I/O Threads

`--network.io-threads`

Number of network I/O threads for cluster-internal network requests.

## Max Open Connections

`--network.max-open-connections`

Maximum number of open network connections for cluster-internal requests.

## Verify Hosts

`network.verify-hosts`

If set to true, this will verify peer certificates for cluster-internal
requests when TLS is used.
