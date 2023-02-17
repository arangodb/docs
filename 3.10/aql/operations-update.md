---
layout: default
description: >-
  You can use `UPDATE` operations to partially update documents in a collection
  by adding or updating specific attributes
---
UPDATE
======

{{ page.description }}
{:class="lead"}

Each `UPDATE` operation is restricted to a single collection, and the
[collection name](../appendix-glossary.html#collection-name) must not be dynamic.
Only a single `UPDATE` statement per collection is allowed per AQL query, and
it cannot be followed by read or write operations that access the same collection,
by traversal operations, or AQL functions that can read documents.

You cannot update the `_id`, `_key`, and `_rev` system attributes, but you can
update the `_from` and `_to` attributes.

Updating a document modifies the document's revision number (`_rev` attribute)
with a server-generated value.

Syntax
------

The two syntaxes for an update operation are:

<pre><code>UPDATE <em>document</em> IN <em>collection</em>
UPDATE <em>keyExpression</em> WITH <em>document</em> IN <em>collection</em></code></pre>

Both variants can optionally end with an `OPTIONS { … }` clause.

`collection` must contain the name of the collection in which the document
should be updated.

`document` must be an object and contain the attributes and values to update.
**Attributes that don't yet exist** in the stored document **are added** to it.
**Existing attributes are set to the provided attribute values** (excluding the
immutable `_id` and `_key` attributes and the system-managed `_rev` attribute).
The operation leaves other existing attributes not specified in `document` untouched.
This distinguishes the `UPDATE` from the `REPLACE` operation, which affects all
attributes of the stored document and not only the attributes you specify in the
operation.

Sub-attributes are recursively merged by default, but you can let top-level
attributes replace existing ones by disabling the [`mergeObjects` option](#mergeobjects).

### `UPDATE <document> IN <collection>`

Using the first syntax, the `document` object must have a `_key` attribute with
the document key. The existing document with this key is updated with the
attributes provided by the `document` object (except for the `_id`, `_key`, and
`_rev` system attributes).

The following query adds or updates the `name` attribute of the document
identified by the key `my_key` in the `users` collection. The key is passed via
the `_key` attribute alongside other attributes:

```aql
UPDATE { _key: "my_key", name: "Jon" } IN users
```

The following query is invalid because the object does not contain a `_key`
attribute and thus it is not possible to determine the document to
be updated:

```aql
UPDATE { name: "Jon" } IN users
```

You can combine the `UPDATE` operation with a `FOR` loop to determine the
necessary key attributes, like shown below:

```aql
FOR u IN users
  UPDATE { _key: u._key, name: CONCAT(u.firstName, " ", u.lastName) } IN users
```

Note that the `UPDATE` and `FOR` operations are independent of each other and
`u` does not automatically define a document for the `UPDATE` statement.
Thus, the following query is invalid:

```aql
FOR u IN users
  UPDATE { name: CONCAT(u.firstName, " ", u.lastName) } IN users
```

### `UPDATE <keyExpression> WITH <document> IN <collection>`

Using the second syntax, the document to update is defined by the
`keyExpression`. It can either be a string with the document key, an object
which contains a `_key` attribute with the document key, or an expression that
evaluates to either of these two. The existing document with this key is
updated with the attributes provided by the `document` object (except for
the `_id`, `_key`, and `_rev` system attributes).

The following query adds or updates the `name` attribute of the document
identified by the key `my_key` in the `users` collection. The key is passed as
a string in the `keyExpression`. The attributes to add or update are passed
separately as the `document` object:

```aql
UPDATE "my_key" WITH { name: "Jon" } IN users
```

The `document` object may contain a `_key` attribute, but it is ignored.

You cannot define the document to update using an `_id` attribute, nor pass a
document identifier as a string (like `"users/john"`). However, you can use
`PARSE_IDENTIFIER(<id>).key` as `keyExpression` to get the document key as a
string:

```aql
LET key = PARSE_IDENTIFIER("users/john").key
UPDATE key WITH { ... } IN users
```

### Comparison of the syntaxes

Both syntaxes of the `UPDATE` operation allow you to define the document to
modify and the attributes to add or update. The document to update is effectively
identified by a document key in combination with the specified collection.

The `UPDATE` operation supports different ways of specifying the document key.
You can choose the syntax variant that is the most convenient for you.

The following queries are equivalent:

```aql
FOR u IN users
  UPDATE u WITH { name: CONCAT(u.firstName, " ", u.lastName) } IN users
```

```aql
FOR u IN users
  UPDATE u._key WITH { name: CONCAT(u.firstName, " ", u.lastName) } IN users
```

```aql
FOR u IN users
  UPDATE { _key: u._key } WITH { name: CONCAT(u.firstName, " ", u.lastName) } IN users
```

```aql
FOR u IN users
  UPDATE { _key: u._key, name: CONCAT(u.firstName, " ", u.lastName) } IN users
```

Dynamic key expressions
-----------------------

An `UPDATE` operation may update arbitrary documents, using either of the two
syntaxes:

```aql
FOR i IN 1..1000
  UPDATE { _key: CONCAT("test", i), name: "Paula" } IN users
```

```aql
FOR i IN 1..1000
  UPDATE CONCAT("test", i) WITH { name: "Paula" } IN users
```

Target a different collection
-----------------------------

The documents an `UPDATE` operation modifies can be in a different collection
than the ones produced by a preceding `FOR` operation:

```aql
FOR u IN users
  FILTER u.active == false
  UPDATE u WITH { status: "inactive" } IN backup
```

Note how documents are read from the `users` collection but updated in another
collection called `backup`. Both collections need to use matching document keys
for this to work.

Although the `u` variable holds a whole document, it is only used to define the
target document. The `_key` attribute of the object is extracted and the target
document is solely defined by the document key string value and the specified
collection of the `UPDATE` operation (`backup`). There is no link to the
original collection (`users`).

Using the current value of a document attribute
-----------------------------------------------

The pseudo-variable `OLD` is not supported inside of `WITH` clauses (it is
available after `UPDATE`). To access the current attribute value, you can
usually refer to a document via the variable of the `FOR` loop, which is used
to iterate over a collection:

```aql
FOR doc IN users
  UPDATE doc WITH {
    fullName: CONCAT(doc.firstName, " ", doc.lastName)
  } IN users
```

If there is no loop, because a single document is updated only, then there
might not be a variable like above (`doc`), which would let you refer to the
document which is being updated:

```aql
UPDATE "john" WITH { ... } IN users
```

To access the current value in this situation, you need to retrieve the document
first and store it in a variable:

```aql
LET doc = FIRST(FOR u IN users FILTER u._key == "john" RETURN u)
UPDATE doc WITH {
  fullName: CONCAT(doc.firstName, " ", doc.lastName)
} IN users
```

You can modify an existing attribute based on its current value this way,
to increment a counter for instance:

```aql
UPDATE doc WITH {
  karma: doc.karma + 1
} IN users
```

If the attribute `karma` doesn't exist yet, `doc.karma` evaluates to `null`.
The expression `null + 1` results in the new attribute `karma` being set to `1`.
If the attribute does exist, then it is increased by `1`.

Arrays can be mutated, too:

```aql
UPDATE doc WITH {
  hobbies: PUSH(doc.hobbies, "swimming")
} IN users
```

If the attribute `hobbies` doesn't exist yet, it is conveniently initialized
as `[ "swimming" ]` and otherwise extended.

Query options
-------------

You can optionally set query options for the `UPDATE` operation:

```aql
UPDATE ... IN users OPTIONS { ... }
```

### `ignoreErrors`

You can use `ignoreErrors` to suppress query errors that may occur when trying to
update non-existing documents or when violating unique key constraints:

```aql
FOR i IN 1..1000
  UPDATE CONCAT("test", i)
  WITH { foobar: true } IN users
  OPTIONS { ignoreErrors: true }
```

You cannot modify the `_id`, `_key`, and `_rev` system attributes, but attempts
to change them are ignored and not considered errors.

### `keepNull`

When updating an attribute to the `null` value, ArangoDB does not remove the attribute 
from the document but stores this `null` value. To remove attributes in an update
operation, set them to `null` and set the `keepNull` option to `false`. This removes
the attributes you specify but not any previously stored attributes with the `null` value:

```aql
FOR u IN users
  UPDATE u WITH { foobar: true, notNeeded: null } IN users
  OPTIONS { keepNull: false }
```

The above query removes the `notNeeded` attribute from the documents and updates
the `foobar` attribute normally.

### `mergeObjects`

The option `mergeObjects` controls whether object contents are
merged if an object attribute is present in both the `UPDATE` query and in the
to-be-updated document.

The following query sets the updated document's `name` attribute to the exact
same value that is specified in the query. This is due to the `mergeObjects` option
being set to `false`:

```aql
FOR u IN users
  UPDATE u WITH {
    name: { first: "foo", middle: "b.", last: "baz" }
  } IN users
  OPTIONS { mergeObjects: false }
```

Contrary, the following query merges the contents of the `name` attribute in the
original document with the value specified in the query:

```aql
FOR u IN users
  UPDATE u WITH {
    name: { first: "foo", middle: "b.", last: "baz" }
  } IN users
  OPTIONS { mergeObjects: true }
```

Attributes in `name` that are present in the to-be-updated document but not in the
query are preserved. Attributes that are present in both are overwritten
with the values specified in the query.

Note: the default value for `mergeObjects` is `true`, so there is no need to specify it
explicitly.

### `waitForSync`

To make sure data are durable when an update query returns, there is the `waitForSync` 
query option:

```aql
FOR u IN users
  UPDATE u WITH { foobar: true } IN users
  OPTIONS { waitForSync: true }
```

### `ignoreRevs`

In order to not accidentally overwrite documents that have been modified since you last fetched
them, you can use the option `ignoreRevs` to either let ArangoDB compare the `_rev` value and 
only succeed if they still match, or let ArangoDB ignore them (default):

```aql
FOR i IN 1..1000
  UPDATE { _key: CONCAT("test", i), _rev: "1287623" }
  WITH { foobar: true } IN users
  OPTIONS { ignoreRevs: false }
```

### `exclusive`

The RocksDB engine does not require collection-level locks. Different write
operations on the same collection do not block each other, as
long as there are no _write-write conflicts_ on the same documents. From an application
development perspective it can be desired to have exclusive write access on collections,
to simplify the development. Note that writes do not block reads in RocksDB.
Exclusive access can also speed up modification queries, because we avoid conflict checks.

Use the `exclusive` option to achieve this effect on a per query basis:

```aql
FOR doc IN collection
  UPDATE doc
  WITH { updated: true } IN collection
  OPTIONS { exclusive: true }
```

### `refillIndexCaches`

Whether to update existing entries in the in-memory edge cache if
edge documents are updated.

```aql
UPDATE { _key: "123", _from: "vert/C", _to: "vert/D" } IN edgeColl
  OPTIONS { refillIndexCaches: true }
```

Returning the modified documents
--------------------------------

You can optionally return the documents modified by the query. In this case, the `UPDATE` 
operation needs to be followed by a `RETURN` operation. Intermediate `LET` operations are
allowed, too. These operations can refer to the pseudo-variables `OLD` and `NEW`.
The `OLD` pseudo-variable refers to the document revisions before the update, and `NEW`
refers to the document revisions after the update.

Both `OLD` and `NEW` contain all document attributes, even those not specified
in the update expression.

```aql
UPDATE document IN collection options RETURN OLD
UPDATE document IN collection options RETURN NEW
UPDATE keyExpression WITH document IN collection options RETURN OLD
UPDATE keyExpression WITH document IN collection options RETURN NEW
```

Following is an example using a variable named `previous` to capture the original
documents before modification. For each modified document, the document key is returned.

```aql
FOR u IN users
  UPDATE u WITH { value: "test" } IN users 
  LET previous = OLD
  RETURN previous._key
```

The following query uses the `NEW` pseudo-value to return the updated documents,
without some of the system attributes:

```aql
FOR u IN users
  UPDATE u WITH { value: "test" } IN users
  LET updated = NEW
  RETURN UNSET(updated, "_key", "_id", "_rev")
```

It is also possible to return both `OLD` and `NEW`:

```aql
FOR u IN users
  UPDATE u WITH { value: "test" } IN users
  RETURN { before: OLD, after: NEW }
```

Transactionality
----------------

On a single server, updates are executed transactionally in an all-or-nothing
fashion.

If the RocksDB engine is used and intermediate commits are enabled, a query may
execute intermediate transaction commits in case the running transaction (AQL
query) hits the specified size thresholds. In this case, the query's operations
carried out so far are committed and not rolled back in case of a later
abort/rollback. That behavior can be controlled by adjusting the intermediate
commit settings for the RocksDB engine.

For sharded collections, the entire query and/or update operation may not be
transactional, especially if it involves different shards and/or DB-Servers.
