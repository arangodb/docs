---
layout: default
description: You can write UDFs in JavaScript to extend AQL or to simplify queries
title: AQL User-Defined Functions
redirect_from:
  - extending-conventions.html # 3.11 -> 3.11
  - extending-functions.html # 3.11 -> 3.11
---
Extending AQL with user-defined functions
=================================

{{ page.description }}
{:class="lead"}

AQL comes with a [built-in set of functions](functions.html), but it is
not a fully-featured programming language. To add missing functionality or to
simplify queries, you may write your own user-defined functions (**UDFs**) in
JavaScript and make them available in AQL.

## Known Limitations

{% hint 'warning' %}
UDFs can have serious effects on the performance of your queries and the resource
usage in ArangoDB. Especially in cluster setups they should not be used against
much data, because this data will need to be sent over the network back and forth
between _DB-Servers_ and _Coordinators_, potentially adding a lot of latency.
This can be mitigated by very selective `FILTER`s before calls to UDFs.
{% endhint %}

Since the optimizer doesn't know anything about the nature of your function,
**the optimizer can't use indexes for UDFs**. So you should never lean on a UDF
as the primary criterion for a `FILTER` statement to reduce your query result set.
Instead, put a another `FILTER` statement in front of it. You should make sure
that this [**`FILTER` statement** is effective](execution-and-performance-optimizer.html)
to reduce the query result before passing it to your UDF.

Rule of thumb is, the closer the UDF is to your final `RETURN` statement
(or maybe even inside it), the better. 

When used in clusters, UDFs are always executed on a
[Coordinator](../architecture-deployment-modes-cluster-architecture.html).
It is not possible to execute UDFs on DB-Servers, as no JavaScript execution
engine is available on DB-Servers. Queries that would push UDF execution to
DB-Servers are aborted with a parse error. This includes using UDFs in traversal
`PRUNE` conditions, as well as `FILTER` conditions that can be moved into the
traversal execution on a DB-Server. These limitations also apply to the
single server deployment mode to keep the differences to cluster deployments minimal.

As UDFs are written in JavaScript, each query that executes a UDF will acquire
one V8 context to execute the UDFs in it. V8 contexts can be re-used across subsequent
queries, but when UDF-invoking queries run in parallel, they will each require a 
dedicated V8 context.

Because UDFs use the V8 JavaScript engine, the engine's default memory limit of 512 MB is applied.

Using UDFs in clusters may thus result in a higher resource allocation
in terms of used V8 contexts and server threads. If you run out 
of these resources, your query may abort with a
[**cluster backend unavailable**](../appendix-error-codes.html) error.

