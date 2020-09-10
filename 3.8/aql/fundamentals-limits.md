---
layout: default
description: Known limitations that apply in AQL queries
---
Known limitations for AQL queries
=================================

The following limitations are known for AQL queries:

- An AQL query cannot use more than _1000_ result registers. One
  result register is needed for every named query variable and for 
  internal/anonymous query variables.
- An AQL query cannot use more than _2048_ collections/shards.
- It is not possible to use a collection in a read operation after
  it was used for a write operation in the same AQL query.
- In the cluster, all vertex collections and collection that are accessed
  dynamically via the `DOCUMENT` AQL function must be stated in the 
  query's initial `WITH` statement.
- Subqueries that are used inside expressions are pulled out of these
  expressions and executed beforehand. That means that subqueries do not
  participate in lazy evaluation of operands.
