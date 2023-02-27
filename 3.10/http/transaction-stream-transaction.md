---
layout: default
description: Stream Transactions allow you to perform a multi-document transaction with individual begin and commit / abort commands
---
HTTP Interface for Stream Transactions
======================================

For an introduction to this transaction type, see
[Stream Transactions](../transactions-stream-transactions.html).

To use a Stream Transaction, a client first sends the [configuration](#begin-a-transaction)
of the transaction to the ArangoDB server.

{% hint 'info' %}
Contrary to [**JavaScript Transactions**](transaction-js-transaction.html),
the definition of Stream Transaction must only contain the collections that are
going to be used and (optionally) the various transaction options supported by
ArangoDB. No `action` attribute is supported.
{% endhint %}

The Stream Transaction API works in *conjunction* with other APIs in ArangoDB.
To use the transaction for a supported operation a client needs to specify
the transaction identifier in the `x-arango-trx-id` HTTP header on each request.
This will automatically cause these operations to use the specified transaction.

Supported transactional API operations include:

- All operations in the [Document API](document.html#document-api)
- Number of documents via the [Collection API](collection.html#return-number-of-documents-in-a-collection)
- Truncate a collection via the [Collection API](collection.html#truncate-collection)
- Create an AQL cursor via the [Cursor API](aql-query-cursor-accessing-cursors.html)
- Handle [vertices](gharial-vertices.html) and [edges](gharial-edges.html)
  of managed graphs (_General Graph_ / _Gharial_ API)

Begin a Transaction
-------------------

{% docublock post_api_transaction_begin %}

Check Status of a Transaction
-----------------------------

{% docublock get_api_transaction %}

Commit or Abort a Transaction
-----------------------------

Committing or aborting a running transaction must be done by the client.
It is bad practice to not commit or abort a transaction once you are done
using it. It will force the server to keep resources and collection locks 
until the entire transaction times out.

{% docublock put_api_transaction %}

{% docublock delete_api_transaction %}

List currently ongoing Transactions
-----------------------------------

{% docublock get_api_transactions %}
