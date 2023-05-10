---
layout: default
description: >-
  ArangoDB automatically gathers information on how it is used and the features
  being utilized, but you can disable this data collection
---
# Telemetrics

{{ page.description }}
{:class="lead"}

ArangoDB gathers metrics by default, to identify the primary usage patterns and
features, and to measure their adoption rate.

It is important to note that the information collected by ArangoDB is
non-personal and purely statistical and helps ArangoDB determine which
features are most used, how the general usage model looks like, and
whether ArangoDB is configured properly.

This data is anonymous and does not contain any personal information like
usernames or IP addresses that could be used to identify a particular user, nor
does it contain any content of the documents stored in ArangoDB.
This means that your privacy is protected, and that there is no risk of your
data being compromised.

The data is transmitted to ArangoDB Inc. or one of its subsidiaries.

If for any reason you prefer not to share usage statistics with ArangoDB, you
can easily disable this feature by setting the `--server.enable-telemetrics-api`
startup option to `false`. The default value is `true`.

The anonymous metrics ArangoDB collects and transmits include the following:

- **Host machine environment**: This includes statistics about your operating
  system, license type, and available RAM and CPU resources.

  - The operating system
  - The platform (e.g. Linux)
  - The number of CPU cores
  - Whether the number of CPU cores is overridden
  - The memory size
  - Whether the memory size is overridden
  - The ArangoDB license type (Community Edition or Enterprise Edition)

- **Runtime information**: This includes statistics related to your deployment
  type and startup mode, RAM and CPU usage, and shard configuration (number of
  shards, followers, leaders, Coordinators, databases, and servers participating
  in sharding).

  - The date and time of fetching the deployment information
  - The deployment type (cluster, Active Failover, etc.)
  - The persisted deployment ID
  - The startup mode (ArangoDB Starter, Kubernetes operator, etc.)
  - The number of Agents
  - The number of DB-Servers
  - The number of Coordinators
  - A list of detailed information per server
    - Is it in maintenance mode?
    - Is it read-only?
    - The endpoint address
    - The server ID
    - The server alias
    - The server role (Agent, DB-Server, Coordinator, Single)
    - The ArangoDB version
    - The ArangoDB build
  - Shards statistics
    - The number of servers participating in sharding
    - The number of collections
    - The number of shards
    - The number of leaders
    - The number of real leaders
    - The number of followers
  - Engine statistics
    - The `rocksdb_block_cache_usage` metric
    - The `rocksdb_block_cache_capacity` metric
    - The `rocksdb_free_disk_space` metric
    - The `rocksdb_total_disk_space` metric
    - The `rocksdb_live_sst_files_size` metric
    - The `rocksdb_estimate_live_data_size` metric
    - The `rocksdb_estimate_num_keys` metric
    - The `cache_allocated` metric
    - The `cache_limit` metric
  - Process statistics
    - The number of threads
    - The process uptime
    - The resident set size
    - The virtual size

- **Feature usage data**: This includes information about which features are
  most used and how the usage model looks like. Statistics include details about
  the type and number of collections per database, indexes, smart graphs, queries,
  as well as configuration details in terms of sharding and replication.

  - The number of databases
  - A list of detailed information per database
    - Whether it is a single shard database
    - The number of document collections
    - The number of edge collections
    - The number of smart collections
    - The number of disjoint smart collections
    - The number of Views
    - A list of detailed information per collection
      - The collection type
      - The persistent collection ID
      - Whether it is used in a SmartGraph
      - Whether it is a disjoint collection
      - The number of shards
      - The replication factor
      - The plan ID
      - The number of documents
      - The number of primary indexes
      - The number of edge indexes
      - The number of hash indexes
      - The number of skiplist indexes
      - The number of persistent indexes
      - The number of geo indexes
      - The number of fulltext indexes
      - The number of iresearch indexes
      - The number of inverted indexes
      - The number of zkd indexes
      - A list of detailed information per index
        - The index type
        - Is it a unique index?
        - Is it a sparse index?
        - The index memory size
        - The index cache usage
        - The index cache size
