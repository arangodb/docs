---
layout: default
description: The Active Failover setup in ArangoDB has a few limitations
---
Active Failover Limitations
===========================

The _Active Failover_ setup in ArangoDB has a few limitations.

- In contrast to the [ArangoDB Cluster](architecture-deployment-modes-cluster-architecture.html): 
  - Active Failover has only asynchronous replication, and hence **no guarantee** on how many database operations may have been lost during a failover.
  - Active Failover has no global state, and hence a failover to a bad follower (see the example above) overrides all other followers with that state (including the previous leader, which might have more up-to-date data). In a Cluster setup, a global state is provided by the agency and hence ArangoDB is aware of the latest state.
- Should you add more than one _follower_, be aware that during a _failover_ situation
  the failover attempts to pick the most up-to-date follower as the new leader on a **best-effort** basis.
- Should you be using the [ArangoDB Starter](programs-starter.html) 
  or the [Kubernetes Operator](deployment-kubernetes.html) to manage your Active-Failover
  deployment, be aware that upgrading might trigger an unintentional failover between machines.
