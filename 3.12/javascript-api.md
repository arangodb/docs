---
layout: default
description: >-
  You can use ArangoDB's JavaScript interface on the server-side as well as in
  ArangoDB's shell to interact with the server using the JavaScript language
redirect_from:
  - appendix-references.html # 3.11 -> 3.11
  - appendix-java-script-modules.html # 3.11 -> 3.11
---
# JavaScript API

{{ page.description }}
{:class="lead"}

The JavaScript API is available on the server-side in the following contexts:

- [Foxx microservices](foxx.html)
- [User-defined AQL functions](aql/extending.html)
- [JavaScript Transactions](transactions-javascript-transactions.html)
- [Emergency console](troubleshooting-emergency-console.html) (`arangod --console`)

Running on the server-side means that the code runs directly inside of the
_arangod_ process, bypassing the HTTP API. In cluster deployments, the code
is executed on a Coordinator.

The JavaScript API is also available in the ArangoDB Shell client tool:

- [arangosh](programs-arangosh.html)

It communicates with the server via the HTTP API.
<!-- TODO (DOC-139): There are some differences to the server-side API. -->

{% hint 'tip' %}
The JavaScript API cannot be used in browsers, Node.js, or other JavaScript
environments. You can use the [arangojs driver](drivers/js.html) instead.
Note that it has a different interface.
{% endhint %}

## Usage example

The key element for using the JavaScript API is the
[`db` object](appendix-references-dbobject.html), which is available by default
in _arangosh_ and can be imported in server-side JavaScript code from the
`@arangodb` module.

```js
// Import the db object (only in server-side contexts)
let db = require("@arangodb").db;
```

The `db` object lets you access and manage databases, for example:

```js
// Create a new database
db._createDatabase("myDB");

// Make it the current database
db._useDatabase("myDB");
print(`Database context: ${ db._name() }`);
```

You can also work with collections and Views using the `db` object.
Accessing a collection returns a [_collection_ object](appendix-references-collection-object.html)
and accessing a View returns a [_view_ object](appendix-references-view-object.html).

```js
// Create a new collection. Returns a collection object
let coll = db._create("collection");

// Create a new arangosearch View. Returns a view object
let view = db._createView("view", "arangosearch", { links: { collection: { includeAllFields: true } } });
```

To obtain a reference to a collection or View again, you can use multiple ways:

```js
let coll = db.collection;
let view = db.view;
// or
let coll = db._collection("collection");
let coll = db._view("view");
```

You can create documents via a _collection_ object. You can use arbitrary
JavaScript code to generate data.

```js
// Create single documents using both available methods.
// Returns an object with the document metadata (the _id, _key, and _rev attributes)
coll.save({ value: "foo" });
coll.insert({ value: "bar" });

// Create an array of objects and create multiple documents at once
let arr = [];
for (let i = 1; i < 100; i++) {
  arr.push({ value: i });
}
coll.save(arr);
```

Indexes can also be created via a _collection_ object.

```js
// Create an index for the collection
coll.ensureIndex({ type: "persistent", fields: ["value"] });
```

To query the data in the current database, use the `db` object. Executing an
AQL query returns a [_cursor_ object](appendix-references-cursor-object.html).

```js
// Run an AQL query. Returns a cursor object
let cursor = db._query(`FOR doc IN collection FILTER doc.value >= "bar" RETURN doc`);
cursor.toArray();

// Import the aql query helper (only in server-side contexts)
const aql = require("@arangodb").aql;

// Run an AQL query using the query helper to use variables as bind parameters
let limit = 5;
db._query(aql`FOR doc IN ${ coll } LIMIT ${ limit } RETURN doc`).toArray();
```

See the full reference documentation for the common objects returned by the
[`@arangodb` module](appendix-java-script-modules-arango-db.html) for details:
- [`db` object](appendix-references-dbobject.html)
- [_collection_ object](appendix-references-collection-object.html)
- [_view_ object](appendix-references-view-object.html)
- [_cursor_ object](appendix-references-cursor-object.html)

## JavaScript Modules

ArangoDB uses a Node.js-compatible module system. You can use the function
`require()` in order to load a module or library. It returns the exported
variables and functions of the module.

The following global variables are available in _arangosh_ and all server-side
JavaScript contexts in ArangoDB:

- `global`
- `process`
- `console`
- `Buffer`
- `__filename`
- `__dirname`

### ArangoDB-specific modules

There is a large number of ArangoDB-specific modules using the `@arangodb`
namespace. Some of these modules are for internal use by ArangoDB itself.
You can use the following modules as an end-user:

- [**@arangodb**](appendix-java-script-modules-arango-db.html)
  provides direct access to the database and its collections.

- [**@arangodb/analyzers**](appendix-java-script-modules-analyzers.html)
  provides an interface to manage ArangoSearch Analyzers.

