---
layout: default
description: This chapter describes the javascript interface for creating and modifying named graphs
---
Graph Management
================

This chapter describes the javascript interface for [creating and modifying named graphs](graphs.html).
In order to create a non empty graph the functionality to create edge definitions has to be introduced first:

Edge Definitions
----------------

An edge definition is always a directed relation of a graph. Each graph can have arbitrary many relations defined within the edge definitions array.

### Initialize the list
{% docublock JSF_general_graph_edge_definitions %}

### Extend the list
{% docublock JSF_general_graph_extend_edge_definitions %}

#### Relation
{% docublock JSF_general_graph_relation %}


#### Undirected Relation

**Warning: Deprecated**

This function is deprecated and will be removed soon.
Please use [Relation](general-graphs-management.html#relation) instead.
{% docublock JSF_general_graph_undirectedRelation %}

#### Directed Relation

**Warning: Deprecated**

This function is deprecated and will be removed soon.
Please use [Relation](general-graphs-management.html#relation) instead.
{% docublock JSF_general_graph_directedRelation %}

Create a graph
--------------

After having introduced edge definitions a graph can be created.
{% docublock JSF_general_graph_create %}

#### Complete Example to create a graph

Example Call:
{% docublock JSF_general_graph_create_graph_example1 %}

alternative call:
{% docublock JSF_general_graph_create_graph_example2 %}

### List available graphs
{% docublock JSF_general_graph_list %}

### Load a graph
{% docublock JSF_general_graph_graph %}

### Remove a graph
{% docublock JSF_general_graph_drop %}

Modify a graph definition during runtime
----------------------------------------

After you have created an graph its definition is not immutable.
You can still add, delete or modify edge definitions and vertex collections.

### Extend the edge definitions
{% docublock JSF_general_graph__extendEdgeDefinitions %}

### Modify an edge definition
{% docublock JSF_general_graph__editEdgeDefinition %}

### Delete an edge definition
{% docublock JSF_general_graph__deleteEdgeDefinition %}

### Extend vertex Collections

Each graph can have an arbitrary amount of vertex collections, which are not part of any edge definition of the graph.
These collections are called orphan collections.
If the graph is extended with an edge definition using one of the orphans,
it will be removed from the set of orphan collection automatically.

#### Add a vertex collection
{% docublock JSF_general_graph__addVertexCollection %}

#### Get the orphaned collections
{% docublock JSF_general_graph__orphanCollections %}

#### Remove a vertex collection
{% docublock JSF_general_graph__removeVertexCollection %}


Maniuplating Vertices
---------------------

### Save a vertex
{% docublock JSF_general_graph_vertex_collection_save %}

### Replace a vertex
{% docublock JSF_general_graph_vertex_collection_replace %}

### Update a vertex
{% docublock JSF_general_graph_vertex_collection_update %}

### Remove a vertex
{% docublock JSF_general_graph_vertex_collection_remove %}

Manipulating Edges
------------------

### Save a new edge
{% docublock JSF_general_graph_edge_collection_save %}

### Replace an edge
{% docublock JSF_general_graph_edge_collection_replace %}

### Update an edge
{% docublock JSF_general_graph_edge_collection_update %}

### Remove an edge
{% docublock JSF_general_graph_edge_collection_remove %}

### Connect edges
{% docublock JSF_general_graph_connectingEdges %}
