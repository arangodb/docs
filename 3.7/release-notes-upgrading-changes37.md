---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.7
---
Incompatible changes in ArangoDB 3.7
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.7, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.7:

MMFiles storage engine
----------------------

This version of ArangoDB does not allow creating any new deployments with the
MMFiles storage engine. All storage engine selection functionality has been removed
from the ArangoDB package installers. The RocksDB storage engine will be selected
for any new deployments created with ArangoDB 3.7.
The RocksDB storage engine is the default storage engine since ArangoDB 3.4, and
the MMFiles storage engine has been deprecated in ArangoDB 3.6.

Deployments upgrading from ArangoDB 3.6 that are using the MMFiles storage engine 
will still continue to work in ArangoDB 3.7. However, 3.7 will be the last ArangoDB
version supporting the MMFiles storage engines, so users are asked to migrate to the
RocksDB storage engine soon.

HTTP REST API
-------------

### HTTP REST API endpoints moved

The following existing REST APIs have moved in ArangoDB 3.7 to improve API
naming consistency:

* the endpoint at `/_admin/clusterNodeVersion` is now merely redirecting requests
  to the `/_admin/cluster/nodeVersion` endpoint. The new endpoint will handle
  incoming requests in the same way the old endpoint did.
* the endpoint at `/_admin/clusterNodeEngine` is now merely redirecting requests
  to the endpoint `/_admin/cluster/nodeEngine`. The new endpoint will handle
  incoming requests in the same way the old endpoint did.
* the endpoint at `/_admin/clusterNodeStats` is now merely redirecting requests
  to the endpoint `/_admin/cluster/nodeStatistics`. The new endpoint will handle
  incoming requests in the same way the old endpoint did.
* the endpoint at `/_admin/clusterStatistics` is now merely redirecting requests
  to the endpoint `/_admin/cluster/statistics`. The new endpoint will handle
  incoming requests in the same way the old endpoint did.

The above endpoints are part of ArangoDB's exposed REST API, however, they are
not supposed to be called directly by drivers or client

### HTTP REST API endpoints removed

The REST API endpoint at `/_admin/aql/reload` has been removed in ArangoDB 3.7. 
There is no necessity to call this endpoint from a driver or a client application
directly.

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