- AQL related modules:

  - [**@arangodb/aql/queries**](appendix-java-script-modules-queries.html)
    offers methods to track and kill AQL queries.

  - [**@arangodb/aql/cache**](aql/execution-and-performance-query-cache.html)
    allows to control the AQL query caching feature.

  - [**@arangodb/aql/explainer**](aql/execution-and-performance-explaining-queries.html)
    provides methods to debug, explain and profile AQL queries.

  - [**@arangodb/aql/functions**](aql/extending-functions.html)
    provides an interface to (un-)register user-defined AQL functions.

- [**@arangodb/crypto**](appendix-java-script-modules-crypto.html)
  provides various cryptography functions including hashing algorithms.

- [**@arangodb/foxx**](foxx.html)
  is the namespace providing the various building blocks of the Foxx
  microservice framework.

  - [**@arangodb/locals**](foxx-reference-modules.html#the-arangodblocals-module)
    is a helper module to use Foxx together with Webpack.

- Graph related modules:

  - [**@arangodb/general-graph**](graphs-general-graphs.html)
    implements a graph management interface for named graphs.

  - [**@arangodb/smart-graph**](graphs-smart-graphs-management.html)
    provides management features for SmartGraphs

  - [**@arangodb/graph-examples/example-graph**](graphs.html#example-graphs)
    can load example graphs (creates collections, populates them with documents
    and creates named graphs)

- [**@arangodb/request**](appendix-java-script-modules-request.html)
  provides the functionality for making synchronous HTTP/HTTPS requests.

- [**@arangodb/tasks**](appendix-java-script-modules-tasks.html)
  implements task management methods

- [**@arangodb/users**](administration-managing-users-in-arangosh.html)
  provides an interface for user management.

- [**@arangodb/pregel**](graphs-pregel.html#javascript-api)
  provides an interface for Pregel management.

### Node-compatibility modules

ArangoDB supports a number of modules for compatibility with Node.js, including:

- [**assert**](http://nodejs.org/api/assert.html){:target="_blank"}
  implements basic assertion and testing functions.

- [**buffer**](http://nodejs.org/api/buffer.html){:target="_blank"}
  implements a binary data type for JavaScript.

- [**console**](appendix-java-script-modules-console.html)
  is a well known logging facility to all the JavaScript developers.
  ArangoDB implements most of the [Console API](http://wiki.commonjs.org/wiki/Console){:target="_blank"},
  with the exceptions of *profile* and *count*.

- [**events**](http://nodejs.org/api/events.html){:target="_blank"}
  implements an event emitter.

- [**fs**](appendix-java-script-modules-file-system.html)
  provides a file system API for the manipulation of paths, directories, files,
  links, and the construction of file streams. ArangoDB implements most
  [Filesystem/A](http://wiki.commonjs.org/wiki/Filesystem/A){:target="_blank"}
  functions.

- [**module**](http://nodejs.org/api/modules.html){:target="_blank"}
  provides direct access to the module system.

- [**path**](http://nodejs.org/api/path.html){:target="_blank"}
  implements functions dealing with filenames and paths.

- [**punycode**](http://nodejs.org/api/punycode.html){:target="_blank"}
  implements conversion functions for
  [**punycode**](http://en.wikipedia.org/wiki/Punycode){:target="_blank"} encoding.

- [**querystring**](http://nodejs.org/api/querystring.html){:target="_blank"}
  provides utilities for dealing with query strings.

- [**stream**](http://nodejs.org/api/stream.html){:target="_blank"}
  provides a streaming interface.

- [**string_decoder**](https://nodejs.org/api/string_decoder.html){:target="_blank"}
  implements logic for decoding buffers into strings.

- [**url**](http://nodejs.org/api/url.html){:target="_blank"}
  provides utilities for URL resolution and parsing.

- [**util**](http://nodejs.org/api/util.html){:target="_blank"}
  provides general utility functions like `format` and `inspect`.

Additionally ArangoDB provides partial implementations for the following modules:

- `net`:
  only `isIP`, `isIPv4` and `isIPv6`.

- `process`:
  only `env` and `cwd`;
  stubs for `argv`, `stdout.isTTY`, `stdout.write`, `nextTick`.

- `timers`:
  stubs for `setImmediate`, `setTimeout`, `setInterval`, `clearImmediate`,
  `clearTimeout`, `clearInterval` and `ref`.

- `tty`:
  only `isatty` (always returns `false`).

- `vm`:
  only `runInThisContext`.

The following Node.js modules are not available at all:

- `child_process`
- `cluster`
- `constants`
- `crypto` (but see `@arangodb/crypto` below)
- `dgram`
- `dns`
- `domain`
- `http` (but see `@arangodb/request` below)
- `https`
- `os`
- `sys`
- `tls`
- `v8`
- `zlib`
