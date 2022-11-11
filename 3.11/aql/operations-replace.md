---
layout: default
description: The REPLACE keyword can be used to completely replace documents in a collection
---
REPLACE
=======

The `REPLACE` keyword can be used to completely replace documents in a collection.

Each `REPLACE` operation is restricted to a single collection, and the 
[collection name](../appendix-glossary.html#collection-name) must not be dynamic.
Only a single `REPLACE` statement per collection is allowed per AQL query, and 
it cannot be followed by read or write operations that access the same collection, by
traversal operations, or AQL functions that can read documents.
The system attributes `_id`, `_key` and `_rev` cannot be replaced, `_from` and `_to` can.

Syntax
------

The two syntaxes for a replace operation are:

<pre><code>REPLACE <em>document</em> IN <em>collection</em>
REPLACE <em>keyExpression</em> WITH <em>document</em> IN <em>collection</em></code></pre>

Both variants can optionally end with an `OPTIONS { … }` clause.

`collection` must contain the name of the collection in which the documents should
be replaced. `document` must be an object that contains the attributes and values 
to set. All existing attributes in the stored document are removed from it and
only the provided attributes are set (excluding system attributes).

### `REPLACE <document> IN <collection>`

Using the first syntax, the `document` object must have a `_key` attribute with
the document key. The existing document with this key is replaced with the
attributes provided by the `document` object.

The following query replaces the document identified by the key `my_key` in the
`users` collection, only setting a `name` attribute. The key is passed via
the `_key` attribute alongside other attributes:

```aql
REPLACE { _key: "my_key", name: "Jon", status: "active" } IN users
```

The following query is invalid because the object does not contain a `_key`
attribute and thus it is not possible to determine the documents to
be replaced:

```aql
REPLACE { name: "Jon" } IN users
```

You can combine the `REPLACE` operation with a `FOR` loop to determine the
necessary key attributes, like shown below:

```aql
FOR u IN users
  REPLACE { _key: u._key, name: CONCAT(u.firstName, " ", u.lastName), status: u.status } IN users
```

Note that the `REPLACE` and `FOR` operations are independent of each other and
`u` does not automatically define a document for the `REPLACE` statement.
Thus, the following query is invalid:

```aql
FOR u IN users
  REPLACE { name: CONCAT(u.firstName, " ", u.lastName), status: u.status } IN users
```

### `REPLACE <keyExpression> WITH <document> IN <collection>`

Using the second syntax, the document to replace is defined by the
`keyExpression`. It can either be a string with the document key, an object
which contains a `_key` attribute with the document key, or an expression that
evaluates to either of these two.

The following query replaces the document identified by the key `my_key` in the
`users` collection, only setting a `name` attribute. The key is passed as
a string in the `keyExpression`. The attributes to set are passed
separately as the `document` object:

```aql
REPLACE "my_key" WITH { name: "Jon", status: "active" } IN users
```

If the `document` object may contain a `_key` attribute but it is ignored.

You cannot define the document to replace using an `_id` attribute, nor pass a
document identifier as a string (like `"users/john"`). However, you can use
`PARSE_IDENTIFIER(<id>).key` as `keyExpression` to get the document key as a
string.

### Comparison of the syntaxes

The following queries are equivalent:

```aql
FOR u IN users
  REPLACE u._key WITH { name: CONCAT(u.firstName, " ", u.lastName), status: u.status } IN users
```

```aql
FOR u IN users
  REPLACE { _key: u._key } WITH { name: CONCAT(u.firstName, " ", u.lastName), status: u.status } IN users
```

```aql
FOR u IN users
  REPLACE u WITH { name: CONCAT(u.firstName, " ", u.lastName), status: u.status } IN users
```

Dynamic key expressions
-----------------------

An `REPLACE` operation may replace arbitrary documents, using either of the two
syntaxes:

```aql
FOR i IN 1..1000
  REPLACE { _key: CONCAT('test', i), name: "Paula", status: "active" } IN users
```

```aql
FOR i IN 1..1000
  REPLACE CONCAT('test', i) WITH { name: "Paula", status: "active" } IN users
```

Target a different collection
-----------------------------

The documents an `REPLACE` operations modifies can be in a different collection
than the ones produced by a preceding `FOR` operation:

```aql
FOR u IN users
  FILTER u.active == false
  REPLACE u WITH { status: "inactive", name: u.name } IN backup
```

Note how documents are read from the `users` collection but replaced in another
collection called `backup`. Both collections need to use matching document keys
for this to work.

Query options
-------------

You can optionally set query options for the `REPLACE` operation:

```aql
REPLACE ... IN users OPTIONS { ... }
```

### `ignoreErrors`

`ignoreErrors` can be used to suppress query errors that may occur when trying to
replace non-existing documents or when violating unique key constraints:

```aql
FOR i IN 1..1000
  REPLACE CONCAT('test', i)
  WITH { foobar: true } IN users
  OPTIONS { ignoreErrors: true }
```

Internal attributes (such as `_id`, `_key`, `_rev`, `_from` and `_to`) cannot
be modified and are ignored when specified in `document`. Replacing a document
modifies the document's revision number with a server-generated value.

### `waitForSync`

To make sure data are durable when a replace query returns, there is the `waitForSync` 
query option:

```aql
FOR i IN 1..1000
  REPLACE CONCAT('test', i)
  WITH { foobar: true } IN users
  OPTIONS { waitForSync: true }
```

### `ignoreRevs`

In order to not accidentally overwrite documents that have been modified since you last fetched
them, you can use the option `ignoreRevs` to either let ArangoDB compare the `_rev` value and only 
succeed if they still match, or let ArangoDB ignore them (default):

```aql
FOR i IN 1..1000
  REPLACE { _key: CONCAT('test', i), _rev: "1287623" }
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
  REPLACE doc._key 
  WITH { replaced: true } IN collection 
  OPTIONS { exclusive: true }
```

Returning the modified documents
--------------------------------

The modified documents can also be returned by the query. In this case, the `REPLACE` 
statement must be followed by a `RETURN` statement (intermediate `LET` statements are
allowed, too). The `OLD` pseudo-value can be used to refer to document revisions before 
the replace, and `NEW` refers to document revisions after the replace.

Both `OLD` and `NEW` contain all document attributes, even those not specified
in the replace expression.


```aql
REPLACE document IN collection options RETURN OLD
REPLACE document IN collection options RETURN NEW
REPLACE keyExpression WITH document IN collection options RETURN OLD
REPLACE keyExpression WITH document IN collection options RETURN NEW
```

Following is an example using a variable named `previous` to return the original
documents before modification. For each replaced document, the document key is
returned:

```aql
FOR u IN users
  REPLACE u WITH { value: "test" } IN users
  LET previous = OLD
  RETURN previous._key
```

The following query uses the `NEW` pseudo-value to return the replaced
documents (without some of their system attributes):

```aql
FOR u IN users
  REPLACE u WITH { value: "test" } IN users
  LET replaced = NEW
  RETURN UNSET(replaced, "_key", "_id", "_rev")
```

Transactionality
----------------

On a single server, the replace operation is executed transactionally in an
all-or-nothing fashion.

If the RocksDB engine is used and intermediate commits are enabled, a query may
execute intermediate transaction commits in case the running transaction (AQL
query) hits the specified size thresholds. In this case, the query's operations
carried out so far are committed and not rolled back in case of a later
abort/rollback. That behavior can be controlled by adjusting the intermediate
commit settings for the RocksDB engine. 

For sharded collections, the entire query and/or replace operation may not be
transactional, especially if it involves different shards and/or DB-Servers.
