---
layout: default
description: Important steps to perform before you go live.
title: ArangoDB Production Checklist
---
ArangoDB Production Checklist
=============================

The following checklist can help to understand if important steps
have been performed on your production system before you go live.

Operating System
----------------

- Executed the OS optimization scripts (if you run ArangoDB on Linux).
  See [Installing ArangoDB on Linux](installation-linux.html) for details.

- OS monitoring is in place
  (most common metrics, e.g. disk, CPU, RAM utilization).

- Disk space monitoring is in place
  (only if you use the RocksDB storage engine).

ArangoDB
--------

- The user _root_ is not used to run any ArangoDB processes
  (if you run ArangoDB on Linux).

- The _arangod_ (server) process and the _arangodb_ (_Starter_) process
  (if in use) have some form of logging enabled and you can easily
  locate and inspect them.

- If you use the _Starter_ to deploy, you stopped - and disabled
  automated start of - the ArangoDB _Single Instance_, e.g. on Ubuntu:

  ```
  service arangodb3 stop
  update-rc.d -f arangodb3 remove
  ```

  On Windows in a command prompt with elevated rights:

  ```
  sc config arangodb start= disabled
  sc stop arangodb
  ```

- If you have deployed a Cluster (and/or are using DC2DC) the
  _replication factor_  and _minimal_replication_factor_ of your collections
  is set to a value equal or higher than 2, otherwise you run at the risk of
  losing data in case of node failure. See
  [cluster startup options](programs-arangod-cluster.html).

- Verify that your **storage performance** is at least 100 IOPS for each
  volume in production mode. This is the bare minimum and we would recommend
  providing more for performance. It is probably only a concern if you use
  cloud infrastructure. Note that IOPS might be allotted based on volume size,
  so please check your storage provider for details. Furthermore you should
  be careful with burst mode guarantees as ArangoDB requires a sustainable
  high IOPS rate.

- Whenever possible use **block storage**. Database data is based on append
  operations, so filesystem which support this should be used for best
  performance. We would not recommend to use NFS for performance reasons,
  furthermore we experienced some issues with hard links required for
  Hot Backup.

- Verify your **Backup** and restore procedures are working.

- [EE only] Please consider creating (and safely store) a [secret key](https://www.arangodb.com/docs/latest/security-encryption.html) to enable encryption at rest.


Kubernetes Operator (kube-arangodb)
-----------------------------------

- Check [supported versions](https://github.com/arangodb/kube-arangodb#production-readiness-state){:target="_blank"}
  for Kubernetes, operator and supported Kubernetes distributions.

- The [**ReclaimPolicy**](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming){:target="_blank"}
  of your persistent volumes must be set to `Retain` to prevent volumes
  to be prevent volumes to be prematurely deleted.

- Use native networking whenever possible to reduce delays.
