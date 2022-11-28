---
fileID: release-notes-api-changes38
title: API Changes in ArangoDB 3.8
weight: 11650
description: 
layout: default
---
This document summarizes the HTTP API changes and other API changes in ArangoDB 3.8.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.8.

## HTTP RESTful API

### Collection API

The following changes affect the behavior of the RESTful collection APIs at
endpoints starting with path `/_api/collection/`:

The collection properties `indexBuckets`, `journalSize`, `doCompact` and
`isVolatile` only had a meaning for the MMFiles storage engine, which is not
available anymore since ArangoDB 3.7.

ArangoDB 3.8 now removes any special handling for these obsolete collection
properties, meaning these attributes will not be processed by the server and
not be returned by any server APIs. Using these attributes in any API call
will be ignored, and will not trigger any errors.

Client applications and tests that rely on the behavior that setting any of
these obsolete properties produces an error on the server side may need to
be adjusted now.

### Www-Authenticate response header

ArangoDB 3.8 adds back the `Www-Authenticate` response header for HTTP server
responses with a status code of 401. Returning the `Www-Authenticate` header for
401 responses is required by the HTTP/1.1 specification and was also advertised
functionality in the ArangoDB documentation, but wasn't happening in practice.

Now the functionality of returning `Www-Authenticate` response headers for HTTP
401 responses is restored, along with the already advertised functionality of
suppressing this header in case the client sends an `X-Omit-Www-Authenticate`
header with the request.

This change should not have any impact for client applications that use ArangoDB
as a database only. It may have an effect for Foxx applications that use HTTP
401 status code responses and that will now see this extra header getting returned.

### Endpoint return value changes

- The endpoint `/_api/replication/clusterInventory` returns, among other things,
  an array of the existing collections. Each collection has a `planVersion`
  attribute, which in ArangoDB 3.8 is now hard-coded to the value of 1.

  Before 3.7, the most recent Plan version from the agency was returned inside
  `planVersion` for each collection. In 3.7, the attribute contained the Plan
  version that was in use when the in-memory LogicalCollection object was last
  constructed. The object was always reconstructed in case the underlying Plan
  data for the collection changed, or when a collection contained links to
  ArangoSearch Views. This made the attribute relatively useless for any
  real-world use cases, and so we are now hard-coding it to simplify the internal
  code. Using the attribute in client applications is also deprecated.

- The endpoint `/_api/transaction` previously would allow users to list, query,
  commit, and abort transactions operating in any database as long as the user had
  sufficient permissions. Now the endpoint will restrict operations to
  transactions within the current database.

- The HTTP API for starting a Pregel run `/_api/control-pregel` now returns the
  Pregel execution number as a stringified execution number, e.g. "12345" instead
  of 12345.
  This is not downwards-compatible, so all client applications that depend
  on the return value being a numeric value need to be adjusted to handle
  a string return value and convert that string into a number.

### Endpoints added

