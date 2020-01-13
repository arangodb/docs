---
layout: default
description: ArangoDB v3.7 Release Notes New Features
---
Features and Improvements in ArangoDB 3.7
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.7. ArangoDB 3.7 also contains several bug fixes that are not listed
here.


Cluster
-------

### Parallel Move Shard
Shards can now move in parallel. The old locking mechanism was replaced by a read-write-lock and thus allows multiple jobs for the same _to_ server. The actual transfere rates are still limited on dbserver side but there is a huge overall speedup. This also affects `CleanOutServer` and `ResignLeadership` jobs. 
