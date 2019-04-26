---
layout: default
description: This is an introduction to ArangoDB's HTTP interface for administration andmonitoring of the server
---
HTTP Interface for Administration and Monitoring
================================================

This is an introduction to ArangoDB's HTTP interface for administration and
monitoring of the server.

<!-- lib/Admin/RestAdminLogHandler.cpp -->
{% docublock JSF_get_admin_log %}
{% docublock JSF_get_admin_loglevel %}
{% docublock JSF_put_admin_loglevel %}


<!-- js/actions/api-system.js -->
{% docublock JSF_get_admin_routing_reloads %}


<!-- js/actions/api-system.js -->
{% docublock JSF_get_admin_statistics %}


<!-- js/actions/api-system.js -->
{% docublock JSF_get_admin_statistics_description %}


<!-- js/actions/api-system.js -->
{% docublock JSF_get_admin_server_role %}

<!-- js/actions/api-system.js -->
{% docublock JSF_get_admin_server_id %}
{% docublock get_admin_server_availability %}

## Cluster

<!-- js/actions/api-cluster.js -->
{% docublock JSF_cluster_statistics_GET %}
{% docublock get_cluster_health %}
