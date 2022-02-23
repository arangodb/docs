---
layout: default
description: ArangoDB provides support for user-definable  transactions
---
Transactions
============

ArangoDB provides support for user-definable transactions.

Transactions in ArangoDB are atomic, consistent, isolated, and durable (*ACID*).

These *ACID* properties provide the following guarantees:

* The *atomicity* principle makes transactions either complete in their
  entirety or have no effect at all.
* The *consistency* principle ensures that no constraints or other invariants
  will be violated during or after any transaction. A transaction will never
  corrupt the database.
* The *isolation* property will hide the modifications of a transaction from
  other transactions until the transaction commits. 
* Finally, the *durability* proposition makes sure that operations from 
  transactions that have committed will be made persistent. The amount of
  transaction durability is configurable in ArangoDB, as is the durability
  on collection level. 

The descriptions in this section only provide a general overview. The actual transactional
guarantees depend on the deployment mode and usage pattern.

Also see:
- [Operation Atomicity](data-modeling-operational-factors.html#operation-atomicity) for more details on atomicity guarantees
- [Transactional Isolation](data-modeling-operational-factors.html#transactional-isolation) for more details on isolation guarantees in the single server
  and OneShard database case
- [Cluster Transaction Limitations](transactions-limitations.html#in-clusters)
  for more details on the transactional behavior of multi-document transactions in
  cluster deployments
