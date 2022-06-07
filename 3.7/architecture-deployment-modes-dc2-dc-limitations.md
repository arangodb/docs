---
layout: default
description: The datacenter to datacenter replication setup in ArangoDB has a few limitations
---
Limitations
===========

The _datacenter to datacenter replication_ setup in ArangoDB has a few limitations.
Some of these limitations may be removed in later versions of ArangoDB:

- All the machines where the ArangoDB Server processes run must run the Linux
  operating system using the AMD64 architecture. Clients can run from any platform.

- All the machines where the ArangoSync Server processes run must run the Linux
  operating system using the AMD64 architecture.
  The ArangoSync command line tool is available for Linux, Windows & macOS.

- The entire cluster is replicated. It is not possible to exclude specific
  databases or collections from replication.

- In any DC2DC setup, the minor version of the target cluster must be equal to
  or greater than the minor version of the source cluster. Replication from a higher to a 
  lower minor version (i.e., from 3.9.x to 3.8.x) is not supported.
  Syncing between different patch versions of the same minor version is possible, however.
  For example, you cannot sync from a 3.9.1 cluster to a 3.8.7 cluster, but
  you can sync from a 3.9.1 cluster to a 3.9.0 cluster.
