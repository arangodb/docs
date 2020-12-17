---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.8
---
Incompatible changes in ArangoDB 3.8
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.8, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.8:

Collection attributes
---------------------

The collection properties `indexBuckets`, `journalSize`, `doCompact` and
`isVolatile` only had a meaning for the MMFiles storage engine, which is not
available anymore since ArangoDB 3.7.

ArangoDB 3.8 now removes any special handling for these obsolete collection
properties, meaning these attributes will not be processed by the server and
not be returned by any server APIs. Using these attributes in any API call
will be ignored, and will not trigger any errors.

Client applications and tests that rely on the behavior that setting any of
these obsolete properties produces an error on the server side may need to
be adjusted now.

Startup options
---------------

### Renamed options

The following startup options have been renamed in ArangoDB 3.8:

| Old name | New name |
|:---------|:---------|
| `--javascript.startup-options-whitelist` | `--javascript.startup-options-allowlist`
| `--javascript.startup-options-blacklist` | `--javascript.startup-options-denylist`
| `--javascript.environment-variables-whitelist` | `--javascript.environment-variables-allowlist`
| `--javascript.environment-variables-blacklist` | `--javascript.environment-variables-denylist`
| `--javascript.endpoints-whitelist` | `--javascript.endpoints-allowlist`
| `--javascript.endpoints-blacklist` | `--javascript.endpoints-denylist`
| `--javascript.files-whitelist` | `--javascript.files-allowlist`

Using the old option names will still work in ArangoDB 3.8, but is discouraged.

## Deprecated options

The following server startup options have been obsoleted in ArangoDB 3.8:

- `--database.throw-collection-not-loaded-error`
- `--ttl.only-loaded-collection`

These options were meaningful for the MMFiles storage engine only, but for
the RocksDB storage engine they did not make any difference. Using these startup
options is still possible, but will have no effect other than generating a
warning at server startup.

- `--arangosearch.threads`
- `--arangosearch.threads-limit`

There are two new options for each of the deprecated options, now allowing to
set the minimum and maximum number of threads for committing and consolidation
separately. If either `--arangosearch.commit-threads` or
`--arangosearch.consolidation-threads` is set, then both deprecated options are
ignored. If only the legacy options are set, then they are used to calculate
the thread count. See
[ArangoDB Server ArangoSearch Options](programs-arangod-arangosearch.html).

### Changed default values

The default value for the number of network I/O threads `--network.io-threads`
was changed to `2` in ArangoDB 3.8, up from a value of `1` in previous version.

The default value of the startup option `--server.unavailability-queue-fill-grade`
has been changed from value `1` in previous versions to a value of `0.75` in ArangoDB
3.8.

This change has a consequence for the `/_admin/server/availability` REST API only,
which is often called by load-balancers and other availability probing systems.

The `/_admin/server/availability` API will return HTTP 200 if the fill grade of the
scheduler's queue is below the configured value, or HTTP 503 if the fill grade is
above it. This can be used to flag a server as unavailable in case it is already
highly loaded.

The default value change for this option will lead to server's reporting their
unavailability earlier than previous versions of ArangoDB. With only the default
values used, ArangoDB versions prior to 3.8 reported unavailability only if the
queue was completely full, which means 4096 pending requests in the queue.
ArangoDB 3.8 will report as unavailable if the queue is 75% full, i.e when 3072
or more jobs are queued in the scheduler.

Although this is a behavior change, 75% is still a high watermark and should not
cause unavailability false-positives.
However, to restore the pre-3.8 behavior, it is possible to set the value of
this option to `1`. The value can even be set to `0` to disable using the
scheduler's queue fill grade as an (un)availability indicator.

HTTP RESTful API
----------------

### Www-Authenticate response header

ArangoDB 3.8 adds back the `Www-Authenticate` response header for HTTP server
responses with a status code of 401. Returning the `Www-Authenticate` header for
401 responses is required by the HTTP/1.1 specification and was also advertised
functionality in the ArangoDB documentation, but wasn't happening in practice.

Now the functionality of returning `Www-Authenticate` response headers for HTTP
401 responses is restored, along with the already advertised functionality of
suppressing this header in case the client sends an `X-Omit-Www-Authenticate`
header with the request.

This change should not have any impact for client applications that use ArangoDB
as a database only. It may have an effect for Foxx applications that use HTTP
401 status code responses and that will now see this extra header getting returned.

### Endpoint return value changes

The endpoint `/_api/replication/clusterInventory` returns, among other things,
an array of the existing collections. Each collection has a `planVersion`
attribute, which in ArangoDB 3.8 is now hard-coded to the value of 1.

Before 3.7, the most recent Plan version from the agency was returned inside
`planVersion` for each collection. In 3.7, the attribute contained the Plan
version that was in use when the in-memory LogicalCollection object was last
constructed. The object was always reconstructed in case the underlying Plan
data for the collection changed, or when a collection contained links to
ArangoSearch Views. This made the attribute relatively useless for any
real-world use cases, and so we are now hard-coding it to simplify the internal
code. Using the attribute in client applications is also deprecated, because
it will be removed from the API's return value in future versions of ArangoDB.

AQL
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

Pregel
------

The HTTP and JavaScript APIs for controling Pregel jobs now also accept 
stringified execution number values, in addition to numeric ones.

This allows passing larger execution numbers as strings, so that any data 
loss due to numeric data type conversion (uint32 => double) can be avoided. 
This change is downwards-compatible.

However, the HTTP and JavaScript APIs for starting Pregel runs now also 
return a stringified execution number, e.g. "12345" instead of 12345. 
This is not downwards-compatible, so all client applications that depend
on the return value being a numeric value need to be adjusted to handle
a string return value and convert that string into a number.

Document operations
-------------------

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
