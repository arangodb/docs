---
fileID: deployment-dc2dc
title: Datacenter-to-Datacenter Replication deployment
weight: 900
description: 
layout: default
---
{{< tag "ArangoDB Enterprise" >}}

This chapter describes how to deploy all the components needed for
_Datacenter-to-Datacenter Replication_.

## Deployment steps

## 1. Cluster

Datacenter-to-Datacenter Replication requires an ArangoDB cluster in both data centers,
configured with the `rocksdb` storage engine.

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

Please refer to the [Cluster](deployment-dc2dc-cluster) section for
more information.

## 2. ArangoSync Master

The Sync Master is responsible for managing all synchronization, creating tasks and assigning
those to workers.
<br/> At least 2 instances must be deployed in each datacenter.
One instance will be the leader cluster, the other will be an inactive follower cluster.
When the leader is gone for a short while, one of the other instances will take over.

With clusters of a significant size, the sync master will require a significant set of resources.
Therefore it is recommended to deploy sync masters on their own servers, equipped with sufficient
CPU power and memory capacity.

The sync master must be reachable on a TCP port 8629 (default).
This port must be reachable from inside the datacenter (by sync workers and operations)
and from inside of the other datacenter (by sync masters in the other datacenter).

Since the sync masters can be CPU intensive when running lots of databases & collections,
it is recommended to run them on dedicated machines with a lot of CPU power.

Consider these machines to be crucial for your DC2DC setup.

Please refer to the [ArangoSync Master](deployment-dc2dc-arango-sync-master)
section for more information.

## 3. ArangoSync Workers

The Sync Worker is responsible for executing synchronization tasks.
<br/> For optimal performance at least 1 worker instance must be placed on
every machine that has an ArangoDB DB-Server running. This ensures that tasks
can be executed with minimal network traffic outside of the machine.

Since sync workers will automatically stop once their TLS server certificate expires
(which is set to 2 years by default),
it is recommended to run at least 2 instances of a worker on every machine in the datacenter.
That way, tasks can still be assigned in the most optimal way, even when a worker in temporarily
down for a restart.

The sync worker must be reachable on a TCP port 8729 (default).
This port must be reachable from inside the datacenter (by sync masters).

The sync workers should be run on all machines that also contain an ArangoDB DB-Server.
The sync worker can be memory intensive when running lots of databases & collections.

Please refer to the [ArangoSync Workers](deployment-dc2dc-arango-sync-workers)
for more information.

## 4. Prometheus & Grafana (optional)

ArangoSync provides metrics in a format supported by [Prometheus](https://prometheus.io).
We also provide a standard set of dashboards for viewing those metrics in [Grafana](https://grafana.org).

If you want to use these tools, go to their websites for instructions on how to deploy them.

After deployment, you must configure prometheus using a configuration file that instructs
it about which targets to scrape. For ArangoSync you should configure scrape targets for
all sync masters and all sync workers.

Prometheus can be a memory & CPU intensive process. It is recommended to keep them
on other machines than used to run the ArangoDB cluster or ArangoSync components.

Consider these machines to be easily replaceable, unless you configure
alerting on _prometheus_, in which case it is recommended to keep a
close eye on them, such that you do not lose any alerts due to failures
of Prometheus.

Please refer to the [Prometheus & Grafana](deployment-dc2dc-prometheus-grafana)
section for more informnation.
