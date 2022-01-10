---
layout: default
description: >-
  AQL offers an UPSERT operation and an INSERT operation with different
  overwrite modes but there is also the Document API as an alternative
title: Conditionally Inserting and Updating/Replacing Documents
---
# Conditionally Inserting and Updating/Replacing Documents

A common requirement when ingesting data is to ensure that certain documents
exist in a collection. Oftentimes when running a command it is unclear whether
the target documents are already present in the collection or need to be
inserted first.

Unconditional `INSERT` operations will not work here, because they may run
into errors if the target documents already exist. This will trigger a
"unique constraint violation" error. Unconditional `UPDATE` or `REPLACE`
operations will also fail, because they require that the target documents are
already present. If this is not the case, the operations would run into
"document not found" errors.

So what needs to be run instead are conditional inserts/updates/replaces, also
called _upserts_ or _repserts_. The behavior of such operations is:

- Check if a document exists, based on some criteria
- If it does not exist, create the document
- If it exists, update or replace it with a new version

ArangoDB provides the following options in AQL to achieve this:

- `UPSERT` AQL operation
- `INSERT` AQL operation with `overwriteMode`
- Insert operation not using AQL, but the Document REST API

These alternatives have different capabilities and performance characteristics.

## `UPSERT` AQL Operation

Let us start with the [`UPSERT` AQL operation](operations-upsert.html),
which is very generic and flexible.

The purpose of the `UPSERT` AQL operation is to ensure that a specific document
exists after the operation has finished.

`UPSERT` will look for a specific document, based on user-configurable
attributes/values, and create the document if it does not yet exist.
If `UPSERT` finds such document, it can partially adjust it (`UPDATE`) or fully
replace it (`REPLACE`).

To recap, the syntaxes of AQL `UPSERT` are, depending on whether you want to
update replace a document:

```js
UPSERT <search-expression>
INSERT <insert-expression>
UPDATE <update-expression>
IN <collection> OPTIONS <options>
```

or

```js
UPSERT <search-expression>
INSERT <insert-expression>
REPLACE <replace-expression>
IN <collection> OPTIONS <options>
```

The `OPTIONS` part is optional.

An example `UPSERT` operation looks like this:

```js
UPSERT { page: "index.html" }
INSERT { page: "index.html", status: "inserted" }
UPDATE { status: "updated" }
IN pages
```

This will look for a document in the `pages` collection with the `page`
attribute having a value of `index.html`. If such document cannot be found, the
`INSERT` part will be executed, which will create a document with the `page` and
`status` attributes. If the operation finds an existing document with `page`
being `index.html`, it will execute the `UPDATE` part, which will set the
document's `status` attribute to `updated`.

### Tracking Modification Dates

The `UPSERT` AQL operation is sometimes used in combination with
date/time-keeping. For example, the following query keeps track of when a
document was first created, and when it was last updated:

```js
UPSERT { page: "index.html" } 
INSERT { page: "index.html", created: DATE_NOW() }
UPDATE { updated: DATE_NOW() }
IN pages
```

### `OLD` variable

The `UPSERT` AQL operation also provides a pseudo-variable named `OLD` to refer
to the existing document and its values in the `UPDATE`/`REPLACE` part.
Following is an example that increments a counter on a document whenever the
`UPSERT` operation is executed:

```js
UPSERT { page: "index.html" }
INSERT { page: "index.html", hits: 1 }
UPDATE { hits: OLD.value + 1 }
IN pages
```

### `UPSERT` Caveats

`UPSERT` is a very flexible operation, so some things should be kept in mind to
use it effectively and efficiently.

#### Repeat the Search Attributes

First of all, the `INSERT` part of an `UPSERT` operation should contain all
attributes that are used in the search expression. Consider the following
counter-example:

```js
UPSERT { page: "index.html" }
INSERT { status: "inserted" } /* page attribute missing here! */
UPDATE { status: "updated" }
IN pages
```

Forgetting to specify the search attributes in the `INSERT` part introduces a
problem: The first time the `UPSERT` is executed and does not find a document
with `page` being `index.html`, it will branch into the `INSERT` part as
expected. However, the `INSERT` part will create a document with only the
`status` attribute set. The `page` attribute is missing here, so when the
`INSERT` completes, there is still no document with `page` being `index.html`.
That means whenever this `UPSERT` statement executes, it will branch into the
`INSERT` part, and the `UPDATE` part will never be reached. This is likely
unintentional.

The problem can easily be avoided by adding the search attributes to the
`INSERT` part:

```js
UPSERT { page: "index.html" }
INSERT { page: "index.html", status: "inserted" }
UPDATE { status: "updated" }
IN pages
```

Note that it is not necessary to repeat the search attributes in the `UPDATE`
part, because `UPDATE` is a partial update. It will only set the attributes that
are specified in the `UPDATE` part, and leave all other existing attributes
alone. However, it is necessary to repeat the search attributes in the `REPLACE`
part, because `REPLACE` will completely overwrite the existing document with
what is specified in the `REPLACE` part.

That means when using the `REPLACE` operation, the query should look like:

```js
UPSERT { page: "index.html" }
INSERT { page: "index.html", status: "inserted" }
REPLACE { page: "index.html", status: "updated" }
IN pages
```

#### Use Indexes for Search Attributes

A downside of `UPSERT`'s flexibility is that it can be used on arbitrary
collection attributes, even if those are not indexed.

When the `UPSERT` looks for an existing document, it _will_ use an index if an
index exists, but will also continue if no index exists. In the latter case,
the `UPSERT` will execute a full collection scan, which can be expensive for
large collections. So it is advised to create an index on the search
attribute(s) used in an `UPSERT`.

