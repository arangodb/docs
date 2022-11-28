---
fileID: release-notes-upgrading-changes38
title: Incompatible changes in ArangoDB 3.8
weight: 11825
description: 
layout: default
---
### Graph traversal option `bfs` deprecated

The graph traversal option `bfs` is now deprecated and superseded by the new
option `order`.

The preferred way to start a breadth-first search from now on is with
`order: "bfs"`. The default remains depth-first search if no `order` is
specified, but can also be explicitly requested with `order: "dfs"`.

### New `WINDOW` keyword

A new keyword `WINDOW` was added to AQL in ArangoDB 3.8. Any existing AQL
queries that use `WINDOW` (in any capitalization) as a variable name,
collection or View name or refer to an attribute named `WINDOW` will likely
run into parse errors when upgrading to ArangoDB 3.8.

When a query is affect, the fix is to put the name `WINDOW` into backticks
inside the query, in the same way as when using other reserved keywords as
identifiers/names in AQL queries.

For example, the query:

```js
FOR status IN Window
  RETURN status.open
```

… will need to be adjusted to:

```js
FOR status IN `Window`
  RETURN status.open
```

## Subqueries

The AQL optimizer rule `splice-subqueries` was introduced in ArangoDB 3.6 to
optimize most subqueries, and it was extended in 3.7 to work with all types
of subqueries. It was always turned on by default, but it still could be
deactivated manually using a startup option (`--query.optimizer-rules`) or
for individual queries via the `optimizer.rules` query option.

In ArangoDB 3.8, the optimizer rule `splice-subqueries` is now required for
subquery execution, and cannot be turned off. Trying to disable it via the
mentioned startup option or query option has no effect, as the optimizer rule
will always run for queries containing subqueries.

### UPDATE queries with `keepNull: false`

AQL update queries using the `keepNull` option set to false had an inconsistent
behavior in previous versions of ArangoDB.

For example, given a collection `test` with an empty document with just key
`testDoc`, the following query would return different results when running for
the first time and the second time:

```js
UPDATE 'testDoc'
WITH { test: { sub1: true, sub2: null } } IN test
OPTIONS { keepNull: false, mergeObjects: true }
```

On its first run, the query would return:

```json
{
  "_key": "testDoc",
  "test": {
    "sub1": true,
    "sub2": null
  }
}
```

(with the `null` attribute value not being removed). For all subsequent runs,
the same query would return:

```json
{
  "_key": "testDoc",
  "test": {
    "sub1": true,
  }
}
```

(with the `null` value removed as requested).

This inconsistency was due to how the `keepNull` attribute was handled if
the attribute already existed in the to-be-updated document or not. The
behavior is now consistent, so `null` values are now properly removed from
sub-attributes even if in the to-be-updated document the target attribute
did not yet exist. This makes such updates idempotent again.

This a behavior change compared previous versions, but it will only have
effect when `keepNull` is set to `false` (the default value is `true`),
and only when just-inserted object sub-attributes contained `null` values.

## Pregel

The HTTP and JavaScript APIs for controlling Pregel jobs now also accept
stringified execution number values, in addition to numeric ones.

This allows passing larger execution numbers as strings, so that any data
loss due to numeric data type conversion (uint32 => double) can be avoided.
This change is downwards-compatible.

However, the HTTP and JavaScript APIs for starting Pregel runs now also
return a stringified execution number, e.g. "12345" instead of 12345.
This is not downwards-compatible, so all client applications that depend
on the return value being a numeric value need to be adjusted to handle
a string return value and convert that string into a number.

## Document operations

### Update operations with `keepNull: false`

Non-AQL document update operations using the `keepNull` option set to false had
an inconsistent behavior in previous versions of ArangoDB.

For example, given a collection `test` with an empty document with just key `testDoc`,
the following operation would produce different documents when running for the first
time and the second time:

```js
db.test.update("testDoc", { test: { sub1: true, sub2: null } }, { keepNull: false });
```

Also see [AQL UPDATE queries with `keepNull: false`](#update-queries-with-keepnull-false)

## Client tools

### arangoimport

The default value for arangoimport's `--batch-size` option was raised from
1 MB to 8 MB. This means that arangoimport can send larger batches containing
more documents.

_arangoimport_ also has a rate limiting feature, which was turned on by default
previously. This rate limiting feature limited the import rate to 1 MB per
second, which is probably too low for most use cases. In ArangoDB 3.8, the
rate limiting for arangoimport is now turned off by default, but can be
enabled on demand using the new `--auto-rate-limit` option. When enabled, it
will start sending batches with up to `--batch-size` bytes, and then adapt
the loading rate dynamically.

### arangodump

arangodump can now dump multiple shards of cluster collections in parallel.
While this normally helps with dump performance, it may lead to more arangodump
issuing more concurrent requests to a cluster than it did before.

Previously, arangodump's `--threads` option controlled how many collections were
dumped concurrently, at most. As arangodump can now dump the shards of
collections in parallel, `--threads` now controls the maximum amount of shards
that are dumped concurrently.

If arangodump now causes too much load on a cluster with a high degree of
parallelism, it is possible to reduce it by decreasing arangodump's `--threads` 
value. The value of `--threads` will the determine the maximum parallelism 
used by arangodump.
