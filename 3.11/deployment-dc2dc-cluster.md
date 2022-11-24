---
layout: default
description: There are several ways to start an ArangoDB cluster
---
# ArangoDB cluster

There are several ways to start an ArangoDB cluster. This section focuses
on the recommended way to start ArangoDB: the ArangoDB _Starter_.

For other possibilities to deploy an ArangoDB cluster see
[Cluster Deployment](deployment-cluster.html).

The _Starter_ simplifies things for the operator and coordinates a distributed
cluster startup across several machines and assign cluster roles automatically.

When started on several machines and enough machines have joined, the _Starters_
start _Agents_, _Coordinators_ and _DB-Servers_ on these machines.

The _Starter_ supervises its child tasks (namely _Coordinators_,
_DB-Servers_ and _Agents_) and restarts them in case of failures.

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
    --auth.jwt-secret=${CLUSTERSECRETPATH}
TimeoutStopSec=60
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```

## Cluster authentication

The communication between the cluster nodes use a token (JWT) to authenticate.
This must be shared between cluster nodes.

Sharing secrets is obviously a very delicate topic. The above workflow assumes
that the operator puts a secret in a file named `${CLUSTERSECRETPATH}`.

We recommend to use a dedicated system for managing secrets like HashiCorp's `Vault`.

## Required ports

As soon as enough machines have joined, the _Starter_ begins starting _Agents_,
_Coordinators_ and _DB-Servers_.

Each of these tasks needs a port to communicate. Please make sure that the following
ports are available on all machines:

- `8529` for Coordinators
- `8530` for DB-Servers
- `8531` for Agents

The _Starter_ itself uses port `8528`.

## Recommended deployment environment

Since the _Agents_ are so critical to the availability of both the ArangoDB and
the ArangoSync cluster, it is recommended to run _Agents_ on dedicated machines.
They run a real-time system for the elections and bad performance can negatively
affect the availability of the whole cluster.

_DB-Servers_ are also important and you do not want to lose them, but
depending on your replication factor, the system can tolerate some
loss and bad performance slows things down but not stop things from
working.

_Coordinators_ can be deployed on other machines, since they do not hold
persistent state. They might have some in-memory state about running
transactions or queries, but losing a Coordinator does not lose any
persisted data. Furthermore, new Coordinators can be added to a cluster
without much effort.
