---
fileID: data-science-arango-rdf-adapter
title: ArangoRDF
weight: 925
description: >- 
  ArangoRDF allows you to export graphs from ArangoDB into RDF and vice-versa
layout: default
---
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

- [RDF Primer](https://www.w3.org/TR/rdf11-concepts/)
- [RDFLib (Python)](https://pypi.org/project/rdflib/)
- [Example for Modeling RDF as ArangoDB Graphs](../modeling-data/data-modeling-graphs-from-rdf)

## Resources

Watch this
[lunch & learn session](https://www.arangodb.com/resources/lunch-sessions/graph-beyond-lunch-break-2-11-arangordf/) to get an
introduction on ArangoRDF - an RDF adapter developed with the community
as a first step at bringing RDF graphs into ArangoDB.

The [ArangoRDF repository](https://github.com/ArangoDB-Community/ArangoRDF)
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
[interactive tutorial](https://colab.research.google.com/github/ArangoDB-Community/ArangoRDF/blob/main/examples/ArangoRDF.ipynb).

```py
from arango import ArangoClient
from arango_rdf import ArangoRDF

db = ArangoClient(hosts="http://localhost:8529").db(
    "rdf", username="root", password="openSesame"
)


if db.has_graph("default_graph"):
    db.delete_graph("default_graph", drop_collections=True, ignore_missing=True)





adb_rdf = ArangoRDF(db, sub_graph="http://data.sfgov.org/ontology") 
config = {"normalize_literals": False}  # default: False


adb_rdf.init_rdf_collections(bnode="Blank")


adb_graph = adb_rdf.import_rdf("./examples/data/airport-ontology.owl", format="xml", config=config, save_config=True)


adb_graph = adb_rdf.import_rdf(f"./examples/data/sfo-aircraft-partial.ttl", format="ttl", config=config, save_config=True)







rdf_graph = adb_rdf.export_rdf(f"./examples/data/rdfExport.xml", format="xml")


if db.has_graph("default_graph"):
    db.delete_graph("default_graph", drop_collections=True, ignore_missing=True)



adb_rdf = ArangoRDF(db, sub_graph="http://data.sfgov.org/ontology")

adb_rdf.init_rdf_collections(bnode="Blank")

config = adb_rdf.get_config_by_latest() # gets the last config saved




adb_graph = adb_rdf.import_rdf(f"./examples/data/rdfExport.xml", format="xml", config=config)
```