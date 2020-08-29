---
layout: default
description: ArangoDB v3.8 Release Notes New Features
---
Features and Improvements in ArangoDB 3.8
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.8. ArangoDB 3.8 also contains several bug fixes that are not listed
here.

Metrics
-------

The following server metrics have been added in ArangoDB 3.8 and can be used for
monitoring and alerting:

* `arangodb_aql_all_query`: total number of AQL queries (including slow queries).
* `arangodb_aql_query_time`: histogram with AQL query times distribution.
* `arangodb_aql_slow_query_time`: histogram with AQL slow query times distribution.
* `arangodb_aql_slow_query`: total number of slow AQL queries.
* `arangodb_network_forwarded_requests` to track the number of requests forwarded 
  from one coordinator to another in a load-balancing setup.
* `arangodb_replication_dump_apply_time`: time required for applying data from 
  replication dump responses (ms).
* `arangodb_replication_dump_bytes_received`: number of bytes received in replication 
  dump requests.
* `arangodb_replication_dump_documents`: number of documents received in replication 
  dump requests.
* `arangodb_replication_dump_request_time`: wait time for replication dump requests 
  (ms).
* `arangodb_replication_dump_requests`: number of replication dump requests made.
* `arangodb_replication_initial_chunks_requests_time`: wait time for replication key 
  chunks determination requests (ms).
* `arangodb_replication_initial_docs_requests_time`: time needed to apply replication 
  docs data (ms).
* `arangodb_replication_initial_insert_apply_time`: time needed to apply replication 
  initial sync insertions (ms).
* `arangodb_replication_initial_keys_requests_time`: wait time for replication keys 
  requests (ms).
* `arangodb_replication_initial_lookup_time`: time needed for replication initial 
  sync key lookups (ms).
* `arangodb_replication_initial_remove_apply_time`: time needed to apply replication 
  initial sync removals (ms).
* `arangodb_replication_initial_sync_docs_inserted`: number of documents inserted by 
  replication initial sync.
* `arangodb_replication_initial_sync_docs_removed`: number of documents inserted by 
  replication initial sync.
* `arangodb_replication_initial_sync_docs_requested`: number of documents requested 
  via replication initial sync requests.
* `arangodb_replication_initial_sync_docs_requests`: number of replication initial 
  sync docs requests made.
* `arangodb_replication_initial_sync_keys_requests`: number of replication initial 
  sync keys requests made.
* `arangodb_replication_tailing_apply_time`: time needed to apply replication 
  tailing markers (ms).
* `arangodb_replication_tailing_bytes_received`: number of bytes received for 
  replication tailing requests.
* `arangodb_replication_tailing_documents`: number of replication tailing document 
  inserts/replaces processed.
* `arangodb_replication_tailing_follow_tick_failures`: number of replication tailing 
  failures due to missing tick on leader.
* `arangodb_replication_tailing_markers`: number of replication tailing markers 
  processed.
* `arangodb_replication_tailing_removals`: number of replication tailing document 
  removals processed.
* `arangodb_replication_tailing_request_time`: wait time for replication tailing 
  requests (ms).
* `arangodb_replication_tailing_requests`: number of replication tailing requests.


Logging
-------

The following logging-related options have been added:

- added option `--log.use-json-format` to switch log output to JSON format.
  Each log message then produces a separate line with JSON-encoded log data,
  which can be consumed by applications.

  The attributes produced for each log message JSON object are:

  | Key        | Value      |
  |:-----------|:-----------|
  | `time`     | date/time of log message, in format specified by `--log.time-format`
  | `prefix`   | only emitted if `--log.prefix` is set
  | `pid`      | process id, only emitted if `--log.process` is set
  | `tid`      | thread id, only emitted if `--log.thread` is set
  | `thread`   | thread name, only emitted if `--log.thread-name` is set
  | `role`     | server role (1 character), only emitted if `--log.role` is set
  | `level`    | log level (e.g. `"WARN"`, `"INFO"`)
  | `file`     | source file name of log message, only emitted if `--log.file-name` is set
  | `line`     | source file line of log message, only emitted if `--log.file-name` is set 
  | `function` | source file function name, only emitted if `--log.file-name` is set
  | `topic`    | log topic name
  | `id`       | log id (5 digit hexadecimal string), only emitted if `--log.ids` is set
  | `message`  | the actual log message payload

- added option `--log.process` to toggle the logging of the process id
  (pid) in log messages. Logging the process ID is useless when running
  arangod in Docker containers, as the pid will always be 1. So one may
  as well turn it off in these contexts with the new option.

- added option `--log.in-memory` to toggle storing log messages in memory,
  from which they can be consumed via the `/_admin/log` HTTP API and by the 
  Web UI. By default, this option is turned on, so log messages are consumable 
  via the API and UI. Turning this option off will disable that functionality,
  save a tiny bit of memory for the in-memory log buffers and prevent potential
  log information leakage via these means.
