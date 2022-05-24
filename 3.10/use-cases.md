---
layout: default
description: >-
  ArangoDB is a database system with a large solution space because it combines
  graphs, documents, key-value, search engine, and machine learning all in one
---
# ArangoDB Use Cases

{{ page.description }}
{:class="lead"}

## ArangoDB as a Graph Database

ArangoDB as a graph database is a great fit for use cases like fraud detection,
knowledge graphs, recommendation engines, identity and access management,
network and IT operations, social media management, traffic management, and many
more.

<!-- TODO: detailed use case descriptions + illustrations -->

- **Fraud Detection**:
  Uncover illegal activities by discovering difficult-to-detect patterns
- **Recommendation Engine**:
  Suggest products, services, and information to users based on data relationships
- **Network Management**:
  Reduce downtime by connecting and visualizing network, infrastructure, and code
- **Customer 360**:
  Gain a complete understanding of your customers by integrating multiple data
  sources and code
-**Identity Management**:
  Increase security and compliance by managing data access based on role and
  position
- **Supply Chain**:
  Speed shipments by monitoring and optimizing the flow of goods through a
  supply chain

## ArangoDB as a Document Database

ArangoDB can be used as the backend for heterogeneous content management,
e-commerce systems, Internet of Things applications, and more generally as a
persistence layer for a broad range of services 

<!-- TODO: detailed use case descriptions + illustrations? -->

## ArangoDB as a Key-Value Database

Key-value stores are the simplest kind of database systems. Each record is
stored as a block of data under a key that uniquely identifies the record.
The data is opaque, which means the system doesn't know anything about the
contained information, it simply stores it and can retrieve it for you via
the identifiers.

This paradigm is used at the heart of ArangoDB and allows it to scale well,
but without the limitations of a pure key-value store. Every document has a
`_key` attribute, which is either user-provided or automatically generated.
You can create additional indexes and work with subsets of attributes as
needed, requiring the system to be aware of the stored data structures.

While ArangoDB can store binary data, it is not designed for
binary large objects (BLOBs) and works best with small to medium-sized
JSON objects.

For more information about how ArangoDB persists data, see
[Storage Engine](architecture-storage-engines.html).

## ArangoDB as a Search Engine

ArangoDB has a natively integrated search engine for a broad range of
information retrieval needs. It is powered by inverted indexes and can index
full-text, GeoJSON, as well as arbitrary JSON data. It supports various
kinds of search patterns (tokens, phrases, wildcard, fuzzy, geo-spatial, etc.)
and it can rank results by relevance and similarity using popular
scoring algorithms.

It also features natural language processing (NLP) capabilities and can
classify or find similar terms using word embedding models.

For more information about the search engine, see [ArangoSearch](arangosearch.html).

## ArangoDB for Machine Learning

You can use ArangoDB as the foundation for machine learning based on graphs
at enterprise scale. You can use it as a metadata store for model training
parameters, run analytical algorithms in the database, or serve operative
queries using data that you computed.

ArangoDB integrates well into existing data infrastructures and provides
connectors for popular machine learning frameworks and data processing
ecosystems.

![Machine Learning Architecture of ArangoDB](images/machine-learning-architecture.png)
