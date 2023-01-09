---
fileID: operations-maintenance-dc2dc
title: DC2DC Replication Operations & Maintenance
weight: 1000
description: 
layout: default
---
## Operations & Maintenance

{{< tag "ArangoDB Enterprise" >}}

ArangoSync is a distributed system with a lot different components.
As with any such system, it requires some, but not a lot of operational
support.

### What means are available to monitor status

All of the components of ArangoSync provide means to monitor their status.
Below you'll find an overview per component.

- Sync master & workers: The `arangosync` servers running as either master
  or worker, provide:
  - A status API, see `arangosync get status`. Make sure that all statuses report `running`.
    <br/>For even more detail the following commands are also available:
    `arangosync get tasks`, `arangosync get masters` & `arangosync get workers`.
  - A log on the standard output. Log levels can be configured using `--log.level` settings.
  - A metrics API `GET /metrics`. This API is compatible with Prometheus.
    Sample Grafana dashboards for inspecting these metrics are available.

- ArangoDB cluster: The `arangod` servers that make up the ArangoDB cluster
  provide:
  - A log file. This is configurable with settings with a `log.` prefix.
  E.g. `--log.output=file://myLogFile` or `--log.level=info`.
  - A statistics API `GET /_admin/statistics`

### What to look for while monitoring status

The very first thing to do when monitoring the status of ArangoSync is to
look into the status provided by `arangosync get status ... -v`.
When not everything is in the `running` state (on both datacenters), this is an
indication that something may be wrong. In case that happens, give it some time
(incremental synchronization may take quite some time for large collections)
and look at the status again. If the statuses do not change (or change, but not reach `running`)
it is time to inspects the metrics & log files.
<br/> When the metrics or logs seem to indicate a problem in a sync master or worker, it is
safe to restart it, as long as only 1 instance is restarted at a time.
Give restarted instances some time to "catch up".

### 'What if ...'

Please consult the [troubleshooting section](troubleshooting-dc2dc)
for detailed descriptions of what to do in case of certain problems, and how and
what information to provide to support so they can assist you best when needed.

### Metrics

ArangoSync (master & worker) provide metrics that can be used for monitoring the ArangoSync
solution. These metrics are available using the following HTTPS endpoints:

- GET `/metrics`: Provides metrics in a format supported by Prometheus.
- GET `/metrics.json`: Provides the same metrics in JSON format.

Both endpoints include help information per metrics.

Note: Both endpoints require authentication. Besides the usual authentication methods
these endpoints are also accessible using a special bearer token specified using the `--monitoring.token`
command line option.

Consult the [monitoring section](monitoring-dc2dc#metrics)
for sample output of the metrics endpoints.
