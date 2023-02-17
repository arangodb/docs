---
layout: default
description: Environment variables used by arangod
title: arangod environment variables
---
# ArangoDB Server environment variables

`arangod` inspects the following list of environment variables:

 - `ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY`
   
   This variable can be used to override the automatic detection of the total
   amount of RAM present on the system. One can specify a decimal number
   (in bytes). Furthermore, numbers can have the following suffixes:

   - `TB`, `T`, `tb`, `t`: the number is multiplied by 1,000,000,000,000 (terabytes).
   - `GB`, `G`, `gb`, `g`: the number is multiplied by 1,000,000,000 (gigabytes).
   - `MB`, `M`, `mb`, `m`: the number is multiplied by 1,000,000 (megabytes).
   - `KB`, `K`, `kb`, `k`: the number is multiplied by 1,000 (kilobytes).
   - `TIB`, `TiB`, `tib`: the number is multiplied by 1,099,511,627,776 (tebibytes).
   - `GIB`, `GiB`, `gib`: the number is multiplied by 1,073,741,824 (gibibytes).
   - `MIB`, `MiB`, `mib`: the number is multiplied by 1,048,576 (mebibytes).
   - `KIB`, `KiB`, `kib`: the number is multiplied by 1,024 (kibibytes).
   - `B`, `b`: bytes

   The total amount of RAM detected is logged as an INFO message at
   server start. If the variable is set, the overridden value is shown.
   Various default sizes are calculated based on this value (e.g. the
   RocksDB buffer cache size).

   Setting this option can in particular be useful in two cases:

   1. If `arangod` is running in a container and its cgroup has a RAM
      limitation, then one should specify this limitation in this
      environment variable, since it is currently not automatically
      detected.
   2. If `arangod` is running alongside other services on the same
      machine and thus sharing the RAM with them, one should limit the
      amount of memory using this environment variable.

   Note that setting this environment variable mainly affects the default 
   values of startup options that have to do with memory usage. 
   If the values of these startup options are explicitly set anyway, then 
   setting the environment variable has no effect.

   For example, the default value for the RocksDB block cache size
   (`--rocksdb.block-cache-size` startup option) depends on the amount of
   available memory. If you set `ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY=32GB`,
   the default value for the block cache size is `(32GB - 2GB) * 0.3 = 9GB`.
   However, if you set the `--rocksdb.block-cache-size` startup option explicitly
   via a configuration file or via the command-line, then the latter value is
   used, and not the option's default value based on the
   `ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY` environment variable.

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

- `IRESEARCH_TEXT_STOPWORD_PATH`

  Path to a directory with stop word files for
  [ArangoSearch Text Analyzers](analyzers.html#text).

<!-- ARANGODB_CONFIG_PATH, ICU_DATA, ... (TRI_GETENV, iresearch::getenv) -->

For Docker specific environment variables please refer to
[Docker Hub](https://hub.docker.com/_/arangodb){:target="_blank"}
