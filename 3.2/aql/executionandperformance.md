---
layout: default
description: This chapter describes AQL features related to query executions and query performance
---
AQL Execution and Performance
=============================

This chapter describes AQL features related to query executions and query performance.

* [Execution statistics](executionandperformance-querystatistics.html): A query that has been executed also returns statistics about its execution. 

* [Query parsing](executionandperformance-parsingqueries.html): Clients can use ArangoDB to check if a given AQL query is syntactically valid. 

* [Query execution plan](executionandperformance-explainingqueries.html): If it is unclear how a given query will perform, clients can retrieve a query's execution plan from the AQL query optimizer without actually executing the query; this is called explaining.

* [The AQL query optimizer](executionandperformance-optimizer.html): AQL queries are sent through an optimizer before execution. The task of the optimizer is to create an initial execution plan for the query, look for optimization opportunities and apply them.

* [The AQL query result cache](executionandperformance-querycache.html): an optional query result cache is used to avoid repeated calculation of the same query results.
