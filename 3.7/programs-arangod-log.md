---
layout: default
description: ArangoDB Server Log Options
---
# ArangoDB Server Log Options

## Log levels and topics

ArangoDB's log output is grouped into topics. `--log.level` can be specified
multiple times at startup, for as many topics as needed. The log verbosity and
output files can be adjusted per log topic. For example

```
--log.level startup=trace --log.level queries=trace --log.level info
```

will log messages concerning startup at trace level, AQL queries at trace level,
and messages with the general topic at info level. Note that `--log.level info`
does not set a log level globally for all existing topics, but only the
`general` topic!

In a configuration file, it is written like this:

```
[log]
level = startup=trace
level = queries=trace
level = info
```

The available log levels are:

- `fatal`: only logs fatal errors
- `error`: only logs errors
- `warning`: only logs warnings and errors
- `info`: logs information messages, warnings and errors
- `debug`: logs debug and information messages, warnings and errors
- `trace`: logs trace, debug and information messages, warnings and errors

Note that levels `debug` and `trace` will be very verbose.

See [Log Levels](monitoring-log-levels.html) in the Monitoring chapter for a
detailed description of the different levels.

Some relevant log topics available in ArangoDB 3 are:

- `agency`: information about the Agency
- `collector`: information about the WAL collector's state
- `compactor`: information about the collection datafile compactor
- `datafiles`: datafile-related operations
- `mmap`: information about memory-mapping operations (including msync)
- `performance`: performance-related messages
- `queries`: executed AQL queries, slow queries
- `replication`: replication-related info
- `requests`: HTTP requests
- `startup`: information about server startup and shutdown
- `threads`: information about threads

