---
fileID: deployment-kubernetes-metrics
title: Metrics
weight: 920
description: 
layout: default
---
The ArangoDB Kubernetes Operator (`kube-arangodb`) exposes metrics of
its operations in a format that is compatible with [Prometheus](https://prometheus.io).

The metrics are exposed through HTTPS on port `8528` under path `/metrics`.

Look at [examples/metrics](https://github.com/arangodb/kube-arangodb/tree/master/examples/metrics)
for examples of `Services` and `ServiceMonitors` you can use to integrate
with Prometheus through the [Prometheus-Operator by CoreOS](https://github.com/coreos/prometheus-operator).

Furthermore, the operator can run sidecar containers for ArangoDB
deployments of type Cluster which expose metrics in Prometheus format. See:
- [`spec.metrics` reference](deployment-kubernetes-deployment-resource#specmetricsenabled-bool)
{%- assign ver = "3.7" | version: ">=" %}{% if ver %}
- [List of exposed server metrics](../../http/administration-monitoring/administration-and-monitoring-metrics#list-of-exposed-metrics)
{%- endif %}
