---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.10
---
Incompatible changes in ArangoDB 3.10
=====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.10, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.10:

Foxx / Server console
---------------------

Previously a call to `db._version(true)` inside a Foxx app or the server console
would return a different structure than the same call from arangosh.
Foxx/server console would return `{ <details> }` while arangosh would return
`{ server: ..., license: ..., version: ..., details: { <details> }}`.

This is now unified so that the result structure is always consistent with the
one in arangosh. Any Foxx app or script that ran in the server console which
used `db._version(true)` must now be changed to use `db._version(true).details`
instead.

AQL
---


Indexes
-------

The fulltext index type is now deprecated in favor of [ArangoSearch](arangosearch.html).
Fulltext indexes are still usable in this version of ArangoDB, although their usage is
now discouraged.

### Geo indexes

After an upgrade to 3.10 or higher, consider to drop and recreate geo
indexes. GeoJSON polygons are interpreted slightly differently (and more
correctly) in the newer versions.

Legacy geo indexes will continue to work and continue to produce the
same results as in earlier versions, since they will have the option
`legacyPolygons` implicitly set to `true`.

Newly created indexes will have `legacyPolygons` set to `false` by default
and thus enable the new polygon parsing.

Note that linear rings are not normalized automatically from version 3.10 onward,
following the [GeoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946){:target="_blank"}.
The 'interior' of a polygon strictly conforms to the GeoJSON standard:
it lies to the left of the boundary line (in the direction of travel along the
boundary line on the surface of the Earth). This can be the "larger" connected
component of the surface, or the smaller one. Note that this differs from the
[interpretation of GeoJSON polygons in version 3.9](../3.9/indexing-geo.html#polygon)
and older. This can mean that old polygon GeoJSON data in the database is
suddenly interpreted in a different way. See
[Legacy Polygons](indexing-geo.html#legacy-polygons) for details.

Startup options
---------------

### RocksDB options

The default value of the  `--rocksdb.cache-index-and-filter-blocks` startup option was changed
from `false` to `true`. This makes RocksDB track all loaded index and filter blocks in the 
block cache, so they are accounted against the RocksDB's block cache memory limit. 
The default value for the `--rocksdb.enforce-block-cache-size-limit` startup option was also
changed from `false` to `true` to make the RocksDB block cache not temporarily exceed the 
configured memory limit.

These default value changes will make RocksDB adhere much better to the configured memory limit
(configurable via `--rocksdb.block-cache-size`). 
The changes may have a small negative impact on performance because, if the block cache is 
not large enough to hold the data plus the index and filter blocks, additional disk I/O may 
need to be performed compared to the previous versions. 
This is a trade-off between memory usage predictability and performance, and ArangoDB 3.10
will default to more stable and predictable memory usage. If there is still unused RAM 
capacity available, it may be sensible to increase the total size of the RocksDB block cache,
by increasing `--rocksdb.block-cache-size`. Due to the changed configuration, the block 
cache size limit will not be exceeded anymore.

It is possible to opt out of these changes and get back the memory and performance characteristics
of the previous versions by setting the `--rocksdb.cache-index-and-filter-blocks` 
and `--rocksdb.enforce-block-cache-size-limit` startup options to `false` on startup.

### Pregel options

Pregel jobs now have configurable minimum, maximum and default parallelism values. These
can be set by the following startup options:

- `--pregel.min-parallelism`: minimum parallelism usable in Pregel jobs. Defaults to `1`.
- `--pregel.max-parallelism`: maximum parallelism usable in Pregel jobs. Defaults to the
  number of available cores.
- `--pregel.parallelism`: default parallelism to use in Pregel jobs. Defaults to the number
  of available cores divided by 4. The result will be clamped to a value between 1 and 16.

The default values of these options may be different than parallelism values effectively
used by previous versions, so it is advised to explicitly set the desired parallelism
values in ArangoDB 3.10.

Pregel now also stores its temporary data in memory-mapped files on disk by default, whereas 
in previous versions the default behavior was to buffer it in RAM.
Storing temporary data in memory-mapped files rather than in RAM has the advantage that
the RAM usage can be kept lower, which reduces the likelihood of out-of-memory situations.
However, storing the files on disk requires disk capacity, so that instead of running out
of RAM it is now possible to run out of disk space.

It is thus advised to set the storage location for Pregel's memory-mapped files explicitly
in ArangoDB 3.10. The following startup options are available for the configuration of
memory-mapped files:

- `--pregel.memory-mapped-files`: if set to `true`, Pregel jobs will by
  default store their temporary data in disk-backed memory-mapped files.
  If set to `false`, the temporary data of Pregel jobs will be buffered in
  RAM. The default value is `true`, meaning that memory-mapped files will
  be used. The option can be overriden for each Pregel job by setting the
  `useMemoryMaps` option of the job.

- `--pregel.memory-mapped-files-location-type`: location for memory-mapped
  files written by Pregel. This option is only meaningful if memory-mapped
  files are actually used. The option can have one of the following values:
  - `temp-directory`: store memory-mapped files in the temporary directory,
    as configured via `--temp.path`. If `--temp.path` is not set, the
    system's temporary directory will be used.
  - `database-directory`: store memory-mapped files in a separate directory
    underneath the database directory.
  - `custom`: use a custom directory location for memory-mapped files. The
    exact location must be set via the configuration parameter
    `--pregel.memory-mapped-files-custom-path`.

  The default value for this option is `temp-directory`.

- `--pregel.memory-mapped-files-custom-path`: custom directory location for
  Pregel's memory-mapped files. This setting can only be used if the option
  `--pregel.memory-mapped-files-location-type` is set to `custom`.

The default location for Pregel's memory-mapped files is the temporary directory 
(`temp-directory`), which may not provide enough capacity for larger Pregel jobs.
It may be more sensible to configure a custom directory for memory-mapped files
and provide the necessary disk space there (`custom`). Such custom directory can 
be mounted on ephemeral storage, as the files are only needed temporarily.

There is also the option to use a subdirectory of the database directory
as the storage location for the memory-mapped files (`database-directory`).
The database directory often provides a lot of disk space capacity, but when 
Pregel's temporary files are stored in there too, it has to provide enough capacity 
to store both the regular database data and the Pregel files.

Maximum Array / Object nesting
------------------------------

When reading any data from JSON or VelocyPack input or when serializing any data to JSON or 
VelocyPack, there is a maximum recursion depth for nested arrays and objects, which is slightly 
below 200. Arrays or objects with higher nesting than this will cause `Too deep nesting in Array/Object`
exceptions. 
The limit is also enforced when converting any server data to JavaScript in Foxx, or
when sending JavaScript input data from Foxx to a server API.
This maximum recursion depth is hard-coded in arangod and all client tools.

Client tools
------------

### arangobench

Renamed the `--concurrency` startup option to `--threads`.

The following deprecated arangobench testcases have been removed from _arangobench_:
- `aqltrx`
- `aqlv8`
- `counttrx`
- `deadlocktrx`
- `multi-collection`
- `multitrx`
- `random-shapes`
- `shapes`
- `shapes-append`
- `skiplist`
- `stream-cursor`

These test cases had been deprecated since ArangoDB 3.9.

The testcase `hash` was renamed to `persistent-index` to better reflect its
scope.

### arangoexport

To improve naming consistency across different client tools, the existing
_arangoexport_ startup options `--query` and `--query-max-runtime` were renamed
to `--custom-query` and `--custom-query-max-runtime`.

Using the old option names (`--query` and `--query-max-runtime`) is still
supported and will implicitly use the `--custom-query` and
`--custom-query-max-runtime` options under the hood. Client scripts should
eventually be updated to use the new option name, however.
