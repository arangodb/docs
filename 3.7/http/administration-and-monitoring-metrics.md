---
layout: default
description: Metrics exposed by ArangoDB and how to export them to Prometheus and visualize with Grafana.
title: arangod Server Metrics
---
# ArangoDB Server Metrics

_arangod_ exports metrics which can be used to monitor the healthiness and
performance of the system. Out of all exposed metrics the most relevant ones
are highlighted below. In addition, the thresholds for alerts are described.

{% hint 'warning' %}
The list of exposed metrics is subject to change in every minor version.
While they should stay backwards compatible for the most part, some metrics are
coupled to specific internals that may be replaced by other mechanisms in the
future.

Below monitoring recommendations are limited to those metrics that are
considered future-proof. If you setup your monitoring to use the
recommendations described here, you can safely upgrade to new versions.
{% endhint %}

## Cluster Health

This group of metrics are used to measure how healthy the cluster processes
are and if they can communicate properly to one another.

### Heartbeats

Heartbeats are a core mechanism in ArangoDB Clusters to define the liveliness
of Servers. Every server will send heartbeats to the agency, if too many heartbeats
are skipped or cannot be delivered in time, the server is declared dead and a
failover of the data will be triggered.
By default we expect at least 1 heartbeat per second.
If a server does not deliver 5 heartbeats in a row (5 seconds without a single
heartbeat) it is considered dead.

**Metric**
- `arangodb_heartbeat_send_time_msec`:
  The time a single heartbeat took to be delivered.
- `arangodb_heartbeat_failures`:
  Amount of heartbeats which this server failed to deliver.

**Exposed by**
Coordinator, DB-Server

**Threshold**
- For `arangodb_heartbeat_send_time_msec`:
  - Depending on your network latency, we typically expect this to be somewhere
    below 100ms.
  - below 1000ms is still acceptable but not great.
  - 1000ms - 3000ms is considered critical, but cluster should still operate,
    consider contacting our support.
  - above 3000ms expect outages! If any of these fails to deliver, the server
    will be flagged as dead and we will trigger failover. With this timing the
    failovers will most likely stack up and cause more trouble.

- For `arangodb_heartbeat_failures`:
  - Typically this should be 0.
  - If you see any other value here this is typically a network hiccup.
  - If this is constantly growing this means the server is somehow undergoing a
    network split.

**Troubleshoot**

Heartbeats are precious and on the fastest possible path internally. If they
slow down or cannot be delivered this in almost all cases can be appointed to
network issues. If you constantly have this on a high value please make sure
the latency between your cluster machines and all agents is low, this will be
a lower bound for the value we achieve here. If this is not the case, the
network might be overloaded.

## Agency Plan Sync on DB-Servers

In order to update the data definition on databases servers from the definition stored in the agency, DB-Servers have a repeated
job called Agency Plan Sync. Timings for collection and database creations are strongly correlated to the overall runtime
of this job.

**Metric**
- `arangodb_maintenance_agency_sync_runtime_msec`:
  Histogram containing the runtimes of individual runs.
- `arangodb_maintenance_agency_sync_accum_runtime_msec`:
   The accumulated runtime of all runs.

**Exposed by**
DB-Server

**Threshold**
- For `arangodb_maintenance_agency_sync_runtime_msec`:
  - This should not exceed 1000ms.

**Troubleshoot**

If the Agency Plan Sync becomes the bottleneck of database and collection
distribution you should consider reducing the amount of those.

### Shard Distribution

Allows insight in the shard distribution in the cluster and the state of
replication of the data.

**Metric**
- `arangodb_shards_out_of_sync`:
  Number of shards not replicated with their required replication factor
  (for which this server is the leader)
- `arangodb_shards_total_count`:
  Number of shards located on this server (leader _and_ follower shards)
- `arangodb_shards_leader_count`:
  Number of shards for which this server is the leader.
- `arangodb_shards_not_replicated`:
  Number of shards that are not replicated, i.e. this data is at risk as there
  is no other copy available.

**Exposed by**
DB-Server

**Threshold**
- For `arangodb_shards_out_of_sync`:
  - Eventually all shards should be in sync and this value equal to zero.
  - It can increase when new collections are created or servers are rotated.
- For `arangodb_shards_total_count` and `arangodb_shards_leader_count`:
  - This value should be roughly equal for all servers.
- For `arangodb_shards_not_replicated`:
  - This value _should_ be zero at all times. If not, you currently have a
    single point of failure and data is at risk. Please contact our support team.
  - This can happen if you lose 1 DB-Server and have `replicationFactor` 2, if
    you lose 2 DB-Servers on `replicationFactor` 3 and so on. In this cases the
    system will try to heal itself, if enough healthy servers remain.

**Troubleshoot**

The distribution of shards should be roughly equal. If not please consider
rebalancing shards.

### Scheduler

The Scheduler is responsible for managing growing workloads and distributing
tasks across the available threads. Whenever more work is available than the
system can handle, it adjusts the number of threads. The scheduler maintains an
internal queue for tasks ready for execution. A constantly growing queue is a
clear sign for the system reaching its limits.

**Metric**
- `arangodb_scheduler_queue_length`:
  Length of the internal task queue.
- `arangodb_scheduler_awake_threads`:
  Number of actively working threads.
- `arangodb_scheduler_num_worker_threads`:
  Total number of currently available threads.

**Exposed by**
Coordinator, DB-Server, Agents

**Threshold**
- For `arangodb_scheduler_queue_length`:
  - Typically this should be 0.
  - Having an non-zero queue length is not a problem as long as it eventually
    becomes smaller again. This can happen for example during load spikes.
  - Having a longer queue results in bigger latencies as the requests need to
    wait longer before they are executed.
  - If the queue runs full you will eventually get a `queue full` error.
- For `arangodb_scheduler_num_worker_threads` and
  `arangodb_scheduler_awake_threads`:
  - They should increase as load increases.
  - If the queue length is non-zero for more than a minute you _should_ see
    `arangodb_scheduler_awake_threads == arangodb_scheduler_num_worker_threads`.
    If not, consider contacting our support.

**Troubleshoot**

Queuing requests will result in bigger latency. If your queue is constantly
growing, you should consider scaling your system according to your needs.
Remember to rebalance shards if you scale up DB-Servers.

### Supervision

The supervision is an integral part of the cluster and runs on the leading
agent. It is responsible for handling MoveShard jobs and server failures.
It is intended to run every second, thus its runime _should_ be below one second.

**Metric**
- `arangodb_agency_supervision_runtime_msec`:
  Time in ms of a single supervision run.
- `arangodb_agency_supervision_runtime_wait_for_replication_msec`:
  Time the supervision has to wait for its decisions to be committed.

**Exposed by**
Agents

**Threshold**
- For `agency_supervision_runtime_msec`:
  - This value should stay below 1000ms. However, when a DB-Server is rotated
    there can be single runs that have much higher runtime. However, this
    should not be true in general.

    This value will only increase for the leading agent.

**Troubleshoot**

If the supervision is not able to run approximately once per second, cluster
resilience is affected. Please consider contacting our support.

## Metrics API

<!-- js/actions/api-system.js -->
{% docublock get_admin_metrics %}
