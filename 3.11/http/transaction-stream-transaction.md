---
layout: default
description: >-
  Stream Transactions allow you to perform a multi-document transaction with
  individual begin and commit/abort commands
---
# HTTP interface for Stream Transactions

{{ page.description }}
{:class="lead"}

For an introduction to this transaction type, see
[Stream Transactions](../transactions-stream-transactions.html).

To use a Stream Transaction, a client first sends the [configuration](#begin-transaction)
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

- All operations in the [Document API](document.html)
- Number of documents via the [Collection API](collection.html#return-number-of-documents-in-a-collection)
- Truncate a collection via the [Collection API](collection.html#truncate-collection)
- Create an AQL cursor via the [Cursor API](aql-query.html#create-cursor)
- Handle [vertices](gharial.html#vertices) and [edges](gharial.html#edges)
  of managed graphs (_General Graph_ / _Gharial_ API)

{% docublock post_api_transaction_begin, h2 %}
{% docublock get_api_transaction_transaction, h2 %}
{% docublock put_api_transaction_transaction, h2 %}
{% docublock delete_api_transaction_transaction, h2 %}
{% docublock get_api_transaction, h2 %}
