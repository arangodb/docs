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


Maximum Array / Object nesting
------------------------------

When reading any data from JSON or VelocyPack input or when serializing any data to JSON or 
VelocyPack, there is a maximum recursion depth for nested arrays and objects, which is slightly 
below 200. Arrays or Objects with higher nesting than this will cause `Too deep nesting in Array/Object`
exceptions. 
The limit is also enforced when converting any server data to JavaScript in Foxx, or
when sending JavaScript input data from Foxx to a server API.
This maximum recursion depth is hard-coded in arangod and all client tools.

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
