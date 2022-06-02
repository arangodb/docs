---
layout: default
description: ArangoDB v3.9 Release Notes New Features
---
Features and Improvements in ArangoDB 3.9
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.9. ArangoDB 3.9 also contains several bug fixes that are not listed
here.

Hybrid (Disjoint) SmartGraphs (Enterprise Edition)
--------------------------------------------------

SmartGraphs have been extended with a new option to create Hybrid SmartGraphs.
Hybrid SmartGraphs are capable of using SatelliteCollections within their graph
definition and therefore can make use of all the benefits of
[SatelliteCollections](satellites.html).

Edge definitions can now be created between SmartCollections and
SatelliteCollections. As SatelliteCollections are globally replicated to each
participating DB-Server, regular graph traversals, weighted traversals,
shortest path, and k shortest paths queries can partially be executed locally on
each DB-Server. This means that query execution can be fully local whenever
actual data from the SatelliteCollections is being processed. This can improve
data locality and reduce the number of network hops between cluster nodes.

In case you do have collections that are needed in almost every traversal but
are small enough to be copied over to every participating DB-Server,
Hybrid SmartGraphs are the perfect fit, as this will increase the amount of
local query execution.

Hybrid SmartGraphs can also be disjoint. A Disjoint SmartGraph prohibits edges
connecting different SmartGraph components. The same rule applies to
[Hybrid Disjoint SmartGraphs](graphs-smart-graphs.html#benefits-of-hybrid-disjoint-smartgraphs).
If your graph does not need edges between vertices with different SmartGraph
attribute values, then you should enable this option. This topology restriction
allows the query optimizer to improve traversal execution times, because the
execution can be pushed down to a single DB-Server in many cases.

[Hybrid SmartGraphs](graphs-smart-graphs.html#benefits-of-hybrid-smartgraphs)
are only available in the Enterprise Edition.

ArangoSearch
------------

### Segmentation and Collation Analyzers

The new `segmentation` Analyzer type allows you to tokenize text in a
language-agnostic manner as per
[Unicode Standard Annex #29](https://unicode.org/reports/tr29){:target="_blank"},
making it suitable for mixed language strings. It can optionally preserve all
non-whitespace or all characters instead of keeping alphanumeric characters only,
as well as apply case conversion.

The `collation` Analyzer converts the input into a set of language-specific
tokens. This makes comparisons follow the rules of the respective language,
most notable in range queries against Views.

See:
- [`segmentation` Analyzer](analyzers.html#segmentation)
- [`collation` Analyzer](analyzers.html#collation)

UI
--

### Rebalance Shards for all databases in Web UI

The rebalance shards section displays a button for rebalancing shards.
In previous versions, this button only appeared for the `_system` database,
but now it appears in user-created databases as well if the user has the write
permission for the database.

There is also a new startup option to limit the
[Maximum number of move shards](#maximum-number-of-move-shards).

### Analyzers in Web Interface

A new menu item _ANALYZERS_ has been added to the side navigation bar of the
Web UI. Through this page, you can view existing Analyzers as well create new
Analyzers. The UI is full-featured and lets you feed in all parameters and
options that you could otherwise input through the HTTP or JavaScript API.

It also lets you copy configuration from an existing Analyzer, allowing for a
much quicker workflow when your new Analyzer is very similar to an existing one.

It offers two edit/view modes - a form mode where a standard web form is used to
capture user input, and a JSON mode where experienced users can directly write
the raw Analyzer configuration in JSON format.

### Additional Fields in Views Creation Form

ArangoSearch Views have 6 immutable fields (apart from `name` and `type`) that
can only be set once at the time of creation. The web interface now includes
these fields in the View creation form, so that you can set them when creating
Views through the UI:

- `primarySort`
- `primarySortCompression`
- `storedValues`
- `writebufferIdle`
- `writebufferActive`
- `writebufferSizeMax`

### Web interface session handling

The previously inactive startup parameter `--server.session-timeout` was
revived and now controls the timeout for web interface sessions (and other
sessions that are based on JWTs created by the `/_open/auth` API).

For security reasons, the default timeout value for web interface sessions
has been reduced to one hour, after which a session is ended automatically.
Web interface sessions that are active (i.e. that have any user activity)
are automatically extended until the user ends the session explicitly or
if there is a period of one hour without any user activity.

The timeout value for web interface sessions can be adjusted via the
`--server.session-timeout` startup parameter (in seconds).

### Configurable root redirect

Added two options to `arangod` to allow HTTP redirection customization for
root (`/`) call of the HTTP API:

- `--http.permanently-redirect-root`: if `true` (default), use a permanent
  redirection (use HTTP 301 code), if `false` fall back to temporary redirection
  (use HTTP 302 code).

- `--http.redirect-root-to`: redirect of root URL to a specified path.
  Redirects to `/_admin/aardvark/index.html` if not set (default).

These options are useful to override the built-in web interface with some 
user-defined action.

AQL
---

### Upsert with Index Hint

Added support for the `indexHint` and `forceIndexHint` options to the `UPSERT`
operation. It will be used as a hint for the document lookup that is performed
as part of the `UPSERT` operation, and can help in cases such as `UPSERT` not
picking the best index automatically.

```js
UPSERT { a: 1234 }
  INSERT { a: 1234, name: "AB"}
  UPDATE {name: "ABC"} IN myCollection
  OPTIONS { indexHint: "index_name", forceIndexHint: true }
```

See [`UPSERT` Options](aql/operations-upsert.html#indexhint)

### Decay Functions

Added three decay functions to AQL:

- [DECAY_EXP()](aql/functions-numeric.html#decay_exp)
- [DECAY_LINEAR()](aql/functions-numeric.html#decay_linear)
- [DECAY_GAUSS()](aql/functions-numeric.html#decay_gauss)

Decay functions calculate a score with a function that decays depending on the
distance of a numeric value from a user given origin.

```js
DECAY_GAUSS(41, 40, 5, 5, 0.5) // 1
DECAY_LINEAR(5, 0, 10, 0, 0.2) // 0.6
DECAY_EXP(2, 0, 10, 0, 0.2)    // 0.7247796636776955
```

### Vector Functions

Added three vector functions to AQL for calculating the cosine similarity
(`COSINE_SIMILARITY`), Manhattan distance (named `L1_DISTANCE`), and Euclidean 
distance (named `L2_DISTANCE`):

- [COSINE_SIMILARITY()](aql/functions-numeric.html#cosine_similarity)
- [L1_DISTANCE()](aql/functions-numeric.html#l1_distance)
- [L2_DISTANCE()](aql/functions-numeric.html#l2_distance)

```js
COSINE_SIMILARITY([0,1], [1,0]) // 0
L1_DISTANCE([-1,-1], [2,2]) // 6
L2_DISTANCE([1,1], [5,2]) // 4.1231056256176606
```

### Traversal filtering optimizations

A post-filter on the vertex and/or edge result of a traversal will now be
applied during the traversal to avoid generating the full output for AQL.
This will have a positive impact on performance when filtering on the 
vertex/edge but still returning the path.

Previously all paths were produced even for non-matching vertices/edges.
The new optimization now will check on the vertex/edge filter condition
first and only produce the remaining paths.

For example, the query

```js
FOR v, e, p IN 10 OUTBOUND @start GRAPH "myGraph"
  FILTER v.isRelevant == true
  RETURN p
```

can now be optimized, and the traversal statement will only produce 
paths for which the last vertex satisfies `isRelevant == true`.

This optimization is now part of the existing `optimize-traversals` rule and
you will see the conditions under `Filter / Prune Conditions` in the query
explain output (`` FILTER (v.`isRelevant` == true) `` in this example):

```js
Execution plan:
 Id   NodeType          Est.   Comment
  1   SingletonNode        1   * ROOT
  2   TraversalNode        1     - FOR v  /* vertex */, p  /* paths: vertices, edges */ IN 10..10  /* min..maxPathDepth */ OUTBOUND 'A' /* startnode */  GRAPH 'myGraph'
  3   CalculationNode      1       - LET #5 = (v.`isRelevant` == true)   /* simple expression */
  4   FilterNode           1       - FILTER #5
  5   ReturnNode           1       - RETURN p

Indexes used:
 By   Name   Type   Collection   Unique   Sparse   Selectivity   Fields        Ranges
  2   edge   edge   edge         false    false       100.00 %   [ `_from` ]   base OUTBOUND

Traversals on graphs:
 Id  Depth   Vertex collections  Edge collections  Options                                  Filter / Prune Conditions      
 2   10..10  vert                edge              uniqueVertices: none, uniqueEdges: path  FILTER (v.`isRelevant` == true)

Optimization rules applied:
 Id   RuleName
  1   optimize-traversals
```

### Traversal partial path buildup

There is now a performance optimization for traversals in which the path
is returned, but only a specific sub-attribute of the path is used later
(e.g. `vertices`, `edges`, or `weight` sub-attribute).

For example, the query

```js
FOR v, e, p IN 1..3 OUTBOUND @start GRAPH "myGraph"
  RETURN p.vertices
```

only requires the buildup of the `vertices` sub-attribute of the path result `p`
but not the buildup of the `edges` sub-attribute. The optimization can be
observed in the query explain output:

```js
Execution plan:
 Id   NodeType          Est.   Comment
  1   SingletonNode        1   * ROOT
  2   TraversalNode        1     - FOR v  /* vertex */, p  /* paths: vertices */ IN 1..3  /* min..maxPathDepth */ OUTBOUND 'A' /* startnode */  GRAPH 'myGraph'
  3   CalculationNode      1       - LET #5 = p.`vertices`   /* attribute expression */
  4   ReturnNode           1       - RETURN #5

Indexes used:
 By   Name   Type   Collection   Unique   Sparse   Selectivity   Fields        Ranges
  2   edge   edge   edge         false    false       100.00 %   [ `_from` ]   base OUTBOUND

Traversals on graphs:
 Id  Depth  Vertex collections  Edge collections  Options                                  Filter / Prune Conditions
 2   1..3   vert                edge              uniqueVertices: none, uniqueEdges: path                           

Optimization rules applied:
 Id   RuleName
  1   optimize-traversals
  2   remove-redundant-path-var
```

The `remove-redundant-path-var` optimization rule is applied and the
TraversalNode's comment indicates that only the `vertices` sub-attribute is
built up for this query: `p  /* paths: vertices */`

This optimization should have a positive impact on performance for larger
traversal result sets.

### Prune Variable

Added an option to store the `PRUNE` expression as a variable. Now, the `PRUNE`
condition can be stored in a variable and be used later in the query without
having to repeat the `PRUNE` condition:

```js
FOR v, e, p IN 10 OUTBOUND @start GRAPH "myGraph"
  PRUNE pruneCondition = v.isRelevant == true
  FILTER pruneCondition
  RETURN p
```

The `v.isRelevant == true` condition is stored in the `pruneCondition` variable
and used as a condition for `FILTER` later.

See [Pruning](aql/graphs-traversals.html#pruning).

### Warnings on invalid OPTIONS

Invalid use of `OPTIONS` in AQL queries will now raise a warning when the query
is parsed. This is useful to detect misspelled attribute names in `OPTIONS`, e.g.

```js
INSERT ... INTO collection
  OPTIONS { overwrightMode: 'ignore' } /* should have been 'overwriteMode' */
```

It is also useful to detect the usage of valid `OPTIONS` attribute names that
are used at a wrong position in the query, e.g.

```js
FOR doc IN collection
  FILTER doc.value == 1234
  INSERT doc INTO other
    OPTIONS { indexHint: 'myIndex' } /* should have been used above for FOR */
```

In case options are used incorrectly, a warning with code 1575 will be raised
during query parsing or optimization. By default, warnings are reported but do
not lead to the query being aborted. This can be toggled by the startup option
`--query.fail-on-warnings` or the per-query runtime option `failOnWarnings`.

### Memory usage tracking

The AQL operations `K_SHORTEST_PATHS` and `SHORTEST_PATH` are now included
in the memory usage tracking performed by AQL, so that memory acquired by these
operations will be accounted for and checked against the configured memory
limit (options `--query.memory-limit` and `--query.memory-limit-global`).

### Execution of complex queries

Very large queries (in terms of query execution plan complexity) are now split
into multiple segments which are executed using separate stacks. This prevents a
potential stack overflow. To configure the number of execution nodes after such a
stack splitting is performed, use the `--query.max-nodes-per-callstack` startup option. 
The default value is 200 for macOS, and 250
for the other supported platforms. The value can be adjusted per query via the
`maxNodesPerCallstack` query option. Please note that the default values 
should work and adjusting the option is only useful for testing and debugging.

### Query complexity limits

AQL now has some hard-coded query complexity limits, to prevent large 
programmatically generated queries from causing trouble (too deep recursion, 
enormous memory usage, long query optimization and distribution passes etc.).

The following limits have been introduced:
- a recursion limit for AQL query expressions. An expression can now be
  up to 500 levels deep. An example expression is `1 + 2 + 3 + 4`, which
  is 3 levels deep `1 + (2 + (3 + 4))`.
  The expression recursion is limited to 500 levels.
- a limit for the number of execution nodes in the initial query
  execution plan.
  The number of execution nodes in the initial query execution plan is 
  limited to 4000. This number includes all execution nodes of the
  initial execution plan, even if some of them could be
  optimized away later by the query optimizer during plan optimization.

AQL queries that violate these limits will fail to run, and instead abort 
with error `1524` ("too much nesting or too many objects") during setup.

### `disableIndex` hint

<small>Introduced in: v3.9.1</small>

In some rare cases, an AQL query can be executed faster if it ignores indexes.
You can force the optimizer not use an index for any given `FOR`
loop by setting the new `disableIndex` hint to `true`:

```js
FOR doc IN collection OPTIONS { disableIndex: true }
  FILTER doc.value <= 99
  RETURN doc.other
```

See the [`FOR` Operation Options](aql/operations-for.html#disableindex) for details.

### `maxProjections` hint

<small>Introduced in: v3.9.1</small>

If an AQL query accesses 5 or fewer attributes of a collection in a `FOR` loop,
the query optimizer changes the strategy for retrieving the data from the
storage engine. Instead of extracting full documents, only subsets of the
documents are fetched.

Such projections are typically faster as long as there are not too many of them
but it depends on the number of attributes and their size. The new `maxProjections`
hint lets you adjust the threshold to fine-tune your queries.

```js
FOR doc IN collection OPTIONS { maxProjections: 7 }
  RETURN [ doc.val1, doc.val2, doc.val3, doc.val4, doc.val5, doc.val6, doc.val7 ]
```

See the [`FOR` Operation Options](aql/operations-for.html#maxprojections) for details.

### RocksDB block cache control

The new query option `fillBlockCache` can be used to control the population
of the RocksDB block cache with data read by the query. The default value for
this per-query option is `true`, which means that any data read by the query
will be inserted into the RocksDB block cache if not already present in there.
This mimics the previous behavior and is a sensible default.

Setting the option to `false` allows to not store any data read by the query
in the RocksDB block cache. This is useful for queries that read a lot of (cold)
data which would lead to the eviction of the hot data from the block cache.

### AQL function to return a shard ID for a document

A new [AQL function](aql/functions-miscellaneous.html#shard_id) is available which allows you to 
obtain the responsible shard for any document in a collection by specifying its shard keys.

Multi-dimensional Indexes (experimental)
----------------------------------------

ArangoDB 3.9 features a new index type `zkd`. It can be created like other
indexes on collections. In contrast to the `persistent` index type (same for
`hash` and `skiplist`, which today are just aliases for `persistent`), it lifts
the following restriction.

A `persistent` index can only be used with query filters where a conjunction of
equalities on a prefix of indexed fields covers the filter. For example, given a
collection with a `persistent` index on the fields `["a", "b"]`. Then the
following filters _can_ be satisfied by the index:

- `FILTER doc.a == @a`
- `FILTER doc.a == @a && doc.b == @b`
- `FILTER doc.a == @a && @bl <= doc.b && doc.b <= @bu`

While the following filters _cannot_, or only partially, be satisfied by a
`persistent` index:

- `FILTER doc.b == @b`
- `FILTER @bl <= doc.b && doc.b <= @bu`
- `FILTER @al <= doc.a && doc.a <= @au && @bl <= doc.b && doc.b <= @bu`

A `zkd` index can be used to satisfy them all. An example where this is useful
are documents with an assigned time interval, where a query should find all
documents that contain a given time point, or overlap with some time interval.

There are also drawbacks in comparison with `persistent` indexes. For one, the
`zkd` index is not sorted. Secondly, it has a significantly higher overhead, and
the emerging performance is much more dependent on the distribution of the
dataset, making it less predictable. A third limitation is that `zkd` indexes
can only be created for index values which are IEEE 754 doubles.

[Multi-dimensional Indexes](indexing-multi-dim.html) are an experimental feature.

Server options
--------------

### Maximum number of move shards

The `--cluster.max-number-of-move-shards` startup option limits the maximum
number of move shards operations that can be made when the **Rebalance Shards**
button is clicked in the Web UI. For backwards compatibility purposes, the
default value is `10`. If the value is `0`, then the tab containing this button
will be inactive and the button cannot be clicked.

### Extended naming convention for databases

There is a new startup option `--database.extended-names-databases` to allow
database names to contain most UTF-8 characters. This feature is
**experimental** in ArangoDB 3.9, but will become the norm in a future version.

Running the server with the option enabled provides support for database names
that are not comprised within the ASCII table, such as Japanese or Arabic
letters, emojis, letters with accentuation. Also, many ASCII characters that
were formerly banned in the traditional naming convention are now accepted.

Example database names that can be used with the new naming convention:
`"España", "😀", "犬", "كلب", "@abc123", "København", "München", "Россия", "abc? <> 123!"`

The ArangoDB client tools _arangobench_, _arangodump_, _arangoexport_,
_arangoimport_, _arangorestore_, and _arangosh_ ship with full support for the 
extended database naming convention.

Note that the default value for `--database.extended-names-databases` is `false`
for compatibility with existing client drivers and applications that only support
ASCII names according to the traditional database naming convention used in previous
ArangoDB versions. Enabling the feature may lead to incompatibilities up to the
ArangoDB instance becoming inaccessible for such drivers and client applications.

Please be aware that dumps containing extended database names cannot be restored
into older versions that only support the traditional naming convention. In a
cluster setup, it is required to use the same database naming convention for all
Coordinators and DB-Servers of the cluster. Otherwise the startup will be
refused. In DC2DC setups it is also required to use the same database naming
convention for both datacenters to avoid incompatibilities.

Also see [Database Naming Conventions](data-modeling-naming-conventions-database-names.html).

### ICU Language

<small>Introduced in: v3.9.1</small>

A new server startup option for setting the language was added. The new
`--icu-language` option will replace the existing `--default-language` option,
and only one of the two can be set.

Also see [ArangoDB Server General Options](programs-arangod-general.html#icu-language).

### Logging

The server now has two flags for retaining or escaping control and Unicode
characters in the log. The flag `--log.escape` is now deprecated and, instead,
the new flags `--log.escape-control-chars` and `--log.escape-unicode-chars`
should be used.

- `--log.escape-control-chars`:

  This flag applies to the control characters, that have hex codes below `\x20`,
  and also the character `DEL` with hex code `\x7f`.

  When the flag value is set to `false`, control characters will be retained
  when they have a visible representation, and replaced with a space character
  in case they do not have a visible representation. For example, the control
  character `\n` is visible, so a `\n` will be displayed in the log. Contrary,
  the control character `BEL` is not visible, so a space will be displayed
  instead.

  When the flag value is set to `true`, the hex code for the character is
  displayed, for example, the `BEL` character will be displayed as its hex code,
  `\x07`.

  The default value for this flag is `true` to ensure compatibility with 
  previous versions.

- `--log.escape-unicode-chars`:

  If its value is set to `false`, Unicode characters will be retained and
  written to the log as-is. For example, `犬` will be logged as `犬`. If the
  flag value is set to `true`, any Unicode characters are escaped, and the hex
  codes for all Unicode characters are logged instead. For example, `犬` would
  be logged as its hex code, `\u72AC`.

  The default value for this flag is set to `false` for compatibility with
  previous versions.

Also see [Logging](programs-arangod-log.html).

### Version information

The _arangod_ server now provides a command `--version-json` to print version
information in JSON format. This output can be used by tools that need to 
programmatically inspect an _arangod_ executable.

A pseudo log topic `"all"` was added. Setting the log level for the "all" log
topic will adjust the log level for **all existing log topics**. For example,
`--log.level all=debug` will set all log topics to log level "debug".

Overload control
----------------

Starting with version 3.9.0, ArangoDB returns an `x-arango-queue-time-seconds`
HTTP header with all responses. This header contains the most recent request
queueing/dequeuing time (in seconds) as tracked by the server's scheduler.
This value can be used by client applications and drivers to detect server 
overload and react on it.

The arangod startup option `--http.return-queue-time-header` can be set to
`false` to suppress these headers in responses sent by arangod.

In a cluster, the value returned in the `x-arango-queue-time-seconds` header
is the most recent queueing/dequeuing request time of the Coordinator the
request was sent to, except if the request is forwarded by the Coordinator to
another Coordinator. In that case, the value will indicate the current
queueing/dequeuing time of the forwarded-to Coordinator.

In addition, client applications and drivers can optionally augment the
requests they send to arangod with the header `x-arango-queue-time-seconds`.
If set, the value of the header should contain the maximum server-side
queuing time (in seconds) that the client application is willing to accept.
If the header is set in an incoming request, arangod will compare the current
dequeuing time from its scheduler with the maximum queue time value contained
in the request header. If the current queueing time exceeds the value set
in the header, arangod will reject the request and return HTTP 412
(precondition failed) with the error code 21004 (queue time violated).
In a cluster, the `x-arango-queue-time-seconds` request header will be 
checked on the receiving Coordinator, before any request forwarding.

Support info API
----------------

A new HTTP REST API endpoint `GET /_admin/support-info` was added for retrieving
deployment information for support purposes. The endpoint returns data about the
ArangoDB version used, the host (operating system, server ID, CPU and storage capacity,
current utilization, a few metrics) and the other servers in the deployment
(in case of active failover or cluster deployments).

As this API may reveal sensitive data about the deployment, it can only be 
accessed from inside the `_system` database. In addition, there is a policy control 
startup option `--server.support-info-api` that controls if and to whom the API 
is made available. This option can have the following values:

- `disabled`: support info API is disabled.
- `jwt`: support info API can only be accessed via superuser JWT.
- `hardened` (default): if `--server.harden` is set, the support info API can only be
  accessed via superuser JWT. Otherwise it can be accessed by admin users only.
- `public`: everyone with access to the `_system` database can access the support info API.

License Management (Enterprise Edition)
---------------------------------------

The Enterprise Edition of ArangoDB requires a license to activate it.
ArangoDB 3.9 comes with a new license management that lets you test ArangoDB
for three hours before requiring a license key to keep the Enterprise Edition
features activated.

There is a new JavaScript API for querying the license status and to set a
license key (typically run in _arangosh_):

```js
db._getLicense();
db._setLicense("<license-string>");
```

There are two new REST API routes to do the same, `GET /_admin/license` and
`PUT /_admin/license`.

See [License Management](administration-license.html) and the
[License Management HTTP API](http/license.html).

Miscellaneous changes
---------------------

### Collection statuses

The previously existing collection statuses "new born", "loading", "unloading"
and "unloaded" were removed, as they weren't actively used in arangod.

These statuses were last relevant with the MMFiles storage engine, when it was
important to differentiate which collections were present in main memory and
which weren't. With the RocksDB storage engine, all that is automatically
handled anyway, and the mentioned statuses are not important anymore.

The "Load" and "Unload" buttons for collections have also been removed from the
web interface. This change also obsoletes the `load()` and `unload()` calls for
collections as well as their HTTP API equivalents. The APIs will remain in place
for now for downwards-compatibility but have been changed to no-ops.
They will eventually be removed in a future version of ArangoDB.

### Cluster-internal timeouts

The internal timeouts for inactive cluster transactions on DB-Servers was
increased from 3 to 5 minutes.

Previously transactions on DB-Servers could expire quickly, which led to
spurious "query ID not found" or "transaction ID not found" errors on DB
servers for multi-server queries/transactions with unbalanced access patterns
for the different participating DB-Servers.

Transaction timeouts on Coordinators remain unchanged, so any queries/transactions
that are abandoned will be aborted there, which will also be propagated to
DB-Servers.

### Deployment mode "leader-follower" no longer supported

The Leader/Follower deployment mode in which two single servers were
set up as a leader and follower pair (without any kind of automatic
failover) was deprecated and removed from the documentation.

Recommended alternatives are the Active Failover deployment option and the OneShard feature in a cluster.

Client tools
------------

### Increased default number of threads

The default value for the `--threads` startup parameter was changed from
2 to the maximum of 2 and the number of available CPU cores for the following
client tools:

- arangodump
- arangoimport
- arangorestore

The `--threads` option works dynamically, its value depends on the number of available CPU cores. If the amount of available CPU cores is less than `3`, a threads value of `2` is used. Otherwise the value of threads is set to the number of available CPU cores.

This change can help to improve performance of imports, dumps or restore
processes on machines with multiple cores in case the `--threads` parameter
was not previously used. As a trade-off, the change may lead to an increased 
load on servers, so any scripted imports, dumps or restore processes that 
want to keep the server load under control should set the number of client
threads explicitly when invoking any of the above client tools.

### arangoimport

_arangoimport_ received a new startup option `--merge-attributes` that allows
you to create additional attributes in CSV/TSV imports based on other attribute
values and hard-coded string literals/separators.

The following example would add a new attribute named `fullName` that consists
of the values of the `firstName` and `lastName` columns, separated by a colon
character `:`, as well as as an additional attribute `nameAndId` that builds on
the new `fullName` attribute and concatenates it with a hyphen `-` and the value
of the `id` column:

```
arangoimport \
  --merge-attributes fullName=[firstName]:[lastName] \
  --merge-attributes nameAndId=[fullName]-[id] \
  ...
```

Also see [Merging Attributes](programs-arangoimport-examples-csv.html#merging-attributes).

_arangoimport_ also provides a new `--datatype` startup option, in order to fix
the datatypes for certain attributes in CSV/TSV imports. For example, in the
the following CSV input file, it is unclear if the numeric values should be
imported as numbers or as stringified numbers for the individual attributes:

```
key,price,weight,fk
123456,200,5,585852
864924,120,10,9998242
9949,70,11.5,499494
6939926,2130,5,96962612
```

To determine the datatypes for the individual columns, _arangoimport_ can be
invoked with the `--datatype` startup option, once for each attribute:

```
--datatype key=string
--datatype price=number
--datatype weight=number
--datatype fk=string
```

This will turn the numeric-looking values in the `key` attribute into strings
but treat the attributes `price` and `weight` as numbers. Finally, the values in
attribute `fk` will be treated as strings again.

See [Overriding data types per attribute](programs-arangoimport-examples-csv.html#overriding-data-types-per-attribute).

### arangobench

Histogram is now switched off by default (the `--histogram.generate` flag set to false). To display it, set the flag to true.
If this option is disabled, but other histogram flags are addressed, e.g. `--histogram.interval-size 500`, everything will still run normally, but a warning message will be displayed saying that the histogram is switched off and using that flag has no effect.

_arangobench_ now prints a short description of the test case started, so
it is easier to figure out what operations are carried out by a test case.
Several test cases in arangobench have been deprecated because they do not
target real world use cases but were rather writing for some internal testing.
The deprecated test cases will be removed in a future version to clear up
the list of test cases.

_arangobench_ now supports multiple Coordinators. The flag `--server.endpoint`
can be specified multiple times, as in the example below:

```
arangobench \
  --server.endpoint tcp://[::1]::8529 \
  --server.endpoint tcp://[::1]::8530 \
  --server.endpoint tcp://[::1]::8531 \
  ...
``` 

This does not compromise the use of the other client tools, that preserve
the behavior of having one Coordinator and one endpoint.

Also see [_arangobench_ Options](programs-arangobench.html#general-configuration)

### arangodump

_arangodump_ now supports multiple Coordinators. The flag `--server.endpoint`
can be used multiple times, as in the example below:

```
arangodump \
  --server.endpoint tcp://[::1]::8529 \
  --server.endpoint tcp://[::1]::8530 \
  --server.endpoint tcp://[::1]::8531 \
  ...
```

This does not compromise the use of the other client tools that preserve
the behavior of having one Coordinator and one endpoint.

Also see [_arangodump_ examples](programs-arangodump-examples.html)

### arangorestore

_arangorestore_ now supports multiple Coordinators. The flag `--server.endpoint`
can be used multiple times, as in the example below:

```
arangorestore \
  --server.endpoint tcp://[::1]::8529 \
  --server.endpoint tcp://[::1]::8530 \
  --server.endpoint tcp://[::1]::8531 \
  ...
```

This does not compromise the use of the other client tools that preserve
the behavior of having one Coordinator and one endpoint.

Also see [_arangorestore_ examples](programs-arangorestore-examples.html)

### arangovpack

The _arangovpack_ utility supports more input and output formats (JSON and
VelocyPack, plain or hex-encoded). The former options `--json` and `--pretty`
have been removed and have been replaced with separate options for specifying
the input and output types:

- `--input-type` (`json`, `json-hex`, `vpack`, `vpack-hex`)
- `--output-type` (`json`, `json-pretty`, `vpack`, `vpack-hex`)

The former option `--print-non-json` has been replaced with the new option
`--fail-on-non-json` which makes [arangovpack](programs-arangovpack.html)
fail when trying to emit non-JSON types to JSON output.

Internal changes
----------------

The compiler version used to build the ArangoDB Linux executables has been
upgraded from g++ 9.3.0 to g++ 10.2.1.
g++ 10 is also the expected version of g++ when compiling ArangoDB from
source.

The bundled version of the Snappy compression library was upgraded from
version 1.1.8 to version 1.1.9.

The bundled version of the RocksDB library has been upgraded from 6.8 to 6.27.

For ArangoDB 3.9.2, the bundled version of rclone has been upgraded to 1.51.0.

The minimum architecture requirements have been raised from the Westmere
architecture to the Sandy Bridge architecture. 256-bit AVX instructions are
now expected to be present on all targets that run ArangoDB 3.9 executables.
If a target does not support AVX instructions, it may fail with SIGILL at
runtime.
