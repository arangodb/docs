---
layout: default
description: Environment variables for `arangod`
---
# ArangoDB Server environment variables

Currently, `arangod` inspects the following list of environment variables:

 - `ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY`: This variable can be used
   to override the automatic detection of the total amount of RAM
   present on the system. One can specify a decimal number (in bytes).
   Furthermore, if `G` or `g` is appended, the value is multiplied by
   `2^30`, if `M` or `m` is appended, the value is multiplied by `2^20`,
   and if `K` or `k` is appended, the value is multiplied by `2^10`.
   That is, `64G` means 64 gigabytes.

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
