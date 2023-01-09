---
fileID: monitoring-dc2dc
title: Monitoring Datacenter-to-Datacenter Replication
weight: 1010
description: 
layout: default
---
{{< tag "ArangoDB Enterprise" >}}

This section includes information related to the monitoring of the
_Datacenter-to-Datacenter Replication_.

## Metrics

_ArangoSync_ (_master_ & _worker_) provide metrics that can be used for monitoring
the _Datacenter-to-Datacenter Replication_ solution. These metrics are available
using the following HTTPS endpoints:

- GET `/metrics`: Provides metrics in a format supported by Prometheus.
- GET `/metrics.json`: Provides the same metrics in JSON format.

Both endpoints include help information per metrics.

{{% hints/info %}}
Both endpoints require authentication. Besides the usual authentication methods
these endpoints are also accessible using a special bearer token specified using the `--monitoring.token`
command line option.
{{% /hints/info %}}

The Prometheus output (`/metrics`) looks like this:

{{< tabs >}}
{{% tab name="text" %}}
```text
...


arangosync_master_worker_registrations 2


arangosync_master_worker_storage{kind="",op="save",result="success"} 20
arangosync_master_worker_storage{kind="empty",op="load",result="success"} 1
...
```
{{% /tab %}}
{{< /tabs >}}

The JSON output (`/metrics.json`) looks like this:

{{< tabs >}}
{{% tab name="json" %}}
```json
{
  ...
  "arangosync_master_worker_registrations": {
    "help": "Total number of registrations",
    "type": "counter",
    "samples": [
      {
        "value": 2
      }
    ]
  },
  "arangosync_master_worker_storage": {
    "help": "Number of times worker info is stored, loaded",
    "type": "counter",
    "samples": [
      {
        "value": 8,
        "labels": {
          "kind": "",
          "op": "save",
          "result": "success"
        }
      },
      {
        "value": 1,
        "labels": {
          "kind": "empty",
          "op": "load",
          "result": "success"
        }
      }
    ]
  }
  ...
}
```
{{% /tab %}}
{{< /tabs >}}

To get a list of a metrics and their help information, run:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
alias jq='docker run --rm -i realguess/jq jq'
curl -sk -u "<user>:<password>" https://<syncmaster-IP>:8629/metrics.json | \
  jq 'with_entries({key: .key, value:.value.help})'
```
{{% /tab %}}
{{< /tabs >}}