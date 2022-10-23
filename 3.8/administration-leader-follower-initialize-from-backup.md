---
layout: default
description: A Follower can be faster initialized using a backup of the Leader in Leader/Follower replication.
title: Speeding up Follower initialization
redirect_from:
  - administration-master-slave-initialize-from-backup.html # 3.8 -> 3.8
---
# Speeding up Follower initialization

If you have a very big database and want to set up a Leader/Follower replication
between two or more ArangoDB instances, then transferring the entire database
over the network may take a long time. In order to speed-up the replication
initialization process the Follower can be initialized **using a backup** of
the Leader.

For the following example setup, we will use the instance with endpoint
`tcp://leader.domain.org:8529` as Leader, and the instance with endpoint
`tcp://follower.domain.org:8530` as Follower.

The goal is to have all data from the database ` _system` on Leader replicated
to the database `_system` on the Follower (the same process can be applied for
other databases).

## Preparation

First of all you have to start the Leader server, using a command like the above:

```sh
arangod --server.endpoint tcp://leader.domain.org:8529
```

Next, you should adjust the `--rocksdb.wal-file-timeout` storage engine
option that defines the timeout after which unused WAL files are deleted in
seconds (default: 10).

The option prevents the premature removal of old WAL files from the Leader,
and are useful in case intense write operations happen on the Leader while you
are initializing the Follower. In fact, if you do not tune this option, what can
happen is that the Leader WAL files do not include all the write operations that
happened after the backup is taken. This may lead to situations in which the
initialized Follower is missing some data, or fails to start.

Now you have to create a dump from the Leader using the tool `arangodump`:

```sh
arangodump --output-directory "dump" --server.endpoint tcp://leader.domain.org:8529
```

Please adapt the `arangodump` command to your specific case.

The following is a possible `arangodump` output:

```sh
Server version: 3.3
Connected to ArangoDB 'tcp://leader.domain.org:8529', database: '_system', username: 'root'
Writing dump to output directory 'dump'
Last tick provided by server is: 37276350
# Dumping document collection 'TestNums'...
# Dumping document collection 'TestNums2'...
# Dumping document collection 'frenchCity'...
# Dumping document collection 'germanCity'...
# Dumping document collection 'persons'...
# Dumping edge collection 'frenchHighway'...
# Dumping edge collection 'germanHighway'...
# Dumping edge collection 'internationalHighway'...
# Dumping edge collection 'knows'...
Processed 9 collection(s), wrote 1298855504 byte(s) into datafiles, sent 32 batch(es)
```

In line *4* the last server `tick` is displayed. This value will be useful when
we will start the replication, to have the `replication-applier` start
replicating exactly from that `tick`.

Next you have to start the Follower:

```sh
arangod --server.endpoint tcp://follower.domain.org:8530
```

If you are running Leader and Follower on the same server (just for test), please
make sure you give your Follower a different data directory.

Now you are ready to restore the dump with the tool `arangorestore`:

```sh
arangorestore --input-directory "dump" --server.endpoint tcp://follower.domain.org:8530
```

Again, please adapt the command above in case you are using a database different
than `_system`.

Once the restore is finished there are two possible approaches to start the
replication:

1. with sync check (slower, but easier)
2. without sync check (faster, but last server tick needs to be provided correctly)

### Approach 1: All-in-one setup

Start replication on the Follower with `arangosh` using the following command:

```sh
arangosh --server.endpoint tcp://follower.domain.org:8530
```

```js
db._useDatabase("_system");
require("@arangodb/replication").setupReplication({
  endpoint: "tcp://leader.domain.org:8529",
  username: "myuser",
  password: "mypasswd",
  verbose: false,
  includeSystem: false,
  incremental: true,
  autoResync: true
});
```

The following is the printed output:

