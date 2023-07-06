---
layout: default
description: >-
  The HTTP API for named graphs lets you manage General Graphs, SmartGraphs,
  EnterpriseGraphs, and SatelliteGraphs
redirect_from:
  - gharial-management.html # 3.10 -> 3.10
  - gharial-edges.html # 3.10 -> 3.10
  - gharial-vertices.html # 3.10 -> 3.10
---
# HTTP interface for named graphs

The HTTP API for [named graphs](../graphs.html#named-graphs) is called _Gharial_.

You can manage all types of ArangoDB's named graphs with Gharial:
- [General Graphs](../graphs-general-graphs.html)
- [SmartGraphs](../graphs-smart-graphs.html)
- [EnterpriseGraphs](../graphs-enterprise-graphs.html)
- [SatelliteGraphs](../graphs-satellite-graphs.html)

The examples use the following example graphs:

[_Social Graph_](../graphs-traversals-example-data.html#social-graph):

![Social Example Graph](../images/social_graph.png)

[_Knows Graph_](../graphs-traversals-example-data.html#knows-graph):

![Social Example Graph](../images/knows_graph.png)

## Management

{% docublock get_api_gharial %}
{% docublock post_api_gharial %}
{% docublock get_api_gharial_graph %}
{% docublock delete_api_gharial_graph %}
{% docublock get_api_gharial_graph_vertex %}
{% docublock post_api_gharial_graph_vertex %}
{% docublock delete_api_gharial_graph_vertex_collection %}
{% docublock get_api_gharial_graph_edge %}
{% docublock post_api_gharial_graph_edge %}
{% docublock put_api_gharial_graph_edge_definition %}
{% docublock delete_api_gharial_graph_edge_definition %}

## Vertices

{% docublock post_api_gharial_graph_vertex_collection %}
{% docublock get_api_gharial_graph_vertex_collection_vertex %}
{% docublock patch_api_gharial_graph_vertex_collection_vertex %}
{% docublock put_api_gharial_graph_vertex_collection_vertex %}
{% docublock delete_api_gharial_graph_vertex_collection_vertex %}

## Edges

{% docublock post_api_gharial_graph_edge_collection %}
{% docublock get_api_gharial_graph_edge_collection_edge %}
{% docublock patch_api_gharial_graph_edge_collection_edge %}
{% docublock put_api_gharial_graph_edge_collection_edge %}
{% docublock delete_api_gharial_graph_edge_collection_edge %}
