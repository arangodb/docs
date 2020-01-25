---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.7
---
Incompatible changes in ArangoDB 3.7
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.7, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.7:

DC2DC
-----

The replication in DC2DC deployments relies on a message queue and ArangoSync
supported two different message queue systems up to and including version
0.7.2. **Support for Kafka is dropped in ArangoSync v1.0.0** and the built-in
DirectMQ remains as sole message queue system.

If you rely on Kafka, then you must use an ArangoSync 0.x version. ArangoDB
v3.7 ships with ArangoSync 1.x, so be sure to keep the old binary or download
a compatible version for your deployment. ArangoSync 1.x is otherwise
compatible with ArangoDB v3.3 and above.
