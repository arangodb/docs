---
layout: default
description: This feature allows you to define how sensitive data shall be dumped.
title: arangodump Data Masking
---
# _arangodump_ Data Maskings

`--maskings path-of-config`

This feature allows you to define how sensitive data shall be dumped.
It is possible to exclude collections entirely, limit the dump to the
structural information of a collection (name, indexes, sharding etc.)
or to obfuscate certain fields for a dump. A JSON configuration file is
used to define which collections and fields to mask and how.

The general structure of the configuration file looks like this:

```js
{
  "<collection-name-1>": {
    "type": "<masking-type>",
    "maskings": [ // if masking-type is "masked"
      { "path": "<attr1>", "type": "<masking-function>", ... }, // rule 1
      { "path": "<attr2>", "type": "<masking-function>", ... }, // rule 2
      ...
    ]
  },
  "<collection-name-2>": { ... },
  "<collection-name-3>": { ... },
  "*": { ... }
}
```

At the top level, there is an object with collection names. The masking to be
applied to the respective collection is defined by the `type` sub-attribute.
If the `type` is `"masked"`, then a sibling `maskings` attribute is available
to define rules for obfuscating documents.

Using `"*"` as collection name defines a default behavior for collections
not listed explicitly.

Masking Types
-------------

`type` is a string describing how to mask the given collection.
Possible values are:

- `"exclude"`: the collection is ignored completely and not even the
  structure data is dumped.

- `"structure"`: only the collection structure is dumped, but no data at all
  (the file `<collection-name>.data.json` or `<collection-name>.data.json.gz`
  respectively is still created, but will not contain data).

