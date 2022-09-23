---
layout: default
description: Learn about Data Modeling, Queries, Graphs, Foxx, Deployment, Administration and more.
title: ArangoDB Tutorials
---
Tutorials
=========

General
-------

- [Getting started](getting-started.html):
  A beginner's guide to ArangoDB.

- [ArangoDB Web Interface](https://www.arangodb.com/learn/first-day/web-ui/){:target="_blank"}:
  Overview over the built-in web interface.

- [Using the Web Interface AQL Editor](https://www.arangodb.com/2018/02/using-webui-aql-editor/){:target="_blank"}:
  Basic introduction to the query editor of the web interface.

- Index types and how indexes are used in ArangoDB:
  - [Part I](https://www.arangodb.com/2018/02/indexes-types-arangodb-part-1/){:target="_blank"}:
    Index types
  - [Part II](https://www.arangodb.com/2018/03/index-types-indexes-used-arangodb-part-2/){:target="_blank"}:
    How to create indexes

- [ArangoSearch](https://www.arangodb.com/learn/search/){:target="_blank"}:
  Implementation details and hands-on tutorial about ArangoDB's full-text search engine.

- [Data Masking](https://www.arangodb.com/learn/development/data-masking-tutorial/){:target="_blank"}:
  Anonymizing Production Data Securely For Testing & Development Environments

Data modeling
-------------

- [How to model customer surveys in a graph database](https://www.arangodb.com/2016/11/realize-surveys-graph-database/){:target="_blank"}:
  A question and answer game based on decision trees.

- [Data Modeling and Operational Factors](data-modeling-operational-factors.html):
  Learn about what design decisions are crucial for application performance.

- [Time traveling with graph databases](https://www.arangodb.com/2018/07/time-traveling-with-graph-databases/){:target="_blank"}:
  Concepts for a revision history of graph data. Also see the
  [simplified tutorial](https://www.arangodb.com/learn/graphs/time-traveling-graph-databases/){:target="_blank"}.

Queries
-------

- [Data Queries](aql/data-queries.html):
  A primer on AQL data access and modification queries.

- [AQL Query Patterns and Examples](aql/examples.html):
  Subqueries, joins, dynamic attribute names and more.

- [CRUD](https://www.arangodb.com/tutorials/arangodb-crud/){:target="_blank"}:
  Document CRUD (Create, Read, Update, Delete) with AQL and HTTP API

- [Geo Queries](https://www.arangodb.com/using-arangodb-geo-index-cursor-via-aql/){:target="_blank"}:
  How to use the ArangoDB Geo Index Cursor via AQL

- [GeoJSON tutorial](https://www.arangodb.com/learn/documents/geojson-tutorial/){:target="_blank"}:
  Indexing and querying GeoJSON data.

- [AQL Query Optimization with Query Profiling](https://www.arangodb.com/learn/development/aql-query-optimization-with-profiler/){:target="_blank"}:
  Examination of query performance by example and common performance pitfalls.

- [Performance Course](https://www.arangodb.com/arangodb-performance-course/){:target="_blank"}:
  Performance Optimization Basics: How to make your queries faster

- SmartJoins:
  - [Introduction](https://www.arangodb.com/enterprise-server/smartjoins/){:target="_blank"}:
    Making distributed join operations local.
  - [Tutorial](https://www.arangodb.com/learn/documents/smart-joins-tutorial/){:target="_blank"}:
    Boosting cluster join query performance.

- [SQL / AQL - Comparison](https://www.arangodb.com/community-server/sql-aql-comparison/){:target="_blank"}:
  Differences and similarities between ArangoDB Query Language (AQL) and
  Structured Query Language (SQL).

- [Comparing ArangoDB AQL to Neo4j Cypher](https://www.arangodb.com/comparing-arangodb-aql-neo4j-cypher/){:target="_blank"}:
  Language models, database concepts and queries.

- [ArangoDB vs MongoDB](https://www.arangodb.com/tutorials/mongodb-to-arangodb-tutorial/){:target="_blank"}:
  Comparison between performing queries in both systems.

Graphs
------

- [Graph Course](https://www.arangodb.com/arangodb-graph-course/){:target="_blank"}:
  Get started with ArangoDB's graph related features

- [Pattern Matching](https://www.arangodb.com/learn/graphs/pattern-matching/){:target="_blank"}:
  Find the best flights between two airports with the lowest total travel time.

- [k Shortest Paths Queries in AQL](https://www.arangodb.com/learn/graphs/k-shortest-paths-queries-in-aql/){:target="_blank"}:
  Query your graph for multiple shortest path alternatives.

- [SmartGraphs](https://www.arangodb.com/using-smartgraphs-arangodb/){:target="_blank"}:
  Performance benefit for graphs sharded in an ArangoDB Cluster.

- [Pregel Community Detection](https://www.arangodb.com/pregel-community-detection/){:target="_blank"}:
  Find an underlying community structure in a network.

- [Visualizing an ArangoDB Graph in Cytoscape](https://www.arangodb.com/arangodb-graph-to-cytoscape/){:target="_blank"}:
  

- [Visualizing Graphs with ArangoDB and KeyLines](https://cambridge-intelligence.com/visualize-arangodb/){:target="_blank"}:
  Using a Foxx microservice to power a robust graph visualization application.

- [Smartifier](https://www.arangodb.com/arangodb-smartifier/){:target="_blank"}:
  Transforming an existing Graph dataset into a SmartGraph for Enterprise level scaling

Foxx
----

- [Foxx: How it works](foxx.html):
  Write data access & domain logic as microservices running in the database
  with native access to in-memory data.

- [Video: Intro to Foxx Microservices Tutorial](https://www.youtube.com/watch?v=fIWX3s9B-f0&list=PL0tn-TSss6NV45d1HnLA57VJFH6h1SeH7){:target="_blank"}:
  This introduction to Foxx comes from our ArangoDB Fundamentals Course
  available on [Udemy](https://www.udemy.com/course/getting-started-with-arangodb/){:target="_blank"}.

- [Getting Started with Foxx](foxx-getting-started.html):
  Introduction to Foxx Microservices that will take you from an empty folder
  to a first Foxx service querying data.

- [Permissions with Foxx](https://www.arangodb.com/foxx-fine-grained-permissions/){:target="_blank"}:
  Tutorial on how to use the Foxx framework by creating a fine-grained
  permission control management service.

- [ArangoDB Foxx CLI](https://www.arangodb.com/2018/04/foxx-cli-managing-microservices/){:target="_blank"}:
  Foxx CLI is easy to use Node.js-based command line tool for managing and
  developing ArangoDB Foxx services.

- [Fault-tolerant Foxx](https://www.arangodb.com/fault-tolerant-foxx/){:target="_blank"}:
  Tutorial on how Foxx service are distributed within a cluster and how the
  cluster is self-healing the environment.

- [Auto-Generate GraphQL for ArangoDB](https://www.arangodb.com/2017/10/auto-generate-graphql-arangodb/){:target="_blank"}:
  Query GraphQL with only a GraphQL IDL schema using a generator.

Deployment
----------

- [Run multiple versions of ArangoDB in parallel using the .tar.gz distribution](https://www.arangodb.com/2019/01/run-multiple-versions-arangodb/){:target="_blank"}

- [ArangoDB Starter](tutorials-starter.html):
  Starting an ArangoDB Cluster or database the easy way

- Datacenter to datacenter Replication:
  - [Setting up Datacenter to Datacenter Replication in ArangoDB](https://www.arangodb.com/2017/10/setting-datacenter-datacenter-replication-in-arangodb/){:target="_blank"}

- [Kubernetes](tutorials-kubernetes.html):
  Start ArangoDB on Kubernetes in 5 minutes
  
- [DC2DC on Kubernetes](tutorials-kubernetes-dc2-dc.html):
  Start DC2DC between two ArangoDB clusters running in Kubernetes.

Administration
--------------

- [User Management](https://www.arangodb.com/arangodb-user-management/){:target="_blank"}:
  Granting users permissions for databases and collections.

- [Reduce Memory Footprint](tutorials-reduce-memory-footprint.html):
  Configuration options to restrict ArangoDB's memory usage and to reduce
  the CPU utilization

- [ArangoDB Hot Backup](https://www.arangodb.com/2019/10/arangodb-hot-backup-creating-consistent-cluster-wide-snapshots/){:target="_blank"}:
  Creating consistent cluster-wide snapshots.

- [Cluster Administration Course](https://www.arangodb.com/learn/operations/cluster-course/){:target="_blank"}:
  Concepts, maintenance, resilience and troubleshooting.

- [Monitor ArangoDB](https://www.arangodb.com/tutorials/monitoring-collectd-prometheus-grafana/){:target="_blank"}:
  Set up a monitoring system for ArangoDB using _collectd_, _Prometheus_ and _Grafana_

- Performance analysis with pyArango:
  - [Part I](https://www.arangodb.com/2017/09/performance-analysis-using-pyarango/){:target="_blank"}:
    Single instance
  - [Part II](https://www.arangodb.com/2017/09/performance-analysis-pyarango-inspecting-transactions/){:target="_blank"}:
    Cluster environment (inspecting transactions)
  - [Part III](https://www.arangodb.com/2017/10/performance-analysis-pyarango-usage-scenarios/){:target="_blank"}:
    Measuring possible capacity with usage scenarios

- [Using The Linux Kernel and Cgroups to Simulate Starvation](https://www.arangodb.com/2019/01/using-the-linux-kernel-and-cgroups-to-simulate-starvation/){:target="_blank"}

- Oasisctl:
  - [Opening the ArangoDB Oasis API & Terraform Provider](https://www.arangodb.com/2020/03/opening-the-arangodb-oasis-api-terraform-provider/){:target="_blank"}
  - [Getting Started with the Oasis API and Oasisctl](oasis/oasisctl-getting-started.html)

Drivers and Integrations
------------------------

- [Node.js in 10 Minutes](https://www.arangodb.com/tutorials/tutorial-node-js/){:target="_blank"}:
  Tutorial about the JavaScript client [ArangoJS](https://github.com/arangodb/arangojs){:target="_blank"}.

- [Java in 10 Minutes](https://www.arangodb.com/tutorials/tutorial-sync-java-driver/){:target="_blank"}:
  Tutorial about the [ArangoDB Java Driver](https://github.com/arangodb/arangodb-java-driver){:target="_blank"}.

- [PHP in 10 Minutes](https://www.arangodb.com/tutorials/tutorial-php/){:target="_blank"}:
  Tutorial about the [ArangoDB-PHP](https://github.com/arangodb/arangodb-php){:target="_blank"} client.

- [Python in 10 Minutes](https://www.arangodb.com/tutorials/tutorial-python/){:target="_blank"}:
  Tutorial about the Python driver [pyArango](https://github.com/tariqdaouda/pyArango){:target="_blank"}.

- [ArangoDB Go driver](drivers/go-getting-started.html):
  Getting started with the official driver.

- [Introduction to Fuerte](https://www.arangodb.com/2017/11/introduction-fuerte-arangodb-c-plus-plus-driver/){:target="_blank"}:
  The low-level ArangoDB C++ Driver.

- [Spring Data Demo](https://www.arangodb.com/tutorials/spring-data/){:target="_blank"}:
  Basic Spring Data Usage with a Game of Thrones dataset.

- [Arangochair](https://www.arangodb.com/2017/03/arangochair-tool-listening-changes-arangodb/){:target="_blank"}:
  A tool for listening to changes in ArangoDB.

- [Massive Inserts into ArangoDB With Node.js](https://www.arangodb.com/2020/01/massive-inserts-into-arangodb-with-nodejs/){:target="_blank"}:
  Persisting data without tools and drivers.

- [BI Connectors](https://www.arangodb.com/bi-connector-arangodb/){:target="_blank"}:
  Connect your business intelligence tools to ArangoDB
  (Tableau, Power BI, Qlik, Grafana).
