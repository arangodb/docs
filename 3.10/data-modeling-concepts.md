---
layout: default
description: ArangoDB is a database that serves documents to clients
title: ArangoDB Data Model & Concepts
redirect_from:
  - data-modeling-graphs-vertices-edges.html # 3.9 -> 3.10
---
# Data Model & Concepts

This chapter introduces ArangoDB's core concepts and covers

- its data model (or data models respectively),
- the terminology used throughout the database system and in this
  documentation

You will also find usage examples on how to interact with the database system
using [arangosh](programs-arangosh.html), e.g. how to create and
drop databases / collections, or how to save, update, replace and remove
documents. You can do all this using the [web interface](getting-started-web-interface.html)
as well and may therefore skip these sections as beginner.

## Documents

ArangoDB lets you store documents as JSON objects.

```json
{
  "name": "ArangoDB",
  "tags": ["graph", "database", "NoSQL"],
  "openSource": true,
  "company": {
    "name": "ArangoDB Inc.",
    "founded": 2015
  }
}
```

JSON supports the following data types:

- `null` to represent the absence of a value, also known as _nil_ or _none_ type.
- `true` and `false`, the Boolean values, to represent _yes_ and
  _no_, _on_ and _off_, etc.
- **numbers** to store integer and floating-point values.
- **strings** to store character sequences for text, encoded as UTF-8.
- **arrays** to store lists that can contain any of the supported data types
  as elements, including nested arrays.
- **objects** to map keys to values like a dictionary, also known as
  associative arrays or hash maps. The keys are strings and the values can be
  any of the supported data types, including nested objects.

Each record that you store is a JSON object at the top-level, also referred to
as [**document**](data-modeling-documents-document-address.html).
Each key-value pair is called an **attribute**, comprised
of the attribute name and the attribute value. Attributes can also be called
properties or fields. You can freely model your data
using the available data types. Each document is self-contained and can thus
have a unique structure. You do not need to define a schema upfront.
However, sets of documents will typically have some common attributes. If you
want to enforce a specific structure, then you can do so with schema validation.

<!-- Joins? Indexes? Link for more information? -->

<!--
The documents you can store in ArangoDB closely follow the JSON format,
although they are stored in a binary format called [VelocyPack](https://github.com/arangodb/velocypack#readme){:target="_blank"}.
A **document** contains zero or more attributes, each of these attributes having
a value. A value can either be an atomic type, i. e. number, string, boolean
or null, or a compound type, i.e. an array or embedded document / object.
Arrays and sub-objects can contain all of these types, which means that
arbitrarily nested data structures can be represented in a single document.
-->

## Collections

Documents are stored in [**collections**](data-modeling-collections.html),
similar to how files are stored in folders.
You can group related documents together using collections, such as by
entity type (every _book_ document in a `books` collections, for instance).

<!--
Documents are grouped into **collections**. A collection contains zero or more
documents. If you are familiar with relational database management systems (RDBMS)
then it is safe to compare collections to tables and documents to rows. The
difference is that in a traditional RDBMS, you have to define columns before
you can store records in a table. Such definitions are also known as schemas.
ArangoDB is by default schema-less, which means that there is no need to define what
attributes a document can have. Every single document can have a completely
different structure and still be stored together with other documents in a
single collection. In practice, there will be common denominators among the
documents in a collection, but the database system itself doesn't force you to
limit yourself to a certain data structure. To check for and/or enforce a
common structure ArangoDB supports optional
[**schema validation** for documents](data-modeling-documents-schema-validation.html)
on collection level.
-->

## Databases

Each collection is part of a [**database**](data-modeling-databases.html).
Databases allow you to isolate sets of collections from one another, usually for
multi-tenant applications, where each of your clients has their own database to
work with.

<!--
Collections exist inside of **databases**. There can be one or many databases.
Different databases are usually used for multi-tenant setups, as the data inside
them (collections, documents etc.) is isolated from one another. The default
database `_system` is special, because it cannot be removed. Database users
are managed in this database, and their credentials are valid for all databases
of a server instance.
-->

## Graphs, Vertices, and Edges

You can store vertices and edges with as many properties as you need, as both
are fully-fledged documents (JSON objects).

Edges have two special attributes, `_from` and `_to`, that reference the source
and target vertices of the edge by their document identifiers.

You can organize vertices and edges in sets using
collections, with vertices in **document collections** and edges in
**edge collections**. This [graph](graphs.html) model makes ArangoDB classify as
a **Labeled Property Graph** store.

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

<!--
- [Graphs in data modeling - is the emperor naked?](https://medium.com/@neunhoef/graphs-in-data-modeling-is-the-emperor-naked-2e65e2744413#.x0a5z66ji){:target="_blank"}
- [Index Free Adjacency or Hybrid Indexes for Graph Databases](https://www.arangodb.com/2016/04/index-free-adjacency-hybrid-indexes-graph-databases/){:target="_blank"}

There are two types of collections: **document collection** (also referred to as
**vertex collections** in the context of graphs) as well as **edge collections**.
Edge collections store documents as well, but they include two special attributes,
`_from` and `_to`, which are used to create relations between documents.
Usually, two documents (**vertices**) stored in document collections are linked
by a document (**edge**) stored in an edge collection. This is ArangoDB's graph
data model. It follows the mathematical concept of a directed, labeled graph,
except that edges don't just have labels, but are full-blown documents.
-->

<!--
## Views

Similarly **databases** may also contain **view** entities. A
[View](data-modeling-views.html) in its simplest form can be seen as a read-only
array or collection of documents. The view concept quite closely matches a
similarly named concept available in most relational database management systems
(RDBMS). Each view entity usually maps some implementation specific document
transformation, (possibly identity), onto documents from zero or more
collections.
-->
