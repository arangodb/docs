---
fileID: use-cases
title: ArangoDB Use Cases
weight: 10
description: >-
  ArangoDB is a database system with a large solution space because it combines
  graphs, documents, key-value, search engine, and machine learning all in one
layout: default
---
## ArangoDB as a Graph Database

ArangoDB as a graph database is a great fit for use cases like fraud detection,
knowledge graphs, recommendation engines, identity and access management,
network and IT operations, social media management, traffic management, and many
more.

### Fraud Detection

{{< icon src="images/icon-fraud-detection.png" alt="Fraud Detection icon" style="float: right; padding: 0 20px; margin-bottom: 20px;">}}

Uncover illegal activities by discovering difficult-to-detect patterns.
ArangoDB lets you look beyond individual data points in disparate data sources,
allowing you to integrate and harmonize data to analyze activities and
relationships all together, for a broader view of connection patterns, to detect
complex fraudulent behavior such as fraud rings.

### Recommendation Engine


{{< icon src="images/icon-recommendation-engine.png" alt="Recommendation Engine icon" style="float: right; padding: 0 20px; margin-bottom: 20px;">}}

Suggest products, services, and information to users based on data relationships.
For example, you can use ArangoDB together with PyTorch Geometric to build a
[movie recommendation system](https://www.arangodb.com/2022/04/integrate-arangodb-with-pytorch-geometric-to-build-recommendation-systems/),
by analyzing the movies users watched and then predicting links between the two
with a graph neural network (GNN).

### Network Management


{{< icon src="images/icon-network-management.png" alt="Network Management icon" style="float: right; padding: 0 20px; margin-bottom: 20px;">}}

Reduce downtime by connecting and visualizing network, infrastructure, and code.
Network devices and how they interconnect can naturally be modeled as a graph.
Traversal algorithms let you explore the routes between different nodes, with the
option to stop at subnet boundaries or to take things like the connection
bandwidth into account when path-finding.

### Customer 360


{{< icon src="images/icon-customer-360.png" alt="Customer 360 icon" style="float: right; padding: 0 20px; margin-bottom: 20px;">}}

Gain a complete understanding of your customers by integrating multiple data
sources and code. ArangoDB can act as the platform to merge and consolidate
information in any shape, with the added ability to link related records and to
track data origins using graph features.

### Identity and Access Management


{{< icon src="images/icon-identity-management.png" alt="Identity Management icon" style="float: right; padding: 0 20px; margin-bottom: 20px;">}}

Increase security and compliance by managing data access based on role and
position. You can map out an organization chart as a graph and use ArangoDB to
determine who is authorized to see which information. Put ArangoDB's graph
capabilities to work to implement access control lists and permission
inheritance.

### Supply Chain


{{< icon src="images/icon-supply-chain.png" alt="Supply Chain icon" style="float: right; padding: 0 20px; margin-bottom: 20px;">}}

Speed shipments by monitoring and optimizing the flow of goods through a
supply chain. You can represent your inventory, supplier, and delivery
information as a graph to understand what the possible sources of delays and
disruptions are.

## ArangoDB as a Document Database


ArangoDB can be used as the backend for heterogeneous content management,
e-commerce systems, Internet of Things applications, and more generally as a
persistence layer for a broad range of services that benefit from an agile
and scalable data store.

### Content Management


{{< icon src="images/icon-content-management.png" alt="Content management icon" style="float: right; padding: 0 20px; margin-bottom: 20px;">}}

Store information of any kind without upfront schema declaration. ArangoDB is
schema-free, storing every data record as a self-contained document, allowing
you to manage heterogeneous content with ease. Build the next (headless)
content management system on top of ArangoDB.

### E-Commerce Systems


{{< icon src="images/icon-e-commerce.png" alt="E-commerce icon" style="float: right; padding: 0 20px; margin-bottom: 20px;">}}

ArangoDB combines data modeling freedom with strong consistency and resilience
features to power online shops and ordering systems. Handle product catalog data
with ease using any combination of free text and structured data, and process
checkouts with the necessary transactional guarantees.

### Internet of Things


{{< icon src="images/icon-internet-of-things.png" alt="Internet of things icon" style="float: right; padding: 0 20px; margin-bottom: 20px;">}}

Collect sensor readings and other IoT data in ArangoDB for a single view of
everything. Store all data points in the same system that also lets you run
aggregation queries using sliding windows for efficient data analysis.

## ArangoDB as a Key-Value Database


{{< icon src="images/icon-key-value.png" alt="Key value icon" style="float: right; padding: 0 20px; margin-bottom: 20px;">}}

Key-value stores are the simplest kind of database systems. Each record is
stored as a block of data under a key that uniquely identifies the record.
The data is opaque, which means the system doesn't know anything about the
contained information, it simply stores it and can retrieve it for you via
the identifiers.

This paradigm is used at the heart of ArangoDB and allows it to scale well,
but without the limitations of a pure key-value store. Every document has a
`_key` attribute, which is either user-provided or automatically generated.
You can create additional indexes and work with subsets of attributes as
needed, requiring the system to be aware of the stored data structures - unlike
pure key-value stores.

While ArangoDB can store binary data, it is not designed for
binary large objects (BLOBs) and works best with small to medium-sized
JSON objects.

For more information about how ArangoDB persists data, see
[Storage Engine](../architecture/architecture-storage-engines).

## ArangoDB as a Search Engine


{{< icon src="images/icon-search-engine.png" alt="Search engine icon" style="float: right; padding: 0 20px; margin-bottom: 20px;">}}

ArangoDB has a natively integrated search engine for a broad range of
information retrieval needs. It is powered by inverted indexes and can index
full-text, GeoJSON, as well as arbitrary JSON data. It supports various
kinds of search patterns (tokens, phrases, wildcard, fuzzy, geo-spatial, etc.)
and it can rank results by relevance and similarity using popular
scoring algorithms.

It also features natural language processing (NLP) capabilities.
{{% comment %}} Experimental feature
and can classify or find similar terms using word embedding models.
{{% /comment %}}

For more information about the search engine, see [ArangoSearch](../indexing/arangosearch/).

## ArangoDB for Machine Learning


You can use ArangoDB as the foundation for machine learning based on graphs
at enterprise scale. You can use it as a metadata store for model training
parameters, run analytical algorithms in the database, or serve operative
queries using data that you computed.

ArangoDB integrates well into existing data infrastructures and provides
connectors for popular machine learning frameworks and data processing
ecosystems.

![Machine Learning Architecture of ArangoDB](images/machine-learning-architecture.png)
