---
layout: default
description: ArangoDB Server ArangoSearch Options
---
# ArangoDB Server ArangoSearch Options

## Threads

`arangosearch.commit-threads`

<small>Introduced in: v3.7.5</small>

The maximum number of threads to use for asynchronous ArangoSearch commit
tasks (0 == autodetect).
The option value must fall in the range `[ 1..4 * NumberOfCores ]`.

`arangosearch.commit-threads-idle`

<small>Introduced in: v3.7.5</small>

The minimum number of threads to use for asynchronous ArangoSearch commit
tasks (0 == autodetect).
The option value must fall in the range `[ 1..arangosearch.commit-threads ]`.

`arangosearch.consolidation-threads`

<small>Introduced in: v3.7.5</small>

The maximum number of threads to use for asynchronous ArangoSearch consolidation
tasks (0 == autodetect).
The option value must fall in the range `[ 1..4 * NumberOfCores ]`.

`arangosearch.consolidation-threads-idle`

<small>Introduced in: v3.7.5</small>

The minimum number of threads to use for asynchronous ArangoSearch consolidation
tasks (0 == autodetect).
The option value must fall in the range `[ 1..arangosearch.consolidation-threads ]`.

`arangosearch.threads`

<small>Deprecated in: v3.7.5</small>

The exact number of threads to use for asynchronous tasks (0 == autodetect).

From version 3.7.5 on, `arangosearch.consolidation-threads` and
`arangosearch.commit-threads` should be set separately instead. They overrule
`arangosearch.threads`. If only `arangosearch.threads` is specified and greater
than 0, then the value is divided by 2 and used for both of the new options.

`arangosearch.threads-limit`

<small>Deprecated in: v3.7.5</small>

Upper limit to the auto-detected number of threads to use for asynchronous
tasks (0 == use default).
