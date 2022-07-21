---
layout: default
description: >-
  You can configure collections to generate document attributes when documents
  are created or modified, using an AQL expression
---
# Computed Values

{{ page.description }}
{:class="lead"}

<small>Introduced in: v3.10.0</small>

If you want to add default values to new documents, maintain auxiliary
attributes for search queries, or similar, you can set these attributes manually
in every operation that inserts or modifies documents. However, it is more
convenient and reliable to let the database system take care of it.

The computed values feature lets you define expressions on the collection level
that run on inserts, modifications, or both. You can access the data of the
current document to compute new values using a subset of AQL. The result of each
expression becomes the value of a top-level attribute. These attributes are
stored like any other attribute, which means that you may use them in indexes,
but also that the schema validation is applied if you use one.

Possible use cases are to add timestamps of the creation or last modification to
every document, or to automatically combine multiple attributes into one,
possibly with filtering and a conversion to lowercase characters, to then index
the attribute and use it to perform case-insensitive searches.

## Using Computed Values

Computed values are defined per collection using the `computedFields` property,
either when creating the collection or by modifying the collection later on.
If you add or modify computed value definitions at a later point, then they only
affect subsequent write operations. Existing documents remain in their state.

Computed value definitions are included in dumps, and the attributes they added,
too, but no expressions are executed when restoring dumps. The collections and
documents are restored as they are in the dump and no attributes are recalculated.

## JavaScript API

The `computedFields` collection property accepts an array of objects.

`db._create(<collection-name>, { computedFields: [ { … }, … ] })`

`db.<collection-name>.properties({ computedFields: [ { … }, … ] })`

Each object represents a computed value and can have the following attributes:

- `name` (string, _required_):
  The name of the target attribute. Can only be a top-level attribute, but you
  may return a nested object. Cannot be `_key`, `_id`, `_rev`, `_from`, `_to`,
  or a shard key attribute.

