---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.11
---
# Incompatible changes in ArangoDB 3.11

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.11, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.11:

## Extended naming constraints for collections, Views, and indexes

In ArangoDB 3.9, the `--database.extended-names-databases` startup option was
added to optionally allow database names to contain most UTF-8 characters.
The startup option has been renamed to `--database.extended-names` in 3.11 and
now controls whether you want to use the extended naming constraints for
database, collection, View, and index names.

The old `--database.extended-names-databases` startup option should no longer
be used, but if you do, it behaves the same as the new
`--database.extended-names` option.

The feature is disabled by default to ensure compatibility with existing client
drivers and applications that only support ASCII names according to the
traditional naming constraints used in previous ArangoDB versions.

If the feature is enabled, then any endpoints that contain database, collection,
View, or index names in the URL may contain special characters that were
previously not allowed (percent-encoded). They are also to be expected in
payloads that contain database, collection, View, or index names, as well as
document identifiers (because they are comprised of the collection name and the
document key). If client applications assemble URLs with extended names
programmatically, they need to ensure that extended names are properly
URL-encoded.

When using extended names, any Unicode characters in names need to be 
[NFC-normalized](http://unicode.org/reports/tr15/#Norm_Forms){:target="_blank"}.
If you try to create a database, collection, View, or index with a non-NFC-normalized
name, the server rejects it.

The ArangoDB web interface as well as the _arangobench_, _arangodump_,
_arangoexport_, _arangoimport_, _arangorestore_, and _arangosh_ client tools
ship with support for the extended naming constraints, but they require you
to provide NFC-normalized names.

Please be aware that dumps containing extended names cannot be restored
into older versions that only support the traditional naming constraints. In a
cluster setup, it is required to use the same naming constraints for all
Coordinators and DB-Servers of the cluster. Otherwise, the startup is
refused. In DC2DC setups, it is also required to use the same naming
constraints for both datacenters to avoid incompatibilities.

Also see:
- [Collection names](data-modeling-collections.html#collection-names)
- [View names](data-modeling-views.html#view-names)
- Index names have the same character restrictions as collection names

## AQL user-defined functions (UDF)

AQL user-defined functions (UDFs) cannot be used inside traversal PRUNE conditions
nor inside FILTER conditions that can be moved into the traversal execution on DB-Servers. 
This limitation also applies to single servers to keep the differences to cluster 
deployments minimal.

## Restriction of indexable fields

It is now forbidden to create indexes that cover fields whose attribute names
start or end with `:` , for example, `fields: ["value:"]`. This notation is
reserved for internal use.

Existing indexes are not affected but you cannot create new indexes with a
preceding or trailing colon.

## Write-write conflict improvements

Writes to the same document in quick succession can result in write-write
conflicts, requiring you to retry the operations. In v3.11, single document
operations via the [HTTP Interface for Documents](http/document.html) try to
avoid conflicts by locking the key of the document before performing the
modification. This serializes the write operations on the same document.
The behavior of AQL queries, Stream Transactions, and multi-document operations
remains unchanged.

It is still possible for write-write conflicts to occur, and in these cases the
reported error is now slightly different.

The lock acquisition on the key of the document that is supposed to be
inserted/modified has a hard-coded timeout of 1 second. If the lock cannot be
acquire, the error message is as follows:

```
Timeout waiting to lock key - in index primary of type primary over '_key'; conflicting key: <key>
```

The `<key>` corresponds to the document key of the write attempt. In addition,
the error object contains `_key`, `_id`, and `_rev` attributes. The `_key` and
`_id` correspond to the document of the write attempt, and `_rev` corresponds
to the current revision of the document as stored in the database (if available,
otherwise empty).

If the lock cannot be acquired on a unique index entry, the error message is as
follows:

```
Timeout waiting to lock key - in index <indexName> of type persistent over '<fields>'; document key: <key>; indexed values: [<values>]
```

The `<indexName>` is the name of the index in which the write attempt tried to
lock the entry, `<fields>` is the list of fields included in that index, `<key>`
corresponds to the document key of the write attempt, and `<values>`
corresponds to the indexed values of the document. In addition, the error object
contains `_key`, `_id`, and `_rev` attributes. The `_key` and `_id` correspond
to the document of the write attempt, and `_rev` corresponds to the current
revision of the document as stored in the database (if available, otherwise empty).

## Deprecated and removed Pregel features

- The experimental _Custom Pregel_ feature, also known as
  _programmable Pregel algorithms_ (PPA), has been removed.

- The built-in _DMID_ Pregel algorithm has been deprecated and will be removed
  in a future release.

- The `async` option for Pregel jobs has been removed. Some algorithms supported
  an asynchronous mode to run without synchronized global iterations. This is no
  longer supported.

- The `useMemoryMaps` option for Pregel jobs to use memory-mapped files as a
  backing storage for large datasets has been removed. Memory paging/swapping
  provided by the operating system is equally effective.

## JavaScript API

### Index API

Calling `collection.dropIndex(...)` or `db._dropIndex(...)` now raises an error
if the specified index does not exist or cannot be dropped (for example, because
it is a primary index or edge index). The methods previously returned `false`.
In case of success, they still return `true`.

You can wrap calls to these methods with a `try { ... }` block to catch errors,
for example, in _arangosh_ or in Foxx services.

## Startup options

### `--server.disable-authentication` and `--server.disable-authentication-unix-sockets` obsoleted

The `--server.disable-authentication` and `--server.disable-authentication-unix-sockets`
startup options are now obsolete. Specifying them is still tolerated but has
no effect anymore. These options were deprecated in v3.0 and mapped to
`--server.authentication` and `--server.authentication-unix-sockets`, which
made them do the opposite of what their names suggest.

### `--database.force-sync-properties` deprecated

The `--database.force-sync-properties` option was useful with the MMFiles
storage engine, which has been removed in v3.7. The option does not have any
useful effect if you use the RocksDB storage engine. From v3.11.0 onwards, it
has no effect at all, is deprecated, and will be removed in a future version.

### `--agency.pool-size` deprecated

The `--agency.pool-size` option was effectively not properly supported in any
version of ArangoDB. Setting the option to anything but the value of
`--agency.size` should be avoided.

From v3.11.0 onwards, this option is deprecated, and setting it to a value
different than the value of `--agency.size` leads to a startup error.

### `--query.parallelize-gather-writes` obsoleted

Parallel gather is now enabled by default and supported for most queries.
The `--query.parallelize-gather-writes` startup option has no effect anymore,
but specifying it still tolerated.

See [Features and Improvements in ArangoDB 3.11](release-notes-new-features311.html#parallel-gather)
for details.

### `--pregel.memory-mapped-files*` obsoleted

Pregel no longer supports use memory-mapped files as a backing storage.
The following startup options have therefore been removed:

- `--pregel.memory-mapped-files`
- `--pregel.memory-mapped-files-custom-path`
- `--pregel.memory-mapped-files-location-type`

You can still specify them on startup without raising errors but they have no
effect anymore.

## Client tools

### arangoexport

The default output file type produced by arangoexport, controlled by the `--type`
startup option, has been changed from `json` to `jsonl`.
This allows for more efficient processing of the files produced by arangoexport
with other tools, such as arangoimport, by default.
