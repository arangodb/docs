---
layout: default
description: >-
  The security-related endpoints let you can configure audit logging,
  encryption at rest, and encryption in transit
---
# HTTP interfaces for security features

{{ page.description }}
{:class="lead"}

## Audit logging

You can get and set the log level for the `audit-*` log topics using the regular
endpoints for the log levels. See [Monitoring](monitoring.html#logs).

The audit logging feature can otherwise only be configured using startup options.
See [Audit logging](../security-auditing.html#configuration).

## Encryption in transit

{% docublock get_admin_server_tls %}
{% docublock post_admin_server_tls %}

## Encryption at rest

{% docublock post_admin_server_encryption %}
