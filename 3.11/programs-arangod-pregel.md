---
layout: default
---
# ArangoDB Server Pregel Options

## Pregel job parallelism

TODO: how to incorporate this? What does instance level refer to (per cluster node)?

Administrators can use these parallelism options to set concurrency defaults and bounds 
for Pregel jobs on an instance level. Each individual Pregel job can set its own parallelism 
value using the job's `parallelism` option, but the job's effective parallelism is limited by 
the bounds defined by `--pregel.min-parallelism` and `--pregel.max-parallelism`. 

