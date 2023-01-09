---
fileID: deployment-production-checklist
title: ArangoDB Production Checklist
weight: 960
description: 
layout: default
---
The following checklist can help to understand if important steps
have been performed on your production system before you go live.

## Operating System

- Executed the OS optimization scripts if you run ArangoDB on Linux.
  See [Installing ArangoDB on Linux](../installation/linux/) for details.

- OS monitoring is in place
  (most common metrics, e.g. disk, CPU, RAM utilization).

- Disk space monitoring is in place. Consider setting up alerting to avoid out-of-disk situations.

## ArangoDB

- The user _root_ is not used to run any ArangoDB processes
  (if you run ArangoDB on Linux).

- The _arangod_ (server) process and the _arangodb_ (_Starter_) process
  (if in use) have some form of logging enabled and logs can easily be
  located and inspected.
  
- *Memory considerations*
  - If you run multiple processes (e.g. DB-Server and Coordinator) on a single
    machine, adjust the [`ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY`](../programs-tools/arangodb-server/programs-arangod-env-vars)
    environment variable accordingly.
  - For versions prior to 3.8, make sure to change the
    [`--query.memory-limit`](../programs-tools/arangodb-server/programs-arangod-options#--querymemory-limit)
    query option according to the node size and workload.
  - Disable swap space to avoid slowdown which can result in servers being incorrectly 
    detected as failed.

- Ensure ArangoDB will be automatically restarted (e.g. by using a systemd service file). Typically
  you would use the Kubernetes operator or use systemd to launch the _Starter_.

- If you use the _Starter_ to deploy, you stopped - and disabled
  automated start of - the ArangoDB _Single Instance_, e.g. on Ubuntu:

  {{< tabs >}}
{{% tab name="" %}}
```
  service arangodb3 stop
  update-rc.d -f arangodb3 remove
  ```
{{% /tab %}}
{{< /tabs >}}

  On Windows in a command prompt with elevated rights:

  {{< tabs >}}
{{% tab name="" %}}
```
  sc config arangodb start= disabled
  sc stop arangodb
  ```
{{% /tab %}}
{{< /tabs >}}
  
- If you have deployed a Cluster, the _replication factor_  and 
  _minimal_replication_factor_ of your collections
  are set to a value equal or higher than 2, otherwise you run the risk of
  losing data in case of a node failure. See
  [cluster startup options](../programs-tools/arangodb-server/programs-arangod-options#cluster).

- *Disk Performance considerations*
  - Verify that your **storage performance** is at least 100 IOPS for each
    volume in production mode. This is the bare minimum and it's recommended to
    provide more for performance. It is probably only a concern if you use a
    cloud infrastructure. Note that IOPS might be allotted based on a volume size,
    so make sure to check your storage provider for details. Furthermore, you should
    be careful with burst mode guarantees as ArangoDB requires a sustainable
    high IOPS rate. 

  - The considerations should be given to an IO bandwidth (especially considering 
    RocksDB write-amplification which can easily be 10x or more).

- Whenever possible use **block storage**. Database data is based on append
  operations, so filesystem which support this should be used for best
  performance. We would not recommend to use NFS for performance reasons,
  furthermore we experienced some issues with hard links required for
  Hot Backup.

- Verify your **Backup** and restore procedures are working.

- Consider enabling [Encryption at Rest](../security/security-encryption)
  (Enterprise Edition only). Make sure to safely store any secret keys you
  create for this.

- Monitor the ArangoDB provided metrics (e.g. by using Prometheus/Grafana).

## Kubernetes Operator (kubearangodb)

- Check [supported versions](https://github.com/arangodb/kube-arangodb#production-readiness-state)
  for Kubernetes, operator and supported Kubernetes distributions.

- The [**ReclaimPolicy**](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming)
 of your persistent volumes should be set to `Retain` to prevent volumes from premature deletion.

- Use native networking whenever possible to reduce delays.
