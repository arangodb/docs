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
data after enabling synchronous replication the Cluster will wait for
all replicas to write all the data before greenlighting the write
operation to the client. This will naturally increase the latency a
bit, since one more network hop is needed for each write. However, it
will enable the cluster to immediately fail over to a replica whenever
an outage has been detected, without losing any committed data, and
mostly without even signaling an error condition to the client. 

Synchronous replication is organized such that every _shard_ has a
_leader_ and `r-1` _followers_, where `r` denotes the replication
factor. The number of _followers_ can be controlled using the
`replicationFactor` parameter whenever you create a _collection_, the
`replicationFactor` parameter is the total number of copies being
kept, that is, it is one plus the number of _followers_.

<!-- Add example -->

In addition to the `replicationFactor` there is a `writeConcern` that
specifies the lowest number of in-sync followers. Specifying the write concern
with a value greater than _1_ locks down a collection's leader shards for
writing as soon as too many followers were lost.

Asynchronous replication
------------------------

In ArangoDB any write operation is logged in the _write-ahead
log_. 

When using asynchronous replication _Followers_ (or _followers_)  
connect to a _Leader_ (or _leader_) and apply locally all the events from
the Leader log in the same order. As a result the _Followers_ (_followers_) 
will have the same state of data as the _Leader_ (_leader_).

_Followers_ (_followers_) are only eventually consistent with the _Leader_ (_leader_).

Transactions are honored in replication, i.e. transactional write operations will 
become visible on _Followers_ atomically.

As all write operations will be logged to a Leader database's _write-ahead log_, the 
replication in ArangoDB currently cannot be used for write-scaling. The main purposes 
of the replication in current ArangoDB are to provide read-scalability and "hot backups" 
of specific databases.

It is possible to connect multiple _Follower_ to the same _Leader_. _Followers_ should be used
as read-only instances, and no user-initiated write operations 
should be carried out on them. Otherwise data conflicts may occur that cannot be solved 
automatically, and that will make the replication stop.

In an asynchronous replication scenario Followers will _pull_ changes 
from the _Leader_. _Followers_ need to know to which _Leader_ they should 
connect to, but a _Leader_ is not aware of the _Followers_ that replicate from it. 
When the network connection between the _Leader_ and a _Follower_ goes down, write 
operations on the Leader can continue normally. When the network is up again, _Followers_ 
can reconnect to the _Leader_ and transfer the remaining changes. This will 
happen automatically provided _Followers_ are configured appropriately.

Before 3.3.0 asynchronous replication was per database. Starting with 3.3.0 it is possible
to setup global replication.

### Replication lag

As described above, write operations are applied first in the _Leader_, and then applied 
in the _Followers_. 

For example, let's assume a write operation is executed in the _Leader_ 
at point in time _t0_. To make a _Follower_ apply the same operation, it must first 
fetch the write operation's data from Leader's write-ahead log, then parse it and 
apply it locally. This will happen at some point in time after _t0_, let's say _t1_. 

The difference between _t1_ and _t0_ is called the _replication lag_, and it is unavoidable 
in asynchronous replication. The amount of replication _lag_ depends on many factors, a 
few of which are:

- the network capacity between the _Followers_ and the _Leader_
- the load of the _Leader_ and the _Followers_
- the frequency in which _Followers_ poll the _Leader_ for updates

Between _t0_ and _t1_, the state of data on the _Leader_ is newer than the state of data
on the _Followers_. At point in time _t1_, the state of data on the _Leader_ and _Followers_
is consistent again (provided no new data modifications happened on the _Leader_ in
between). Thus, the replication will lead to an _eventually consistent_ state of data.

### Replication overhead

As the _Leader_ servers are logging any write operation in the _write-ahead-log_
anyway replication doesn't cause any extra overhead on the _Leader_. However it
will of course cause some overhead for the _Leader_ to serve incoming read
requests of the _Followers_. Returning the requested data is however a trivial
task for the _Leader_ and should not result in a notable performance
degradation in production.
