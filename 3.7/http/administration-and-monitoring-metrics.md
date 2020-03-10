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


## Cluster Healthyness

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
* arangodb_heartbeat_send_time_msec The time a single heartbeat took to be delivered.
* arangodb_heartbeat_failures Amount of heartbeats which this server failed to deliver. 

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




std::string const StaticStrings::HeartbeatSendTimeMs("arangodb_heartbeat_send_time_msec");
std::string const StaticStrings::HeartbeatFailureCounter("arangodb_heartbeat_failures");

std::string const StaticStrings::MaintenancePhaseOneRuntimeMs("arangodb_maintenance_phase1_runtime_msec");
std::string const StaticStrings::MaintenancePhaseTwoRuntimeMs("arangodb_maintenance_phase2_runtime_msec");
std::string const StaticStrings::MaintenanceAgencySyncRuntimeMs("arangodb_maintenance_agency_sync_runtime_msec");

std::string const StaticStrings::MaintenancePhaseOneAccumRuntimeMs("arangodb_maintenance_phase1_accum_runtime_msec");
std::string const StaticStrings::MaintenancePhaseTwoAccumRuntimeMs("arangodb_maintenance_phase2_accum_runtime_msec");
std::string const StaticStrings::MaintenanceAgencySyncAccumRuntimeMs("arangodb_maintenance_agency_sync_accum_runtime_msec");

std::string const StaticStrings::ShardsOutOfSync("arangodb_shards_out_of_sync");
std::string const StaticStrings::ShardsTotalCount("arangodb_shards_total_count");
std::string const StaticStrings::ShardsLeaderCount("arangodb_shards_leader_count");
std::string const StaticStrings::ShardsNotReplicated("arangodb_shards_not_replicated");

std::string const StaticStrings::AgencyCommRequestTimeMs("arangodb_agencycomm_request_time_ms");

std::string const StaticStrings::AqlQueryRuntimeMs("arangodb_aql_total_query_time_ms");

std::string const StaticStrings::SchedulerQueueLength("arangodb_scheduler_queue_length");
std::string const StaticStrings::SchedulerAwakeWorkers("arangodb_scheduler_awake_threads");
std::string const StaticStrings::SchedulerNumWorker("arangodb_scheduler_num_worker_threads");

std::string const StaticStrings::DroppedFollowerCount("arangodb_dropped_followers_count");

Metrics API details
-------------------

<!-- js/actions/api-system.js -->
{% docublock get_admin_metrics %}
