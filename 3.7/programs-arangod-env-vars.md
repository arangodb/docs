---
layout: default
description: Environment variables used by arangod
title: Arangod environment variables
---
# ArangoDB Server environment variables

`arangod` inspects the following list of environment variables:

 - `ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY` _(introduced in v3.6.3)_
   
   This variable can be used to override the automatic detection of the total
   amount of RAM present on the system. One can specify a decimal number
   (in bytes). Furthermore, if `G` or `g` is appended, the value is multiplied
   by `2^30`. If `M` or `m` is appended, the value is multiplied by `2^20`.
   If `K` or `k` is appended, the value is multiplied by `2^10`. That is,
   `64G` means 64 gigabytes.

   The total amount of RAM detected is logged as an Info message at
   server start. If the variable is set, the overridden value is shown.
   Various default sizes are calculated based on this value (e.g.
   RocksDB buffer cache size).

   Setting this option can in particular be useful in two cases:

   1. If `arangod` is running in a container and its cgroup has a RAM
      limitation, then one should specify this limitation in this
      environment variable, since it is currently not automatically
      detected.
   2. If `arangod` is running alongside other services on the same
      machine and thus sharing the RAM with them, one should limit the
      amount of memory using this environment variable.

- `IRESEARCH_TEXT_STOPWORD_PATH` _(introduced in v3.5.0)_

  Path to a directory with stopword files for
  [ArangoSearch Text Analyzers](arangosearch-analyzers.html#text).

<!-- ARANGODB_CONFIG_PATH, ICU_DATA, ... (TRI_GETENV, iresearch::getenv) -->

For Docker specific environment variables please refer to
[Docker Hub](https://hub.docker.com/_/arangodb){:target="_blank"}
