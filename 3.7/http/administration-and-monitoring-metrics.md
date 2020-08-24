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

**Metric**
- `arangodb_scheduler_queue_full_failures`:
  Number of times a request/task could not be added to the scheduler queue 
  because the queue was full. If this happens, the corresponding request will
  be responded to with an HTTP 503 ("Service Unavailable") response.

**Exposed by**
Coordinator, DB-Server, Agents

**Threshold**
- For `arangodb_scheduler_queue_full_failures`:
  - This should be 0, as dropping requests is an extremely undesirable event.

**Troubleshoot**

If the number of queue full failures is greater than zero and even growing over
time, it indicates that the server (or one of the server in a cluster) is
overloaded and cannot keep up with the workload. There are many potential
reasons for this, e.g. servers with too little capacity, spiky workloads,
or even network connectivity issues. Whenever this problem happens, it needs
further detailed analysis of what could be the root cause.

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

### List of exposed metrics

| Name | Description |
|:-----|:------------|
| `arangodb_agency_agent_read_no_leader` |  |
| `arangodb_agency_agent_read_ok` |  |
| `arangodb_agency_agent_write_hist` |  |
| `arangodb_agency_agent_write_no_leader` |  |
| `arangodb_agency_agent_write_ok` |  |
| `arangodb_agency_append_hist` | Agency RAFT follower append histogram |
| `arangodb_agency_commit_hist` | Agency RAFT commit histogram |
| `arangodb_agency_compaction_hist` | Agency compaction histogram |
| `arangodb_agency_local_commit_index` | This agent's commit index |
| `arangodb_agency_log_size_bytes` | Agency replicated log size (bytes) |
| `arangodb_agency_supervision_accum_runtime_msec` | Accumulated Supervision Runtime |
| `arangodb_agency_supervision_accum_runtime_wait_for_replication_msec` | Accumulated Supervision  wait for replication time |
| `arangodb_agency_supervision_failed_server_count` | Counter for FailedServer jobs |
| `arangodb_agency_supervision_runtime_msec` | Agency Supervision runtime histogram (ms) |
| `arangodb_agency_supervision_runtime_wait_for_replication_msec` | Agency Supervision wait for replication time (ms) |
| `arangodb_agency_term` | Agency's term |
| `arangodb_agencycomm_request_time_msec` | Request time for Agency requests |
| `arangodb_aql_slow_query` | Number of AQL slow queries |
| `arangodb_aql_total_query_time_msec` | Total execution time of all AQL queries |
| `arangodb_client_connection_statistics_bytes_received_bucket` | Bytes received for a request |
| `arangodb_client_connection_statistics_bytes_sent_bucket` | Bytes sent for a request |
| `arangodb_client_connection_statistics_io_time_bucket` | Request time needed to answer a request |
| `arangodb_client_connection_statistics_queue_time_bucket` | Request time needed to answer a request |
| `arangodb_client_connection_statistics_request_time_bucket` | Request time needed to answer a request |
| `arangodb_client_connection_statistics_total_time_bucket` | Total time needed to answer a request |
| `arangodb_dropped_followers_count` |  Number of drop-follower events |
| `arangodb_heartbeat_failures` | Counting failed heartbeat transmissions |
| `arangodb_heartbeat_send_time_msec` | Time required to send heartbeat |
| `arangodb_http_request_statistics_async_requests` | Number of asynchronously executed HTTP requests |
| `arangodb_http_request_statistics_http_delete_requests` | Number of HTTP DELETE requests |
| `arangodb_http_request_statistics_http_get_requests` | Number of HTTP GET requests |
| `arangodb_http_request_statistics_http_head_requests` | Number of HTTP HEAD requests |
| `arangodb_http_request_statistics_http_options_requests` | Number of HTTP OPTIONS requests |
| `arangodb_http_request_statistics_http_patch_requests` | Number of HTTP PATH requests |
| `arangodb_http_request_statistics_http_post_requests` | Number of HTTP POST requests |
| `arangodb_http_request_statistics_http_put_requests` | Number of HTTP PUT requests |
| `arangodb_http_request_statistics_other_http_requests` | Number of other HTTP requests |
| `arangodb_http_request_statistics_total_requests` | Total number of HTTP requests |
| `arangodb_load_current_accum_runtime_msec` | Accumulated Current loading time |
| `arangodb_load_current_runtime` | Current loading runtimes |
| `arangodb_load_plan_accum_runtime_msec` | Accumulated Plan loading time |
| `arangodb_load_plan_runtime` | Plan loading runtimes |
| `arangodb_maintenance_action_accum_queue_time_msec` | Accumulated action queue time |
| `arangodb_maintenance_action_accum_runtime_msec` | Accumulated action runtime |
| `arangodb_maintenance_action_done_counter` | Counter of action that are done and have been removed from the registry |
| `arangodb_maintenance_action_duplicate_counter` | Counter of action that have been discarded because of a duplicate |
| `arangodb_maintenance_action_failure_counter` | Failure counter for the action |
| `arangodb_maintenance_action_queue_time_msec` | Time spend in the queue before execution |
| `arangodb_maintenance_action_registered_counter` | Counter of action that have been registered in the action registry |
| `arangodb_maintenance_action_runtime_msec` | Time spend execution the action |
| `arangodb_maintenance_agency_sync_accum_runtime_msec` | Accumulated runtime of agency sync phase |
| `arangodb_maintenance_agency_sync_runtime_msec` | Total time spend on agency sync |
| `arangodb_maintenance_phase1_accum_runtime_msec` | Accumulated runtime of phase one |
| `arangodb_maintenance_phase1_runtime_msec` |  Maintenance Phase 1 runtime histogram |
| `arangodb_maintenance_phase2_accum_runtime_msec` | Accumulated runtime of phase two |
| `arangodb_maintenance_phase2_runtime_msec` | Maintenance Phase 2 runtime histogram  |
| `arangodb_scheduler_awake_threads` | Number of awake worker threads |
| `arangodb_scheduler_num_worker_threads` | Number of worker threads |
| `arangodb_scheduler_queue_full_failures` | Number of times the scheduler queue was full and a task/request was rejected |
| `arangodb_scheduler_queue_length` | Server's internal queue length |
| `arangodb_server_statistics_physical_memory` | Physical memory in bytes |
| `arangodb_server_statistics_server_uptime` | Number of seconds elapsed since server start |
| `arangodb_shards_leader_count gauge` | Number of leader shards on this machine |
| `arangodb_shards_not_replicated` | Number of shards not replicated at all |
| `arangodb_shards_out_of_sync` | Number of leader shards not fully replicated |
| `arangodb_shards_total_count` | Number of shards on this machine |
| `arangodb_v8_context_created` | Number of V8 contexts created |
| `arangodb_v8_context_destroyed` | Number of V8 contexts destroyed |
| `arangodb_v8_context_enter_failures` | Number of times a V8 context could not be entered/acquired |
| `arangodb_v8_context_entered` | Number of times a V8 context was successfully entered |
| `arangodb_v8_context_exited` | Number of times a V8 context was successfully exited |
