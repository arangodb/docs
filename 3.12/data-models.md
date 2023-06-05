---
layout: default
description: >-
  ArangoDB is a native multi-model database with flexible data models
  for key-values, documents, and graphs
title: ArangoDB Data Models
---
# Data Models

{{ page.description }}
{:class="lead"}

## Key-Value Model

The key-value data model is a subset of ArangoDB's document data model.
Every document has a `_key` attribute that identifies a document within a
collection. This **document key** acts as the primary key to retrieve the data.
You can set it when creating a document, or let the system generate one
automatically. It cannot be changed later because the attribute is immutable.
It is always a string. What you can use as a document key is described in
[User-specified keys](data-modeling-documents.html#document-keys).

ArangoDB is ready to store JSON objects and retrieve them via their keys out of
the box. Every collection has an index on the `_key` attribute (the
**primary index**), which makes this a fast operation by default.

There is an additional virtual attribute `_id`, called the **document identifier**.
It uniquely identifies documents within a database. It is a combination of the
collection name that the document is stored in, a forward slash (`/`), and the
document key, so `<collection>/<key>`. It uses the primary index under the hood
and you can thus use it to look up documents equally fast.

## Document Model

You can store data records as JSON objects in ArangoDB, and not only retrieve
them one by one as they are like in the key-value model, but run queries of all
kinds that access documents granularly and involve multiple documents and
collections.

The stored information is not treated like an opaque block of data but you can
work with documents at the attribute level. You can search by any attributes,
with or without built-in and user-defined (secondary) indexes, return subsets of
attributes or even compute new ones on-the-fly, group records and aggregate
values, and more.

## Graph Model

Graphs are comprised of **vertices** and **edges**. Both are documents in
ArangoDB. Edges have two special attributes, `_from` and `_to`, that reference
the source and target vertices by their document identifiers.

You can store vertices and edges with as many properties as you need, as both
are fully-fledged documents (JSON objects).

You can organize vertices and edges in sets using collections, with vertices in
**document collections** (also referred to as **vertex collections**) and edges
in **edge collections**. This [graph](graphs.html) model makes ArangoDB classify
as a **Labeled Property Graph** store.

The design with edges stored in edge collections enables true graph scalability,
while keeping the promise of performant graph queries regardless of the number
of vertices and edges.

Edges are always **directed** in ArangoDB, which means they point from one
vertex to another. They cannot point both ways. However, you can create multiple
edges between a pair of vertices in both directions. When you **traverse** a
graph - a basic graph query algorithm that starts at a given vertex and then
walks along the connected edges to discover neighboring vertices - you can
specify whether you want to follow edges in the direction they are defined in
(**outbound**), the opposite direction (**inbound**), or regardless of the
direction (**any**). This means that you do not need to create an opposing edge
for every edge that you want to be able to follow in both directions.

Aside from basic graph traversal, ArangoDB offers
[graph algorithms](graphs.html#supported-graph-algorithms) to find one
or multiple shortest paths between two vertices, can return a specified amount
of paths between two vertices in order of increasing length, and supports
distributed graph processing based on the Pregel framework.

You can perform operations directly on the documents of graphs and run graph
traversals using ad-hoc sets of vertex and edge collections. These are called
**anonymous graphs**. However, no graph consistency is enforced. You can create
**named graphs** and use the interfaces for named graphs, which ensure graph
consistency. For example, removing a vertex removes all connected edges, too.
Low-level operations can still cause dangling edges, nonetheless.

<!--
- [Graphs in data modeling - is the emperor naked?](https://medium.com/@neunhoef/graphs-in-data-modeling-is-the-emperor-naked-2e65e2744413#.x0a5z66ji){:target="_blank"}
- [Index Free Adjacency or Hybrid Indexes for Graph Databases](https://www.arangodb.com/2016/04/index-free-adjacency-hybrid-indexes-graph-databases/){:target="_blank"}
-->
