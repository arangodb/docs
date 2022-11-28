---
fileID: release-notes-upgrading-changes34
title: Incompatible changes in ArangoDB 3.4
weight: 11735
description: 
layout: default
---
- all AQL date functions in 3.4 may raise an "invalid date value" warning when given a
  syntactically invalid date string as an input. The rules for valid date strings have been
  made more strict in ArangoDB 3.4.

  In previous versions, passing in a date value with a one-digit hour, minute or second
  component worked just fine, and the date was considered valid.

  From ArangoDB 3.4 onwards, using date values with a one-digit hour, minute or second
  component will render the date value invalid, and make the underlying date functions
  return a value of `null` and issue an "invalid date value" warning.

  The following overview details which values are considered valid and invalid in the
  respective ArangoDB versions:

  | Date string             | 3.3   | 3.4         |
  |-------------------------|-------|-------------|
  | `"2019-07-01 05:02:34"` | valid | valid       |
  | `"2019-7-1 05:02:34"`   | valid | valid       |
  | `"2019-7-1 5:02:34"`    | valid | **invalid** |
  | `"2019-7-1 05:2:34"`    | valid | **invalid** |
  | `"2019-7-1 05:02:4"`    | valid | **invalid** |
  | `"2019-07-01T05:02:34"` | valid | valid       |
  | `"2019-7-1T05:02:34"`   | valid | valid       |
  | `"2019-7-1T5:02:34"`    | valid | **invalid** |
  | `"2019-7-1T05:2:34"`    | valid | **invalid** |
  | `"2019-7-1T05:02:4"`    | valid | **invalid** |

- the AQL functions `CALL` and `APPLY` may now throw the errors 1540
  (`ERROR_QUERY_FUNCTION_NAME_UNKNOWN`) and 1541 (`ERROR_QUERY_FUNCTION_ARGUMENT_TYPE_MISMATCH`)
  instead of error 1582 (`ERROR_QUERY_FUNCTION_NOT_FOUND`) in some situations.

- the existing "fulltext-index-optimizer" optimizer rule has been removed 
  because its duty is now handled by the new "replace-function-with-index" rule.

- the behavior of the `fullCount` option for AQL queries has changed so that it 
  will only take into account `LIMIT` statements on the top level of the query.

  `LIMIT` statements in subqueries will not have any effect on the `fullCount` results
  any more.

- the AQL functions `NEAR`, `WITHIN`, `WITHIN_RECTANGLE` and `FULLTEXT` do not 
  support accessing collections dynamically anymore.

  The name of the underlying collection and the name of the index attribute to be
  used have to specified using either collection name identifiers, string literals 
  or bind parameters, but must not be specified using query variables.

  For example, the following AQL queries are ok:
 
      FOR doc IN NEAR(myCollection, 2.5, 3) RETURN doc
      FOR doc IN NEAR(@@collection, 2.5, 3) RETURN doc
      FOR doc IN FULLTEXT("myCollection", "body", "foxx") RETURN doc
      FOR doc IN FULLTEXT(@@collection, @attribute, "foxx") RETURN doc

  Contrary, the following queries will fail to execute with 3.4 because of dynamic
  collection/attribute names used in them:

      FOR name IN ["col1", "col2"] FOR doc IN NEAR(name, 2.5, 3) RETURN doc

      FOR doc IN collection 
        FOR match IN FULLTEXT(PARSE_IDENTIFIER(doc).collection, PARSE_IDENTIFIER(doc).key, "foxx") RETURN doc

- the AQL warning 1577 ("collection used in expression") will not occur anymore

  It was used in previous versions of ArangoDB when the name of a collection was
  used in an expression in an AQL query, e.g.

      RETURN c1 + c2

  Due to internal changes in AQL this is not detected anymore in 3.4, so this 
  particular warning will not be raised.

  Additionally, using collections in arbitrary AQL expressions as above is unsupported
  in a mixed cluster that is running a 3.3 Coordinator and 3.4 DB-Server(s). The
  DB-Server(s) running 3.4 will in this case not be able to use a collection in an
  arbitrary expression, and instead throw an error.

