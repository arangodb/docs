---
layout: default
description: Analyzers parse input values and transform them into sets of sub-values, for example by breaking up text into words.
title: ArangoSearch Analyzers
redirect_from: /3.4/analyzers.html
---
ArangoSearch Analyzers
======================

Analyzers parse input values and transform them into sets of sub-values,
for example by breaking up text into words. If they are used in Views then
the documents' attribute values of the linked collections are used as input
and additional metadata is produced internally. The data can then be used for
searching and sorting to provide the most appropriate match for the specified
conditions, similar to queries to web search engines.

Analyzers can be used on their own to tokenize and normalize strings in AQL
queries with the [`TOKENS()` function](aql/functions-arangosearch.html#tokens).

How analyzers process values depends on their type and configuration.
The configuration is comprised of type-specific properties and list of features.
The features control the additional metadata to be generated to augment View
indexes, to be able to rank results for instance.

Analyzer Names
--------------

Each analyzer has a name for identification with the following
naming conventions, similar to collection names:

- The name must only consist of the letters `a` to `z` (both in lower and
  upper case), the numbers `0` to `9`, underscore (`_`) and dash (`-`) symbols.
  This also means that any non-ASCII names are not allowed.
- It must always start with a letter.
- The maximum allowed length of a name is 64 bytes.
- Analyzer names are case-sensitive.

Analyzers are stored per database (in a system collection `_analyzers`).
Their names are unique per database.

Analyzer Types
--------------

The currently implemented Analyzer types are:

- `identity`: treat value as atom (no transformation)
- `delimiter`: split into tokens at user-defined character
- `stem`: apply stemming to the value as a whole
- `norm`: apply normalization to the value as a whole
- `ngram`: create n-grams from value with user-defined lengths
- `text`: tokenize into words, optionally with stemming,
  normalization and stop-word filtering

Available normalizations are case conversion and accent removal
(conversion of characters with diacritical marks to the base characters).

Feature / Analyzer | Identity | N-gram  | Delimiter | Stem | Norm | Text
-------------------|----------|---------|-----------|------|------|-----
**Tokenization**   | No       | No      | (Yes)     | No   | No   | Yes
**Stemming**       | No       | No      | No        | Yes  | No   | Yes
**Normalization**  | No       | No      | No        | No   | Yes  | Yes

Analyzer Properties
-------------------

The valid values for the *properties* are dependant on what *type* is used.
For example for the `text` type its property may simply be an object with the
value `"locale": "en"`, whereas for the `delimited` type its property may simply
be the delimiter `,`. <!-- text analyzer doesn't seem to accept just a locale -->

### Identity

An Analyzer applying the `identity` transformation, i.e. returning the input
unmodified.

It does not support any *properties* and will ignore them.

### Delimiter

An Analyzer capable of breaking up delimited text into tokens as per
[RFC 4180](https://tools.ietf.org/html/rfc4180)
(without starting new records on newlines).

The *properties* allowed for this Analyzer are either:

- a string to use as delimiter
- an object with the attribute `delimiter` containing the delimiter string
  to use

### Stem

An Analyzer capable of stemming the text, treated as a single token,
for supported languages.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `locale` (string): a locale in the format
  `language[_COUNTRY][.encoding][@variant]` (square brackets denote optional
  parts), e.g. `"de.utf-8"` or `"en_US.utf-8"`. Only UTF-8 encoding is
  meaningful in ArangoDB.

###  Norm

An Analyzer capable of normalizing the text, treated as a single
token, i.e. case conversion and accent removal.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `locale` (string): a locale in the format
  `language[_COUNTRY][.encoding][@variant]` (square brackets denote optional
  parts), e.g. `"de.utf-8"` or `"en_US.utf-8"`. Only UTF-8 encoding is
  meaningful in ArangoDB.
- `accent` (boolean, _optional_):
  - `true` to preserve accented characters (default)
  - `false` to convert accented characters to their base characters
- `case` (string, _optional_):
  - `"lower"` to convert to all lower-case characters
  - `"upper"` to convert to all upper-case characters
  - `"none"` to not change character case (default)

### N-gram

An Analyzer capable of producing n-grams from a specified input in a range of
[min;max] (inclusive). Can optionally preserve the original input.

This Analyzer type can be used to implement substring matching.
Note that it currently supports single-byte characters only.
Multi-byte UTF-8 characters raise an *Invalid UTF-8 sequence* query error.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `min` (number): unsigned integer for the minimum n-gram length
- `max` (number): unsigned integer for the maximum n-gram length
- `preserveOriginal` (boolean):
  - `true` to include the original value as well
  - `false` to produce the n-grams based on *min* and *max* only

**Example**

With `min` = 4 and `max` = 5, the analyzer will produce the following n-grams
for the input string `"foobar"`:
- `"foobar"` (if `preserveOriginal` is enabled)
- `"fooba"`
- `"foob"`
- `"oobar"`
- `"ooba"`
- `"obar"`

An input string `"foo"` will not produce any n-gram because it is shorter
than the `min` length of 4.

### Text

An Analyzer capable of breaking up strings into individual words while also
optionally filtering out stop-words, extracting word stems, applying
case conversion and accent removal.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `locale` (string): a locale in the format
  `language[_COUNTRY][.encoding][@variant]` (square brackets denote optional
  parts), e.g. `"de.utf-8"` or `"en_US.utf-8"`. Only UTF-8 encoding is
  meaningful in ArangoDB.
- `accent` (boolean, _optional_):
  - `true` to preserve accented characters (default)
  - `false` to convert accented characters to their base characters
- `case` (string, _optional_):
  - `"lower"` to convert to all lower-case characters
  - `"upper"` to convert to all upper-case characters
  - `"none"` to not change character case (default)
- `stemming` (boolean, _optional_):
  - `true` to apply stemming on returned words (default)
  - `false` to leave the tokenized words as-is
- `stopwords` (array, _optional_): an array of strings with words to omit
  from result. Default: load words from `stopwordsPath`
- `stopwordsPath` (string, _optional_): path with a `language` sub-directory
  containing files with words to omit. Default: if no path is provided then
  the value of the environment variable `IRESEARCH_TEXT_STOPWORD_PATH` is
  used, or if it is undefined then the current working directory is assumed
<!-- are stopwords and the ones from the files merged? -->

Analyzer Features
-----------------

The *features* of an Analyzer determine what term matching capabilities will be
available and as such are only applicable in the context of ArangoSearch Views.

The valid values for the features are dependant on both the capabilities of
the underlying *type* and the query filtering and sorting functions that the
result can be used with. For example the *text* type will produce <!-- supports? -->
`frequency` + `norm` + `position` and the `PHRASE()` AQL function requires
`frequency` + `position` to be available.

Currently the following *features* are supported:

- **frequency**: how often a term is seen, required for `PHRASE()`
- **norm**: the field normalization factor
- **position**: sequentially increasing term position, required for `PHRASE()`.
  If present then the *frequency* feature is also required

Built-in Analyzers
------------------

There is a set of built-in analyzers which are available by default for
convenience and backward compatibility. They can not be removed.

The `identity` analyzer has the features `frequency` and `norm`.
The analyzers of type `text` all tokenize strings with stemming enabled,
no stopwords configured, case conversion set to `lower`, accent removal
turned on and the features `frequency`, `norm` and `position`:

Name       | Type       | Language
-----------|------------|-----------
`identity` | `identity` | none
`text_de`  | `text`     | German
`text_en`  | `text`     | English
`text_es`  | `text`     | Spanish
`text_fi`  | `text`     | Finnish
`text_fr`  | `text`     | French
`text_it`  | `text`     | Italian
`text_nl`  | `text`     | Dutch
`text_no`  | `text`     | Norwegian
`text_pt`  | `text`     | Portuguese
`text_ru`  | `text`     | Russian
`text_sv`  | `text`     | Swedish
`text_zh`  | `text`     | Chinese


<!--
default context identity, [1,2,"blue"] -> SEARCH doc.arr == 1 (yes) / "blue" (no)

can't compare to arrays or objects

TOKENS() currently accepts any string value, and an analyzer name, and will produce
an array of zero or more tokens generated by the specified analyzer
transformation.

- count how often a value occurs


To simplify query syntax ArangoSearch provides a concept of named analyzers
which are merely aliases for type+configuration of IResearch analyzers. See
the [Analyzers](analyzers.html) for a description of their usage
and management.

-> can be referred to by name in AQL (AQL docs)

The Analyzer implementations themselves are provided by the underlying
[IResearch library](https://github.com/iresearch-toolkit/iresearch){:target="_blank"}.

-->
