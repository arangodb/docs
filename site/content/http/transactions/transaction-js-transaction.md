---
fileID: transaction-js-transaction
title: HTTP Interface for JavaScript Transactions
weight: 2150
description: 
layout: default
---
ArangoDB's JavaScript Transactions are executed on the server. Transactions can be 
initiated by clients by sending the transaction description for execution to
the server.

JavaScript Transactions in ArangoDB do not offer separate *BEGIN*, *COMMIT* and *ROLLBACK*
operations. Instead, JavaScript Transactions are described by a JavaScript function, 
and the code inside the JavaScript function will then be executed transactionally.

At the end of the function, the transaction is automatically committed, and all
changes done by the transaction will be persisted. If an exception is thrown
during transaction execution, all operations performed in the transaction are
rolled back.

For a more detailed description of how transactions work in ArangoDB please
refer to [Transactions](../../transactions/). 

<!-- RestTransactionHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/transaction:
    post:
      description: |2+
        The transaction description must be passed in the body of the POST request.
        If the transaction is fully executed and committed on the server,
        *HTTP 200* will be returned. Additionally, the return value of the
        code defined in *action* will be returned in the *result* attribute.
        For successfully committed transactions, the returned JSON object has the
        following properties:
        - *error*: boolean flag to indicate if an error occurred (*false*
          in this case)
        - *code*: the HTTP status code
        - *result*: the return value of the transaction
        If the transaction specification is either missing or malformed, the server
        will respond with *HTTP 400*.
        The body of the response will then contain a JSON object with additional error
        details. The object has the following attributes:
        - *error*: boolean flag to indicate that an error occurred (*true* in this case)
        - *code*: the HTTP status code
        - *errorNum*: the server error number
        - *errorMessage*: a descriptive error message
        If a transaction fails to commit, either by an exception thrown in the
        *action* code, or by an internal error, the server will respond with
        an error.
        Any other errors will be returned with any of the return codes
        *HTTP 400*, *HTTP 409*, or *HTTP 500*.
      operationId: ' executeCommit'
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
                    added lazily. The optional sub-attribute *allowImplicit* can be set to *false*
                    to let transactions fail in case of undeclared collections for reading.
                    Collections for reading should be fully declared if possible, to avoid
                    deadlocks.
                action:
                  type: string
                  description: |+
                    the actual transaction operations to be executed, in the
                    form of stringified JavaScript code. The code will be executed on server
                    side, with late binding. It is thus critical that the code specified in
                    *action* properly sets up all the variables it needs.
                    If the code specified in *action* ends with a return statement, the
                    value returned will also be returned by the REST API in the *result*
                    attribute if the transaction committed successfully.
                waitForSync:
                  type: boolean
                  description: |+
                    an optional boolean flag that, if set, will force the
                    transaction to write all data to disk before returning.
                allowImplicit:
                  type: boolean
                  description: |+
                    Allow reading from undeclared collections.
                lockTimeout:
                  type: integer
                  format: int64
                  description: |+
                    an optional numeric value that can be used to set a
                    timeout in seconds for waiting on collection locks. This option is only
                    meaningful when using exclusive locks. If not specified, a default value of
                    900 seconds will be used. Setting *lockTimeout* to *0* will make ArangoDB
                    not time out waiting for a lock.
                params:
                  type: string
                  description: |+
                    optional arguments passed to *action*.
                maxTransactionSize:
                  type: integer
                  format: int64
                  description: |+
                    Transaction size limit in bytes.
              required:
              - collections
              - action
      responses:
        '200':
          description: |2
            If the transaction is fully executed and committed on the server,
            *HTTP 200* will be returned.
        '400':
          description: |2
            If the transaction specification is either missing or malformed, the server
            will respond with *HTTP 400*.
        '404':
          description: |2
            If the transaction specification contains an unknown collection, the server
            will respond with *HTTP 404*.
        '500':
          description: |2
            Exceptions thrown by users will make the server respond with a return code of
            *HTTP 500*
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
name: RestTransactionSingle
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var products = db._create(cn);
    var url = "/_api/transaction";
    var body = {
      collections: {
        write : "products"
      },
      action: "function () { var db = require('@arangodb').db; db.products.save({});  return db.products.count(); }"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
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
name: RestTransactionMulti
release: stable
version: '3.10'
---
    var cn1 = "materials";
    db._drop(cn1);
    var materials = db._create(cn1);
    var cn2 = "products";
    db._drop(cn2);
    var products = db._create(cn2);
    products.save({ "a": 1});
    materials.save({ "b": 1});
    var url = "/_api/transaction";
    var body = {
      collections: {
        write : [ "products", "materials" ]
      },
      action: (
        "function () {" +
        "var db = require('@arangodb').db;" +
        "db.products.save({});" +
        "db.materials.save({});" +
        "return 'worked!';" +
        "}"
      )
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop(cn1);
    db._drop(cn2);
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
name: RestTransactionAbortInternal
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var products = db._create(cn);
    var url = "/_api/transaction";
    var body = {
      collections: {
        write : "products"
      },
      action : (
        "function () {" +
        "var db = require('@arangodb').db;" +
        "db.products.save({ _key: 'abc'});" +
        "db.products.save({ _key: 'abc'});" +
        "}"
      )
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 409);
    logJsonResponse(response);
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
name: RestTransactionAbort
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var products = db._create(cn, { waitForSync: true });
    products.save({ "a": 1 });
    var url = "/_api/transaction";
    var body = {
      collections: {
        read : "products"
      },
      action : "function () { throw 'doh!'; }"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 500);
    logJsonResponse(response);
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
name: RestTransactionNonExisting
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var url = "/_api/transaction";
    var body = {
      collections: {
        read : "products"
      },
      action : "function () { return true; }"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 404);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

