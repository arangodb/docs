---
layout: default
description: >- 
  ArangoRDF allows you to export graphs from ArangoDB into RDF and vice-versa
---
# ArangoRDF

{{ page.description }}
{:class="lead"}

RDF is a standard model for data interchange on the Web. RDF has features that
facilitate data merging even if the underlying schemas differ, and it
specifically supports the evolution of schemas over time without requiring all
the data consumers to be changed.

RDF extends the linking structure of the Web to use URIs to name the relationship
between things as well as the two ends of the link (this is usually referred to
as a "triple"). Using this simple model, it allows structured and semi-structured
data to be mixed, exposed, and shared across different applications.

This linking structure forms a directed, labeled graph, where the edges represent
the named link between two resources, represented by the graph nodes. This graph
view is the easiest possible mental model for RDF and is often used in
easy-to-understand visual explanations.

Check the resources below to get started:

- [RDF Primer](https://www.w3.org/TR/rdf11-concepts/){:target="_blank"}
- [RDFLib (Python)](https://pypi.org/project/rdflib/){:target="_blank"}
- [Example for Modeling RDF as ArangoDB Graphs](data-modeling-graphs-from-rdf.html)

## Resources

Watch this
[lunch & learn session](https://www.arangodb.com/resources/lunch-sessions/graph-beyond-lunch-break-2-11-arangordf/){:target="_blank"} to get an
introduction on ArangoRDF - an RDF adapter developed with the community
as a first step at bringing RDF graphs into ArangoDB.
- Note: Since the recording of this session, ArangoRDF has been overhauled and extended. Package usage has changed, so please refer to the [Quickstart](#quickstart) section below for the latest specification.

The [ArangoRDF repository](https://github.com/ArangoDB-Community/ArangoRDF){:target="_blank"}
is available on Github. Check it out!

## Installation

To install the latest release of ArangoRDF,
run the following command:

```bash
pip install arango-rdf
```

## Quickstart

The following example shows how to get started with ArangoRDF.
Check also the 
[interactive tutorial](https://colab.research.google.com/github/ArangoDB-Community/ArangoRDF/blob/main/examples/ArangoRDF.ipynb){:target="_blank"}.

```py
from rdflib import Graph
from arango import ArangoClient
from arango_rdf import ArangoRDF

db = ArangoClient(hosts="http://localhost:8529").db("_system_", username="root", password="")

adbrdf = ArangoRDF(db)

g = Graph()
g.parse("https://raw.githubusercontent.com/stardog-union/stardog-tutorials/master/music/beatles.ttl")

###################
# RDF to ArangoDB #
###################

# 1.1: RDF-Topology Preserving Transformation (RPT)
adbrdf.rdf_to_arangodb_by_rpt("Beatles", g, overwrite_graph=True)

# 1.2: Property Graph Transformation (PGT) 
adbrdf.rdf_to_arangodb_by_pgt("Beatles", g, overwrite_graph=True)

g = adbrdf.load_meta_ontology(g)

# 1.3: RPT w/ Graph Contextualization
adbrdf.rdf_to_arangodb_by_rpt("Beatles", g, contextualize_graph=True, overwrite_graph=True)

# 1.4: PGT w/ Graph Contextualization
adbrdf.rdf_to_arangodb_by_pgt("Beatles", g, contextualize_graph=True, overwrite_graph=True)

# 1.5: PGT w/ ArangoDB Document-to-Collection Mapping Exposed
adb_mapping = adbrdf.build_adb_mapping_for_pgt(g)
print(adb_mapping.serialize())
adbrdf.rdf_to_arangodb_by_pgt("Beatles", g, adb_mapping, contextualize_graph=True, overwrite_graph=True)

###################
# ArangoDB to RDF #
###################

# Start from scratch!
g = Graph()
g.parse("https://raw.githubusercontent.com/stardog-union/stardog-tutorials/master/music/beatles.ttl")
adbrdf.rdf_to_arangodb_by_pgt("Beatles", g, overwrite_graph=True)

# 2.1: Via Graph Name
g2, adb_mapping_2 = adbrdf.arangodb_graph_to_rdf("Beatles", Graph())

# 2.2: Via Collection Names
g3, adb_mapping_3 = adbrdf.arangodb_collections_to_rdf(
    "Beatles",
    Graph(),
    v_cols={"Album", "Band", "Class", "Property", "SoloArtist", "Song"},
    e_cols={"artist", "member", "track", "type", "writer"},
)

print(len(g2), len(adb_mapping_2))
print(len(g3), len(adb_mapping_3))

print('--------------------')
print(g2.serialize())
print('--------------------')
print(adb_mapping_2.serialize())
print('--------------------')
```