- the undocumented built-in visitor functions for AQL traversals have been removed,
  as they were based on JavaScript implementations:
  
  - `HASATTRIBUTESVISITOR`
  - `PROJECTINGVISITOR`
  - `IDVISITOR`
  - `KEYVISITOR`
  - `COUNTINGVISITOR`        

  Using any of these functions from inside AQL will now produce an error.

- in previous versions, the AQL optimizer used two different ways of converting 
  strings into numbers. The two different ways have been unified into a single
  way that behaves like the `TO_NUMBER` AQL function, which is also the documented
  behavior.

  The change affects arithmetic operations with strings that contain numbers and
  other trailing characters, e.g.

      expression         3.3 result          3.4 result       TO_NUMBER()
      0 + "1a"           0 + 1 = 1           0 + 0 = 0        TO_NUMBER("1a") = 0
      0 + "1 "           0 + 1 = 1           0 + 1 = 1        TO_NUMBER("1 ") = 1
      0 + " 1"           0 + 1 = 1           0 + 1 = 1        TO_NUMBER(" 1") = 1
      0 + "a1"           0 + 0 = 0           0 + 0 = 0        TO_NUMBER("a1") = 0

- the AQL function `DATE_NOW` is now marked as deterministic internally, meaning that
  the optimizer may evaluate the function at query compile time and not at query
  runtime. This will mean that calling the function repeatedly inside the same query will
  now always produce the same result, whereas in previous versions of ArangoDB the
  function may have generated different results.
  
  Each AQL query that is run will still evaluate the result value of the `DATE_NOW` 
  function independently, but only once at the beginning of the query. This is most
  often what is desired anyway, but the change makes `DATE_NOW` useless to measure
  time differences inside a single query.

- the internal AQL function `PASSTHRU` (which simply returns its call argument)
  has been changed from being non-deterministic to being deterministic, provided its
  call argument is also deterministic. This change should not affect end users, as
  `PASSTHRU` is intended to be used for internal testing only. Should end users use
  this AQL function in any query and need a wrapper to make query parts non-deterministic,
  the `NOOPT` AQL function can stand in as a non-deterministic variant of `PASSTHRU`

- the AQL query optimizer will by default now create at most 128 different execution
  plans per AQL query. In previous versions the maximum number of plans was 192.

  Normally the AQL query optimizer will generate a single execution plan per AQL query, 
  but there are some cases in which it creates multiple competing plans. More plans
  can lead to better optimized queries, however, plan creation has its costs. The
  more plans are created and shipped through the optimization pipeline, the more
  time will be spent in the optimizer.
  To make the optimizer better cope with some edge cases, the maximum number of plans
  to create is now strictly enforced and was lowered compared to previous versions of
  ArangoDB.

  Note that this default maximum value can be adjusted globally by setting the startup 
  option `--query.optimizer-max-plans` or on a per-query basis by setting a query's
  `maxNumberOfPlans` option.

- When creating query execution plans for a query, the query optimizer was fetching
  the number of documents of the underlying collections in case multiple query
  execution plans were generated. The optimizer used these counts as part of its 
  internal decisions and execution plan costs calculations. 

  Fetching the number of documents of a collection can have measurable overhead in a
  cluster, so ArangoDB 3.4 now caches the "number of documents" that are referred to
  when creating query execution plans. This may save a few roundtrips in case the
  same collections are frequently accessed using AQL queries. 

  The "number of documents" value was not and is not supposed to be 100% accurate 
  in this stage, as it is used for rough cost estimates only. It is possible however
  that when explaining an execution plan, the "number of documents" estimated for
  a collection is using a cached stale value, and that the estimates change slightly
  over time even if the underlying collection is not modified.

- AQL query results that are served from the AQL query results cache can now return
  the *fullCount* attribute as part of the query statistics. Alongside the *fullCount*
  attribute, other query statistics will be returned. However, these statistics will
  reflect figures generated during the initial query execution, so especially a
  query's *executionTime* figure may be misleading for a cached query result.
  

## Usage of V8

