---
layout: default
description: >-
  Stream Transactions allow you start a transaction, run multiple operations
  like AQL queries over a short period of time, and then commit or abort the
  transaction
---
# Stream Transactions

{{ page.description }}
{:class="lead"}

Stream Transactions allow you to perform multi-document transaction
with individual begin and commit / abort commands. This is comparable to the
*BEGIN*, *COMMIT* and *ROLLBACK* operations found in relational database systems.

Stream Transaction work in conjunction with other operations in ArangoDB.
Supported operations include:

- Read and write documents
- Get the number of documents of collections
- Truncate collections
- Run AQL queries

You **always need to start the transaction first** and explicitly specify the
collections used for write accesses upfront. You need to make sure that the
transaction is committed or aborted when it is no longer needed.
This avoids taking up resources on the ArangoDB server.

{% hint 'warning' %}
Transactions acquire collection locks for write operations in RocksDB.
It is therefore advisable to keep the transactions as short as possible.
{% endhint %}

For a more detailed description of how transactions work in ArangoDB, please
refer to [Transactions](../transactions.html).

You can use Stream Transactions via the [JavaScript API](#javascript-api) and
the [HTTP API](http/transaction-stream-transaction.html).

## Limitations

### Timeout and transaction size

A maximum lifetime and transaction size for Stream Transactions is enforced
on the Coordinator to ensure that abandoned transactions cannot block the
cluster from operating properly:

- Maximum idle timeout of up to **120 seconds** between operations.
- Maximum transaction size of **128 MB** per DB-Server.

These limits are also enforced for Stream Transactions on single servers.

The default maximum idle timeout is **60 seconds** between operations in a
single Stream Transaction. The maximum value can be bumped up to at most 120
seconds by setting the `--transaction.streaming-idle-timeout` startup option.
Posting an operation into a non-expired Stream Transaction resets the
transaction's timeout to the configured idle timeout.

Enforcing the limit is useful to free up resources used by abandoned
transactions, for example from transactions that are abandoned by client
applications due to programming errors or that were left over because client
connections were interrupted.

### Concurrent requests

A given transaction is intended to be used **serially**. No concurrent requests
using the same transaction ID should be issued by the client. The server can
make some effort to serialize certain operations (see
[Streaming Lock Timeout](programs-arangod-transaction.html#streaming-lock-timeout)),
however, this degrades the server's performance and may lead to sporadic
errors with code `28` (locked).

### Batch requests

The [Batch API](http/batch-request.html) cannot be used in combination with
Stream Transactions for submitting batched requests, because the required
`x-arango-trx-id` header is not forwarded.

## JavaScript API

### Create Transaction

`db._createTransaction(options) → trx`

Begin a Stream Transaction.

`options` must be an object with the following attributes:

- `collections`: A sub-object that defines which collections you want to use
  in the transaction. It can have the following sub-attributes:
  - `read`: A single collection or a list of collections to use in the
    transaction in read-only mode.
  - `write`: A single collection or a list of collections to use in the
    transaction in write or read mode.
  - `exclusive`: A single collection or a list of collections to acquire
    exclusive write access for.

Additionally, `options` can have the following optional attributes:

- `allowImplicit`: Allow reading from undeclared collections.
- `waitForSync`: An optional boolean flag that, if set, forces the
  transaction to write all data to disk before returning.
- `lockTimeout`: A numeric value that can be used to set a timeout in seconds for
  waiting on collection locks. This option is only meaningful when using
  `exclusive` locks. If not specified, a default value is used. Setting
  `lockTimeout` to `0` makes ArangoDB not time out waiting for a lock.
- `maxTransactionSize`: Transaction size limit in bytes.

The method returns an object that lets you run supported operations as part of
the transactions, get the status information, and commit or abort the transaction.

The following example shows how you can remove a document from a collection and
create a new document in the same collection using a Stream Transaction:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline jsStreamTransaction_1
    @EXAMPLE_ARANGOSH_OUTPUT{jsStreamTransaction_1}
    ~ db._create("tasks");
    ~ db.tasks.save({ _key: "123", type: "sendEmail", date: "2022-07-07T15:20:00.000Z" });
      var coll = "tasks";
      var trx = db._createTransaction({ collections: { write: [coll] } });
      var task = trx.query(`FOR t IN @@coll SORT t.date DESC LIMIT 1 RETURN t`, {"@coll": coll}).toArray()[0];
    | if (task) {
    |   print(task);
    |   trx.collection(coll).remove(task._key);
    |   var newTask = trx.collection(coll).save({ _key: "124", type: task.type, date: new Date().toISOString() }, { returnNew: true }).new;
    |   print(newTask);
    |   trx.commit();
    | } else {
    |   trx.abort();
      }
      trx.status();
    ~ db._drop("tasks");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock jsStreamTransaction_1
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### Commit

`trx.commit() → status`

Commit a Stream Transaction and return the [status](#status).

Committing is an idempotent operation. It is not an error to commit a transaction
more than once.

### Abort

`trx.abort() → status`

Abort a Stream Transaction and return the [status](#status).

Aborting is an idempotent operation. It is not an error to abort a transaction
more than once.

### Collection

`trx.collection(collection-name) → coll`

Return a collection object for the specified collection, or null if it does not
exist.

The object lets you access the following methods to perform document and
collection operations:

- [`count()`](data-modeling-documents-document-methods.html#count)
- [`document()`](data-modeling-documents-document-methods.html#document)
- [`exists()`](data-modeling-documents-document-methods.html#exists)
- [`insert()`](data-modeling-documents-document-methods.html#insert--save)
- [`name()`](data-modeling-collections-database-methods.html#collection-name)
- [`remove()`](data-modeling-documents-document-methods.html#remove)
- [`replace()`](data-modeling-documents-document-methods.html#replace)
- [`save()`](data-modeling-documents-document-methods.html#insert--save)
- [`truncate()`](data-modeling-collections-collection-methods.html#truncate)
- [`update()`](data-modeling-documents-document-methods.html#update)

Compared to the collection object returned by `db._collection()`, only a subset
of methods is available, and the operations are executed as part of the
Stream Transactions, but they work the same otherwise.

### Query

`trx.query(aql-query) → cursor`

Run an AQL query as part of a Stream Transaction and return a result cursor.
The method works similar to the
[`db._query()` method](aql/invocation-with-arangosh.html#with-db_query).

### ID

`trx.id() → id`

Get the identifier of the Stream Transaction.

### Running

`trx.running() → bool`

Return a boolean that indicates whether the Stream Transaction is on-going.

### Status

`trx.status() → status`

Return an object with the status information of the Stream Transaction.
The object has the following attributes:

- `id`: The identifier of the Stream Transaction.
- `status`: The status of the Stream Transaction.
  One of `"running"`, `"committed"`, or `"aborted"`.

## HTTP API

See the [HTTP Interface for Stream Transactions](http/transaction-stream-transaction.html)
documentation.
