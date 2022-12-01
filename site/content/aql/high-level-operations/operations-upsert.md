---
fileID: operations-upsert
title: UPSERT
weight: 3675
description: 
layout: default
---
The `UPSERT` keyword can be used for checking whether certain documents exist,
and to update/replace them in case they exist, or create them in case they do not exist.

Each `UPSERT` operation is restricted to a single collection, and the 
[collection name](../../appendix/appendix-glossary#collection-name) must not be dynamic.
Only a single `UPSERT` statement per collection is allowed per AQL query, and 
it cannot be followed by read or write operations that access the same collection, by
traversal operations, or AQL functions that can read documents.

## Syntax

The syntax for upsert and repsert operations is:

<pre><code>UPSERT <em>searchExpression</em> INSERT <em>insertExpression</em> UPDATE <em>updateExpression</em> IN <em>collection</em>
UPSERT <em>searchExpression</em> INSERT <em>insertExpression</em> REPLACE <em>updateExpression</em> IN <em>collection</em></code></pre>

Both variants can optionally end with an `OPTIONS { … }` clause.

When using the `UPDATE` variant of the upsert operation, the found document
will be partially updated, meaning only the attributes specified in
*updateExpression* will be updated or added. When using the `REPLACE` variant
of upsert (repsert), existing documents will be replaced with the contexts of
*updateExpression*.

Updating a document will modify the document's revision number with a server-generated value.
The system attributes `_id`, `_key` and `_rev` cannot be updated, `_from` and `_to` can.

The *searchExpression* contains the document to be looked for. It must be an object 
literal without dynamic attribute names. In case no such document can be found in
*collection*, a new document will be inserted into the collection as specified in the
*insertExpression*. 

In case at least one document in *collection* matches the *searchExpression*, it will
be updated using the *updateExpression*. When more than one document in the collection
matches the *searchExpression*, it is undefined which of the matching documents will
be updated. It is therefore often sensible to make sure by other means (such as unique 
indexes, application logic etc.) that at most one document matches *searchExpression*.

The following query will look in the *users* collection for a document with a specific
*name* attribute value. If the document exists, its *logins* attribute will be increased
by one. If it does not exist, a new document will be inserted, consisting of the
attributes *name*, *logins*, and *dateCreated*:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
UPSERT { name: 'superuser' } 
INSERT { name: 'superuser', logins: 1, dateCreated: DATE_NOW() } 
UPDATE { logins: OLD.logins + 1 } IN users
```
{{% /tab %}}
{{< /tabs >}}

Note that in the `UPDATE` case it is possible to refer to the previous version of the
document using the `OLD` pseudo-value.

## Query options

### `ignoreErrors`

The `ignoreErrors` option can be used to suppress query errors that may occur
when trying to violate unique key constraints.

### `keepNull`

When updating or replacing an attribute with a null value, ArangoDB will not remove the 
attribute from the document but store a null value for it. To get rid of attributes in 
an upsert operation, set them to null and provide the `keepNull` option.

### `mergeObjects`

The option `mergeObjects` controls whether object contents will be
merged if an object attribute is present in both the `UPDATE` query and in the 
to-be-updated document.

{{% hints/tip %}}
The default value for `mergeObjects` is `true`, so there is no need to specify it
explicitly.
{{% /hints/tip %}}

### `waitForSync`

To make sure data are durable when an update query returns, there is the `waitForSync` 
query option.

### `ignoreRevs`

In order to not accidentally update documents that have been written and updated since 
you last fetched them you can use the option `ignoreRevs` to either let ArangoDB compare 
the `_rev` value and only succeed if they still match, or let ArangoDB ignore them (default):

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR i IN 1..1000
  UPSERT { _key: CONCAT('test', i)}
    INSERT {foobar: false}
    UPDATE {_rev: "1287623", foobar: true }
  IN users OPTIONS { ignoreRevs: false }
```
{{% /tab %}}
{{< /tabs >}}

{{% hints/info %}}
You need to add the `_rev` value in the *updateExpression*. It will not be used
within the *searchExpression*. Even worse, if you use an outdated `_rev` in the
*searchExpression*, `UPSERT` will trigger the `INSERT` path instead of the
`UPDATE` path, because it has not found a document exactly matching the
*searchExpression*.
{{% /hints/info %}}

### `exclusive`

The RocksDB engine does not require collection-level locks. Different write
operations on the same collection do not block each other, as
long as there are no _write-write conflicts_ on the same documents. From an application
development perspective it can be desired to have exclusive write access on collections,
to simplify the development. Note that writes do not block reads in RocksDB.
Exclusive access can also speed up modification queries, because we avoid conflict checks.

Use the `exclusive` option to achieve this effect on a per query basis:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR i IN 1..1000
  UPSERT { _key: CONCAT('test', i) }
  INSERT { foobar: false }
  UPDATE { foobar: true }
  IN users OPTIONS { exclusive: true }
```
{{% /tab %}}
{{< /tabs >}}

### `indexHint`

The `indexHint` option will be used as a hint for the document lookup
performed as part of the `UPSERT` operation, and can help in cases such as
`UPSERT` not picking the best index automatically.

{{< tabs >}}
{{% tab name="aql" %}}
```aql
UPSERT { a: 1234 }
  INSERT { a: 1234, name: "AB" }
  UPDATE { name: "ABC" } IN myCollection
  OPTIONS { indexHint: "index_name" }
```
{{% /tab %}}
{{< /tabs >}}

The index hint is passed through to an internal `FOR` loop that is used for the
lookup. Also see [`indexHint` Option of the `FOR` Operation](operations-for#indexhint).

### `forceIndexHint`

Makes the index or indexes specified in `indexHint` mandatory if enabled. The
default is `false`. Also see
[`forceIndexHint` Option of the `FOR` Operation](operations-for#forceindexhint).

{{< tabs >}}
{{% tab name="aql" %}}
```aql
UPSERT { a: 1234 }
  INSERT { a: 1234, name: "AB" }
  UPDATE { name: "ABC" } IN myCollection
  OPTIONS { indexHint: … , forceIndexHint: true }
```
{{% /tab %}}
{{< /tabs >}}

## Returning documents

`UPSERT` statements can optionally return data. To do so, they need to be followed
by a `RETURN` statement (intermediate `LET` statements are allowed, too). These statements
can optionally perform calculations and refer to the pseudo-values `OLD` and `NEW`.
In case the upsert performed an insert operation, `OLD` will have a value of `null`.
In case the upsert performed an update or replace operation, `OLD` will contain the
previous version of the document, before update/replace.

`NEW` will always be populated. It will contain the inserted document in case the
upsert performed an insert, or the updated/replaced document in case it performed an
update/replace.

This can also be used to check whether the upsert has performed an insert or an update 
internally:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
UPSERT { name: 'superuser' } 
INSERT { name: 'superuser', logins: 1, dateCreated: DATE_NOW() } 
UPDATE { logins: OLD.logins + 1 } IN users
RETURN { doc: NEW, type: OLD ? 'update' : 'insert' }
```
{{% /tab %}}
{{< /tabs >}}

## Transactionality

On a single server, upserts are executed transactionally in an all-or-nothing
fashion.

If the RocksDB engine is used and intermediate commits are enabled, a query may
execute intermediate transaction commits in case the running transaction (AQL
query) hits the specified size thresholds. In this case, the query's operations
carried out so far will be committed and not rolled back in case of a later
abort/rollback. That behavior can be controlled by adjusting the intermediate
commit settings for the RocksDB engine.

For sharded collections, the entire query and/or upsert operation may not be
transactional, especially if it involves different shards and/or DB-Servers.

## Limitations

- The lookup and the insert/update/replace parts are executed one after
  another, so that other operations in other threads can happen in
  between. This means if multiple UPSERT queries run concurrently, they
  may all determine that the target document does not exist and then
  create it multiple times!

  Note that due to this gap between the lookup and insert/update/replace,
  even with a unique index there may be duplicate key errors or conflicts.
  But if they occur, the application/client code can execute the same query
  again.

  To prevent this from happening, one should add a unique index to the lookup
  attribute(s). Note that in the cluster a unique index can only be created if
  it is equal to the shard key attribute of the collection or at least contains
  it as a part.

  An alternative to making an UPSERT statement work atomically is to use the
  `exclusive` option to limit write concurrency for this collection to 1, which
  helps avoiding conflicts but is bad for throughput!

- Using very large transactions in an UPSERT (e.g. UPSERT over all documents in
  a collection) an **intermediate commit** can be triggered. This intermediate
  commit will write the data that has been modified so far. However this will
  have the side-effect that atomicity of this operation cannot be guaranteed
  anymore and that ArangoDB cannot guarantee to that read your own writes in
  upsert will work.

  This will only be an issue if you write a query where your search condition
  would hit the same document multiple times, and only if you have large
  transactions. In order to avoid this issues you can increase the
  `intermediateCommit` thresholds for data and operation counts.

- The lookup attribute(s) from the search expression should be indexed in order
  to improve UPSERT performance. Ideally, the search expression contains the
  shard key, as this allows the lookup to be restricted to a single shard.