The internal usage of the V8 JavaScript engine for non-user actions has been 
reduced in ArangoDB 3.4. Several APIs have been rewritten to not depend on V8 
and thus do not require using the V8 engine nor a V8 context for execution
anymore.

Compared to ArangoDB 3.3, the following parts of ArangoDB can now be used 
without the V8 engine:

- Agency nodes in a cluster
- DB-Server nodes in a cluster 
- cluster plan application on DB-Server nodes
- all of AQL (with the exception of user-defined functions)
- the graph modification APIs at endpoint `/_api/gharial`
- background statistics gathering

Reduced usage of V8 in ArangoDB may allow end users to lower the configured 
numbers of V8 contexts to start. In terms of configuration options, these
are:

- `--javascript.v8-contexts`: the maximum number of V8 contexts to create
  (high-water mark)
- `--javascript.v8-contexts-minimum`: the minimum number of V8 contexts to 
  create at server start and to keep around permanently (low-water mark) 

The default values for these startup options have not been changed in ArangoDB
3.4, but depending on the actual workload, 3.4 ArangoDB instances may need
less V8 contexts than 3.3.

As mentioned above, Agency and DB-Server nodes in a cluster does not
require V8 for any operation in 3.4, so the V8 engine is turned off entirely on
such nodes, regardless of the number of configured V8 contexts there.

The V8 engine is still enabled on Coordinator servers in a cluster and on single
server instances. Here the numbe of started V8 contexts may actually be reduced
in case a lot of the above features are used.


## Startup option changes

For arangod, the following startup options have changed:

- the number of server threads is now configured by the following startup options:

  - `--server.minimal-threads`: determines the minimum number of request processing
    threads the server will start
  - `--server.maximal-threads`: determines the maximum number of request processing 
    threads the server will start

  The actual number of request processing threads is adjusted dynamically at runtime
  and will float between `--server.minimal-threads` and `--server.maximal-threads`. 

- the default value for the existing startup option `--javascript.gc-interval`
  has been increased from every 1000 to every 2000 requests, and the default value
  for the option `--javascript.gc-frequency` has been increased from 30 to 60 seconds.

  This will make the V8 garbage collection run less often by default than in previous
  versions, reducing CPU load a bit and leaving more V8 contexts available on average.

- the startup option `--cluster.my-local-info` has been removed in favor of persisted 
  server UUIDs.

  The option `--cluster.my-local-info` was deprecated since ArangoDB 3.3.

- the startup option `--database.check-30-revisions` was removed. It was used for
  checking the revision ids of documents for having been created with ArangoDB 3.0,
  which required a dump & restore migration of the data to 3.1.

  As direct upgrades from ArangoDB 3.0 to 3.4 or from 3.1 to 3.4 are not supported,
  this option has been removed in 3.4.

- the startup option `--server.session-timeout` has been obsoleted. Setting this 
  option will not have any effect.

- the option `--replication.automatic-failover` was renamed to `--replication.active-failover`

  Using the old option name will still work in ArangoDB 3.4, but support for the old 
  option name will be removed in future versions of ArangoDB.

- the option `--rocksdb.block-align-data-blocks` has been added

  If set to true, data blocks stored by the RocksDB engine are aligned on lesser of page 
  size and block size, which may waste some memory but may reduce the number of cross-page 
  I/Os operations.

  The default value for this option is *false*.

  As mentioned above, ArangoDB 3.4 changes the default value of the configuration option 
  `--rocksdb.total-write-buffer-size` to about 40% of available physical RAM, and 512MiB
  for setups with less than 4GiB of RAM. In ArangoDB 3.3 this option had a default value
  of `0`, which meant that the memory usage for write buffers was not limited.


## Permissions

The behavior of permissions for databases and collections changed:

The new fallback rule for databases for which no access level is explicitly 
specified is now:

* Choose the higher access level of:
  * A wildcard database grant
  * A database grant on the `_system` database

The new fallback rule for collections for which no access level is explicitly 
specified is now:

* Choose the higher access level of:
  * Any wildcard access grant in the same database, or on `"*"`
  * The access level for the current database
  * The access level for the `_system` database


## SSLv2

Support for SSLv2 has been removed from arangod and all client tools.

