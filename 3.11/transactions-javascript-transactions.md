---
layout: default
description: >-
  JavaScript Transactions allow you to submit single-request transactions
  that leverage ArangoDB's JavaScript API to run complex operations that can
  read and modify multiple documents from multiple collections
redirect_from:
  - transactions-transaction-invocation.html # 3.9 -> 3.10
  - transactions-passing.html # 3.9 -> 3.10
---
# JavaScript Transactions

{{ page.description }}
{:class="lead"}

JavaScript transactions are different from transactions in SQL.

In SQL, transactions are started with explicit *BEGIN* or *START TRANSACTION*
command. Following any series of data retrieval or modification operations, an
SQL transaction is finished with a *COMMIT* command, or rolled back with a
*ROLLBACK* command. There may be client/server communication between the start
and the commit/rollback of an SQL transaction.

In ArangoDB, a transaction is always a server-side operation, and is executed
on the server in one go, without any client interaction. All operations to be
executed inside a transaction need to be known by the server when the transaction
is started.

There are no individual *BEGIN*, *COMMIT* or *ROLLBACK* transaction commands
in ArangoDB. Instead, a transaction in ArangoDB is started by providing a
description of the transaction to the `db._executeTransaction()` JavaScript
function:

```js
db._executeTransaction(options);
```

This function automatically starts a transaction, executes all required
data retrieval and/or modification operations, and automatically
commit the transaction at the end. If an error occurs during transaction execution, the
transaction is automatically aborted, and all changes are rolled back.

## JavaScript API

### Execute Transaction

`db._executeTransaction(options)`

Executes a server-side JavaScript transaction.

`options` must be an object and have the following attributes:

- `collections`: A sub-object that defines which collections you want to use
  in the transaction. It can have the following sub-attributes:
  - `read`: A single collection or a list of collections to use in the
    transaction in read-only mode.
  - `write`: A single collection or a list of collections to use in the
    transaction in write or read mode.
  - `exclusive`: A single collection or a list of collections to acquire
    exclusive write access for.
- `action`: A JavaScript function or a string with JavaScript code
  containing all the instructions to be executed inside the transaction.
  If the code runs through successfully, the transaction is committed
  at the end. If the code throws an exception, the transaction is
  aborted and all database operations are be rolled back.

Additionally, `options` can have the following optional attributes:

- `params`: Optional arguments passed to the function specified in `action`.
- `allowImplicit`: Allow reading from undeclared collections.
- `waitForSync`: An optional boolean flag that, if set, forces the
  transaction to write all data to disk before returning.
- `lockTimeout`: A numeric value that can be used to set a timeout in seconds for
  waiting on collection locks. This option is only meaningful when using
  `exclusive` locks. If not specified, a default value of 900 seconds is used.
  Setting `lockTimeout` to `0`  makes ArangoDB not time out waiting for a lock.
- `maxTransactionSize`: Transaction size limit in bytes.

### Declaration of Collections

All collections participating in a transaction need to be declared
beforehand. This is necessary to ensure proper locking and isolation.

Collections can be used in a transaction in write mode or in read-only mode.
<!-- TODO: exclusive -->

If any data modification operations are to be executed, the collection must be
declared for use in write mode. The write mode allows modifying and reading data
from the collection during the transaction (i.e. the write mode includes the
read mode).

Contrary, using a collection in read-only mode will only allow performing
read operations on a collection. Any attempt to write into a collection used
in read-only mode will make the transaction fail.

Collections for a transaction are declared by providing them in the `collections`
attribute of the object passed to the `_executeTransaction()` function. The
`collections` attribute can have the sub-attributes `read`, `write`, and
`exclusive`:

```js
db._executeTransaction({
  collections: {
    write: [ "users", "logins" ],
    read: [ "recommendations" ]
  }
});
```

`read`, `write`, and `exclusive` are optional attributes, and only need to be
specified if the operations inside the transactions demand for it.

The attribute values can each be lists of collection names or a single
collection name (as a string):

```js
db._executeTransaction({
  collections: {
    write: "users",
    read: "recommendations"
  }
});
```

