---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.9
---
Incompatible changes in ArangoDB 3.9
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.9, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.9:

Architecture requirements
-------------------------

The minimum architecture requirements have been raised from the Westmere
architecture to the Sandy Bridge architecture. 256 bit AVX instructions are
now expected to be present on all targets that run ArangoDB 3.9 executables.
If a target does not support AVX instructions, it may fail with SIGILL at
runtime.

AQL
---

The following complexity limits have been added in 3.9 for AQL queries, 
Additional complexity limits have been added for AQL queries, in order to 
prevent programmatically generated large queries from causing trouble 
(too deep recursion, enormous memory usage, long query optimization 
and distribution passes etc.).

The following limits have been added:

- a recursion limit for AQL query expressions. An expression can now be
  up to 500 levels deep. An example expression is `1 + 2 + 3 + 4`, which
  is 3 levels deep `1 + (2 + (3 + 4))`.
  The recursion of expressions is limited to 500 levels.
- a limit for the number of execution nodes in the initial query 
  execution plan. The number of execution nodes is limited to 4,000.

Also see [Known limitations for AQL queries](aql/fundamentals-limitations.html).

Startup options
---------------

### Timeout for web interface sessions

The timeout value for web interface sessions is now configurable via the
startup option `--server.session-timeout`. The value for the option can
be specified in seconds.

The default timeout value for web interface sessions is **one hour** in
ArangoDB 3.9. Previous versions of ArangoDB had a longer, hard-coded timeout.

The session will be renewed automatically as long as you regularly interact with
the Web UI in your browser. You will not get logged out while actively using it.

### Disallowed usage of collection names in AQL expressions