Startup will now be aborted when using SSLv2 for a server endpoint, or when connecting 
with one of the client tools via an SSLv2 connection.

SSLv2 has been disabled in the OpenSSL library by default in recent versions
because of security vulnerabilities inherent in this protocol.

As it is not safe at all to use this protocol, the support for it has also
been stopped in ArangoDB. End users that use SSLv2 for connecting to ArangoDB
should change the protocol from SSLv2 to TLSv12 if possible, by adjusting
the value of the `--ssl.protocol` startup option.


## Replication

By default, database-specific and global replication appliers use a slightly
different configuration in 3.4 than in 3.3. In 3.4 the default value for the
configuration option `requireFromPresent` is now `true`, meaning the follower
will abort the replication when it detects gaps in the leader's stream of 
events. Such gaps can happen if the leader has pruned WAL log files with 
events that have not been fetched by a follower yet, which may happen for 
example if the network connectivity between follower and leader is bad.

Previous versions of ArangoDB 3.3 used a default value of `false` for 
`requireFromPresent`, meaning that any such gaps in the replication data 
exchange will not cause the replication to stop. 3.4 now stops replication by
default and writes according errors to the log. Replication can automatically
be restarted in this case by setting the `autoResync` replication configuration
option to `true`.


## Mixedengine clusters

Starting a cluster with Coordinators and DB-Servers using different storage 
engines is not supported. Doing it anyway will now log an error and abort a 
Coordinator's startup.

Previous versions of ArangoDB did not detect the usage of different storage
engines in a cluster, but the runtime behavior of the cluster was undefined.


## Client tools

The client tool _arangoimp_ has been renamed to _arangoimport_ for consistency.
  
Release packages will still install _arangoimp_ as a symlink to _arangoimport_, 
so user scripts invoking _arangoimp_ do not need to be changed to work with
ArangoDB 3.4. However, user scripts invoking _arangoimp_ should eventually be 
changed to use _arangoimport_ instead, as that will be the long-term supported 
way of running imports.

The tools _arangodump_ and _arangorestore_ will now by default work with two
threads when extracting data from a server or loading data back into a server resp.
The number of threads to use can be adjusted for both tools by adjusting the
`--threads` parameter when invoking them. This change is noteworthy because in
previous versions of ArangoDB both tools were single-threaded and only processed
one collection at a time, while starting with ArangoDB 3.4 by default they will 
process two collections at a time, with the intended benefit of completing their
work faster. However, this may create higher load on servers than in previous
versions of ArangoDB. If the load produced by _arangodump_ or _arangorestore_ is
higher than desired, please consider setting their `--threads` parameter to a 
value of `1` when invoking them.

In the ArangoShell, the undocumented JavaScript module `@arangodb/actions` has
been removed. This module contained the methods `printRouting` and `printFlatRouting`,
which were used for debugging purposes only.

In the ArangoShell, the undocumented JavaScript functions `reloadAuth` and `routingCache`
have been removed from the `internal` module.


## Foxx applications

The undocumented JavaScript module `@arangodb/database-version` has been
removed, so it cannot be use from Foxx applications anymore The module only
provided the current version of the database, so any client-side invocations
can easily be replaced by using the `db._version()` instead.

The `ShapedJson` JavaScript object prototype, a remainder from ArangoDB 2.8 
for encapsulating database documents, has been removed in ArangoDB 3.4.


## Miscellaneous changes

For the MMFiles engine, the compactor thread(s) were renamed from "Compactor" 
to "MMFilesCompactor".

This change will be visible only on systems which allow assigning names to
threads.




The following features and APIs are deprecated in ArangoDB 3.4, and will be 
removed in future versions of ArangoDB:

* the JavaScript-based traversal REST API at `/_api/traversal` and the
  underlaying traversal module `@arangodb/graph/traversal`:

  This API has several limitations (including low result set sizes) and has 
  effectively been unmaintained since the introduction of native AQL traversal.

  It is recommended to migrate client applications that use the REST API at
  `/_api/traversal` to use AQL-based traversal queries instead.