**Note**: It is optional to specify collections for read-only access by default.
Even without specifying them, it is still possible to read from such collections
from within a transaction, but with relaxed isolation. Please refer to
[Transactions Locking](transactions-locking-and-isolation.html) for more details.

In order to make a transaction fail when a non-declared collection is used inside
for reading, the optional `allowImplicit` sub-attribute of `collections` can be
set to `false`:

```js
db._executeTransaction({
  collections: {
    read: "recommendations",
    allowImplicit: false  /* this disallows read access to other collections
                             than specified */
  },
  action: function () {
    var db = require("@arangodb").db;
    return db.foobar.toArray(); /* will fail because db.foobar must not be accessed
                                   for reading inside this transaction */
  }
});
```

The default value for `allowImplicit` is `true`. Write-accessing collections that
have not been declared in the `collections` array is never possible, regardless of
the value of `allowImplicit`.

### Declaration of Data Modification and Retrieval Operations

All data modification and retrieval operations that are to be executed inside
the transaction need to be specified in a JavaScript function, using the `action`
attribute:

```js
db._executeTransaction({
  collections: {
    write: "users"
  },
  action: function () {
    // all operations go here
  }
});
```

Any valid JavaScript code is allowed inside `action` but the code may only
access the collections declared in `collections`.
`action` may be a JavaScript function as shown above, or a string representation
of a JavaScript function:

```js
db._executeTransaction({
  collections: {
    write: "users"
  },
  action: "function () { doSomething(); }"
});
```

Note that any operations specified in `action` will be executed on the
server, in a separate scope. Variables will be bound late. Accessing any JavaScript
variables defined on the client-side or in some other server context from inside
a transaction may not work.
Instead, any variables used inside `action` should be defined inside `action` itself:

```js
db._executeTransaction({
  collections: {
    write: "users"
  },
  action: function () {
    var db = require(...).db;
    db.users.save({ ... });
  }
});
```

When the code inside the `action` attribute is executed, the transaction is
already started and all required locks have been acquired. When the code inside
the `action` attribute finishes, the transaction will automatically commit.
There is no explicit commit command.

To make a transaction abort and roll back all changes, an exception needs to
be thrown and not caught inside the transaction:

```js
db._executeTransaction({
  collections: {
    write: "users"
  },
  action: function () {
    var db = require("@arangodb").db;
    db.users.save({ _key: "hello" });
    // will abort and roll back the transaction
    throw "doh!";
  }
});
```

There is no explicit abort or roll back command.

As mentioned earlier, a transaction commits automatically when the end of
the `action` function is reached and no exception were thrown. In this
case, the user can return any legal JavaScript value from the function:

```js
db._executeTransaction({
  collections: {
    write: "users"
  },
  action: function () {
    var db = require("@arangodb").db;
    db.users.save({ _key: "hello" });
    // will commit the transaction and return the value "hello"
    return "hello";
  }
});
```

### Passing parameters to transactions

Arbitrary parameters can be passed to transactions by setting the `params` 
attribute when declaring the transaction. This feature is handy to re-use the
same transaction code for multiple calls but with different parameters.

A basic example:

```js
db._executeTransaction({
  collections: { },
  action: function (params) {
    return params[1];
  },
  params: [ 1, 2, 3 ]
});
```

The above example will return `2`.

Some example that uses collections:

```js
db._executeTransaction({
  collections: { 
    write: "users",
    read: [ "c1", "c2" ]
  },
  action: function (params) {
    var db = require('@arangodb').db;
    var doc = db.c1.document(params['c1Key']);
    db.users.save(doc);
    doc = db.c2.document(params['c2Key']);
    db.users.save(doc);
  },
  params: { 
    c1Key: "foo", 
    c2Key: "bar" 
  }
});
```

### Throwing Exceptions

If you catch errors in your transaction, try to get them solved, but fail 
you may want to mimic original ArangoDB error messages to ease the control flow
of your invoking environment. This can be done like this:

