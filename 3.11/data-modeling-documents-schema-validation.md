---
layout: default
description: How to enforce attributes and data types for documents using JSON Schema on collection level.
title: Schema Validation for Documents
redirect_from:
  - document-schema-validation.html # referenced in older versions of the web interface
---
Schema Validation
=================

<small>Introduced in: v3.7.1</small>

While ArangoDB is schema-less, it allows to enforce certain document structures
on collection level. The desired structure can be described in the popular
[JSON Schema](https://json-schema.org/){:target="_blank"} format (draft-4,
without remote schema support). The level of validation and a custom error
message can be configured. The system attributes `_key`, `_id`, `_rev`, `_from`
and `_to` are ignored by the schema validation.

Also see [Known Issues](release-notes-known-issues311.html#schema-validation)

Enable schema validation for a collection
-----------------------------------------

Schema validation can be managed via the JavaScript API, typically
using _arangosh_, as well as via the HTTP interface.

To enable schema validation either pass the `schema` property on collection
creation or when updating the properties of an existing collection. It expects an
object with the following attributes: `rule`, `level` and `message`.

- The `rule` attribute must contain the JSON Schema description.
- `level` controls when the validation will be applied.
- `message` sets the message that will be used when validation fails.

```js
var schema = {
  rule: { 
    properties: { nums: { type: "array", items: { type: "number", maximum: 6 } } }, 
    additionalProperties: { type: "string" },
    required: ["nums"]
  },
  level: "moderate",
  message: "The document does not contain an array of numbers in attribute 'nums', or one of the numbers is bigger than 6."
};

/* Create a new collection with schema */
db._create("schemaCollection", { "schema": schema });

/* Update the schema of an existing collection */
db.schemaCollection.properties({ "schema": schema });
```

To remove an existing schema from a collection, a schema value of either `null`
or `{}` (empty object) can be stored:

```js
/* Remove the schema of an existing collection */
db.schemaCollection.properties({ "schema": null });
```

JSON Schema Rule
----------------

The `rule` must be a valid JSON Schema object as outlined in the
[specification](https://json-schema.org/specification.html){:target="_blank"}.
See [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/reference/object.html){:target="_blank"}
for a user guide on how to write JSON Schema descriptions.

System attributes are invisible to the schema validation, i.e. `_key`, `_rev` and `_id`
(in edge collections additionally `_from` and `_to`) do not need to be
specified in the schema. You may set `additionalProperties: false` to only
allow attributes described by the schema. System attributes will not fall under
this restriction.

{% hint 'security' %}
Remote schemas are not supported for security reasons.
{% endhint %}

Levels
------

The level controls when the validation is triggered:

- `none`: The rule is inactive and validation thus turned off.
- `new`: Only newly inserted documents are validated.
- `moderate`: New and modified documents must pass validation, except for
  modified documents where the OLD value did not pass validation already.
  This level is useful if you have documents which do not match your target
  structure, but you want to stop the insertion of more invalid documents
  and prohibit that valid documents are changed to invalid documents.
- `strict`: All new and modified document must strictly pass validation.
  No exceptions are made (default).

Error message
-------------

If the schema validation for a document fails, then a generic error is raised.
The schema validation cannot pin-point which part of a rule made it fail,
also see [Known Issues](release-notes-known-issues311.html#schema-validation).
You may customize the error message via the `message` attribute to provide a
summary of what is expected or point out common mistakes.

Performance
-----------

The schema validation is executed for data-modification operations according
to the levels described above. That means that it can slow down document 
write operations, with more complex schemas typically taking more time for the 
validation than very simple schemas.

Related AQL functions
---------------------

The following AQL functions are available to work with schemas:

 - [SCHEMA_GET()](aql/functions-miscellaneous.html#schema_get)
 - [SCHEMA_VALIDATE()](aql/functions-miscellaneous.html#schema_validate)
