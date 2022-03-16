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

- In any DC2DC setup the minor version of the target cluster must be at least
  as big as the minor version of the source cluster. That is, for example, you
  cannot sync from a 3.9.1 cluster to a 3.8.7 cluster. You can sync
  between different patch versions within the same minor version.