```js
db._executeTransaction({
  collections: {},
  action: function () {
    const arangodb = require('@arangodb');
    var err = new arangodb.ArangoError();
    err.errorNum = arangodb.ERROR_BAD_PARAMETER;
    err.errorMessage = "who's bad?";
    throw err;
  }
});
```

For a complete list of possible ArangoDB errors, see
[Error codes and meanings](appendix-error-codes.html).

### Custom Exceptions

You may want to define custom exceptions inside of a transaction. To have the
exception propagate upwards properly, please throw an an instance of base
JavaScript `Error` class or a derivative. To specify an error number, include it
as the `errorNumber` field. As an example:

```js
db._executeTransaction({
  collections: {},
  action: function () {
    var err = new Error('My error context');
    err.errorNum = 1234;
    throw err;
  }
});
```

**Note**: In previous versions, custom exceptions which did not have an
`Error`-like form were simply converted to strings and exposed in the
`exception` field of the returned error. This is no longer the case, as it had
the potential to leak unwanted information if improperly used.

**Note**: In some versions the above example wouldn't propagate the `errorNum` to the 
invoking party, you may need to upgrade your ArangoDB.

### Examples

#### Single Collection Example

The first example writes 3 documents into a collection named `c1`.
The `c1` collection needs to be declared in the `write` attribute of the
`collections` attribute passed to the `_executeTransaction()` function.

The `action` attribute contains the actual transaction code to be executed.
This code contains all data modification operations (3 in this example).

```js
// setup
db._create("c1");

db._executeTransaction({
  collections: {
    write: [ "c1" ]
  },
  action: function () {
    var db = require("@arangodb").db;
    db.c1.save({ _key: "key1" });
    db.c1.save({ _key: "key2" });
    db.c1.save({ _key: "key3" });
  }
});
    db.c1.count(); // 3
```

Aborting the transaction by throwing an exception in the `action` function
will revert all changes, so as if the transaction never happened:

```js
// setup
db._create("c1");

db._executeTransaction({
  collections: {
    write: [ "c1" ]
  },
  action: function () {
    var db = require("@arangodb").db;
    db.c1.save({ _key: "key1" });
    db.c1.count(); // 1
    db.c1.save({ _key: "key2" });
    db.c1.count(); // 2
    throw "doh!";
  }
});

db.c1.count(); // 0
```

The automatic rollback is also executed when an internal exception is thrown
at some point during transaction execution:

```js
// setup
db._create("c1");

db._executeTransaction({
  collections: {
    write: [ "c1" ]
  },
  action: function () {
    var db = require("@arangodb").db;
    db.c1.save({ _key: "key1" });
    // will throw duplicate a key error, not explicitly requested by the user
    db.c1.save({ _key: "key1" });  
    // we'll never get here...
  }
});

db.c1.count(); // 0
```

As required by the *consistency* principle, aborting or rolling back a
transaction will also restore secondary indexes to the state at transaction
start.

#### Cross-collection Transactions

There's also the possibility to run a transaction across multiple collections.
In this case, multiple collections need to be declared in the `collections`
attribute, e.g.:

```js
// setup
db._create("c1");
db._create("c2");

db._executeTransaction({
  collections: {
    write: [ "c1", "c2" ]
  },
  action: function () {
    var db = require("@arangodb").db;
    db.c1.save({ _key: "key1" });
    db.c2.save({ _key: "key2" });
  }
});

db.c1.count(); // 1
db.c2.count(); // 1
```

Again, throwing an exception from inside the `action` function will make the
transaction abort and roll back all changes in all collections:

```js
// setup
db._create("c1");
db._create("c2");

db._executeTransaction({
  collections: {
    write: [ "c1", "c2" ]
  },
  action: function () {
    var db = require("@arangodb").db;
    for (var i = 0; i < 100; ++i) {
      db.c1.save({ _key: "key" + i });
      db.c2.save({ _key: "key" + i });
    }
    db.c1.count(); // 100
    db.c2.count(); // 100
    // abort
    throw "doh!"
  }
});

db.c1.count(); // 0
db.c2.count(); // 0
```

## HTTP API

See the [HTTP Interface for JavaScript Transactions](http/transaction-js-transaction.html)
documentation.
