---
layout: default
description: Programmable Pregel Algorithms enables you to define and run customized analytical algorithms directly on graphs stored in ArangoDB.
title: Programmable Pregel Algorithms (experimental feature)
---
Programmable Pregel Algorithms
==============================

{% hint 'warning' %}
This feature is experimental and under active development.
The naming and interfaces may change at any time.
Execution times are not representative of the final product.
{% endhint %}

Pregel is a system for large scale graph processing. It is already implemented
in ArangoDB and can be used with **predefined** algorithms, e.g. _PageRank_,
_Single-Source Shortest Path_ and _Connected components_.

Programmable Pregel Algorithms (PPA) are based on the already existing ArangoDB
Pregel engine. The big change here is the possibility to write and execute your
own defined algorithms.

The best part: You can write, develop and execute your custom algorithms
**without** having to plug C++ code into ArangoDB (and re-compile).
Algorithms can be defined and executed in a running ArangoDB instance without
the need of restarting your instance.

Requirements
------------

PPAs can be run on a single-server instance but as it is designed to run in
parallel in a distributed environment, you will only be able to add computing
power in a clustered environment. Also PPAs do require proper graph sharding to
be efficient. Using SmartGraphs is the recommend way to run Pregel algorithms.

As this is an extension of the native Pregel framework, the same
[prerequisites](graphs-pregel.html#prerequisites) and requirements apply.

Basics
------

A Pregel computation consists of a sequence of iterations, each one of them is
called a superstep. During a superstep, the custom algorithm will be executed
for each vertex. This is happening in parallel, as the vertices are
communicating via messages and not with shared memory.

The basic methods are (we are in superstep round S here):
- Read messages which are sent to the vertex V in the previous superstep (S-1)
- Send messages to other vertices that will be received in the next superstep (S+1)
- Modify the state of the vertex V
- Vote to Halt (mark a vertex V as "done".
  V will be inactive in S+1, but it is possible to re-activate)

Definition of a custom algorithm
--------------------------------

The format of a custom algorithm right now is based on a JSON object.

### Algorithm skeleton

```json
{
  "resultField": "<string>",
  "maxGSS": "<number>",
  "dataAccess": {
    "writeVertex": "<program>",
    "readVertex": "<array>",
    "readEdge": "<array>"
  },
  "vertexAccumulators": "<object>",
  "globalAccumulators": "<object>",
  "customAccumulators": "<object>",
  "phases": "<array>"
}
```

### Algorithm parameters

- **resultField** (string, _optional_): Name of the document attribute to store
  the result in. The system replaces the attributes value with an object, mapping
  accumulator names to their values.

- **maxGSS** (number, _required_): The max amount of global supersteps.

  After the amount of max defined supersteps is reached, the Pregel execution
  will stop.

- **dataAccess** (object, _optional_): Allows to define `writeVertex`,
  `readVertex` and `readEdge`.

  - **writeVertex**: An [AIR program](#air-program) that is used to write the
    results into vertices. If `writeVertex` is used, the `resultField` must not
    be set.

  - **readVertex**: An `array` that consists of `strings` and/or additional `arrays`
    (that represents a path).
    - `string`: Represents a single attribute at the top level.
    - `array of strings`: Represents a nested path
  - **readEdge**: An `array` that consists of `strings` and/or additional `arrays`
    (that represents a path).
      - `string`: Represents a single attribute at the top level.
      - `array of strings`: Represents a nested path

  `readVertex` and `readEdge` are used to modify the associated data for a
  vertex or edge. If not provided the default behavior is to load the whole
  document.

- **vertexAccumulators** (object, _optional_):
  Definition of all used [vertex accumulators](#vertex-accumulators).

- **globalAccumulators** (object, _optional_):
  Definition all used global accumulators.
  [Global Accumulators](#global-accumulator) are able to access variables at
  shared global level.

- **customAccumulators** (object, _optional_):
  Definition of all used [custom accumulators](#custom-accumulator).

- **phases** (array):
  Array of a single or multiple [phase definitions](#phases).

- **debug** (optional): See [Debugging](#debugging).

Phases
------

Phases will run sequentially during your Pregel computation. The definition of
multiple phases is allowed. Each phase requires instructions based on the
operations you want to perform. The initialization program (1) will run a
single time in the very first round. All upcoming rounds will execute the
update program (2).

In each phase, the Pregel program execution will follow the order:

Step 1: Initialization
1. `onPreStep` (Coordinator, executed on Coordinator instances)
2. `initProgram` (Worker, executed on DB-Server instances)
3. `onPostStep` (Coordinator)

Step 2 (+n): Computation
1. `onPreStep` (Coordinator)
2. `updateProgram` (Worker)
3. `onPostStep` (Coordinator)

#### Phase parameters

- **name** (string, _required_): Phase name.

  The given name of the defined phase.
- **onPreStep**: Program to be executed.

  The _onPreStep_ program will run **once before** each Pregel execution round.
- **initProgram**: Program to be executed.

  The init program will run **initially once** per all vertices that are part
  of your graph.
- **updateProgram**: Program to be executed.

  The _updateProgram_ will be executed **during every Pregel execution round**
  and each **per vertex**.
- **onPostStep**: Program to be executed.

  The _onPostStep_ program will run **once after** each Pregel execution round.

All programs are specified as [AIR programs](#air-program).

The return value of `initProgram` resp. `updateProgram` is inspected. It must
be one of the following:
- `"vote-halt"` or `false`:
  indicates that this vertex voted halt.
- `"vote-active"` or `true`:
  indicates that this vertex voted active and is active in the next round.

Debugging
---------

Using the `debug` field in the algorithm specification you instruct the Pregel
system to generate additional tracing information for debugging purpose.
Currently, only sent messages can be traced but in future this will be expanded
as needed.

```js
{
  debug: {
    traceMessages: {
      "my-vertex-id": {}
    }
  }
}
```

This will generate a _report_ for every message that is sent to the vertex
`my-vertex-id`. Additionally you can specify a filter by adding a `filter` field.

```js
{
  debug: {
    traceMessages: {
      "my-vertex-id": {
        filter: {
          bySender: ["my-sender-vertex"],
          byAccumulator: ["some-accumulator"]
        }
      }
    }
  }
}
```

This for example only generates trace reports for messages that were sent by
`my-sender-vertex` and use the `some-accumulator` accumulator. You can add more
than one vertex or accumulator to that list. The filters are combined using
`and` semantics, i.e. only those messages that pass _all_ filters are traced.

**Specification**

- `traceMessages` (optional) a mapping from `vertex-id` to a dict described below
  - `filter` (optional)
    - `bySender` (optional) a list of vertex document ids. Only messages sent
      by those vertices are traced.
    - `byAccumulator` (optional) a list of accumulator names. Only messages
      sent to those accumulators are traced.

AIR Program
-------

As the name already indicates, the _AIR program_ is the part where the actual
algorithmic action takes place. An AIR program is represented with the Arango
Intermediate Representation (AIR).

## Arango Intermediate Representation

We developed a Lisp-like intermediate representation to be able to transport
programs into the existing Pregel implementation in ArangoDB. These programs
are executed using the interpreter inside the AIR Pregel algorithm.

At the moment this interpreter is a prototype and hence not optimized and
(probably) slow. It is very flexible in terms of what we can implement,
provide and test: We can provide any function as a primitive in the language,
and all basic operations are available as it is customary in the LISP tradition.

{% hint 'info' %}
The intention is *not* that this language is presented to users as is.
This is only the representation we are using in our early stage of that
experimental feature state.

It is merely an intermediate representation which is very flexible for good
prototyping. A surface syntax is subject to development and even flexible in
terms of providing more than one. In particular this way we get a better
feeling for which functionality is needed by clients and users of graph
analytics.

A surface language / syntax will be available later.
{% endhint %}

## AIR specification

The following list of functions and special forms is available in all contexts.
_AIR_ is based on Lisp, but represented in JSON and supports its data types.

Strings, numeric constants, booleans and objects (dicts) are self-evaluating,
i.e. the result of the evaluation of those values is the value itself.
Arrays are not self-evaluating. In general you should read an array like a
function call:

```js
["foo", 1, 2, "bar"] // read as foo(1, 2, "bar")
```

The first element of a list specifies the function. This can either be a string
containing the function name, or a [lambda object](#lambdas).

To prevent unwanted evaluation or to actually write down a list there are
multiple options:

- `list`
- `quote`
- `quasi-quote`

```js
["list", 1, 2, ["foo", "bar"]] // evaluates to [1, 2, foo("bar")] -- evaluated parameters
["quote", 1, 2, ["foo", "bar"]] // evaluates to [1, 2, ["foo", "bar"]] -- unevaluated parameters
```

They are described in more detail below.

The documentation refers to an array of length two as _pair_. The first entry is
called `first` and the second entry `second`.

### Truthiness of values

A value is considered _false_ if it is boolean `false` or absent (`null`)
All other values are considered true.

### Special forms

A _special form_ is special in the sense that it does not necessarily evaluate
its parameters.

#### `let` statement

_binding values to variables_

```js
["let", [[name, value]...], expr...]
```

Expects as first parameter a list of name-value-pairs. Both members of each
pair are evaluated. `first` has to evaluate to a string. Declared names become
visible at the first `expr`. The following expressions are then evaluated in a
context where the named variables are assigned to their given values. When
evaluating the expression, `let` behaves like `seq`.

[Variables](#variables) can be dereference using `var-ref`.

```js
> ["let", [["x", 12], ["y", 5]], ["+", ["var-ref", "x"], ["var-ref", "y"]]]
 = 17
```

#### `seq` statement

_sequence of commands_

```js
["seq", expr ...]
```

`seq` evaluates `expr` in order. The result value is the result value of the
last expression. An empty `seq` evaluates to `null`.

```js
> ["seq", ["report", "Hello World!"], 2, 3]
Hello World!
 = 3
```

#### `if` statement

_classical if-elseif-else-statement_

```js
["if", [cond, body], ...]
```

Takes pairs `[cond, body]` of conditions `cond` and expression `body` and
evaluates the first `body` for which `cond` evaluates to a value that is
considered true. It does not evaluate the other `cond`s. If no condition
matches, it evaluates to `null`. To simulate an `else` statement, set the
last condition to `true`.

```js
> ["if", [
        ["lt?", ["var-ref", "x"], 0],
        ["-", 0, ["var-ref", "x"]]
    ], [
        true, // else
        ["var-ref", "x"]
    ]]
 = 5
```

#### `match` statement

_not-so-classical switch-statement_

```js
["match", proto, [c, body]...]
```

First evaluates `proto`, then evaluates each `c` until `["eq?", val, c]` is
considered true. Then the corresponding `body` is evaluated and its return
value is returned. If no branch matches, `null` is returned. This is a C-like
`switch` statement except that its `case`-values are not treated as constants.

```js
> ["match", 5,
  [1, ["A"]],
  [2, ["B"]],
  [3, ["C"]],
  [4, ["D"]],
  [5, ["E"]]
]
  = "E"
```

#### `for-each` statement

```js
["for-each", [[var, list]...] expr...]
```

Behaves similar to `let` but expects a list as `value` for each variable.
It then produces the cartesian product of all lists and evaluates its
expression for each n-tuple. The return value is always `null`. The order
is guaranteed to be lexicographic order. If the list of variables is empty,
the expressions are evaluated once. If one list is empty, nothing is evaluated.

```js
> ["for-each", [["x", ["list", 1, 2]], ["y", ["list", 3, 4]]], ["report", ["var-ref", "x"], ["var-ref", "y"]]]
1 3
1 4
2 3
2 4
(no value)
```

#### `quote` and `quote-splice` statements

_escape sequences for lisp_

```js
["quote", expr]
["quote-splice", list]
```

`quote`/`quote-splice` copies/splices its parameter verbatim into its output,
without evaluating them.
`quote-splice` fails if it is called in a context where it can not splice into
something, for example at top-level.

```js
> ["quote", ["foo"]]
 = ["foo"]
> ["list", "foo", ["quote-splice", ["bar"]] ]
 = ["foo","bar"]
```

#### `quasi-quote`, `unquote` and `unquote-splice` statements

_like `quote` but can be unquoted_

```js
["quasi-quote", expr]
["unquote", expr]
["unquote-splice", expr]
```

`quasi-quote` is like `quote` but can be unquoted using
`unquote`/`unquote-splice`.

Unlike `quote`, `quasi-quote` scans all the unevaluated values passed as
parameters but copies them. When it finds a `unquote` or `unquote-splice` it
evaluates its parameters and copies/splices the resulting value into the output.

```js
["quasi-quote", [
  ["this", "list", "is", "copied"], // this is not evaluated as call
  ["this", "is",                    // this neither
    ["unquote-splice", ["f", 2]]    // this will splice f(2) into the result
  ]
]]

= [["this", "list", "is", "copied"], ["this", "is", f(2)]]
```

```js
> ["quasi-quote", [["foo"], ["unquote", ["list", 1, 2]], ["unquote-splice", ["list", 1, 2]]]]
 = [["foo"],[1,2],1,2]
```

#### `cons` statement

_constructor for lists_

```js
["cons", value, list]
```

Classical lisp instruction that prepends `value` to the list `list`.

```js
> ["cons", 1, [2, 3]]
 = [1, 2, 3]
```

#### `and` and `or` statements

_basic logical operations_

```js
["and", expr...]
["or", expr...]
```

Computes the logical `and`/`or` expression of the given expression. As they are
special forms, those expression shortcut, i.e. `and`/`or` terminates the
evaluation on the first value considered `false`/`true`. The empty list
evaluates as `true`/`false`. The rules for truthiness are applied.

There is also a `not`, but it is not a special form.

### Language Primitives

Language primitives are methods which can be used in any context. As those are
functions, all parameters are always evaluated before passed to the function.

#### Basic Algebraic Operators

_left-fold with algebraic operators and the first value as initial value_

```js
["+", ...]
["-", ...]
["*", ...]
["/", ...]
```

All operators accept multiple parameters. The commutative operators `+`/`*`
calculate the sum/product of all values passed. The empty list evaluates to
`0`/`1`. The operator `-` subtracts the remaining operands from the first,
while `/` divides the first operand by the remaining. Again empty lists
evaluate to `0`/`1`.

```js
> ["+", 1, 2, 3]
 = 6
> ["-", 5, 3, 2]
 = 0
```

#### Logical operators

_convert values to booleans according to their truthiness_

```js
["true?", expr]
["false?", expr]
["not", expr]
```

- `true?` returns true if `expr` is considered true, returns false otherwise.
- `false?` returns true if `expr` is considered false, returns true otherwise.
- `not` is an alias for `false?`.

```js
> ["true?", 5]
 = true
> ["true?", 0]
 = true
> ["true?", false]
 = false
> ["true?", "Hello world!"]
 = true
> ["false?", 5]
 = false
```

#### Comparison operators

_compares on value to other values_

```js
["eq?", proto, expr...]
["gt?", proto, expr...]
["ge?", proto, expr...]
["le?", proto, expr...]
["lt?", proto, expr...]
["ne?", proto, expr...]
```

Compares `proto` to all other expressions according to the selected operator.
Returns true if all comparisons are true. Returns true for the empty list.
Relational operators are only available for numeric values. If proto is a
boolean value the other values are first converted to booleans using `true?`,
i.e. you compare their truthiness.

The operator names translate as follows:
- `eq?` -- `["eq?", left, right]` evaluates to `true` if `left` is equal to `right`
- `gt?` -- `["gt?", left, right]` evaluates to `true` if `left` is greater than `right`
- `ge?` -- `["ge?", left, right]` evaluates to `true` if `left` is greater than or equal to`right`
- `le?` -- `["le?", left, right]` evaluates to `true` if `left` is less than or equal to `right`
- `lt?` -- `["lt?", left, right]` evaluates to `true` if `left` is less than `right`
- `ne?` -- `["ne?", left, right]` evaluates to `true` if `left` is not equal to `right`

Given more than two parameters

```js
[<op>, proto, expr_1, expr_2, ...]
```

is equivalent to

```js
["and", [<op>, proto, expr_1], [<op>, proto, expr_2], ...]
```

except that `proto` is only evaluated once.

```js
> ["eq?", "foo", "foo"]
 = true
> ["lt?", 1, 2, 3]
 = true
> ["lt?", 1, 3, 0]
 = false
> ["ne?", "foo", "bar"]
 = true
```

#### Lists

_sequential container of inhomogeneous values_

```js
["list", expr...]
["list-cat", lists...]
["list-append", list, expr...]
["list-ref", list, index]
["list-set", arr, index, value]
["list-empty?", value]
["list-length", list]
```

`list` constructs a new list using the evaluated `expr`s. `list-cat`
concatenates given lists. `list-append` returns a new list, consisting of the
old list and the evaluated `expr`s. `list-ref` returns the value at `index`.
Accessing out of bound is an error. Offsets are zero based. `list-set`
returns a copy of the old list, where the entry and index `index` is replaced
by `value`. Writing an index that is out of bounds is an error. `list-empty?`
returns true if and only if the given value is an empty list. `list-length`
returns the length of the list.

#### Sort

_sort a list_

```js
["sort", compare, list]
`sort` sorts a list in ascending order by using the compare function. `compare`
is called with two parameters `a` and `b`. `a` is considered less than `b` is
the return value of this call is considered true. The sort is **not** stable.

```js
> ["sort", "lt?", ["list", 3, 1, 2]]
 = [1, 2, 3]
```

#### Dicts

```js
["dict", [key, value]...]
["dict-merge", dict...]
["dict-keys", dict]
["dict-directory", dict]

["attrib-ref", dict, key]
["attrib-ref", dict, path]
["attrib-ref-or", dict, key, default]
["attrib-ref-or", dict, path, default]
["attrib-ref-or-fail", dict, key]
["attrib-ref-or-fail", dict, path]
["attrib-set", dict, key, value]
["attrib-set", dict, path, value]
```

`dict` creates a new dict using the specified key-value pairs. It is undefined
behavior to specify a key more than once. `dict-merge` merges two or more
dicts, keeping the latest occurrence of each key. `dict-keys` returns a list of
all top level keys. `dict-directory` returns a list of all available paths in
preorder, intended to be used with nested directories.

`attrib-ref` returns the value of `key` in `dict`. If `key` is not present
`null` is returned. `attrib-set` returns a copy of `dict` but with `key` set to
`value`. Both functions have a variant that accepts a path. A path is a list of
strings. The function will recurse into the dict using that path. `attrib-set`
returns the whole dict but with updated subdict.

`attrib-ref-or` is similar to `attrib-ref` except that it returns `default` if
the key was not present. `attrib-ref-or-fail` returns an error instead.

```js
> ["attrib-ref", {"foo": "bar"}, "foo"]
 = "bar"
> ["dict", ["quote", "foo", "bar"], ["quote", "x", 2]]
 = {"foo":"bar", "x": 2}
> ["attrib-ref-or", {"foo": "bar"}, "baz", 5]
 = 5
```

#### Lambdas

```js
["lambda", captures, parameters, body]
```

`lambda` create a new function object. `captures` is a list of variables that
are _copied into_ the lambda at creating time. `parameters` is a list of names
that the parameters are bound to. Both can be accessed using their name via
`var-ref`. `body` is evaluated when the lambda is called.

Lambdas can be used wherever a function is expected.

```js
> [["lambda", ["quote", []], ["quote", ["x"]], ["quote", ["+", ["var-ref", "x"], 4]]], 6]
 = 10
```

#### Reduce

```js
["reduce", value, lambda, initialValue]
```

The reduce method executes a reducer function (lambda - required) on each
element of the array resp. object in natural resp. undefined order. In
general, it is being used to generate a single output value, yet it can be used
to generate any supported type.

The lambda function accepts three parameters, the current index (which is
either the position in an array, or the current key in case of an object),
the value and the current reduced value.

**Example:**

Addition of all array elements, start value set to 100.

```js
["reduce",
  ["list", 1, 2, 3],
    ["lambda",
      ["quote", []],
      ["quote", ["key", "value", "accum" ]],
      ["quote",
        ["+", ["var-ref", "value"], ["var-ref", "accum"] ]
      ]
    ],
  100
]
```

Will produce:

```
 => 106
```

**Explanation:**

- Iteration 1:
  - Take 100 as the initial accumulator value
  - Calculate and return the sum of 100 and 1
- Iteration 2:
  - Take result of the first iteration as accumulator value
  - Calculate and return the sum of 101 and 2
- Iteration 3:
  - Take result of the second iteration as accumulator value
  - Calculate and return the sum of 103 and 3
  - Return 106 as we've reached the end of our array

**Advanced example:**

Calculate the sum of all available object values

```js
["reduce",
  {"a": 1, "b": 2, "c": 3},
  ["lambda",
    ["quote", []],
    ["quote", ["key", "value", "accum" ]],
    ["seq",
      ["quote",
        [
          "attrib-set",
          ["var-ref", "accum"],
          ["var-ref", "key"],
          ["+", ["var-ref", "value"], ["attrib-ref", ["var-ref", "accum"], ["var-ref", "key"]] ]
        ]
      ]
    ]
  ],
  {"a": 1, "b": 2, "c": 3, "d": 4}
]
```

Will produce:
```
=> {"a":2, "b":4, "c":6, "d":4}
```

#### Utilities

_random functions that fit no other category_

```js
["string-cat", strings...]
["int-to-str", int]
["min", numbers...]
["max", numbers...]
["avg", numbers...]
["rand"]
["rand-range", min, max]
```

`string-cat` concatenates the given strings. `int-to-string` converts an integer
to its decimal representation.
`min`/`max`/`avg` computes the minimum/maximum/average of its values.
`rand`/`rand-range` produces a pseudo random number uniformly distributed in `[0,1]`/`[min,max]`.

```js
> ["string-cat", "hello", " ", "world"]
 = "hello world"
> ["min", 1, 2, 3]
 = 1
> ["max", 1, 2, 3]
 = 3
> ["avg", 1, 2, 3]
 = 2
> ["rand"]
 = 0.8401877171547095
> ["rand-range", 5, 7]
 = 5.788765853638186
```

#### Functional

```js
["id", value]
["apply", func, list]
["map", func, list]
["map", func, dict]
["filter", func, list]
["filter", func, dict]
```

`id` returns its argument. `apply` invokes `func` using the values from `list`
as arguments. `map` invokes `func` for every value/key-value-pair in the
`list`/`dict`. `func` should accept two parameters `(index, value)`/`(key, value)`.
`filter` returns a new `list`/`dict` that contains all entries for which the
return value of `func` invoked with `(index, value)`/`(key, value)` is
considered true.

```js
> ["id", 12]
 = 12
> ["apply", "min", ["quote", 1, 2, 3]]
 = 1
> ["map", ["lambda", ["list"], ["list", "idx", "value"], ["quote", ["int-to-str", ["var-ref", "value"]]]], ["list", 1, 2, 3, 4]]
 = ["1", "2", "3", "4"]
> ["filter", ["lambda",
        ["list"],
        ["list", "idx", "value"],
        ["quote", ["gt?", ["var-ref", "value"], 3]]
      ], ["list", 1, 2, 3, 4, 5, 6]]
 = [4,5,6]
```

#### Variables

```js
["var-ref", name]
["bind-ref", name]
```

`var-ref` evaluates to the current value of the variable with name `name`.
It is an error to reference a variable that is not defined in the current
context. `bind-ref` is an alias of `var-ref`.

#### Debug operators

```js
["report", values...]
["error", msg...]
["assert", cond, msg...]
```

`report` print in a context dependent way the string representation of its
arguments joined by spaces. Strings represent themselves, numbers are converted
to decimal representation, booleans are represented as `true` or `false`.
Dicts and lists are converted to JSON.

This function is not supported in all contexts, yet.

`error` creates an error and aborts execution immediately. Errors are reported
in a context dependent way. The error message is constructed from the remaining
parameters like `print`, except that it is not printed but associated with the
error. This like a panic or an uncaught exception.

`assert` checks if cond is considered true if it an error with the remaining
parameters as message is raised. It is equivalent to
`["if", [cond, ["error", msg...]]]`.

### Math Library

The following mathematical functions are available in all contexts. They all
interpret the data as a `double` and directly forward their input to the
respective [C/C++ library implementation](https://en.cppreference.com/w/cpp/numeric/math){:target="_blank"}.

- `abs`
- `acos`
- `acosh`
- `asin`
- `asinh`
- `atan`
- `atan2`
- `atanh`
- `cbrt`
- `ceil`
- `cos`
- `cosh`
- `exp`
- `exp2`
- `expm1`
- `floor`
- `fmod`
- `hypot`
- `log`
- `log10`
- `log1p`
- `log2`
- `pow`
- `round`
- `sin`
- `sinh`
- `sqrt`
- `tan`
- `tanh`
- `trunc`
{:class="columns-3"}

### Foreign calls in _Vertex Computation_ context

The following functions are only available when running as a vertex computation
(i.e. as a `initProgram`, `updateProgram`, ...). `this` usually refers to the
vertex we are attached to.

#### Vertex Accumulators

```js
["accum-ref", name]
["accum-set!", name, value]
["accum-clear!", name]
```

- `accum-ref` evaluates to the current value of the accumulator `name`.
- `accum-set!` sets the current value of the accumulator `name` to `value`.
- `accum-clear!` resets the current value of the accumulator `name` to a
  well-known one. Currently numeric limits for
  `max` and `min` accumulators, `0` for `sum`, `false` for `or`, `true` for `and`, and
  empty for `list` and VelocyPack.

#### Global Accumulators

```
["global-accum-ref", name]
["send-to-global-accum", name, value]
```

- `global-accum-ref` evaluates the global accumulator `name`.
- `send-to-global-accum` sends `value` to the global accumulator `name`.

Also see the remarks about [update visibility](#vertex-accumulators).

#### Message Passing

```js
["send-to-accum", name, to-pregel-id, value]
["send-to-all-neighbors", name, value]
```

- `send-to-accum` send the value `value` to the accumulator `name` at vertex
  with pregel-id `to-pregel-vertex`. There is not edge required between the sender
  and the receiver.
- `send-to-all-neighbors` sends the value `value` to the accumulator `name` in
  all neighbors reachable by an edge, i.e. along outbound edges. Note that if
  there are multiple edges from us to the neighbor, the value is sent multiple
  times.

#### This Vertex

```js
["this-doc"]
["this-vertex-id"]
["this-unique-id"]
["this-pregel-id"]
["this-outdegree"]
["this-outbound-edges-count"]
["this-outbound-edges"]
```

- `this-doc` returns the data associated with the vertex.
- `this-outdegree` returns the number of outgoing edges.
- `this-outbound-edges-count` alias for `this-outdegree`.
- `this-outbound-edges` returns a list of outbound edges of the form
  ```json
  {
    "document": <edge-document>,
    "to-pregel-id": <to-vertex-pregel-id>
  }
  ```
- `this-vertex-id` returns the vertex document identifier.
- `this-unique-id` returns a unique but opaque numeric value associated with
   this vertex.
- `this-pregel-id` returns an identifier used by Pregel to send messages.

#### Miscellaneous

- `["vertex-count"]` returns the total number of vertices in the graph under
  consideration.
- `["global-superstep"]` the current superstep the algorithm is in.
- `["phase-superstep"]` the current superstep the current phase is in.
- `["current-phase"]` the current phase name.

### Foreign calls in _Coordinator_ context

The following functions are only available when running in the Coordinator
context to coordinate phases and phase changes and to access and modify
global accumulators.

#### Phase Management

```
["goto-phase", phase]
["finish"]
```

`goto-phase` sets the current phase to `phase`. `finish` finishes the Pregel
computation.

#### Global Accumulators

```
["global-accum-ref", name]
["global-accum-set!", name, value]
["global-accum-clear!", name]
```

`global-accum-ref`, `global-accum-set!`, `global-accum-clear!` like for
accumulators but for global accumulators.

### Foreign calls in _Custom Accumulator_ context

The following functions are only available when running inside a custom accumulator.

- `["parameters"]`
   returns the object passed as parameter to the accumulator definition
- `["current-value"]`
   returns the current value of the accumulator
- `["get-current-value"]`
   returns the current value but calls the `getProgram` to do so.
- `["input-value"]`
   returns the _input value_. This is the value received as update in
   `updateProgram`. Or the value the accumulator is set to in `setProgram`.
- `["input-sender"]`
   returns the _vertex-id_ of the sending vertex. This is only available in
   `updateProgram`.
- `["input-state"]`
   return the input state for a merge operation. This is only available in
   `aggregateStateProgram`.
- `["this-set!", value]`
   set the new value of the accumulator to `value`.
- `["this-set-value!", value]`
   set the new value of the accumulator but calls the `setProgram` to do so.

## Accumulators

In PPAs there are special types, called: `Accumulators`. There are two
types of Accumulators:

- VertexAccumulators: one instance per vertex.
- GlobalAccumulators: a single instance globally.

Accumulators are used to consume and process messages which are being sent to
them during the computational steps (`initProgram`, `updateProgram`,
`onPreStep`, `onPostStep`) of a superstep. After a superstep is done, all
messages will be processed.

The manner on how they are going to be processed depends on their
`accumulatorType`.

### Vertex Accumulators

Vertex Accumulators are following the general definition of an Accumulator.
There is only one exception: A vertex is able to modify their own local
accumulator directly during the computational steps, **but only their own**.

In short: Modifications which will be done via messages, will be visible in
the next superstep round. Changes done locally, are visible directly - but
cannot be done from one vertex to another.

#### Example

Imagine a simple part of a graph like this:

```
       B  ←  E
    ↗
  A →  C
    ↘
       D
```

The vertex `A` has edges pointing to the vertices `B`, `C` and `D`.
Additionally, the vertex `E` is pointing to the vertex `B`. If we want to
calculate now, how many incoming edges `B`, `C` and `D` have, we need to sent
a message with the value `1`, which represents an incoming edge, along all
outgoing edges of our vertices. As only `A` and `E` do have outgoing edges,
only those two vertices will send messages:

1. **Phase - Computation (Superstep S)**

   Vertex A:
   - Sending **1** to B
   - Sending **1** to C
   - Sending **1** to D

   Vertex E:
   - Sending **1** to B

   As we want to sum up all received values, the `sumAccumulator` needs to be
   used. It will automatically compute the value out of all received messages:

2. **Phase - Aggregation**

   - Vertex `B` receives two messages
     - Result is: **2**. (1+1)
   - Vertex `C` receives one messages
     - Result is: **1**. (1)
   - Vertex `D` receives one messages
     - Result is: **1**. (1)

3. **Phase - onPostStep (Superstep S)**

   Aggregated Accumulators are visible now. Additional modifications can be
   implemented here.

4. **Phase - onPreStep (Superstep S+1)**

   Aggregated Accumulators are visible now. They could be modified in the
   previous `onPostStep` routine. Latest changes will be visible here as well.
   Further modifications can be done here.

5. **Phase - Computation (Superstep S+1)**

   The latest Accumulator states are visible. New messages can be sent.
   They will be visible in the next round.

#### Vertex Accumulator Definition

Each vertex accumulator requires a name as `string`:

```json
{
  "<name>": {
    "accumulatorType": "<accumulator-type>",
    "valueType": "<valueType>",
    "customType": "<custom-accumulator-type>"
  }
}
```

#### Vertex Accumulator Parameters

- **accumulatorType** (string, _required_): The name of the used accumulator type.
  Valid values are:
  - `max`: stores the maximum of all messages received.
  - `min`: stores the minimum of all messages received.
  - `sum`: sums up all messages received.
  - `and`: computes `and` on all messages received.
  - `or`: computes `or` and all messages received.
  - `store`: holds the last received value (non-deterministic).
  - `list`: stores all received values in list (order is non-deterministic).
  - `custom`: see below.
- **valueType** (string, _required_): The name of the value type.
  Valid value types are:
  - `any` (JSON data)
  - `int` (Integer type)
  - `double`: (Double type)
  - `bool`: (Boolean type)
  - `string`: (String type)
- **customType** (string, _optional_): The name of the used custom accumulator type.
    Has to be set if and only if `accumulatorType == custom`.

### Global Accumulator

Global Accumulators are following the general definition of an Accumulator.
Compared to a Vertex Accumulator they do not have local access to the Accumulator.
Changes can only take place when sending messages or in pre-step and post-step
programs and therefore can only be visible in the next superstep round
(or in the `onPostStep` routine in the current round).

### Custom Accumulator

Because the above list of accumulators feels limited and may not suite your case
best you can create your own custom accumulator. You can define a custom
accumulator in the `customAccumulators` field of the algorithm, which is an
object, mapping the name of the custom accumulator to its definition.
To use it, set the `accumulatorType` to `custom` and the `valueType` to `any`.
In `customType` put the name of the custom accumulator.

The definition of a custom vertex accumulator contains the following fields:
- `updateProgram` this code is executed whenever the accumulator receives a
  message. The `input-value` and `input-sender` functions are available here.
  This program should either return `"hot"` when the accumulator changed,
  i.e. its vertex will be activated in the next step, or `"cold"` if not.
- `clearProgram` this code is executed whenever the accumulator is cleared,
  for example when `accum-clear` is called.
- `setProgram` this code is executed whenever the accumulator is set to a
  specific value. The `input-value` function is available to receive the new
  value, for example when `accum-set!` is called. By default this program
  replaces the internal state of the accumulator with the given value.
- `getProgram` this code is executed whenever the accumulator is read from.
  Its return value is the actual value that will be returned by for example
  `accum-ref`. By default this program returns the internal state of the
  accumulator.
- `finalizeProgram` this code is executed when the value of the accumulator is
  written back into the vertex document. It defaults to `getProgram`.

Each custom accumulator has an internal buffer. You can access this buffer using
the `current-value` function. To set a new value use `this-set!`. Note that
`this-set!` will not invoke the `setProgram` but instead copy the provided value
to the internal buffer.

A simple sum accumulator could look like this:

```json
{
  "updateProgram": ["if",
      [["eq?", ["input-value"], 0],
          "cold"],
      [true,
          ["seq",
              ["this-set!", ["+", ["current-value"], ["input-value"]]],
              "hot"]]],
  "clearProgram": ["this-set!", 0],
  "getProgram": ["current-value"],
  "setProgram": ["this-set!", ["input-value"]],
  "finalizeProgram": ["current-value"],
}
```

### Global Custom Accumulators

You can upgrade a custom vertex accumulator to a global accumulator as follows.
Before a new superstep begins the global accumulators are distributed to the
DB-Servers by the Coordinator. During the superstep, vertex programs can read from
those accumulators and send messages to them. Those messages are then
accumulated per DB-Server in a cleared version of the accumulator,
i.e. sending a message does call `updateProgram` but the _write accumulator_
is cleared when the superstep begins.

After the superstep the accumulated values are collected by the Coordinator and
then aggregated. Finally the new value of the global accumulator is available
in the `onPostStep` program.

There are more fields, some of them required, involved in when using
accumulator as global accumulator.
- `setStateProgram` this code is executed when the DB-Server receives a
  new value for the global accumulator. `input-state` is available in this
  context. The default implementation replaces the internal state of the
  accumulator with `input-state`.
- `getStateProgram` this code is executed when the Coordinator serializes the
  value of the global accumulator before distributing it to the DB-Servers.
  The default implementation just copies the internal state.
- `getStateUpdateProgram` this code is executed when the DB-Server serializes
  the value of the accumulator during the collect phase, sending
  its result back to the Coordinator.
  The default implementation is to call `getStateProgram`.
- `aggregateStateProgram` this code is executed on the Coordinator after it
  received the _update states_. This code merges the different aggregates.

Coming back to our sum accumulator we would expand it like so:

```js
{
  updateProgram: ["if",
      [["eq?", ["input-value"], 0],
          "cold"],
      [true,
          ["seq",
              ["this-set!", ["+", ["current-value"], ["input-value"]]],
              "hot"]]],
  clearProgram: ["this-set!", 0],
  getProgram: ["current-value"],
  setProgram: ["this-set!", ["input-value"]],
  finalizeProgram: ["current-value"],
  aggregateStateProgram: ["seq",
    ["this-set!", ["+", ["current-value"], ["input-state"]]],
    "hot"
  ],
}
```

Execute a PPA
-------------

Except the precondition to have your custom defined algorithm, the execution
of a PPA follows the basic Pregel implementation. To start a PPA, you need to
require the Pregel module in _arangosh_.

```js
const pregel = require("@arangodb/pregel");
return pregel.start("air", "<graphName>", "<custom-algorithm>");
```

Status of a PPA
---------------

Executing a PPA using the `pregel.start()` method will deliver unique ID to the
status of the algorithm execution.

```js
let pregelID = pregel.start("air", graphName, "<custom-algorithm>");
var status = pregel.status(pregelID);
```

The result will tell you the current status of the algorithm execution. It will
tell you the current state of the execution, the current global superstep, the
runtime, the global aggregator values as well as the number of send and
received messages. Also see
[Status of an algorithm execution](graphs-pregel.html#status-of-an-algorithm-execution).

Additionally, the status objects for custom algorithms is extended and contains
more info as the general pregel one. More details in the next section.

### Error reporting

Before the execution of a PPAs starts, it will be validated and checked for
potential errors. This helps a lot during development. If a PPA fails, the
status will be "fatal error". In that case there will be an additional field
called `reports`. All debugging messages and errors will be listed there.
Also you'll get detailed information when, where and why the error occurred.

Example:

```js
{
  "reports": [{
    "msg": "in phase `init` init-program failed: pregel program returned \"vote-halts\", expecting one of `true`, `false`, `\"vote-halt\", or `\"vote-active\"`\n",
    "level": "error",
    "annotations": {
      "vertex": "LineGraph10_V/0:4020479",
      "pregel-id": {
        "key": "0:4020479",
        "shard": 1
      },
      "phase-step": 0,
      "phase": "init",
      "global-superstep": 0
    }
  }]
}
```

Also we have added a few debugging primitives to help you increase your
developing speed. For example, there is the possibility to add "prints"
to your program. Furthermore have a look at the documentation of the `debug`
field for the algorithm. See [Debug operators](#debug-operators).

Developing a PPA
----------------

There are two ways of developing your PPA. You can either run and develop in
the ArangoShell (as shown above), or you can use the Foxx Service "Pregelator".
The Pregelator can be installed separately and provides a nice UI to write a
PPA, execute it and get direct feedback in both "success" and "error" cases.

### Pregelator

The Pregelator Service is available on GitHub:
<https://github.com/arangodb-foxx/pregelator>{:target="_blank"}

The bundled ZIP files are kept in the directory: `zippedBuilds` and can be
installed via `foxx-cli`, the standard `web-ui` or via `arangosh`.

Examples
--------

As there are almost no limits regarding the definition of a PPA, here we will
provide a basic example of the "vertex-degree" algorithm and demonstrate how
the implementation would look like.

Note: We have implemented also more complex algorithms in PPA to demonstrate
advanced usage. As those are complex algorithms, they are not included as
examples in the documentation. But for the curious ones, they can be found
here:

- [Propagation Demo](https://github.com/arangodb/arangodb/tree/devel/js/client/modules/%40arangodb/air/propagation-demo.js)
- [PageRank](https://github.com/arangodb/arangodb/tree/devel/js/client/modules/%40arangodb/air/pagerank.js)
- [Single Source Shortest Path](https://github.com/arangodb/arangodb/tree/devel/js/client/modules/%40arangodb/air/single-source-shortest-paths.js)
- [Strongly Connected Components](https://github.com/arangodb/arangodb/tree/devel/js/client/modules/%40arangodb/air/strongly-connected-components.js)

### Vertex Degree

The algorithm calculates the vertex degree for incoming and outgoing edges.
First, take a look at the complete vertex degree implementation.
Afterwards we will split things up and go into more details per each
individual section.

```json
{
    "maxGSS": 1,
    "vertexAccumulators": {
      "outDegree": {
        "accumulatorType": "store",
        "valueType": "ints"
      },
      "inDegree": {
        "accumulatorType": "store",
        "valueType": "ints"
      }
    },
    "phases": [{
      "name": "main",
      "initProgram": ["seq",
        ["accum-set!", "outDegree", ["this-outbound-edges-count"]],
        ["accum-set!", "inDegree", 0],
        ["send-to-all-neighbours", "inDegree", 1]
      ],
      "updateProgram": ["seq",
        false]
    }],
    "dataAccess": {
      "writeVertex": [
        "attrib-set", ["attrib-set", ["dict"], "inDegree", ["accum-ref", "inDegree"]],
        "outDegree", ["accum-ref", "outDegree"]
      ]
    }
  }
```

#### Used Accumulators

In the example, we are using two vertex accumulators: `outDegree` and `inDegree`,
as we want to calculate and store two values.

##### outDegree

```json
"outDegree": {
  "accumulatorType": "store",
  "valueType": "ints"
}
```

A vertex knows exactly how many outgoing edges it has by definition. Therefore
we only have to set the amount to an accumulator once and not multiple times.
With that knowledge it makes sense to set the `accumulatorType` to store, as
no further calculations need to take place. As the possible amount of
outgoing edges is integral, we are setting `valueType` to `ints`.

##### inDegree

What a vertex does **not know** is, how many incoming edges it has.
Therefore we need to get them to know that value.

```json
"inDegree": {
  "accumulatorType": "sum",
  "valueType": "ints"
}
```

The choice for `valueType` is equal compared to "outDegree"
because of the same reason. But as you can see, the `accumulatorType` is now
set to `sum`. As our vertices do not know how many incoming edges there are,
each vertex needs to send a message to all outgoing. In our program, a message
will be sent to every neighbor. That means a vertex with **n** neighbors,
will send **n** messages. As in our case, a single message represents a single
incoming edge, we need to add **"+1"** to our accumulator per each message, and
therefor set the `accumulatorType` to `sum`.

#### Program

##### initProgram

```js
initProgram: [
  "seq",

  // Set our outDegree accumulator to ["this-outbound-edges-count"]
  ["accum-set!", "outDegree", ["this-outbound-edges-count"]],

  // Initializes our inDegree (sum) accumulator to 0
  ["accum-set!", "inDegree", 0],

  // Send value: "1" to all neighbors, so their inDegree can be raised next round!
  ["send-to-all-neighbours", "inDegree", 1]
]
```

##### updateProgram

```
updateProgram: ["seq",
  "vote-halt"]
}]
```

As in our case, we do not need an update program. We are just inserting a dummy
(void) method (will be improved in further state). But currently it is necessary,
because our update program needs to run once to accumulate the inDegrees values
that have been sent out in our `initProgram`. Therefore `maxGSS` is set to `2`.

#### Storing the result

To be able to store the result, we either need to define a `resultField`
(which will just store all accumulators into the given resultField attribute)
or create a `<program>` which will take care of our store procedure.
The next code snippet demonstrates how a store program could look like:

```js
"dataAccess": {
  "writeVertex": [
    "dict",
    ["list", "inDegree", ["accum-ref", "inDegree"]],
    ["list", "outDegree", ["accum-ref", "outDegree"]]
  ]
}
```
