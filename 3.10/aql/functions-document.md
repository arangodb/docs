---
layout: default
description: AQL provides below listed functions to operate on objects / document values
---
Document functions
==================

AQL provides below listed functions to operate on objects / document values.
Also see [object access](fundamentals-data-types.html#objects--documents) for
additional language constructs.

ATTRIBUTES()
------------

`ATTRIBUTES(document, removeInternal, sort) → strArray`

Return the top-level attribute keys of the `document` as an array.
Optionally omit system attributes and sort the array.

- **document** (object): an arbitrary document / object
- **removeInternal** (bool, *optional*): whether all system attributes (`_key`, `_id` etc.,
  every attribute key that starts with an underscore) shall be omitted in the result.
  The default is `false`.
- **sort** (bool, *optional*): optionally sort the resulting array alphabetically.
  The default is `false` and will return the attribute names in any order.
- returns **strArray** (array): the attribute keys of the input `document` as an
  array of strings

**Examples**

Return the attribute keys of an object:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlAttributes
    @EXAMPLE_AQL{aqlAttributes}
    RETURN ATTRIBUTES( { "foo": "bar", "_key": "123", "_custom": "yes" } )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlAttributes
    {% endaqlexample %}
    {% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

Return the attribute keys of an object but omit system attributes:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlAttributesRemoveInternal
    @EXAMPLE_AQL{aqlAttributesRemoveInternal}
    RETURN ATTRIBUTES( { "foo": "bar", "_key": "123", "_custom": "yes" }, true )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlAttributesRemoveInternal
    {% endaqlexample %}
    {% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

Return the attribute keys of an object in alphabetic order:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlAttributesSort
    @EXAMPLE_AQL{aqlAttributesSort}
    RETURN ATTRIBUTES( { "foo": "bar", "_key": "123", "_custom": "yes" }, false, true )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlAttributesSort
    {% endaqlexample %}
    {% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

Complex example to count how often every top-level attribute key occurs in the
documents of a collection (expensive on large collections):

```js
LET attributesPerDocument = (
    FOR doc IN collection RETURN ATTRIBUTES(doc, true)
)
FOR attributeArray IN attributesPerDocument
    FOR attribute IN attributeArray
        COLLECT attr = attribute WITH COUNT INTO count
        SORT count DESC
        RETURN {attr, count}
```

COUNT()
-------

This is an alias for [LENGTH()](#length).

HAS()
-----

`HAS(document, attributeName) → isPresent`

Test whether an attribute is present in the provided document.

- **document** (object): an arbitrary document / object
- **attributeName** (string): the attribute key to test for
- returns **isPresent** (bool): `true` if `document` has an attribute named
  `attributeName`, and `false` otherwise. Also returns `true` if the attribute
  has a falsy value (`null`, `0`, `false`, empty string `""`)

The function checks if the specified attribute exists, regardless of its value.
Other ways of testing for the existence of an attribute may behave differently
if the attribute has a falsy value or is not present (implicitly `null` on
object access):

```js
!!{ name: "" }.name        // false
HAS( { name: "" }, "name") // true

{ name: null }.name == null   // true
{ }.name == null              // true
HAS( { name: null }, "name" ) // true
HAS( { }, "name" )            // false
```

Note that `HAS()` can not utilize indexes. If it is not necessary to distinguish
between explicit and implicit *null* values in your query, you may use an equality
comparison to test for *null* and create a non-sparse index on the attribute you
want to test against:

```js
FILTER !HAS(doc, "name")    // can not use indexes
FILTER IS_NULL(doc, "name") // can not use indexes
FILTER doc.name == null     // can utilize non-sparse indexes
```

**Examples**

Check whether the example object has a `name` the attribute key:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlHas1
    @EXAMPLE_AQL{aqlHas1}
    RETURN HAS( { name: "Jane" }, "name" )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlHas1
    {% endaqlexample %}

Check whether the example object has an `age` attribute key:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlHas2
    @EXAMPLE_AQL{aqlHas2}
    RETURN HAS( { name: "Jane" }, "age" )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlHas2
    {% endaqlexample %}

Falsy attribute values like `null` still count as the attribute being present:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlHas3
    @EXAMPLE_AQL{aqlHas3}
    RETURN HAS( { name: null }, "name" )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlHas3
    {% endaqlexample %}

IS_SAME_COLLECTION()
--------------------

`IS_SAME_COLLECTION(collectionName, documentHandle) → isSame`

Test whether the `documentHandle` has `collectionName` as collection.

The function does not validate whether the collection actually contains the
specified document. It only compares the name of the specified collection
with the collection name part of the specified document.

- **collectionName** (string): the name of a collection as string
- **documentHandle** (string\|object): a document identifier string
  (e.g. `_users/1234`) or an object with an `_id` attribute (e.g. a document
  from a collection).
- returns **isSame** (bool): `true` if the collection of `documentHandle` is the
  same as `collectionName`, or `false` if it is not. If `documentHandle` is an
  object without an `_id` attribute or anything other than a string or object,
  then `null` is returned and a warning is raised.

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlIsSameCollection
    @EXAMPLE_AQL{aqlIsSameCollection}
    RETURN [
      IS_SAME_COLLECTION( "_users", "_users/my-user" ),
      IS_SAME_COLLECTION( "_users", { _id: "_users/my-user" } ),
      IS_SAME_COLLECTION( "_users", "foobar/baz"),
      IS_SAME_COLLECTION( "_users", { _id: "something/else" } )
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlIsSameCollection
    {% endaqlexample %}

KEEP()
------

`KEEP(document, attributeName1, attributeName2, ... attributeNameN) → doc`

Keep only the attributes `attributeName` to `attributeNameN` of `document`.
All other attributes will be removed from the result.

To do the opposite, see [UNSET()](#unset).

- **document** (object): a document / object
- **attributeNames** (string, *repeatable*): an arbitrary number of attribute
  names as multiple arguments
- returns **doc** (object): a document with only the specified attributes at
  the top-level

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlKeep1
    @EXAMPLE_AQL{aqlKeep1}
    LET doc = { foo: { bar: { foo: 1, baz: 2 }, baz: 3 }, baz: 4 }
    RETURN [
      KEEP(doc, "foo"),
      KEEP(doc, "bar"),
      KEEP(doc, "baz"),
      KEEP(doc, "foo", "baz")
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlKeep1
    {% endaqlexample %}

---

`KEEP(document, attributeNameArray) → doc`

- **document** (object): a document / object
- **attributeNameArray** (array): an array of attribute names as strings
- returns **doc** (object): a document with only the specified attributes at
  the top-level

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlKeep2
    @EXAMPLE_AQL{aqlKeep2}
    LET doc = { foo: { bar: { foo: 1, baz: 2 }, baz: 3 }, baz: 4 }
    RETURN [
      KEEP(doc, ["foo"]),
      KEEP(doc, ["bar"]),
      KEEP(doc, ["baz"]),
      KEEP(doc, ["foo", "baz"])
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlKeep2
    {% endaqlexample %}


KEEP_RECURSIVE()
----------------

`KEEP_RECURSIVE(document, attributeName1, attributeName2, ... attributeNameN) → doc`

Recursively keep the attributes `attributeName1` to `attributeNameN` from
`document` and its sub-documents. All other attributes will be removed.

To do the opposite, use [UNSET_RECURSIVE()](#unset_recursive).

- **document** (object): a document / object
- **attributeNames** (string, *repeatable*): an arbitrary number of attribute
  names as multiple arguments (at least 1)
- returns **doc** (object): `document` with only the specified attributes at
  all levels (top-level as well as nested objects)

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlKeepRecursive1
    @EXAMPLE_AQL{aqlKeepRecursive1}
    LET doc = { foo: { bar: { foo: 1, baz: 2 }, baz: 3 }, baz: 4 }
    RETURN [
      KEEP_RECURSIVE(doc, "foo"),
      KEEP_RECURSIVE(doc, "bar"),
      KEEP_RECURSIVE(doc, "baz"),
      KEEP_RECURSIVE(doc, "foo", "bar"),
      KEEP_RECURSIVE(doc, "foo", "baz"),
      KEEP_RECURSIVE(doc, "foo", "bar", "baz")
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlKeepRecursive1
    {% endaqlexample %}

---

`KEEP_RECURSIVE(document, attributeNameArray) → doc`

- **document** (object): a document / object
- **attributeNameArray** (array): an array of attribute names as strings
- returns **doc** (object): *document* with only the specified attributes at
  all levels (top-level as well as nested objects)

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlKeepRecursive2
    @EXAMPLE_AQL{aqlKeepRecursive2}
    LET doc = { foo: { bar: { foo: 1, baz: 2 }, baz: 3 }, baz: 4 }
    RETURN [
      KEEP_RECURSIVE(doc, ["foo"]),
      KEEP_RECURSIVE(doc, ["bar"]),
      KEEP_RECURSIVE(doc, ["baz"]),
      KEEP_RECURSIVE(doc, ["foo", "bar"]),
      KEEP_RECURSIVE(doc, ["foo", "baz"]),
      KEEP_RECURSIVE(doc, ["foo", "bar", "baz"])
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlKeepRecursive2
    {% endaqlexample %}

LENGTH()
--------

`LENGTH(doc) → attrCount`

Determine the number of attribute keys of an object / document.

`LENGTH()` can also determine the [number of elements](functions-array.html#length) in an array,
the [amount of documents](functions-miscellaneous.html#length) in a collection and
the [character length](functions-string.html#length) of a string.

- **doc** (object): a document / object
- returns **attrCount** (number): the number of attribute keys in `doc`, regardless
  of their values

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlLengthObject
    @EXAMPLE_AQL{aqlLengthObject}
    RETURN LENGTH({ name: "Emma", age: 36, phone: { mobile: "..." } })
    @END_EXAMPLE_AQL
    @endDocuBlock aqlLengthObject
    {% endaqlexample %}

MATCHES()
---------

`MATCHES(document, examples, returnIndex) → match`

Compare the given `document` against each example document provided. The comparisons
will be started with the first example. All attributes of the example will be compared
against the attributes of `document`. If all attributes match, the comparison stops
and the result is returned. If there is a mismatch, the function will continue the
comparison with the next example until there are no more examples left.

The `examples` can be an array of 1..n example documents or a single document,
with any number of attributes each.

An attribute value of `null` will match documents with an explicit attribute value
of `null` as well as documents with this attribute missing (implicitly `null`).
Only [HAS()](#has) can differentiate between an attribute being absent and having
a stored `null` value.

An empty object `{}` will match all documents. Be careful not to ask for all
documents accidentally. For example, the [arangojs](../drivers/js.html) driver
skips attributes with a value of `undefined`, turning `{attr: undefined}` into `{}`.

{% hint 'info' %}
`MATCHES()` can not utilize indexes. You may use plain `FILTER` conditions instead
to potentially benefit from existing indexes:

```js
FOR doc IN coll
  FILTER (cond1 AND cond2 AND cond3) OR (cond4 AND cond5) ...
```
{% endhint %}

- **document** (object): document to determine whether it matches any example
- **examples** (object\|array): a single document, or an array of documents to compare
  against. Specifying an empty array is not allowed.
- **returnIndex** (bool): by setting this flag to `true`, the index of the example that
  matched will be returned (starting at offset 0), or `-1` if there was no match.
  The default is `false` and makes the function return a boolean.
- returns **match** (bool\|number): if `document` matches one of the examples, `true` is
  returned, otherwise `false`. A number is returned instead if `returnIndex` is enabled.

**Examples**

Check whether all attributes of the example are present in the document:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlMatches1
    @EXAMPLE_AQL{aqlMatches1}
    LET doc = {
      name: "jane",
      age: 27,
      active: true
    }
    RETURN MATCHES(doc, { age: 27, active: true } )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlMatches1
    {% endaqlexample %}

Check whether one of the examples matches the document and return the index of
the matching example:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlMatches2
    @EXAMPLE_AQL{aqlMatches2}
    RETURN MATCHES(
      { "test": 1 },
      [
        { "test": 1, "foo": "bar" },
        { "foo": 1 },
        { "test": 1 }
      ],
    true)
    @END_EXAMPLE_AQL
    @endDocuBlock aqlMatches2
    {% endaqlexample %}

MERGE()
-------

`MERGE(document1, document2, ... documentN) → mergedDocument`

Merge the documents `document1` to `documentN` into a single document.
If document attribute keys are ambiguous, the merged result will contain the values
of the documents contained later in the argument list.

Note that merging will only be done for top-level attributes. If you wish to
merge sub-attributes, use [MERGE_RECURSIVE()](#merge_recursive) instead.

- **documents** (object, *repeatable*): an arbitrary number of documents as
  multiple arguments (at least 2)
- returns **mergedDocument** (object): a combined document

**Examples**

Two documents with distinct attribute names can easily be merged into one:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlMerge1
    @EXAMPLE_AQL{aqlMerge1}
    RETURN MERGE(
      { "user1": { "name": "Jane" } },
      { "user2": { "name": "Tom" } }
    )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlMerge1
    {% endaqlexample %}

When merging documents with identical attribute names, the attribute values of the
latter documents will be used in the end result:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlMerge2
    @EXAMPLE_AQL{aqlMerge2}
    RETURN MERGE(
      { "users": { "name": "Jane" } },
      { "users": { "name": "Tom" } }
    )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlMerge2
    {% endaqlexample %}

---

`MERGE(docArray) → mergedDocument`

`MERGE()` also accepts a single array parameter. This variant allows combining the
attributes of multiple objects in an array into a single object.

- **docArray** (array): an array of documents, as sole argument
- returns **mergedDocument** (object): a combined document

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlMerge3
    @EXAMPLE_AQL{aqlMerge3}
    RETURN MERGE(
      [
        { foo: "bar" },
        { quux: "quetzalcoatl", ruled: true },
        { bar: "baz", foo: "done" }
      ]
    )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlMerge3
    {% endaqlexample %}

MERGE_RECURSIVE()
-----------------

`MERGE_RECURSIVE(document1, document2, ... documentN) → mergedDocument`

Recursively merge the documents `document1` to `documentN` into a single document.
If document attribute keys are ambiguous, the merged result will contain the values
of the documents contained later in the argument list.

- **documents** (object, *repeatable*): an arbitrary number of documents as
  multiple arguments (at least 2)
- returns **mergedDocument** (object): a combined document

`MERGE_RECURSIVE()` does not support the single array parameter variant that
`MERGE()` offers.

**Examples**

Two documents with distinct attribute names can easily be merged into one:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlMerge3
    @EXAMPLE_AQL{aqlMerge3}
    RETURN MERGE_RECURSIVE(
      { "user-1": { "name": "Jane", "livesIn": { "city": "LA" } } },
      { "user-1": { "age": 42, "livesIn": { "state": "CA" } } }
    )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlMerge3
    {% endaqlexample %}

PARSE_IDENTIFIER()
------------------

`PARSE_IDENTIFIER(documentHandle) → parts`

Parse a [document handle](../appendix-glossary.html#document-handle) and return its
individual parts as separate attributes.

This function can be used to easily determine the
[collection name](../appendix-glossary.html#collection-name) and key of a given document.

- **documentHandle** (string\|object): a document identifier string (e.g. `_users/1234`)
  or a regular document from a collection. Passing either a non-string or a non-document
  or a document without an `_id` attribute will result in an error.
- returns **parts** (object): an object with the attributes *collection* and *key*

**Examples**

Parse a document identifier string:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlParseIdentifier1
    @EXAMPLE_AQL{aqlParseIdentifier1}
    RETURN PARSE_IDENTIFIER("_users/my-user")
    @END_EXAMPLE_AQL
    @endDocuBlock aqlParseIdentifier1
    {% endaqlexample %}

Parse the document identifier string of a document (`_id` attribute):

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlParseIdentifier2
    @EXAMPLE_AQL{aqlParseIdentifier2}
    RETURN PARSE_IDENTIFIER( { "_id": "mycollection/mykey", "value": "some value" } )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlParseIdentifier2
    {% endaqlexample %}

TRANSLATE()
-----------

`TRANSLATE(value, lookupDocument, defaultValue) → mappedValue`

Look up the specified `value` in the `lookupDocument`. If `value` is a key in
`lookupDocument`, then `value` will be replaced with the lookup value found.
If `value` is not present in `lookupDocument`, then `defaultValue` will be returned
if specified. If no `defaultValue` is specified, `value` will be returned unchanged.

- **value** (string): the value to encode according to the mapping
- **lookupDocument** (object): a key/value mapping as document
- **defaultValue** (any, *optional*): a fallback value in case `value` is not found
- returns **mappedValue** (any): the encoded value, or the unaltered `value` or `defaultValue`
  (if supplied) in case it could not be mapped

**Examples**

Translate a country code to a country name:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlTranslate1
    @EXAMPLE_AQL{aqlTranslate1}
    RETURN TRANSLATE("FR", { US: "United States", UK: "United Kingdom", FR: "France" } )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlTranslate1
    {% endaqlexample %}

The unaltered input value is returned if no match is found in the mapping:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlTranslate2
    @EXAMPLE_AQL{aqlTranslate2}
    RETURN TRANSLATE(42, { foo: "bar", bar: "baz" } )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlTranslate2
    {% endaqlexample %}

If you specify a fallback value and no match is found in the mapping, then the
fallback value returned instead of the input value:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlTranslate3
    @EXAMPLE_AQL{aqlTranslate3}
    RETURN TRANSLATE(42, { foo: "bar", bar: "baz" }, "not found!")
    @END_EXAMPLE_AQL
    @endDocuBlock aqlTranslate3
    {% endaqlexample %}

Note that any non-string input value is implicitly cast to a string before the
lookup:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlTranslate4
    @EXAMPLE_AQL{aqlTranslate4}
    RETURN TRANSLATE(42, { "42": true } )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlTranslate4
    {% endaqlexample %}

UNSET()
-------

`UNSET(document, attributeName1, attributeName2, ... attributeNameN) → doc`

Remove the attributes `attributeName1` to `attributeNameN` from `document`.
All other attributes will be preserved.

To do the opposite, see [KEEP()](#keep).

- **document** (object): a document / object
- **attributeNames** (string, *repeatable*): an arbitrary number of attribute
  names as multiple arguments (at least 1)
- returns **doc** (object): `document` without the specified attributes at the
  top-level

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlUnset1
    @EXAMPLE_AQL{aqlUnset1}
    LET doc = { foo: { bar: { foo: 1, baz: 2 }, baz: 3 }, baz: 4 }
    RETURN [
      UNSET(doc, "foo"),
      UNSET(doc, "bar"),
      UNSET(doc, "baz"),
      UNSET(doc, "foo", "baz")
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlUnset1
    {% endaqlexample %}

---

`UNSET(document, attributeNameArray) → doc`

- **document** (object): a document / object
- **attributeNameArray** (array): an array of attribute names as strings
- returns **doc** (object): *document* without the specified attributes at the
  top-level

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlUnset2
    @EXAMPLE_AQL{aqlUnset2}
    LET doc = { foo: { bar: { foo: 1, baz: 2 }, baz: 3 }, baz: 4 }
    RETURN [
      UNSET(doc, ["foo"]),
      UNSET(doc, ["bar"]),
      UNSET(doc, ["baz"]),
      UNSET(doc, ["foo", "baz"])
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlUnset2
    {% endaqlexample %}


UNSET_RECURSIVE()
-----------------

`UNSET_RECURSIVE(document, attributeName1, attributeName2, ... attributeNameN) → doc`

Recursively remove the attributes `attributeName1` to `attributeNameN` from
`document` and its sub-documents. All other attributes will be preserved.

To do the opposite, use [KEEP_RECURSIVE()](#keep_recursive).

- **document** (object): a document / object
- **attributeNames** (string, *repeatable*): an arbitrary number of attribute
  names as multiple arguments (at least 1)
- returns **doc** (object): `document` without the specified attributes at
  all levels (top-level as well as nested objects)

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlUnsetRecursive1
    @EXAMPLE_AQL{aqlUnsetRecursive1}
    LET doc = { foo: { bar: { foo: 1, baz: 2 }, baz: 3 }, baz: 4 }
    RETURN [
      UNSET_RECURSIVE(doc, "foo"),
      UNSET_RECURSIVE(doc, "bar"),
      UNSET_RECURSIVE(doc, "baz"),
      UNSET_RECURSIVE(doc, "foo", "bar"),
      UNSET_RECURSIVE(doc, "foo", "baz"),
      UNSET_RECURSIVE(doc, "foo", "bar", "baz")
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlUnsetRecursive1
    {% endaqlexample %}

---

`UNSET_RECURSIVE(document, attributeNameArray) → doc`

- **document** (object): a document / object
- **attributeNameArray** (array): an array of attribute names as strings
- returns **doc** (object): *document* without the specified attributes at
  all levels (top-level as well as nested objects)

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlUnsetRecursive2
    @EXAMPLE_AQL{aqlUnsetRecursive2}
    LET doc = { foo: { bar: { foo: 1, baz: 2 }, baz: 3 }, baz: 4 }
    RETURN [
      UNSET_RECURSIVE(doc, ["foo"]),
      UNSET_RECURSIVE(doc, ["bar"]),
      UNSET_RECURSIVE(doc, ["baz"]),
      UNSET_RECURSIVE(doc, ["foo", "bar"]),
      UNSET_RECURSIVE(doc, ["foo", "baz"]),
      UNSET_RECURSIVE(doc, ["foo", "bar", "baz"])
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlUnsetRecursive2
    {% endaqlexample %}

VALUES()
--------

`VALUES(document, removeInternal) → anyArray`

Return the attribute values of the `document` as an array. Optionally omit
system attributes.

- **document** (object): a document / object
- **removeInternal** (bool, *optional*): if set to `true`, then all internal attributes
  (such as `_id`, `_key` etc.) are removed from the result
- returns **anyArray** (array): the values of `document` returned in any order

**Examples**

Get the attribute values of an object:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlValues1
    @EXAMPLE_AQL{aqlValues1}
    RETURN VALUES( { "_key": "users/jane", "name": "Jane", "age": 35 } )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlValues1
    {% endaqlexample %}

Get the attribute values of an object, omitting system attributes:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlValues2
    @EXAMPLE_AQL{aqlValues2}
    RETURN VALUES( { "_key": "users/jane", "name": "Jane", "age": 35 }, true )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlValues2
    {% endaqlexample %}

ZIP()
-----

`ZIP(keys, values) → doc`

Return a document object assembled from the separate parameters `keys` and `values`.

`keys` and `values` must be arrays and have the same length.

- **keys** (array): an array of strings, to be used as attribute names in the result
- **values** (array): an array with elements of arbitrary types, to be used as
  attribute values
- returns **doc** (object): a document with the keys and values assembled

**Examples**

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlZip
    @EXAMPLE_AQL{aqlZip}
    RETURN ZIP( [ "name", "active", "hobbies" ], [ "some user", true, [ "swimming", "riding" ] ] )
    @END_EXAMPLE_AQL
    @endDocuBlock aqlZip
    {% endaqlexample %}
