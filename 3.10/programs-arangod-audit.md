---
layout: default
description: ArangoDB Server Audit Options
---
# ArangoDB Server Audit Options

{% include hint-ee.md feature="Auditing" %}

## Hostname

`--audit.hostname`

The name of the server used in audit log messages. By default, the
system hostname is used.

## Output

`--audit.output`

Specifies the target of the audit log. Possible values are

`file://filename` where *filename* can be relative or absolute.

`syslog://facility` or `syslog://facility/application-name` to log
into a syslog server.

The option can be specified multiple times in order to configure the
output for multiple targets.

Any occurrence of `$PID` inside a filename will be replaced at runtime with the
actual process id. This enables logging to process-specific files, e.g.

`--audit.output 'file:///var/log/arangod.log.$PID'`

Please note that the dollar sign may need extra escaping when specified from 
inside shells such as Bash.

## Verbosity

`--log.level topic=level`

By default, the server will log all audit events. Some low priority events, such
as statistics operations, are logged with the `debug` log level. To keep such
events from cluttering the log, set the appropriate topic to `info`. All other
messages will be logged at the `info` level. Audit topics include
`audit-authentication`, `audit-authorization`, `audit-collection`,
`audit-database`, `audit-document`, `audit-service`, and `audit-view`. 

## Maximum line length

<small>Introduced in: v3.7.9</small>

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

## Write log level

<small>Introduced in: v3.10.0</small>

`--audit.write-log-level`

This options controls whether the log level is shown in the audit log 
message. When this option is omitted or set to false, the log level is not shown in the message, e.g.:

```
44:2016-10-03 15:47:26 | server1 | audit-authentication | n/a | database1 | 
127.0.0.1:61528 | http basic | credentials wrong | /_api/version
```

When the option is set to true, the log level is included in the message, e.g.:

```
44:2016-10-03 15:47:26 | INFO | server1 | audit-authentication | n/a | database1
| 127.0.0.1:61528 | http basic | credentials wrong | /_api/version
```
