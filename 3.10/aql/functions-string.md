---
layout: default
description: For string processing, AQL offers the following functions
---
String functions
================

For string processing, AQL offers the following functions:

CHAR_LENGTH()
-------------

`CHAR_LENGTH(str) → length`

Return the number of characters in `str` (not byte length).

| Input  | Length |
|--------|--------|
| String | Number of Unicode characters |
| Number | Number of Unicode characters that represent the number |
| Array  | Number of Unicode characters from the resulting stringification |
| Object | Number of Unicode characters from the resulting stringification |
| true   | 4 |
| false  | 5 |
| null   | 0 |

- **str** (string): a string. If a number is passed, it will be casted to string first.
- returns **length** (number): the character length of `str` (not byte length)

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlCharLength_1
@EXAMPLE_AQL{aqlCharLength_1}
  RETURN CHAR_LENGTH("foo")
@END_EXAMPLE_AQL
@endDocuBlock aqlCharLength_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlCharLength_2
@EXAMPLE_AQL{aqlCharLength_2}
  LET value = {foo: "bar"}
  RETURN {
    str: JSON_STRINGIFY(value),
    len: CHAR_LENGTH(value)
  }
@END_EXAMPLE_AQL
@endDocuBlock aqlCharLength_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

CONCAT()
--------

`CONCAT(value1, value2, ... valueN) → str`

Concatenate the values passed as `value1` to `valueN`.

- **values** (any, *repeatable*): elements of arbitrary type (at least 1)
- returns **str** (string): a concatenation of the elements. `null` values
  are ignored. Array and object values are JSON-encoded in their entirety.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatStrings_1
@EXAMPLE_AQL{aqlConcatStrings_1}
  RETURN CONCAT("foo", "bar", "baz")
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatStrings_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatNumbers_1
@EXAMPLE_AQL{aqlConcatNumbers_1}
  RETURN CONCAT(1, 2, 3)
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatNumbers_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatPrimitiveTypes_1
@EXAMPLE_AQL{aqlConcatPrimitiveTypes_1}
  RETURN CONCAT(null, false, 0, true, "")
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatPrimitiveTypes_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatCompoundTypes_1
@EXAMPLE_AQL{aqlConcatCompoundTypes_1}
  RETURN CONCAT([5, 6], {foo: "bar"})
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatCompoundTypes_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

`CONCAT(anyArray) → str`

If a single array is passed to `CONCAT()`, its members are concatenated.

- **anyArray** (array): array with elements of arbitrary type
- returns **str** (string): a concatenation of the array elements. `null` values
  are ignored. Array and object values are JSON-encoded in their entirety.

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatStrings_2
@EXAMPLE_AQL{aqlConcatStrings_2}
  RETURN CONCAT( [ "foo", "bar", "baz" ] )
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatStrings_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatNumbers_2
@EXAMPLE_AQL{aqlConcatNumbers_2}
  RETURN CONCAT( [1, 2, 3] )
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatNumbers_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatPrimitiveTypes_2
@EXAMPLE_AQL{aqlConcatPrimitiveTypes_2}
  RETURN CONCAT( [null, false, 0, true, ""] )
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatPrimitiveTypes_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatCompoundTypes_2
@EXAMPLE_AQL{aqlConcatCompoundTypes_2}
  RETURN CONCAT( [[5, 6], {foo: "bar"}] )
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatCompoundTypes_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

CONCAT_SEPARATOR()
------------------

`CONCAT_SEPARATOR(separator, value1, value2, ... valueN) → joinedString`

Concatenate the strings passed as arguments `value1` to `valueN` using the
*separator* string.

- **separator** (string): an arbitrary separator string
- **values** (string\|array, *repeatable*): strings or arrays of strings as multiple
  arguments (at least 1)
- returns **joinedString** (string): a concatenated string of the elements, using
  `separator` as separator string. `null` values are ignored. Array and object
  values are JSON-encoded in their entirety.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatSeparatorStrings_1
@EXAMPLE_AQL{aqlConcatSeparatorStrings_1}
  RETURN CONCAT_SEPARATOR(", ", "foo", "bar", "baz")
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatSeparatorStrings_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatSeparatorNumbers_1
@EXAMPLE_AQL{aqlConcatSeparatorNumbers_1}
  RETURN CONCAT_SEPARATOR(", ", 1, 2, 3)
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatSeparatorNumbers_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatSeparatorPrimitiveTypes_1
@EXAMPLE_AQL{aqlConcatSeparatorPrimitiveTypes_1}
  RETURN CONCAT_SEPARATOR(", ", null, false, 0, true, "")
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatSeparatorPrimitiveTypes_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatSeparatorCompoundTypes_1
@EXAMPLE_AQL{aqlConcatSeparatorCompoundTypes_1}
  RETURN CONCAT_SEPARATOR(", ", [5, 6], {foo: "bar"})
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatSeparatorCompoundTypes_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

`CONCAT_SEPARATOR(separator, anyArray) → joinedString`

If a single array is passed as second argument to `CONCAT_SEPARATOR()`, its
members are concatenated.

- **separator** (string): an arbitrary separator string
- **anyArray** (array): array with elements of arbitrary type
- returns **joinedString** (string): a concatenated string of the elements, using
  `separator` as separator string. `null` values are ignored. Array and object
  values are JSON-encoded in their entirety.

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatSeparatorStrings_2
@EXAMPLE_AQL{aqlConcatSeparatorStrings_2}
  RETURN CONCAT_SEPARATOR(", ", ["foo", "bar", "baz"])
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatSeparatorStrings_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatSeparatorNumbers_2
@EXAMPLE_AQL{aqlConcatSeparatorNumbers_2}
  RETURN CONCAT_SEPARATOR(", ", [1, 2, 3])
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatSeparatorNumbers_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatSeparatorPrimitiveTypes_2
@EXAMPLE_AQL{aqlConcatSeparatorPrimitiveTypes_2}
  RETURN CONCAT_SEPARATOR(", ", [null, false, 0, true, ""])
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatSeparatorPrimitiveTypes_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlConcatSeparatorCompoundTypes_2
@EXAMPLE_AQL{aqlConcatSeparatorCompoundTypes_2}
  RETURN CONCAT_SEPARATOR(", ", [[5, 6], {foo: "bar"}])
@END_EXAMPLE_AQL
@endDocuBlock aqlConcatSeparatorCompoundTypes_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

CONTAINS()
----------

`CONTAINS(text, search, returnIndex) → match`

Check whether the string `search` is contained in the string `text`.
The string matching performed by `CONTAINS()` is case-sensitive.

