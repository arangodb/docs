---
fileID: tutorials
title: Tutorials
weight: 160
description: 
layout: default
---
## General

- [Getting started](getting-started.html):
  A beginner's guide to ArangoDB.

- [ArangoDB Web Interface](https://www.arangodb.com/learn/first-day/web-ui/):
  Overview over the built-in web interface.

- [Using the Web Interface AQL Editor](https://www.arangodb.com/2018/02/using-webui-aql-editor/):
  Basic introduction to the query editor of the web interface.

- Index types and how indexes are used in ArangoDB:
  - [Part I](https://www.arangodb.com/2018/02/indexes-types-arangodb-part-1/):
    Index types
  - [Part II](https://www.arangodb.com/2018/03/index-types-indexes-used-arangodb-part-2/):
    How to create indexes

- [ArangoSearch](https://www.arangodb.com/learn/search/):
  Implementation details and hands-on tutorial about ArangoDB's full-text search engine.

- [Data Masking](https://www.arangodb.com/learn/development/data-masking-tutorial/):
  Anonymizing Production Data Securely For Testing & Development Environments

## Data modeling

- [How to model customer surveys in a graph database](https://www.arangodb.com/2016/11/realize-surveys-graph-database/):
  A question and answer game based on decision trees.

- [Data Modeling and Operational Factors](../modeling-data/data-modeling-operational-factors):
  Learn about what design decisions are crucial for application performance.

- [Time traveling with graph databases](https://www.arangodb.com/2018/07/time-traveling-with-graph-databases/):
  Concepts for a revision history of graph data. Also see the
  [simplified tutorial](https://www.arangodb.com/learn/graphs/time-traveling-graph-databases/).

## Queries

- [Data Queries](../aql/data-queries):
  A primer on AQL data access and modification queries.

- [AQL Query Patterns and Examples](../aql/examples-query-patterns/):
  Subqueries, joins, dynamic attribute names and more.

- [CRUD](https://www.arangodb.com/tutorials/arangodb-crud/):
  Document CRUD (Create, Read, Update, Delete) with AQL and HTTP API

- [Geo Queries](https://www.arangodb.com/using-arangodb-geo-index-cursor-via-aql/):
  How to use the ArangoDB Geo Index Cursor via AQL

- [GeoJSON tutorial](https://www.arangodb.com/learn/documents/geojson-tutorial/):
  Indexing and querying GeoJSON data.

- [AQL Query Optimization with Query Profiling](https://www.arangodb.com/learn/development/aql-query-optimization-with-profiler/):
  Examination of query performance by example and common performance pitfalls.

- [Performance Course](https://www.arangodb.com/arangodb-performance-course/):
  Performance Optimization Basics: How to make your queries faster

- SmartJoins:
  - [Introduction](https://www.arangodb.com/enterprise-server/smartjoins/):
    Making distributed join operations local.
  - [Tutorial](https://www.arangodb.com/learn/documents/smart-joins-tutorial/):
    Boosting cluster join query performance.

- [SQL / AQL - Comparison](https://www.arangodb.com/community-server/sql-aql-comparison/):
  Differences and similarities between ArangoDB Query Language (AQL) and
  Structured Query Language (SQL).

- [Comparing ArangoDB AQL to Neo4j Cypher](https://www.arangodb.com/comparing-arangodb-aql-neo4j-cypher/):
  Language models, database concepts and queries.

- [ArangoDB vs MongoDB](https://www.arangodb.com/tutorials/mongodb-to-arangodb-tutorial/):
  Comparison between performing queries in both systems.

## Graphs

- [Graph Course](https://www.arangodb.com/arangodb-graph-course/):
  Get started with ArangoDB's graph related features

- [Pattern Matching](https://www.arangodb.com/learn/graphs/pattern-matching/):
  Find the best flights between two airports with the lowest total travel time.

- [k Shortest Paths Queries in AQL](https://www.arangodb.com/learn/graphs/k-shortest-paths-queries-in-aql/):
  Query your graph for multiple shortest path alternatives.

- [SmartGraphs](https://www.arangodb.com/using-smartgraphs-arangodb/):
  Performance benefit for graphs sharded in an ArangoDB Cluster.

- [Pregel Community Detection](https://www.arangodb.com/pregel-community-detection/):
  Find an underlying community structure in a network.

- [Visualizing an ArangoDB Graph in Cytoscape](https://www.arangodb.com/arangodb-graph-to-cytoscape/):
  

- [Visualizing Graphs with ArangoDB and KeyLines](https://cambridge-intelligence.com/visualize-arangodb/):
  Using a Foxx microservice to power a robust graph visualization application.

- [Smartifier](https://www.arangodb.com/arangodb-smartifier/):
  Transforming an existing Graph dataset into a SmartGraph for Enterprise level scaling

## Foxx

- [Foxx: How it works](../foxx-microservices/):
  Write data access & domain logic as microservices running in the database
  with native access to in-memory data.

- [Video: Intro to Foxx Microservices Tutorial](https://www.youtube.com/watch?v=fIWX3s9B-f0&list=PL0tn-TSss6NV45d1HnLA57VJFH6h1SeH7):
  This introduction to Foxx comes from our ArangoDB Fundamentals Course
  available on [Udemy](https://www.udemy.com/course/getting-started-with-arangodb/).

- [Getting Started with Foxx](../foxx-microservices/foxx-getting-started):
  Introduction to Foxx Microservices that will take you from an empty folder
  to a first Foxx service querying data.

- [Permissions with Foxx](https://www.arangodb.com/foxx-fine-grained-permissions/):
  Tutorial on how to use the Foxx framework by creating a fine-grained
  permission control management service.

- [ArangoDB Foxx CLI](https://www.arangodb.com/2018/04/foxx-cli-managing-microservices/):
  Foxx CLI is easy to use Node.js-based command line tool for managing and
  developing ArangoDB Foxx services.

- [Fault-tolerant Foxx](https://www.arangodb.com/fault-tolerant-foxx/):
  Tutorial on how Foxx service are distributed within a cluster and how the
  cluster is self-healing the environment.

- [Auto-Generate GraphQL for ArangoDB](https://www.arangodb.com/2017/10/auto-generate-graphql-arangodb/):
  Query GraphQL with only a GraphQL IDL schema using a generator.

## Deployment

- [Run multiple versions of ArangoDB in parallel using the .tar.gz distribution](https://www.arangodb.com/2019/01/run-multiple-versions-arangodb/)

- [ArangoDB Starter](tutorials-starter):
  Starting an ArangoDB Cluster or database the easy way

- Datacenter-to-Datacenter Replication:
  - [Setting up Datacenter-to-Datacenter Replication in ArangoDB](https://www.arangodb.com/2017/10/setting-datacenter-datacenter-replication-in-arangodb/)

- [Kubernetes](kubernetes/):
  Start ArangoDB on Kubernetes in 5 minutes
  
- [DC2DC on Kubernetes](tutorials-kubernetes-dc2-dc):
  Start DC2DC between two ArangoDB clusters running in Kubernetes.

## Administration

- [User Management](https://www.arangodb.com/arangodb-user-management/):
  Granting users permissions for databases and collections.

- [Reduce Memory Footprint](../administration/administration-reduce-memory-footprint):
  Configuration options to restrict ArangoDB's memory usage and to reduce
  the CPU utilization

- [ArangoDB Hot Backup](https://www.arangodb.com/2019/10/arangodb-hot-backup-creating-consistent-cluster-wide-snapshots/):
  Creating consistent cluster-wide snapshots.

- [Cluster Administration Course](https://www.arangodb.com/learn/operations/cluster-course/):
  Concepts, maintenance, resilience and troubleshooting.

- [Monitor ArangoDB](https://www.arangodb.com/tutorials/monitoring-collectd-prometheus-grafana/):
  Set up a monitoring system for ArangoDB using _collectd_, _Prometheus_ and _Grafana_

- Performance analysis with pyArango:
  - [Part I](https://www.arangodb.com/2017/09/performance-analysis-using-pyarango/):
    Single instance
  - [Part II](https://www.arangodb.com/2017/09/performance-analysis-pyarango-inspecting-transactions/):
    Cluster environment (inspecting transactions)
  - [Part III](https://www.arangodb.com/2017/10/performance-analysis-pyarango-usage-scenarios/):
    Measuring possible capacity with usage scenarios

- [Using The Linux Kernel and Cgroups to Simulate Starvation](https://www.arangodb.com/2019/01/using-the-linux-kernel-and-cgroups-to-simulate-starvation/)

- Oasisctl:
  - [Opening the ArangoGraph API & Terraform Provider](https://www.arangodb.com/2020/03/opening-the-arangodb-oasis-api-terraform-provider/)
  - [Getting Started with the ArangoGraph API and Oasisctl](../arangograph/arangograph-api/oasisctl-getting-started)

## Drivers and Integrations

- [Node.js in 10 Minutes](https://www.arangodb.com/tutorials/tutorial-node-js/):
  Tutorial about the JavaScript client [ArangoJS](https://github.com/arangodb/arangojs).

- [Java in 10 Minutes](https://www.arangodb.com/tutorials/tutorial-sync-java-driver/):
  Tutorial about the [ArangoDB Java Driver](https://github.com/arangodb/arangodb-java-driver).

- [PHP in 10 Minutes](https://www.arangodb.com/tutorials/tutorial-php/):
  Tutorial about the [ArangoDB-PHP](https://github.com/arangodb/arangodb-php) client.

- [Python in 10 Minutes](https://www.arangodb.com/tutorials/tutorial-python/):
  Tutorial about the Python driver [pyArango](https://github.com/tariqdaouda/pyArango).

- [ArangoDB Go driver](../drivers/arangodb-go-driver/go-getting-started):
  Getting started with the official driver.

- [Introduction to Fuerte](https://www.arangodb.com/2017/11/introduction-fuerte-arangodb-c-plus-plus-driver/):
  The low-level ArangoDB C++ Driver.

- [Spring Data Demo](https://www.arangodb.com/tutorials/spring-data/):
  Basic Spring Data Usage with a Game of Thrones dataset.

- [Arangochair](https://www.arangodb.com/2017/03/arangochair-tool-listening-changes-arangodb/):
  A tool for listening to changes in ArangoDB.

- [Massive Inserts into ArangoDB With Node.js](https://www.arangodb.com/2020/01/massive-inserts-into-arangodb-with-nodejs/):
  Persisting data without tools and drivers.

- [BI Connectors](https://www.arangodb.com/bi-connector-arangodb/):
  Connect your business intelligence tools to ArangoDB
  (Tableau, Power BI, Qlik, Grafana).
