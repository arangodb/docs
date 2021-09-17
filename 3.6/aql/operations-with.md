---
layout: default
description: An AQL query can optionally start with a WITH statement and the list of collections used by the query
title: AQL WITH Operation
---
WITH
====

An AQL query can start with a `WITH` keyword followed by a list of collections
that the query implicitly reads from. All collections specified in the `WITH`
statement will be read-locked at query start, in addition to other collections
that are explicitly used in the query and automatically detected by the AQL
query parser.

Syntax
------

<pre><code>WITH <em>collection1</em> [, <em>collection2</em> [, ... <em>collectionN</em> ] ]</code></pre>

RocksDB
-------

With RocksDB as storage engine, the `WITH` operation is only required if you
use a cluster deployment and only for AQL queries which dynamically access
collections for reading.

MMFiles
-------

The MMFiles storage engine uses collection-level locking. Collections need to
be locked separately for both, reading and writing.

With MMFiles as storage engine, the `WITH` operation is optional for single
server instances, but it helps to avoid deadlocks caused by lazy locking of
collections. There is a deadlock detection that will abort stuck queries with
the error `AQL: deadlock detected`.

The `WITH` operation is required if you use a cluster deployment, but only for
AQL queries which dynamically access collections for reading.

### Deadlocks

If you have two transactions (here: AQL queries), T<sub>a</sub> and
T<sub>b</sub>, and both start at approximately the same time, then the
following may happen:

- T<sub>a</sub> successfully locks collection A in write mode
- T<sub>b</sub> successfully locks collection B in write mode
- T<sub>a</sub> lazily accesses and tries to lock collection B in read mode,
  but needs to wait
- T<sub>b</sub> lazily accesses and tries to lock collection A in read mode,
  but needs to wait

Neither of the transactions can make progress. It is a deadlock.

To avoid deadlocks, all collections that will be implicitly used in a query or
transaction in read mode need to be declared upfront, so that no lazy locking
of collections will be necessary.

Usage
-----

Specifying further collections in *WITH* can be useful for queries that 
dynamically access collections (e.g. via traversals or via dynamic 
document access functions such as `DOCUMENT()`). Such collections may be 
invisible to the AQL query parser at query compile time, and thus will not
be read-locked automatically at query start. In this case, the AQL execution 
engine will lazily lock these collections whenever they are used, which can 
lead to deadlock with other queries. In case such deadlock is detected, the 
query will automatically be aborted and changes will be rolled back. In this
case the client application can try sending the query again.
However, if client applications specify the list of used collections for all
their queries using *WITH*, then no deadlocks will happen and no queries will
be aborted due to deadlock situations.

A `WITH` declaration is required for traversals in a clustered environment in
order to avoid deadlocks.

Note that for queries that access only a single collection or that have all
collection names specified somewhere else in the query string, there is no
need to use *WITH*. *WITH* is only useful when the AQL query parser cannot
automatically figure out which collections are going to be used by the query.
*WITH* is only useful for queries that dynamically access collections, e.g.
via traversals, shortest path operations or the *DOCUMENT()* function.

```js
WITH managers
FOR v, e, p IN OUTBOUND 'users/1' usersHaveManagers
  RETURN { v, e, p }
```

Note that constant *WITH* is also a keyword that is used in other contexts,
for example in `UPDATE` statements. If *WITH* is used to specify the extra
list of collections, then it must be placed at the very start of the query
string.
