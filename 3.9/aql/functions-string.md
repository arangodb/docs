---
layout: default
description: For string processing, AQL offers the following functions
---
String functions
================

For string processing, AQL offers the following functions:

CHAR_LENGTH()
-------------

`CHAR_LENGTH(value) → length`

Return the number of characters in *value* (not byte length).

| Input  | Length |
|--------|--------|
| String | Number of Unicode characters |
| Number | Number of Unicode characters that represent the number |
| Array  | Number of Unicode characters from the resulting stringification |
| Object | Number of Unicode characters from the resulting stringification |
| true   | 4 |
| false  | 5 |
| null   | 0 |

CONCAT()
--------

`CONCAT(value1, value2, ... valueN) → str`

Concatenate the values passed as *value1* to *valueN*.

- **values** (any, *repeatable*): elements of arbitrary type (at least 1)
- returns **str** (string): a concatenation of the elements. *null* values
  are ignored.

```js
CONCAT("foo", "bar", "baz") // "foobarbaz"
CONCAT(1, 2, 3) // "123"
CONCAT("foo", [5, 6], {bar: "baz"}) // "foo[5,6]{\"bar\":\"baz\"}"
```

`CONCAT(anyArray) → str`

If a single array is passed to *CONCAT()*, its members are concatenated.

- **anyArray** (array): array with elements of arbitrary type
- returns **str** (string): a concatenation of the array elements. *null* values
  are ignored.

```js
CONCAT( [ "foo", "bar", "baz" ] ) // "foobarbaz"
CONCAT( [1, 2, 3] ) // "123"
```

CONCAT_SEPARATOR()
------------------

`CONCAT_SEPARATOR(separator, value1, value2, ... valueN) → joinedString`

Concatenate the strings passed as arguments *value1* to *valueN* using the
*separator* string.

- **separator** (string): an arbitrary separator string
- **values** (string\|array, *repeatable*): strings or arrays of strings as multiple
  arguments (at least 1)
- returns **joinedString** (string): a concatenated string of the elements, using
  *separator* as separator string. *null* values are ignored. Array value arguments
  are expanded automatically, and their individual members will be concatenated.
  Nested arrays will be expanded too, but with their elements separated by commas
  if they have more than a single element.

```js
CONCAT_SEPARATOR(", ", "foo", "bar", "baz")
// "foo, bar, baz"

CONCAT_SEPARATOR(", ", [ "foo", "bar", "baz" ])
// "foo, bar, baz"

CONCAT_SEPARATOR(", ", [ "foo", [ "b", "a", "r" ], "baz" ])
// [ "foo, b,a,r, baz" ]

CONCAT_SEPARATOR("-", [1, 2, 3, null], [4, null, 5])
// "1-2-3-4-5"
```

CONTAINS()
----------

`CONTAINS(text, search, returnIndex) → match`

Check whether the string *search* is contained in the string *text*.
The string matching performed by *CONTAINS* is case-sensitive.

- **text** (string): the haystack
- **search** (string): the needle
- **returnIndex** (bool, *optional*): if set to *true*, the character position
  of the match is returned instead of a boolean. The default is *false*.
- returns **match** (bool\|number): by default, *true* is returned if *search*
  is contained in *text*, and *false* otherwise. With *returnIndex* set to *true*,
  the position of the first occurrence of *search* within *text* is returned 
  (starting at offset 0), or *-1* if *search* is not contained in *text*.

```js
CONTAINS("foobarbaz", "bar") // true
CONTAINS("foobarbaz", "horse") // false
CONTAINS("foobarbaz", "ba", true) // 3
CONTAINS("foobarbaz", "horse", true) // -1
```

