---
layout: default
description: This is an introduction to ArangoDB's HTTP interface for administration and monitoring of the server
---
HTTP Interface for Administration and Monitoring
================================================

This is an introduction to ArangoDB's HTTP interface for administration and
monitoring of the server.

Logs
----

<!-- lib/Admin/RestAdminLogHandler.cpp -->
{% docublock get_admin_log_entries %}
{% docublock get_admin_log %}
{% docublock get_admin_log_level %}
{% docublock put_admin_log_level %}
{% docublock get_admin_log_structured %}
{% docublock put_admin_log_structured %}

Statistics
----------

<!-- js/actions/api-system.js -->
{% docublock get_admin_statistics %}

<!-- js/actions/api-system.js -->
{% docublock get_admin_statistics_description %}

TLS
---

<!-- arangod/RestHandler/RestAdminServerHandler.cpp -->
{% docublock get_admin_server_tls %}
{% docublock post_admin_server_tls %}

Encryption at Rest
------------------

<!-- arangod/RestHandler/RestAdminServerHandler.cpp -->
{% docublock post_admin_server_encryption %}

Cluster
-------

<!-- js/actions/api-system.js -->
{% docublock get_admin_server_mode %}
{% docublock put_admin_server_mode %}
{% docublock get_admin_server_id %}
{% docublock get_admin_server_role %}
{% docublock get_admin_server_availability %}

<!-- js/actions/api-cluster.js -->
{% docublock get_admin_cluster_statistics %}
{% docublock get_admin_cluster_health %}

<!-- arangod/Cluster/AutoRebalance.cpp -->
{% docublock get_admin_cluster_rebalance %}
{% docublock post_admin_cluster_rebalance %}
{% docublock post_admin_cluster_rebalance_execute %}
{% docublock put_admin_cluster_rebalance %}

Other
-----

{% docublock get_admin_support_info %}

<!-- arangod/RocksDBEngine/RocksDBRestHandlers.cpp -->
{% docublock put_admin_compact %}

<!-- js/actions/api-system.js -->
{% docublock post_admin_routing_reload %}
