---
layout: default
redirect_from:
  - getting-started.html # 3.9 -> 3.10
---
# Getting Started

This chapter introduces ArangoDB's core concepts and covers the following:

- Available tools in ArangoDB 
- The high-level data organization
- Its data model (or rather multiple data models)
- Important terminology used throughout the database system and in this
  documentation

You can also find examples on how to interact with the database system
using ArangoDB's command-line tool called [arangosh](programs-arangosh.html).
To learn more about the ways you can use and communicate with ArangoDB servers,
see [How to Interact With ArangoDB](how-to-interact-with-arangodb.html).
For example, you can create and drop databases/collections as well as save,
update, replace, and remove documents using ArangoDB's web interface or a driver.

Learn more about ArangoDB's [data model and concepts](data-model-and-concepts.html).

## Available Tools in ArangoDB

ArangoDB provides various tools to help you manage and work with your data.

- [ArangoDB Server](programs-arangod.html) is the core component of ArangoDB that
  stores data and handles requets. You can communicate with the server through
  the web interface, command-line interface, drivers, and REST API.

- [ArangoDB Shell](programs-arangosh.html) is the command-line tool that
  allows you to interact with the ArangoDB server. It also offers a V8 JavaScript
  shell environment that you can use to manage collections or run queries.

- [ArangoDB Web Interface](programs-web-interface.html) is the graphical user
  interface tool that lets you perform all essential actions like creating
  collections, viewing documents, and running queries. You can also view
  graphs and the server logs and metrics, as well as administrate user accounts.

- [ArangoDB Starter](programs-starter.html) helps you set up and deploy ArangoDB
  instances on bare-metal servers and supports all ArangoDB deployment modes, such
  as a single server instance, active failover, and cluster (including
  Datacenter-to-Datacenter replication).

- [*arangodump*](programs-arangodump.html) is the command-line tool that allows you
  to create backups of your data and structures in a flexible and efficient manner
  and can be used for all ArangoDB deployment modes.

  With *arangodump*, you can create backups for selected collections or for all
  collections of a database. Additionally, you can back up the structural information
  of your collections (name, indexes, sharding, etc.) with or without the data stored in them.  

- [*arangorestore*](programs-arangorestore.html) is the command-line tool that allows
  you to restore backups created by *arangodump*. 

  Similarly to the backup process, you can restore either all collections or just
  specific ones and choose whether to restore structural information with or
  without data.

- [*arangobackup*](programs-arangobackup.html) is a command-line tool that enables
  you to create instantaneous and consistent [hot backups](backup-restore.html#hot-backups)
  of the data and structural information stored in ArangoDB, without interrupting
  the database operations. It can be used for all ArangoDB deployment modes.

  Only available in the Enterprise Edition.

- With [*arangoimport*](programs-arangoimport.html) you can import data from JSON,
  JSONL, CSV, and TSV formats into a database collection. Thanks to its multi-threaded
  architecture and bulk import capabilities, you can import your data at high
  speeds.

- With [*arangoexport*](programs-arangoexport.html) you can export data from your
  database collection to various formats such as JSON, JSONL, CSV, and XML.

- [*arangobench*](programs-arangobench.html), ArangoDB's benchmark and test tool,
  can be used to issue test requests to the database system for performance and
  server function testing.

For a complete list of available tools including examples, please refer to the
[Programs & Tools](programs.html) chapter.  

## Modeling Data for ArangoDB

Plan for your data needs and map your conceptual model to the right features,
making the most of ArangoDB.

All of the following topics fall under the broader term of data modeling:

- Analyzing your project goals and existing data
- Designing logical models for your data and mapping them to ArangoDB, often
  by striking a balance between natural data structures and great performance
- Preparing and loading data into ArangoDB
- Transforming data once it is in ArangoDB

## Coming from SQL

If you worked with a database management system (RDBMS) such as MySQL,
MariaDB or PostgreSQL, you should be familiar with the SQL query language.

ArangoDB's query language is called AQL. There are some similarities between both
languages despite the different data models of the database systems. The most
notable difference is probably the concept of loops in AQL, which makes it feel
more like a programming language. It suits the schema-less model more natural
and makes the query language very powerful while remaining easy to read and write.

To get started with AQL, sign up for [ArangoDB University](https://university.arangodb.com/){:target="_blank"}
and get access to interactive courses powered by ArangoGraph. 

## In the Cloud or On-premises

When you are ready for your own ArangoDB server, you can sign up for ArangoDB's
cloud service called ArangoGraph, which takes care of the setup and maintenance, so
that you can focus on building amazing things on top of ArangoDB. See
[Use ArangoDB in the Cloud](quick-start-in-the-cloud.html) to get started.

You can also install ArangoDB locally or on your own server hardware.
See [Install ArangoDB on-premises](quick-start-on-premises.html) for more details.

If you want to migrate from bare metal servers to the cloud with minimal downtime,
check out the [Cloud Migration Tool](arangograph/cloud-migration-tool.html).

## Interactive Tutorials

To get started with ArangoDB and try out some of its features, you can use the
interactive tutorials. They provide information on various topics and allow you
to set up and access a cloud instance of ArangoDB - it’s free, easy to use, and
no installation is required.

**AQL Tutorials**

- [Game of Thrones AQL Tutorial](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/ArangoDB_GOT_Tutorial.ipynb){:target="_blank"}
- [AQL CRUD Part 1](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/AqlCrudTutorial.ipynb){:target="_blank"}
- [AQL CRUD Part 2](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/AqlPart2Tutorial.ipynb){:target="_blank"}
- [AQL Joins](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/AqlJoinTutorial.ipynb){:target="_blank"}
- [AQL Graph Traversal](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/AqlTraversalTutorial.ipynb){:target="_blank"}
- [AQL Geospatial](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/AqlGeospatialTutorial.ipynb){:target="_blank"}

**Graph Tutorials**

- [Property Graph Queries](https://colab.research.google.com/github/joerg84/Graph_Powered_ML_Workshop/blob/master/Graphs_Queries.ipynb){:target="_blank"}

**ArangoSearch Tutorials**

- [ArangoSearch](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/ArangoSearch.ipynb){:target="_blank"}
- [Fuzzy Search](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/FuzzySearch.ipynb){:target="_blank"}

**GraphML and Analytics Tutorials**

- [ArangoDB and NetworkX](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/ArangoDB_NetworkX_Interface_Introduction.ipynb){:target="_blank"}
- [Graph Analytics: Collaborative Filtering](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/Collaborative_Filtering.ipynb){:target="_blank"}
- [Graph Analytics: Fraud Detection](https://colab.research.google.com/github/joerg84/Graph_Powered_ML_Workshop/blob/master/Fraud_Detection.ipynb){:target="_blank"}
- [Graph Neural Networks with PyTorch](https://colab.research.google.com/github/arangodb/interactive_tutorials/blob/master/notebooks/arangoflix/predict_Movie_Rating_GNN.ipynb){:target="_blank"}

You can find all interactive tutorials on GitHub:

<https://github.com/arangodb/interactive_tutorials/>{:target="_blank"}
