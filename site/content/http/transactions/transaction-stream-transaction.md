---
fileID: transaction-stream-transaction
title: HTTP Interface for Stream Transactions
weight: 2145
description: 
layout: default
---
For an introduction to this transaction type, see
[Stream Transactions](../../transactions/transactions-stream-transactions).

To use a Stream Transaction, a client first sends the [configuration](#begin-a-transaction)
of the transaction to the ArangoDB server.

{{% hints/info %}}
Contrary to [**JavaScript Transactions**](transaction-js-transaction),
the definition of Stream Transaction must only contain the collections that are
going to be used and (optionally) the various transaction options supported by
ArangoDB. No `action` attribute is supported.
{{% /hints/info %}}

The Stream Transaction API works in *conjunction* with other APIs in ArangoDB.
To use the transaction for a supported operation a client needs to specify
the transaction identifier in the `x-arango-trx-id` HTTP header on each request.
This will automatically cause these operations to use the specified transaction.

Supported transactional API operations include:

1. All operations in the [Document API](../documents/document-working-with-documents)
2. Number of documents via the [Collection API](../collections/collection-getting#return-number-of-documents-in-a-collection)
3. Truncate a collection via the [Collection API](../collections/collection-creating#truncate-collection)
4. Create an AQL cursor via the [Cursor API](../aql-query-cursors/aql-query-cursor-accessing-cursors)
5. Handle [vertices](../graphs/gharial-vertices) and [edges](../graphs/gharial-edges)
   of managed graphs (_General Graph_ / _Gharial_ API)

## Begin a Transaction

<!-- RestTransactionHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/transaction/begin:
    post:
      description: |2+
        The transaction description must be passed in the body of the POST request.
        If the transaction can be started on the server, *HTTP 201* will be returned.
        For successfully started transactions, the returned JSON object has the
        following properties:
        - *error*: boolean flag to indicate if an error occurred (*false*
          in this case)
        - *code*: the HTTP status code
        - *result*: result containing
            - *id*: the identifier of the transaction
            - *status*: containing the string 'running'
        If the transaction specification is either missing or malformed, the server
        will respond with *HTTP 400* or *HTTP 404*.
        The body of the response will then contain a JSON object with additional error
        details. The object has the following attributes:
        - *error*: boolean flag to indicate that an error occurred (*true* in this case)
        - *code*: the HTTP status code
        - *errorNum*: the server error number
        - *errorMessage*: a descriptive error message
      operationId: ' executeBegin'
      parameters:
      - name: x-arango-allow-dirty-read
        schema:
          type: boolean
        required: false
        description: |+
          Set this header to `true` to allow the Coordinator to ask any shard replica for
          the data, not only the shard leader. This may result in "dirty reads".
          This header decides about dirty reads for the entire transaction. Individual
          read operations, that are performed as part of the transaction, cannot override it.
        in: header
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                collections:
                  type: string
                  description: |+
                    *collections* must be a JSON object that can have one or all sub-attributes
                    *read*, *write* or *exclusive*, each being an array of collection names or a
                    single collection name as string. Collections that will be written to in the
                    transaction must be declared with the *write* or *exclusive* attribute or it
                    will fail, whereas non-declared collections from which is solely read will be
                    added lazily.
                waitForSync:
                  type: boolean
                  description: |+
                    an optional boolean flag that, if set, will force the
                    transaction to write all data to disk before returning.
                allowImplicit:
                  type: boolean
                  description: "Allow reading from undeclared collections. \n\n"
                lockTimeout:
                  type: integer
                  format: int64
                  description: |+
                    an optional numeric value that can be used to set a
                    timeout in seconds for waiting on collection locks. This option is only
                    meaningful when using exclusive locks. If not specified, a default
                    value will be used. Setting *lockTimeout* to *0* will make ArangoDB
                    not time out waiting for a lock.
                maxTransactionSize:
                  type: integer
                  format: int64
                  description: |+
                    Transaction size limit in bytes.
              required:
              - collections
      responses:
        '201':
          description: |2
            If the transaction is running on the server,
            *HTTP 201* will be returned.
        '400':
          description: |2
            If the transaction specification is either missing or malformed, the server
            will respond with *HTTP 400*.
        '404':
          description: |2
            If the transaction specification contains an unknown collection, the server
            will respond with *HTTP 404*.
      tags:
      - Transactions
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestTransactionBeginSingle
release: stable
version: '3.10'
---
    const cn = "products";
    db._drop(cn);
    db._create(cn);
    let url = "/_api/transaction/begin";
    let body = {
      collections: {
        write : cn
      },
    };
    let response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
    url = "/_api/transaction/" + JSON.parse(response.body).result.id;
    db._connection.DELETE(url);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestTransactionBeginNonExisting
release: stable
version: '3.10'
---
    const cn = "products";
    db._drop(cn);
    let url = "/_api/transaction/begin";
    let body = {
      collections: {
        read : "products"
      }
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 404);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


## Check Status of a Transaction

```http-spec
openapi: 3.0.2
paths:
  /_api/transaction/{transaction-id}:
    get:
      description: |2+
        The result is an object describing the status of the transaction.
        It has at least the following attributes:
        - *id*: the identifier of the transaction
        - *status*: the status of the transaction. One of "running", "committed" or "aborted".
      operationId: ' executeGetState:transaction'
      parameters:
      - name: transaction-id
        schema:
          type: string
        required: true
        description: |+
          The transaction identifier.
        in: path
      responses:
        '200':
          description: |2
            If the transaction is fully executed and committed on the server,
            *HTTP 200* will be returned.
        '400':
          description: |2
            If the transaction identifier specified is either missing or malformed, the server
            will respond with *HTTP 400*.
        '404':
          description: |2
            If the transaction was not found with the specified identifier, the server
            will respond with *HTTP 404*.
      tags:
      - Transactions
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestTransactionGet
release: stable
version: '3.10'
---
    db._drop("products");
    db._create("products");
    let body = {
      collections: {
        read : "products"
      }
    };
    let trx = db._createTransaction(body);
    let url = "/_api/transaction/" + trx.id();
    let response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
  ~ trx.abort();
  ~ db._drop("products");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


## Commit or Abort a Transaction

Committing or aborting a running transaction must be done by the client.
It is *bad practice* to not commit or abort a transaction once you are done
using it. It will force the server to keep resources and collection locks 
until the entire transaction times out.

<!-- RestTransactionHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/transaction/{transaction-id}:
    put:
      description: |2+
        Commit a running server-side transaction. Committing is an idempotent operation.
        It is not an error to commit a transaction more than once.
        If the transaction can be committed, *HTTP 200* will be returned.
        The returned JSON object has the following properties:
        - *error*: boolean flag to indicate if an error occurred (*false*
          in this case)
        - *code*: the HTTP status code
        - *result*: result containing
            - *id*: the identifier of the transaction
            - *status*: containing the string 'committed'
        If the transaction cannot be found, committing is not allowed or the
        transaction was aborted, the server
        will respond with *HTTP 400*, *HTTP 404* or *HTTP 409*.
        The body of the response will then contain a JSON object with additional error
        details. The object has the following attributes:
        - *error*: boolean flag to indicate that an error occurred (*true* in this case)
        - *code*: the HTTP status code
        - *errorNum*: the server error number
        - *errorMessage*: a descriptive error message
      operationId: ' executeCommit:Transaction'
      parameters:
      - name: transaction-id
        schema:
          type: string
        required: true
        description: |+
          The transaction identifier,
        in: path
      responses:
        '200':
          description: |2
            If the transaction was committed,
            *HTTP 200* will be returned.
        '400':
          description: |2
            If the transaction cannot be committed, the server
            will respond with *HTTP 400*.
        '404':
          description: |2
            If the transaction was not found, the server
            will respond with *HTTP 404*.
        '409':
          description: |2
            If the transaction was already aborted, the server
            will respond with *HTTP 409*.
      tags:
      - Transactions
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestTransactionBeginAbort
release: stable
version: '3.10'
---
    const cn = "products";
    db._drop(cn);
    db._create(cn);
    let body = {
      collections: {
        read : cn
      }
    };
    let trx = db._createTransaction(body);
    let url = "/_api/transaction/" + trx.id();
    var response = logCurlRequest('PUT', url, "");
    assert(response.code === 200);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- RestTransactionHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/transaction/{transaction-id}:
    delete:
      description: |2+
        Abort a running server-side transaction. Aborting is an idempotent operation.
        It is not an error to abort a transaction more than once.
        If the transaction can be aborted, *HTTP 200* will be returned.
        The returned JSON object has the following properties:
        - *error*: boolean flag to indicate if an error occurred (*false*
          in this case)
        - *code*: the HTTP status code
        - *result*: result containing
            - *id*: the identifier of the transaction
            - *status*: containing the string 'aborted'
        If the transaction cannot be found, aborting is not allowed or the
        transaction was already committed, the server
        will respond with *HTTP 400*, *HTTP 404* or *HTTP 409*.
        The body of the response will then contain a JSON object with additional error
        details. The object has the following attributes:
        - *error*: boolean flag to indicate that an error occurred (*true* in this case)
        - *code*: the HTTP status code
        - *errorNum*: the server error number
        - *errorMessage*: a descriptive error message
      operationId: ' executeAbort:transaction'
      parameters:
      - name: transaction-id
        schema:
          type: string
        required: true
        description: |+
          The transaction identifier,
        in: path
      responses:
        '200':
          description: |2
            If the transaction was aborted,
            *HTTP 200* will be returned.
        '400':
          description: |2
            If the transaction cannot be aborted, the server
            will respond with *HTTP 400*.
        '404':
          description: |2
            If the transaction was not found, the server
            will respond with *HTTP 404*.
        '409':
          description: |2
            If the transaction was already committed, the server
            will respond with *HTTP 409*.
      tags:
      - Transactions
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestTransactionBeginCommit
release: stable
version: '3.10'
---
    const cn = "products";
    db._drop(cn);
    db._create(cn);
    let body = {
      collections: {
        read : cn
      }
    };
    let trx = db._createTransaction(body);
    let url = "/_api/transaction/" + trx.id();
    var response = logCurlRequest('DELETE', url);
    assert(response.code === 200);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


## List currently ongoing Transactions

```http-spec
openapi: 3.0.2
paths:
  /_api/transaction:
    get:
      description: |2+
        The result is an object with the attribute *transactions*, which contains
        an array of transactions.
        In a cluster the array will contain the transactions from all Coordinators.
        Each array entry contains an object with the following attributes:
        - *id*: the transaction's id
        - *state*: the transaction's status
      operationId: ' executeGetState:transactions'
      responses:
        '200':
          description: |2
            If the list of transactions can be retrieved successfully, *HTTP 200* will be returned.
      tags:
      - Transactions
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestTransactionsGet
release: stable
version: '3.10'
---
    db._drop("products");
    db._create("products");
    let body = {
      collections: {
        read : "products"
      }
    };
    let trx = db._createTransaction(body);
    let url = "/_api/transaction";
    let response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
  ~ trx.abort();
  ~ db._drop("products");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

