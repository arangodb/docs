---
layout: default
description: The UPDATE keyword can be used to partially update documents in a collection
---
UPDATE
======

The `UPDATE` keyword can be used to partially update documents in a collection.

Each `UPDATE` operation is restricted to a single collection, and the
[collection name](../appendix-glossary.html#collection-name) must not be dynamic.
Only a single `UPDATE` statement per collection is allowed per AQL query, and
it cannot be followed by read or write operations that access the same collection,
by traversal operations, or AQL functions that can read documents. The system
attributes `_id`, `_key` and `_rev` cannot be updated, `_from` and `_to` can.

Syntax
------

The two syntaxes for an update operation are:

<pre><code>UPDATE <em>document</em> IN <em>collection</em>
UPDATE <em>keyExpression</em> WITH <em>document</em> IN <em>collection</em></code></pre>

Both variants can optionally end with an `OPTIONS { … }` clause.

`collection` must contain the name of the collection in which the documents should
be updated. `document` must be an object that contains the attributes and values 
to update. Attributes that don't yet exist in the stored document are added to it.

### `UPDATE <document> IN <collection>`

Using the first syntax, the `document` object must have a `_key` attribute with
the document key. The existing document with this key is updated with the
attributes provided by the `document` object.

The following query adds or updates the `name` attribute of the document
identified by the key `my_key` in the `users` collection. The key is passed via
the `_key` attribute alongside other attributes:

```aql
UPDATE { _key: "my_key", name: "Jon" } IN users
```

The following query is invalid because the object does not contain a `_key`
attribute and thus it is not possible to determine the documents that needs to
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
evaluates to either of these two.

The following query adds or updates the `name` attribute of the document
identified by the key `my_key` in the `users` collection. The key is passed as
a string in the `keyExpression`. The attributes to add or update are passed
separately as the `document` object:

```aql
UPDATE "my_key" WITH { name: "Jon" } IN users
```

If the `document` object may contain a `_key` attribute but it is ignored.

You cannot define the document to update using an `_id` attribute, nor pass a
document identifier as a string (like `"users/john"`). However, you can use
`PARSE_IDENTIFIER(<id>).key` as `keyExpression` to get the document key as a
string.

### Comparison of the syntaxes

The following queries are equivalent:

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
  UPDATE u WITH { name: CONCAT(u.firstName, " ", u.lastName) } IN users
```

Dynamic key expressions
-----------------------

An `UPDATE` operation may update arbitrary documents, using either of the two
syntaxes:

```aql
FOR i IN 1..1000
  UPDATE { _key: CONCAT('test', i), name: "Paula" } IN users
```

```aql
FOR i IN 1..1000
  UPDATE CONCAT('test', i) WITH { name: "Paula" } IN users
```

Target a different collection
-----------------------------

The documents an `UPDATE` operations modifies can be in a different collection
than the ones produced by a preceding `FOR` operation:

```aql
FOR u IN users
  FILTER u.active == false
  UPDATE u WITH { status: "inactive" } IN backup
```

Note how documents are read from the `users` collection but updated in another
collection called `backup`. Both collections need to use matching document keys
for this to work.

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

```aql
LET key = PARSE_IDENTIFIER("users/john").key
UPDATE key WITH { ... } IN users
```

To access the current value in this situation, the document has to be retrieved
and stored in a variable first:

```aql
LET doc = DOCUMENT("users/john")
UPDATE doc WITH {
  fullName: CONCAT(doc.firstName, " ", doc.lastName)
} IN users
```

An existing attribute can be modified based on its current value this way,
to increment a counter for instance:

```aql
UPDATE doc WITH {
  karma: doc.karma + 1
} IN users
```

If the attribute `karma` doesn't exist yet, `doc.karma` is evaluated to `null`.
The expression `null + 1` results in the new attribute `karma` being set to `1`.
If the attribute does exist, then it is increased by `1`.

Arrays can be mutated too of course:

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

`ignoreErrors` can be used to suppress query errors that may occur when trying to
update non-existing documents or violating unique key constraints:

```aql
FOR i IN 1..1000
  UPDATE CONCAT('test', i)
  WITH { foobar: true } IN users
  OPTIONS { ignoreErrors: true }
```

An update operation only update the attributes specified in `document` and
leave other attributes untouched. Internal attributes (such as `_id`, `_key`, `_rev`,
`_from` and `_to`) cannot be modified and are ignored when specified in `document`.
Updating a document modifies the document's revision number with a server-generated value.

### `keepNull`

When updating an attribute to a `null` value, ArangoDB does not remove the attribute 
from the document but stores this `null` value. To remove attributes in an update
operation, set them to `null` and set the `keepNull` option to `false`:

```aql
FOR u IN users
  UPDATE u WITH { foobar: true, notNeeded: null } IN users
  OPTIONS { keepNull: false }
```

The above query removes the `notNeeded` attribute from the documents and update
the `foobar` attribute normally.

### `mergeObjects`

The option `mergeObjects` controls whether object contents are
merged if an object attribute is present in both, the `UPDATE` query and in the 
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
  UPDATE { _key: CONCAT('test', i), _rev: "1287623" }
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

Returning the modified documents
--------------------------------

The modified documents can also be returned by the query. In this case, the `UPDATE` 
statement needs to be followed a `RETURN` statement (intermediate `LET` statements
are allowed, too). These statements can refer to the pseudo-values `OLD` and `NEW`.
The `OLD` pseudo-value refers to the document revisions before the update, and `NEW` 
refers to document revisions after the update.

Both ,`OLD` and `NEW`, contain all document attributes, even those not specified 
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