- The cursor API endpoint `PUT /_api/cursor/<cursor-id>` to retrieve more data
  from an existing AQL query cursor is now also available under
  `POST /_api/cursor/<cursor-id>`.

  The new POST API is a drop-in replacement for the existing PUT API and
  functionally equivalent to it. The benefit of using the POST API is that
  HTTP POST requests will not be considered as idempotent, so proxies may not
  retry them if they fail. This was the case with the existing PUT API, as
  HTTP PUT requests can be considered idempotent according to the
  [HTTP specification](https://tools.ietf.org/html/rfc7231#section-4.2).

  The POST API is not yet used by ArangoDB 3.8, including the web UI and the
  client tools. This is to ensure the compatibility of 3.8 with earlier
  versions, which may be in use during upgrade to 3.8, or with one of the 3.8
  client tools. The PUT API will remain fully functional in this version of
  ArangoDB and the next. The following version of ArangoDB will switch to using
  the POST variant instead of the PUT for its own requests, including web UI
  and client tools. Driver maintainers should eventually move to the POST
  variant of the cursor API as well. This is safe for drivers targeting 3.8
  or higher.

- The new REST endpoint at GET `/_admin/log/entries` can be used to retrieve
  server log messages in a more intuitive format than the already existing API
  at GET `/_admin/log`.

  The new API returns all matching log messages in an array, with one array
  entry per log message. Each log message is returned as an object containing
  the properties of the log message:

  ```json
  { 
    "total" : 13,
    "messages": [
      {
        "id" : 12,
        "topic" : "general",
        "level" : "INFO",
        "date" : "2021-02-07T01:00:21Z",
        "message" : "[cf3f4] {general} ArangoDB (version 3.8.0-devel enterprise [linux]) is ready for business. Have fun!"
      },
      {
        "id" : 11,
        "topic" : "general",
        "level" : "INFO",
        "date" : "2021-02-07T01:00:21Z",
        "message" : "[99d80] {general} You are using a milestone/alpha/beta/preview version ('3.8.0-devel') of ArangoDB"
      }
    ]
  }
  ```

  The previous API returned an object with 5 attributes at the top-level
  instead, which contained arrays with the attribute values of all log
  messages:

  ```json
  {
    "totalAmount" : 13,
    "lid" : [
      12, 
      11
    ],
    "topic" : [
      "general", 
      "general"
    ],
    "level" : [
      3, 
      3
    ],
    "timestamp" : [
      1612659621, 
      1612659621
    ],
    "text" : [
      "[cf3f4] {general} ArangoDB (version 3.8.0-devel enterprise [linux]) is ready for business. Have fun!", 
      "[99d80] {general} You are using a milestone/alpha/beta/preview version ('3.8.0-devel') of ArangoDB"
    ]
  }
  ```

  The old API endpoint GET `/_admin/log` for retrieving log messages is now
  deprecated, although it will stay available for some time.

- Added endpoint for new version "v2" of the metrics API:

  `GET /_admin/metrics/v2` will return Prometheus-format of the server metrics.

  The old endpoint `GET /_admin/metrics` is still supported but is considered
  to be obsolete from 3.8 on and will be removed in a future version. Also see
  [Features and Improvements in 3.8](release-notes-new-features38#metrics).

  In the new API V2, there are quite a lot more metrics than in previous
  versions and a lot have been renamed to follow Prometheus conventions.
  Below is a list of renamed metrics:

  | `/_admin/metrics` | `/_admin/metrics/v2` |
  |:------------------|:---------------------|
  | `arangodb_agency_cache_callback_count` | `arangodb_agency_cache_callback_number` |
  | `arangodb_agency_callback_count` | `arangodb_agency_callback_number` |
  | `arangodb_agency_callback_registered` | `arangodb_agency_callback_registered_total` |
  | `arangodb_agency_read_no_leader` | `arangodb_agency_read_no_leader_total` |
  | `arangodb_agency_read_ok` | `arangodb_agency_read_ok_total` |
  | `arangodb_agency_supervision_accum_runtime_msec` | `arangodb_agency_supervision_accum_runtime_msec_total` |
  | `arangodb_agency_supervision_accum_runtime_wait_for_replication_msec` | `arangodb_agency_supervision_accum_runtime_wait_for_replication_msec_total` |
  | `arangodb_agency_supervision_failed_server_count` | `arangodb_agency_supervision_failed_server_total` |
  | `arangodb_agency_write_no_leader` | `arangodb_agency_write_no_leader_total` |
  | `arangodb_agency_write_ok` | `arangodb_agency_write_ok_total` |
  | `arangodb_aql_all_query` | `arangodb_aql_all_query_total` |
  | `arangodb_aql_slow_query` | `arangodb_aql_slow_query_total` |
  | `arangodb_aql_total_query_time_msec` | `arangodb_aql_total_query_time_msec_total` |
  | `arangodb_collection_lock_acquisition_micros` | `arangodb_collection_lock_acquisition_micros_total` |
  | `arangodb_collection_lock_sequential_mode` | `arangodb_collection_lock_sequential_mode_total` |
  | `arangodb_collection_lock_timeouts_exclusive` | `arangodb_collection_lock_timeouts_exclusive_total` |
  | `arangodb_collection_lock_timeouts_write` | `arangodb_collection_lock_timeouts_write_total` |
  | `arangodb_collection_truncates` | `arangodb_collection_truncates_total` |
  | `arangodb_collection_truncates_replication` | `arangodb_collection_truncates_replication_total` |
  | `arangodb_connection_connections_current` | `arangodb_connection_pool_connections_current` |
  | `arangodb_connection_leases_successful` | `arangodb_connection_pool_leases_successful_total` |
  | `arangodb_connection_pool_connections_created` | `arangodb_connection_pool_connections_created_total` |
  | `arangodb_connection_pool_leases_failed` | `arangodb_connection_pool_leases_failed_total` |
  | `arangodb_document_writes` | `arangodb_document_writes_total` |
  | `arangodb_document_writes_replication` | `arangodb_document_writes_replication_total` |
  | `arangodb_dropped_followers_count` | `arangodb_dropped_followers_total` |
  | `arangodb_heartbeat_failures` | `arangodb_heartbeat_failures_total` |
  | `arangodb_http_request_statistics_async_requests` | `arangodb_http_request_statistics_async_requests_total` |
  | `arangodb_http_request_statistics_http_delete_requests` | `arangodb_http_request_statistics_http_delete_requests_total` |
  | `arangodb_http_request_statistics_http_get_requests` | `arangodb_http_request_statistics_http_get_requests_total` |
  | `arangodb_http_request_statistics_http_head_requests` | `arangodb_http_request_statistics_http_head_requests_total` |
  | `arangodb_http_request_statistics_http_options_requests` | `arangodb_http_request_statistics_http_options_requests_total` |
  | `arangodb_http_request_statistics_http_patch_requests` | `arangodb_http_request_statistics_http_patch_requests_total` |
  | `arangodb_http_request_statistics_http_post_requests` | `arangodb_http_request_statistics_http_post_requests_total` |
  | `arangodb_http_request_statistics_http_put_requests` | `arangodb_http_request_statistics_http_put_requests_total` |
  | `arangodb_http_request_statistics_other_http_requests` | `arangodb_http_request_statistics_other_http_requests_total` |
  | `arangodb_http_request_statistics_superuser_requests` | `arangodb_http_request_statistics_superuser_requests_total` |
  | `arangodb_http_request_statistics_total_requests` | `arangodb_http_request_statistics_total_requests_total` |
  | `arangodb_http_request_statistics_user_requests` | `arangodb_http_request_statistics_user_requests_total` |
  | `arangodb_intermediate_commits` | `arangodb_intermediate_commits_total` |
  | `arangodb_load_current_accum_runtime_msec` | `arangodb_load_current_accum_runtime_msec_total` |
  | `arangodb_load_plan_accum_runtime_msec` | `arangodb_load_plan_accum_runtime_msec_total` |
  | `arangodb_maintenance_action_accum_queue_time_msec` | `arangodb_maintenance_action_accum_queue_time_msec_total` |
  | `arangodb_maintenance_action_accum_runtime_msec` | `arangodb_maintenance_action_accum_runtime_msec_total` |
  | `arangodb_maintenance_action_done_counter` | `arangodb_maintenance_action_done_total` |
  | `arangodb_maintenance_action_duplicate_counter` | `arangodb_maintenance_action_duplicate_total` |
  | `arangodb_maintenance_action_failure_counter` | `arangodb_maintenance_action_failure_total` |
  | `arangodb_maintenance_action_registered_counter` | `arangodb_maintenance_action_registered_total` |
  | `arangodb_maintenance_agency_sync_accum_runtime_msec` | `arangodb_maintenance_agency_sync_accum_runtime_msec_total` |
  | `arangodb_maintenance_phase1_accum_runtime_msec` | `arangodb_maintenance_phase1_accum_runtime_msec_total` |
  | `arangodb_maintenance_phase2_accum_runtime_msec` | `arangodb_maintenance_phase2_accum_runtime_msec_total` |
  | `arangodb_network_forwarded_requests` | `arangodb_network_forwarded_requests_total` |
  | `arangodb_network_request_timeouts` | `arangodb_network_request_timeouts_total` |
  | `arangodb_process_statistics_major_page_faults` | `arangodb_process_statistics_major_page_faults_total` |
  | `arangodb_process_statistics_minor_page_faults` | `arangodb_process_statistics_minor_page_faults_total` |
  | `arangodb_refused_followers_count` | `arangodb_refused_followers_total` |
  | `arangodb_replication_cluster_inventory_requests` | `arangodb_replication_cluster_inventory_requests_total` |
  | `arangodb_replication_dump_apply_time` | `arangodb_replication_dump_apply_time_total` |
  | `arangodb_replication_dump_bytes_received` | `arangodb_replication_dump_bytes_received_total` |
  | `arangodb_replication_dump_documents` | `arangodb_replication_dump_documents_total` |
  | `arangodb_replication_dump_requests` | `arangodb_replication_dump_requests_total` |
  | `arangodb_replication_dump_request_time` | `arangodb_replication_dump_request_time_total` |
  | `arangodb_replication_failed_connects` | `arangodb_replication_failed_connects_total` |
  | `arangodb_replication_initial_chunks_requests_time` | `arangodb_replication_initial_chunks_requests_time_total` |
  | `arangodb_replication_initial_docs_requests_time` | `arangodb_replication_initial_docs_requests_time_total` |
  | `arangodb_replication_initial_insert_apply_time` | `arangodb_replication_initial_insert_apply_time_total` |
  | `arangodb_replication_initial_keys_requests_time` | `arangodb_replication_initial_keys_requests_time_total` |
  | `arangodb_replication_initial_lookup_time` | `arangodb_replication_initial_lookup_time_total` |
  | `arangodb_replication_initial_remove_apply_time` | `arangodb_replication_initial_remove_apply_time_total` |
  | `arangodb_replication_initial_sync_bytes_received` | `arangodb_replication_initial_sync_bytes_received_total` |
  | `arangodb_replication_initial_sync_docs_inserted` | `arangodb_replication_initial_sync_docs_inserted_total` |
  | `arangodb_replication_initial_sync_docs_removed` | `arangodb_replication_initial_sync_docs_removed_total` |
  | `arangodb_replication_initial_sync_docs_requested` | `arangodb_replication_initial_sync_docs_requested_total` |
  | `arangodb_replication_initial_sync_docs_requests` | `arangodb_replication_initial_sync_docs_requests_total` |
  | `arangodb_replication_initial_sync_keys_requests` | `arangodb_replication_initial_sync_keys_requests_total` |
  | `arangodb_replication_synchronous_requests_total_number` | `arangodb_replication_synchronous_requests_total_number_total` |
  | `arangodb_replication_synchronous_requests_total_time` | `arangodb_replication_synchronous_requests_total_time_total` |
  | `arangodb_replication_tailing_apply_time` | `arangodb_replication_tailing_apply_time_total` |
  | `arangodb_replication_tailing_bytes_received` | `arangodb_replication_tailing_bytes_received_total` |
  | `arangodb_replication_tailing_documents` | `arangodb_replication_tailing_documents_total` |
  | `arangodb_replication_tailing_follow_tick_failures` | `arangodb_replication_tailing_follow_tick_failures_total` |
  | `arangodb_replication_tailing_markers` | `arangodb_replication_tailing_markers_total` |
  | `arangodb_replication_tailing_removals` | `arangodb_replication_tailing_removals_total` |
  | `arangodb_replication_tailing_requests` | `arangodb_replication_tailing_requests_total` |
  | `arangodb_replication_tailing_request_time` | `arangodb_replication_tailing_request_time_total` |
  | `arangodb_scheduler_queue_full_failures` | `arangodb_scheduler_queue_full_failures_total` |
  | `arangodb_scheduler_threads_started` | `arangodb_scheduler_threads_started_total` |
  | `arangodb_scheduler_threads_stopped` | `arangodb_scheduler_threads_stopped_total` |
  | `arangodb_server_statistics_server_uptime` | `arangodb_server_statistics_server_uptime_total` |
  | `arangodb_shards_leader_count` | `arangodb_shards_leader_number` |
  | `arangodb_shards_total_count` | `arangodb_shards_number` |
  | `arangodb_sync_wrong_checksum` | `arangodb_sync_wrong_checksum_total` |
  | `arangodb_transactions_aborted` | `arangodb_transactions_aborted_total` |
  | `arangodb_transactions_committed` | `arangodb_transactions_committed_total` |
  | `arangodb_transactions_expired` | `arangodb_transactions_expired_total` |
  | `arangodb_transactions_started` | `arangodb_transactions_started_total` |
  | `arangodb_v8_context_created` | `arangodb_v8_context_created_total` |
  | `arangodb_v8_context_creation_time_msec` | `arangodb_v8_context_creation_time_msec_total` |
  | `arangodb_v8_context_destroyed` | `arangodb_v8_context_destroyed_total` |
  | `arangodb_v8_context_entered` | `arangodb_v8_context_entered_total` |
  | `arangodb_v8_context_enter_failures` | `arangodb_v8_context_enter_failures_total` |
  | `arangodb_v8_context_exited` | `arangodb_v8_context_exited_total` |
  | `rocksdbengine_throttle_bps` | `rocksdb_engine_throttle_bps` |
  | `rocksdb_write_stalls` | `arangodb_rocksdb_write_stalls_total` |
  | `rocksdb_write_stops` | `arangodb_rocksdb_write_stops_total` |

### Endpoints augmented

- The REST endpoint at GET `/_api/engine/stats` now returns useful information in cluster
  setups too. Previously calling this API on a Coordinator always produced an empty JSON
  object result, whereas now it will produce a JSON object with one key per DB-Server.
  The mapped value per DB-Server are the engine statistics for this particular server.

  The return value structure is different to the return value structure in single server,
  where the return value is a simple JSON object with the statistics at the top level.

- The REST endpoint for creating indexes, POST `/_api/index`, can now handle the attribute
  `estimates`, which determines if the to-be-created index should maintain selectivity
  estimates or not. If not specified, the default value for this attribute is `true` for
  indexes of type "persistent", so that selectivity estimates are maintained. They can be
  optionally turned off by setting the attribute to `false`. Turning off selectivity 
  estimates can have a slightly positive effect on write performance. The attribute will
  only be picked up for indexes of type "persistent", "hash" and "skiplist" (where the
  latter two are aliases for "persistent" nowadays).

- The REST endpoint at GET `/_api/collection/<collection>/checksum` now also works
  in cluster setups. In previous versions, this endpoint was not supported in cluster
  setups and returned HTTP 501 (Not implemented).

- The HTTP REST API endpoint `POST /_api/cursor` can now handle an 
  additional sub-attribute `fillBlockCache` for its `options` attribute.
  `fillBlockCache` controls whether the to-be-executed query should
  populate the RocksDB block cache with the data read by the query.
  This is an optional attribute, and its default value is `true`, meaning
  that the block cache will be populated (introduced in v3.8.1).

### Endpoints deprecated

The API endpoints `/_admin/statistics` and `/_admin/statistics-description` are
now deprecated in favor of the new metrics API endpoint `/_admin/metrics/v2`.
The metrics endpoint provides a lot more information than the statistics
endpoints, and will also be augmented with more metrics in the future.
The statistics endpoints will still be functional in 3.8, but will eventually
be removed in a future version of ArangoDB.

The REST API endpoint `/_api/export` is also deprecated in ArangoDB 3.8. This
endpoint was previously only present in single server, but never supported in
cluster deployments. The purpose of the endpoint was to provide the full data
of a collection without holding collection locks for a long time, which was
useful for the MMFile storage engine with its collection-level locks. If the
functionality provided by this endpoint is still required by client
applications, running a streaming AQL query to export the collection data can
be used as a substitution.

### Endpoints removed

The API endpoint `/_admin/repair/distributeShardsLike` for repairing the
`distributeShardsLike` settings of cluster collections introduced before
version 3.2.12 or 3.3.4 respectively, is now deprecated and removed from
documentation.

There should not be any reasons to use this API with 3.8 or higher, and there
was never any driver or official script support for it. The endpoint will be
removed in ArangoDB 3.9.

## JavaScript API

- The JavaScript API for starting a Pregel run `/_api/control-pregel` now returns the
  Pregel execution number as a stringified execution number, e.g. "12345" instead
  of 12345.
  This is not downwards-compatible. Foxx services, arangosh scripts etc. that depend
  on the return value being a numeric value may need to be adjusted to handle
  a string return value and convert that string into a number.

## ArangoDB Server Environment Variables

The new environment variable `TZ_DATA` can be used to specify the path to the
directory containing the timezone information database for ArangoDB.
That directory is normally named `tzdata` and is shipped with ArangoDB releases.
It is normally not required to set this environment variable, but it may be
necessary in unusual setups with non-conventional directory layouts and paths.
