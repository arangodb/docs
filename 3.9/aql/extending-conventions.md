---
layout: default
description: User-defined function naming and behavior
title: AQL UDF Conventions
---
Conventions
===========

Naming
------

AQL functions that are implemented with JavaScript are always in a namespace.
To register a user-defined AQL function, you need to give it a name with a
namespace. The `::` symbol is used as the namespace separator, for example,
`MYGROUP::MYFUNC`. You can use one or multiple levels of namespaces to create
meaningful function groups.

The names of user-defined functions are case-insensitive, like all function
names in AQL.

To refer to and call user-defined functions in AQL queries, you need to use the
fully qualified name with the namespaces:

```js
MYGROUP::MYFUNC()
MYFUNCTIONS::MATH::RANDOM()
```

ArangoDB's built-in AQL functions are all implemented in C++ and are not in a
namespace, except for the internal `V8()` function, which resides in the `_aql`
namespace. It is the default namespace, which means that you can use the
unqualified name of the function (without `_aql::`) to refer to it. Note that
you cannot add own functions to this namespace.

Variables and side effects
--------------------------

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

Input parameters
----------------

In order to return a result, a user function should use a `return` instruction 
rather than modifying its input parameters.

AQL user functions are allowed to modify their input parameters for input 
parameters that are null, boolean, numeric or string values. Modifying these
input parameter types inside a user function should be free of side effects. 
However, user functions should not modify input parameters if the parameters are 
arrays or objects and as such passed by reference, as that may modify variables 
and state outside of the user function itself. 

Return values
-------------

User functions must only return primitive types (i.e. `null`, boolean
values, numeric values, string values) or aggregate types (arrays or
objects) composed of these types.
Returning any other JavaScript object type (Function, Date, RegExp etc.) from
a user function may lead to undefined behavior and should be avoided.

Enforcing strict mode
---------------------

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
