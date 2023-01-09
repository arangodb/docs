---
fileID: extending-functions
title: Registering and Unregistering User Functions
weight: 3790
description: 
layout: default
---
User-defined functions (UDFs) can be registered in the selected database 
using the `@arangodb/aql/functions` module as follows:

{{< tabs >}}
{{% tab name="js" %}}
```js
var aqlfunctions = require("@arangodb/aql/functions");
```
{{% /tab %}}
{{< /tabs >}}

To register a function, the fully qualified function name plus the
function code must be specified. This can easily be done in
[arangosh](../../programs-tools/arangodb-shell/). The
[HTTP Interface](../../http/aql-user-functions) also offers
User Functions management.

In a cluster setup, make sure to connect to a Coordinator to manage the UDFs.

Documents in the `_aqlfunctions` collection (or any other system collection)
should not be accessed directly, but only via the dedicated interfaces.
Otherwise you might see caching issues or accidentally break something.
The interfaces ensure the correct format of the documents and invalidate
the UDF cache.

## Registering an AQL user function

For testing, it may be sufficient to directly type the function code in the shell.
To manage more complex code, you may write it in the code editor of your choice
and save it as file. For example:

{{< tabs >}}
{{% tab name="js" %}}
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
{{% /tab %}}
{{< /tabs >}}

Then require it in the shell in order to register a user-defined function:

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> var func = require("path/to/file.js");
arangosh> aqlfunctions.register("HUMAN::GREETING", func, true);
```
{{% /tab %}}
{{< /tabs >}}

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
does not violate the [Conventions](extending-conventions) for AQL 
functions.

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

{{< tabs >}}
{{% tab name="js" %}}
```js
require("@arangodb/aql/functions").register("MYFUNCTIONS::TEMPERATURE::CELSIUSTOFAHRENHEIT",
function (celsius) {
  return celsius * 1.8 + 32;
});
```
{{% /tab %}}
{{< /tabs >}}

The function code is not executed in *strict mode* or *strong mode* by 
default. In order to make a user function being run in strict mode, use
`use strict` explicitly, e.g.:

{{< tabs >}}
{{% tab name="js" %}}
```js
require("@arangodb/aql/functions").register("MYFUNCTIONS::TEMPERATURE::CELSIUSTOFAHRENHEIT",
function (celsius) {
  "use strict";
  return celsius * 1.8 + 32;
});
```
{{% /tab %}}
{{< /tabs >}}

You can access the name under which the AQL function is registered by accessing
the `name` property of `this` inside the JavaScript code:

{{< tabs >}}
{{% tab name="js" %}}
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
{{% /tab %}}
{{< /tabs >}}

`AQL_WARNING()` is automatically available to the code of user-defined
functions. The error code and message is retrieved via `@arangodb` module.
The *argument number mismatch* message has placeholders, which we can substitute
using [format()](http://nodejs.org/api/util.html):

{{< tabs >}}
{{% tab name="" %}}
```
invalid number of arguments for function '%s()', expected number of arguments: minimum: %d, maximum: %d
```
{{% /tab %}}
{{< /tabs >}}

In the example above, `%s` is replaced by `this.name` (the AQL function name),
and both `%d` placeholders by `1` (number of expected arguments). If you call
the function without an argument, you see this:

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._query("RETURN MYFUNCTIONS::TEMPERATURE::CELSIUSTOFAHRENHEIT()")
[object ArangoQueryCursor, count: 1, hasMore: false, warning: 1541 - invalid
number of arguments for function 'MYFUNCTIONS::TEMPERATURE::CELSIUSTOFAHRENHEIT()',
expected number of arguments: minimum: 1, maximum: 1]

[
  null
]
```
{{% /tab %}}
{{< /tabs >}}

## Deleting an existing AQL user function

`aqlfunctions.unregister(name)`

Unregisters an existing AQL user function, identified by the fully qualified
function name.

Trying to unregister a function that does not exist results in an
exception.

**Examples**

{{< tabs >}}
{{% tab name="js" %}}
```js
require("@arangodb/aql/functions").unregister("MYFUNCTIONS::TEMPERATURE::CELSIUSTOFAHRENHEIT");
```
{{% /tab %}}
{{< /tabs >}}

## Unregister Group

Delete a group of AQL user functions:

`aqlfunctions.unregisterGroup(prefix)`

Unregisters a group of AQL user function, identified by a common function
group prefix.

This returns the number of functions unregistered.

**Examples**

{{< tabs >}}
{{% tab name="js" %}}
```js
require("@arangodb/aql/functions").unregisterGroup("MYFUNCTIONS::TEMPERATURE");

require("@arangodb/aql/functions").unregisterGroup("MYFUNCTIONS");
```
{{% /tab %}}
{{< /tabs >}}

## Listing all AQL user functions

`aqlfunctions.toArray()`

Returns all previously registered AQL user functions, with their fully
qualified names and function code.

`aqlfunctions.toArray(prefix)`

Returns all previously registered AQL user functions, restricted to a specified
group of functions by specifying a group prefix.

**Examples**

To list all available user functions:

{{< tabs >}}
{{% tab name="js" %}}
```js
require("@arangodb/aql/functions").toArray();
```
{{% /tab %}}
{{< /tabs >}}

To list all available user functions in the *MYFUNCTIONS* namespace:

{{< tabs >}}
{{% tab name="js" %}}
```js
require("@arangodb/aql/functions").toArray("MYFUNCTIONS");
```
{{% /tab %}}
{{< /tabs >}}

To list all available user functions in the *MYFUNCTIONS::TEMPERATURE* namespace:

{{< tabs >}}
{{% tab name="js" %}}
```js
require("@arangodb/aql/functions").toArray("MYFUNCTIONS::TEMPERATURE");
```
{{% /tab %}}
{{< /tabs >}}
