---
default: layout
description: >-
  Graphs let you represent objects and the relationships between them using
  vertices and edges, to naturally model things like knowledge, social networks,
  supply chains, and information flows, and to extract valuable insights by
  analyzing this connected data
---
# Graphs

{{ page.description }}
{:class="lead"}

nodes, relations
vertices, edges
use cases with rough data model
comparison with RDBMS
topologies
information extraction (high-level)

## Graph features in ArangoDB

labeled property graph?
properties on vertices and edges
native graph that can be combined
graph algorithms

## Model data with graphs

embedded vs. joins vs. graphs
multiple edge colls or FILTER on type
example graphs?

acl/rbac
dependencies
product hierarchies
...

## Query graphs

traversal, pattern matching, shortest paths, pregel
direction, depth, order, conditions, weights?
combine with geo, search, ...

## Manage graphs

types (anonymous, managed)
APIs

## Scale and operate graphs ?

EE features
backup and restore