The startup option `--query.allow-collections-in-expressions` added in 3.8.0
controls whether collection names are allowed in arbitrary places in AQL
expressions. The default was *true*, but is now changed to *false* in 3.9.0 to
make queries like `FOR doc IN collection RETURN collection` fail, where it was
probably intended to `RETURN doc` instead. Also see
[ArangoDB Server Query Options](programs-arangod-query.html#allowing-the-usage-of-collection-names-in-aql-expressions)

Such unintentional usage of collection names in queries now makes the query
fail with error 1568 ("collection used as expression operand") by default.
The option can be set to *true* to restore the 3.8 behavior. However, the
option is deprecated from 3.9.0 on and will be removed in future versions.
From then on, unintended usage of collection names will always be disallowed.

If you use queries like `RETURN collection` then you should replace them with
`FOR doc IN collection RETURN doc` to ensure future compatibility.

### Cluster-internal network protocol

The cluster-internal network protocol is hard-coded to HTTP/1 in ArangoDB 3.9.
Any other protocol selected via the startup option `--network.protocol` will 
automatically be switched to HTTP/1. The startup option `--network.protocol` 
is now deprecated and hidden by default. It will be removed in a future version.

### "Old" system collections

The option `--database.old-system-collections` was introduced in 3.6 and 3.7
to control if the obsolete system collections `_modules` and `_routing` should
be created with every new database or not.

The option was introduced with a default value of `true` in 3.6 and 3.7 for
downwards-compatibility reasons. With the introduction of the option, it was
also announced that the default value would change to `false` in ArangoDB 3.8.
This has happened, meaning that 3.8 installations by default will not create
these system collections anymore.

In ArangoDB 3.9 the option `--database.old-system-collections` is now
completely obsolete, and ArangoDB will never create these system collections
for any new databases. The option can still be specified at startup, but it
meaningless now.

### Replaced arangovpack options

The former options `--json` and `--pretty` of the *arangovpack* utility
have been removed and have been replaced with separate options for specifying
the input and output types:

- `--input-type` (`json`, `json-hex`, `vpack`, `vpack-hex`)
- `--output-type` (`json`, `json-pretty`, `vpack`, `vpack-hex`)

The former option `--print-non-json` has been replaced with the new option
`--fail-on-non-json` which makes arangovpack fail when trying to emit non-JSON
types to JSON output.

### Export API removed

The REST API endpoint `/_api/export` has been removed in ArangoDB 3.9.
This endpoint was previously only present in single server, but never
supported in cluster deployments.

The purpose of the endpoint was to provide the full data of a collection
without holding collection locks for a long time, which was useful for
the MMFile storage engine with its collection-level locks.

The MMFiles engine is gone since ArangoDB 3.7, and the only remaining
storage engine since then is RocksDB. For the RocksDB engine, the
`/_api/export` endpoint internally used a streaming AQL query such as

```js
FOR doc IN @@collection RETURN doc
```

anyway. To remove API redundancy, the API endpoint has been deprecated
in ArangoDB 3.8 and is now removed. If the functionality is still required
by client applications, running a streaming AQL query can be used as a
substitution.

#### Redirects removed

Since ArangoDB 3.7, some cluster APIs were made available under different
paths. The old paths were left in place and simply redirected to the new
address. These redirects have now been removed in ArangoDB 3.9.

The following list shows the old, now dysfunctional paths and their
replacements:

- `/_admin/clusterNodeVersion`: replaced by `/_admin/cluster/nodeVersion`
- `/_admin/clusterNodeEngine`: replaced by `/_admin/cluster/nodeEngine`
- `/_admin/clusterNodeStats`: replaced by `/_admin/cluster/nodeStatistics`
- `/_admin/clusterStatistics`: replaced by `/_admin/cluster/statistics`

Using the replacements will work from ArangoDB 3.7 onwards already, so
any client applications that still call the old addresses can be adjusted
to call the new addresses from 3.7 onwards.

Client tools
------------

### General changes

The default value for the `--threads` startup parameter was changed from
2 to the maximum of 2 and the number of available CPU cores for the
following client tools:

- arangodump
- arangoimport
- arangorestore

This change can help to improve performance of imports, dumps or restore
processes on machines with multiple cores in case the `--threads` parameter
was not previously used. As a trade-off, the change may lead to an increased 
load on servers, so any scripted imports, dumps or restore processes that 
want to keep the server load under control should set the number of client
threads explicitly when invoking any of the above client tools.

### arangodump

The default value of arangodump's `--envelope` option changes from `true`
in 3.8 to `false` in 3.9. This change turns on the non-envelope dump
format by default, which will lead to smaller and slightly faster dumps.
In addition, the non-enveloped format allows higher parallelism when
restoring dumps with arangorestore.

The non-enveloped dump format is different to the enveloped dump format
used by default in previous versions of ArangoDB.

In the enveloped format, dumps were JSONL files with a JSON object in each
line, and the actual database documents were placed inside a `data` attribute.
There was also a `type` attribute for each line, which designated
the type of object in that line (typically this will have been type `"2300"`,
meaning "document"). The old, enveloped format looks like this:

```json
{"type":2300,"key":"test","data":{"_key":"test","_rev":..., ...}}
```

The non-enveloped format which is now enabled by default only contains the
actual documents, e.g.

```json
{"_key":"test","_rev":..., ...}
```

The change of the default dump format may have an effect on third-party
backup tools or script. arangorestore will work fine with both formats.
To switch between the formats, arangodump provides the `--envelope` option.

### arangorestore

With the default dump format changing from the enveloped variant to the
non-enveloped variant, arangorestore will now by default be able to employ
higher parallelism when restoring data of large collections.

When restoring a collection from a non-enveloped dump, arangorestore can
send multiple batches of data for the collection in parallel if it can read
the dump files faster than the server can respond to arangorestore's requests.
This increased parallelism normally helps to speed up the restore process,
but it can also lead to arangorestore saturating the server with its restore
requests.
In this case it is advised to decrease the value of arangorestore's `--threads`
option accordingly. The value of `--threads` will the determine the maximum
parallelism used by arangorestore.
