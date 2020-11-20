---
layout: default
description: The INSERT keyword can be used to insert new documents into a collection
---
INSERT
======

The `INSERT` keyword can be used to insert new documents into a collection. On a 
single server, an insert operation is executed transactionally in an all-or-nothing 
fashion. 

If the RocksDB engine is used and intermediate commits are enabled, a query may 
execute intermediate transaction commits in case the running transaction (AQL
query) hits the specified size thresholds. In this case, the query's operations 
carried out so far will be committed and not rolled back in case of a later abort/rollback. 
That behavior can be controlled by adjusting the intermediate commit settings for 
the RocksDB engine. 

For sharded collections, the entire query and/or insert operation may not be transactional,
especially if it involves different shards and/or DB-Servers.

Each `INSERT` operation is restricted to a single collection, and the 
[collection name](../appendix-glossary.html#collection-name) must not be dynamic.
Only a single `INSERT` statement per collection is allowed per AQL query, and 
it cannot be followed by read or write operations that access the same collection, by
traversal operations, or AQL functions that can read documents.

The syntax for an insert operation is:

```
INSERT document INTO collection [ OPTIONS options ]
```

**Note**: The `IN` keyword is allowed in place of `INTO` and has the same meaning.

*collection* must contain the name of the collection into which the documents should
be inserted. *document* is the document to be inserted, and it may or may not contain
a *_key* attribute. If no *_key* attribute is provided, ArangoDB will auto-generate
a value for *_key* value. Inserting a document will also auto-generate a document
revision number for the document.

```js
FOR i IN 1..100
  INSERT { value: i } INTO numbers
```

An insert operation can also be performed without a `FOR` loop to insert a
single document:

```js
INSERT { value: 1 } INTO numbers
```

When inserting into an [edge collection](../appendix-glossary.html#edge-collection),
it is mandatory to specify the attributes *_from* and *_to* in document:

```js
FOR u IN users
  FOR p IN products
    FILTER u._key == p.recommendedBy
    INSERT { _from: u._id, _to: p._id } INTO recommendations
```

Query options
-------------

The *OPTIONS* keyword followed by an object with query options can optionally
be provided in an `INSERT` operation.

It can be used to suppress query errors that may occur when violating unique
key constraints:

```js
FOR i IN 1..1000
  INSERT {
    _key: CONCAT('test', i),
    name: "test",
    foobar: true
  } INTO users OPTIONS { ignoreErrors: true }
```

To make sure data are durable when an insert query returns, there is the *waitForSync* 
query option:

```js
FOR i IN 1..1000
  INSERT {
    _key: CONCAT('test', i),
    name: "test",
    foobar: true
  } INTO users OPTIONS { waitForSync: true }
```

If you want to replace existing documents with documents having the same key
there is the *overwrite* query option. This will let you safely replace the
documents instead of raising a "unique constraint violated error":

```js
FOR i IN 1..1000
  INSERT {
    _key: CONCAT('test', i),
    name: "test",
    foobar: true
  } INTO users OPTIONS { overwrite: true }
```

To further control the behavior of INSERT on primary index unique constraint
violations, there is the *overwriteMode* option. It offers the following
modes:

- `"ignore"`: if a document with the specified *_key* value exists already,
  nothing will be done and no write operation will be carried out. The
  insert operation will return success in this case. This mode does not
  support returning the old document version. Using `RETURN OLD` will trigger
  a parse error, as there will be no old version to return. `RETURN NEW`
  will only return the document in case it was inserted. In case the
  document already existed, `RETURN NEW` will return `null`.
- `"replace"`: if a document with the specified *_key* value exists already,
  it will be overwritten with the specified document value. This mode will
  also be used when no overwrite mode is specified but the *overwrite*
  flag is set to *true*.
- `"update"`: if a document with the specified *_key* value exists already,
  it will be patched (partially updated) with the specified document value.
- `"conflict"`: if a document with the specified *_key* value exists already,
  return a unique constraint violation error so that the insert operation
  fails. This is also the default behavior in case the overwrite mode is
  not set, and the *overwrite* flag is *false* or not set either.

The main use case of inserting documents with overwrite mode *ignore* is
to make sure that certain documents exist in the cheapest possible way.
In case the target document already exists, the *ignore* mode is most
efficient, as it will not retrieve the existing document from storage and
not write any updates to it.

When using the *update* overwrite mode, the *keepNull* and *mergeObjects*
options control how the update is done.
See [UPDATE operation](operations-update.html#query-options).

```js
FOR i IN 1..1000
  INSERT {
    _key: CONCAT('test', i),
    name: "test",
    foobar: true
  } INTO users OPTIONS { overwriteMode: "update", keepNull: true, mergeObjects: false }
```

The RocksDB engine does not require collection-level locks. 
Different write operations on the same collection do not block each other, as
long as there are no _write-write conflicts_ on the same documents. From an application
development perspective it can be desired to have exclusive write access on collections,
to simplify the development. Note that writes do not block reads in RocksDB.
Exclusive access can also speed up modification queries, because we avoid conflict checks.

Use the *exclusive* option to achieve this effect on a per query basis:

```js
FOR doc IN collection
  INSERT { myval: doc.val + 1 } INTO users 
  OPTIONS { exclusive: true }
```

Returning the inserted documents
--------------------------------

The inserted documents can also be returned by the query. In this case, the `INSERT` 
statement can be a `RETURN` statement (intermediate `LET` statements are allowed, too).
To refer to the inserted documents, the `INSERT` statement introduces a pseudo-value
named `NEW`. 

The documents contained in `NEW` will contain all attributes, even those auto-generated by
the database (e.g. `_id`, `_key`, `_rev`).


```js
INSERT document INTO collection RETURN NEW
```

Following is an example using a variable named `inserted` to return the inserted
documents. For each inserted document, the document key is returned:

```js
FOR i IN 1..100
  INSERT { value: i }
  INTO users
  LET inserted = NEW
  RETURN inserted._key
```
