---
layout: default
description: ArangoDB v3.8 Release Notes New Features
---
Features and Improvements in ArangoDB 3.8
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.8. ArangoDB 3.8 also contains several bug fixes that are not listed
here.

AQL
---

### AQL window operations

The `WINDOW` keyword can be used for aggregations over related rows, usually
preceding and / or following rows.

The `WINDOW` operation performs a `COLLECT AGGREGATE`-like operation on a set
of query rows. However, whereas a `COLLECT` operation groups multiple query
rows into a single result group, a `WINDOW` operation produces a result for
each query row:

- The row for which function evaluation occurs is called the current row.
- The query rows related to the current row over which function evaluation
  occurs, comprise the window frame for the current row.

Window frames are determined with respect to the current row:

- By defining a window frame to be all rows from the query start to the current
  row, you can compute running totals for each row.
- By defining a frame as extending *N* rows on either side of the current row,
  you can compute rolling averages.

See [`WINDOW` operation](aql/operations-window.html).

### Weighted Traversals

The graph traversal option `bfs` is now deprecated and superseded by the new
option `order`. It supports a new traversal type `"weighted"`, which enumerate
paths by increasing weights.

The cost of an edge can be read from an attribute which can be specified with
the `weightAttribute` option.

```js
FOR x, v, p IN 0..10 OUTBOUND "places/York" GRAPH "kShortestPathsGraph"
  OPTIONS {
    order: "weighted",
    weightAttribute: "travelTime",
    uniqueVertices: "path"
  }
  FILTER p.edges[*].travelTime ALL < 3
  LET totalTime = LAST(p.weights)
  FILTER totalTime < 6
  SORT totalTime DESC
  RETURN {
    path: p.vertices[*]._key,
    weight: LAST(p.weights),
    weights: p.edges[*].travelTime
  }
```

`path` | `weight` | `weights`
:------|:---------|:---------
`["York","London","Birmingham","Carlisle"]` | `5.3` | `[1.8,2.5,1]`
`["York","London","Birmingham"]`            | `4.3` | `[1.8,2.5]`
`["York","London","Brussels"]`              | `4.3` | `[1.8,2.5]`
`["York","London"]`                         | `1.8` | `[1.8]`
`["York"]`                                  |   `0` | `[]`

{% hint 'info' %}
Weighted traversals do not support negative weights. If a document
attribute (as specified by `weightAttribute`) with a negative value is
encountered during traversal, or if `defaultWeight` is set to a negative
number, then the query is aborted with an error.
{% endhint %}

The preferred way to start a breadth-first search from now on is with
`order: "bfs"`. The default remains depth-first search if no `order` is
specified, but can also be explicitly requested with `order: "dfs"`.

Also see [AQL graph traversals](aql/graphs-traversals.html)

### k Paths

A new graph traversal method `K_PATHS` was added to AQL. It will enumerate all
paths between a source and a target vertex that match the given path length.

For example, the query:

```js
FOR path IN 2..4 OUTBOUND K_PATHS "v/source" TO "v/target" GRAPH "g"
  RETURN path
```

… will yield all paths in the format:

```js
{
  "vertices": ["v/source", ... , "v/target"],
  "edges": ["v/source" -> "v/1", ... , "v/n" -> "v/target"]
}
```

… that have length of exactly 2 or 3 or 4, start at `v/source` and end at
`v/target`. No order is guaranteed for those paths in the result set.

For more details see [AQL k Paths](aql/graphs-k-paths.html)

### AQL bit functions

ArangoDB 3.8 adds the following bit handling functions to AQL:

- `BIT_AND()`: and-combine two or more numbers
- `BIT_OR()`: or-combine two or more numbers
- `BIT_XOR()`: xor-combine two or more numbers
- `BIT_NEGATE()`: bitwise negation
- `BIT_TEST()`: test if bit is set at position
- `BIT_POPCOUNT()`: number of bits set
- `BIT_SHIFT_LEFT()`: bitwise shift-left
- `BIT_SHIFT_RIGHT()`: bitwise shift-right
- `BIT_CONSTRUCT()`: construct a number with bits set at given positions
- `BIT_DECONSTRUCT()`: deconstruct a number into an array with the positions of its set bits
- `BIT_TO_STRING()`: create a bitstring representation from a numeric value
- `BIT_FROM_STRING()`: parse a bitstring representation into a number

Also see [Bit functions](aql/functions-bit.html).

