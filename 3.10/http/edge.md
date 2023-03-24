---
layout: default
description: >-
  The Edge API lets you retrieve the connected edges of a single vertex,
  optionally restricted to incoming or outgoing edges
redirect_from:
  - edge-address-and-etag.html # 3.10 -> 3.10
  - edge-working-with-edges.html # 3.10 -> 3.10
---
# HTTP interface for edges

{{ page.description }}
{:class="lead"}

Edges are documents with two additional system attributes that you set, a
`_from` and a `_to` attribute. Edges need to be stored in edge collections and
form [graphs](../graphs.html) together with documents stored in document
collections, which are then referred to as vertices.

You can use the general [Document API](document.html) to create,
read, modify, and delete edge documents. The only difference to working with
vertex documents is that the `_from` and `_to` attributes are mandatory and
must contain document identifiers.

The Edge API is useful if you want to look up the inbound and outbound edges of
a vertex with low overhead. You can also retrieve edges with AQL queries, but
queries need to be parsed and planned, and thus have an overhead. On the other
hand, AQL is far more powerful, letting you perform graph traversals, for
instance.

## Edge API

### Addresses of edges

Edges are a special variation of documents and you can access them like any
document. See [Addresses of documents](document.html#addresses-of-documents)
for details.

### Manage edges

{% docublock get_api_edges_collection, h4 %}