- `"masked"`: the collection structure and all data is dumped. However, the data
  is subject to obfuscation defined in the attribute `maskings`. It is an array
  of objects, with one object per masking rule. Each object needs at least a
  `path` and a `type` attribute to [define which field to mask](#path) and which
  [masking function](#masking-functions) to apply. Depending on the
  masking type, there may exist additional attributes to control the masking
  function behavior.

- `"full"`: the collection structure and all data is dumped. No masking is
  applied to this collection at all.

**Example**

```json
{
  "private": {
    "type": "exclude"
  },

  "temperature": {
    "type": "full"
  },

  "log": {
    "type": "structure"
  },

  "person": {
    "type": "masked",
    "maskings": [
      {
        "path": "name",
        "type": "xifyFront",
        "unmaskedLength": 2
      },
      {
        "path": ".security_id",
        "type": "xifyFront",
        "unmaskedLength": 2
      }
    ]
  }
}
```

- The collection called _private_ is completely ignored.
- Only the structure of the collection _log_ is dumped, but not the data itself.
- The structure and data of the _temperature_ collection is dumped without any
  obfuscation of document attributes.
- The collection _person_ is dumped completely but with maskings applied:
  - The _name_ field is masked if it occurs on the top-level.
  - It also masks fields with the name _security_id_ anywhere in the document.
  - The masking function is of type [_xifyFront_](#xify-front) in both cases.
    The additional setting `unmaskedLength` is specific so _xifyFront_.
- All additional collections that might exist in the targeted database is
  ignored (like the collection _private_), as there is no attribute key
  `"*"` to specify a different default type for the remaining collections.

### Masking vs. dump-data option

_arangodump_ also supports a very coarse masking with the option
`--dump-data false`, which leaves out all data for the dump.

You can either use `--maskings` or `--dump-data false`, but not both.

### Masking vs. collection option

_arangodump_ also supports a very coarse masking with the option
`--collection`. This restricts the collections that are
dumped to the ones explicitly listed.

It is possible to combine `--maskings` and `--collection`.
This takes the intersection of exportable collections.

Path
----

`path` defines which field to obfuscate. There can only be a single
path per masking, but an unlimited amount of maskings per collection.

```json
{
  "collection1": {
    "type": "masked",
    "maskings": [
      {
        "path": "attr1",
        "type": "random"
      },
      {
        "path": "attr2",
        "type": "randomString"
      },
      ...
    ]
  },
  "collection2": {
    "type": "masked",
    "maskings": [
      {
        "path": "attr3",
        "type": "random"
      }
    ]
  },
  ...
}
```

Top-level **system attributes** (`_key`, `_id`, `_rev`, `_from`, `_to`) are
never masked.

To mask a top-level attribute value, the path is simply the attribute
name, for instance `"name"` to mask the value `"foobar"`:

```json
{
  "_key": "1234",
  "name": "foobar"
}
```

The path to a nested attribute `name` with a top-level attribute `person`
as its parent is `"person.name"` (here: `"foobar"`):

```json
{
  "_key": "1234",
  "person": {
    "name": "foobar"
  }
}
```

Example masking definition:

```json
{
  "<collection-name>": {
    "type": "masked",
    "maskings": [
      {
        "path": "person.name",
        "type": "<masking-function>"
      }
    ]
  }
}
```

If the path starts with a `.` then it matches any path ending in `name`.
For example, `.name` matches the field `name` of all leaf attributes
in the document. Leaf attributes are attributes whose value is `null`,
`true`, `false`, or of data type `string`, `number` or `array`.
That means, it matches `name` at the top level as well as at any nested level
(e.g. `foo.bar.name`), but not nested objects themselves.

On the other hand, `name` only matches leaf attributes
at top level. `person.name` matches the attribute `name` of a leaf
in the top-level object `person`. If `person` was itself an object,
then the masking settings for this path would be ignored, because it
is not a leaf attribute.

If the attribute value is an **array** then the masking is applied to
**all array elements individually**.

The special path `*` matches **all** leaf nodes of a document.

If you have an attribute key that contains a dot (like `{ "name.with.dots": … }`)
or a top-level attribute with a single asterisk as full name (`{ "*": … }`)
then you need to quote the name in ticks or backticks to escape it:

- `"path": "´name.with.dots´"`
- `` "path": "`name.with.dots`" ``
- `"path": "´*´"`
- `` "path": "`*`" ``

**Example**

The following configuration replaces the value of the `name`
attribute with an "xxxx"-masked string:

```json
{
  "type": "xifyFront",
  "path": ".name",
  "unmaskedLength": 2
}
```

The document:

```json
{
  "name": "top-level-name",
  "age": 42,
  "nicknames" : [ { "name": "hugo" }, "egon" ],
  "other": {
    "name": [ "emil", { "secret": "superman" } ]
  }
}
```

… is changed as follows:

```json
{
  "name": "xxxxxxxxxxxxme",
  "age": 42,
  "nicknames" : [ { "name": "xxgo" }, "egon" ],
  "other": {
    "name": [ "xxil", { "secret": "superman" } ]
  }
}
```

The values `"egon"` and `"superman"` are not replaced, because they
are not contained in an attribute value of which the attribute name is
`name`.

### Nested objects and arrays

If you specify a path and the attribute value is an array then the
masking decision is applied to each element of the array as if this
was the value of the attribute. This applies to arrays inside the array too.

If the attribute value is an object, then it is ignored and the attribute
does not get masked. To mask nested fields, specify the full path for each
leaf attribute.

{% hint 'tip' %}
If some documents have an attribute `mail` with a string as value, but other
documents store a nested object under the same attribute name, then make sure
to set up proper masking for the latter case, in which sub-attributes are not
masked if there is only a masking configured for the attribute `mail`
but not its nested attributes.

You can use the special path `"*"` to **match all leaf attributes** in the
document.
{% endhint %}

**Examples**

Masking `mail` with the _Xify Front_ function:

```json
{
  "<collection>": {
    "type": "masked",
    "maskings": [
      {
        "path": "mail",
        "type": "xifyFront"
      }
    ]
  }
}
```

… converts this document:

```json
{
  "mail" : "mail address"
}
```

… into:

```json
{
  "mail" : "xxil xxxxxxss"
}
```

because `mail` is a leaf attribute. The document:

```json
{
  "mail" : [
    "address one",
    "address two",
    [
      "address three"
    ]
  ]
}
```

… is converted into:

```json
{
  "mail" : [
    "xxxxxss xne",
    "xxxxxss xwo",
    [
      "xxxxxss xxxee"
    ]
  ]
}
```

… because the masking is applied to each array element individually
including the elements of the sub-array. The document:

```json
{
  "mail" : {
    "address" : "mail address"
  }
}
```

… is not masked because `mail` is not a leaf attribute.
To mask the mail address, you could use the paths `mail.address`
or `.address` in the masking definition:

```json
{
  "<collection>": {
    "type": "masked",
    "maskings": [
      {
        "path": ".address",
        "type": "xifyFront"
      }
    ]
  }
}
```

A catch-all `"path": "*"` would apply to the nested `address` attribute too,
but it would mask all other string attributes as well, which may not be what
you want. A syntax `"path": "mail.*` to only match the sub-attributes of the
top-level `mail` attribute is not supported.

### Rule precedence

Masking rules may overlap, for instance if you specify the same path multiple
times, or if you define a rule for a specific field but also one which matches
all leaf attributes of the same name.

The precedence is determined by the order in which the rules are defined in the
masking configuration file in such cases, giving priority to the first matching
rule (i.e. the rule above the other ambiguous ones).

```json
{
  "<collection>": {
    "type": "masked",
    "maskings": [
      {
        "path": "address",
        "type": "xifyFront"
      },
      {
        "path": ".address",
        "type": "random"
      }
    ]
  }
}
```

Above masking definition obfuscates the top-level attribute `address` with
the `xifyFront` function, whereas all nested attributes with name `address`
will use the `random` masking function. If the rules are defined in reverse
order however, then all attributes called `address` are obfuscated using
`random`. The second, overlapping rule is effectively ignored:

```json
{
  "<collection>": {
    "type": "masked",
    "maskings": [
      {
        "path": ".address",
        "type": "random"
      },
      {
        "path": "address",
        "type": "xifyFront"
      }
    ]
  }
}
```

This behavior also applies to the catch-all path `"*"`, which means it should
generally be placed below all other rules for a collection so that it is used
for all unspecified attribute paths. Otherwise, all document attributes are
processed by a single masking function, ignoring any other rules below it.

```json
{
  "<collection>": {
    "type": "masked",
    "maskings": [
      {
        "path": "address",
        "type": "random"
      },
      {
        "path": ".address",
        "type": "xifyFront"
      },
      {
        "path": "*",
        "type": "email"
      }
    ]
  }
}
```

Masking Functions
-----------------

{% include hint-ee-arangograph.md feature="The following masking functions" plural=true %}

- [Xify Front](#xify-front)
- [Zip](#zip)
- [Datetime](#datetime)
- [Integer Number](#integer-number)
- [Decimal Number](#decimal-number)
- [Credit Card Number](#credit-card-number)
- [Phone Number](#phone-number)
- [Email Address](#email-address)

The masking functions:

- [Random String](#random-string)
- [Random](#random)

… are available in the Community Edition as well as the Enterprise Edition.

### Random String

This masking type replaces all values of attributes whose values are strings
with key `name` with an anonymized string. It is not guaranteed that the
string is of the same length. Attribute whose values are not strings
are not modified.

A hash of the original string is computed. If the original string is
shorter, then the hash is used. This results in a longer
replacement string. If the string is longer than the hash, then
characters are repeated as many times as needed to reach the full
original string length.

Masking settings:

- `path` (string): which field to mask
- `type` (string): masking function name `"randomString"`

**Example**

```json
{
  "path": ".name",
  "type": "randomString"
}
```

Above masking setting applies to all leaf attributes with name `.name`.
A document like:

```json
{
  "_key" : "1234",
  "name" : [
    "My Name",
    {
      "other" : "Hallo Name"
    },
    [
      "Name One",
      "Name Two"
    ],
    true,
    false,
    null,
    1.0,
    1234,
    "This is a very long name"
  ],
  "deeply": {
    "nested": {
      "name": "John Doe",
      "not-a-name": "Pizza"
    }
  }
}
```

… is converted to:

```json
{
  "_key": "1234",
  "name": [
    "+y5OQiYmp/o=",
    {
      "other": "Hallo Name"
    },
    [
      "ihCTrlsKKdk=",
      "yo/55hfla0U="
    ],
    true,
    false,
    null,
    1.0,
    1234,
    "hwjAfNe5BGw=hwjAfNe5BGw="
  ],
  "deeply": {
    "nested": {
      "name": "55fHctEM/wY=",
      "not-a-name": "Pizza"
    }
  }
}
```

### Random

This masking type substitutes leaf attribute values of all data types with
random values of the same kind:

- Strings are replaced with [random strings](#random-string).
- Numbers are replaced with random integer or decimal numbers, depending on
  the original value (but not keeping sign or scientific notation).
  The generated numbers are between -1000 and 1000.
- Booleans are randomly replaced with `true` or `false`.
- `null` values remain `null`.

Masking settings:

- `path` (string): which field to mask
- `type` (string): masking function name `"random"`

**Examples**

```json
{
  "collection": {
    "type": "masked",
    "maskings": [
      {
        "path": "*",
        "type": "random"
      }
    ]
  }
}
```

Using above masking configuration, all leaf attributes of the documents in
_collection_ would be randomized. A possible input document:

```json
{
  "_key" : "1121535",
  "_id" : "coll/1121535",
  "_rev" : "_Z3AKGjW--_",
  "nullValue" : null,
  "bool" : true,
  "int" : 1,
  "decimal" : 2.34,
  "string" : "hello",
  "array" : [
    null,
    false,
    true,
    0,
    -123,
    0.45,
    6e7,
    -0.8e-3,
    "nine",
    "Lorem ipsum sit dolor amet.",
    [
      false,
      false
    ],
    {
      "obj" : "nested"
    }
  ]
}
```

… could result in an output like this:

```json
{
  "_key": "1121535",
  "_id": "coll/1121535",
  "_rev": "_Z3AKGjW--_",
  "nullValue": null,
  "bool": false,
  "int": -900,
  "decimal": -4.27,
  "string": "etxfOC+K0HM=",
  "array": [
    null,
    true,
    false,
    754,
    -692,
    2.64,
    834,
    1.69,
    "NGf7NKGrMYw=",
    "G0czIlvaGw4=G0czIlvaGw4=G0c",
    [
      false,
      true
    ],
    {
      "obj": "eCGe36xiRho="
    }
  ]
}
```

### Xify Front

This masking type replaces the front characters with `x` and
blanks. Alphanumeric characters, `_` and `-` are replaced by `x`,
everything else is replaced by a blank.

Masking settings:

- `path` (string): which field to mask
- `type` (string): masking function name `"xifyFront"`
- `unmaskedLength` (number, _default: `2`_): how many characters to
  leave as-is on the right-hand side of each word as integer value
- `hash` (bool, _default: `false`_): whether to append a hash value to the
  masked string to avoid possible unique constraint violations caused by
  the obfuscation
- `seed` (integer, _default: `0`_): used as secret for computing the hash.
  A value of `0` means a random seed

**Examples**

```json
{
  "<collection>": {
    "type": "masked",
    "maskings": [
      {
        "path": ".name",
        "type": "xifyFront",
        "unmaskedLength": 2
      }
    ]
  }
}
```

This affects attributes with key `"name"` at any level by masking all
alphanumeric characters of a word except the last two characters. Words of
length 1 and 2 remain unmasked. If the attribute value is not a string but
boolean or numeric, then the result is `"xxxx"` (fixed length).
`null` values remain `null`.

```json
{
  "name": "This is a test!Do you agree?",
  "bool": true,
  "number": 1.23,
  "null": null
}
```

… becomes:

```json
{
  "name": "xxis is a xxst Do xou xxxee ",
  "bool": "xxxx",
  "number": "xxxx",
  "null": null
}
```

There is a catch. If you have an index on the attribute the masking
might distort the index efficiency or even cause errors in case of a
unique index.

```json
{
  "path": ".name",
  "type": "xifyFront",
  "unmaskedLength": 2,
  "hash": true
}
```

This adds a hash at the end of the string.

```
"This is a test!Do you agree?"
```

… becomes

```
"xxis is a xxst Do xou xxxee  NAATm8c9hVQ="
```

Note that the hash is based on a random secret that is different for
each run. This avoids dictionary attacks which could be used to guess
values based pre-computations on dictionaries.

If you need reproducible results, i.e. hashes that do not change between
different runs of _arangodump_, you need to specify a secret as seed,
a number which must not be `0`.

```json
{
  "path": ".name",
  "type": "xifyFront",
  "unmaskedLength": 2,
  "hash": true,
  "seed": 246781478647
}
```

### Zip

This masking type replaces a zip code with a random one.
It uses the following rules:

- If a character of the original zip code is a digit, it is replaced
  by a random digit.
- If a character of the original zip code is a letter, it
  is replaced by a random letter keeping the case.
- If the attribute value is not a string then the default value is used.

Note that this generates random zip codes. Therefore there is a
chance that the same zip code value is generated multiple times, which can
cause unique constraint violations if a unique index is or will be
used on the zip code attribute.

Masking settings:

- `path` (string): which field to mask
- `type` (string): masking function name `"zip"`
- `default` (string, _default: `"12345"`_): if the input field is not of
  data type `string`, then this value is used

**Examples**

```json
{
  "path": ".code",
  "type": "zip",
}
```

This replaces real zip codes stored in fields called `code` at any level
with random ones. `"12345"` is used as fallback value.

```json
{
  "path": ".code",
  "type": "zip",
  "default": "abcdef"
}
```

If the original zip code is:

```
50674
```

… it is replaced by e.g.:

```
98146
```

If the original zip code is:

```
SA34-EA
```

… it is replaced by e.g.:

```
OW91-JI
```

If the original zip code is `null`, `true`, `false` or a number, then the
user-defined default value of `"abcdef"` is used.

### Datetime

This masking type replaces the value of the attribute with a random
date between two configured dates in a customizable format.

Masking settings:

- `path` (string): which field to mask
- `type` (string): masking function name `"datetime"`
- `begin` (string, _default: `"1970-01-01T00:00:00.000"`_):
  earliest point in time to return. Date time string in ISO 8601 format.
- `end` (string, _default: now_):
  latest point in time to return. Date time string in ISO 8601 format.
  In case a partial date time string is provided (e.g. `2010-06` without day
  and time) the earliest date and time is assumed (`2010-06-01T00:00:00.000`).
  The default value is the current system date and time.
- `format` (string, _default: `""`_): the formatting string format is
  described in [DATE_FORMAT()](aql/functions-date.html#date_format).
  If no format is specified, then the result is an empty string.

**Example**

```json
{
  "path": "eventDate",
  "type": "datetime",
  "begin" : "2019-01-01",
  "end": "2019-12-31",
  "format": "%yyyy-%mm-%dd",
}
```

Above example masks the field `eventDate` by returning a random date time
string in the range of January 1st and December 31st in 2019 using a format
like `2019-06-17`.

### Integer Number

This masking type replaces the value of the attribute with a random
integer number. It replaces the value even if it is a string,
Boolean, or `null`.

Masking settings:

- `path` (string): which field to mask
- `type` (string): masking function name `"integer"`
- `lower` (number, _default: `-100`_): smallest integer value to return
- `upper` (number, _default: `100`_): largest integer value to return

**Example**

```json
{
  "path": "count",
  "type": "integer",
  "lower" : -100,
  "upper": 100
}
```

This masks the field `count` with a random number between
-100 and 100 (inclusive).

### Decimal Number

This masking type replaces the value of the attribute with a random
floating point number. It replaces the value even if it is a string,
Boolean, or `null`.

Masking settings:

- `path` (string): which field to mask
- `type` (string): masking function name `"decimal"`
- `lower` (number, _default: `-1`_): smallest floating point value to return
- `upper` (number, _default: `1`_): largest floating point value to return
- `scale` (number, _default: `2`_): maximal amount of digits in the
  decimal fraction part

**Examples**

```json
{
  "path": "rating",
  "type": "decimal",
  "lower" : -0.3,
  "upper": 0.3
}
```

This masks the field `rating` with a random floating point number between
-0.3 and +0.3 (inclusive). By default, the decimal has a scale of 2.
That means, it has at most 2 digits after the dot.

The configuration:

```json
{
  "path": "rating",
  "type": "decimal",
  "lower" : -0.3,
  "upper": 0.3,
  "scale": 3
}
```

… generates numbers with at most 3 decimal digits.

### Credit Card Number

This masking type replaces the value of the attribute with a random
credit card number (as integer number).
See [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm){:target="_blank"}
for details.

Masking settings:

- `path` (string): which field to mask
- `type` (string): masking function name `"creditCard"`

**Example**

```json
{
  "path": "ccNumber",
  "type": "creditCard"
}
```

This generates a random credit card number to mask field `ccNumber`,
e.g. `4111111414443302`.

### Phone Number

This masking type replaces a phone number with a random one.
It uses the following rule:

- If a character of the original number is a digit
  it is replaced by a random digit.
- If it is a letter it is replaced by a random letter.
- All other characters are left unchanged.
- If the attribute value is not a string it is replaced by the
  default value.

Masking settings:

- `path` (string): which field to mask
- `type` (string): masking function name `"phone"`
- `default` (string, _default: `"+1234567890"`_): if the input field
  is not of data type `string`, then this value is used

**Examples**

```json
{
  "path": "phone.landline",
  "type": "phone"
}
```

This replaces an existing phone number with a random one, for instance
`"+31 66-77-88-xx"` might get substituted by `"+75 10-79-52-sb"`.

```json
{
  "path": "phone.landline",
  "type": "phone",
  "default": "+49 12345 123456789"
}
```

This masks a phone number as before, but falls back to a different default
phone number in case the input value is not a string.

### Email Address

This masking type takes an email address, computes a hash value and
splits it into three equal parts `AAAA`, `BBBB`, and `CCCC`. The
resulting email address is in the format `AAAA.BBBB@CCCC.invalid`.
The hash is based on a random secret that is different for each run.

Masking settings:

- `path` (string): which field to mask
- `type` (string): masking function name `"email"`

**Example**

```json
{
  "path": ".email",
  "type": "email"
}
```

This masks every leaf attribute `email` with a random email address
similar to `"EHwG.3AOg@hGU=.invalid"`.
