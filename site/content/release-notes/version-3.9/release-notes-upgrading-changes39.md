---
fileID: release-notes-upgrading-changes39
title: Incompatible changes in ArangoDB 3.9
weight: 11620
description: 
layout: default
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
  execution plan. The number of execution nodes is limited to 4000.
  This number includes all execution nodes of the initial execution plan, 
  even if some of them could be optimized away later by the 
  query optimizer during plan optimization.

AQL queries that violate these limits will fail to run, and instead abort 
with error `1524` ("too much nesting or too many objects") during setup.

Also see [Known limitations for AQL queries](../../aql/aql-fundamentals/fundamentals-limitations).

## Startup options

### Installing Foxx apps from remote URLS

The `--foxx.allow-install-from-remote` option controls whether installing Foxx apps
from remote URL sources other than Github is allowed. If set to `false`,
installing Foxx apps is blocked for any remote sources other than Github. Installing
Foxx apps from Github or from uploaded zip files is still possible with this
option.
Setting it to `true` will allow installing Foxx apps from any remote
URL sources.

In ArangoDB 3.9, the default value for this option is `false`, meaning that
installing Foxx apps from remote sources other than Github is now disallowed. This
also inactivates the **Remote** tab in the **Services** section of the web interface.
Compared to the previous versions of ArangoDB, this is a downwards-incompatible default
value change, which was made for security reasons. To enable installing
apps from remote sources again, set this option to `true`.

### RocksDB options

The default value for the startup `--rocksdb.max-subcompactions` option  was 
changed from `1` to `2`.
This allows compactions jobs to be broken up into disjoint ranges which
can be processed in parallel by multiple threads.

### Rebalance shards

The new `--cluster.max-number-of-move-shards` option limits the maximum number of
move shards operations that can be made when the **Rebalance Shards** button is
clicked in the Web UI. For backwards compatibility purposes, the default value
is `10`. If the value is `0`, the tab containing the button is not clickable.

### Timeout for JWT sessions

The lifetime for tokens that can be obtained from the `POST /_open/auth`
endpoint is now configurable via the `--server.session-timeout` startup option.

The value for the option can be specified in seconds. The default timeout is
**one hour**. Previous versions of ArangoDB had a longer, hard-coded timeout.

The web interface uses JWT for authentication. However,
the session will be renewed automatically as long as you regularly interact with
the Web UI in your browser. You will not get logged out while actively using it.

### Disallowed usage of collection names in AQL expressions

The startup option `--query.allow-collections-in-expressions` added in 3.8.0
controls whether collection names are allowed in arbitrary places in AQL
expressions. The default was *true*, but is now changed to *false* in 3.9.0 to
make queries like `FOR doc IN collection RETURN collection` fail, where it was
probably intended to `RETURN doc` instead. Also see
{% assign ver = "3.10" | version: ">=" %}{% if ver %}
[ArangoDB Server Query Options](../../programs-tools/arangodb-server/programs-arangod-options#--queryallow-collections-in-expressions)
{%- else -%}
[ArangoDB Server Query Options](programs-arangod-query.html#allowing-the-usage-of-collection-names-in-aql-expressions)
{% endif %}

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

## Client tools

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

### arangoimport

ArangoDB release packages install an executable named _arangoimp_ as an alias 
for the _arangoimport_ executable. This is done to provide compatibility with 
older releases, in which _arangoimport_ did not yet exist and was named 
_arangoimp_. 
The renaming was actually carried out in the codebase in December 2017. Using 
the _arangoimp_ executable is now deprecated, and it is always favorable to use 
_arangoimport_ instead. 
While the _arangoimport_ executable will remain, the _arangoimp_ alias will be 
removed in a future version of ArangoDB, and its use is now highly discouraged.

### arangovpack

The former `--json` and `--pretty` options of the *arangovpack* utility
were removed and replaced with separate options for specifying
the input and output types:

- `--input-type` (`json`, `json-hex`, `vpack`, `vpack-hex`)
- `--output-type` (`json`, `json-pretty`, `vpack`, `vpack-hex`)

The former `--print-non-json` option was replaced with the new
`--fail-on-non-json` option, which makes arangovpack fail when trying to emit non-JSON
types to JSON output.

