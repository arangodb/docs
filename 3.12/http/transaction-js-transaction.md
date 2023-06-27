---
layout: default
description: >-
  The HTTP API for JavaScript Transactions lets you run a transaction that
  leverages ArangoDB's JavaScript API by submitting a single HTTP request
---
# HTTP interface for JavaScript Transactions

{{ page.description }}
{:class="lead"}

JavaScript Transactions are executed on the server. Transactions can be 
initiated by clients by sending the transaction description for execution to
the server.

JavaScript Transactions in ArangoDB do not offer separate *BEGIN*, *COMMIT* and *ROLLBACK*
operations. Instead, JavaScript Transactions are described by a JavaScript function, 
and the code inside the JavaScript function is then be executed transactionally.

At the end of the function, the transaction is automatically committed, and all
changes done by the transaction are persisted. If an exception is thrown
during transaction execution, all operations performed in the transaction are
rolled back.

For a more detailed description of how transactions work in ArangoDB please
refer to [Transactions](../transactions.html). 

{% docublock post_api_transaction, h2 %}
