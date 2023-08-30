---
layout: default
description: >-
  Avoid injection vulnerabilities and avoid pitfalls like incorrect operator
  usage performance issues when using ArangoDB's query language
---
Common Errors in AQL
=============

{{ page.description }}
{:class="lead"}

Trailing semicolons in query strings
------------------------------------

Many SQL databases allow sending multiple queries at once. In this case, multiple
queries are separated using the semicolon character. Often it is also supported to
execute a single query that has a semicolon at its end.

AQL does not support this, and it is a parse error to use a semicolon at the end
of an AQL query string.

String concatenation
--------------------

In AQL, strings must be concatenated using the [CONCAT()](functions-string.html#concat)
function. Joining them together with the `+` operator is not supported. Especially
as JavaScript programmer it is easy to walk into this trap:

```aql
RETURN "foo" + "bar" // [ 0 ]
RETURN "foo" + 123   // [ 123 ]
RETURN "123" + 200   // [ 323 ]
```

The arithmetic plus operator expects numbers as operands, and will try to implicitly
cast them to numbers if they are of different type. `"foo"` and `"bar"` are casted
to `0` and then added to together (still zero). If an actual number is added, that
number will be returned (adding zero doesn't change the result). If the string is a
valid string representation of a number, then it is casted to a number. Thus, adding
`"123"` and `200` results in two numbers being added up to `323`.

To concatenate elements (with implicit casting to string for non-string values), do:

```aql
RETURN CONCAT("foo", "bar") // [ "foobar" ]
RETURN CONCAT("foo", 123)   // [ "foo123" ]
RETURN CONCAT("123", 200)   // [ "123200" ]
```

Parameter injection vulnerability
---------------------------------

Parameter injection means that potentially malicious content is inserted into a
query which may change its meaning. It is a security issue that may allow an
attacker to execute arbitrary queries on the database data.

It often occurs if applications trustfully insert user-provided inputs into a
query string, and do not fully or incorrectly filter them. It also occurs often
when applications build queries naively, without using security mechanisms often
provided by database software or querying mechanisms.

AQL is not vulnerable to parameter injection in itself, but queries might be
constructed on the client-side, on an application server or in a Foxx service.
Assembling query strings with simple **string concatenation** looks trivial,
but is potentially **unsafe**. You should use
[bind parameters](fundamentals-bind-parameters.html) instead whenever possible,
use query building functionality if provided by a driver (see
[arangojs AQL Helpers](http://arangodb.github.io/arangojs/latest/modules/_aql_.aql.html){:target="_blank"}
for example) or at least sanitize user input with great care.

### Parameter injection examples

Below you find a simple query using the [JavaScript API](../javascript-api.html)
that is fed with some dynamic input value, pretending it coming from a web form.
This could be the case in a Foxx service. The route happily picks up the input
value, and puts it into a query:

```js
// evil!
var what = req.params("searchValue");  // user input value from web form
// ...
var query = "FOR doc IN collection FILTER doc.value == " + what + " RETURN doc";
db._query(query, params).toArray();
```

The above will probably work fine for numeric input values.

What could an attacker do to this query? Here are a few suggestions to use for
the `searchValue` parameter:

- for returning all documents in the collection:<br>
  `1 || true`
- for removing all documents:<br>
  `1 || true REMOVE doc IN collection //`
- for inserting new documents:<br>
  `1 || true INSERT { foo: "bar" } IN collection //`

It should have become obvious that this is extremely unsafe and should be
avoided. A pattern often seen to counteract this is trying to quote and escape
potentially unsafe input values before putting them into query strings.
This may work in some situations, but it is easy to overlook something or get
it subtly wrong:

```js
// We are sanitizing now, but it is still evil!
var value = req.params("searchValue").replace(/'/g, '');
// ...
var query = "FOR doc IN collection FILTER doc.value == '" + value + "' RETURN doc";
db._query(query, params).toArray();
```

The above example uses single quotes for enclosing the potentially unsafe user
input, and also replaces all single quotes in the input value beforehand.
Not only may that change the user input (leading to subtle errors such as
_"why does my search for `O'Brien` not return any results?"_), but it is
also still unsafe. If the user input contains a backslash at the end
(e.g. `foo bar\`), that backslash will escape the closing single quote,
allowing the user input to break out of the string fence again.

It gets worse if user input is inserted into the query at multiple places.
Let us assume we have a query with two dynamic values:

```js
query = "FOR doc IN collection FILTER doc.value == '" + value +
        "' && doc.type == '" + type + "' RETURN doc";
```

If an attacker inserted `\` for parameter `value` and
` || true REMOVE doc IN collection //` for parameter `type`, then the effective
query would become:

```aql
FOR doc IN collection
  FILTER doc.value == '\' && doc.type == ' || true
  REMOVE doc IN collection //' RETURN doc
```

… which is highly undesirable. The backslash escapes the closing single quote,
turning the `doc.type` condition into a string, which gets compared to
`doc.value`. Further more, an always true or-condition as well as a remove
operation are injected, changing the query purpose entirely. The original
return operation gets commented out and the query will truncate the collection
instead of returning a few documents.

### Avoiding parameter injection

Instead of mixing query string fragments with user inputs naively via string
concatenation, use either **bind parameters** or a **query builder**. Both can
help to avoid the problem of injection, because they allow separating the actual
query operations (like `FOR`, `INSERT`, `REMOVE`) from (user input) values.

Below, the focus is on bind parameters. This is not to say that query builders
shouldn't be used. They were simply omitted here for the sake of simplicity.

#### What bind parameters are

Bind parameters in AQL queries are special tokens that act as placeholders for
actual values. Here's an example:

```aql
FOR doc IN collection
  FILTER doc.value == @what
  RETURN doc
```

In the above query, `@what` is a bind parameter. In order to execute this query,
a value for bind parameter `@what` must be specified. Otherwise query execution will
fail with error 1551 (*no value specified for declared bind parameter*). If a value
for `@what` gets specified, the query can be executed. However, the query string
and the bind parameter values (i.e. the contents of the `@what` bind parameter) will
be handled separately. What's in the bind parameter will always be treated as a value,
and it can't get out of its sandbox and change the semantic meaning of a query.

#### How bind parameters are used

To execute a query with bind parameters, the query string (containing the bind
parameters) and the bind parameter values are specified separately (note that when
the bind parameter value is assigned, the prefix `@` needs to be omitted):

```js
// query string with bind parameter
var query = "FOR doc IN collection FILTER doc.value == @what RETURN doc";

// actual value for bind parameter
var params = { what: 42 };

// run query, specifying query string and bind parameter separately
db._query(query, params).toArray();
```

If a malicious user would set `@what` to a value of `1 || true`, this wouldn't do
any harm. AQL would treat the contents of `@what` as a single string token, and
the meaning of the query would remain unchanged. The actually executed query would be:

```aql
FOR doc IN collection
  FILTER doc.value == "1 || true"
  RETURN doc
```

Thanks to bind parameters it is also impossible to turn a selection (i.e. read-only)
query into a data deletion query.

#### Using JavaScript variables as bind parameters

There is also a template string generator function `aql` that can be used to safely
(and conveniently) built AQL queries using JavaScript variables and expressions. It
can be invoked as follows:

```js
const aql = require('@arangodb').aql; // not needed in arangosh

var value = "some input value";
var query = aql`FOR doc IN collection
  FILTER doc.value == ${value}
  RETURN doc`;
var result = db._query(query).toArray();
```

Note that an ES6 template string is used for populating the `query` variable.
The string is assembled using the `aql` generator function which is bundled
with ArangoDB. The template string can contain references to JavaScript
variables or expressions via `${...}`. In the above example, the query
references a variable named `value`. The `aql` function generates an object
with two separate attributes: the query string, containing references to
bind parameters, and the actual bind parameter values.

Bind parameter names are automatically generated by the `aql` function:

```js
var value = "some input value";
aql`FOR doc IN collection FILTER doc.value == ${value} RETURN doc`;

{
  "query" : "FOR doc IN collection FILTER doc.value == @value0 RETURN doc",
  "bindVars" : {
    "value0" : "some input value"
  }
}
```

#### Using bind parameters in dynamic queries

Bind parameters are helpful, so it makes sense to use them for handling the
dynamic values. You can even use them for queries that itself are highly
dynamic, for example with conditional `FILTER` and `LIMIT` parts.
Here's how to do this:

```js
// Note: this example has a slight issue... hang on reading
var query = "FOR doc IN collection";
var params = { };

if (useFilter) {
  query += " FILTER doc.value == @what";
  params.what = req.params("searchValue");
}

if (useLimit) {
  // not quite right, see below
  query += " LIMIT @offset, @count";
  params.offset = req.params("offset");
  params.count = req.params("count");
}

query += " RETURN doc";
db._query(query, params).toArray();
```

Note that in this example we're back to string concatenation, but without the
problem of the query being vulnerable to arbitrary modifications.

#### Input value validation and sanitation

Still you should prefer to be paranoid, and try to detect invalid input values
as early as possible, at least before executing a query with them. This is
because some input parameters may affect the runtime behavior of queries
negatively or, when modified, may lead to queries throwing runtime errors
instead of returning valid results. This isn't something an attacker
should deserve.

`LIMIT` is a good example for this: if used with a single argument, the
argument should be numeric. When `LIMIT` is given a string value, executing
the query will fail. You may want to detect this early and don't return an
HTTP 500 (as this would signal attackers that they were successful breaking
your application).

Another problem with `LIMIT` is that high `LIMIT` values are likely more
expensive than low ones, and you may want to disallow using `LIMIT` values
exceeding a certain threshold.

Here is what you could do in such cases:

```js
var query = "FOR doc IN collection LIMIT @count RETURN doc";

// some default value for limit
var params = { count: 100 };

if (useLimit) {
  var count = req.params("count");

  // abort if value does not look like an integer
  if (! preg_match(/^d+$/, count)) {
    throw "invalid count value!";
  }

  // actually turn it into an integer
  params.count = parseInt(count, 10); // turn into numeric value
}

if (params.count < 1 || params.count > 1000) {
  // value is outside of accepted thresholds
  throw "invalid count value!";
}

db._query(query, params).toArray();
```

This is a bit more complex, but that is a price you are likely willing to pay
for a bit of extra safety. In reality you may want to use a framework for
validation (such as [joi](https://www.npmjs.com/package/joi){:target="_blank"}
which comes bundled with ArangoDB) instead of writing your own checks all over
the place.

#### Bind parameter types

There are two types of bind parameters in AQL:

- Bind parameters for **values**:<br>
  Those are prefixed with a single `@` in AQL queries, and are specified
  without the prefix when they get their value assigned. These bind parameters
  can contain any valid JSON value.

  Examples: `@what`, `@searchValue`

- Bind parameters for **collections**:<br>
  These are prefixed with `@@` in AQL queries, and are replaced with the name
  of a collection. When the bind parameter value is assigned, the parameter
  itself must be specified with a single `@` prefix. Only string values are
  allowed for this type of bind parameters.

  Examples: `@@collection`, `@@edgeColl`

The latter type of bind parameter is probably not used as often, and it should
not be used together with user input. Otherwise users may freely determine on
which collection your AQL queries will operate on (this might be a valid
use case, but normally it is extremely undesired).

Unexpected long running queries
-------------------------------

Slow queries can have various reasons and be legitimate for queries with a high
computational complexity or if they touch a lot of data. Use the *Explain*
feature to inspect execution plans and verify that appropriate indexes are
utilized. Also check for mistakes such as references to the wrong variables.

A literal collection name, which is not part of constructs like `FOR`,
`UPDATE ... IN` etc., stands for an array of all documents of that collection
and can cause an entire collection to be materialized before further
processing. It should thus be avoided.

Check the execution plan for `/* all collection documents */` and verify that
it is intended. You should also see a warning if you execute such a query:

> collection 'coll' used as expression operand

For example, instead of:

```aql
RETURN coll[* LIMIT 1]
```

... with the execution plan ...

```aql
Execution plan:
 Id   NodeType          Est.   Comment
  1   SingletonNode        1   * ROOT
  2   CalculationNode      1     - LET #2 = coll   /* all collection documents */[* LIMIT  0, 1]   /* v8 expression */
  3   ReturnNode           1     - RETURN #2
```

... you can use the following equivalent query:

```aql
FOR doc IN coll
    LIMIT 1
    RETURN doc
```

... with the (better) execution plan:

```aql
Execution plan:
 Id   NodeType                  Est.   Comment
  1   SingletonNode                1   * ROOT
  2   EnumerateCollectionNode     44     - FOR doc IN Characters   /* full collection scan */
  3   LimitNode                    1       - LIMIT 0, 1
  4   ReturnNode                   1       - RETURN doc
```

Similarly, make sure you have not confused any variable names with collection
names by accident:

```aql
LET names = ["John", "Mary", ...]
// supposed to refer to variable "names", not collection "Names"
FOR name IN Names
    ...
```

You can set the startup option `--query.allow-collections-in-expressions` to
*false* to disallow collection names in arbitrary places in AQL expressions
to prevent such mistakes. Also see
[ArangoDB Server Query Options](../programs-arangod-options.html#--queryallow-collections-in-expressions)

{%- comment %}
Rename to Error Sources?

Quote marks around bind parameter placeholders
https://github.com/arangodb/arangodb/issues/1634#issuecomment-167808660

FILTER HAS(doc, "attr") instead of FILTER doc.attr / FILTER doc.attr != null

collection ... not found error, e.g. access of variable after COLLECT (no longer existing)
{% endcomment %}
