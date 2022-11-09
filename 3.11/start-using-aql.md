---
layout: default
description: The ArangoDB Query Language (AQL) can be used to retrieve and modify data that are stored in ArangoDB.
title: Start using AQL
---
# Start using AQL

The ArangoDB Query Language (AQL) can be used to retrieve and modify data that 
are stored in ArangoDB.

The general workflow when executing a query is as follows:

- A client application ships an AQL query to the ArangoDB server. The query text
  contains everything ArangoDB needs to compile the result set
- ArangoDB will parse the query, execute it and compile the results. If the
  query is invalid or cannot be executed, the server will return an error that
  the client can process and react to. If the query can be executed
  successfully, the server will return the query results (if any) to the client

## What's AQL?  

AQL is mainly a declarative language, meaning that a query expresses what result
should be achieved but not how it should be achieved. AQL aims to be
human-readable and therefore uses keywords from the English language. Another
design goal of AQL was client independency, meaning that the language and syntax
are the same for all clients, no matter what programming language the clients
may use.  Further design goals of AQL were the support of complex query patterns
and the different data models ArangoDB offers.

In its purpose, AQL is similar to the Structured Query Language (SQL). AQL supports 
reading and modifying collection data, but it doesn't support data-definition
operations such as creating and dropping databases, collections and indexes.
It is a pure data manipulation language (DML), not a data definition language
(DDL) or a data control language (DCL).

The syntax of AQL queries is different to SQL, even if some keywords overlap.
Nevertheless, AQL should be easy to understand for anyone with an SQL background.

Sign up for [ArangoDB University](https://university.arangodb.com/){:target="_blank"}
and get access to the **AQL Fundamentals** course.  

## How to invoke AQL

AQL queries can be executed using:

- the web interface,
- the `db` object (either in arangosh or in a Foxx service)
- or the raw HTTP API.

There are always calls to the server's API under the hood, but the web interface
and the `db` object abstract away the low-level communication details and are
thus easier to use.

The ArangoDB Web Interface has a [specific tab for AQL queries execution](../aql/invocation-with-web-interface.html).

You can run [AQL queries from the ArangoDB Shell](../aql/invocation-with-arangosh.html)
with the [_query](aql/invocation-with-arangosh.html#with-db_query) and
[_createStatement](aql/invocation-with-arangosh.html#with-db_createstatement-arangostatement) methods
of the [`db` object](../appendix-references-dbobject.html). This chapter
also describes how to use bind parameters, statistics, counting and cursors with
arangosh.

If you are using Foxx, see [how to write database queries](foxx-getting-started.html#writing-database-queries)
for examples including tagged template strings.

If you want to run AQL queries from your application via the HTTP REST API,
see the full API description at [HTTP Interface for AQL Query Cursors](../http/aql-query-cursor.html).