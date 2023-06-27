---
layout: default
description: >-
  The Replication HTTP API is used internally for synchronizing the nodes in
  distributed ArangoDB setups, as well as by users to control the replication
---
# HTTP interface for replication

{{ page.description }}
{:class="lead"}

The replication architecture and components are described in more details in 
[Replication](../architecture-replication.html).

The HTTP replication interface serves four main purposes:
- fetch initial data from a server (e.g. for a backup, or for the initial synchronization 
  of data before starting the continuous replication applier)
- querying the state of a Leader
- fetch continuous changes from a Leader (used for incremental synchronization of changes)
- administer the replication applier (starting, stopping, configuring, querying state) on 
  a Follower

Note that if a per-database setup is used (as opposed to server-level replication),
then the replication system must be configured individually per
database, and replicating the data of multiple databases will require multiple operations.
