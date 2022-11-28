---
fileID: architecture-deployment-modes-cluster-limitations
title: Cluster Limitations
weight: 855
description: 
layout: default
---
ArangoDB has no built-in limitations to horizontal scalability. The
central resilient _Agency_ will easily sustain hundreds of _DB-Servers_
and _Coordinators_, and the usual database operations work completely
decentrally and do not require assistance of the _Agency_.

Likewise, the supervision process in the _Agency_ can easily deal
with lots of servers, since all its activities are not performance
critical.

Obviously, an ArangoDB Cluster is limited by the available resources
of CPU, memory, disk and network bandwidth and latency.

Moreover, high numbers of databases, collections, and shards come at a cost.
An ArangoDB Enterprise Edition cluster can sustain up to a few thousand
databases, and a database can sustain up to a thousand collections, but the
total number of shards in the cluster should not go beyond 50,000 or so.
Beyond these limits, certain regular cleanup and maintenance operations can take
too long for a smooth operational experience. The Community Edition comes
without guarantees regarding the database, collection, and shard count.
