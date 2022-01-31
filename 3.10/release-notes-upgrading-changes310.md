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


Startup options
---------------

### RocksDB options

The default value of the startup option `--rocksdb.cache-index-and-filter-blocks` changes
from `false` to `true`. This makes RocksDB track all loaded index and filter blocks in the 
block cache, so they are accounted against RocksDB's block cache memory limit. 
The default value for the startup option `--rocksdb.enforce-block-cache-size-limit` also
changes from `false` to `true` to make the RocksDB block cache not temporarily exceed the 
configured memory limit.

These default value changes will make RocksDB adhere much better to the configured memory limit
(configurable via `--rocksdb.block-cache-size`). 
The changes may have a small negative impact on performance because if the block cache is 
not large enough to hold the data plus the index and filter blocks, additional disk I/O may 
need to be performed compared now to previous versions. 
This is a trade-off between memory usage predictability and performance, and ArangoDB 3.10
will default to more stable and predictable memory usage. In case there is still unused RAM 
capacity available, it may be sensible to increase the total size of the RocksDB block cache,
by increasing `--rocksdb.block-cache-size`). Due to the changed configuration, the block 
cache size limit will not be exceeded anymore.

It is possible to opt out of this change and get back the memory and performance characteristics
of previous versions by setting the startup options `--rocksdb.cache-index-and-filter-blocks` 
and `--rocksdb.enforce-block-cache-size-limit` to `false` on startup.


Client tools
------------

### arangobench

Changed flag name from `--concurrency` to `--threads`.

The following deprecated arangobench testcases have been removed from _arangobench_:
* `aqltrx`
* `aqlv8`
* `counttrx`
* `deadlocktrx`
* `multi-collection`
* `multitrx`
* `random-shapes`
* `shapes`
* `shapes-append`
* `skiplist`
* `stream-cursor`

These test cases had been deprecated since ArangoDB 3.9.

The testcase `hash` was renamed to `persistent-index` to better reflect its
scope.

### arangoexport

To improve naming consistency across different client tools, the existing arangoexport `--query` option
was renamed to `--custom-query`.
Using the old option name (`--query`) is still supported and will implicitly use 
the `--custom-query` option under the hood. Client scripts should eventually be
updated to use the new option name though. 