See more [log levels](http/administration-and-monitoring.html#modify-and-return-the-current-server-log-level)

## Log outputs

The log option `--log.output <definition>` allows directing the global
or per-topic log output to different outputs. The output definition `<definition>`
can be one of

- `-` for stdin
- `+` for stderr
- `syslog://<syslog-facility>`
- `syslog://<syslog-facility>/<application-name>`
- `file://<relative-path>`

The option can be specified multiple times in order to configure the output
for different log topics. To set up a per-topic output configuration, use
`--log.output <topic>=<definition>`, e.g.

    queries=file://queries.txt

logs all queries to the file "queries.txt".

Any occurrence of `$PID` inside a log output value will be replaced at runtime 
with the actual process id. This enables logging to process-specific files, e.g.

`--log.output 'file:///var/log/arangod.log.$PID'`

Please note that the dollar sign may need extra escaping when specified from 
inside shells such as Bash.

The old option `--log.file` is still available in 3.0 for convenience reasons. In
3.0 it is a shortcut for the more general option `--log.output file://filename`.

The old option `--log.requests-file` is still available in 3.0. It is now a shortcut
for the more general option `--log.output requests=file://...`.

Using `--log.output` also allows directing log output to different files based on 
topics. For example, to log all AQL queries to a file "queries.log" one can use the 
options:

```
--log.level queries=trace --log.output queries=file:///path/to/queries.log
```

To additionally log HTTP request to a file named "requests.log" add the options:

```
--log.level requests=info --log.output requests=file:///path/to/requests.log
```

If you specify `--log.file-mode octalvalue` then any newly created log
file will use "octalvalue" as file mode. Please note that the `umask`
value will be applied as well.

If you specify `--log.file-group name` then any newly created log file
will try to use "name" as group name. Please note that you have to be
a member of that group. Otherwise the group ownership will not be
changed. Please note that this option is only available under Linux
and Mac. It is not available under Windows.

## Forcing direct output

The option `--log.force-direct` can be used to disable logging in an extra
logging thread. If set to `true`, any log messages are immediately printed in the
thread that triggered the log message. This is non-optimal for performance but
can aid debugging. If set to `false`, log messages are handed off to an extra
logging thread, which asynchronously writes the log messages.

## Time format

The option `--log.time-format` controls the time format used in log output.
The possible values for this option are:

Format                  | Example                  | Description
:-----------------------|:------------------------ |:-----------
`timestamp`             | 1553766923000            | unix timestamps, in seconds
`timestamp-millis`      | 1553766923000.123        | unix timestamps, in seconds, with millisecond precision
`timestamp-micros`      | 1553766923000.123456     | unix timestamps, in seconds, with microsecond precision
`uptime`                | 987654                   | seconds since server start
`uptime-millis`         | 987654.123               | seconds since server start, with millisecond precision
`uptime-micros`         | 987654.123456            | seconds since server start, with microsecond precision
`utc-datestring`        | 2019-03-28T09:55:23Z     | UTC-based date and time in format YYYY-MM-DDTHH:MM:SSZ 
`utc-datestring-millis` | 2019-03-28T09:55:23.123Z | like `utc-datestring`, but with millisecond precision
`local-datestring`      | 2019-03-28T10:55:23      | local date and time in format YYYY-MM-DDTHH:MM:SS

## Escaping

`--log.escape value`

This option toggles the escaping of log output. 

If set to `true`, the following characters in the log output are escaped:

- the carriage return character (hex `0d`)
- the newline character (hex `0a`)
- the tabstop character (hex `09`)
- any other characters with an ordinal value less than hex `20`

If the option is set to `false`, no characters are escaped. Characters with
an ordinal value less than hex `20` will not be printed in this mode but will
be replaced with a space character (hex `20`).

A side effect of turning off the escaping is that it will reduce the CPU 
overhead for the logging. However, this will only be noticeable when logging
is set to a very verbose level (e.g. debug or trace).

The default value for this option is `true`.

## Maximum line length

<small>Introduced in: v3.7.9</small>

`--log.max-entry-length value`

This option can be used to limit the maximum line length for individual log
messages that are written into normal logfiles by arangod.

{% hint 'info' %}
This option does not include audit log messages. See
[--audit.max-entry-length](programs-arangod-audit.html#maximum-line-length)
instead.
{% endhint %}

Any log messages longer than the specified value will be truncated and the
suffix `...` will be added to them.

The purpose of this parameter is to shorten long log messages in case there is
lot a lot of space for logfiles, and to keep rogue log messages from overusing
resources.

The default value is 128 MB, which is very high and should effectively mean
downwards-compatibility with previous arangod versions, which did not restrict
the maximum size of log messages.

## Color logging

`--log.color value`

Logging to terminal output is by default colored. Colorful logging can be 
turned off by setting the value to false.

## Source function, file and line number

`--log.line-number`

If enabled, then log messages will include the function name, file name and
line number of the source code that issued the log message. The format is
`func@FileName.cpp:123`.

Example:

```
2021-06-08T16:09:31Z [1] INFO [prepare@GreetingsFeature.cpp:43] [e52b0] ArangoDB 3.7.11 [linux] 64bit, using jemalloc, build tags/v3.7.11-0-g5ca39c161b, VPack 0.1.33, RocksDB 6.8.0, ICU 64.2, V8 7.9.317, OpenSSL 1.1.1k  25 Mar 2021
2021-06-08T16:09:31Z [1] INFO [prepare@EnvironmentFeature.cpp:68] [75ddc] detected operating system: Linux version 4.15.0-140-generic (buildd@lgw01-amd64-054) (gcc version 7.5.0 (Ubuntu 7.5.0-3ubuntu1~18.04)) #144-Ubuntu SMP Fri Mar 19 14:12:35 UTC 2021
2021-06-08T16:09:31Z [1] INFO [prepare@EnvironmentFeature.cpp:251] [25362] {memory} Available physical memory: 67513589760 bytes, available cores: 32
2021-06-08T16:09:31Z [1] WARNING [prepare@EnvironmentFeature.cpp:426] [3e451] {memory} It is recommended to set NUMA to interleaved.
2021-06-08T16:09:31Z [1] WARNING [prepare@EnvironmentFeature.cpp:428] [b25a4] {memory} put 'numactl --interleave=all' in front of your command
2021-06-08T16:09:31Z [1] INFO [prepare@AuthenticationFeature.cpp:190] [43396] {authentication} Jwt secret not specified, generating...
2021-06-08T16:09:31Z [1] INFO [prepare@EngineSelectorFeature.cpp:187] [144fe] using storage engine 'rocksdb'
2021-06-08T16:09:31Z [1] INFO [reportRole@ClusterFeature.cpp:410] [3bb7d] {cluster} Starting up with role SINGLE
2021-06-08T16:09:31Z [1] INFO [start@FileDescriptorsFeature.cpp:90] [a1c60] {syscall} file-descriptors (nofiles) hard limit is 1048576, soft limit is 1048576
2021-06-08T16:09:31Z [1] INFO [start@AuthenticationFeature.cpp:222] [3844e] {authentication} Authentication is turned off, authentication for unix sockets is turned on
2021-06-08T16:09:32Z [1] INFO [start@IResearchFeature.cpp:972] [c1b63] {arangosearch} ArangoSearch maintenance: [5..5] commit thread(s), [5..5] consolidation thread(s)
2021-06-08T16:09:32Z [1] INFO [dump@EndpointList.cpp:222] [6ea38] using endpoint 'http+tcp://0.0.0.0:8529' for non-encrypted requests
2021-06-08T16:09:32Z [1] INFO [start@BootstrapFeature.cpp:370] [cf3f4] ArangoDB (version 3.7.11 [linux]) is ready for business. Have fun!
```

## Prefix

This option specifies a prefix for log messages.

Example: `arangod ... --log.prefix "-->"`

```
2020-07-23T09:46:03Z --> [17493] INFO ...
```

## Threads

Log thread identifier: `--log.thread true`

Whenever log output is generated, the process ID is written as part of the
log information. Setting this option appends the thread id of the calling
thread to the process id. For example,

```
2010-09-20T13:04:01Z [19355] INFO ready for business
```

when no thread is logged and

```
2010-09-20T13:04:17Z [19371-18446744072487317056] ready for business
```

when this command line option is set.

To also log thread names, it is possible to set the `--log.thread-name`
option. By default `--log.thread-name` is set to `false`.

## Role

Log role: `--log.role`

When set to `true`, this option will make the ArangoDB logger print a single
character with the server's role into each logged message. The roles are:

- U: Undefined / unclear (used at startup)
- S: Single server
- C: Coordinator
- P: Primary / DB-Server
- A: Agent

The default value for this option is `false`, so no roles will be logged.

## Log API Access

<small>Introduced in: v3.4.11, v3.5.6, v3.6.5, v3.7.1</small>

`/_admin/log` control: `--log.api-enabled`

Credentials data is not written to log files. Nevertheless, some logged
data might be sensitive depending on the context of the deployment. For
example, if request logging is switched on, user requests and
corresponding data might end up in log files.
Therefore, a certain care with log files is recommended.

Since the database server offers an API to control logging and query
logging data, this API has to be secured properly. By default, the API
is accessible for admin users (administrative access to the `_system`
database). However, one can lock this down further.

The possible values for this option are:

 - `true`: The API `/_admin/log` is accessible for admin users.
 - `jwt`: The API `/_admin/log` is accessible only for the superuser
   (authentication with JWT token and empty username).
 - `false`: The API `/_admin/log` is not accessible at all.

The default value is `true`.

## Logging to memory buffers

<small>Introduced in: v3.7.8</small>

Log level control for in-memory log messages: `--log.in-memory-level`

This option can be used to control which log messages are preserved in memory.
The default value is `info`, meaning all log messages of types `info`,
`warning`, `error` and `fatal` will be stored by an instance in memory.

By setting this option to `warning`, only warning, error and fatal log messages
will be preserved in memory, and by setting the option to `error` only error
and fatal messages  will be kept.

This option is useful because the number of in-memory log messages is limited
to the latest 2048 messages, and these slots are by default shared between
informational, warning and error messages.
