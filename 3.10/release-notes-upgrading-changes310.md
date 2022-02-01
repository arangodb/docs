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

After an upgrade from a version below 3.10 to a version of 3.10 and
higher, we recommend to drop and recreate geo indexes. The reason is
that we interpret GeoJSON polygons slightly differently (and more
correctly) in the newer versions.

Legacy geo indexes will continue to work and continue to produce the
same results as in earlier versions, since they will have the flag
`legacyPolygons` implicitly set to `true`.

Newly created indexes will have `legacyPolygons` by default set to
`false` and thus enable the new polygon parsing.
See [Legacy Polygons](indexing-geo.html#legacy-polygons) for details.

Note that in particular linear rings which are boundaries of polygons
will no longer be automatically "normalized". This means that the
"interior" of a polygon will now be - strictly conforming to the GeoJSON
standard - to the left of the boundary line (in the direction of travel).
This can be the "larger" connected component of the surface or the
smaller one. This can mean that old polygon GeoJSON data in the database
is suddenly interpreted in a different way. Users need to be aware of
this.
See [Legacy Polygons](indexing-geo.html#legacy-polygons) for details.

Startup options
---------------



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
