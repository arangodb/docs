---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.8
---
Incompatible changes in ArangoDB 3.8
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.8, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.8:

Startup options
---------------

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

The following server startup options have been obsoleted in ArangoDB 3.8:

- `--database.throw-collection-not-loaded-error`
- `--ttl.only-loaded-collection`

These options were meaningful for the MMFiles storage engine only, but for 
the RocksDB storage engine they did not make any difference. Using these startup
options is still possible, but will have no effect other than generating a 
warning at server startup.


HTTP RESTful API
----------------

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
code. Using the attribute in client applications is also deprecated.

AQL
---

### Graph traversal option `bfs` deprecated

The graph traversal option `bfs` is now deprecated and superseded by the new
option `order`.

The preferred way to start a breadth-first search from now on is with
`order: "bfs"`. The default remains depth-first search if no `order` is
specified, but can also be explicitly requested with `order: "dfs"`.

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
