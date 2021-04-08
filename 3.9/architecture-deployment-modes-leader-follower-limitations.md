---
layout: default
description: The Leader/Follower setup in ArangoDB has a few limitations
redirect_from:
  - architecture-deployment-modes-master-slave-limitations.html # 3.8 -> 3.8
---
Leader/Follower Limitations
===========================

The Leader/Follower setup in ArangoDB has a few limitations. Some of these limitations
may be removed in later versions of ArangoDB:

* there is no feedback from the Followers to the Leader. If a Follower cannot apply an event
  it got from the Leader, the Leader will have a different state of data. In this 
  case, the _replication applier_ on the Follower will stop and report an error. Administrators
  can then either "fix" the problem or re-sync the data from the Leader to the Follower
  and start the applier again.
* at the moment it is assumed that only the _replication applier_ executes write 
  operations on a Follower. ArangoDB currently does not prevent users from carrying out
  their own write operations on Followers, though this might lead to undefined behavior
  and the _replication applier_ stopping.
* when a replication Follower asks a Leader for log events, the replication Leader will 
  return all write operations for user-defined collections, but it will exclude write
  operations for certain system collections. The following collections are excluded
  intentionally from replication: *_apps*, *_trx*, *_replication*, *_configuration*,
  *_jobs*, *_queues*, *_sessions*, *_foxxlog* and all statistics collections.
  Write operations for the following system collections can be queried from a Leader: 
  *_aqlfunctions*, *_graphs*, *_users*.
* Foxx applications consist of database entries and application scripts in the file system.
  The file system parts of Foxx applications are not tracked anywhere and thus not 
  replicated in current versions of ArangoDB. To replicate a Foxx application, it is
  required to copy the application to the remote server and install it there using the
  *foxx-manager* utility. 
* Leader servers do not know which Followers are or will be connected to them. All servers
  in a replication setup are currently only loosely coupled. There currently is no way 
  for a client to query which servers are present in a replication.
* failover must be handled by clients or client APIs.
* the _replication applier_ is single-threaded, but write operations on the Leader may
  be executed in parallel if they affect different collections. Thus the _replication
  applier_ might not be able to catch up with a very powerful and loaded Leader.
* replication is only supported between the two ArangoDB servers running the same
  ArangoDB version. It is currently not possible to replicate between different ArangoDB 
  versions.
* a _replication applier_ cannot apply data from itself.
