---
layout: default
description: ArangoDB Server Audit Options
---
# ArangoDB Server Audit Options

## Hostname

`--audit.hostname`

Hostname to use.

## Output

`--audit.output`

Audit destination(s).

## Maximum line length

<small>Introduced in: v3.7.9, v3.8.0</small>

`--audit.max-entry-length value`

This option can be used to limit the maximum line length for individual audit
log messages that are written into audit logs by arangod. 

Any audit log messages longer than the specified value will be truncated and
the suffix `...` will be added to them.

The default value is 128 MB, which is very high and should effectively mean
downwards-compatibility with previous arangod versions, which did not restrict
the maximum size of audit log messages.

## Log message queueing

<small>Introduced in: v3.8.0</small>

`--audit.queue value`

This option controls whether audit log messages are submitted to a queue and
written to disk in batches or if they should be written to disk directly
without being queued.

Queueing audit log entries may be beneficial for latency, but can lead to
unqueued messages being lost in case of a power loss or crash. Setting this
option to `false` mimics the behavior from 3.7 and before, where audit log
messages were not queued but written in a blocking fashion.