* the REST API for simple queries at `/_api/simple`:

  The simple queries provided by the `/_api/simple` endpoint are limited in
  functionality and will internally resort to AQL queries anyway. It is advised
  that client applications also use the equivalent AQL queries instead of 
  using the simple query API, because that is more flexible and allows greater 
  control of how the queries are executed.

* the REST API for querying endpoints at `/_api/endpoint`:

  The API `/_api/endpoint` is deprecated since ArangoDB version 3.1. 
  For cluster mode there is `/_api/cluster/endpoints` to find all current 
  Coordinator endpoints.

* accessing collections via their numeric IDs instead of their names. This mostly
  affects the REST APIs at

  - `/_api/collection/<collection-id>`
  - `/_api/document/<collection-id>`
  - `/_api/simple`

  Note that in ArangoDB 3.4 it is still possible to access collections via
  their numeric ID, but the preferred way to access a collections is by its
  user-defined name.

* the REST API for WAL tailing at `/_api/replication/logger-follow`:

  The `logger-follow` WAL tailing API has several limitations. A better API
  was introduced at endpoint `/_api/wal/tail` in ArangoDB 3.3.

  Client applications using the old tailing API at `/_api/replication/logger-follow`
  should switch to the new API eventually.

* the result attributes `mode` and `writeOpsEnabled` in the REST API for querying
  a server's status at `/_admin/status`:

  `GET /_admin/status` returns the additional attributes `operationMode` and 
  `readOnly` now, which should be used in favor of the old attributes.
  
* creating geo indexes via any APIs with one of the types `geo1` or `geo2`:

  The two previously known geo index types (`geo1`and `geo2`) are deprecated now.
  Instead, when creating geo indexes, the type `geo` should be used.

  The types `geo1` and `geo2` will still work in ArangoDB 3.4, but may be removed
  in future versions.

* the persistent index type is marked for removal in 4.0.0 and is thus deprecated.

  This index type was added when there was only the MMFiles storage engine as
  kind of a stop gap. We recommend to switch to RocksDB engine, which persists
  all index types with no difference between skiplist and persistent indexes.

* the legacy mode for Foxx applications from ArangoDB 2.8 or earlier.

  {%- assign ver = "3.8" | version: "<" %}
  {%- if ver %}
  The legacy mode is described in more detail in the [Foxx manual](foxx-guides-legacy-mode.html).
  To upgrade an existing Foxx application that still uses the legacy mode, please
  follow the steps described in [the manual](foxx-migrating2x.html).
  {%- endif %}

* the AQL geo functions `NEAR`, `WITHIN`, `WITHIN_RECTANGLE` and `IS_IN_POLYGON`:

  The special purpose `NEAR` AQL function can be substituted with the
  following AQL (provided there is a geo index present on the `doc.latitude`
  and `doc.longitude` attributes) since ArangoDB 3.2:

      FOR doc in geoSort
        SORT DISTANCE(doc.latitude, doc.longitude, 0, 0)
        LIMIT 5
        RETURN doc

  `WITHIN` can be substituted with the following AQL since ArangoDB 3.2:

      FOR doc in geoFilter
        FILTER DISTANCE(doc.latitude, doc.longitude, 0, 0) < 2000
        RETURN doc

  Compared to using the special purpose AQL functions this approach has the
  advantage that it is more composable, and will also honor any `LIMIT` values
  used in the AQL query.

  In ArangoDB 3.4, `NEAR`, `WITHIN`, `WITHIN_RECTANGLE` and `IS_IN_POLYGON` 
  will still work and automatically be rewritten by the AQL query optimizer 
  to the above forms. However, AQL queries using the deprecated AQL functions
  should eventually be adjusted.

* using the `arangoimp` binary instead of `arangoimport` 

  `arangoimp` has been renamed to `arangoimport` for consistency in ArangoDB
  3.4, and `arangoimp` is just a symbolic link to `arangoimport` now.
  `arangoimp` is there for compatibility only, but client scripts should 
  eventually be migrated to use `arangoimport` instead.

* the `foxx-manager` executable is deprecated and will be removed in ArangoDB 4.
  
  Please use [Foxx CLI](../../programs-tools/foxx-cli/) instead.
