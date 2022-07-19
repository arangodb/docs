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
from arango import ArangoClient
from arango_rdf import ArangoRDF

db = ArangoClient(hosts="http://localhost:8529").db(
    "rdf", username="root", password="openSesame"
)

# Clean up existing data and collections
if db.has_graph("default_graph"):
    db.delete_graph("default_graph", drop_collections=True, ignore_missing=True)

# Initializes default_graph and sets RDF graph identifier (ArangoDB sub_graph)
# Optional: sub_graph (stores graph name as the 'graph' attribute on all edges in Statement collection)
# Optional: default_graph (name of ArangoDB Named Graph, defaults to 'default_graph',
#           is root graph that contains all collections/relations)
adb_rdf = ArangoRDF(db, sub_graph="http://data.sfgov.org/ontology") 
config = {"normalize_literals": False}  # default: False

# RDF Import
adb_rdf.init_rdf_collections(bnode="Blank")

# Start with importing the ontology
adb_rdf.import_rdf("./examples/data/airport-ontology.owl", format="xml", config=config, save_config=True)

# Next, let's import the actual graph data
adb_rdf.import_rdf(f"./examples/data/sfo-aircraft-partial.ttl", format="ttl", config=config, save_config=True)


# RDF Export
# WARNING:
# Exports ALL collections of the database,
# currently does not account for default_graph or sub_graph
# Results may vary, minifying may occur
adb_rdf.export(f"./examples/data/rdfExport.xml", format="xml")

# Drop graph and ALL documents and collections to test import from exported data
if db.has_graph("default_graph"):
    db.delete_graph("default_graph", drop_collections=True, ignore_missing=True)

# Re-initialize our RDF Graph
# Initializes default_graph and sets RDF graph identifier (ArangoDB sub_graph)
adb_rdf = ArangoRDF(db, sub_graph="http://data.sfgov.org/ontology")

adb_rdf.init_rdf_collections(bnode="Blank")

config = adb_rdf.get_config_by_latest() # gets the last config saved
# config = adb_rdf.get_config_by_key_value('graph', 'music')
# config = adb_rdf.get_config_by_key_value('AnyKeySuppliedInConfig', 'SomeValue')

# Re-import Exported data
adb_rdf.import_rdf(f"./examples/data/rdfExport.xml", format="xml", config=config)
```