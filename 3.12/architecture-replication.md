---
layout: default
description: Replication allows you to replicate data onto another machine
---
Replication
===========

Replication allows you to *replicate* data onto another machine. It
forms the base of all disaster recovery and failover features ArangoDB
offers. 

ArangoDB offers **synchronous** and **asynchronous** replication.

Synchronous replication is used between the _DB-Servers_ of an ArangoDB
Cluster.

Asynchronous replication is used:

- between the _Leader_ and the _Follower_ of an ArangoDB
  [_Active Failover_](architecture-deployment-modes-active-failover.html) setup
- between multiple ArangoDB [Data Centers](deployment-dc2dc.html)
  (inside the same Data Center replication is synchronous)

Synchronous replication
-----------------------

Synchronous replication only works within an ArangoDB Cluster and is typically
used for mission critical data which must be accessible at all
times. Synchronous replication generally stores a copy of a shard's
data on another DB-Server and keeps it in sync. Essentially, when storing
data after enabling synchronous replication, the Cluster waits for
all replicas to write all the data before green-lighting the write
operation to the client. This naturally increases the latency a
bit, since one more network hop is needed for each write. However, it
enables the cluster to immediately fail over to a replica whenever
an outage is detected, without losing any committed data, and
mostly without even signaling an error condition to the client. 

Synchronous replication is organized such that every _shard_ has a
_leader_ and `r - 1` _followers_, where `r` denotes the **replication factor**.
The replication factor is the total number of copies that are kept, that is, the
leader and follower count combined. For example, with a replication factor of
`3`, there is one _leader_ and `3 - 1 = 2` _followers_. You can control the
number of _followers_ using the `replicationFactor` parameter whenever you
create a _collection_, by setting a `replicationFactor` one higher than the
desired number of followers. You can also adjust the value later.

You cannot set a `replicationFactor` higher than the number of available
DB-Servers by default. You can bypass the check when creating a collection by
setting the `enforceReplicationFactor` option to `false`. You cannot bypass it
when adjusting the replication factor later. Note that the replication factor
is not decreased but remains the same during a DB-Server node outage.

In addition to the replication factor, there is a **writeConcern** that
specifies the minimum number of in-sync followers required for write operations.
If you specify the `writeConcern` parameter with a value greater than `1`, the
collection's leader shards are locked down for writing as soon as too few
followers are available.

Asynchronous replication
------------------------

When using asynchronous replication, _Followers_ connect to a _Leader_ and apply
all the events from the Leader log in the same order locally. As a result, the
_Followers_ end up with the same state of data as the _Leader_.

_Followers_ are only eventually consistent with the _Leader_.

Transactions are honored in replication, i.e. transactional write operations 
become visible on _Followers_ atomically.

All write operations are logged to the Leader's _write-ahead log_. Therefore,
asynchronous replication in ArangoDB cannot be used for write-scaling. The main
purposes of this type of replication are to provide read-scalability and
hot standby servers for _Active Failover_ deployments.

It is possible to connect multiple _Follower_ to the same _Leader_. _Followers_
should be used as read-only instances, and no user-initiated write operations 
should be carried out on them. Otherwise, data conflicts may occur that cannot
be solved automatically, and this makes the replication stop.

In an asynchronous replication scenario, Followers _pull_ changes
from the _Leader_. _Followers_ need to know to which _Leader_ they should 
connect to, but a _Leader_ is not aware of the _Followers_ that replicate from it. 
When the network connection between the _Leader_ and a _Follower_ goes down, write 
operations on the Leader can continue normally. When the network is up again, _Followers_ 
can reconnect to the _Leader_ and transfer the remaining changes. This 
happens automatically, provided _Followers_ are configured appropriately.

### Replication lag

As described above, write operations are applied first in the _Leader_, and then applied 
in the _Followers_. 

For example, let's assume a write operation is executed in the _Leader_ 
at point in time _t0_. To make a _Follower_ apply the same operation, it must first 
fetch the write operation's data from Leader's write-ahead log, then parse it and 
apply it locally. This happens at some point in time after _t0_, let's say _t1_. 

The difference between _t1_ and _t0_ is called the _replication lag_, and it is unavoidable 
in asynchronous replication. The amount of replication _lag_ depends on many factors, a 
few of which are:

- the network capacity between the _Followers_ and the _Leader_
- the load of the _Leader_ and the _Followers_
- the frequency in which _Followers_ poll the _Leader_ for updates

Between _t0_ and _t1_, the state of data on the _Leader_ is newer than the state of data
on the _Followers_. At point in time _t1_, the state of data on the _Leader_ and _Followers_
is consistent again (provided no new data modifications happened on the _Leader_ in
between). Thus, the replication leads to an _eventually consistent_ state of data.

### Replication overhead

As the _Leader_ servers are logging any write operation in the _write-ahead-log_
anyway, replication doesn't cause any extra overhead on the _Leader_. However, it
causes some overhead for the _Leader_ to serve incoming read
requests of the _Followers_. However, returning the requested data is a trivial
task for the _Leader_ and should not result in a notable performance
degradation in production.
