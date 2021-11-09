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

The default value for the startup option `--rocksdb.enable-pipelined-write` was
changed from **false** to **true**.


Client tools
------------