```sh
still synchronizing... last received status: 2017-12-06T14:06:25Z: fetching collection keys for collection 'TestNums' from /_api/replication/keys/keys?collection=7173693&to=57482456&serverId=24282855553110&batchId=57482462
still synchronizing... last received status: 2017-12-06T14:06:25Z: fetching collection keys for collection 'TestNums' from /_api/replication/keys/keys?collection=7173693&to=57482456&serverId=24282855553110&batchId=57482462
[...]
still synchronizing... last received status: 2017-12-06T14:07:13Z: sorting 10000000 local key(s) for collection 'TestNums'
still synchronizing... last received status: 2017-12-06T14:07:13Z: sorting 10000000 local key(s) for collection 'TestNums'
[...]
still synchronizing... last received status: 2017-12-06T14:09:10Z: fetching leader collection dump for collection 'TestNums3', type: document, id 37276943, batch 2, markers processed: 15278, bytes received: 2097258
still synchronizing... last received status: 2017-12-06T14:09:18Z: fetching leader collection dump for collection 'TestNums5', type: document, id 37276973, batch 5, markers processed: 123387, bytes received: 17039688
[...]
still synchronizing... last received status: 2017-12-06T14:13:49Z: fetching leader collection dump for collection 'TestNums5', type: document, id 37276973, batch 132, markers processed: 9641823, bytes received: 1348744116
still synchronizing... last received status: 2017-12-06T14:13:59Z: fetching collection keys for collection 'frenchCity' from /_api/replication/keys/keys?collection=27174045&to=57482456&serverId=24282855553110&batchId=57482462
{ 
  "state" : { 
    "running" : true, 
    "lastAppliedContinuousTick" : null, 
    "lastProcessedContinuousTick" : null, 
    "lastAvailableContinuousTick" : null, 
    "safeResumeTick" : null, 
    "progress" : { 
      "time" : "2017-12-06T14:13:59Z", 
      "message" : "send batch finish command to url /_api/replication/batch/57482462?serverId=24282855553110", 
      "failedConnects" : 0 
    }, 
    "totalRequests" : 0, 
    "totalFailedConnects" : 0, 
    "totalEvents" : 0, 
    "totalOperationsExcluded" : 0, 
    "lastError" : { 
      "errorNum" : 0 
    }, 
    "time" : "2017-12-06T14:13:59Z" 
  }, 
  "server" : { 
    "version" : "3.3.devel", 
    "serverId" : "24282855553110" 
  }, 
  "endpoint" : "tcp://leader.domain.org:8529", 
  "database" : "_system" 
}
```

This is the same command that you would use to start replication even without
taking a backup first. The difference, in this case, is that the data that is
present already on the Follower (and that has been restored from the backup) this
time is not transferred over the network from the Leader to the Follower.

The command above will only check that the data already included in the Follower
is in sync with the Leader. After this check, the `replication-applier` will
make sure that all write operations that happened on the Leader after the
backup are replicated on the Follower.

While this approach is definitely faster than transferring the whole database
over the network, since a sync check is performed, it can still require some time.

### Approach 2: Apply replication by tick

In this approach, the sync check described above is not performed. As a result
this approach is faster as the existing Follower data is not checked.
Write operations are executed starting from the `tick` you provide and continue
with the Leader's available `ticks`.

This is still a secure way to start replication as far as the correct `tick`
is passed.

As previously mentioned the last `tick` provided by the Leader is displayed
when using `arangodump`. In our example the last tick was **37276350**.

First of all you have to apply the properties of the replication, using
`arangosh` on the Follower:

```sh
arangosh --server.endpoint tcp://follower.domain.org:8530
```

```js
db._useDatabase("_system");
require("@arangodb/replication").applier.properties({
  endpoint: "tcp://leader.domain.org:8529",
  username: "myuser",
  password: "mypasswd",
  verbose: false,
  includeSystem: false,
  incremental: true,
  autoResync: true});
```

Then you can start the replication with the last provided `logtick` of the
Leader (output of `arangodump`):

```js
require("@arangodb/replication").applier.start(37276350)
```

The following is the printed output:

```sh
{ 
  "state" : { 
    "running" : true, 
    "lastAppliedContinuousTick" : null, 
    "lastProcessedContinuousTick" : null, 
    "lastAvailableContinuousTick" : null, 
    "safeResumeTick" : null, 
    "progress" : { 
      "time" : "2017-12-06T13:26:04Z", 
      "message" : "applier initially created for database '_system'", 
      "failedConnects" : 0 
    }, 
    "totalRequests" : 0, 
    "totalFailedConnects" : 0, 
    "totalEvents" : 0, 
    "totalOperationsExcluded" : 0, 
    "lastError" : { 
      "errorNum" : 0 
    }, 
    "time" : "2017-12-06T13:33:25Z" 
  }, 
  "server" : { 
    "version" : "3.3.devel", 
    "serverId" : "176090204017635" 
  }, 
  "endpoint" : "tcp://leader.domain.org:8529", 
  "database" : "_system" 
}
```

After the replication has been started with the command above, you can use the
`applier.state` command to check how far the last applied `tick` on the Follower
is far from the last available Leader `tick`:

```sh
require("@arangodb/replication").applier.state()
{ 
  "state" : { 
    "running" : true, 
    "lastAppliedContinuousTick" : "42685113", 
    "lastProcessedContinuousTick" : "42685113", 
    "lastAvailableContinuousTick" : "57279944", 
    "safeResumeTick" : "37276974", 
    "progress" : { 
      "time" : "2017-12-06T13:35:25Z", 
      "message" : "fetching leader log from tick 42685113, first regular tick 37276350, barrier: 0, open transactions: 1", 
      "failedConnects" : 0 
    }, 
    "totalRequests" : 190, 
    "totalFailedConnects" : 0, 
    "totalEvents" : 2704032, 
    "totalOperationsExcluded" : 0, 
    "lastError" : { 
      "errorNum" : 0 
    }, 
    "time" : "2017-12-06T13:35:25Z" 
  }, 
  "server" : { 
    "version" : "3.3.devel", 
    "serverId" : "176090204017635" 
  }, 
  "endpoint" : "tcp://leader.domain.org:8529", 
  "database" : "_system" 
}
```
