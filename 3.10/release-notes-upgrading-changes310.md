---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.10
---
Incompatible changes in ArangoDB 3.10
=====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.10, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.10:

AQL
---



Startup options
---------------



Client tools
------------

### arangobench

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

The existing arangoexport option `--query` was renamed to `--custom-query`, for
improved naming consistency across different client tools.
Using the old option name `--query` is still supported and will implicitly use 
the option `--custom-query` under the hood. Client scripts should eventually be
updated to use the new option name though. 
