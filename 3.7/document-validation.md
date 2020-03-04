---
layout: default
description: How to validate documents in modifying operations.
title: Document Validation
---
Document Validation
===================

In order to allow users to enforce a certain structure of stored data ArangoDB
has introduced validation on collection level. At the moment we provide support
JSON Schema (draft-4) as format to describe the desired structure.


Enable Validation for a collection
----------------------------------

To enable the validation for a collection the new `validation` property/option
has to be used. The value of the `validation` attribute must be a object
containing the following sub-attributes: `rule`, `level` and `message`. The
`rule` must contain the schema description. `level` controls when the
validation will be applied. And `message` sets the message that will be
displayed when the validation fails. The validation can be activated on
collection creation or later by setting the property:


```js
let validation =
{ rule : { properties : { nums : { type : "array"
                                 , items : { type : "number", maximum : 6 }
                                 }
                        }
         , additionalProperties : { type : "string" }
         , required: ["nums"]
         }
, level : "moderate"
, message : "The modified or new document does not contain an array of numbers in attribute 'nums'
             or one of the numbers is bigger than 6."
}

// new collection
db.create("new_collection", { "validation" : validation })

// existing collection
db.existing_collection.properties({ "validation" : validation })
```

Levels
------

The level controls when the validation is trigged. Available levels are: `none`, `new`,
`moderate` and `insert. They have the following meanings:

- `none`: The rule is inactive
- `new`: Only newly inserted documents are validated.
- `moderate`: New and modified documents must pass validation. Except for
  modified documents where the OLD value already did not pass validation. This
  level is useful if you have data that does not match your target structure,
  but you want to improve and avoid the insertion of more data that is not in
  the correct format.
- `strict`: All modified document must strictly pass validation. No exceptions
  are made.

Rule - JSON Schema
------------------

The `rule` must be a valid JSON Schema description as outlined in the
[specification](https://json-schema.org/specification.html). Furthermore
reading the [understanding JSON Schema
](https://json-schema.org/understanding-json-schema/reference/object.html)
guide on objects might be helpful when trying to write validation rules for the
first time.
