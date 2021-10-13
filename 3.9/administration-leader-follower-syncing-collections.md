---
layout: default
description: In order to synchronize data for a single collection from a Leader to a Follower instance, thereis the syncCollection function
redirect_from:
  - administration-master-slave-syncing-collections.html # 3.8 -> 3.8
---
Syncing Collections
===================

In order to synchronize data for a single collection from a _Leader_ to a _Follower_ instance, there
is the *syncCollection* function:

It will fetch all documents of the specified collection from the Leader database and store 
them in the local instance. After the synchronization, the collection data on the Follower will be
identical to the data on the Leader, provided no further data changes happen on the Leader. 
Any data changes that are performed on the Leader after the synchronization was started will
not be captured by *syncCollection*, but need to be replicated using the regular replication
applier mechanism.
  
For the following example setup, we'll use the instance *tcp://leader.domain.org:8529* as the 
Leader, and the instance *tcp://follower.domain.org:8530* as a Follower.

The goal is to have all data from the collection *test* in database *_system* on Leader 
*tcp://leader.domain.org:8529* be replicated to the collection *test* in database *_system* on 
the Follower *tcp://follower.domain.org:8530*.

On the **Leader**, the collection *test* needs to be present in the *_system* database, with
any data in it.

To transfer this collection to the **Follower**, issue the following commands there:

```js
db._useDatabase("_system");
require("@arangodb/replication").syncCollection("test", {
  endpoint: "tcp://leader.domain.org:8529",
  username: "myuser",
  password: "mypasswd"
});
```

**Warning**: The syncCollection command will replace the collection's data in the Follower database 
with data from the Leader database! Only execute these commands if you have verified you are on 
the correct server, in the correct database!

Setting the optional *incremental* attribute in the call to *syncCollection* will start an
incremental transfer of data. This may be useful in case when the Follower already has
parts or almost all of the data in the collection and only the differences need to be
synchronized. Note that to compute the differences the incremental transfer will build a sorted
list of all document keys in the collection on both the Follower and the Leader, which may still be
expensive for huge collections in terms of memory usage and runtime. During building the list
of keys the collection will be read-locked on the Leader.

The *initialSyncMaxWaitTime* attribute in the call to *syncCollection* controls how long the
Follower will wait for a Leader's response. This wait time can be used to control after what time 
the synchronization will give up and fail. 

The *syncCollection* command may take a long time to complete if the collection is big. The shell
will block until the Follower has synchronized the entire collection from the Leader or until an 
error occurs. By default, the *syncCollection* command in the ArangoShell will poll for a status
update every 10 seconds.

When *syncCollection* is called from the ArangoShell, the optional *async* attribute can be used
to start the synchronization as a background process on the Follower. If *async* is set to *true*,
the call to *syncCollection* will return almost instantly with an id string. Using this id string,
the status of the sync job on the Follower can be queried using the *getSyncResult* function as follows:

```js
db._useDatabase("_system");
var replication = require("@arangodb/replication");

/* run command in async mode */
var id = replication.syncCollection("test", {
  endpoint: "tcp://leader.domain.org:8529",
  username: "myuser",
  password: "mypasswd",
  async: true
});

/* now query the status of our operation */
print(replication.getSyncResult(id));
```

*getSyncResult* will return *false* as long as the synchronization is not complete, and return the
synchronization result otherwise.
