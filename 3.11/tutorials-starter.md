---
layout: default
description: Starting an ArangoDB cluster involves starting various servers with different roles (Agents, DB-Servers & Coordinators)
title: temp, page to be removed
---
# Starting an ArangoDB cluster or database the easy way


## Starting a cluster with Datacenter-to-Datacenter Replication

{% include hint-ee.md feature="Datacenter-to-Datacenter Replication" %}

Datacenter-to-Datacenter Replication (DC2DC) requires a normal ArangoDB cluster in both data centers
and one or more (`arangosync`) syncmasters & syncworkers in both data centers.
The starter enables you to run these syncmasters & syncworkers in combination with your normal
cluster.

To run a starter with DC2DC support you add the following arguments to the starters command line:

```bash
--auth.jwt-secret=<path of file containing JWT secret for communication in local cluster>
--starter.address=<publicly visible address of this machine>
--starter.sync
--server.storage-engine=rocksdb
--sync.master.jwt-secret=<path of file containing JWT secret used for communication between local syncmaster & workers>
--sync.server.keyfile=<path of keyfile containing TLS certificate & key for local syncmaster>
--sync.server.client-cafile=<path of file containing CA certificate for syncmaster client authentication>
```

Consult `arangosync` documentation for instructions how to create all certificates & keyfiles.
