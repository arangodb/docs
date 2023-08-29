---
layout: default
description: >-
  You can get information about ArangoDB servers, toggle the maintenance mode,
  shut down server nodes, and start actions like compaction
redirect_from:
  - administration-and-monitoring.html # 3.10 -> 3.10
  - miscellaneous-functions.html # 3.10 -> 3.10
  - license.html # 3.10 -> 3.10
---
# HTTP interface for administration

{{ page.description }}
{:class="lead"}

## Information

{% docublock get_api_version %}
{% docublock get_api_engine %}
{% docublock get_admin_time %}
{% docublock get_admin_status %}
{% docublock get_admin_server_availability %}
{% docublock get_admin_support_info %}

## Server mode

{% docublock get_admin_server_mode %}
{% docublock put_admin_server_mode %}

## License

The endpoints for license management allow you to view the current license
status and update the license of your ArangoDB Enterprise Edition deployment.

{% docublock get_admin_license %}
{% docublock put_admin_license %}

## Shutdown

{% docublock delete_api_shutdown %}
{% docublock get_api_shutdown %}

## Miscellaneous actions

{% docublock put_admin_compact %}
{% docublock post_admin_routing_reload %}
{% docublock post_admin_echo %}
{% docublock post_admin_execute %}

## Endpoints

{% hint 'warning' %}
The `/_api/endpoint` endpoint is deprecated. For cluster deployments, you can
use `/_api/cluster/endpoints` instead to find all current Coordinator endpoints.
See [Cluster](cluster.html#endpoints).
{% endhint %}

An ArangoDB server can listen for incoming requests on multiple _endpoints_.

The endpoints are normally specified either in the _arangod_ configuration
file or on the command-line, using the `--server.endpoint` startup option.
The default endpoint for ArangoDB is `tcp://127.0.0.1:8529` (IPv4 localhost on
port 8529 over the HTTP protocol).

Note that all endpoint management operations can only be accessed via
the default `_system` database and none of the other databases.

{% docublock get_api_endpoint %}
