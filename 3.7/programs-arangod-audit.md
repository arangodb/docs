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
One or multiple destinations can be specified. Usually, destinations start with
`file://`, followed by the absolute or relative path to the target logfile.

Any occurrence of `$PID` inside a filename will be replaced at runtime with the
actual process id. This enables logging to process-specific files, e.g.

`--audit.output 'file:///var/log/arangod.log.$PID'`

Please note that the dollar sign may need extra escaping when specified from 
inside shells such as Bash.

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
