---
layout: default
---
# Stream Transactions

<small>Introduced in: v3.5.0</small>

*Stream Transactions* allow you to perform a multi-document transaction 
with individual begin and commit / abort commands. This is similar to
the way traditional RDBMS do it with *BEGIN*, *COMMIT* and *ROLLBACK* operations.

To use a Stream Transaction a client first sends the [configuration](#begin-a-transaction)
of the transaction to the ArangoDB server.

{% hint 'info' %}
Contrary to [**JavaScript Transactions**](transaction-js-transaction.html),
the definition of Stream Transaction must only contain the collections that are
going to be used and (optionally) the various transaction options supported by
ArangoDB. No `action` attribute is supported.
{% endhint %}



Supported transactional JavaScript API operations include:

1. Read and write documents
2. Get the number of documents of a collection
3. Truncate a collection
4. Run an AQL query

## JavaScript API

### Create Transaction

`db._createTransaction(options) → trx`

Begin a Stream Transaction.

`options` must have the following attributes:

- `collections`: a sub-object that defines which collections you want to use
  in the transaction. It can have the following sub-attributes:
  - `read`: a single collection or a list of collections to use in the
    transaction in read-only mode.
  - `write`: a single collection or a list of collections to use in the
    transaction in write or read mode.
  - `exclusive`: a single collection or a list of collections to acquire
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

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline ensureUniquePersistentSingle
    @EXAMPLE_ARANGOSH_OUTPUT{ensureUniquePersistentSingle}
    ~ db._create("products");
    ~ db.products.save([ { name: "", price: 25 }, { name: "", price: 7.99 } ])
      var trx = db._createTransaction({ collections: { write: ["products"] } });
      trx.query(`FOR p IN products SORT p.price LIMIT 1 RETURN p`);
    ~ db._drop("products");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock ensureUniquePersistentSingle
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}


### Commit

### Abort

### Collection

### Query


### ID

### Running

### Status

abort()
collection() -> count(), document(), exists(), insert(), name(), remove(), replace(), save(), truncate(), update()
commit()
id()
query()
running() -> bool
status() -> id, status



Note that a client **always needs to start the transaction first** and it is required to
explicitly specify the collections used for write accesses. The client is responsible
for making sure that the transaction is committed or aborted when it is no longer needed.
This avoids taking up resources on the ArangoDB server.

{% hint 'warning' %}
Transactions will acquire collection locks for write operations in RocksDB.
It is therefore advisable to keep the transactions as short as possible.
{% endhint %}

For a more detailed description of how transactions work in ArangoDB please
refer to [Transactions](../transactions.html).

Also see [Limitations](#limitations).

Limitations
-----------

### Timeout and transaction size

A maximum lifetime and transaction size for Stream Transactions is enforced
on the Coordinator to ensure that abandoned transactions cannot block the
cluster from operating properly:

- Maximum idle timeout of up to **120 seconds** between operations
- Maximum transaction size of **128 MB** per DB-Server

These limits are also enforced for Stream Transactions on single servers.

The default maximum idle timeout is **60 seconds** between operations in a
single Stream Transaction. The maximum value can be bumped up to at most 120
seconds by setting the startup option `--transaction.streaming-idle-timeout`.
Posting an operation into a non-expired Stream Transaction will reset the
transaction's timeout to the configured idle timeout.

Enforcing the limit is useful to free up resources used by abandoned
transactions, for example from transactions that are abandoned by client
applications due to programming errors or that were left over because client
connections were interrupted.

### Concurrent requests

A given transaction is intended to be used **serially**. No concurrent requests
using the same transaction ID should be issued by the client. The server can
make some effort to serialize certain operations (see
[Streaming Lock Timeout](../programs-arangod-transaction.html#streaming-lock-timeout)),
however this will degrade the server's performance and may lead to sporadic
errors with code `28` (locked).

### Batch requests

The [Batch API](batch-request.html) cannot be used in combination with
Stream Transactions for submitting batched requests, because the required
header `x-arango-trx-id` is not forwarded.
