---
layout: default
title: What is ArangoDB
description: ArangoDB is a scalable database management system for graphs, with a broad range of features and a rich ecosystem
menuTitle: Introduction
weight: 1
tags: ["test1"]
fileID: "introduction-index"
---

{{< img src="images/arangodb-overview-diagram.png" alt="ArangoDB Overview Diagram" size="medium" >}}

It supports a variety of data access patterns with a single, composable query
language thanks to its multi-model approach that combines the analytical power
of graphs with JSON documents, a key-value store, and a built-in search engine.


## Page References Test
To reference other files in the site, use the reference shortcode.

The page' front matter "fileID" variable is used to match the page and get the link to reference, so the file can be moved anywhere it will always
be found as long as the fileID is referenced well.

Check out the {{< reference fileID="smartgraphs-intro" label="SmartGraphs" >}}. 

## What are Graphs?

Graphs are information networks comprised of nodes and relations. {{< marker id="graph-1" >}}

A social network is a common example of a graph. People are represented by nodes
and their friendships by relations.

Nodes are also called vertices (singular: vertex), and relations are edges that
connect vertices.
A vertex typically represents a specific entity (a person, a book, a sensor
reading, etc.) and an edge defines how one entity relates to another.

This paradigm of storing data feels natural because it closely matches the
cognitive model of humans. It is an expressive data model that allows you to
represent many problem domains and solve them with semantic queries and graph
analytics.

## Beyond Graphs

Not everything is a graph use case. ArangoDB lets you equally work with
structured, semi-structured, and unstructured data in the form of schema-free
JSON objects, without having to connect these objects to form a graph.

<!-- TODO:
Seems too disconnected, what is the relation?
Maybe multiple docs, maybe also include folders (collections)?
-->

Depending on your needs, you may mix graphs and unconnected data.
ArangoDB is designed from the ground up to support multiple data models with a
single, composable query language.

```aql
FOR book IN Books
  FILTER book.title == "ArangoDB"
  FOR person IN 2..2 INBOUND book Sales, OUTBOUND People  //Comment
    RETURN person.name    // cCC
```

ArangoDB also comes with an integrated search engine for information retrieval,
such as full-text search with relevance ranking.

ArangoDB is written in C++ for high performance and built to work at scale, in
the cloud or on-premise.

<!-- deployment options, move from features page, on-prem vs cloud? -->

{{% annotation id="graph-1" %}}
This is an inline annotation explaining graphs, they are wonderful and bidibi bodibi bu
yeah yeah yeah
yeah
{{% /annotation %}}