To determine if or at which position a value is included in an array, see the
[POSITION() array function](functions-array.html#position).

COUNT()
-------

This is an alias for [LENGTH()](#length).

CRC32()
-----

`CRC32(text) → hash`

Calculate the CRC32 checksum for *text* and return it in a hexadecimal
string representation. The polynomial used is 0x1EDC6F41. The initial
value used is 0xFFFFFFFF, and the final xor value is also 0xFFFFFFFF.

- **text** (string): a string
- returns **hash** (string): CRC32 checksum as hex string

```js
CRC32("foobar") // "D5F5C7F"
```

ENCODE_URI_COMPONENT()
-----------

`ENCODE_URI_COMPONENT(value) → encodedURIComponentString`

Return the encoded uri component of *value*.

- **value** (string): a string
- returns **encodedURIComponentString** (string): an encoded uri component of *value*

FIND_FIRST()
------------

`FIND_FIRST(text, search, start, end) → position`

Return the position of the first occurrence of the string *search* inside the
string *text*. Positions start at 0.

- **text** (string): the haystack
- **search** (string): the needle
- **start** (number, *optional*): limit the search to a subset of the text,
  beginning at *start*
- **end** (number, *optional*): limit the search to a subset of the text,
  ending at *end*
- returns **position** (number): the character position of the match. If *search*
  is not contained in *text*, -1 is returned. If **search** is empty, **start** is returned.

```js
FIND_FIRST("foobarbaz", "ba") // 3
FIND_FIRST("foobarbaz", "ba", 4) // 6
FIND_FIRST("foobarbaz", "ba", 0, 3) // -1
```

FIND_LAST()
-----------

`FIND_LAST(text, search, start, end) → position`

Return the position of the last occurrence of the string *search* inside the
string *text*. Positions start at 0.

- **text** (string): the haystack
- **search** (string): the needle
- **start** (number, *optional*): limit the search to a subset of the text,
  beginning at *start*
- **end** (number, *optional*): limit the search to a subset of the text,
  ending at *end*
- returns **position** (number): the character position of the match. If *search*
  is not contained in *text*, -1 is returned. 
  If *search* is empty, the string length is returned, or *end* + 1.

```js
FIND_LAST("foobarbaz", "ba") // 6
FIND_LAST("foobarbaz", "ba", 7) // -1
FIND_LAST("foobarbaz", "ba", 0, 4) // 3
```

FNV64()
-------

`FNV64(text) → hash`

Calculate the FNV-1A 64 bit hash for *text* and return it in a hexadecimal
string representation.

- **text** (string): a string
- returns **hash** (string): FNV-1A hash as hex string

```js
FNV64("foobar") // "85944171F73967E8"
```

IPV4_FROM_NUMBER()
------------------

<small>Introduced in: v3.7.2</small>

`IPV4_FROM_NUMBER(numericAddress) → stringAddress`

Converts a numeric IPv4 address value into its string representation.

- **numericAddress** (number): a numeric representation of an IPv4 address, for
  example produced by [IPV4_TO_NUMBER()](#ipv4_to_number). The number must be
  an unsigned integer between 0 and 4294967295 (both inclusive).
- returns **stringAddress** (string): the string representation of the IPv4
  address. If the input *numberAddress* is not a valid representation of an
  IPv4 address, the function returns *null* and produces a warning.

```js
IPV4_FROM_NUMBER(0) // "0.0.0.0"
IPV4_FROM_NUMBER(134744072) // "8.8.8.8"
IPV4_FROM_NUMBER(2130706433) // "127.0.0.1")
IPV4_FROM_NUMBER(3232235521) // "192.168.0.1"
IPV4_FROM_NUMBER(3232235522) // "192.168.0.2"
IPV4_FROM_NUMBER(-23) // null (and produces a warning)
```

IPV4_TO_NUMBER()
----------------

<small>Introduced in: v3.7.2</small>

`IPV4_TO_NUMBER(stringAddress) → numericAddress`

Converts an IPv4 address string into its numeric representation.

- **stringAddress** (string): a string representing an IPv4 address
- returns **numericAddress** (number): the numeric representation of the IPv4
  address, as an unsigned integer. If the input *stringAddress* is not a valid
  representation of an IPv4 address, the function returns *null* and produces
  a warning.

```js
IPV4_TO_NUMBER("0.0.0.0") // 0
IPV4_TO_NUMBER("8.8.8.8") // 134744072
IPV4_TO_NUMBER("127.0.0.1") // 2130706433
IPV4_TO_NUMBER("192.168.0.1") // 3232235521
IPV4_TO_NUMBER("192.168.0.2") // 3232235522
IPV4_TO_NUMBER("milk") // null (and produces a warning)
```

IS_IPV4()
---------

<small>Introduced in: v3.7.2</small>

`IS_IPV4(value) → bool`

Check if an arbitrary string is suitable for interpretation as an IPv4 address.

- **value** (string): an arbitrary string
- returns **bool** (bool): *true* if *value* is a string that can be interpreted
  as an IPv4 address. To be considered valid, the string must contain of 4 octets
  of decimal numbers with 1 to 3 digits length each, allowing the values 0 to 255.
  The octets must be separated by periods and must not have padding zeroes.

```js
IS_IPV4("127.0.0.1") // true
IS_IPV4("8.8.8.8") // true
IS_IPV4("008.008.008.008") // false
IS_IPV4("12345.2.3.4") // false
IS_IPV4("12.34") // false
IS_IPV4(8888) // false
```

JSON_PARSE()
------------

`JSON_PARSE(text) → value`

Return an AQL value described by the JSON-encoded input string.

- **text** (string): the string to parse as JSON
- returns **value** (mixed): the value corresponding to the given JSON text. 
  For input values that are no valid JSON strings, the function will return *null*.

```js
JSON_PARSE("123") // 123
JSON_PARSE("[ true, false, 2 ]") // [ true, false, 2 ]
JSON_PARSE("\\\"abc\\\"") // "abc"
JSON_PARSE("{\\\"a\\\": 1}") // { a : 1 }
JSON_PARSE("abc") // null
```

JSON_STRINGIFY()
----------------

`JSON_STRINGIFY(value) → text`

Return a JSON string representation of the input value.

- **value** (mixed): the value to convert to a JSON string
- returns **text** (string): the JSON string representing *value*.
  For input values that cannot be converted to JSON, the function 
  will return *null*.

```js
JSON_STRINGIFY("1") // "1"
JSON_STRINGIFY("abc") // "\"abc\""
JSON_STRINGIFY("[1, 2, 3]") // "[1,2,3]"
```

LEFT()
------

`LEFT(value, n) → substring`

Return the *n* leftmost characters of the string *value*.

To return the rightmost characters, see [RIGHT()](#right).<br>
To take a part from an arbitrary position off the string,
see [SUBSTRING()](#substring).

- **value** (string): a string
- **n** (number): how many characters to return
- returns **substring** (string): at most *n* characters of *value*,
  starting on the left-hand side of the string

```js
LEFT("foobar", 3) // "foo"
LEFT("foobar", 10) // "foobar"
```

LENGTH()
--------

`LENGTH(str) → length`

Determine the character length of a string.

- **str** (string): a string. If a number is passed, it will be casted to string first.
- returns **length** (number): the character length of *str* (not byte length)

```js
LENGTH("foobar") // 6
LENGTH("电脑坏了") // 4
```

*LENGTH()* can also determine the [number of elements](functions-array.html#length) in an array,
the [number of attribute keys](functions-document.html#length) of an object / document and
the [amount of documents](functions-miscellaneous.html#length) in a collection.

LEVENSHTEIN_DISTANCE()
----------------------

`LEVENSHTEIN_DISTANCE(value1, value2) → distance`

Calculate the [Damerau-Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance){:target="_blank"}
between two strings.

- **value1** (string): a string
- **value2** (string): a string
- returns **distance** (number): calculated Damerau-Levenshtein distance
  between the input strings *value1* and *value2*

```js
LEVENSHTEIN_DISTANCE("foobar", "bar") // 3
LEVENSHTEIN_DISTANCE(" ", "") // 1
LEVENSHTEIN_DISTANCE("The quick brown fox jumps over the lazy dog", "The quick black dog jumps over the brown fox") // 13
LEVENSHTEIN_DISTANCE("der mötör trötet", "der trötet") // 6
```

LIKE()
------

`LIKE(text, search, caseInsensitive) → bool`

Check whether the pattern *search* is contained in the string *text*,
using wildcard matching.

- **text** (string): the string to search in
- **search** (string): a search pattern that can contain the wildcard characters
  `%` (meaning any sequence of characters, including none) and `_` (any single
  character). Literal `%` and `_` must be escaped with two backslashes (four
  in arangosh).
  *search* cannot be a variable or a document attribute. The actual value must
  be present at query parse time already.
- **caseInsensitive** (bool, *optional*): if set to *true*, the matching will be
  case-insensitive. The default is *false*.
- returns **bool** (bool): *true* if the pattern is contained in *text*,
  and *false* otherwise

```js
LIKE("cart", "ca_t")   // true
LIKE("carrot", "ca_t") // false
LIKE("carrot", "ca%t") // true

LIKE("foo bar baz", "bar")   // false
LIKE("foo bar baz", "%bar%") // true
LIKE("bar", "%bar%")         // true

LIKE("FoO bAr BaZ", "fOo%bAz")       // false
LIKE("FoO bAr BaZ", "fOo%bAz", true) // true
```

LOWER()
-------

`LOWER(value) → lowerCaseString`

Convert upper-case letters in *value* to their lower-case counterparts.
All other characters are returned unchanged.

- **value** (string): a string
- returns **lowerCaseString** (string): *value* with upper-case characters converted
  to lower-case characters

LTRIM()
-------

`LTRIM(value, chars) → strippedString`

Return the string *value* with whitespace stripped from the start only.

To strip from the end only, see [RTRIM()](#rtrim).<br>
To strip both sides, see [TRIM()](#trim).

- **value** (string): a string
- **chars** (string, *optional*): override the characters that should
  be removed from the string. It defaults to `\r\n \t` (i.e. `0x0d`, `0x0a`,
  `0x20` and `0x09`).
- returns **strippedString** (string): *value* without *chars* at the
  left-hand side

```js
LTRIM("foo bar") // "foo bar"
LTRIM("  foo bar  ") // "foo bar  "
LTRIM("--==[foo-bar]==--", "-=[]") // "foo-bar]==--"
```

MD5()
-----

`MD5(text) → hash`

Calculate the MD5 checksum for *text* and return it in a hexadecimal
string representation.

- **text** (string): a string
- returns **hash** (string): MD5 checksum as hex string

```js
MD5("foobar") // "3858f62230ac3c915f300c664312c63f"
```

NGRAM_POSITIONAL_SIMILARITY()
-----------------------------

<small>Introduced in: v3.7.0</small>

`NGRAM_POSITIONAL_SIMILARITY(input, target, ngramSize) → similarity`

Calculates the [ngram similarity](https://webdocs.cs.ualberta.ca/~kondrak/papers/spire05.pdf){:target="_blank"}
between *input* and *target* using ngrams with minimum and maximum length of
*ngramSize*.

The similarity is calculated by counting how long the longest sequence of
matching ngrams is, divided by the **longer argument's** total ngram count.
Partially matching ngrams are counted, whereas
[NGRAM_SIMILARITY()](#ngram_similarity) counts only fully matching ngrams.

The ngrams for both input and target are calculated on the fly,
not involving Analyzers.

- **input** (string): source text to be tokenized into ngrams
- **target** (string): target text to be tokenized into ngrams
- **ngramSize** (number): minimum as well as maximum ngram length
- returns **similarity** (number): value between `0.0` and `1.0`

```js
RETURN NGRAM_POSITIONAL_SIMILARITY("quick fox", "quick foxx", 2) // [ 0.8888888955116272 ]
RETURN NGRAM_POSITIONAL_SIMILARITY("quick fox", "quick foxx", 3) // [ 0.875 ]

RETURN NGRAM_POSITIONAL_SIMILARITY("quick fox", "quirky fox", 2) //  [ 0.7222222089767456 ]
RETURN NGRAM_POSITIONAL_SIMILARITY("quick fox", "quirky fox", 3) // [ 0.6666666865348816 ]
```

NGRAM_SIMILARITY()
------------------

<small>Introduced in: v3.7.0</small>

`NGRAM_SIMILARITY(input, target, ngramSize) → similarity`

Calculates [ngram similarity](https://webdocs.cs.ualberta.ca/~kondrak/papers/spire05.pdf){:target="_blank"}
between *input* and *target* using ngrams with minimum and maximum length of
*ngramSize*.

The similarity is calculated by counting how long the longest sequence of
matching ngrams is, divided by **target's** total ngram count.
Only fully matching ngrams are counted, whereas
[NGRAM_POSITIONAL_SIMILARITY()](#ngram_positional_similarity) counts partially
matching ngrams too. This behavior matches the similarity measure used in
[NGRAM_MATCH()](functions-arangosearch.html#ngram_match).

The ngrams for both input and target are calculated on the fly, not involving
Analyzers.

- **input** (string): source text to be tokenized into ngrams
- **target** (string): target text to be tokenized into ngrams
- **ngramSize** (number): minimum as well as maximum ngram length
- returns **similarity** (number): value between `0.0` and `1.0`

```js
RETURN NGRAM_SIMILARITY("quick fox", "quick foxx", 2) // [ 0.8888888955116272 ]
RETURN NGRAM_SIMILARITY("quick fox", "quick foxx", 3) // [ 0.875 ]

RETURN NGRAM_SIMILARITY("quick fox", "quirky fox", 2) // [ 0.5555555820465088 ]
RETURN NGRAM_SIMILARITY("quick fox", "quirky fox", 3) // [ 0.375 ]
```

RANDOM_TOKEN()
--------------

`RANDOM_TOKEN(length) → randomString`

Generate a pseudo-random token string with the specified length.
The algorithm for token generation should be treated as opaque.

- **length** (number): desired string length for the token. It must be greater
  or equal to 0 and at most 65536. A *length* of 0 returns an empty string.
- returns **randomString** (string): a generated token consisting of lowercase
  letters, uppercase letters and numbers

```js
RANDOM_TOKEN(8) // "zGl09z42"
RANDOM_TOKEN(8) // "m9w50Ft9"
```

REGEX_MATCHES()
---------------

`REGEX_MATCHES(text, regex, caseInsensitive) → stringArray`

Return the matches in the given string *text*, using the *regex*.

- **text** (string): the string to search in
- **regex** (string): a regular expression to use for matching the *text*
- returns **stringArray** (array): an array of strings containing the matches

The regular expression may consist of literal characters and the following 
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
  (here: *x*, *y* or *z*)
- `[^xyz]` – negated set of characters. Matches any other character than the
  enclosed ones (i.e. anything but *x*, *y* or *z* in this case)
- `[x-z]` – range of characters. Matches any of the characters in the 
  specified range, e.g. `[0-9A-F]` to match any character in
  *0123456789ABCDEF*
- `[^x-z]` – negated range of characters. Matches any other character than the
  ones specified in the range
- `(xyz)` – defines and matches a pattern group
- `(x|y)` – matches either *x* or *y*
- `^` – matches the beginning of the string (e.g. `^xyz`)
- <code>$</code> – matches the end of the string (e.g. <code>xyz$</code>)

Note that the characters `.`, `*`, `?`, `[`, `]`, `(`, `)`, `{`, `}`, `^`, 
and `$` have a special meaning in regular expressions and may need to be 
escaped using a backslash, which requires escaping itself (`\\`). A literal
backslash needs to be escaped using another escaped backslash, i.e. `\\\\`.
In arangosh, the amount of backslashes needs to be doubled.

Characters and sequences may optionally be repeated using the following
quantifiers:

- `x*` – matches zero or more occurrences of *x*
- `x+` – matches one or more occurrences of *x*
- `x?` – matches one or zero occurrences of *x*
- `x{y}` – matches exactly *y* occurrences of *x*
- `x{y,z}` – matches between *y* and *z* occurrences of *x*
- `x{y,}` – matches at least *y* occurrences of *x*

Note that `xyz+` matches *xyzzz*, but if you want to match *xyzxyz* instead,
you need to define a pattern group by wrapping the sub-expression in parentheses
and place the quantifier right behind it: `(xyz)+`.

If the regular expression in *regex* is invalid, a warning will be raised
and the function will return *null*.

```js
REGEX_MATCHES("My-us3r_n4m3", "^[a-z0-9_-]{3,16}$", true) // ["My-us3r_n4m3"]
REGEX_MATCHES("#4d82h4", "^#?([a-f0-9]{6}|[a-f0-9]{3})$", true) // null
REGEX_MATCHES("john@doe.com", "^([a-z0-9_\.-]+)@([\da-z-]+)\.([a-z\.]{2,6})$", false) // ["john@doe.com", "john", "doe", "com"]
```

REGEX_SPLIT()
-------------

`REGEX_SPLIT(text, splitExpression, caseInsensitive, limit) → stringArray`

Split the given string *text* into a list of strings, using the *separator*.

- **text** (string): the string to split
- **splitExpression** (string): a regular expression to use for splitting the *text*
- **limit** (number, *optional*): limit the number of split values in the result.
  If no *limit* is given, the number of splits returned is not bounded.
- returns **stringArray** (array): an array of strings

The regular expression may consist of literal characters and the following 
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
  (here: *x*, *y* or *z*)
- `[^xyz]` – negated set of characters. Matches any other character than the
enclosed ones (i.e. anything but *x*, *y* or *z* in this case)
- `[x-z]` – range of characters. Matches any of the characters in the 
  specified range, e.g. `[0-9A-F]` to match any character in
  *0123456789ABCDEF*
- `[^x-z]` – negated range of characters. Matches any other character than the
ones specified in the range
- `(xyz)` – defines and matches a pattern group
- `(x|y)` – matches either *x* or *y*
- `^` – matches the beginning of the string (e.g. `^xyz`)
- <code>$</code> – matches the end of the string (e.g. <code>xyz$</code>)

Note that the characters `.`, `*`, `?`, `[`, `]`, `(`, `)`, `{`, `}`, `^`, 
and `$` have a special meaning in regular expressions and may need to be 
escaped using a backslash, which requires escaping itself (`\\`). A literal
backslash needs to be escaped using another escaped backslash, i.e. `\\\\`.
In arangosh, the amount of backslashes needs to be doubled.

Characters and sequences may optionally be repeated using the following
quantifiers:

- `x*` – matches zero or more occurrences of *x*
- `x+` – matches one or more occurrences of *x*
- `x?` – matches one or zero occurrences of *x*
- `x{y}` – matches exactly *y* occurrences of *x*
- `x{y,z}` – matches between *y* and *z* occurrences of *x*
- `x{y,}` – matches at least *y* occurrences of *x*

Note that `xyz+` matches *xyzzz*, but if you want to match *xyzxyz* instead,
you need to define a pattern group by wrapping the sub-expression in parentheses
and place the quantifier right behind it: `(xyz)+`.

If the regular expression in *splitExpression* is invalid, a warning will be raised
and the function will return *null*.

```js
REGEX_SPLIT("This is a line.\n This is yet another line\r\n This again is a line.\r Mac line ", "\.?(\n|\r|\r\n)", true, 4) // ["This is a line", "\n", " This is yet another lin", "\r"]
REGEX_SPLIT("hypertext language, programming", "[\s, ]+") // ["hypertext", "language", "programming"]
REGEX_SPLIT("ca,bc,a,bca,bca,bc", "a,b", true, 5) // ["c", "c,", "c", "c", "c"]
```

REGEX_TEST()
------------

`REGEX_TEST(text, search, caseInsensitive) → bool`

Check whether the pattern *search* is contained in the string *text*,
using regular expression matching.

- **text** (string): the string to search in
- **search** (string): a regular expression search pattern
- returns **bool** (bool): *true* if the pattern is contained in *text*,
  and *false* otherwise
- **caseInsensitive** (bool, *optional*): if set to *true*, the matching will be
  case-insensitive. The default is *false*.

The regular expression may consist of literal characters and the following 
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
  (here: *x*, *y* or *z*)
- `[^xyz]` – negated set of characters. Matches any other character than the
  enclosed ones (i.e. anything but *x*, *y* or *z* in this case)
- `[x-z]` – range of characters. Matches any of the characters in the 
  specified range, e.g. `[0-9A-F]` to match any character in
  *0123456789ABCDEF*
- `[^x-z]` – negated range of characters. Matches any other character than the
  ones specified in the range
- `(xyz)` – defines and matches a pattern group
- `(x|y)` – matches either *x* or *y*
- `^` – matches the beginning of the string (e.g. `^xyz`)
- <code>$</code> – matches the end of the string (e.g. <code>xyz$</code>)

Note that the characters `.`, `*`, `?`, `[`, `]`, `(`, `)`, `{`, `}`, `^`, 
and `$` have a special meaning in regular expressions and may need to be 
escaped using a backslash, which requires escaping itself (`\\`). A literal
backslash needs to be escaped using another escaped backslash, i.e. `\\\\`.
In arangosh, the amount of backslashes needs to be doubled.

Characters and sequences may optionally be repeated using the following
quantifiers:

- `x*` – matches zero or more occurrences of *x*
- `x+` – matches one or more occurrences of *x*
- `x?` – matches one or zero occurrences of *x*
- `x{y}` – matches exactly *y* occurrences of *x*
- `x{y,z}` – matches between *y* and *z* occurrences of *x*
- `x{y,}` – matches at least *y* occurrences of *x*

Note that `xyz+` matches *xyzzz*, but if you want to match *xyzxyz* instead,
you need to define a pattern group by wrapping the sub-expression in parentheses
and place the quantifier right behind it: `(xyz)+`.
 
If the regular expression in *search* is invalid, a warning will be raised
and the function will return *null*.

```js
REGEX_TEST("the quick brown fox", "the.*fox") // true
REGEX_TEST("the quick brown fox", "^(a|the)\s+(quick|slow).*f.x$") // true
REGEX_TEST("the\nquick\nbrown\nfox", "^the(\n[a-w]+)+\nfox$") // true
```

REGEX_REPLACE()
---------------

`REGEX_REPLACE(text, search, replacement, caseInsensitive) → string`

Replace the pattern *search* with the string *replacement* in the string
*text*, using regular expression matching.

- **text** (string): the string to search in
- **search** (string): a regular expression search pattern
- **replacement** (string): the string to replace the *search* pattern with
- returns **string** (string): the string *text* with the *search* regex
  pattern replaced with the *replacement* string wherever the pattern exists
  in *text*
- **caseInsensitive** (bool, *optional*): if set to *true*, the matching will be
  case-insensitive. The default is *false*.

For more details about the rules for characters and sequences refer
[REGEX_TEST()](#regex_test).
 
If the regular expression in *search* is invalid, a warning will be raised
and the function will return *null*.

```js
REGEX_REPLACE("the quick brown fox", "the.*fox", "jumped over") // jumped over
REGEX_REPLACE("the quick brown fox", "o", "i") // the quick briwn fix
```

REVERSE()
---------

`REVERSE(value) → reversedString`

Return the reverse of the string *value*.

- **value** (string): a string
- returns **reversedString** (string): a new string with the characters in
  reverse order

```js
REVERSE("foobar") // "raboof"
REVERSE("电脑坏了") // "了坏脑电"
```

RIGHT()
-------

`RIGHT(value, length) → substring`

Return the *length* rightmost characters of the string *value*.

To return the leftmost characters, see [LEFT()](#left).<br>
To take a part from an arbitrary position off the string,
see [SUBSTRING()](#substring).

- **value** (string): a string
- **length** (number): how many characters to return
- returns **substring** (string): at most *length* characters of *value*,
  starting on the right-hand side of the string

```js
RIGHT("foobar", 3) // "bar"
RIGHT("foobar", 10) // "foobar"
```

RTRIM()
-------

`RTRIM(value, chars) → strippedString`

Return the string *value* with whitespace stripped from the end only.

To strip from the start only, see [LTRIM()](#ltrim).<br>
To strip both sides, see [TRIM()](#trim).

- **value** (string): a string
- **chars** (string, *optional*): override the characters that should
  be removed from the string. It defaults to `\r\n \t` (i.e. `0x0d`, `0x0a`,
  `0x20` and `0x09`).
- returns **strippedString** (string): *value* without *chars* at the
  right-hand side

```js
RTRIM("foo bar") // "foo bar"
RTRIM("  foo bar  ") // "  foo bar"
RTRIM("--==[foo-bar]==--", "-=[]") // "--==[foo-bar"
```

SHA1()
------

`SHA1(text) → hash`

Calculate the SHA1 checksum for *text* and returns it in a hexadecimal
string representation.

- **text** (string): a string
- returns **hash** (string): SHA1 checksum as hex string

```js
SHA1("foobar") // "8843d7f92416211de9ebb963ff4ce28125932878"
```

SHA512()
--------

`SHA512(text) → hash`

Calculate the SHA512 checksum for *text* and returns it in a hexadecimal
string representation.

- **text** (string): a string
- returns **hash** (string): SHA512 checksum as hex string

```js
SHA512("foobar") // "0a50261ebd1a390fed2bf326f2673c145582a6342d523204973d0219337f81616a8069b012587cf5635f6925f1b56c360230c19b273500ee013e030601bf2425"
```

SPLIT()
-------

`SPLIT(value, separator, limit) → strArray`

Split the given string *value* into a list of strings, using the *separator*.

- **value** (string): a string
- **separator** (string): either a string or a list of strings. If *separator* is
  an empty string, *value* will be split into a list of characters. If no *separator*
  is specified, *value* will be returned as array.
- **limit** (number, *optional*): limit the number of split values in the result.
  If no *limit* is given, the number of splits returned is not bounded.
- returns **strArray** (array): an array of strings

```js
SPLIT( "foo-bar-baz", "-" ) // [ "foo", "bar", "baz" ]
SPLIT( "foo-bar-baz", "-", 1 ) // [ "foo" ]
SPLIT( "foo, bar & baz", [ ", ", " & " ] ) // [ "foo", "bar", "baz" ]
```

SOUNDEX()
-----------

`SOUNDEX(value) → soundexString`

Return the soundex fingerprint of *value*.

- **value** (string): a string
- returns **soundexString** (string): a soundex fingerprint of *value*

```js
SOUNDEX( "example" ) // "E251"
SOUNDEX( "ekzampul")  // "E251"
SOUNDEX( "soundex" ) // "S532"
SOUNDEX( "sounteks" ) // "S532"
```

SUBSTITUTE()
------------

`SUBSTITUTE(value, search, replace, limit) → substitutedString`

Replace search values in the string *value*.

- **value** (string): a string
- **search** (string\|array): if *search* is a string, all occurrences of
  *search* will be replaced in *value*. If *search* is an array of strings,
  each occurrence of a value contained in *search* will be replaced by the
  corresponding array element in *replace*. If *replace* has less list items
  than *search*, occurrences of unmapped *search* items will be replaced by an
  empty string.
- **replace** (string\|array, *optional*): a replacement string, or an array of
  strings to replace the corresponding elements of *search* with. Can have less
  elements than *search* or be left out to remove matches. If *search* is an array
  but *replace* is a string, then all matches will be replaced with *replace*.
- **limit** (number, *optional*): cap the number of replacements to this value
- returns **substitutedString** (string): a new string with matches replaced
  (or removed)

```js
SUBSTITUTE( "the quick brown foxx", "quick", "lazy" )
// "the lazy brown foxx"

SUBSTITUTE( "the quick brown foxx", [ "quick", "foxx" ], [ "slow", "dog" ] )
// "the slow brown dog"

SUBSTITUTE( "the quick brown foxx", [ "the", "foxx" ], [ "that", "dog" ], 1 )
//  "that quick brown foxx"

SUBSTITUTE( "the quick brown foxx", [ "the", "quick", "foxx" ], [ "A", "VOID!" ] )
// "A VOID! brown "

SUBSTITUTE( "the quick brown foxx", [ "quick", "foxx" ], "xx" )
// "the xx brown xx"
```

`SUBSTITUTE(value, mapping, limit) → substitutedString`

Alternatively, *search* and *replace* can be specified in a combined value.

- **value** (string): a string
- **mapping** (object): a lookup map with search strings as keys and replacement
  strings as values. Empty strings and *null* as values remove matches.
  Please note that no sequence of search strings can be warrantied by this; 
  Means, if you have overlapping search results, one time the first may win, 
  another time the second. If you need to ensure the precedence of the sequence
  choose the array based invocation method.
- **limit** (number, *optional*): cap the number of replacements to this value
- returns **substitutedString** (string): a new string with matches replaced
  (or removed)

```js
SUBSTITUTE("the quick brown foxx", {
  "quick": "small",
  "brown": "slow",
  "foxx": "ant"
})
// "the small slow ant"

SUBSTITUTE("the quick brown foxx", { 
  "quick": "",
  "brown": null,
  "foxx": "ant"
})
// "the   ant"

SUBSTITUTE("the quick brown foxx", {
  "quick": "small",
  "brown": "slow",
  "foxx": "ant"
}, 2)
// "the small slow foxx"
```

SUBSTRING()
-----------

`SUBSTRING(value, offset, length) → substring`

Return a substring of *value*.

To return the rightmost characters, see [RIGHT()](#right).<br>
To return the leftmost characters, see [LEFT()](#left).

- **value** (string): a string
- **offset** (number): start at *offset*, offsets start at position 0
- **length** (number, *optional*): at most *length* characters, omit to get the
  substring from *offset* to the end of the string
- returns **substring** (string): a substring of *value*

TOKENS()
--------

`TOKENS(input, analyzer) → tokenArray`

Split the **input** string(s) with the help of the specified **analyzer** into an
array. The resulting array can be used in `FILTER` or `SEARCH` statements with
the `IN` operator, but also be assigned to variables and returned. This can be
used to better understand how a specific Analyzer processes an input value.

It has a regular return value unlike all other ArangoSearch AQL functions and
is thus not limited to `SEARCH` operations. It is independent of Views.
A wrapping `ANALYZER()` call in a search expression does not affect the
*analyzer* argument nor allow you to omit it.

- **input** (string\|array): text to tokenize. Accepts recursive arrays of
  strings (introduced in v3.6.0).
- **analyzer** (string): name of an [Analyzer](../arangosearch-analyzers.html).
- returns **tokenArray** (array): array of strings with zero or more elements,
  each element being a token.

Example query showcasing the `"text_de"` Analyzer (tokenization with stemming,
case conversion and accent removal for German text):

```js
RETURN TOKENS("Lörem ipsüm, DOLOR SIT Ämet.", "text_de")
```

```json
[
  [
    "lor",
    "ipsum",
    "dolor",
    "sit",
    "amet"
  ]
]
```

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

```js
TOKENS("quick brown fox", "text_en")        // [ "quick", "brown", "fox" ]
TOKENS(["quick brown", "fox"], "text_en")   // [ ["quick", "brown"], ["fox"] ]
TOKENS(["quick brown", ["fox"]], "text_en") // [ ["quick", "brown"], [["fox"]] ]
```

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

`TO_BASE64(value) → toBase64String`

Return the base64 representation of *value*.

- **value** (string): a string
- returns **toBase64String** (string): a base64 representation of *value*

TO_HEX()
-----------

`TO_HEX(value) → toHexString`

Return the hex representation of *value*.

- **value** (string): a string
- returns **toHexString** (string): a hex representation of *value*

TRIM()
------

`TRIM(value, type) → strippedString`

Return the string *value* with whitespace stripped from the start and/or end.

The optional *type* parameter specifies from which parts of the string the
whitespace is stripped. [LTRIM()](#ltrim)
and [RTRIM()](#rtrim) are preferred
however.

- **value** (string): a string
- **type** (number, *optional*): strip whitespace from the
  - `0` – start and end of the string (default)
  - `1` – start of the string only
  - `2` – end of the string only

`TRIM(value, chars) → strippedString`

Return the string *value* with whitespace stripped from the start and end.

- **value** (string): a string
- **chars** (string, *optional*): override the characters that should
  be removed from the string. It defaults to `\r\n \t` (i.e. `0x0d`, `0x0a`,
  `0x20` and `0x09`).
- returns **strippedString** (string): *value* without *chars* on both sides

```js
TRIM("foo bar") // "foo bar"
TRIM("  foo bar  ") // "foo bar"
TRIM("--==[foo-bar]==--", "-=[]") // "foo-bar"
TRIM("  foobar\t \r\n ") // "foobar"
TRIM(";foo;bar;baz, ", ",; ") // "foo;bar;baz"
```

UPPER()
-------

`UPPER(value) → upperCaseString`

Convert lower-case letters in *value* to their upper-case counterparts.
All other characters are returned unchanged.

- **value** (string): a string
- returns **upperCaseString** (string): *value* with lower-case characters converted
  to upper-case characters
  
UUID()
------

`UUID() → UUIDString`

Return a universally unique identifier value.

- returns **UUIDString** (string): a universally unique identifier
