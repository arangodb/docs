---
layout: default
description: Known limitations that apply in AQL queries
---
Known limitations for AQL queries
=================================

The following hard-coded limitations exist for AQL queries:

- An AQL query cannot use more than _1000_ result registers.
  One result register is needed for every named query variable and for
  internal/anonymous query variables, e.g. for intermediate results.
  Subqueries also require result registers.
- An AQL query cannot have more than _4000_ execution nodes in its initial
  query execution plan. This number includes all execution nodes of the
  initial execution plan, even if some of them could be
  optimized away later by the query optimizer during plan optimization.
- An AQL query cannot use more than _2048_ collections/shards.
- Expressions in AQL queries cannot have a nesting of more than _500_ levels.
  As an example, the expression `1 + 2 + 3 + 4` is 3 levels deep
  (because it is interpreted and executed as `1 + (2 + (3 + 4))`).
- When reading any data from JSON or VelocyPack input or when serializing
  any data to JSON or VelocyPack, there is a maximum recursion depth for 
  nested arrays and objects, which is slightly below 200. Arrays or objects
  with higher nesting than this will cause `Too deep nesting in Array/Object`
  exceptions.

Please note that even queries that are still below these limits may not
yield good performance, especially when they have to put together data from lots
of different collections. Please also consider that large queries (in terms of
intermediate result size or final result size) can use considerable amounts of
memory and may hit the configurable memory limits for AQL queries.

The following other limitations are known for AQL queries:

- Subqueries that are used inside expressions are pulled out of these
  expressions and executed beforehand. That means that subqueries do not
  participate in lazy evaluation of operands, for example in the
  [ternary operator](operators.html#ternary-operator). Also see
  [evaluation of subqueries](fundamentals-subqueries.html#evaluation-of-subqueries).
- It is not possible to use a collection in a read operation after
  it was used for a write operation in the same AQL query.
- In the cluster, all collections that are accessed **dynamically** by
  [traversals working with collection sets](graphs-traversals.html#working-with-collection-sets)
  (instead of named graphs) must be stated in the query's initial
  [`WITH` statement](operations-with.html). To make the `WITH` statement
  required in single server as well (e.g. for testing a migration to cluster),
  please start the server with the option `--query.require-with`.
