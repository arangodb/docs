---
layout: default
description: >-
  The cluster-specific endpoints let you get information about individual
  cluster nodes and the cluster as a whole, as well as monitor and administrate
  cluster deployments
redirect_from:
  - endpoints.html # 3.10 -> 3.10
  - cluster-server-id.html # 3.10 -> 3.10
  - cluster-server-role.html # 3.10 -> 3.10
  - cluster-statistics.html # 3.10 -> 3.10
  - cluster-health.html # 3.10 -> 3.10
  - cluster-maintenance.html # 3.10 -> 3.10
---
# HTTP interface for clusters

{{ page.description }}
{:class="lead"}

## Monitoring

{% docublock get_admin_cluster_statistics %}
{% docublock get_admin_cluster_health %}

## Endpoints

{% docublock get_api_cluster_endpoints %}

## Cluster node information

{% docublock get_admin_server_id %}
{% docublock get_admin_server_role %}

## Maintenance

{% docublock put_admin_cluster_maintenance %}
{% docublock get_admin_cluster_maintenance_dbserver %}
{% docublock put_admin_cluster_maintenance_dbserver %}

## Rebalance

{% docublock get_admin_cluster_rebalance %}
{% docublock post_admin_cluster_rebalance %}
{% docublock post_admin_cluster_rebalance_execute %}
{% docublock put_admin_cluster_rebalance %}
