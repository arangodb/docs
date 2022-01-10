---
layout: default
description: Analyzers parse input values and transform them into sets of sub-values, for example by breaking up text into words.
title: Transforming data with Analyzers
redirect_from:
  - views-arango-search-analyzers.html # 3.4 -> 3.5
  - arangosearch-analyzers.html # 3.8 -> 3.8
---
Transforming data with Analyzers
================================

Analyzers allow you to transform data, for sophisticated text processing and
searching, either standalone or in combination with Views
{:class="lead"}

While AQL string functions allow for basic text manipulation, true text
processing including tokenization, language-specific word stemming, case
conversion and removal of diacritical marks (accents) from characters only
become possible with Analyzers.

Analyzers parse input values and transform them into sets of sub-values,
for example by breaking up text into words. If they are used in Views then
the documents' attribute values of the linked collections are used as input
and additional metadata is produced internally. The data can then be used for
searching and sorting to provide the most appropriate match for the specified
conditions, similar to queries to web search engines.

Analyzers can be used on their own to tokenize and normalize strings in AQL
queries with the [`TOKENS()` function](aql/functions-string.html#tokens).

<!-- TODO: Add arangosh example how to create and test custom Analyzer -->

How Analyzers process values depends on their type and configuration.
The configuration is comprised of type-specific properties and list of features.
The features control the additional metadata to be generated to augment View
indexes, to be able to rank results for instance.

Analyzers can be managed via an [HTTP API](http/analyzers.html) and through
a [JavaScript module](appendix-java-script-modules-analyzers.html).

{% include youtube.html id="tbOTYL26reg" %}

Value Handling
--------------

While most of the Analyzer functionality is geared towards text processing,
there is no restriction to strings as input data type when using them through
Views – your documents could have attributes of any data type after all.

Strings are processed according to the Analyzer, whereas other primitive data
types (`null`, `true`, `false`, numbers) are added to the index unchanged.

The elements of arrays are unpacked, processed and indexed individually,
regardless of the level of nesting. That is, strings are processed by the
configured Analyzer(s) and other primitive values are indexed as-is.

Objects, including any nested objects, are indexed as sub-attributes.
This applies to sub-objects as well as objects in arrays. Only primitive values
are added to the index, arrays and objects can not be searched for.

Also see:
- [SEARCH operation](aql/operations-search.html) on how to query indexed
  values such as numbers and nested values
- [ArangoSearch Views](arangosearch-views.html) for details about how
  compound data types (arrays, objects) get indexed

Analyzer Names
--------------

Each Analyzer has a name for identification with the following
naming conventions:

- The name must only consist of the letters `a` to `z` (both in lower and
  upper case), the numbers `0` to `9`, underscore (`_`) and dash (`-`) symbols.
  This also means that any non-ASCII names are not allowed.
- It must always start with a letter.
- The maximum allowed length of a name is 254 bytes.
- Analyzer names are case-sensitive.

Custom Analyzers are stored per database, in a system collection `_analyzers`.
The names get prefixed with the database name and two colons, e.g.
`myDB::customAnalyzer`.This does not apply to the globally available
[built-in Analyzers](#built-in-analyzers), which are not stored in an
`_analyzers` collection.

Custom Analyzers stored in the `_system` database can be referenced in queries
against other databases by specifying the prefixed name, e.g.
`_system::customGlobalAnalyzer`. Analyzers stored in databases other than
`_system` can not be accessed from within another database however.

Analyzer Types
--------------

The currently implemented Analyzer types are:

- `identity`: treat value as atom (no transformation)
- `delimiter`: split into tokens at user-defined character
- `stem`: apply stemming to the value as a whole
- `norm`: apply normalization to the value as a whole
- `ngram`: create _n_-grams from value with user-defined lengths
- `text`: tokenize into words, optionally with stemming,
  normalization, stop-word filtering and edge _n_-gram generation

Available normalizations are case conversion and accent removal
(conversion of characters with diacritical marks to the base characters).

Analyzer    /    Feature  | Tokenization | Stemming | Normalization | _N_-grams
:-------------------------|:------------:|:--------:|:-------------:|:--------:
[`identity`](#identity)   |      No      |    No    |      No       |   No
[`delimiter`](#delimiter) |    (Yes)     |    No    |      No       |   No
[`stem`](#stem)           |      No      |   Yes    |      No       |   No
[`norm`](#norm)           |      No      |    No    |     Yes       |   No
[`ngram`](#ngram)         |      No      |    No    |      No       |  Yes
[`text`](#text)           |     Yes      |   Yes    |     Yes       | (Yes)

Analyzer Properties
-------------------

The valid attributes/values for the *properties* are dependant on what *type*
is used. For example, the `delimiter` type needs to know the desired delimiting
character(s), whereas the `text` type takes a locale, stop-words and more.

### `identity`

An Analyzer applying the `identity` transformation, i.e. returning the input
unmodified.

It does not support any *properties* and will ignore them.

**Examples**

Applying the identity Analyzers does not perform any transformations, hence
the input is returned unaltered:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerIdentity
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerIdentity}
      db._query(`RETURN TOKENS("UPPER lower dïäcríticš", "identity")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerIdentity
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `delimiter`

An Analyzer capable of breaking up delimited text into tokens as per
[RFC 4180](https://tools.ietf.org/html/rfc4180)
(without starting new records on newlines).

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `delimiter` (string): the delimiting character(s)


**Examples**

Split input strings into tokens at hyphen-minus characters:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerDelimiter
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerDelimiter}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("delimiter_hyphen", "delimiter", {
    |   delimiter: "-"
      }, ["frequency", "norm", "position"]);
      db._query(`RETURN TOKENS("some-delimited-words", "delimiter_hyphen")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerDelimiter
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `stem`

An Analyzer capable of stemming the text, treated as a single token,
for supported languages.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `locale` (string): a locale in the format
  `language[_COUNTRY][.encoding][@variant]` (square brackets denote optional
  parts), e.g. `"de.utf-8"` or `"en_US.utf-8"`. Only UTF-8 encoding is
  meaningful in ArangoDB. The locale is forwarded to ICU without checks.
  An invalid locale does not prevent the creation of the Analyzer.
  Also see [Supported Languages](#supported-languages).

**Examples**

Apply stemming to the input string as a whole:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerStem
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerStem}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("stem_en", "stem", {
    |   locale: "en.utf-8"
      }, ["frequency", "norm", "position"]);
      db._query(`RETURN TOKENS("databases", "stem_en")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerStem
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `norm`

An Analyzer capable of normalizing the text, treated as a single
token, i.e. case conversion and accent removal.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `locale` (string): a locale in the format
  `language[_COUNTRY][.encoding][@variant]` (square brackets denote optional
  parts), e.g. `"de.utf-8"` or `"en_US.utf-8"`. Only UTF-8 encoding is
  meaningful in ArangoDB. The locale is forwarded to ICU without checks.
  An invalid locale does not prevent the creation of the Analyzer.
  Also see [Supported Languages](#supported-languages).
- `accent` (boolean, _optional_):
  - `true` to preserve accented characters (default)
  - `false` to convert accented characters to their base characters
- `case` (string, _optional_):
  - `"lower"` to convert to all lower-case characters
  - `"upper"` to convert to all upper-case characters
  - `"none"` to not change character case (default)

**Examples**

Convert input string to all upper-case characters:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerNorm1
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerNorm1}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("norm_upper", "norm", {
    |   locale: "en.utf-8",
    |   case: "upper"
      }, ["frequency", "norm", "position"]);
      db._query(`RETURN TOKENS("UPPER lower dïäcríticš", "norm_upper")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerNorm1
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Convert accented characters to their base characters:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerNorm2
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerNorm2}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("norm_accent", "norm", {
    |   locale: "en.utf-8",
    |   accent: false
      }, ["frequency", "norm", "position"]);
      db._query(`RETURN TOKENS("UPPER lower dïäcríticš", "norm_accent")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerNorm2
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Convert input string to all lower-case characters and remove diacritics:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerNorm3
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerNorm3}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("norm_accent_lower", "norm", {
    |   locale: "en.utf-8",
    |   accent: false,
    |   case: "lower"
      }, ["frequency", "norm", "position"]);
      db._query(`RETURN TOKENS("UPPER lower dïäcríticš", "norm_accent_lower")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerNorm3
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `ngram`

An Analyzer capable of producing _n_-grams from a specified input in a range of
min..max (inclusive). Can optionally preserve the original input.

This Analyzer type can be used to implement substring matching.
Note that it slices the input based on bytes and not characters by default
(*streamType*). The *"binary"* mode supports single-byte characters only;
multi-byte UTF-8 characters raise an *Invalid UTF-8 sequence* query error.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `min` (number): unsigned integer for the minimum _n_-gram length
- `max` (number): unsigned integer for the maximum _n_-gram length
- `preserveOriginal` (boolean):
  - `true` to include the original value as well
  - `false` to produce the _n_-grams based on *min* and *max* only
- `startMarker` (string, _optional_): this value will be prepended to _n_-grams
  which include the beginning of the input. Can be used for matching prefixes.
  Choose a character or sequence as marker which does not occur in the input.
- `endMarker` (string, _optional_): this value will be appended to _n_-grams
  which include the end of the input. Can be used for matching suffixes.
  Choose a character or sequence as marker which does not occur in the input.
- `streamType` (string, _optional_): type of the input stream
  - `"binary"`: one byte is considered as one character (default)
  - `"utf8"`: one Unicode codepoint is treated as one character

**Examples**

With *min* = `4` and *max* = `5`, the Analyzer will produce the following
_n_-grams for the input string `"foobar"`:
- `"foob"`
- `"fooba"`
- `"foobar"` (if *preserveOriginal* is enabled)
- `"ooba"`
- `"oobar"`
- `"obar"`

An input string `"foo"` will not produce any _n_-gram unless *preserveOriginal*
is enabled, because it is shorter than the *min* length of 4.

Above example but with *startMarker* = `"^"` and *endMarker* = `"$"` would
produce the following:
- `"^foob"`
- `"^fooba"`
- `"^foobar"` (if *preserveOriginal* is enabled)
- `"foobar$"` (if *preserveOriginal* is enabled)
- `"ooba"`
- `"oobar$"`
- `"obar$"`

Create and use a trigram Analyzer with `preserveOriginal` disabled:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerNgram1
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerNgram1}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("trigram", "ngram", {
    |   min: 3,
    |   max: 3,
    |   preserveOriginal: false,
    |   streamType: "utf8"
      }, ["frequency", "norm", "position"]);
      db._query(`RETURN TOKENS("foobar", "trigram")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerNgram1
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create and use a bigram Analyzer with `preserveOriginal` enabled and with start
and stop markers:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerNgram2
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerNgram2}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("bigram_markers", "ngram", {
    |   min: 2,
    |   max: 2,
    |   preserveOriginal: true,
    |   startMarker: "^",
    |   endMarker: "$",
    |   streamType: "utf8"
      }, ["frequency", "norm", "position"]);
      db._query(`RETURN TOKENS("foobar", "bigram_markers")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerNgram2
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `text`

An Analyzer capable of breaking up strings into individual words while also
optionally filtering out stop-words, extracting word stems, applying
case conversion and accent removal.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `locale` (string): a locale in the format
  `language[_COUNTRY][.encoding][@variant]` (square brackets denote optional
  parts), e.g. `"de.utf-8"` or `"en_US.utf-8"`. Only UTF-8 encoding is
  meaningful in ArangoDB. The locale is forwarded to ICU without checks.
  An invalid locale does not prevent the creation of the Analyzer.
  Also see [Supported Languages](#supported-languages).
- `accent` (boolean, _optional_):
  - `true` to preserve accented characters
  - `false` to convert accented characters to their base characters (default)
- `case` (string, _optional_):
  - `"lower"` to convert to all lower-case characters (default)
  - `"upper"` to convert to all upper-case characters
  - `"none"` to not change character case
- `stemming` (boolean, _optional_):
  - `true` to apply stemming on returned words (default)
  - `false` to leave the tokenized words as-is
- `edgeNgram` (object, _optional_): if present, then edge _n_-grams are generated
  for each token (word). That is, the start of the _n_-gram is anchored to the
  beginning of the token, whereas the `ngram` Analyzer would produce all
  possible substrings from a single input token (within the defined length
  restrictions). Edge _n_-grams can be used to cover word-based auto-completion
  queries with an index, for which you should set the following other options:
  `accent: false`, `case: "lower"` and most importantly `stemming: false`.
  - `min` (number, _optional_): minimal _n_-gram length
  - `max` (number, _optional_): maximal _n_-gram length
  - `preserveOriginal` (boolean, _optional_): whether to include the original
    token even if its length is less than *min* or greater than *max*
- `stopwords` (array, _optional_): an array of strings with words to omit
  from result. Default: load words from `stopwordsPath`. To disable stop-word
  filtering provide an empty array `[]`. If both *stopwords* and
  *stopwordsPath* are provided then both word sources are combined.
- `stopwordsPath` (string, _optional_): path with a *language* sub-directory
  (e.g. `en` for a locale `en_US.utf-8`) containing files with words to omit.
  Each word has to be on a separate line. Everything after the first whitespace
  character on a line will be ignored and can be used for comments. The files
  can be named arbitrarily and have any file extension (or none).

  Default: if no path is provided then the value of the environment variable
  `IRESEARCH_TEXT_STOPWORD_PATH` is used to determine the path, or if it is
  undefined then the current working directory is assumed. If the `stopwords`
  attribute is provided then no stop-words are loaded from files, unless an
  explicit *stopwordsPath* is also provided.

  Note that if the *stopwordsPath* can not be accessed, is missing language
  sub-directories or has no files for a language required by an Analyzer,
  then the creation of a new Analyzer is refused. If such an issue is 
  discovered for an existing Analyzer during startup then the server will
  abort with a fatal error.

**Examples**

The built-in `text_en` Analyzer has stemming enabled (note the word endings):

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerTextStem
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerTextStem}
      db._query(`RETURN TOKENS("Crazy fast NoSQL-database!", "text_en")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerTextStem
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

You may create a custom Analyzer with the same configuration but with stemming
disabled like this:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerTextNoStem
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerTextNoStem}
      var analyzers = require("@arangodb/analyzers")
    | var a = analyzers.save("text_en_nostem", "text", {
    |   locale: "en.utf-8",
    |   case: "lower",
    |   accent: false,
    |   stemming: false,
    |   stopwords: []
      }, ["frequency","norm","position"])
      db._query(`RETURN TOKENS("Crazy fast NoSQL-database!", "text_en_nostem")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerTextNoStem
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Custom text Analyzer with the edge _n_-grams feature and normalization enabled,
stemming disabled and `"the"` defined as stop-word to exclude it:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerTextEdgeNgram
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerTextEdgeNgram}
    ~ var analyzers = require("@arangodb/analyzers")
    | var a = analyzers.save("text_edge_ngrams", "text", {
    |   edgeNgram: { min: 3, max: 8, preserveOriginal: true },
    |   locale: "en.utf-8",
    |   case: "lower",
    |   accent: false,
    |   stemming: false,
    |   stopwords: [ "the" ]
      }, ["frequency","norm","position"])
    | db._query(`RETURN TOKENS(
    |   "The quick brown fox jumps over the dogWithAVeryLongName",
    |   "text_edge_ngrams"
      )`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerTextEdgeNgram
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Analyzer Features
-----------------

The *features* of an Analyzer determine what term matching capabilities will be
available and as such are only applicable in the context of ArangoSearch Views.

The valid values for the features are dependant on both the capabilities of
the underlying *type* and the query filtering and sorting functions that the
result can be used with. For example the *text* type will produce
`frequency` + `norm` + `position` and the `PHRASE()` AQL function requires
`frequency` + `position` to be available.

Currently the following *features* are supported:

- **frequency**: how often a term is seen, required for `PHRASE()`
- **norm**: the field normalization factor
- **position**: sequentially increasing term position, required for `PHRASE()`.
  If present then the *frequency* feature is also required

Built-in Analyzers
------------------

There is a set of built-in Analyzers which are available by default for
convenience and backward compatibility. They can not be removed.

The `identity` Analyzer has no properties and the features `frequency`
and `norm`. The Analyzers of type `text` all tokenize strings with stemming
enabled, no stopwords configured, accent removal and case conversion to
lowercase turned on and the features `frequency`, `norm` and `position`:

Name       | Type       | Locale (Language)       | Case    | Accent  | Stemming | Stopwords | Features |
-----------|------------|-------------------------|---------|---------|----------|-----------|----------|
`identity` | `identity` |                         |         |         |          |           | `["frequency", "norm"]`
`text_de`  | `text`     | `de.utf-8` (German)     | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
`text_en`  | `text`     | `en.utf-8` (English)    | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
`text_es`  | `text`     | `es.utf-8` (Spanish)    | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
`text_fi`  | `text`     | `fi.utf-8` (Finnish)    | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
`text_fr`  | `text`     | `fr.utf-8` (French)     | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
`text_it`  | `text`     | `it.utf-8` (Italian)    | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
`text_nl`  | `text`     | `nl.utf-8` (Dutch)      | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
`text_no`  | `text`     | `no.utf-8` (Norwegian)  | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
`text_pt`  | `text`     | `pt.utf-8` (Portuguese) | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
`text_ru`  | `text`     | `ru.utf-8` (Russian)    | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
`text_sv`  | `text`     | `sv.utf-8` (Swedish)    | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
`text_zh`  | `text`     | `zh.utf-8` (Chinese)    | `lower` | `false` | `true`   | `[ ]`     | `["frequency", "norm", "position"]`
{:class="table-scroll"}

Note that _locale_, _case_, _accent_, _stemming_ and _stopwords_ are Analyzer
properties. `text_zh` does not have actual stemming support for Chinese despite
what the property value suggests.

Supported Languages
-------------------

Analyzers rely on [ICU](http://site.icu-project.org/){:target="_blank"} for
language-dependent tokenization and normalization. The ICU data file
`icudtl.dat` that ArangoDB ships with contains information for a lot of
languages, which are technically all supported.

{% hint 'warning' %}
The alphabetical order of characters is not taken into account by ArangoSearch,
i.e. range queries in SEARCH operations against Views will not follow the
language rules as per the defined Analyzer locale nor the server language
(startup option `--default-language`)!
Also see [Known Issues](release-notes-known-issues37.html#arangosearch).
{% endhint %}

Stemming support is provided by [Snowball](https://snowballstem.org/){:target="_blank"},
which supports the following languages:

Language     | Code
-------------|-----
Arabic     * | `ar`
Basque     * | `eu`
Catalan    * | `ca`
Danish     * | `da`
Dutch        | `nl`
English      | `en`
Finnish      | `fi`
French       | `fr`
German       | `de`
Greek      * | `el`
Hindi      * | `hi`
Hungarian  * | `hu`
Indonesian * | `id`
Irish      * | `ga`
Italian      | `it`
Lithuanian * | `lt`
Nepali     * | `ne`
Norwegian    | `no`
Portuguese   | `pt`
Romanian   * | `ro`
Russian      | `ru`
Serbian    * | `sr`
Spanish      | `es`
Swedish      | `sv`
Tamil      * | `ta`
Turkish    * | `tr`

\* <small>Introduced in: v3.7.0</small>
