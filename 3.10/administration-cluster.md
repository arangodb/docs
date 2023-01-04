---
layout: default
description: ArangoDB Cluster Administration
---
Cluster Administration
======================

This section includes information related to the administration of an ArangoDB Cluster.

For a general introduction to the ArangoDB Cluster, please refer to the
[Cluster](architecture-deployment-modes-cluster-architecture.html) chapter.

There is also a detailed
[Cluster Administration Course](https://www.arangodb.com/learn/operations/cluster-course/){:target="_blank"}
for download.

Enabling synchronous replication
--------------------------------

For an introduction about _Synchronous Replication_ in Cluster, please refer
to the [_Cluster Architecture_](architecture-deployment-modes-cluster-architecture.html#synchronous-replication) section. 

You can enable synchronous replication per _collection_. When you create a
_collection_, you may specify the number of _replicas_ using the
`replicationFactor` parameter. You can also adjust it later. The default value
is set to `1`, which effectively *disables* synchronous replication among
_DB-Servers_.

Whenever you specify a _replication factor_ greater than `1`, synchronous
replication is activated for this collection. The Cluster determines suitable
_leaders_ and _followers_ for every requested _shard_ (`numberOfShards`) within
the Cluster.

An example of creating a collection in _arangosh_ with a replication factor of
`3`, requiring three replicas to report success for any write operation in this
collection:

```js
db._create("test", { "replicationFactor": 3 })
```

The `replicationFactor` value can be between the minimum and maximum
replication factor defined by the following startup options:

- [`--cluster.min-replication-factor`](programs-arangod-options.html#--clustermin-replication-factor)
- [`--cluster.max-replication-factor`](programs-arangod-options.html#--clustermax-replication-factor)

The default replication factor for regular and for system collections is defined
by the following startup options:

- [`--cluster.default-replication-factor`](programs-arangod-options.html#--clusterdefault-replication-factor)
- [`--cluster.system-replication-factor`](programs-arangod-options.html#--clustersystem-replication-factor)

Preparing growth
----------------

You may create a _collection_ with a higher _replication factor_ than
available _DB-Servers_. When additional _DB-Servers_ become available,
the _shards_ are automatically replicated to the newly available _DB-Servers_. 

You need to set the `enforceReplicationFactor` option to `false` when creating
a _collection_ with a higher _replication factor_ than available _DB-Servers_
(the default value is `true`). For example, in _arangosh_ you can pass
a third argument to the `db._create()` method with this option:

```js
db._create("test", { replicationFactor: 4 }, { enforceReplicationFactor: false });
```

This option is not available in the web interface.

{% hint 'info' %}
Multiple _replicas_ of the same _shard_ can never coexist on the same
_DB-Server_ instance.
{% endhint %}

Sharding
--------

For an introduction about _Sharding_ in Cluster, please refer to the
[_Cluster Sharding_](architecture-deployment-modes-cluster-sharding.html) section.

Number of _shards_ can be configured at _collection_ creation time, e.g. the UI,
or the _ArangoDB Shell_:

```js
db._create("sharded_collection", {"numberOfShards": 4});
```

To configure a custom _hashing_ for another attribute (default is __key_):

```js
db._create("sharded_collection", {"numberOfShards": 4, "shardKeys": ["country"]});
```

The example above, where 'country' has been used as _shardKeys_ can be useful
to keep data of every country in one shard, which would result in better
performance for queries working on a per country base.

It is also possible to specify multiple `shardKeys`.

Note however that if you change the shard keys from their default `["_key"]`,
then finding a document in the collection by its primary key involves a request
to every single shard. However this can be mitigated: All CRUD APIs and AQL
support taking the shard keys as a lookup hint. Just make sure that the shard
key attributes are present in the documents you send, or in case of AQL, that
you use a document reference or an object for the UPDATE, REPLACE or REMOVE
operation which includes the shard key attributes:

```aql
FOR doc IN sharded_collection
  FILTER doc._key == "123"
  UPDATE doc WITH { … } IN sharded_collection
```

```aql
UPDATE { _key: "123", country: "…" } WITH { … } IN sharded_collection
```

Using a string with just the document key as key expression instead will be
processed without shard hints and thus perform slower:

```aql
UPDATE "123" WITH { … } IN sharded_collection
```

If custom shard keys are used, you can no longer specify the primary key value
for a new document, but must let the server generate one automatically. This
restriction comes from the fact that ensuring uniqueness of the primary key
would be very inefficient if the user could specify the document key.
If custom shard keys are used, trying to store documents with the primary key value
(`_key` attribute) set will result in a runtime error ("must not specify _key
for this collection").

Unique indexes on sharded collections are only allowed if the fields used to 
determine the shard key are also included in the list of attribute paths for the index:

| shardKeys | indexKeys |             |
|----------:|----------:|------------:|
| a         | a         |     allowed |
| a         | b         | not allowed |
| a         | a, b      |     allowed |
| a, b      | a         | not allowed |
| a, b      | b         | not allowed |
| a, b      | a, b      |     allowed |
| a, b      | a, b, c   |     allowed |
| a, b, c   | a, b      | not allowed |
| a, b, c   | a, b, c   |     allowed |

On which DB-Server in a Cluster a particular _shard_ is kept is undefined.
There is no option to configure an affinity based on certain _shard_ keys.

Sharding strategy
-----------------

Strategy to use for the collection. There are
different sharding strategies to select from when creating a new 
collection. The selected *shardingStrategy* value will remain
fixed for the collection and cannot be changed afterwards. This is
important to make the collection keep its sharding settings and
always find documents already distributed to shards using the same
initial sharding algorithm.

The available sharding strategies are:
- `community-compat`: default sharding used by ArangoDB
  Community Edition before version 3.4
- `enterprise-compat`: default sharding used by ArangoDB
  Enterprise Edition before version 3.4
- `enterprise-smart-edge-compat`: default sharding used by smart edge
  collections in ArangoDB Enterprise Edition before version 3.4
- `hash`: default sharding used for new collections starting from version 3.4
  (excluding smart edge collections)
- `enterprise-hash-smart-edge`: default sharding used for new
  smart edge collections starting from version 3.4
- `enterprise-hex-smart-vertex`: sharding used for vertex collections of
  EnterpriseGraphs

If no sharding strategy is specified, the default is `hash` for
all normal collections, `enterprise-hash-smart-edge` for all smart edge
collections, and `enterprise-hex-smart-vertex` for EnterpriseGraph
vertex collections (the latter two require the *Enterprise Edition* of ArangoDB).
Manually overriding the sharding strategy does not yet provide a
benefit, but it may later in case other sharding strategies are added.

The [OneShard](architecture-deployment-modes-cluster-architecture.html#oneshard)
feature does not have its own sharding strategy, it uses `hash` instead.

Moving/Rebalancing _shards_
---------------------------

Rebalancing redistributes resources in the cluster to optimize resource
allocation - shards and location of leaders/followers.

It aims to achieve, for example, a balanced load, fair shard distribution,
and resiliency.

Rebalancing might occur, amongst other scenarios, when:
- There is a change in the number of nodes in the cluster and more (or fewer)
  resources are available to the cluster.
- There is a detectable imbalance in the distribution of shards
  (i.e. specific nodes holding high number of shards while others don’t) or in
  the distribution of leaders/followers across the nodes, resulting in
  computational imbalance on the nodes.
- There are changes in the number or size of data collections.

A _shard_ can be moved from a _DB-Server_ to another, and the entire shard distribution
can be rebalanced using the corresponding buttons in the web [UI](programs-web-interface-cluster.html).

You can also do any of the following by using the API:
- Calculate the current cluster imbalance.
- Compute a set of move shard operations to improve balance.
- Execute the given set of move shard operations.
- Compute a set of move shard operations to improve balance and immediately execute them.

For more information, see the [Cluster Administration & Monitoring](http/administration-and-monitoring.html#compute-the-current-cluster-imbalance) 
section of the HTTP API reference manual.

Replacing/Removing a _Coordinator_
----------------------------------

_Coordinators_ are effectively stateless and can be replaced, added and
removed without more consideration than meeting the necessities of the
particular installation. 

To take out a _Coordinator_ stop the
_Coordinator_'s instance by issuing `kill -SIGTERM <pid>`.

Ca. 15 seconds later the cluster UI on any other _Coordinator_ will mark
the _Coordinator_ in question as failed. Almost simultaneously, the recycle bin
icon will appear to the right of the name of the _Coordinator_. Clicking
that icon will remove the _Coordinator_ from the Coordinator registry.

Any new _Coordinator_ instance that is informed of where to find any/all
Agent(s), `--cluster.agency-endpoint` `<some agent endpoint>` will be
integrated as a new _Coordinator_ into the cluster. You may also just
restart the _Coordinator_ as before and it will reintegrate itself into
the cluster.

Replacing/Removing a _DB-Server_
-------------------------------

_DB-Servers_ are where the data of an ArangoDB cluster is stored. They
do not publish a web interface and are not meant to be accessed by any other
entity than _Coordinators_ to perform client requests or other _DB-Servers_
to uphold replication and resilience.

The clean way of removing a _DB-Server_ is to first relieve it of all
its responsibilities for shards. This applies to _followers_ as well as
_leaders_ of shards. The requirement for this operation is that no
collection in any of the databases has a `replicationFactor` greater than
the current number of _DB-Servers_ minus one. In other words, the highest
replication factor must not exceed the future _DB-Server_ count. For the
purpose of cleaning out `DBServer004` for example would work as follows, when
issued to any _Coordinator_ of the cluster:

`curl <coord-ip:coord-port>/_admin/cluster/cleanOutServer -d '{"server":"DBServer004"}'`

After the _DB-Server_ has been cleaned out, you will find the recycle bin
icon to the right of the name of the _DB-Server_ on any _Coordinators_'
UI. Clicking on it will remove the _DB-Server_ in question from the
cluster.

Firing up any _DB-Server_ from a clean data directory by specifying the
any of all Agency endpoints will integrate the new _DB-Server_ into the
cluster.

To distribute shards onto the new _DB-Server_ either click on the
`Distribute Shards` button at the bottom of the `Shards` page in every
database.

The clean out process can be monitored using the following script,
which periodically prints the amount of shards that still need to be moved.
It is basically a countdown to when the process finishes.

Save below code to a file named `serverCleanMonitor.js`:

```js
var dblist = db._databases();
var internal = require("internal");
var arango = internal.arango;

var server = ARGUMENTS[0];
var sleep = ARGUMENTS[1] | 0;

if (!server) {
    print("\nNo server name specified. Provide it like:\n\narangosh <options> -- DBServerXXXX");
    process.exit();
}

if (sleep <= 0) sleep = 10;
console.log("Checking shard distribution every %d seconds...", sleep);

var count;
do {
    count = 0;
    for (dbase in dblist) {
        var sd = arango.GET("/_db/" + dblist[dbase] + "/_admin/cluster/shardDistribution");
        var collections = sd.results;
        for (collection in collections) {
        var current = collections[collection].Current;
        for (shard in current) {
            if (current[shard].leader == server) {
            ++count;
            }
        }
        }
    }
    console.log("Shards to be moved away from node %s: %d", server, count);
    if (count == 0) break;
    internal.wait(sleep);
} while (count > 0);
```

This script has to be executed in the [`arangosh`](programs-arangosh.html)
by issuing the following command:

```bash
arangosh --server.username <username> --server.password <password> --javascript.execute <path/to/serverCleanMonitor.js> -- DBServer<number>
```

The output should be similar to the one below:

```bash
arangosh --server.username root --server.password pass --javascript.execute ~./serverCleanMonitor.js -- DBServer0002
[7836] INFO Checking shard distribution every 10 seconds...
[7836] INFO Shards to be moved away from node DBServer0002: 9
[7836] INFO Shards to be moved away from node DBServer0002: 4
[7836] INFO Shards to be moved away from node DBServer0002: 1
[7836] INFO Shards to be moved away from node DBServer0002: 0
```

The current status is logged every 10 seconds. You may adjust the
interval by passing a number after the DB-Server name, e.g.
`arangosh <options> -- DBServer0002 60` for every 60 seconds.

Once the count is `0` all shards of the underlying DB-Server have been moved
and the `cleanOutServer` process has finished.
