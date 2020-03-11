---
layout: default
description: Metrics exposed by ArangoDB and how to export them to Prometheus and visualize with Grafana.
---
# ArangoDB Metrics

This chapter focusses on the Metrics that ArangoDB exports to monitor
the healthyness and performance of the system.
Out of all metrics we expose we are going to highlight the most
relevant ones in this chapter. In addition we will describe thresholds
for alerts on the metrics.

_Disclaimer:_
The list of exposed metrics is subject to change in every minor version.
We try to be as backwards compatible as possible, but some Metrics are
coupled to specific internals that may be replaced by other mechanisms
in the future.
We will limit our monitoring recommendations to those metrics that we
see future proof so if you setup the monitoring to the recommendations
described here you will be save with version upgrades.


## Cluster Health

This group of metrics are used to measure how healthy the cluster processes
are and if they can communicate properly to one another

### Heartbeats

_Description:_
Heartbeats are a core mechanism in ArangoDB Clusters to define the lifelyness
of Servers. Every server will send heartbeats to the agency, if too many heartbeats
are skipped, or cannot be delivered in-time the server is declared as dead and
failover of data will be triggered.
By default we expect at least 1 heartbeat per second.
If a server does not deliver 5 heartbeats in a row (5 seconds without a single heartbeat)
it is considered dead.

_Metric:_
* `arangodb_heartbeat_send_time_msec` The time a single heartbeat took to be delivered.
* `arangodb_heartbeat_failures` Amount of heartbeats which this server failed to deliver.

_Exposed by:_
Coordinator, DBServer

_Threshold:_
  * For `arangodb_heartbeat_send_time_msec`:
    * Depending on your network latency, we typically expect this to be somewhere below 100ms.
    * below 1000ms is okayish.
    * 1000ms - 3000ms is considered critical, but cluster should still operate, consider contacting our support.
    * above 3000ms expect outages! If any of these fails to deliver, the server will be flagged as dead and we will trigger failover. With this timing the failovers will most likely stack up and cause more trouble.
  * For `arangodb_heartbeat_failures`
    * Typically this should be 0.
    * If you see any other value here this is typically a network hiccup.
    * If this is constantly growing this means the server is somehow undergoing a network split.

_Troubleshoot:_
Heartbeats are precious and on the fastest possible path internally. If they slow down or cannot be delivered this in almost all
cases can be appointed to network issues.
If you constantly have this on a high value please make sure the latency between your cluster machines and all agents is low, this will be a lower bound for the value we achieve here.
If this is not the case, the network might be overloaded.




## Agency Plan Sync on DBServers

_Description:_
In order to update the data definition on databases servers from the definition stored in the agency dbservers have a repeated
job called Agency Plan Sync. Timings for collection and database creations are strongly correlated to the overall runtime
of this job.

_Metric:_
* `arangodb_maintenance_agency_sync_runtime_msec` Histogram containing the runtimes of individual runs.
* `arangodb_maintenance_agency_sync_accum_runtime_msec` The accumulated runtime of all runs.

_Exposed by:_
DBServer

_Threshold:_
  * For `arangodb_maintenance_agency_sync_runtime_msec`
    * This should not exceed 1s.

_Troubleshoot:_
If the Agency Plan Sync becomes the bottleneck of database and collection distribution you should consider reducing the amount of those.

### Shard Distribution

_Description:_
Allows insight in the shard distribution in the cluster and the state of replication of the data.

_Metric:_
* `arangodb_shards_out_of_sync` Number of shards not replicated with their required replication factor. (for which this server is the leader)
* `arangodb_shards_total_count` Number of shards located on this server. (Leader _and_ follower shards)
* `arangodb_shards_leader_count` Number of shards for which this server is the leader.
* `arangodb_shards_not_replicated` Number of shards that are not replicated, i.e. this data is at risk as there is no other copy available.

_Exposed by:_
DBServer

_Threshold:_
  * For `arangodb_shards_out_of_sync`
    * Eventually all shards should be in sync and this value equal to zero.
    * It can increase when new collections are created or servers are rotated.
  * For `arangodb_shards_total_count` and `arangodb_shards_leader_count`
    * This value should be roughly equal for all servers.
  * For `arangodb_shards_not_replicated`
    * This value _should_ be zero at all times. If not, you currently have a single point of failure and data is at risk. Please contact our support team.
    * This can happen if you loose 1 DBServer and have replicationFactor 2, if you loose 2 DBServers on replicationFactor 3 and so on. In this cases the system will try to heal itself, if enough healthy servers remain.

_Troubleshoot:_
The distribution of shards should be roughly equal. If not please consider rebalancing shards.


### Scheduler

_Description:_
The Scheduler is responsible for managing growing workloads and distributing tasks across the available threads.
Whenever there is more work available than the system can handle it adapts the number of threads. The scheduler
maintains an internal queue for tasks ready for execution. A constantly growing queue is a clear sign for the
system reaching its limits.

_Metric:_
* `arangodb_scheduler_queue_length` Length of the internal task queue.
* `arangodb_scheduler_awake_threads` Number of activly working threads.
* `arangodb_scheduler_num_worker_threads` Total number of currently available threads.

_Exposed by:_
Coordinator, DBServer, Agents

_Threshold:_
  * For `arangodb_scheduler_queue_length`:
    * Typically this should be 0.
    * Having an non-zero queue length is not a problem as long as it eventually becomes smaller again. This can happen for example during load spikes.
    * Having a longer queue results in bigger latencies as the requests need to wait longer before they are executed.
    * If the queue runs full you will eventually get a `queue full` error.
  * For `arangodb_scheduler_num_worker_threads` and `arangodb_scheduler_awake_threads`
    * They should increase as load increases.
    * If the queue length is non-zero for more than a minute you _should_ see `arangodb_scheduler_awake_threads == arangodb_scheduler_num_worker_threads`. If not, consider contacting our support.

_Troubleshoot:_
Queuing requests will result in bigger latency. If your queue is growing constantly consider scaling up your system to fit your needs. Remember to rebalance shards if you scale up database servers.


### Supervision

_Description:_ The supervision is an intregal part of the cluster and runs on the leading agent. It is responsible for
handling MoveShard jobs and server failures. It is intended to run every second thus its runime _should_ be below
one second.


_Metric:_
* `arangodb_agency_supervision_runtime_msec` Time in ms of a single supervision run.
* `arangodb_agency_supervision_runtime_wait_for_replication_msec` Time the supervision has to wait for its decisions to be committed.

_Exposed by:_
Agents

_Threshold:_
  * For `agency_supervision_runtime_msec`:
    * This value should stay below 1s. However, when a dbserver is rotated there can be single runs that have much higher runtime.
      However, this should not be true in general.

      This value will only increase for the leading agent.

_Troubleshoot:_
If the supervision is not able to run approx. once per second cluster resilience is affected. Please consider contacting our support.

Metrics API details
-------------------

<!-- js/actions/api-system.js -->
{% docublock get_admin_metrics %}
