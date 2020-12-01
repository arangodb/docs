---
layout: default
description: ArangoDB Server ArangoSearch Options
---
# ArangoDB Server ArangoSearch Options

## Threads

`arangosearch.commit-threads`
**introduced in 3.7.6**

The maximum number of threads to use for asynchronous ArangoSearch commit
tasks (0 == autodetect).
The option value must fall in range [1..4 * `NumberOfCores`].

`arangosearch.commit-threads-idle`
**introduced in 3.7.6**

The minimum number of threads to use for asynchronous ArangoSearch commit
tasks (0 == autodetect).
The option value must fall in range [1..`arangosearch.commit-threads`].

`arangosearch.consolidation-threads`
**introduced in 3.7.6**

The maximum number of threads to use for asynchronous ArangoSearch consolidation
tasks (0 == autodetect).
The option value must fall in range [1..4 * `NumberOfCores`].

`arangosearch.consolidation-threads-idle`
**introduced in 3.7.6**

The minimum number of threads to use for asynchronous ArangoSearch consolidation
tasks (0 == autodetect).
The option value must fall in range [1..`arangosearch.consolidation-threads`].

`arangosearch.threads`
**deprecated in 3.7.6**

The exact number of threads to use for asynchronous tasks (0 == autodetect).

`arangosearch.threads-limit`
**deprecated in 3.7.6**

Upper limit to the auto-detected number of threads to use for asynchronous
tasks (0 == use default).