To overcome these mentioned limitations, you may want to increase the
[number of available V8 contexts](../programs-arangod-options.html#--javascriptv8-contexts)
(at the expense of increased memory usage), and the
[number of available server threads](../programs-arangod-options.html#--servermaximal-threads).

In addition, modification of global JavaScript variables from inside UDFs is 
unsupported, as is reading or changing the data of any collection or running
queries from inside an AQL user function.

## Naming

AQL functions that are implemented with JavaScript are always in a namespace.
To register a user-defined AQL function, you need to give it a name with a
namespace. The `::` symbol is used as the namespace separator, for example,
`MYGROUP::MYFUNC`. You can use one or multiple levels of namespaces to create
meaningful function groups.

The names of user-defined functions are case-insensitive, like all function
names in AQL.

To refer to and call user-defined functions in AQL queries, you need to use the
fully qualified name with the namespaces:

```aql
MYGROUP::MYFUNC()
MYFUNCTIONS::MATH::RANDOM()
```

ArangoDB's built-in AQL functions are all implemented in C++ and are not in a
namespace, except for the internal `V8()` function, which resides in the `_aql`
namespace. It is the default namespace, which means that you can use the
unqualified name of the function (without `_aql::`) to refer to it. Note that
you cannot add own functions to this namespace.

## Variables and side effects

User functions can take any number of input arguments and should
provide one result via a `return` statement. User functions should be kept 
purely functional and thus free of side effects and state, and state modification.

{% hint 'warning' %}
Modification of global variables is unsupported, as is reading or changing
the data of any collection or running queries from inside an AQL user function.
{% endhint %}

User function code is late-bound, and may thus not rely on any variables
that existed at the time of declaration. If user function code requires
access to any external data, it must take care to set up the data by
itself.

All AQL user function-specific variables should be introduced with the `var`,
`let`, or `const` keywords in order to not accidentally access already defined
variables from outer scopes. Not using a declaration keyword for own variables
may cause side effects when executing the function.

Here is an example that may modify outer scope variables `i` and `name`,
making the function **not** side-effect free:

```js
function (values) {
  for (i = 0; i < values.length; ++i) {
    name = values[i];
    if (name === "foo") {
      return i;
    }
  }
  return null;
}
```

The above function can be made free of side effects by using the `var`, `let`,
or `const` keywords, so the variables become function-local variables:

```js
function (values) {
  for (let i = 0; i < values.length; ++i) {
    let name = values[i];
    if (name === "foo") {
      return i;
    }
  }
  return null;
}
```

## Input parameters

In order to return a result, a user function should use a `return` instruction
rather than modifying its input parameters.

AQL user functions are allowed to modify their input parameters for input 
parameters that are null, boolean, numeric or string values. Modifying these
input parameter types inside a user function should be free of side effects. 
However, user functions should not modify input parameters if the parameters are 
arrays or objects and as such passed by reference, as that may modify variables 
and state outside of the user function itself. 

## Return values

User functions must only return primitive types (i.e. `null`, boolean
values, numeric values, string values) or aggregate types (arrays or
objects) composed of these types.
Returning any other JavaScript object type (Function, Date, RegExp etc.) from
a user function may lead to undefined behavior and should be avoided.

## Enforcing strict mode

By default, any user function code is executed in *sloppy mode*. In order to
make a user function run in strict mode, use `"use strict"` explicitly inside
the user function:

```js
function (values) {
  "use strict"

  for (let i = 0; i < values.length; ++i) {
    let name = values[i];
    if (name === "foo") {
      return i;
    }
  }
  return null;
}
```

Any violation of the strict mode triggers a runtime error.

## Registering and unregistering user functions

User-defined functions (UDFs) can be registered in the selected database 
using the `@arangodb/aql/functions` module as follows:

```js
var aqlfunctions = require("@arangodb/aql/functions");
```

To register a function, the fully qualified function name plus the
function code must be specified. This can easily be done in
[arangosh](../programs-arangosh.html). The
[HTTP Interface](../http/aql-user-functions.html) also offers
User Functions management.

In a cluster setup, make sure to connect to a Coordinator to manage the UDFs.

Documents in the `_aqlfunctions` collection (or any other system collection)
should not be accessed directly, but only via the dedicated interfaces.
Otherwise you might see caching issues or accidentally break something.
The interfaces ensure the correct format of the documents and invalidate
the UDF cache.

### Registering an AQL user function

For testing, it may be sufficient to directly type the function code in the shell.
To manage more complex code, you may write it in the code editor of your choice
and save it as file. For example:

```js
/* path/to/file.js */
'use strict';

function greeting(name) {
    if (name === undefined) {
        name = "World";
    }
    return `Hello ${name}!`;
}

module.exports = greeting;
```

Then require it in the shell in order to register a user-defined function:

```js
arangosh> var func = require("path/to/file.js");
arangosh> aqlfunctions.register("HUMAN::GREETING", func, true);
```

Note that a return value of `false` means that the function `HUMAN::GREETING`
was newly created, and not that it failed to register. `true` is returned
if a function of that name existed before and was just updated.

`aqlfunctions.register(name, code, isDeterministic)`

Registers an AQL user function, identified by a fully qualified function
name. The function code in `code` must be specified as a JavaScript
function or a string representation of a JavaScript function.
If the function code in `code` is passed as a string, it is required that
the string evaluates to a JavaScript function definition.

If a function identified by `name` already exists, the previous function
definition is updated. Please also make sure that the function code
does not violate the conventions for AQL functions, in particular with regards
to the [naming](#naming) and [side-effects](#variables-and-side-effects).

The `isDeterministic` attribute can be used to specify whether the
function results are fully deterministic (i.e. depend solely on the input
and are the same for repeated calls with the same input values). It is not
used at the moment but may be used for optimizations later.

The registered function is stored in the selected database's system 
collection `_aqlfunctions`.

The function returns `true` when it updates/replaces an existing AQL 
function of the same name, and `false` otherwise. It throws an exception
if it detects syntactically invalid function code.

**Examples**

```js
require("@arangodb/aql/functions").register("MYFUNCTIONS::TEMPERATURE::CELSIUSTOFAHRENHEIT",
function (celsius) {
  return celsius * 1.8 + 32;
});
```

The function code is not executed in *strict mode* or *strong mode* by 
default. In order to make a user function being run in strict mode, use
`use strict` explicitly, e.g.:

```js
require("@arangodb/aql/functions").register("MYFUNCTIONS::TEMPERATURE::CELSIUSTOFAHRENHEIT",
function (celsius) {
  "use strict";
  return celsius * 1.8 + 32;
});
```

You can access the name under which the AQL function is registered by accessing
the `name` property of `this` inside the JavaScript code:

```js
require("@arangodb/aql/functions").register("MYFUNCTIONS::TEMPERATURE::CELSIUSTOFAHRENHEIT",
function (celsius) {
  "use strict";
  if (typeof celsius === "undefined") {
    const error = require("@arangodb").errors.ERROR_QUERY_FUNCTION_ARGUMENT_NUMBER_MISMATCH;
    AQL_WARNING(error.code, require("util").format(error.message, this.name, 1, 1));
  }
  return celsius * 1.8 + 32;
});
```

`AQL_WARNING()` is automatically available to the code of user-defined
functions. The error code and message is retrieved via `@arangodb` module.
The *argument number mismatch* message has placeholders, which we can substitute
using [format()](http://nodejs.org/api/util.html){:target="_blank"}:

```
invalid number of arguments for function '%s()', expected number of arguments: minimum: %d, maximum: %d
```

In the example above, `%s` is replaced by `this.name` (the AQL function name),
and both `%d` placeholders by `1` (number of expected arguments). If you call
the function without an argument, you see this:

```js
arangosh> db._query("RETURN MYFUNCTIONS::TEMPERATURE::CELSIUSTOFAHRENHEIT()")
[object ArangoQueryCursor, count: 1, hasMore: false, warning: 1541 - invalid
number of arguments for function 'MYFUNCTIONS::TEMPERATURE::CELSIUSTOFAHRENHEIT()',
expected number of arguments: minimum: 1, maximum: 1]

[
  null
]
```

### Deleting an existing AQL user function

`aqlfunctions.unregister(name)`

Unregisters an existing AQL user function, identified by the fully qualified
function name.

Trying to unregister a function that does not exist results in an
exception.

**Examples**

```js
require("@arangodb/aql/functions").unregister("MYFUNCTIONS::TEMPERATURE::CELSIUSTOFAHRENHEIT");
```

### Unregister group

Delete a group of AQL user functions:

`aqlfunctions.unregisterGroup(prefix)`

Unregisters a group of AQL user function, identified by a common function
group prefix.

This returns the number of functions unregistered.

**Examples**

```js
require("@arangodb/aql/functions").unregisterGroup("MYFUNCTIONS::TEMPERATURE");

require("@arangodb/aql/functions").unregisterGroup("MYFUNCTIONS");
```

### Listing all AQL user functions

`aqlfunctions.toArray()`

Returns all previously registered AQL user functions, with their fully
qualified names and function code.

---

`aqlfunctions.toArray(prefix)`

Returns all previously registered AQL user functions, restricted to a specified
group of functions by specifying a group prefix.

**Examples**

To list all available user functions:

```js
require("@arangodb/aql/functions").toArray();
```

To list all available user functions in the *MYFUNCTIONS* namespace:

```js
require("@arangodb/aql/functions").toArray("MYFUNCTIONS");
```

To list all available user functions in the *MYFUNCTIONS::TEMPERATURE* namespace:

```js
require("@arangodb/aql/functions").toArray("MYFUNCTIONS::TEMPERATURE");
```

## Deployment Details

Internally, UDFs are stored in a system collection named `_aqlfunctions`
of the selected database. When an AQL statement refers to such a UDF,
it is loaded from that collection. The UDFs will be exclusively
available for queries in that particular database.

Since the Coordinator doesn't have own local collections, the `_aqlfunctions`
collection is sharded across the cluster. Therefore (as usual), it has to be
accessed through a Coordinator - you mustn't talk to the shards directly.
Once it is in the `_aqlfunctions` collection, it is available on all
Coordinators without additional effort.

Keep in mind that system collections are excluded from dumps created with
[arangodump](../programs-arangodump.html) by default.
To include AQL UDF in a dump, the dump needs to be started with
the option *--include-system-collections true*.
