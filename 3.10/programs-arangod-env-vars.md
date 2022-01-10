---
layout: default
description: Environment variables used by arangod
title: arangod environment variables
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

   The total amount of RAM detected is logged as an INFO message at
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
 
 - `ARANGODB_OVERRIDE_DETECTED_NUMBER_OF_CORES` _(introduced in v3.7.1)_
   
   This variable can be used to override the automatic detection of the
   number of CPU cores present on the system. 

   The number of CPU cores detected is logged as an INFO message at
   server start. If the variable is set, the overridden value is shown.
   Various default values for threading are calculated based on this value.

   Setting this option is useful if `arangod` is running in a container
   or alongside other services on the same machine and shall not use
   all available CPUs.
 
 - `ARANGODB_OVERRIDE_CRASH_HANDLER` _(introduced in v3.7.1)_
   
   This variable can be used to toggle the built-in crash handler in the
   Linux builds of `arangod`. The crash handler is turned on by default
   for Linux builds, and it can be turned off by setting this environment
   variable to an empty string, the value of `0` or `off`.

- `TZ_DATA` _(introduced in v3.8.0)_

   This variable can be used to specify the path to the directory containing
   the timezone information database for ArangoDB. That directory is normally
   named `tzdata` and is shipped with ArangoDB releases. It is normally not
   required to set this environment variable, but it may be necessary in
   unusual setups with non-conventional directory layouts and paths.

- `IRESEARCH_TEXT_STOPWORD_PATH` _(introduced in v3.5.0)_

  Path to a directory with stopword files for
  [ArangoSearch Text Analyzers](analyzers.html#text).

<!-- ARANGODB_CONFIG_PATH, ICU_DATA, ... (TRI_GETENV, iresearch::getenv) -->

For Docker specific environment variables please refer to
[Docker Hub](https://hub.docker.com/_/arangodb){:target="_blank"}
