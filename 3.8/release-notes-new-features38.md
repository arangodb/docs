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

The following server metrics have been added to the
[Metrics HTTP API](http/administration-and-monitoring-metrics.html)
in ArangoDB 3.8 and can be used for monitoring and alerting:

| Label | Description |
|:------|:------------|
| `arangodb_aql_all_query` | Total number of all AQL queries (including slow queries) |
| `arangodb_aql_query_time` | Histogram with AQL query times distribution |
| `arangodb_aql_slow_query_time` | Histogram with AQL slow query times distribution |
| `arangodb_aql_slow_query` | Total number of slow AQL queries |
| `arangodb_network_forwarded_requests` | Number of requests forwarded from one Coordinator to another in a load-balancing setup |
| `arangodb_replication_dump_apply_time` | Time required for applying data from replication dump responses (ms) |
| `arangodb_replication_dump_bytes_received` | Number of bytes received in replication dump requests |
| `arangodb_replication_dump_documents` | Number of documents received in replication dump requests |
| `arangodb_replication_dump_request_time` | Wait time for replication dump requests (ms) |
| `arangodb_replication_dump_requests` | Number of replication dump requests made |
| `arangodb_replication_initial_chunks_requests_time` | Wait time for replication key chunks determination requests (ms) |
| `arangodb_replication_initial_docs_requests_time` | Time needed to apply replication docs data (ms) |
| `arangodb_replication_initial_insert_apply_time` | Time needed to apply replication initial sync insertions (ms) |
| `arangodb_replication_initial_keys_requests_time` | Wait time for replication keys requests (ms) |
| `arangodb_replication_initial_lookup_time` | Time needed for replication initial sync key lookups (ms) |
| `arangodb_replication_initial_remove_apply_time` | Time needed to apply replication initial sync removals (ms) |
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

 
Timezone conversion
-------
The following AQL functions have been added for converting datetimes in UTC to any timezone in the world including historical daylight saving times and vice versa:

- added AQL function DATE_UTCTOLOCAL(datetime, timezone)
  example: DATE_UTCTOLOCAL('2020-10-15T01:00:00.999Z', 'America/New_York') → '2020-10-14T21:00:00.999'

- added AQL function DATE_LOCALTOUTC(datetime, timezone)
  example: DATE_UTCTOLOCAL('2020-10-14T21:00:00.999', 'America/New_York') → '2020-10-15T01:00:00.999Z'
  
- added IANA timezone database [TZDATA](https://www.iana.org/time-zones){:target="_blank"} to /usr/share/tzdata