`BIT_AND()`, `BIT_OR()` and `BIT_XOR()` are also available as aggregate
functions for usage inside [`COLLECT AGGREGATE`](aql/operations-collect.html#aggregation).

All above bit operations support unsigned integer values with up to 32 bits.
Using values outside the supported range will make any of these bit functions
return `null` and register a warning.

This functionality has been backported to v3.7.7 as well.

### AQL binary and hexadecimal integer literals

ArangoDB 3.8 allows using binary (base 2) and hexadecimal (base 16) integer
literals in AQL. These literals can be used where regular (base 10) integer
literals can be used.

- The prefix for binary integer literals is `0b`, e.g. `0b10101110`.
- The prefix for hexadecimal integer literals is `0x`, e.g. `0xabcdef02`.

Binary and hexadecimal integer literals can only be used for unsigned integers.
The maximum supported value is 2<sup>32</sup> - 1, i.e.
`0b11111111111111111111111111111111` (binary) or `0xffffffff` (hexadecimal).

This functionality has been backported to v3.7.7 as well.

### Projections on sub-attributes

AQL now also support projections on sub-attributes (e.g. `a.b.c`).

In previous versions of ArangoDB, projections were only supported on top-level
attributes. For example, in the query:

```js
FOR doc IN collection
  RETURN doc.a.b
```

… the projection that was used was just `a`. Now the projection will be `a.b`,
which can help reduce the amount of data to be extracted from documents, when
only some sub-attributes are accessed.

In addition, indexes can now be used to extract the data of sub-attributes
for projections. If for the above example query an index on `a.b` exists,
it will be used now. Previously, no index could be used for this projection.

Projections now can also be fed by any attribute in a combined index.
For example, in the query:

```js
FOR doc IN collection
  RETURN doc.b
```

… the projection can be satisfied by a single-attribute index on attribute `b`,
but now also by a combined index on attributes `a` and `b` (or `b` and `a`).


### AQL optimizer improvements

The "move-calculations-up" optimizer rule was improved so that it can move
calculations out of subqueries into the outer query, so that they will be
executed less often.

In queries or subqueries that return only constant values and/or that assign
constant values to variables, these constant values are now stored only once
per query and not once input row. This can slightly improve memory usage and
execution time of such queries.

Explaining a query now also shows the query optimizer rules with the highest
execution times in the explain output.

### AQL performance improvements

The performance of AQL `standard` sort operations has been improved in ArangoDB
3.8. This is true for sorts carried out explicitly by using the `SORT` keyword
and for sorts that are implicitly executed due to using a sorting `COLLECT`
operation. Sort performance is especially better for sorting numeric values.

The improvements are limited to SortNodes with the `standard` sorting strategy.
SortNodes using the `constrained heap` strategy may not see a speedup.

There are also performance improvements for `COLLECT` operations that only
count values or that aggregate values using `AGGREGATE`. The exact mileage
can vary, but is substantial for some queries.

### AQL usability options

#### Requiring `WITH` statements

The new startup option `--query.require-with` will make AQL queries in single
server mode also require `WITH` clauses in AQL queries where a cluster
installation would require them.
The option is set to *false* by default, but can be turned on in single servers
to remove this behavior difference between single servers and clusters, making
a later transition from single server to cluster easier.

#### Allowing the usage of collection names in AQL expressions

The new startup option `--query.allow-collections-in-expressions` controls
whether using collection names in arbitrary places in AQL expressions is
allowed, although using collection names like this is very likely unintended.

For example, consider the query

```js
FOR doc IN collection RETURN collection
```

Here, the collection name is *collection*, and its usage in the `FOR` loop is
intended and valid. However, *collection* is also used in the `RETURN`
statement, which is legal but potentially unintended. It should likely be
`RETURN doc` or `RETURN doc.someAttribute` instead. Otherwise, the entire
collection will be materialized and returned as many times as there are
documents in the collection. This can take a long time and even lead to
out-of-memory crashes in the worst case.

Setting the option `--query.allow-collections-in-expression` to *false* will
prohibit such unintentional usage of collection names in queries, and instead
make the query fail with error 1568 ("collection used as expression operand").

The default value of the option is *true* in 3.8, meaning that potentially
unintended usage of collection names in queries is still allowed. The default
value for the option will change to *false* in 3.9. The option will also be
deprecated in 3.9 and removed in future versions. From then on, unintended
usage of collection names will always be disallowed.

Also see [ArangoDB Server Query Options](programs-arangod-query.html#allowing-the-usage-of-collection-names-in-aql-expressions)

ArangoSearch
------------

### Pipeline Analyzer

Added new Analyzer type `"pipeline"` for chaining effects of multiple Analyzers
into one. It allows you to combine text normalization for a case insensitive
search with _n_-gram tokenization, or to split text at multiple delimiting
characters followed by stemming.

See [ArangoSearch Pipeline Analyzer](analyzers.html#pipeline)

### AQL Analyzer

Added new Analyzer type `"aql"` capable of running an AQL query (with some
restrictions) to perform data manipulation/filtering.

See [ArangoSearch AQL Analyzer](analyzers.html#aql)

### Geo-spatial queries

Added two Geo Analyzers [`"geojson"`](analyzers.html#geojson)
and [`"geopoint"`](analyzers.html#geopoint) as well as the
following [ArangoSearch Geo functions](aql/functions-arangosearch.html#geo-functions)
which enable geo-spatial queries backed by View indexes:
- `GEO_CONTAINS()`
- `GEO_DISTANCE()`
- `GEO_IN_RANGE()`
- `GEO_INTERSECTS()`

{% comment %}
### Stopwords Analyzer

Added new Analyzer `"stopwords"` capable of removing specified tokens from the
input. It can be used standalone or be combined with other Analyzers via a
pipeline Analyzer to add stopword functionality to them. Previously, only the
text Analyzer type provided stopword support.

See [ArangoSearch Stopwords Analyzer](analyzers.html#stopwords)
{% endcomment %}

### Approximate count

Added a new option `countApproximate` for `SEARCH` queries to control how the
total count of rows is calculated if the `fullCount` option is enabled for a
query or when a `COLLECT WITH COUNT` clause is executed:

- `"exact"` (default): rows are actually enumerated for a precise count.
- `"cost"`: a cost based approximation is used. Does not enumerate rows and
  returns an approximate result with O(1) complexity. Gives a precise result
  if the `SEARCH` condition is empty or if it contains a single term query
  only (e.g. `SEARCH doc.field == "value"`), the usual eventual consistency
  of Views aside.

Also see: [AQL `SEARCH` Operation](aql/operations-search.html#search-options)

This feature was also backported to v3.7.6.

### ArangoSearch thread control

Added new command line options for fine-grained control over ArangoSearch's
maintenance threads, now allowing to set the minimum and maximum number of
threads for committing and consolidation separately:

- `--arangosearch.commit-threads`
- `--arangosearch.commit-threads-idle`
- `--arangosearch.consolidation-threads`
- `--arangosearch.consolidation-threads-idle`

They supersede the options `--arangosearch.threads` and
`--arangosearch.threads-limit`. See
[ArangoDB Server ArangoSearch Options](programs-arangod-arangosearch.html).

This feature was also backported to v3.7.5.

Web interface
-------------

### Dashboard

The cluster nodes overview in the web interface will now also display all Agent
instances. Agent failures are now visible there, too. The overview also shows
which agent is currently the leader.

### Shard distribution overview

The web interface now provides a shard distribution overview for the entire
cluster. The overview includes general details about cluster-wide distribution
as well as per-server figures for the number of leader and follower shards.

The shard distribution overview is only available in the `_system` database.

### Cluster maintenance mode

Inside the `_system` database of a cluster, the web interface now displays the
cluster supervision maintenance status. This can be used to check if the cluster
is currently in maintenance mode. For users with sufficient privileges, it is
also possible to toggle the maintenance mode from there.

### Collection figures

The web interface now displays the approximate size of the data in a collection
for both indexes and documents, based on the estimates provided by RocksDB.

These are estimates which are intended to be calculated quickly, but are not
perfectly accurate. The estimates can still be useful to get an idea of how
"big" a collection approximately is. The sizing information is provided in the
*Info* tab of each collection's detail view.

For collections in a cluster, the web interface now displays the number of
documents in each shard (data distribution) plus the leader and follower
DB-Servers for each shard.

### Server logs in cluster

The web interface can now display the most recent server log entries for
Coordinators and DB-Servers in a cluster. Logs are made available in the
`_system` database via the _Nodes_ menu item. Up to 2048 log entries will be
kept on each instance.

The privileges for accessing server logs in the web interface are identical
to the privileges required for accessing logs via the `GET /_admin/log` HTTP
REST API. If security is a concern, in-memory logs buffering can be turned
off entirely using the startup option `--log.in-memory false`, plus the log
API can be turned off or restricted via the `--log.api-enabled false` or
`--log.api-enabled jwt` startup options.

### Server metrics

The statistics view in the web interface now provide some key metrics for
DB-Servers in case the metrics API is enabled. Different statistics may be
visible depending on the operating system.

The web interface can now display the servers' current metrics (as exposed
via the `/_admin/metrics/v2` API) for all Coordinators and DB-Servers in a cluster.
The current metrics are provided in a tabular format output and can be downloaded
from the UI for further analysis. This is not meant to be a 100% replacement for
Grafana, but rather as a quick self-service alternative to check the servers'
statuses.

### Shard synchronization status

The shard synchronization overview in the web interface now provides a better
overview of what the shard synchronization is currently doing, and what its
progress is.

For shards that are currently not in sync it will display whether the
followers are currently syncing or waiting for their turn to come (because
the amount of parallelism for syncing multiple shards can be restricted).
The progress values displayed for shard synchronization should also be more
helpful for shards with more than one follower and in situations where one
follower is in sync and the other is not (yet).

Memory usage
------------

### Agency memory usage

The in-memory object sizes for Agency data have been reduced in ArangoDB 3.8,
which should reduce the memory usage of Agent instances for clusters with a
larger amount of databases/collections/shards. On-disk sizes or sizes of Agency
dumps retrieved via APIs should not change, however.

The change also helps Coordinators and DB-Servers, which since v3.7.4 also
maintain an in-memory cache of Agency data so that they can reduce the number
of requests to the Agency.

The default RocksDB settings for Agency instances have been adjusted so that
the Agency memory usage consumed by RocksDB is limited to a 1 GB RocksDB block
cache and to 512 MB for the total write buffer size. Previously, Agency memory
usage could grow a lot higher for systems with a lot of memory if the startup
parameters were not set explicitly.

### Default per-query memory limit

A default per-query memory limit has been introduced for queries, to prevent rogue
AQL queries from consuming the too much memory of an arangod instance.

The per-query limit is introduced via changing the default value of the option
`--query.memory-limit` from previously `0` (meaning no limit) to a dynamically
calculated value. The per-query memory limit defaults are now (depending on the
amount of available RAM):

```
Available memory:            0      (0MiB)  Limit:            0   unlimited, %mem:  n/a
Available memory:    134217728    (128MiB)  Limit:     33554432     (32MiB), %mem: 25.0
Available memory:    268435456    (256MiB)  Limit:     67108864     (64MiB), %mem: 25.0
Available memory:    536870912    (512MiB)  Limit:    201326592    (192MiB), %mem: 37.5
Available memory:    805306368    (768MiB)  Limit:    402653184    (384MiB), %mem: 50.0
Available memory:   1073741824   (1024MiB)  Limit:    603979776    (576MiB), %mem: 56.2
Available memory:   2147483648   (2048MiB)  Limit:   1288490189   (1228MiB), %mem: 60.0
Available memory:   4294967296   (4096MiB)  Limit:   2576980377   (2457MiB), %mem: 60.0
Available memory:   8589934592   (8192MiB)  Limit:   5153960755   (4915MiB), %mem: 60.0
Available memory:  17179869184  (16384MiB)  Limit:  10307921511   (9830MiB), %mem: 60.0
Available memory:  25769803776  (24576MiB)  Limit:  15461882265  (14745MiB), %mem: 60.0
Available memory:  34359738368  (32768MiB)  Limit:  20615843021  (19660MiB), %mem: 60.0
Available memory:  42949672960  (40960MiB)  Limit:  25769803776  (24576MiB), %mem: 60.0
Available memory:  68719476736  (65536MiB)  Limit:  41231686041  (39321MiB), %mem: 60.0
Available memory: 103079215104  (98304MiB)  Limit:  61847529063  (58982MiB), %mem: 60.0
Available memory: 137438953472 (131072MiB)  Limit:  82463372083  (78643MiB), %mem: 60.0
Available memory: 274877906944 (262144MiB)  Limit: 164926744167 (157286MiB), %mem: 60.0
Available memory: 549755813888 (524288MiB)  Limit: 329853488333 (314572MiB), %mem: 60.0
```

As before, a per-query memory limit value of `0` means no limitation.
The limit values are per AQL query, so they may still be too high in case
queries run in parallel. The defaults are intentionally high in order to not
stop any valid, previously working queries from succeeding.

Using a per-query memory limit by default is a downwards-incompatible change in
ArangoDB 3.8 and may make queries fail if they use a lot of memory. If this
happens, it may be useful to increase the value of `--query.memory-limit` or
even set it to `0` (meaning no limitation).
There is a metric `arangodb_aql_local_query_memory_limit_reached` that can be
used to check how many times queries reached the per-query memory limit.

There is now also a startup option `--query.memory-limit-override` which can be
used to control whether individual AQL queries can increase their memory limit
via the `memoryLimit` query option. This is the default, so a query that
increases its memory limit is allowed to use more memory than set via the
`--query.memory-limit` startup option value. If the option is set to `false`,
individual queries can only lower their maximum allowed memory usage but not
increase it.

### Global AQL query memory limit

The new startup option `--query.global-memory-limit` can be used to set a limit
on the combined estimated memory usage of all AQL queries (in bytes). If this
option has a value of `0`, then no global memory limit is in place. This is
also the default value and the same behavior as in previous versions of ArangoDB.

Setting the option to a value greater than zero will mean that the total memory
usage of all AQL queries will be limited approximately to the configured value.
The limit is enforced by each server in a cluster independently, i.e. it can be
set separately for Coordinators, DB-Servers etc. The memory usage of a query
that runs on multiple servers in parallel is not summed up, but tracked
separately on each server.

If a memory allocation in a query would lead to the violation of the configured
global memory limit, then the query is aborted with error code 32
("resource limit exceeded").

The global memory limit is approximate, in the same fashion as the per-query
memory limit exposed by the option `--query.memory-limit` is.  Some operations,
namely calls to AQL functions and their intermediate results, are currently not
properly tracked. 

The global query memory limit in option `--query.global-memory-limit` has a
default value that depends on the amount of available RAM:

```
Available memory:            0      (0MiB)  Limit:            0   unlimited, %mem:  n/a
Available memory:    134217728    (128MiB)  Limit:     33554432     (32MiB), %mem: 25.0
Available memory:    268435456    (256MiB)  Limit:     67108864     (64MiB), %mem: 25.0
Available memory:    536870912    (512MiB)  Limit:    255013683    (243MiB), %mem: 47.5
Available memory:    805306368    (768MiB)  Limit:    510027366    (486MiB), %mem: 63.3
Available memory:   1073741824   (1024MiB)  Limit:    765041049    (729MiB), %mem: 71.2
Available memory:   2147483648   (2048MiB)  Limit:   1785095782   (1702MiB), %mem: 83.1
Available memory:   4294967296   (4096MiB)  Limit:   3825205248   (3648MiB), %mem: 89.0
Available memory:   8589934592   (8192MiB)  Limit:   7752415969   (7393MiB), %mem: 90.2
Available memory:  17179869184  (16384MiB)  Limit:  15504831938  (14786MiB), %mem: 90.2
Available memory:  25769803776  (24576MiB)  Limit:  23257247908  (22179MiB), %mem: 90.2
Available memory:  34359738368  (32768MiB)  Limit:  31009663877  (29573MiB), %mem: 90.2
Available memory:  42949672960  (40960MiB)  Limit:  38762079846  (36966MiB), %mem: 90.2
Available memory:  68719476736  (65536MiB)  Limit:  62019327755  (59146MiB), %mem: 90.2
Available memory: 103079215104  (98304MiB)  Limit:  93028991631  (88719MiB), %mem: 90.2
Available memory: 137438953472 (131072MiB)  Limit: 124038655509 (118292MiB), %mem: 90.2
Available memory: 274877906944 (262144MiB)  Limit: 248077311017 (236584MiB), %mem: 90.2
Available memory: 549755813888 (524288MiB)  Limit: 496154622034 (473169MiB), %mem: 90.2
```

Using a global memory limit for all queries by default is a
downwards-incompatible change in ArangoDB 3.8 and may make queries fail if they
use a lot of memory. If this happens, it may be useful to increase the value of
`--query.global-memory-limit` or even set it to `0` (meaning no limitation).
There is a metric `arangodb_aql_global_query_memory_limit_reached` that can be
used to check how many times queries reached the global memory limit.

If both `--query.global-memory-limit` and `--query.memory-limit` are set, the
former must be set at least as high as the latter.

Shard synchronization
---------------------

### Improvements for initial synchronization

The initial replication of collections/shards data is now faster by not wrapping
each document in a separate `{"type":2300,"data":...}` envelope. In addition, the
follower side of the replication will request initial shard data from leaders in
VelocyPack format if the leader is running at least version 3.8.

Stripping the envelopes and using VelocyPack for data transfer allows for smaller
data sizes when exchanging the documents and for faster processing, and thus can
lead to time savings in document packing and unpacking as well as a reduction in
the number of required roundtrips.

The shard synchronization protocol was also improved by only transferring the
required parts of the inventory from leader to follower. Previously, for each
shard the entire inventory was exchanged, which included all shards of the
respective database with all their details. This change helps to reduce memory
usage and speed up initial synchronization for databases with lots of collections
or shards.

In addition, 3 cluster-internal requests are now saved per shard in the initial
shard synchronization protocol by reusing already existing information in the
different steps of the replication process. All these changes can speed up the
getting-in-sync of followers after a server restart, or when provisioning new
replicas.

### Replication protocol based on Merkle trees

For collections created with ArangoDB 3.8, a new internal data format is used
that allows for a very fast synchronization of differences between the leader
and a follower that is trying to reconnect.

The new format used in 3.8 is based on Merkle trees, making it more efficient
to pin-point the data differences between the leader and a follower that is
trying to reconnect.

The algorithmic complexity of the new protocol is determined by the amount of
differences between the leader and follower shard data, meaning that if there
are no or very few differences, the getting-in-sync protocol will run very fast.
In previous versions of ArangoDB, the complexity of the protocol was determined
by the number of documents in the shard, and the protocol required a scan over
all documents in the shard on both the leader and the follower to find the
differences.

The new protocol is used automatically for all collections/shards created with
ArangoDB 3.8. Collections/shards created with earlier versions will use the
old protocol, which is still fully supported.

New deployments created with ArangoDB 3.8 will automatically benefit from the
new protocol, and existing deployments will benefit from the new protocol for
any collections that are created with 3.8 onwards.
Existing collections created with previous versions of ArangoDB will only benefit 
from the new protocol if the collections are dumped and recreated/restored using 
arangodump and arangorestore.

Index selectivity estimates
---------------------------

### Compressed estimates format

When index selectivity estimates are updated and written to disk, they are now
written in a compressed format. This can greatly reduce the amount of data
written to disk for each index estimate update. The compressed format is used
automatically in ArangoDB 3.8 for all selectivity estimate writes.

### Less impact of selectivity estimate updates for system collections

Previous versions of ArangoDB could suffer from an "idle writes" problem, in
which an otherwise idle arangod instance would still write a lot of data to
disk over time. These writes happened because the server statistics feature
periodically stored the current statistics in some system collections, so that
they can be retrieved later and also be inspected from the web interface at
any point.

With ArangoDB 3.8 these background writes to the statistics collections will
still happen, but their impact has been greatly reduced: if the statistics
collections are created with ArangoDB 3.8 (this will happen when creating a new
deployment based on 3.8), there will be no updates to the index selectivity
estimates of the statistics collections at all. This will save the majority of
the write payload size. For deployments created with earlier versions of
ArangoDB, the index selectivity estimates for the statistics collections will
still be updated periodically, but they are written in the compressed index
selectivity estimates format (see above).

### Optional selectivity estimates for new indexes

For any user-defined index of type "persistent", it is now also possible to
disable index selectivity estimates for the index, by setting the `estimates`
flag to `false` when creating the index, e.g.

```js
db.myCollection.ensureIndex({ type: "persistent", fields: ["value"], estimates: false });
```

By default index selectivity estimates are maintained for all newly created
indexes. Turning them off can have a slightly positive performance impact for
write operations. The downside of turning off index selectivity estimates will
be that the query optimizer will not be able to determine the usefulness of
different competing indexes in AQL queries when there are multiple candidate
indexes to choose from.

Encryption at Rest
------------------

The Encryption at Rest feature in the ArangoDB 3.8 Enterprise Edition will now
automatically use hardware acceleration for encryption and decryption if
available.

The AES-NI instruction set (Advanced Encryption Standard New Instructions)
will be used if available on the target platform. This instruction set is
available on major Intel and AMD processors for around a decade.

The benefits of using the hardware-accelerated version of AES are better
performance than for a software-only implementation, plus resistance to
side-channel attacks.

All other things equal, deployments that use
[Encryption at Rest](security-encryption.html) should see a reduction of CPU
usage by using the hardware-accelerated encryption.

HTTP security options
---------------------

ArangoDB 3.8 provides a new startup option `--cluster.api-jwt-policy` that
allows *additional* checking for valid JWTs in all requests to sub-routes of
the `/_admin/cluster` REST API endpoint.
This is a security option to restrict access to these cluster APIs to
operator tools and privileged users.

The possible values for the startup option are:

- `jwt-all`: requires a valid JWT for all accesses to `/_admin/cluster` and
  its sub-routes. If this configuration is used, the _CLUSTER_ and _NODES_
  sections of the web interface will be disabled, as they are relying on the
  ability to read data from several cluster APIs.
- `jwt-write`: requires a valid JWT for write accesses (all HTTP methods
  except HTTP GET) to `/_admin/cluster`. This setting can be used to allow
  privileged users to read data from the cluster APIs, but not to do any
  modifications. All existing permissions checks for the cluster API routes
  are still in effect with this setting, meaning that read operations without
  a valid JWT may still require dedicated other permissions (as in v3.7).
- `jwt-compat`: no *additional* access checks are in place for the cluster
  APIs. However, all existing permissions checks for the cluster API routes
  are still in effect with this setting, meaning that all operations may
  still require dedicated other permissions (as in v3.7).

The default value for the option is `jwt-compat`, which means this option will
not cause any *extra* JWT checks compared to v3.7.

JavaScript security options
---------------------------

The following startup options have been added to optionally limit certain
areas of JavaScript code execution:

- `--javascript.tasks`: the default value for this option is `true`, meaning
  JavaScript tasks are available as before. However, with this option they can
  be turned off by admins to limit the amount of JavaScript user code that is
  executed.

- `--javascript.transactions`: the default value for this option is
  `true`, meaning JavaScript transactions are available as before. However,
  with this option they can be turned off by admins to limit the amount of
  JavaScript user code that is executed.

Metrics
-------

3.8 features a new metrics API under `/_admin/metrics/v2`.
This became necessary, since the old metrics output was not following
all Prometheus conventions for metrics. For example, the naming
convention says that the name of a counters **must end in** `_total`.
Furthermore, the histogram bucket counts **must be reported** cumulated.
Fixing all these is a breaking change, therefore we continue to serve
the old metrics output (with old names and uncumulated histograms)
under `/_admin/metrics` and deprecate this API in 3.8. It will be
removed in future versions.

The new API under `/_admin/metrics/v2` should be used from now on and
we publish new dashboards for Grafana for it. We have defined multiple
"personas" and build individual dashboards which each include a certain
subset of the metrics tailored for the particular persona. So for
example, a database admin would only see metrics which are relevant
for the database administration work. Of course, there is also a
dashboard with all metrics, neatly sorted into categories. In 3.8,
we have over 200 metrics and nearly 300 graphs in the complete
dashboard.

The complete list of metrics together with documentation can be found
in the [Metrics HTTP API](http/administration-and-monitoring-metrics.html)
documentation.

The list of renamed metrics can be found under
[API Changes in 3.8](release-notes-api-changes38.html#endpoints-added).

For the description of a seamless upgrade path see
[Incompatible changes in 3.8](release-notes-upgrading-changes38.html#endpoint-return-value-changes).

Logging
-------

### New options for logging

The following logging-related options have been added:

- added option `--log.use-json-format` to switch log output to JSON format.
  Each log message then produces a separate line with JSON-encoded log data,
  which can be consumed by applications.

  The attributes produced for each log message JSON object are:

  | Key        | Value      |
  |:-----------|:-----------|
  | `time`     | date/time of log message, in format specified by `--log.time-format`
  | `prefix`   | only emitted if `--log.prefix` is set
  | `pid`      | process id, only emitted if `--log.process` is set
  | `tid`      | thread id, only emitted if `--log.thread` is set
  | `thread`   | thread name, only emitted if `--log.thread-name` is set
  | `role`     | server role (1 character), only emitted if `--log.role` is set
  | `level`    | log level (e.g. `"WARN"`, `"INFO"`)
  | `file`     | source file name of log message, only emitted if `--log.line-number` is set
  | `line`     | source file line of log message, only emitted if `--log.line-number` is set
  | `function` | source file function name, only emitted if `--log.line-number` is set
  | `topic`    | log topic name
  | `id`       | log id (5 digit hexadecimal string), only emitted if `--log.ids` is set
  | `hostname` | hostname if `--log.hostname` is set
  | `message`  | the actual log message payload

- added option `--log.process` to toggle the logging of the process id
  (pid) in log messages. Logging the process ID is useless when running
  arangod in Docker containers, as the pid will always be 1. So one may
  as well turn it off in these contexts with the new option.

- added option `--log.hostname` to optionally log the current host's name
  at the beginning of each log message (or inside the `hostname` attribute for
  JSON-based logging). Setting `--log.hostname` to a value of `auto` will
  automatically determine the hostname and use that for logging.

- added option `--log.in-memory` to toggle storing log messages in memory,
  from which they can be consumed via the `/_admin/log` HTTP API and by the 
  Web UI. By default, this option is turned on, so log messages are consumable 
  via the API and UI. Turning this option off will disable that functionality,
  save a tiny bit of memory for the in-memory log buffers and prevent potential
  log information leakage via these means.
    
- added option `--log.in-memory-level` to control which log messages are 
  preserved in memory (in case --log.in-memory is set to true). The default 
  value is `info`, meaning all log messages of types `info`, `warning`, `error` 
  and `fatal` will be stored by an instance in memory. 
  By setting this option to `warning`, only warning log messages will be 
  preserved in memory, and by setting the option to `error` only error messages 
  will be kept.
  This option is useful because the number of in-memory log messages is limited 
  to the latest 2048 messages, and these slots are by default shared between 
  informational, warning and error messages.

- added option `--log.max-entry-length` to control the maximum line length for 
  individual log messages that are written into normal logfiles by arangod 
  (note: this does not include audit log messages).
  Any log messages longer than the specified value will be truncated and the 
  suffix '...' will be added to them. 
  The purpose of this parameter is to shorten long log messages in case there is 
  not a lot of space for logfiles, and to keep rogue log messages from overusing 
  resources.
  The default value is 128 MB, which is very high and should effectively mean 
  downwards-compatibility with previous arangod versions, which did not restrict 
  the maximum size of log messages.

- added option `--audit.max-entry-length` to control the maximum line length 
  for individual audit log messages that are written into audit logs by arangod. 
  Any audit log messages longer than the specified value will be truncated and 
  the suffix '...' will be added to them.
  The default value is 128 MB, which is very high and should effectively mean 
  downwards-compatibility with previous arangod versions, which did not restrict 
  the maximum size of log messages.

- added option `--audit.queue` to control audit logging queuing behavior 
  (Enterprise Edition only):

  The option controls whether audit log messages are submitted to a queue
  and written to disk in batches or if they should be written to disk directly
  without being queued.
  Queueing audit log entries may be beneficial for latency, but can lead to
  unqueued messages being lost in case of a power loss or crash. Setting
  this option to `false` mimics the behavior from 3.7 and before, where
  audit log messages were not queued but written in a blocking fashion.

- any occurrence of `$PID` inside a log output value (e.g. `--log.output` or
  `--audit.output`) will be replaced at runtime with the actual process id. 
  This enables logging to process-specific files.

  Please note that the dollar sign in `$PID` may need extra escaping when 
  specified from inside shells such as Bash.

### Other logging improvements

- The maximum size of log messages buffered in memory was increased from 256
  bytes per log message to 512 bytes per log message. This should prevent most
  in-memory log messages returned by the `/_admin/log` HTTP API from being
  truncated unnecessarily.

- Audit logging and slow query logging for AQL queries now also include the
  query's result code (success or error code in case the query ran into an
  error). This can be used to find queries which ran into errors (audit logging)
  or long-running queries which ran into errors (normal logging).

- Audit logging now also honors the configured logging date/time output format
  for the regular logger. Previously the audit logging always logged date/time
  value in the server's local time, and used the format `YYYY-MM-DDTHH:MM:SS`.

  From 3.8 onwards, the audit logger will use the format specified via the
  `--log.time-format` option, which defaults to `utc-datestring`. The means the
  audit logging will by default log all dates/times in UTC time. To restore the
  pre-3.8 behavior, please set the option to `local-datestring`, which will
  make the audit logger (and all other server log messages) use the server's
  local time.

Timezone conversion
-------------------

Added IANA timezone database [tzdata](https://www.iana.org/time-zones){:target="_blank"}.

The following AQL functions have been added for converting datetimes in UTC to
any timezone in the world including historical daylight saving times and vice
versa. An optional detail flag returns the timezone information including
effect range, abbreviation, offset to UTC and whether daylight saving time is
active:

- [DATE_UTCTOLOCAL()](aql/functions-date.html#date_utctolocal)

  ```js
  RETURN DATE_UTCTOLOCAL("2020-10-15T01:00:00.999Z", "America/New_York")
  // [ "2020-10-14T21:00:00.999" ]
  ```

  ```js
  RETURN DATE_UTCTOLOCAL("2020-10-15T01:00:00.999Z", "America/New_York", true)
  /*
    {
      "local": "2020-10-14T21:00:00.999",
      "tzdb": "2020f",
      "zoneInfo": {
        "name": "EDT",
        "begin": "2020-03-08T07:00:00.000Z",
        "end": "2020-11-01T06:00:00.000Z",
        "save": true,
        "offset": -14400
      }
    }
  */
  ```

- [DATE_LOCALTOUTC()](aql/functions-date.html#date_localtoutc)

  ```js
  RETURN DATE_LOCALTOUTC("2020-10-14T21:00:00.999", "America/New_York")
  // [ "2020-10-15T01:00:00.999Z" ]
  ```

  ```js
  RETURN DATE_LOCALTOUTC("2020-10-14T21:00:00.999", "America/New_York")
  /*
    {
      "utc": "2020-10-15T01:00:00.999Z",
      "tzdb": "2020f",
      "zoneInfo": {
        "name": "EDT",
        "begin": "2020-03-08T07:00:00.000Z",
        "end": "2020-11-01T06:00:00.000Z",
        "save": true,
        "offset": -14400
      }
    }
  */
  ```

Also some functions have been added to acquire the system timezone ArangoDB is
running on and to list all valid IANA timezone names including canonical,
aliases and deprecated ones.

- [DATE_TIMEZONE()](aql/functions-date.html#date_timezone)

  ```js
  RETURN DATE_TIMEZONE() // [ "Etc/UTC" ]
  ```

- [DATE_TIMEZONES()](aql/functions-date.html#date_timezones)

  ```js
  RETURN DATE_TIMEZONES() // [ "Africa/Abidjan", ..., "Europe/Berlin", ..., "Zulu" ]
  ```

Client tools
------------

### _arangodump_ concurrency / shard-parallelism

Since v3.4.0, _arangodump_ can use multiple threads for dumping database data in
parallel. _arangodump_ versions prior to v3.8.0 distribute dump jobs for
individual collections to concurrent worker threads, which is optimal for
dumping many collections of approximately the same size, but does not help for
dumping few large collections or few large collections with many shards.

Starting with v3.8.0, _arangodump_ can also dispatch dump jobs for individual
shards of each collection, allowing higher parallelism if there are many shards
to dump but only few collections.

Also see [_arangodump_ Threads](programs-arangodump-examples.html#threads).

### _arangodump_ output format

Since its inception, _arangodump_ wrapped each dumped document into an extra
JSON envelope, such as follows:

```json
{"type":2300,"key":"test","data":{"_key":"test","_rev":..., ...}}
```

In case a dump taken with v3.8.0 or higher is known to never be used in older
ArangoDB versions, the JSON envelopes can be turned off with the new startup
option `--envelope false` to reduce the dump size and use a bit less memory
and bandwidth:

```json
{"_key":"test","_rev":..., ...}
```

Also see [_arangodump_ Dump Output Format](programs-arangodump-examples.html#dump-output-format).

Using the new non-enveloped dump format also allows _arangorestore_ to
parallelize restore operations for individual collections. This is not possible
with the old, enveloped format.

### _arangorestore_ parallelization for single collections

_arangorestore_ can now parallelize restore operations even for single
collections, which can lead to increased restore performance.
This requires that a dump in the new non-enveloped dump format is used, and that
there are enough _arangorestore_ threads to employ.

The dump format can be configured by specifying the `--envelope false` option
when invoking arangodump, and the number of restore threads can be adjusted by
setting _arangorestore_'s `--threads` option.

### _arangodump_ dumping of individual shards

_arangodump_ can now optionally dump individual shards only, by specifying the
`--shard` option one or multiple times. This option can be used to split the
dump of a large collection with multiple shards into multiple separate dump
processes, which could be run against different Coordinators etc.

### _arangodump_ and _arangorestore_ with JWT secret

_arangodump_ and _arangorestore_ can now also be invoked by providing the cluster's
JWT secret instead of the username/password combination. Both tools now provide
the options `--server.jwt-secret-keyfile` (to read the JWT secret from a file)
and `--server.ask-jwt-secret` (to enter it manually).

### _arangobench_ with custom queries

In addition to executing the predefined benchmarks, the _arangobench_ client tool
now offers a new test case named `custom-query` for running arbitrary AQL
queries against an ArangoDB installation.

To run a custom AQL query, the query needs to be specified in either the
`--custom-query` option or the `--custom-query-file` option. In the former case
the query string can be passed on the command-line, in the latter case the
query string will be read from a file.

### Continuing _arangorestore_ operations

_arangorestore_ now provides a `--continue` option. Setting it will make
_arangorestore_ keep track of the restore progress, so if the restore process
gets aborted it can later be continued from the point it left off.

### Controlling the number of documents per batch for _arangoexport_

_arangoexport_ now has a `--documents-per-batch` option that can be used to limit
the number of documents to be returned in each batch from the server. This is
useful if a query is run on overly large documents, which would lead to the
response sizes getting out of hand with the default number of documents per
batch (1000).

### Controlling the maximum query runtime of _arangoexport_

_arangoexport_ now has a `--query-max-runtime` option to limit the runtime of
queries it executes.

Miscellaneous
-------------

- Added cluster support for the JavaScript API method `collection.checksum()`
  and the REST HTTP API endpoint `GET /_api/collection/{collection-name}/checksum`,
  which calculate CRC checksums for collections.

- Added cluster support for the JavaScript API method `db._engineStats()`
  and the REST HTTP API endpoint `GET /_api/engine/stats`, which provide
  runtime information about the storage engine state.

Internal changes
----------------

### Library version upgrades

The bundled version of the Snappy compression/decompression library has been
upgraded to 1.1.8.

The bundled version of libunwind has been upgraded to 1.5.

For ArangoDB 3.8, the bundled version of rclone is 1.51.0.

### Spliced subqueries

The AQL optimizer rule "splice-subqueries" is now mandatory, in the sense that
it cannot be disabled anymore. As a side effect of this change, there will no
query execution plans created by 3.8 that contain execution nodes of type
`SubqueryNode`. `SubqueryNode`s will only be used during query planning and
optimization, but at the end of the query optimization phase will all have
been replaced with nodes of types `SubqueryStartNode` and `SubqueryEndNode`.

The code to execute non-spliced subqueries remains in place so that 3.8 can
still execute queries planned on a 3.7 instance with the "splice-subqueries"
optimizer rule intentionally turned off. The code for executing non-spliced
subqueries can be removed in 3.9.

### Query register usage

There is an AQL query execution plan register usage optimization that may
positively affect some AQL queries that use a lot of variables that are only
needed in certain parts of the query. The positive effect will come from saving
registers, which directly translates to saving columns in *AqlItemBlocks*.

Previously, the number of registers that were planned for each depth level of
the query never decreased when going from one level to the next. Even though
unused registers were recycled since 3.7, this did not lead to unused registers
being completely dismantled.

Now there is an extra step at the end of the register planning that keeps track
of the actually used registers on each depth, and that will shrink the number
of registers for the depth to the id of the maximum register. This is done for
each depth separately. Unneeded registers on the right hand side of the maximum
used register are now discarded. Unused registers on the left hand side of the
maximum used register id are not discarded, because we still need to guarantee
that registers from depths above stay in the same slot when starting a new
depth.

### Better protection against overwhelm

The cluster now protects itself better against being overwhelmed by too
many concurrent requests.

This is mostly achieved by limiting the total amount of requests from
the low priority queue which are ongoing concurrently. There is a new option
`--server.ongoing-low-priority-multiplier` (default is 4), which
essentially says that only 4 times as many requests may be ongoing
concurrently as there are worker threads. The default is chosen such
that it is sensible for most workloads, but in special situations it
can help to adjust the value.

See [ArangoDB Server _Server_ Options](programs-arangod-server.html#preventing-cluster-overwhelm)
for details and hints for configuration.

There have been further improvements, in particular to ensure that
certain APIs to diagnose the situation in the cluster still work, even
when a lot of normal requests are piling up. For example, the cluster
health API will still be available in such a case.

Furthermore, followers will now be dropped much later and only if they
are actually failed, which leads to a lot fewer shard re-synchronizations
in case of very high load.

Overall, these measures should all be below the surface and not be
visible to the user at all (apart from preventing problems under high
load).