#### `UPSERT` is Non-Atomic

The overall `UPSERT` operation does not execute atomically for a single document.
It is basically a document lookup followed by either a document insert, update
or replace operation.

That means if multiple `UPSERT` operations run concurrently with the same search
values, they may all determine that the target document does not exist - and
then all decide to create such document. That will mean one will end up with
multiple instances of the target document afterwards.

To avoid such concurrency issues, a unique index can be created on the search
attribute(s). Such index will prevent concurrent `UPSERT` operations from
creating identical documents. Instead, only one of the concurrent `UPSERT`s will
succeed, whereas the others will fail with a "unique constraint violated" error.
In that case the client application can either retry the operation (which then
should go into the `UPDATE`/`REPLACE` branch), or ignore the error if the goal
was only to ensure the target document exists.

Using a unique index on the search attribute(s) will thus improve lookup
performance and avoid duplicates.

#### Using Shard Key(s) for Lookups

In a cluster setup, the search expression should contain the shard key(s), as
this allows the lookup to be sent to a single shard only. This will be more
efficient than having to execute the lookup on all the shards of the collection.

Another benefit of using the shard key(s) in the search expression is that
unique indexes are only supported if they contain the shard key(s).

## `INSERT` AQL Operation with `overwriteMode`

While the `UPSERT` AQL operation is very powerful and flexible, it is often not
the ideal choice for high-volume ingestion.

A much more efficient alternative to the `UPSERT` AQL operation is the
[`INSERT` AQL operation](operations-insert.html) with the `overwriteMode`
attribute set. This operation is not a drop-in replacement for `UPSERT`, but
rather a fast alternative in case the document key (`_key` attribute) is known
when the operation is executed, and none of the old values need to be referenced.

The general syntax of the `INSERT` AQL operation is:

```js
INSERT <insert-expression>
IN <collection> OPTIONS <options>
```

As we will deal with the `overwriteMode` option here, we are focussing on
`INSERT` operations with this option set, for example:

```js
INSERT { _key: "index.html", status: "created" }
IN pages OPTIONS { overwriteMode: "ignore" }
```

Regardless of the selected `overwriteMode`, the `INSERT` operation will insert
the document if no document exists in the collection with the specified `_key`.
In this aspect it behaves as a regular `INSERT` operation.

However, if a document with the specified `_key` already exists in the
collection, the `INSERT` behavior will be as follows, depending on the selected
`overwriteMode`:

- `conflict` (default): if a document with the specified `_key` exists, return
  a "unique constraint violation"
- `ignore`: if a document with the specified `_key` exists, do nothing.
  Especially do not report a "unique constraint violation" error.
- `update`: if a document with the specified `_key` exists, (partially) update
  the document with the attributes specified.
- `replace`: if a document with the specified `_key` exists, fully replace the
  document with the attributes specified.

If no `overwriteMode` is specified, the behavior of an `INSERT` operation is as
if the `overwriteMode` was set to `conflict`.

The benefit of using `INSERT` with `overwriteMode` set to `ignore`, `update` or
`replace` is that the `INSERT` operation is going to be very fast, especially in
comparison with the `UPSERT` operation. In addition, `INSERT` will do a lookup
using the `_key` attribute, which is always indexed. So it will always use the
primary index and never do full collection scans. It also does not require
setting up additional indexes, because the primary index is automatically
present for all collections.

There are also a few caveats when working with `INSERT` AQL operations:

- They can only be used when the value of the `_key` attribute is known at the
  time of insert. That means the client application must be able to provide the
  document keys in a deterministic way.

- The values that can be used for the  `_key` attribute have some character and
  length restrictions, but alphanumeric keys work well.

- In a cluster setup, the underlying collection must be sharded by `_key`. This
  is the default shard key, however.

- There is no access to the data of an existing document for arbitrary
  calculations when going into the `update` or `replace` mode.

Please note that even though the `INSERT` AQL operation cannot refer to existing
documents to calculate values for updating/replacing, it can still return the
previous version of the document in case the document is already present.
This can be achieved by appending a `RETURN OLD` to the `INSERT` operation,
e.g.

```js
INSERT { _key: "index.html", status: "created" }
IN pages OPTIONS { overwriteMode: "replace" }
RETURN OLD
```

It is also possible to return the new version of the document (the inserted
document if no previous document existed, or the updated/replaced version in
case a document already existed) by using `RETURN NEW`:

```js
INSERT { _key: "index.html", status: "created" }
IN pages OPTIONS { overwriteMode: "replace" }
RETURN NEW
```

## Insert Operation not Using AQL

There is the option to execute an insert operation with `overwriteMode` outside
of AQL. The [`POST /_api/document/{collection}`](../http/document-working-with-documents.html#create-multiple-documents)
endpoint is a dedicated REST API for insert operations, which can handle one
document, or multiple documents at once.

Conceptually this API behaves like the `INSERT` AQL operation, but it can be
called with a batch of documents at once. This is the most efficient solution,
and should be preferred if possible.

Most ArangoDB drivers also provide a means to insert multiple documents at once,
which will internally call this same REST API.

The REST API provides the `returnOld` and `returnNew` options to make it return
the previous versions of documents or the insert/updated/replaced documents, in
the same way as the `INSERT` AQL operation can do.

## Summary

The `UPSERT` AQL operation is the most flexible way to conditionally insert or
update/replace documents in ArangoDB, but it is also the least efficient variant.

The `INSERT` AQL operation with the `overwriteMode` set will outperform
`UPSERT`, but it can only be used for some use cases.

Using the dedicated REST API for document inserts will be even more efficient,
and is thus the preferred option for bulk document inserts.