- `expression` (string, _required_):
  An AQL `RETURN` operation with an expression that computes the desired value.
  See [Computed Value Expressions](#computed-value-expressions) for details.

- `override` (boolean, _required_):
  Whether the computed value shall take precedence over a user-provided or
  existing attribute.

- `computeOn` (array, _optional_):
  An array of strings to define on which write operations the value shall be
  computed. The possible values are `"insert"`, `"update"`, and `"replace"`.
  The default is `["insert", "update", "replace"]`.

- `keepNull` (boolean, _optional_):
  Whether the result of the expression shall be stored if it evaluates to `null`.
  You can set it to `false` and let the expression return `null` to skip the
  value computation if any pre-conditions are not met. The default is `true`.

- `failOnWarning` (boolean, _optional_):
  Whether to let the write operation fail if the expression produces a warning.
  The default is `false`.

## HTTP API

See the `computedFields` collection property in the HTTP API documentation for
[Creating Collections](http/collection-creating.html) and
[Modifying Collections](http/collection-modifying.html).

## Computed Value Expressions

You can use a subset of AQL for computed values, namely a single
[`RETURN` operation](aql/operations-return.html) with an expression that
computes the value. 

You can access the document data via the `@doc` bind variable. It contains the
data as it will be stored, including the `_key`, `_id`, and `_rev`
system attributes. On inserts, you get the user-provided values (plus the
system attributes), and on modifications, you get the updated or replaced
document to work with.

Computed value expressions have the following properties:

- The expression must start with a `RETURN` operation and cannot contains any
  other operations. No `FOR` loops, `LET` statements, and subqueries are allowed
  in the expression. `FOR` loops can be substituted using the
  [array expansion operator `[*]`](aql/advanced-array-operators.html#inline-expressions),
  for example, with an inline expressions like the following:

  `RETURN @doc.values[* FILTER CURRENT > 42 RETURN CURRENT * 2]`

- You cannot access any stored data other than the current document via the
  `@doc` bind parameter. AQL functions that read from the database system cannot
  be used in the expression (e.g. `DOCUMENT()`, `PREGEL_RESULT()`,
  `COLLECTION_COUNT()`).

- You cannot access the result of another computed value that is generated on
  the same `computeOn` event.
  
  For example, two computed values that are generated on `insert` can not see
  the result of the other. Referencing the attributes results in an implicit
  `null` value. Computed values that are generated on `update` or `replace` can
  see the results of the previous `insert` computations, however. They cannot
  see the new values of other `update` and `replace` computations, regardless of
  the order of the computed value definitions in the `computedFields` property.

- You can use AQL functions in the expression but only those that can be
  executed on DB-Servers, regardless of your deployment type. The following
  functions cannot be used in the expression:
  - `CALL()`
  - `APPLY()`
  - `DOCUMENT()`
  - `V8()`
  - `SCHEMA_GET()`
  - `SCHEMA_VALIDATE()`
  - `VERSION()`
  - `COLLECTIONS()`
  - `CURRENT_USER()`
  - `CURRENT_DATABASE()`
  - `COLLECTION_COUNT()`
  - `NEAR()`
  - `WITHIN()`
  - `WITHIN_RECTANGLE()`
  - `FULLTEXT()`
  - [User-defined functions (UDFs)](aql/extending.html)

## Examples

Add an attribute with the creation timestamp to new documents:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline computedValuesCreatedAt
    @EXAMPLE_ARANGOSH_OUTPUT{computedValuesCreatedAt}
    | db._create("users", {
    |   computedValues: [
    |     {
    |       name: "createdAt",
    |       expression: "RETURN DATE_NOW()",
    |       override: true,
    |       computeOn: ["insert"]
    |     }
    |   ]
      });
      db.users.save({ name: "Paula Plant" });
      db.users.toArray();
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock computedValuesCreatedAt
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Add an attribute with the date and time of the last modification, only taking
update and replace operations into (not inserts), and allowing to manually
set this value instead of using the computed value:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline computedValuesModifiedAt
    @EXAMPLE_ARANGOSH_OUTPUT{computedValuesModifiedAt}
    | db._create("users", {
    |   computedValues: [
    |     {
    |       name: "modifiedAt",
    |       expression: "RETURN ZIP(['date', 'time'], SPLIT(DATE_ISO8601(DATE_NOW()), 'T'))",
    |       override: false,
    |       computeOn: ["update", "replace"]
    |     }
    |   ]
      });
      db.users.save({ _key: "123", name: "Paula Plant" });
      db.users.update("123", { email: "gardener@arangodb.com" });
      db.users.toArray();
      db.users.update("123", { email: "greenhouse@arangodb.com", modifiedAt: { date: "2019-01-01", time: "20:30:00.000Z" } });
      db.users.toArray();
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock computedValuesModifiedAt
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Compute an attribute from two arrays, filtering one of the lists, and calculating
new values to implement a case-insensitive search using a persistent array index:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline computedValuesSubattribute
    @EXAMPLE_ARANGOSH_OUTPUT{computedValuesSubattribute}
    | db._create("users", {
    |   computedValues: [
    |     {
    |       name: "searchTags",
    |       expression: "RETURN APPEND(@doc.is[* FILTER CURRENT.public == true RETURN LOWER(CURRENT.name)], @doc.loves[* RETURN LOWER(CURRENT)])",
    |       override: true
    |     }
    |   ]
      });
      db.users.save({ name: "Paula Plant", is: [ { name: "Gardener", public: true }, { name: "female" } ], loves: ["AVOCADOS", "Databases"] });
      db.users.ensureIndex({ type: "persistent", fields: ["searchTags[*]"] });
      db._query(`FOR u IN users FILTER "avocados" IN u.searchTags RETURN u`).toArray();
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock computedValuesSubattribute
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Add a computed value as a sub-attribute to documents. This is not possible
directly because the target attribute needs to be a top-level attribute, but the
AQL expression can merge a nested object with the top-level attribute to achieve
this. The expression checks whether the attributes it wants to calculate a new
value from exist and are strings. It returns `null` if they do not meet the
preconditions, to skip the computation using `keepNull: false`:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline computedValuesSubattribute
    @EXAMPLE_ARANGOSH_OUTPUT{computedValuesSubattribute}
    | db._create("users", {
    |   computedValues: [
    |     {
    |       name: "name",
    |       expression: "RETURN IS_STRING(@doc.name.first) AND IS_STRING(@doc.name.last) ? MERGE(@doc.name, { 'full': CONCAT_SEPARATOR(' ', @doc.name.first, @doc.name.last) }) : null",
    |       override: false,
    |       keepNull: false
    |     }
    |   ]
      });
      db.users.save({ name: { first: "James" });
      db.users.save({ name: { first: "Andy", last: "Bennett", full: "Andreas J. Bennett" });
      db.users.save({ name: { first: "Paula", last: "Plant" } });
      db.users.toArray();
    ~ db._drop("users");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock computedValuesSubattribute
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}
