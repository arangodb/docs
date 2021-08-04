---
layout: default
description: ArangoDB v3.9 Release Notes API Changes
---
API Changes in ArangoDB 3.9
===========================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.9.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.9.

## HTTP RESTful API

### GRAPH API (Gharial)

The following changes affect the behavior of the RESTful collection APIs at
endpoints starting with path `/_api/gharial/`:

The options object now supports a new field: `satellites`, when creating a graph (POST).
The value of satellites is optional. In case it is defined, it needs to be an array
of collection names. Each defined collection name must be a string. This value is
only valid in case of SmartGraphs (Enterprise-Only). In a community based graph it
will be ignored.

Using `satellites` during SmartGraph creation will result in a Hybrid Smart Graph.
Using `satellites` during Disjoint SmartGraph creation will result in a Hybrid
Disjoint SmartGraph.

Hybrid (Disjoint) SmartGraphs are capable of having Satellite collections in their
graph definitions. If a collection is found in `satellites` and they are also being
used in the graph definition itself (e.g. EdgeDefinition), this collection will be
created as a satellite collection. Hybrid (Disjoint) Smart Graphs are then capable
of executing all type of graph queries between the regular SmartCollections and
Satellite collections.

The following changes affect the behavior of the RESTful collection APIs at
endpoints starting with path `/_api/gharial/{graph}/edge`:
