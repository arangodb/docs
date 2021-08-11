---
layout: default
description: Metrics exposed by ArangoDB and how to export them to Prometheus.
title: arangod Server Metrics
page-toc:
  max-headline-level: 3
---
# ArangoDB Server Metrics

_arangod_ exports metrics in Prometheus format which can be used to monitor
the healthiness and performance of the system. The thresholds for alerts are
also described for relevant metrics.

{% hint 'warning' %}
The list of exposed metrics is subject to change in every minor version.
While they should stay backwards compatible for the most part, some metrics are
coupled to specific internals that may be replaced by other mechanisms in the
future.
{% endhint %}

## Metrics API v2

{% docublock get_admin_metrics_v2 %}

{% include metrics.md version=page.version.version %}

## Metrics API (deprecated)

{% docublock get_admin_metrics %}

### List of exposed metrics

| Label | Description |
|:------|:------------|
| `arangodb_agency_append_hist` | Agency RAFT follower append histogram (ms) |
| `arangodb_agency_commit_hist` | Agency RAFT commit histogram (ms) |
| `arangodb_agency_compaction_hist` | Agency compaction histogram (ms) |
| `arangodb_agency_local_commit_index` | This agent's commit index |
| `arangodb_agency_log_size_bytes` | Agency replicated log size (bytes) |
| `arangodb_agency_read_no_leader` | Agency read no leader |
| `arangodb_agency_read_ok` | Agency read ok |
| `arangodb_agency_supervision_accum_runtime_msec` | Accumulated Supervision Runtime (ms) |
| `arangodb_agency_supervision_accum_runtime_wait_for_replication_msec` | Accumulated Supervision wait for replication time (ms) |
| `arangodb_agency_supervision_failed_server_count` | Counter for FailedServer jobs |
| `arangodb_agency_supervision_runtime_msec` | Agency Supervision runtime histogram (ms) |
| `arangodb_agency_supervision_runtime_wait_for_replication_msec` | Agency Supervision wait for replication time (ms) |
| `arangodb_agency_term` | Agency's term |
| `arangodb_agency_write_hist` | Agency write histogram (ms) |
| `arangodb_agency_write_no_leader` | Agency write no leader |
| `arangodb_agency_write_ok` | Agency write ok |
| `arangodb_agencycomm_request_time_msec` | Request time for Agency requests |
| `arangodb_aql_all_query` | Number of all AQL queries (including slow queries) |
| `arangodb_aql_query_time` | Histogram with AQL query times distribution (s) |
| `arangodb_aql_slow_query_time` | Histogram with AQL slow query times distribution (s) |
| `arangodb_aql_slow_query` | Total number of slow AQL queries |
| `arangodb_aql_total_query_time_msec` | Total execution time of all AQL queries (ms) |
| `arangodb_client_connection_statistics_bytes_received_bucket` | Bytes received for a request |
| `arangodb_client_connection_statistics_bytes_received_count` | Bytes received for a request |
| `arangodb_client_connection_statistics_bytes_received_sum` | Bytes received for a request |
| `arangodb_client_connection_statistics_bytes_sent_bucket` | Bytes sent for a request |
| `arangodb_client_connection_statistics_bytes_sent_count` | Bytes sent for a request |
| `arangodb_client_connection_statistics_bytes_sent_sum` | Bytes sent for a request |
| `arangodb_client_connection_statistics_client_connections` | The number of client connections that are currently open |
| `arangodb_client_connection_statistics_connection_time_bucket` | Total connection time of a client |
| `arangodb_client_connection_statistics_connection_time_count` | Total connection time of a client |
| `arangodb_client_connection_statistics_connection_time_sum` | Total connection time of a client |
| `arangodb_client_connection_statistics_io_time_bucket` | Request time needed to answer a request (ms) |
| `arangodb_client_connection_statistics_io_time_count` | Request time needed to answer a request (ms) |
| `arangodb_client_connection_statistics_io_time_sum` | Request time needed to answer a request (ms) |
| `arangodb_client_connection_statistics_queue_time_bucket` | Request time needed to answer a request (ms) |
| `arangodb_client_connection_statistics_queue_time_count` | Request time needed to answer a request (ms) |
| `arangodb_client_connection_statistics_queue_time_sum` | Request time needed to answer a request (ms) |
| `arangodb_client_connection_statistics_request_time_bucket` | Request time needed to answer a request (ms) |
| `arangodb_client_connection_statistics_request_time_count` | Request time needed to answer a request (ms) |
| `arangodb_client_connection_statistics_request_time_sum` | Request time needed to answer a request (ms) |
| `arangodb_client_connection_statistics_total_time_bucket` | Total time needed to answer a request (ms) |
| `arangodb_client_connection_statistics_total_time_count` | Total time needed to answer a request (ms) |
| `arangodb_client_connection_statistics_total_time_sum` | Total time needed to answer a request (ms) |
| `arangodb_collection_lock_acquisition_micros` | Total amount of collection lock acquisition time (μs) |
| `arangodb_collection_lock_acquisitiontime` | Collection lock acquisition time histogram (s) |
| `arangodb_collection_lock_timeouts_exclusive` | Number of timeouts when trying to acquire collection exclusive locks |
| `arangodb_collection_lock_timeouts_write` | Number of timeouts when trying to acquire collection write locks |
| `arangodb_dropped_followers_count` | Number of drop-follower events |
| `arangodb_heartbeat_failures` | Counting failed heartbeat transmissions |
| `arangodb_heartbeat_send_time_msec` | Time required to send heartbeat (ms) |
| `arangodb_http_request_statistics_async_requests` | Number of asynchronously executed HTTP requests |
| `arangodb_http_request_statistics_http_delete_requests` | Number of HTTP DELETE requests |
| `arangodb_http_request_statistics_http_get_requests` | Number of HTTP GET requests |
| `arangodb_http_request_statistics_http_head_requests` | Number of HTTP HEAD requests |
| `arangodb_http_request_statistics_http_options_requests` | Number of HTTP OPTIONS requests |
| `arangodb_http_request_statistics_http_patch_requests` | Number of HTTP PATCH requests |
| `arangodb_http_request_statistics_http_post_requests` | Number of HTTP POST requests |
| `arangodb_http_request_statistics_http_put_requests` | Number of HTTP PUT requests |
| `arangodb_http_request_statistics_other_http_requests` | Number of other HTTP requests |
| `arangodb_http_request_statistics_superuser_requests` | Total number of HTTP requests executed by superuser/JWT |
| `arangodb_http_request_statistics_total_requests` | Total number of HTTP requests |
| `arangodb_http_request_statistics_user_requests` | Total number of HTTP requests executed by clients |
| `arangodb_intermediate_commits` | Intermediate commits |
| `arangodb_load_current_accum_runtime_msec` | Accumulated Current loading time (ms) |
| `arangodb_load_current_runtime` | Current loading runtimes (ms) |
| `arangodb_load_plan_accum_runtime_msec` | Accumulated runtime of Plan loading (ms) |
| `arangodb_load_plan_runtime` | Plan loading runtimes (ms) |
| `arangodb_maintenance_action_accum_queue_time_msec` | Accumulated action queue time (ms) |
| `arangodb_maintenance_action_accum_runtime_msec` | Accumulated action runtime (ms) |
| `arangodb_maintenance_action_done_counter` | Counter of action that are done and have been removed from the registry |
| `arangodb_maintenance_action_duplicate_counter` | Counter of action that have been discarded because of a duplicate |
| `arangodb_maintenance_action_failure_counter` | Failure counter for the action |
| `arangodb_maintenance_action_queue_time_msec` | Time spend in the queue before execution (ms) |
| `arangodb_maintenance_action_registered_counter` | Counter of action that have been registered in the action registry |
| `arangodb_maintenance_action_runtime_msec` | Time spend execution the action (ms) |
| `arangodb_maintenance_agency_sync_accum_runtime_msec` | Accumulated runtime of agency sync phase (ms) |
| `arangodb_maintenance_agency_sync_runtime_msec` | Total time spend on agency sync (ms) |
| `arangodb_maintenance_phase1_accum_runtime_msec` | Accumulated runtime of phase one (ms) |
| `arangodb_maintenance_phase1_runtime_msec` | Maintenance Phase 1 runtime histogram (ms) |
| `arangodb_maintenance_phase2_accum_runtime_msec` | Accumulated runtime of phase two (ms) |
| `arangodb_maintenance_phase2_runtime_msec` | Maintenance Phase 2 runtime histogram (ms) |
| `arangodb_network_forwarded_requests` | Number of requests forwarded from one coordinator to another in a load-balancing setup |
| `arangodb_process_statistics_major_page_faults` | On Windows, this figure contains the total number of page faults. On other system, this figure contains the number of major faults the process has made which have required loading a memory page from disk |
| `arangodb_process_statistics_minor_page_faults` | The number of minor faults the process has made which have not required loading a memory page from disk. This figure is not reported on Windows |
| `arangodb_process_statistics_number_of_threads` | Number of threads in the arangod process |
| `arangodb_process_statistics_resident_set_size_percent` | The relative size of the number of pages the process has in real memory compared to system memory. This is just the pages which count toward text, data, or stack space. This does not include pages which have not been demand-loaded in, or which are swapped out. The value is a ratio between 0.00 and 1.00 |
| `arangodb_process_statistics_resident_set_size` | The total size of the number of pages the process has in real memory. This is just the pages which count toward text, data, or stack space. This does not include pages which have not been demand-loaded in, or which are swapped out. The resident set size is reported in bytes |
| `arangodb_process_statistics_system_time` | Amount of time that this process has been scheduled in kernel mode, measured in seconds |
| `arangodb_process_statistics_user_time` | Amount of time that this process has been scheduled in user mode, measured in seconds |
| `arangodb_process_statistics_virtual_memory_size` | On Windows, this figure contains the total amount of memory that the memory manager has committed for the arangod process. On other systems, this figure contains The size of the virtual memory the process is using |
| `arangodb_refused_followers_count` | Number of refusal answers from a follower during synchronous replication |
| `arangodb_replication_dump_apply_time` | Time required for applying data from replication dump responses (ms) |
| `arangodb_replication_dump_bytes_received` | Number of bytes received in replication dump requests |
| `arangodb_replication_dump_documents` | Number of documents received in replication dump requests |
| `arangodb_replication_dump_request_time` | Wait time for replication dump requests (ms) |
| `arangodb_replication_dump_requests` | Number of replication dump requests made |
| `arangodb_replication_failed_connects` | Number of failed connection attempts and response errors during replication |
| `arangodb_replication_initial_chunks_requests_time` | Wait time for replication key chunks determination requests (ms) |
| `arangodb_replication_initial_docs_requests_time` | Time needed to apply replication docs data (ms) |
| `arangodb_replication_initial_insert_apply_time` | Time needed to apply replication initial sync insertions (ms) |
| `arangodb_replication_initial_keys_requests_time` | Wait time for replication keys requests (ms) |
| `arangodb_replication_initial_lookup_time` | Time needed for replication initial sync key lookups (ms) |
| `arangodb_replication_initial_remove_apply_time` | Time needed to apply replication initial sync removals (ms) |
| `arangodb_replication_initial_sync_bytes_received` | Number of bytes received during replication initial sync |
| `arangodb_replication_initial_sync_docs_inserted` | Number of documents inserted by replication initial sync |
| `arangodb_replication_initial_sync_docs_removed` | Number of documents inserted by replication initial sync |
| `arangodb_replication_initial_sync_docs_requested` | Number of documents requested via replication initial sync requests |
| `arangodb_replication_initial_sync_docs_requests` | Number of replication initial sync docs requests made |
| `arangodb_replication_initial_sync_keys_requests` | Number of replication initial sync keys requests made |
| `arangodb_replication_tailing_apply_time` | Time needed to apply replication tailing markers (ms) |
| `arangodb_replication_tailing_bytes_received` | Number of bytes received for replication tailing requests |
| `arangodb_replication_tailing_documents` | Number of replication tailing document inserts/replaces processed |
| `arangodb_replication_tailing_follow_tick_failures` | Number of replication tailing failures due to missing tick on leader |
| `arangodb_replication_tailing_markers` | Number of replication tailing markers processed |
| `arangodb_replication_tailing_removals` | Number of replication tailing document removals processed |
| `arangodb_replication_tailing_request_time` | Wait time for replication tailing requests (ms) |
| `arangodb_replication_tailing_requests` | Number of replication tailing requests |
| `arangodb_rocksdb_free_disk_space` | Free disk space for the RocksDB database directory mount (bytes) |
| `arangodb_rocksdb_total_disk_space` | Total disk space for the RocksDB database directory mount (bytes) |
| `arangodb_scheduler_awake_threads` | Number of awake worker threads |
| `arangodb_scheduler_num_worker_threads` | Number of worker threads |
| `arangodb_scheduler_queue_full_failures` | Number of times the scheduler queue was full and a task/request was rejected |
| `arangodb_scheduler_queue_length` | Server's internal queue length |
| `arangodb_scheduler_threads_started` | Number of scheduler threads started |
| `arangodb_scheduler_threads_stopped` | Number of scheduler threads stopped |
| `arangodb_server_statistics_physical_memory` | Physical memory in bytes |
| `arangodb_server_statistics_server_uptime` | Number of seconds elapsed since server start |
| `arangodb_shards_leader_count` | Number of leader shards on this machine |
| `arangodb_shards_not_replicated` | Number of shards not replicated at all |
| `arangodb_shards_out_of_sync` | Number of leader shards not fully replicated |
| `arangodb_shards_total_count` | Number of shards on this machine |
| `arangodb_sync_wrong_checksum` | Number of times a mismatching shard checksum was detected when syncing shards |
| `arangodb_transactions_aborted` | Transactions aborted |
| `arangodb_transactions_committed` | Transactions committed |
| `arangodb_transactions_started` | Transactions started |
| `arangodb_v8_context_alive` | Number of V8 contexts currently alive |
| `arangodb_v8_context_busy` | Number of V8 contexts currently busy |
| `arangodb_v8_context_created` | Number of V8 contexts created |
| `arangodb_v8_context_destroyed` | Number of V8 contexts destroyed |
| `arangodb_v8_context_dirty` | Number of V8 contexts currently dirty (waiting for garbage collection) |
| `arangodb_v8_context_enter_failures` | Number of times a V8 context could not be entered/acquired |
| `arangodb_v8_context_entered` | Number of times a V8 context was successfully entered |
| `arangodb_v8_context_exited` | Number of times a V8 context was successfully exited |
| `arangodb_v8_context_free` | Number of V8 contexts currently free |
| `arangodb_v8_context_max` | Maximum number of concurrent V8 contexts allowed |
| `arangodb_v8_context_min` | Minimum number of concurrent V8 contexts allowed |
| `rocksdb_free_inodes` | Number of free inodes for the file system with the RocksDB database directory (always `0` on Windows) |
| `rocksdb_total_inodes` | Total number of inodes for the file system with the RocksDB database directory (always `0` on Windows) |
