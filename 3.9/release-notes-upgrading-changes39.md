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

Startup options
---------------

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
