---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.8
---
Incompatible changes in ArangoDB 3.8
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.8, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.8:

Foxx
----

The default value of the startup option `--foxx.force-update-on-startup` changes
from `true` to `false` in ArangoDB 3.8.
This option controls whether the startup procedure should synchronize all Foxx
apps in all databases before making them available, or whether startup should
proceed without ensuring all Foxx apps are in sync. In the latter case, the 
synchronization will happen eventually.

In ArangoDB 3.6 and 3.7, the option's default value is `true`, meaning all Foxx apps 
in all databases will be synchronized on server startup. This can delay the startup
procedure for installations with many databases, and is unnecessary in case no
Foxx apps are used.

In ArangoDB 3.8 the default value for the option is `false`, meaning a server will
complete the boot sequence faster, and the Foxx services will be synchronized in 
a background operation. Until that operation has completed, any requests to a 
Foxx app may be responded to with an HTTP 500 error and message 

    waiting for initialization of Foxx services in this database 

This can cause an unavailability window for Foxx apps for the initial requests to
Foxx apps.

This option only has an effect for cluster setups. On single servers and in
active failover mode, all Foxx apps will always be initialized completely when
the server starts up, and there will be no unavailability window.

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

### Deprecated options

The following server startup options have been obsoleted in ArangoDB 3.8:

- `--database.throw-collection-not-loaded-error`
- `--ttl.only-loaded-collection`

These options were meaningful for the MMFiles storage engine only, but for
the RocksDB storage engine they did not make any difference. Using these startup
options is still possible, but will have no effect other than generating a
warning at server startup.

The following arangosearch-related startup options are deprecated in ArangoDB 3.8:

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

- The default value for the startup option `--database.old-system-collections` is
  changed from `true` to `false` in ArangoDB 3.8.

  This means that by default the system collections `_modules` and `_fishbowl` will
  not be created anymore when a new database is created. These collections are useful 
  only in very few cases, so it is normally not worth to create them in all databases.

  Already existing `_modules` and `_fishbowl` system collections will not be modified 
  by this default value change, even though they will likely be empty and unused.

  The long-term side effects of this change will be:
  - there will be no iteration over all databases at server startup just to check
    the contents of all `_modules` collections.
  - less collections/shards will be around for deployments that create a large
    number of databases (and thus the default system collections).

  Any functionality related to the `_modules` system collection is deprecated in
  ArangoDB 3.8 and will be removed in ArangoDB 3.9.

- The default value for `--foxx.force-update-on-startup` changed from `true` in
  previous version to `false` in ArangoDB 3.8, also see [Foxx](#foxx) above.

- The value of the startup option `--rocksdb.block-cache-size` is limited to 1 GB 
  for agent instances to reduce agency RAM usage, unless the option is explicitly
  configured otherwise. 

  In addition, the value of `--rocksdb.total-write-buffer-size` is limited to 512 MB 
  on agent instances for the same reason, unless otherwise configuration.

  No limitations apply for DB server instances or single servers.

- The default value for the number of network I/O threads `--network.io-threads`
  was changed to `2` in ArangoDB 3.8, up from a value of `1` in previous version.

- The default value for `--server.descriptors-minimum` changed from `0` in previous
  versions to `8192` in ArangoDB 3.8.
  This change means that on Linux and macOS, the system limits need to allow the
  arangod process to use at least 8192 file descriptors. 
  If less file descriptors are available to the arangod process, then the startup 
  process of the arangod server is automatically aborted.

  Even the chosen minimum value of 8192 will often not be high enough to store 
  considerable amounts of data. However, no higher value was chosen in order to not 
  make too many existing installations fail after upgrading.

  The required number of file descriptors can be configured using the startup option 
  `--server.descriptors-minimum`. It now defaults to 8192, but it can be increased 
  to ensure that arangod can make use of a sufficiently high number of files.

  Setting `--server.descriptors-minimum` to a value of `0` will make the startup 
  require only an absolute minimum limit of 1024 file descriptors, effectively 
  disabling the change. Such low values should only be used to bypass the file 
  descriptors check in case of an emergency, but this is not recommended for production.

- The default value of the startup option `--server.unavailability-queue-fill-grade`
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

- The default value for arangoimport's `--batch-size` option was raised from
  1 MB to 8 MB. This means that arangoimport can send larger batches containing
  more documents.

  arangoimport also has a rate limiting feature, which was turned on by default
  previously. This rate limiting feature limited the import rate to 1 MB per
  second, which is probably too low for most use cases. In ArangoDB 3.8, the
  rate limiting for arangoimport is now turned off by default, but can be
  enabled on demand using the new `--auto-rate-limit` option. When enabled, it
  will start sending batches with up to `--batch-size` bytes, and then adapt
  the loading rate dynamically.

### AQL query memory limit

ArangoDB 3.8 introduces a default memory limit for AQL queries to prevent
rogue queries from consuming the entire memory available to an arangod
instance.

The memory limit is introduced via changing the default value of the startup
option `--query.memory-limit` from previously `0` (meaning: no limit) to a
dynamically calculated value. The per-query memory limit defaults are now:

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

As previously, a memory limit value of `0` means no limitation.
The limit values are per AQL query, so they may still be too high in case
queries run in parallel. The defaults are intentionally high in order to not
stop too many valid queries from working that use _a lot_ of memory.

### Audit Logging (Enterprise Edition)

The Enterprise Edition's audit log feature now honors the configured
date/time output format. Previously, the audit logging always logged date/time
values in the server's local time in the format `YYYY-MM-DDTHH:MM:SS`.

From 3.8 onwards, the audit logging will honor the date/time format specified
via the `--log.time-format` startup option, which defaults to `utc-datestring`.
That means the audit logging will log all dates/times in UTC time by default.

To restore the pre-3.8 format, please set the option `--log.time-format` to
`local-datestring`, which will make the audit logger (and all other server log
messages) use the server's local time.

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

- The endpoint `/_api/replication/clusterInventory` returns, among other things,
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
