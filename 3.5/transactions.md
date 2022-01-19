---
layout: default
description: ArangoDB provides support for user-definable  transactions
---
Transactions
============

ArangoDB provides support for user-definable  transactions. 

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

The descriptions in this section are somewhat vague for the sake of
brevity and to first give an overview. The actual transactional
guarantees depend on the deployment mode and usage pattern.

For more details on our atomicity guarantees see 
[this section](data-modeling-operational-factors#operation-atomicity).
For more details on our isolation guarantees in the single server and
one shard database case see
[this section](data-modeling-operational-factors#transactional-isolation).
For general limitations see
Section [Cluster Limitations](transactions-limitations.html#in-clusters)
regarding transactional behavior of multi-document transactions in
cluster deployments.
