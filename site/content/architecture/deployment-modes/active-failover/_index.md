---
fileID: architecture-deployment-modes-active-failover
title: Active Failover
weight: 805
description: 
layout: default
---
An _Active Failover_ is defined as:

- One ArangoDB Single-Server instance which is read / writable by clients called **Leader**
- One or more ArangoDB Single-Server instances, which are passive and not writable 
  called **Followers**, which asynchronously replicate data from the Leader
- At least one _Agency_ acting as a "witness" to determine which server becomes the _leader_
  in a _failure_ situation

![ArangoDB Active Failover](/images/leader-follower.png)

The advantage of the _Active Failover_ setup is that there is an active third party, the _Agency_,
which observes and supervises all involved server processes.
_Follower_ instances can rely on the _Agency_ to determine the correct _Leader_ server.
From an operational point of view, one advantage is that
the failover, in case the _Leader_ goes down, is automatic. An additional operational
advantage is that there is no need to start a _replication applier_ manually.

The _Active Failover_ setup is made **resilient** by the fact that all the official
ArangoDB drivers can automatically determine the correct _leader_ server and
redirect requests appropriately. Furthermore, Foxx Services do also automatically
perform a failover: should the _leader_ instance fail (which is also the _Foxxmaster_)
the newly elected _leader_ will reinstall all Foxx services and resume executing
queued [Foxx tasks](../../../foxx-microservices/guides/foxx-guides-scripts).
[Database users](../../../administration/user-management/)
which were created on the _leader_ will also be valid on the newly elected _leader_
(always depending on the condition that they were synced already).

Consider the case for two *arangod* instances. The two servers are connected via
server wide (global) asynchronous replication. One of the servers is
elected _Leader_, and the other one is made a _Follower_ automatically. At startup,
the two servers race for the leadership position. This happens through the _Agency
locking mechanism_ (which means that the _Agency_ needs to be available at server start).
You can control which server becomes the _Leader_ by starting it earlier than
other server instances in the beginning.

The _Follower_ automatically starts replication from the _Leader_ for all
available databases, using the server-level replication introduced in v. 3.3.

When the _Leader_ goes down, this is automatically detected by the _Agency_
instance, which is also started in this mode. This instance will make the
previous follower stop its replication and make it the new _Leader_.

{{% hints/info %}}
The different instances participating in an Active Failover setup are supposed
to be run in the same _Data Center_ (DC), with a reliable high-speed network
connection between all the machines participating in the Active Failover setup.

Multi-datacenter Active Failover setups are currently not supported.

A multi-datacenter solution currently supported is the _Datacenter-to-Datacenter Replication_
(DC2DC) among ArangoDB Clusters. See [DC2DC](../../../arangosync/deployment/) chapter for details.
{{% /hints/info %}}

## Operative Behavior

In contrast to the normal behavior of a single-server instance, the Active-Failover
mode can change the behavior of ArangoDB in some situations.

The _Follower_ will _always_ deny write requests from client applications. Starting from ArangoDB 3.4,
read requests are _only_ permitted if the requests are marked with the `X-Arango-Allow-Dirty-Read: true` header,
otherwise they are denied too.
Only the replication itself is allowed to access the follower's data until the
follower becomes a new _Leader_ (should a _failover_ happen).

When sending a request to read or write data on a _Follower_, the _Follower_
responds with `HTTP 503 (Service unavailable)` and provides the address of
the current _Leader_. Client applications and drivers can use this information to
then make a follow-up request to the proper _Leader_:

{{< tabs >}}
{{% tab name="" %}}
```
HTTP/1.1 503 Service Unavailable
X-Arango-Endpoint: http://[::1]:8531
....
```
{{% /tab %}}
{{< /tabs >}}

Client applications can also detect who the current _Leader_ and the _Followers_
are by calling the `/_api/cluster/endpoints` REST API. This API is accessible
on _Leader_ and _Followers_ alike.

## Reading from Followers

Followers in the active-failover setup are in read-only mode. It is possible to read from these
followers by adding a `X-Arango-Allow-Dirty-Read: true` header on each request. Responses will then automatically
contain the `X-Arango-Potential-Dirty-Read: true` header so that clients can reject accidental dirty reads.

Depending on the driver support for your specific programming language, you should be able
to enable this option.

## How to deploy

The tool _ArangoDB Starter_ supports starting two servers with asynchronous
replication and failover [out of the box](deployment-active-failover-using-the-starter).

The _arangojs_ driver for JavaScript, the Go driver, the Java driver, ArangoJS and
the PHP driver support active failover in case the currently accessed server endpoint
responds with `HTTP 503`.

You can also deploy an *Active Failover* environment [manually](deployment-active-failover-manual-start).

## Limitations

The _Active Failover_ setup in ArangoDB has a few limitations. Some of these limitations 
may be removed in later versions of ArangoDB:

- Should you add more than one _follower_, be aware that during a _failover_ situation
  the failover attempts to pick the most up to date follower as the new leader on a **best-effort** basis. 
- In contrast to full ArangoDB Cluster (with synchronous replication), there is **no guarantee** on 
  how many database operations may have been lost during a failover.
- Should you be using the [ArangoDB Starter](../../../programs-tools/arangodb-starter/) 
  or the [Kubernetes Operator](../../../deployment/by-technology/kubernetes/) to manage your Active-Failover
  deployment, be aware that upgrading might trigger an unintentional failover between machines.