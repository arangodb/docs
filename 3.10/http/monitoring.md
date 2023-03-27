---
layout: default
description: >-
  You can observe the activity and performance of ArangoDB deployments using
  the server logs, statistics, and metrics
page-toc:
  max-headline-level: 4
redirect_from:
  - ../monitoring-collectd.html # 3.9 -> 3.9
  - ../monitoring-collectd-follower-status.html # 3.9 -> 3.9
  - ../monitoring-collectd-traffic-with-ipaccounting.html # 3.9 -> 3.9
  - ../monitoring-collectd-other-relevant-metrics.html # 3.9 -> 3.9
  - ../monitoring-collectd-foxx-apps.html # 3.9 -> 3.9
  - administration-and-monitoring-metrics.html # 3.10 -> 3.10
---
# Monitoring

{{ page.description }}
{:class="lead"}

## Logs

{% docublock get_admin_log_entries %}
{% docublock get_admin_log %}
{% docublock get_admin_log_level %}
{% docublock put_admin_log_level %}
{% docublock get_admin_log_structured %}
{% docublock put_admin_log_structured %}

## Statistics

{% docublock get_admin_statistics %}
{% docublock get_admin_statistics_description %}

## Metrics

_arangod_ exports metrics in the
[Prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/){:taget="_blank"}.
You can use these metrics to monitor the healthiness and performance of the
system. The thresholds for alerts are also described for relevant metrics.

{% hint 'warning' %}
The list of exposed metrics is subject to change in every minor version.
While they should stay backwards compatible for the most part, some metrics are
coupled to specific internals that may be replaced by other mechanisms in the
future.
{% endhint %}

### Metrics API v2

{% docublock get_admin_metrics_v2, h4 %}

{% include metrics.md version=page.version.version %}

### Metrics API (deprecated)

{% docublock get_admin_metrics, h4 %}
