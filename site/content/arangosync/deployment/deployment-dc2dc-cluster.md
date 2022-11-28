---
fileID: deployment-dc2dc-cluster
title: ArangoDB cluster
weight: 905
description: 
layout: default
---
There are several ways to start an ArangoDB cluster. In this section we will focus
on our recommended way to start ArangoDB: the ArangoDB _Starter_.

_Datacenter-to-Datacenter Replication_ requires the `rocksdb` storage engine. The
example setup described in this section will have `rocksdb` enabled. If you choose
to deploy with a different strategy keep in mind to set the storage engine.

For other possibilities to deploy an ArangoDB cluster see
[Cluster Deployment](../../architecture/deployment-modes/cluster/deployment/).

The _Starter_ simplifies things for the operator and will coordinate a distributed
cluster startup across several machines and assign cluster roles automatically.

When started on several machines and enough machines have joined, the _Starters_
will start _Agents_, _Coordinators_ and _DB-Servers_ on these machines.

When running the _Starter_ will supervise its child tasks (namely _Coordinators_,
_DB-Servers_ and _Agents_) and restart them in case of failure.

To start the cluster using a `systemd` unit file use the following:

```text
[Unit]
Description=Run the ArangoDB Starter
After=network.target

[Service]
Restart=on-failure
EnvironmentFile=/etc/arangodb.env
EnvironmentFile=/etc/arangodb.env.local
Environment=DATADIR=/var/lib/arangodb/cluster
ExecStartPre=/usr/bin/sh -c "mkdir -p ${DATADIR}"
ExecStart=/usr/bin/arangodb \
    --starter.address=${PRIVATEIP} \
    --starter.data-dir=${DATADIR} \
    --starter.join=${STARTERENDPOINTS} \
    --server.storage-engine=rocksdb \
    --auth.jwt-secret=${CLUSTERSECRETPATH}
TimeoutStopSec=60
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```

Note that we set `rocksdb` in the unit service file.

## Cluster authentication

The communication between the cluster nodes use a token (JWT) to authenticate.
This must be shared between cluster nodes.

Sharing secrets is obviously a very delicate topic. The above workflow assumes
that the operator will put a secret in a file named `${CLUSTERSECRETPATH}`.

We recommend to use a dedicated system for managing secrets like HashiCorp's `Vault`.

## Required ports

As soon as enough machines have joined, the _Starter_ will begin starting _Agents_,
_Coordinators_ and _DB-Servers_.

Each of these tasks needs a port to communicate. Please make sure that the following
ports are available on all machines:

- `8529` for Coordinators
- `8530` for DB-Servers
- `8531` for Agents

The _Starter_ itself will use port `8528`.

## Recommended deployment environment

Since the _Agents_ are so critical to the availability of both the ArangoDB and
the ArangoSync cluster, it is recommended to run _Agents_ on dedicated machines.
They run a real-time system for the elections and bad performance can negatively
affect the availability of the whole cluster.

_DB-Servers_ are also important and you do not want to lose them, but
depending on your replication factor, the system can tolerate some
loss and bad performance will slow things down but not stop things from
working.

_Coordinators_ can be deployed on other machines, since they do not hold
persistent state. They might have some in-memory state about running
transactions or queries, but losing a Coordinator will not lose any
persisted data. Furthermore, new Coordinators can be added to a cluster
without much effort.