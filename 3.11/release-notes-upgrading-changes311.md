---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.11
---
# Incompatible changes in ArangoDB 3.11

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.11, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.11:

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

## Client tools

### arangoexport

The default output file type produced by arangoexport, controlled by the `--type`
startup option, has been changed from `json` to `jsonl`.
This allows for more efficient processing of the files produced by arangoexport
with other tools, such as arangoimport, by default.
