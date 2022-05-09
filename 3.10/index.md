---
layout: default
description: >-
  ArangoDB is a scalable graph database system with native support for other
  data models and a built-in search engine
title: Introduction to ArangoDB's Technical Documentation and Ecosystem
redirect_from:
  - cookbook/index.html # 3.5 -> 3.5
  - cookbook/use-cases.html # 3.5 -> 3.5
---
# What is ArangoDB?

ArangoDB is an open-source database management system for graphs.
Graphs are information networks comprised of nodes and relations.

![Node - Relation - Node](images/data-model-graph-relation-abstract.png)

A social network is a common example of a graph. People are represented by nodes
and their friendships by relations.

![Mary - is friend of - John](images/data-model-graph-relation-concrete.png)

Nodes are also called vertices, and relations are edges that connect vertices.
A vertex typically represents a specific entity (a person, a book, a sensor
reading etc.) and an edge defines how one entity relates to another.

![Mary - bought - Book, is friend of - John](images/data-model-graph-relations.png)

This paradigm of storing data feels natural because it closely matches the
cognitive model of humans. It is an expressive data model that allows you to
represent many problem domains and solve them with semantic queries and graph
analytics.

Not everything is a graph use case, however. ArangoDB qualifies as a multi-model
database system that lets you equally work with (semi-)structured data in the
form of schema-free JSON objects without connecting these objects to form a graph.

![Person Mary, Book ArangoDB](images/data-model-document.png)

It is designed from the ground up to support multiple data models with a single,
composable query language.

```js
FOR book IN Books
  FILTER book.title == "ArangoDB"
  FOR person IN 2..2 INBOUND book Sales, OUTBOUND People
    RETURN person.name
```

ArangoDB also comes with an integrated search engine for information retrieval,
such as full-text search with relevance ranking.

ArangoDB is written in C++ for high performance and built to work at scale, in
the cloud or on-premise.

<!-- deployment options, move from features page, on-prem vs cloud? -->