To determine if or at which position a value is included in an **array**, see the
[POSITION() array function](functions-array.html#position).

- **text** (string): the haystack
- **search** (string): the needle
- **returnIndex** (bool, *optional*): if set to `true`, the character position
  of the match is returned instead of a boolean. The default is `false`.
- returns **match** (bool\|number): by default, `true` is returned if `search`
  is contained in `text`, and `false` otherwise. With `returnIndex` set to `true`,
  the position of the first occurrence of `search` within `text` is returned 
  (starting at offset 0), or `-1` if it is not contained.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlContainsMatch
@EXAMPLE_AQL{aqlContainsMatch}
  RETURN CONTAINS("foobarbaz", "bar")
@END_EXAMPLE_AQL
@endDocuBlock aqlContainsMatch
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlContains
@EXAMPLE_AQL{aqlContainsNoMatch}
  RETURN CONTAINS("foobarbaz", "horse")
@END_EXAMPLE_AQL
@endDocuBlock aqlContainsNoMatch
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlContainsMatchIndex
@EXAMPLE_AQL{aqlContainsMatchIndex}
  RETURN CONTAINS("foobarbaz", "bar", true)
@END_EXAMPLE_AQL
@endDocuBlock aqlContainsMatchIndex
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlContainsNoMatchIndex
@EXAMPLE_AQL{aqlContainsNoMatchIndex}
  RETURN CONTAINS("foobarbaz", "horse", true)
@END_EXAMPLE_AQL
@endDocuBlock aqlContainsNoMatchIndex
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

COUNT()
-------

This is an alias for [LENGTH()](#length).

CRC32()
-------

`CRC32(text) → hash`

Calculate the CRC32 checksum for `text` and return it in a hexadecimal
string representation. The polynomial used is `0x1EDC6F41`. The initial
value used is `0xFFFFFFFF`, and the final XOR value is also `0xFFFFFFFF`.

- **text** (string): a string
- returns **hash** (string): CRC32 checksum as hex string

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlCrc32
@EXAMPLE_AQL{aqlCrc32}
  RETURN CRC32("foobar")
@END_EXAMPLE_AQL
@endDocuBlock aqlCrc32
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

ENCODE_URI_COMPONENT()
----------------------

`ENCODE_URI_COMPONENT(value) → encodedString`

Return the URI component-encoded string of `value`.

- **value** (string): a string
- returns **encodedString** (string): the URI component-encoded `value`

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlEncodeUriComponent
@EXAMPLE_AQL{aqlEncodeUriComponent}
  RETURN ENCODE_URI_COMPONENT("fünf %")
@END_EXAMPLE_AQL
@endDocuBlock aqlEncodeUriComponent
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

FIND_FIRST()
------------

`FIND_FIRST(text, search, start, end) → position`

Return the position of the first occurrence of the string `search` inside the
string `text`. Positions start at 0.

- **text** (string): the haystack
- **search** (string): the needle
- **start** (number, *optional*): limit the search to a subset of the text,
  beginning at `start`
- **end** (number, *optional*): limit the search to a subset of the text,
  ending at `end`
- returns **position** (number): the character position of the match. If `search`
  is not contained in `text`, -1 is returned. If `search` is empty, `start` is returned.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlFindFirst_1
@EXAMPLE_AQL{aqlFindFirst_1}
  RETURN FIND_FIRST("foobarbaz", "ba")
@END_EXAMPLE_AQL
@endDocuBlock aqlFindFirst_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlFindFirst_2
@EXAMPLE_AQL{aqlFindFirst_2}
  RETURN FIND_FIRST("foobarbaz", "ba", 4)
@END_EXAMPLE_AQL
@endDocuBlock aqlFindFirst_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlFindFirst_3
@EXAMPLE_AQL{aqlFindFirst_3}
  RETURN FIND_FIRST("foobarbaz", "ba", 0, 3)
@END_EXAMPLE_AQL
@endDocuBlock aqlFindFirst_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

FIND_LAST()
-----------

`FIND_LAST(text, search, start, end) → position`

Return the position of the last occurrence of the string `search` inside the
string `text`. Positions start at 0.

- **text** (string): the haystack
- **search** (string): the needle
- **start** (number, *optional*): limit the search to a subset of the text,
  beginning at *start*
- **end** (number, *optional*): limit the search to a subset of the text,
  ending at *end*
- returns **position** (number): the character position of the match. If `search`
  is not contained in `text`, -1 is returned.
  If `search` is empty, the string length is returned, or `end` + 1.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlFindLast_1
@EXAMPLE_AQL{aqlFindLast_1}
  RETURN FIND_LAST("foobarbaz", "ba")
@END_EXAMPLE_AQL
@endDocuBlock aqlFindLast_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlFindLast_2
@EXAMPLE_AQL{aqlFindLast_2}
  RETURN FIND_LAST("foobarbaz", "ba", 7)
@END_EXAMPLE_AQL
@endDocuBlock aqlFindLast_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlFindLast_3
@EXAMPLE_AQL{aqlFindLast_3}
  RETURN FIND_LAST("foobarbaz", "ba", 0, 4)
@END_EXAMPLE_AQL
@endDocuBlock aqlFindLast_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

FNV64()
-------

`FNV64(text) → hash`

Calculate the FNV-1A 64 bit hash for `text` and return it in a hexadecimal
string representation.

- **text** (string): a string
- returns **hash** (string): FNV-1A hash as hex string

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlFnv64
@EXAMPLE_AQL{aqlFnv64}
  RETURN FNV64("foobar")
@END_EXAMPLE_AQL
@endDocuBlock aqlFnv64
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

IPV4_FROM_NUMBER()
------------------

<small>Introduced in: v3.7.2</small>

`IPV4_FROM_NUMBER(numericAddress) → stringAddress`

Converts a numeric IPv4 address value into its string representation.

- **numericAddress** (number): a numeric representation of an IPv4 address, for
  example produced by [IPV4_TO_NUMBER()](#ipv4_to_number). The number must be
  an unsigned integer between 0 and 4294967295 (both inclusive).
- returns **stringAddress** (string): the string representation of the IPv4
  address. If the input `numberAddress` is not a valid representation of an
  IPv4 address, the function returns `null` and produces a warning.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIPv4FromNumber_1
@EXAMPLE_AQL{aqlIPv4FromNumber_1}
  RETURN IPV4_FROM_NUMBER(0)
@END_EXAMPLE_AQL
@endDocuBlock aqlIPv4FromNumber_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIPv4FromNumber_2
@EXAMPLE_AQL{aqlIPv4FromNumber_2}
  RETURN IPV4_FROM_NUMBER(134744072)
@END_EXAMPLE_AQL
@endDocuBlock aqlIPv4FromNumber_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIPv4FromNumber_3
@EXAMPLE_AQL{aqlIPv4FromNumber_3}
  RETURN IPV4_FROM_NUMBER(2130706433)
@END_EXAMPLE_AQL
@endDocuBlock aqlIPv4FromNumber_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIPv4FromNumber_4
@EXAMPLE_AQL{aqlIPv4FromNumber_4}
  RETURN IPV4_FROM_NUMBER(3232235521)
@END_EXAMPLE_AQL
@endDocuBlock aqlIPv4FromNumber_4
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIPv4FromNumber_5
@EXAMPLE_AQL{aqlIPv4FromNumber_5}
  RETURN IPV4_FROM_NUMBER(-23) // invalid, produces a warning
@END_EXAMPLE_AQL
@endDocuBlock aqlIPv4FromNumber_5
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

IPV4_TO_NUMBER()
----------------

<small>Introduced in: v3.7.2</small>

`IPV4_TO_NUMBER(stringAddress) → numericAddress`

Converts an IPv4 address string into its numeric representation.

- **stringAddress** (string): a string representing an IPv4 address
- returns **numericAddress** (number): the numeric representation of the IPv4
  address, as an unsigned integer. If the input `stringAddress` is not a valid
  representation of an IPv4 address, the function returns `null` and produces
  a warning.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIPv4ToNumber_1
@EXAMPLE_AQL{aqlIPv4ToNumber_1}
  RETURN IPV4_TO_NUMBER("0.0.0.0")
@END_EXAMPLE_AQL
@endDocuBlock aqlIPv4ToNumber_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIPv4ToNumber_2
@EXAMPLE_AQL{aqlIPv4ToNumber_2}
  RETURN IPV4_TO_NUMBER("8.8.8.8")
@END_EXAMPLE_AQL
@endDocuBlock aqlIPv4ToNumber_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIPv4ToNumber_3
@EXAMPLE_AQL{aqlIPv4ToNumber_3}
  RETURN IPV4_TO_NUMBER("127.0.0.1")
@END_EXAMPLE_AQL
@endDocuBlock aqlIPv4ToNumber_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIPv4ToNumber_4
@EXAMPLE_AQL{aqlIPv4ToNumber_4}
  RETURN IPV4_TO_NUMBER("192.168.0.1")
@END_EXAMPLE_AQL
@endDocuBlock aqlIPv4ToNumber_4
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIPv4ToNumber_5
@EXAMPLE_AQL{aqlIPv4ToNumber_5}
  RETURN IPV4_TO_NUMBER("milk") // invalid, produces a warning
@END_EXAMPLE_AQL
@endDocuBlock aqlIPv4ToNumber_5
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

IS_IPV4()
---------

<small>Introduced in: v3.7.2</small>

`IS_IPV4(value) → bool`

Check if an arbitrary string is suitable for interpretation as an IPv4 address.

- **value** (string): an arbitrary string
- returns **bool** (bool): `true` if `value` is a string that can be interpreted
  as an IPv4 address. To be considered valid, the string must contain of 4 octets
  of decimal numbers with 1 to 3 digits length each, allowing the values 0 to 255.
  The octets must be separated by periods and must not have padding zeroes.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIsIPv4_1
@EXAMPLE_AQL{aqlIsIPv4_1}
  RETURN IS_IPV4("127.0.0.1")
@END_EXAMPLE_AQL
@endDocuBlock aqlIsIPv4_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIsIPv4_2
@EXAMPLE_AQL{aqlIsIPv4_2}
  RETURN IS_IPV4("8.8.8.8")
@END_EXAMPLE_AQL
@endDocuBlock aqlIsIPv4_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIsIPv4_3
@EXAMPLE_AQL{aqlIsIPv4_3}
  RETURN IS_IPV4("008.008.008.008")
@END_EXAMPLE_AQL
@endDocuBlock aqlIsIPv4_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIsIPv4_4
@EXAMPLE_AQL{aqlIsIPv4_4}
  RETURN IS_IPV4("12345.2.3.4")
@END_EXAMPLE_AQL
@endDocuBlock aqlIsIPv4_4
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIsIPv4_5
@EXAMPLE_AQL{aqlIsIPv4_5}
  RETURN IS_IPV4("12.34")
@END_EXAMPLE_AQL
@endDocuBlock aqlIsIPv4_5
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlIsIPv4_6
@EXAMPLE_AQL{aqlIsIPv4_6}
  RETURN IS_IPV4(8888)
@END_EXAMPLE_AQL
@endDocuBlock aqlIsIPv4_6
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

JSON_PARSE()
------------

`JSON_PARSE(text) → value`

Return an AQL value described by the JSON-encoded input string.

- **text** (string): the string to parse as JSON
- returns **value** (any): the value corresponding to the given JSON text.
  For input values that are no valid JSON strings, the function will return `null`.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlJsonParse_1
@EXAMPLE_AQL{aqlJsonParse_1}
  RETURN JSON_PARSE("123")
@END_EXAMPLE_AQL
@endDocuBlock aqlJsonParse_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlJsonParse_2
@EXAMPLE_AQL{aqlJsonParse_2}
  RETURN JSON_PARSE("[ true, false, 2 ]")
@END_EXAMPLE_AQL
@endDocuBlock aqlJsonParse_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlJsonParse_3
@EXAMPLE_AQL{aqlJsonParse_3}
  RETURN JSON_PARSE("\"abc\"")
@END_EXAMPLE_AQL
@endDocuBlock aqlJsonParse_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlJsonParse_4
@EXAMPLE_AQL{aqlJsonParse_4}
  RETURN JSON_PARSE('{"a": 1}')
@END_EXAMPLE_AQL
@endDocuBlock aqlJsonParse_4
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlJsonParse_5
@EXAMPLE_AQL{aqlJsonParse_5}
  RETURN JSON_PARSE("abc") // invalid JSON
@END_EXAMPLE_AQL
@endDocuBlock aqlJsonParse_5
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

JSON_STRINGIFY()
----------------

`JSON_STRINGIFY(value) → text`

Return a JSON string representation of the input value.

- **value** (any): the value to convert to a JSON string
- returns **text** (string): the JSON string representing `value`.
  For input values that cannot be converted to JSON, the function 
  will return `null`.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlJsonStringify_1
@EXAMPLE_AQL{aqlJsonStringify_1}
  RETURN JSON_STRINGIFY(true)
@END_EXAMPLE_AQL
@endDocuBlock aqlJsonStringify_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlJsonStringify_2
@EXAMPLE_AQL{aqlJsonStringify_2}
  RETURN JSON_STRINGIFY("abc")
@END_EXAMPLE_AQL
@endDocuBlock aqlJsonStringify_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlJsonStringify_3
@EXAMPLE_AQL{aqlJsonStringify_3}
  RETURN JSON_STRINGIFY( [1, {'2': .5}] )
@END_EXAMPLE_AQL
@endDocuBlock aqlJsonStringify_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

LEFT()
------

`LEFT(value, n) → substring`

Return the `n` leftmost characters of the string `value`.

To return the rightmost characters, see [RIGHT()](#right).<br>
To take a part from an arbitrary position off the string,
see [SUBSTRING()](#substring).

- **value** (string): a string
- **n** (number): how many characters to return
- returns **substring** (string): at most `n` characters of `value`,
  starting on the left-hand side of the string

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLeft_1
@EXAMPLE_AQL{aqlLeft_1}
  RETURN LEFT("foobar", 3)
@END_EXAMPLE_AQL
@endDocuBlock aqlLeft_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLeft_2
@EXAMPLE_AQL{aqlLeft_2}
  RETURN LEFT("foobar", 10)
@END_EXAMPLE_AQL
@endDocuBlock aqlLeft_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

LENGTH()
--------

`LENGTH(str) → length`

Determine the character length of a string.

- **str** (string): a string. If a number is passed, it will be casted to string first.
- returns **length** (number): the character length of `str` (not byte length)

`LENGTH()` can also determine the [number of elements](functions-array.html#length) in an array,
the [number of attribute keys](functions-document.html#length) of an object / document and
the [amount of documents](functions-miscellaneous.html#length) in a collection.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLengthString_1
@EXAMPLE_AQL{aqlLengthString_1}
  RETURN LENGTH("foobar")
@END_EXAMPLE_AQL
@endDocuBlock aqlLengthString_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLengthString_2
@EXAMPLE_AQL{aqlLengthString_2}
  RETURN LENGTH("电脑坏了")
@END_EXAMPLE_AQL
@endDocuBlock aqlLengthString_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

LEVENSHTEIN_DISTANCE()
----------------------

`LEVENSHTEIN_DISTANCE(value1, value2) → distance`

Calculate the [Damerau-Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance){:target="_blank"}
between two strings.

- **value1** (string): a string
- **value2** (string): a string
- returns **distance** (number): calculated Damerau-Levenshtein distance
  between the input strings `value1` and `value2`

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLevenshteinDistance_1
@EXAMPLE_AQL{aqlLevenshteinDistance_1}
  RETURN LEVENSHTEIN_DISTANCE("foobar", "bar")
@END_EXAMPLE_AQL
@endDocuBlock aqlLevenshteinDistance_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLevenshteinDistance_2
@EXAMPLE_AQL{aqlLevenshteinDistance_2}
  RETURN LEVENSHTEIN_DISTANCE(" ", "")
@END_EXAMPLE_AQL
@endDocuBlock aqlLevenshteinDistance_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLevenshteinDistance_3
@EXAMPLE_AQL{aqlLevenshteinDistance_3}
  RETURN LEVENSHTEIN_DISTANCE("The quick brown fox jumps over the lazy dog", "The quick black dog jumps over the brown fox")
@END_EXAMPLE_AQL
@endDocuBlock aqlLevenshteinDistance_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLevenshteinDistance_4
@EXAMPLE_AQL{aqlLevenshteinDistance_4}
  RETURN LEVENSHTEIN_DISTANCE("der mötör trötet", "der trötet")
@END_EXAMPLE_AQL
@endDocuBlock aqlLevenshteinDistance_4
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

LIKE()
------

`LIKE(text, search, caseInsensitive) → bool`

Check whether the pattern `search` is contained in the string `text`,
using wildcard matching.

- `_`: A single arbitrary character
- `%`: Zero, one or many arbitrary characters
- `\\_`: A literal underscore
- `\\%`: A literal percent sign

{% hint 'info' %}
Literal backlashes require different amounts of escaping depending on the
context:
- `\` in bind variables (_Table_ view mode) in the Web UI (automatically
  escaped to `\\` unless the value is wrapped in double quotes and already
  escaped properly)
- `\\` in bind variables (_JSON_ view mode) and queries in the Web UI
- `\\` in bind variables in arangosh
- `\\\\` in queries in arangosh
- Double the amount compared to arangosh in shells that use backslashes for
escaping (`\\\\` in bind variables and `\\\\\\\\` in queries)
{% endhint %}

The `LIKE()` function cannot be accelerated by any sort of index. However,
the [ArangoSearch `LIKE()` function](functions-arangosearch.html#like) that
is used in the context of a `SEARCH` operation is backed by View indexes.

- **text** (string): the string to search in
- **search** (string): a search pattern that can contain the wildcard characters
  `%` (meaning any sequence of characters, including none) and `_` (any single
  character). Literal `%` and `_` must be escaped with backslashes.
  *search* cannot be a variable or a document attribute. The actual value must
  be present at query parse time already.
- **caseInsensitive** (bool, *optional*): if set to `true`, the matching will be
  case-insensitive. The default is `false`.
- returns **bool** (bool): `true` if the pattern is contained in `text`,
  and `false` otherwise

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLikeString_1
@EXAMPLE_AQL{aqlLikeString_1}
  RETURN [
    LIKE("cart", "ca_t"),
    LIKE("carrot", "ca_t"),
    LIKE("carrot", "ca%t")
  ]
@END_EXAMPLE_AQL
@endDocuBlock aqlLikeString_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLikeString_2
@EXAMPLE_AQL{aqlLikeString_2}
  RETURN [
    LIKE("foo bar baz", "bar"),
    LIKE("foo bar baz", "%bar%"),
    LIKE("bar", "%bar%")
  ]
@END_EXAMPLE_AQL
@endDocuBlock aqlLikeString_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLikeString_3
@EXAMPLE_AQL{aqlLikeString_3}
  RETURN [
    LIKE("FoO bAr BaZ", "fOo%bAz"),
    LIKE("FoO bAr BaZ", "fOo%bAz", true)
  ]
@END_EXAMPLE_AQL
@endDocuBlock aqlLikeString_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

LOWER()
-------

`LOWER(value) → lowerCaseString`

Convert upper-case letters in `value` to their lower-case counterparts.
All other characters are returned unchanged.

- **value** (string): a string
- returns **lowerCaseString** (string): `value` with upper-case characters converted
  to lower-case characters

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLower
@EXAMPLE_AQL{aqlLower}
  RETURN LOWER("AVOcado")
@END_EXAMPLE_AQL
@endDocuBlock aqlLower
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

LTRIM()
-------

`LTRIM(value, chars) → strippedString`

Return the string `value` with whitespace stripped from the start only.

To strip from the end only, see [RTRIM()](#rtrim).<br>
To strip both sides, see [TRIM()](#trim).

- **value** (string): a string
- **chars** (string, *optional*): override the characters that should
  be removed from the string. It defaults to `\r\n \t` (i.e. `0x0d`, `0x0a`,
  `0x20` and `0x09`).
- returns **strippedString** (string): `value` without `chars` at the
  left-hand side

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLtrim_1
@EXAMPLE_AQL{aqlLtrim_1}
  RETURN LTRIM("foo bar")
@END_EXAMPLE_AQL
@endDocuBlock aqlLtrim_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLtrim_2
@EXAMPLE_AQL{aqlLtrim_2}
  RETURN LTRIM("  foo bar  ")
@END_EXAMPLE_AQL
@endDocuBlock aqlLtrim_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlLtrim_3
@EXAMPLE_AQL{aqlLtrim_3}
  RETURN LTRIM("--==[foo-bar]==--", "-=[]")
@END_EXAMPLE_AQL
@endDocuBlock aqlLtrim_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

MD5()
-----

`MD5(text) → hash`

Calculate the MD5 checksum for `text` and return it in a hexadecimal
string representation.

- **text** (string): a string
- returns **hash** (string): MD5 checksum as hex string

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlMd5
@EXAMPLE_AQL{aqlMd5}
  RETURN MD5("foobar")
@END_EXAMPLE_AQL
@endDocuBlock aqlMd5
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

NGRAM_POSITIONAL_SIMILARITY()
-----------------------------

<small>Introduced in: v3.7.0</small>

`NGRAM_POSITIONAL_SIMILARITY(input, target, ngramSize) → similarity`

Calculates the [_n_-gram similarity](https://webdocs.cs.ualberta.ca/~kondrak/papers/spire05.pdf){:target="_blank"}
between `input` and `target` using _n_-grams with minimum and maximum length of
`ngramSize`.

The similarity is calculated by counting how long the longest sequence of
matching _n_-grams is, divided by the **longer argument's** total _n_-gram count.
Partially matching _n_-grams are counted, whereas
[NGRAM_SIMILARITY()](#ngram_similarity) counts only fully matching _n_-grams.

The _n_-grams for both input and target are calculated on the fly,
not involving Analyzers.

- **input** (string): source text to be tokenized into _n_-grams
- **target** (string): target text to be tokenized into _n_-grams
- **ngramSize** (number): minimum as well as maximum _n_-gram length
- returns **similarity** (number): value between `0.0` and `1.0`

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlNgramPositionalSimilarity
@EXAMPLE_AQL{aqlNgramPositionalSimilarity}
  RETURN [
    NGRAM_POSITIONAL_SIMILARITY("quick fox", "quick foxx", 2),
    NGRAM_POSITIONAL_SIMILARITY("quick fox", "quick foxx", 3),
    NGRAM_POSITIONAL_SIMILARITY("quick fox", "quirky fox", 2),
    NGRAM_POSITIONAL_SIMILARITY("quick fox", "quirky fox", 3)
  ]
@END_EXAMPLE_AQL
@endDocuBlock aqlNgramPositionalSimilarity
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

NGRAM_SIMILARITY()
------------------

<small>Introduced in: v3.7.0</small>

`NGRAM_SIMILARITY(input, target, ngramSize) → similarity`

Calculates [_n_-gram similarity](https://webdocs.cs.ualberta.ca/~kondrak/papers/spire05.pdf){:target="_blank"}
between `input` and `target` using _n_-grams with minimum and maximum length of
`ngramSize`.

The similarity is calculated by counting how long the longest sequence of
matching _n_-grams is, divided by **target's** total _n_-gram count.
Only fully matching _n_-grams are counted, whereas
[NGRAM_POSITIONAL_SIMILARITY()](#ngram_positional_similarity) counts partially
matching _n_-grams too. This behavior matches the similarity measure used in
[NGRAM_MATCH()](functions-arangosearch.html#ngram_match).

The _n_-grams for both input and target are calculated on the fly, not involving
Analyzers.

- **input** (string): source text to be tokenized into _n_-grams
- **target** (string): target text to be tokenized into _n_-grams
- **ngramSize** (number): minimum as well as maximum _n_-gram length
- returns **similarity** (number): value between `0.0` and `1.0`

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlNgramSimilarity
@EXAMPLE_AQL{aqlNgramSimilarity}
  RETURN [
    RETURN NGRAM_SIMILARITY("quick fox", "quick foxx", 2),
    RETURN NGRAM_SIMILARITY("quick fox", "quick foxx", 3),
    RETURN NGRAM_SIMILARITY("quick fox", "quirky fox", 2),
    RETURN NGRAM_SIMILARITY("quick fox", "quirky fox", 3)
  ]
@END_EXAMPLE_AQL
@endDocuBlock aqlNgramSimilarity
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

RANDOM_TOKEN()
--------------

`RANDOM_TOKEN(length) → randomString`

Generate a pseudo-random token string with the specified length.
The algorithm for token generation should be treated as opaque.

- **length** (number): desired string length for the token. It must be greater
  or equal to 0 and at most 65536. A `length` of 0 returns an empty string.
- returns **randomString** (string): a generated token consisting of lowercase
  letters, uppercase letters and numbers

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRandomToken
@EXAMPLE_AQL{aqlRandomToken}
  RETURN [
    RANDOM_TOKEN(8),
    RANDOM_TOKEN(8)
  ]
@END_EXAMPLE_AQL
@endDocuBlock aqlRandomToken
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

REGEX_MATCHES()
---------------

`REGEX_MATCHES(text, regex, caseInsensitive) → stringArray`

Return the matches in the given string `text`, using the `regex`.

- **text** (string): the string to search in
- **regex** (string): a [regular expression](#regular-expression-syntax)
  to use for matching the `text`
- **caseInsensitive** (bool, *optional*): if set to `true`, the matching will be
  case-insensitive. The default is `false`.
- returns **stringArray** (array): an array of strings containing the matches,
  or `null` and a warning if the expression is invalid

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexMatches_1
@EXAMPLE_AQL{aqlRegexMatches_1}
  RETURN REGEX_MATCHES("My-us3r_n4m3", "^[a-z0-9_-]{3,16}$", true)
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexMatches_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexMatches_2
@EXAMPLE_AQL{aqlRegexMatches_2}
  RETURN REGEX_MATCHES("#4d82h4", "^#?([a-f0-9]{6}|[a-f0-9]{3})$", true)
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexMatches_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexMatches_3
@EXAMPLE_AQL{aqlRegexMatches_3}
  RETURN REGEX_MATCHES("john@doe.com", "^([a-z0-9_\.-]+)@([\da-z-]+)\.([a-z\.]{2,6})$", false)
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexMatches_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

REGEX_SPLIT()
-------------

`REGEX_SPLIT(text, splitExpression, caseInsensitive, limit) → stringArray`

Split the given string `text` into a list of strings, using the `separator`.

- **text** (string): the string to split
- **splitExpression** (string): a [regular expression](#regular-expression-syntax)
  to use for splitting the `text`
- **caseInsensitive** (bool, *optional*): if set to `true`, the matching will be
  case-insensitive. The default is `false`.
- **limit** (number, *optional*): limit the number of split values in the result.
  If no `limit` is given, the number of splits returned is not bounded.
- returns **stringArray** (array): an array of strings, or `null` and a warning
  if the expression is invalid

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexSplit_1
@EXAMPLE_AQL{aqlRegexSplit_1}
  RETURN REGEX_SPLIT("This is a line.\n This is yet another line\r\n This again is a line.\r Mac line ", "\\.?(\r\n|\n|\r)", true, 4)
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexSplit_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexSplit_2
@EXAMPLE_AQL{aqlRegexSplit_2}
  RETURN REGEX_SPLIT("hypertext language, programming", "[\\s, ]+")
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexSplit_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexSplit_3
@EXAMPLE_AQL{aqlRegexSplit_3}
  RETURN REGEX_SPLIT("cA,Bc,A,BcA,BcA,Bc", "a,b", true, 3)
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexSplit_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

REGEX_TEST()
------------

`REGEX_TEST(text, search, caseInsensitive) → bool`

Check whether the pattern `search` is contained in the string `text`,
using regular expression matching.

- **text** (string): the string to search in
- **search** (string): a [regular expression](#regular-expression-syntax)
  search pattern
- **caseInsensitive** (bool, *optional*): if set to `true`, the matching will be
  case-insensitive. The default is `false`.
- returns **bool** (bool): `true` if the pattern is contained in `text`,
  and `false` otherwise, or `null` and a warning if the expression is invalid

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexTest_1
@EXAMPLE_AQL{aqlRegexTest_1}
  RETURN REGEX_TEST("the quick brown fox", "the.*fox")
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexTest_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexTest_2
@EXAMPLE_AQL{aqlRegexTest_2}
  REGEX_TEST("the quick brown fox", "^(a|the)\\s+(quick|slow).*f.x$")
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexTest_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexTest_3
@EXAMPLE_AQL{aqlRegexTest_3}
  RETURN REGEX_TEST("the\nquick\nbrown\nfox", "^the(\n[a-w]+)+\nfox$")
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexTest_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

REGEX_REPLACE()
---------------

`REGEX_REPLACE(text, search, replacement, caseInsensitive) → string`

Replace the pattern `search` with the string `replacement` in the string
`text`, using regular expression matching.

- **text** (string): the string to search in
- **search** (string): a [regular expression](#regular-expression-syntax)
  search pattern
- **replacement** (string): the string to replace the `search` pattern with
- **caseInsensitive** (bool, *optional*): if set to `true`, the matching will be
  case-insensitive. The default is `false`.
- returns **string** (string): the string `text` with the `search` regex
  pattern replaced with the `replacement` string wherever the pattern exists
  in `text`, or `null` and a warning if the expression is invalid

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexReplace_1
@EXAMPLE_AQL{aqlRegexReplace_1}
  RETURN REGEX_REPLACE("the quick brown fox", "the.*fox", "jumped over")
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexReplace_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexReplace_2
@EXAMPLE_AQL{aqlRegexReplace_2}
  RETURN REGEX_REPLACE("An Avocado", "a", "_")
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexReplace_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRegexReplace_3
@EXAMPLE_AQL{aqlRegexReplace_3}
  RETURN REGEX_REPLACE("An Avocado", "a", "_", true)
@END_EXAMPLE_AQL
@endDocuBlock aqlRegexReplace_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

REVERSE()
---------

`REVERSE(value) → reversedString`

Return the reverse of the string `value`.

- **value** (string): a string
- returns **reversedString** (string): a new string with the characters in
  reverse order

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlReverse_1
@EXAMPLE_AQL{aqlReverse_1}
  RETURN REVERSE("foobar")
@END_EXAMPLE_AQL
@endDocuBlock aqlReverse_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlReverse_2
@EXAMPLE_AQL{aqlReverse_2}
  RETURN REVERSE("电脑坏了")
@END_EXAMPLE_AQL
@endDocuBlock aqlReverse_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

RIGHT()
-------

`RIGHT(value, length) → substring`

Return the `length` rightmost characters of the string `value`.

To return the leftmost characters, see [LEFT()](#left).<br>
To take a part from an arbitrary position off the string,
see [SUBSTRING()](#substring).

- **value** (string): a string
- **length** (number): how many characters to return
- returns **substring** (string): at most `length` characters of `value`,
  starting on the right-hand side of the string

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRight_1
@EXAMPLE_AQL{aqlRight_1}
  RETURN RIGHT("foobar", 3)
@END_EXAMPLE_AQL
@endDocuBlock aqlRight_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRight_2
@EXAMPLE_AQL{aqlRight_2}
  RETURN RIGHT("foobar", 10)
@END_EXAMPLE_AQL
@endDocuBlock aqlRight_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

RTRIM()
-------

`RTRIM(value, chars) → strippedString`

Return the string `value` with whitespace stripped from the end only.

To strip from the start only, see [LTRIM()](#ltrim).<br>
To strip both sides, see [TRIM()](#trim).

- **value** (string): a string
- **chars** (string, *optional*): override the characters that should
  be removed from the string. It defaults to `\r\n \t` (i.e. `0x0d`, `0x0a`,
  `0x20` and `0x09`).
- returns **strippedString** (string): `value` without `chars` at the
  right-hand side

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRtrim_1
@EXAMPLE_AQL{aqlRtrim_1}
  RETURN RTRIM("foo bar")
@END_EXAMPLE_AQL
@endDocuBlock aqlRtrim_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRtrim_2
@EXAMPLE_AQL{aqlRtrim_2}
  RETURN RTRIM("  foo bar  ")
@END_EXAMPLE_AQL
@endDocuBlock aqlRtrim_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlRtrim_3
@EXAMPLE_AQL{aqlRtrim_3}
  RETURN RTRIM("--==[foo-bar]==--", "-=[]")
@END_EXAMPLE_AQL
@endDocuBlock aqlRtrim_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

SHA1()
------

`SHA1(text) → hash`

Calculate the SHA1 checksum for `text` and returns it in a hexadecimal
string representation.

- **text** (string): a string
- returns **hash** (string): SHA1 checksum as hex string

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSha1
@EXAMPLE_AQL{aqlSha1}
  RETURN SHA1("foobar")
@END_EXAMPLE_AQL
@endDocuBlock aqlSha1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

SHA512()
--------

`SHA512(text) → hash`

Calculate the SHA512 checksum for `text` and returns it in a hexadecimal
string representation.

- **text** (string): a string
- returns **hash** (string): SHA512 checksum as hex string

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSha512
@EXAMPLE_AQL{aqlSha512}
  RETURN SHA512("foobar")
@END_EXAMPLE_AQL
@endDocuBlock aqlSha512
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

SOUNDEX()
---------

`SOUNDEX(value) → soundexString`

Return the [Soundex](https://en.wikipedia.org/wiki/Soundex){:target="_blank"}
fingerprint of `value`.

- **value** (string): a string
- returns **soundexString** (string): a Soundex fingerprint of `value`

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSha512
@EXAMPLE_AQL{aqlSha512}
  RETURN [
    SOUNDEX("example"),
    SOUNDEX("ekzampul"),
    SOUNDEX("soundex"),
    SOUNDEX("sounteks")
  ]
@END_EXAMPLE_AQL
@endDocuBlock aqlSha512
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

SPLIT()
-------

`SPLIT(value, separator, limit) → strArray`

Split the given string `value` into a list of strings, using the `separator`.

- **value** (string): a string
- **separator** (string): either a string or a list of strings. If `separator` is
  an empty string, `value` will be split into a list of characters. If no `separator`
  is specified, `value` will be returned as array.
- **limit** (number, *optional*): limit the number of split values in the result.
  If no `limit` is given, the number of splits returned is not bounded.
- returns **strArray** (array): an array of strings

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSplit_1
@EXAMPLE_AQL{aqlSplit_1}
  RETURN SPLIT( "foo-bar-baz", "-" )
@END_EXAMPLE_AQL
@endDocuBlock aqlSplit_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSplit_2
@EXAMPLE_AQL{aqlSplit_2}
  RETURN SPLIT( "foo-bar-baz", "-", 1 )
@END_EXAMPLE_AQL
@endDocuBlock aqlSplit_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSplit_3
@EXAMPLE_AQL{aqlSplit_3}
  RETURN SPLIT( "foo, bar & baz", [ ", ", " & " ] )
@END_EXAMPLE_AQL
@endDocuBlock aqlSplit_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

STARTS_WITH()
-------------

`STARTS_WITH(text, prefix) → startsWith`

Check whether the given string starts with `prefix`.

There is a corresponding [`STARTS_WITH()` ArangoSearch function](functions-arangosearch.html#starts_with)
that can utilize View indexes.

- **text** (string): a string to compare against
- **prefix** (string): a string to test for at the start of the text
- returns **startsWith** (bool): whether the text starts with the given prefix

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlStartsWith_1
@EXAMPLE_AQL{aqlStartsWith_1}
  RETURN STARTS_WITH("foobar", "foo")
@END_EXAMPLE_AQL
@endDocuBlock aqlStartsWith_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlStartsWith_2
@EXAMPLE_AQL{aqlStartsWith_2}
  RETURN STARTS_WITH("foobar", "baz")
@END_EXAMPLE_AQL
@endDocuBlock aqlStartsWith_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

`STARTS_WITH(text, prefixes, minMatchCount) → startsWith`

<small>Introduced in: v3.7.1</small>

Check if the given string starts with one of the `prefixes`.

- **text** (string): a string to compare against
- **prefixes** (array): an array of strings to test for at the start of the text
- **minMatchCount** (number, _optional_): minimum number of prefixes that
  should be satisfied. The default is `1` and it is the only meaningful value
  unless `STARTS_WITH()` is used in the context of a `SEARCH` expression where
  an attribute can have multiple values at the same time
- returns **startsWith** (bool): whether the text starts with at least
  *minMatchCount* of the given prefixes

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlStartsWith_3
@EXAMPLE_AQL{aqlStartsWith_3}
  RETURN STARTS_WITH("foobar", ["bar", "foo"])
@END_EXAMPLE_AQL
@endDocuBlock aqlStartsWith_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlStartsWith_4
@EXAMPLE_AQL{aqlStartsWith_4}
  RETURN STARTS_WITH("foobar", ["bar", "baz"])
@END_EXAMPLE_AQL
@endDocuBlock aqlStartsWith_4
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

SUBSTITUTE()
------------

`SUBSTITUTE(value, search, replace, limit) → substitutedString`

Replace search values in the string `value`.

- **value** (string): a string
- **search** (string\|array): if `search` is a string, all occurrences of
  `search` will be replaced in `value`. If `search` is an array of strings,
  each occurrence of a value contained in `search` will be replaced by the
  corresponding array element in `replace`. If `replace` has less list items
  than `search`, occurrences of unmapped `search` items will be replaced by an
  empty string.
- **replace** (string\|array, *optional*): a replacement string, or an array of
  strings to replace the corresponding elements of `search` with. Can have less
  elements than `search` or be left out to remove matches. If `search` is an array
  but `replace` is a string, then all matches will be replaced with `replace`.
- **limit** (number, *optional*): cap the number of replacements to this value
- returns **substitutedString** (string): a new string with matches replaced
  (or removed)

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSubstitute_1
@EXAMPLE_AQL{aqlSubstitute_1}
  RETURN SUBSTITUTE( "the quick brown foxx", "quick", "lazy" )
@END_EXAMPLE_AQL
@endDocuBlock aqlSubstitute_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSubstitute_2
@EXAMPLE_AQL{aqlSubstitute_2}
  RETURN SUBSTITUTE( "the quick brown foxx", [ "quick", "foxx" ], [ "slow", "dog" ] )
@END_EXAMPLE_AQL
@endDocuBlock aqlSubstitute_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSubstitute_3
@EXAMPLE_AQL{aqlSubstitute_3}
  RETURN SUBSTITUTE( "the quick brown foxx", [ "the", "foxx" ], [ "that", "dog" ], 1 )
@END_EXAMPLE_AQL
@endDocuBlock aqlSubstitute_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSubstitute_4
@EXAMPLE_AQL{aqlSubstitute_4}
  RETURN SUBSTITUTE( "the quick brown foxx", [ "the", "quick", "foxx" ], [ "A", "VOID!" ] )
@END_EXAMPLE_AQL
@endDocuBlock aqlSubstitute_4
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSubstitute_5
@EXAMPLE_AQL{aqlSubstitute_5}
  RETURN SUBSTITUTE( "the quick brown foxx", [ "quick", "foxx" ], "xx" )
@END_EXAMPLE_AQL
@endDocuBlock aqlSubstitute_5
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

`SUBSTITUTE(value, mapping, limit) → substitutedString`

Alternatively, `search` and `replace` can be specified in a combined value.

- **value** (string): a string
- **mapping** (object): a lookup map with search strings as keys and replacement
  strings as values. Empty strings and `null` as values remove matches.
  Note that there is no defined order in which the mapping is processed. In case
  of overlapping searches and substitutions, one time the first entry may win,
  another time the second. If you need to ensure a specific order then choose
  the array-based variant of this function
- **limit** (number, *optional*): cap the number of replacements to this value
- returns **substitutedString** (string): a new string with matches replaced
  (or removed)

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSubstitute_6
@EXAMPLE_AQL{aqlSubstitute_6}
  RETURN SUBSTITUTE("the quick brown foxx", {
    "quick": "small",
    "brown": "slow",
    "foxx": "ant"
  })
@END_EXAMPLE_AQL
@endDocuBlock aqlSubstitute_6
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSubstitute_7
@EXAMPLE_AQL{aqlSubstitute_7}
  RETURN SUBSTITUTE("the quick brown foxx", { 
    "quick": "",
    "brown": null,
    "foxx": "ant"
  })
@END_EXAMPLE_AQL
@endDocuBlock aqlSubstitute_7
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSubstitute_8
@EXAMPLE_AQL{aqlSubstitute_8}
  RETURN SUBSTITUTE("the quick brown foxx", {
    "quick": "small",
    "brown": "slow",
    "foxx": "ant"
  }, 2)
@END_EXAMPLE_AQL
@endDocuBlock aqlSubstitute_8
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

SUBSTRING()
-----------

`SUBSTRING(value, offset, length) → substring`

Return a substring of `value`.

To return the rightmost characters, see [RIGHT()](#right).<br>
To return the leftmost characters, see [LEFT()](#left).

- **value** (string): a string
- **offset** (number): start at `offset`, offsets start at position 0
- **length** (number, *optional*): at most `length` characters, omit to get the
  substring from `offset` to the end of the string
- returns **substring** (string): a substring of `value`

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSubstring_1
@EXAMPLE_AQL{aqlSubstring_1}
  RETURN SUBSTRING("Holy Guacamole!", 5)
@END_EXAMPLE_AQL
@endDocuBlock aqlSubstring_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlSubstring_2
@EXAMPLE_AQL{aqlSubstring_2}
  RETURN SUBSTRING("Holy Guacamole!", 10, 4)
@END_EXAMPLE_AQL
@endDocuBlock aqlSubstring_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

TOKENS()
--------

`TOKENS(input, analyzer) → tokenArray`

Split the `input` string(s) with the help of the specified `analyzer` into an
array. The resulting array can be used in `FILTER` or `SEARCH` statements with
the `IN` operator, but also be assigned to variables and returned. This can be
used to better understand how a specific Analyzer processes an input value.

It has a regular return value unlike all other ArangoSearch AQL functions and
is thus not limited to `SEARCH` operations. It is independent of Views.
A wrapping `ANALYZER()` call in a search expression does not affect the
`analyzer` argument nor allow you to omit it.

- **input** (string\|array): text to tokenize. Accepts recursive arrays of
  strings (introduced in v3.6.0).
- **analyzer** (string): name of an [Analyzer](../analyzers.html).
- returns **tokenArray** (array): array of strings with zero or more elements,
  each element being a token.

**Examples**

Example query showcasing the `"text_de"` Analyzer (tokenization with stemming,
case conversion and accent removal for German text):

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlTokens_1
@EXAMPLE_AQL{aqlTokens_1}
  RETURN TOKENS("Lörem ipsüm, DOLOR SIT Ämet.", "text_de")
@END_EXAMPLE_AQL
@endDocuBlock aqlTokens_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

To search a View for documents where the `text` attribute contains certain
words/tokens in any order, you can use the function like this:

```js
FOR doc IN viewName
  SEARCH ANALYZER(doc.text IN TOKENS("dolor amet lorem", "text_en"), "text_en")
  RETURN doc
```

It will match `{ "text": "Lorem ipsum, dolor sit amet." }` for instance. If you
want to search for tokens in a particular order, use
[PHRASE()](functions-arangosearch.html#phrase) instead.

If an array of strings is passed as first argument, then each string is
tokenized individually and an array with the same nesting as the input array
is returned:

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlTokens_2
@EXAMPLE_AQL{aqlTokens_2}
  RETURN TOKENS("quick brown fox", "text_en")
@END_EXAMPLE_AQL
@endDocuBlock aqlTokens_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlTokens_3
@EXAMPLE_AQL{aqlTokens_3}
  RETURN TOKENS(["quick brown", "fox"], "text_en")
@END_EXAMPLE_AQL
@endDocuBlock aqlTokens_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlTokens_4
@EXAMPLE_AQL{aqlTokens_4}
  RETURN TOKENS(["quick brown", ["fox"]], "text_en")
@END_EXAMPLE_AQL
@endDocuBlock aqlTokens_4
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

In most cases you will want to flatten the resulting array for further usage,
because nested arrays are not accepted in `SEARCH` statements such as
`<array> ALL IN doc.<attribute>`:

```js
LET tokens = TOKENS(["quick brown", ["fox"]], "text_en") // [ ["quick", "brown"], [["fox"]] ]
LET tokens_flat = FLATTEN(tokens, 2)                     // [ "quick", "brown", "fox" ]
FOR doc IN myView SEARCH ANALYZER(tokens_flat ALL IN doc.title, "text_en") RETURN doc
```

TO_BASE64()
-----------

`TO_BASE64(value) → encodedString`

Return the Base64 representation of `value`.

- **value** (string): a string
- returns **encodedString** (string): a Base64 representation of `value`

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlToBase64_1
@EXAMPLE_AQL{aqlToBase64_1}
  RETURN TO_BASE64("ABC.")
@END_EXAMPLE_AQL
@endDocuBlock aqlToBase64_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlToBase64_2
@EXAMPLE_AQL{aqlToBase64_2}
  RETURN TO_BASE64("123456")
@END_EXAMPLE_AQL
@endDocuBlock aqlToBase64_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

TO_HEX()
--------

`TO_HEX(value) → hexString`

Return the hexadecimal representation of `value`.

- **value** (string): a string
- returns **hexString** (string): a hexadecimal representation of `value`

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlToHex_1
@EXAMPLE_AQL{aqlToHex_1}
  RETURN TO_HEX("ABC.")
@END_EXAMPLE_AQL
@endDocuBlock aqlToHex_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlToHex_2
@EXAMPLE_AQL{aqlToHex_2}
  RETURN TO_HEX("ü")
@END_EXAMPLE_AQL
@endDocuBlock aqlToHex_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

TRIM()
------

`TRIM(value, type) → strippedString`

Return the string `value` with whitespace stripped from the start and/or end.

The optional `type` parameter specifies from which parts of the string the
whitespace is stripped. [LTRIM()](#ltrim)
and [RTRIM()](#rtrim) are preferred
however.

- **value** (string): a string
- **type** (number, *optional*): strip whitespace from the
  - `0` – start and end of the string (default)
  - `1` – start of the string only
  - `2` – end of the string only

`TRIM(value, chars) → strippedString`

Return the string `value` with whitespace stripped from the start and end.

- **value** (string): a string
- **chars** (string, *optional*): override the characters that should
  be removed from the string. It defaults to `\r\n \t` (i.e. `0x0d`, `0x0a`,
  `0x20` and `0x09`).
- returns **strippedString** (string): `value` without `chars` on both sides

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlTrim_1
@EXAMPLE_AQL{aqlTrim_1}
  RETURN TRIM("foo bar")
@END_EXAMPLE_AQL
@endDocuBlock aqlTrim_1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlTrim_2
@EXAMPLE_AQL{aqlTrim_2}
  RETURN TRIM("  foo bar  ")
@END_EXAMPLE_AQL
@endDocuBlock aqlTrim_2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlTrim_3
@EXAMPLE_AQL{aqlTrim_3}
  RETURN TRIM("--==[foo-bar]==--", "-=[]")
@END_EXAMPLE_AQL
@endDocuBlock aqlTrim_3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlTrim_4
@EXAMPLE_AQL{aqlTrim_4}
  RETURN TRIM("  foobar\t \r\n ")
@END_EXAMPLE_AQL
@endDocuBlock aqlTrim_4
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlTrim_5
@EXAMPLE_AQL{aqlTrim_5}
  RETURN TRIM(";foo;bar;baz, ", ",; ")
@END_EXAMPLE_AQL
@endDocuBlock aqlTrim_5
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

UPPER()
-------

`UPPER(value) → upperCaseString`

Convert lower-case letters in `value` to their upper-case counterparts.
All other characters are returned unchanged.

- **value** (string): a string
- returns **upperCaseString** (string): `value` with lower-case characters converted
  to upper-case characters

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlUpper
@EXAMPLE_AQL{aqlUpper}
  RETURN UPPER("AVOcado")
@END_EXAMPLE_AQL
@endDocuBlock aqlUpper
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

UUID()
------

`UUID() → UUIDString`

Return a universally unique identifier value.

- returns **UUIDString** (string): a universally unique identifier

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
@startDocuBlockInline aqlUuid
@EXAMPLE_AQL{aqlUuid}
  FOR i IN 1..3
    RETURN UUID()
@END_EXAMPLE_AQL
@endDocuBlock aqlUuid
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

Regular Expression Syntax
-------------------------

A regular expression may consist of literal characters and the following 
characters and sequences:

- `.` – the dot matches any single character except line terminators.
  To include line terminators, use `[\s\S]` instead to simulate `.` with *DOTALL* flag.
- `\d` – matches a single digit, equivalent to `[0-9]`
- `\s` – matches a single whitespace character
- `\S` – matches a single non-whitespace character
- `\t` – matches a tab character
- `\r` – matches a carriage return
- `\n` – matches a line-feed character
- `[xyz]` – set of characters. Matches any of the enclosed characters
  (here: *x*, *y*, or *z*)
- `[^xyz]` – negated set of characters. Matches any other character than the
  enclosed ones (i.e. anything but *x*, *y*, or *z* in this case)
- `[x-z]` – range of characters. Matches any of the characters in the 
  specified range, e.g. `[0-9A-F]` to match any character in
  *0123456789ABCDEF*
- `[^x-z]` – negated range of characters. Matches any other character than the
  ones specified in the range
- `(xyz)` – defines and matches a pattern group
- `(x|y)` – matches either *x* or *y*
- `^` – matches the beginning of the string (e.g. `^xyz`)
- `$` – matches the end of the string (e.g. `xyz$`)

Note that the characters `.`, `*`, `?`, `[`, `]`, `(`, `)`, `{`, `}`, `^`,
and `$` have a special meaning in regular expressions and may need to be
escaped using a backslash, which typically requires escaping itself.

{% hint 'info' %}
Literal backlashes require different amounts of escaping depending on the
context:
- `\` in bind variables (_Table_ view mode) in the Web UI (automatically
  escaped to `\\` unless the value is wrapped in double quotes and already
  escaped properly)
- `\\` in bind variables (_JSON_ view mode) and queries in the Web UI
- `\\` in bind variables in arangosh
- `\\\\` in queries in arangosh
- Double the amount compared to arangosh in shells that use backslashes for
escaping (`\\\\` in bind variables and `\\\\\\\\` in queries)
{% endhint %}

Characters and sequences may optionally be repeated using the following
quantifiers:

- `x?` – matches one or zero occurrences of *x*
- `x*` – matches zero or more occurrences of *x* (greedy)
- `x+` – matches one or more occurrences of *x* (greedy)
- `x*?` – matches zero or more occurrences of *x* (non-greedy)
- `x+?` – matches one or more occurrences of *x* (non-greedy)
- `x{y}` – matches exactly *y* occurrences of *x*
- `x{y,z}` – matches between *y* and *z* occurrences of *x*
- `x{y,}` – matches at least *y* occurrences of *x*

Note that `xyz+` matches *xyzzz*, but if you want to match *xyzxyz* instead,
you need to define a pattern group by wrapping the sub-expression in parentheses
and place the quantifier right behind it, like `(xyz)+`.
