---
layout: default
description: What you need for Datacenter-to-Datacenter Replication
title: DC2DC Requirements
---
# Requirements

To use _Datacenter-to-Datacenter Replication_ you need the following:

- Two datacenters, each running an ArangoDB Enterprise Edition cluster.
- A network connection between both datacenters with accessible endpoints
  for several components (see individual components for details).
- TLS certificates for ArangoSync master instances (can be self-signed).
- Optional (but recommended) TLS certificates for ArangoDB clusters (can be self-signed).
- Client certificates CA for _ArangoSync masters_ (typically self-signed).
- Client certificates for _ArangoSync masters_ (typically self-signed).
- At least 2 instances of the _ArangoSync master_ in each datacenter.
- One instances of the _ArangoSync worker_ on every machine in each datacenter.

Note: In several places you will need a (x509) certificate.
<br/>The [Certificates](security-dc2-dc.html#certificates) section provides more guidance for creating
and renewing these certificates.

Besides the above list, you probably want to use the following:

- An orchestrator to keep all components running, e.g. `systemd`.
- A log file collector for centralized collection & access to the logs of all components.
- A metrics collector & viewing solution such as _Prometheus_ + _Grafana_.
