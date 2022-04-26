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
- `segmentation`: language-agnostic text tokenization, optionally with
  normalization
- `aql`: for running AQL query to prepare tokens for index
- `pipeline`: for chaining multiple Analyzers
- `stopwords`: removes the specified tokens from the input
- `collation`: to respect the alphabetic order of a language in range queries
- `geojson`: breaks up a GeoJSON object into a set of indexable tokens
- `geopoint`: breaks up a JSON object describing a coordinate into a set of
  indexable tokens

Available normalizations are case conversion and accent removal
(conversion of characters with diacritical marks to the base characters).

Analyzer    /    Feature        | Tokenization | Stemming | Normalization | _N_-grams
:------------------------------:|:------------:|:--------:|:-------------:|:--------:
[`identity`](#identity)         |      No      |    No    |      No       |   No
[`delimiter`](#delimiter)       |    (Yes)     |    No    |      No       |   No
[`stem`](#stem)                 |      No      |   Yes    |      No       |   No
[`norm`](#norm)                 |      No      |    No    |     Yes       |   No
[`ngram`](#ngram)               |      No      |    No    |      No       |  Yes
[`text`](#text)                 |     Yes      |   Yes    |     Yes       | (Yes)
[`segmentation`](#segmentation) |     Yes      |    No    |     Yes       |   No
[`aql`](#aql)                   |    (Yes)     |  (Yes)   |    (Yes)      | (Yes)
[`pipeline`](#pipeline)         |    (Yes)     |  (Yes)   |    (Yes)      | (Yes)
[`stopwords`](#stopwords)       |      No      |    No    |      No       |   No
[`collation`](#collation)       |      No      |    No    |      No       |   No
[`geojson`](#geojson)           |      –       |    –     |      –        |   –
[`geopoint`](#geopoint)         |      –       |    –     |      –        |   –

Analyzer Features
-----------------

The *features* of an Analyzer determine what term matching capabilities will be
available and as such are only applicable in the context of ArangoSearch Views.

The valid values for the features are dependant on both the capabilities of
the underlying Analyzer *type* and the query filtering and sorting functions that the
result can be used with. For example the *text* type will produce
`frequency` + `norm` + `position` and the `PHRASE()` AQL function requires
`frequency` + `position` to be available.

Currently the following *features* are supported:

- **frequency**: track how often a term occurs.
  Required for `PHRASE()`, `BM25()`, and `TDIDF()`.
- **norm**: write the field length normalization factor that is used to score
  repeated terms fairer. Required for `BM25()` (except BM15) and `TFIDF()`
  (if called with normalization enabled).
- **position**: enumerate the tokens for position-dependent queries. Required
  for `PHRASE()` and `NGRAM_MATCH()`.
  If present, then the `frequency` feature is also required.

Also see [PHRASE()](aql/functions-arangosearch.html#phrase),
[BM25()](aql/functions-arangosearch.html#bm25),
[TFIDF()](aql/functions-arangosearch.html#tfidf),
[NGRAM_MATCH()](aql/functions-arangosearch.html#ngram_match).

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

### `collation`

<small>Introduced in: v3.9.0</small>

An Analyzer capable of converting the input into a set of language-specific
tokens. This makes comparisons follow the rules of the respective language,
most notable in range queries against Views.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `locale` (string): a locale in the format
  `language[_COUNTRY][.encoding][@variant]` (square brackets denote optional
  parts), e.g. `"de.utf-8"` or `"en_US.utf-8"`. Only UTF-8 encoding is
  meaningful in ArangoDB. The locale is forwarded to ICU without checks.
  An invalid locale does not prevent the creation of the Analyzer.
  Also see [Supported Languages](#supported-languages).

**Examples**

In Swedish, the letter `å` (note the small circle above the `a`) comes after
`z`. Other languages treat it like a regular `a`, putting it before `b`.
Below example creates two `collation` Analyzers, one with an English locale
(`en`) and one with a Swedish locale (`sv`). It then demonstrates the
difference in alphabetical order using a simple range query that returns
letters before `c`:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerCollation
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerCollation}
      var analyzers = require("@arangodb/analyzers");
      var en = analyzers.save("collation_en", "collation", { locale: "en.utf-8" }, ["frequency", "norm", "position"]);
      var sv = analyzers.save("collation_sv", "collation", { locale: "sv.utf-8" }, ["frequency", "norm", "position"]);
      var test = db._create("test");
    | db.test.save([
    |   { text: "a" },
    |   { text: "å" },
    |   { text: "b" },
    |   { text: "z" },
      ]);
    | var view = db._createView("view", "arangosearch",
        { links: { test: { analyzers: [ "collation_en", "collation_sv" ], includeAllFields: true }}});
    ~ db._query("FOR doc IN view OPTIONS { waitForSync: true } LIMIT 1 RETURN true");
      db._query("FOR doc IN view SEARCH ANALYZER(doc.text < TOKENS('c', 'collation_en')[0], 'collation_en') RETURN doc.text");
      db._query("FOR doc IN view SEARCH ANALYZER(doc.text < TOKENS('c', 'collation_sv')[0], 'collation_sv') RETURN doc.text");
    ~ db._dropView(view.name());
    ~ db._drop(test.name());
    ~ analyzers.remove(en.name);
    ~ analyzers.remove(sv.name);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerCollation
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `aql`

<small>Introduced in: v3.8.0</small>

An Analyzer capable of running a restricted AQL query to perform
data manipulation / filtering.

The query must not access the storage engine. This means no `FOR` loops over
collections or Views, no use of the `DOCUMENT()` function, no graph traversals.
AQL functions are allowed as long as they do not involve Analyzers (`TOKENS()`,
`PHRASE()`, `NGRAM_MATCH()`, `ANALYZER()` etc.) or data access, and if they can
be run on DB-Servers in case of a cluster deployment. User-defined functions
are not permitted.

The input data is provided to the query via a bind parameter `@param`.
It is always a string. The AQL query is invoked for each token in case of
multiple input tokens, such as an array of strings.

The output can be one or multiple tokens (top-level result elements). They get
converted to the configured `returnType`, either booleans, numbers or strings
(default).

{% hint 'tip' %}
If `returnType` is `"number"` or `"bool"` then it is unnecessary to set this
AQL Analyzer as context Analyzer with `ANALYZER()` in View queries. You can
compare indexed fields to numeric values, `true` or `false` directly, because
they bypass Analyzer processing.
{% endhint %}

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `queryString` (string): AQL query to be executed
- `collapsePositions` (boolean):
  - `true`: set the position to 0 for all members of the query result array
  - `false` (default): set the position corresponding to the index of the
    result array member
- `keepNull` (boolean):
  - `true` (default): treat `null` like an empty string
  - `false`: discard `null`s from View index. Can be used for index filtering
    (i.e. make your query return null for unwanted data). Note that empty
    results are always discarded.
- `batchSize` (integer): number between 1 and 1000 (default = 1) that
  determines the batch size for reading data from the query. In general, a
  single token is expected to be returned. However, if the query is expected
  to return many results, then increasing `batchSize` trades memory for
  performance.
- `memoryLimit` (integer): memory limit for query execution in bytes.
  (default is 1048576 = 1Mb) Maximum is 33554432U (32Mb)
- `returnType` (string): data type of the returned tokens. If the indicated
  type does not match the actual type then an implicit type conversion is
  applied (see [TO_STRING()](aql/functions-type-cast.html#to_string),
  [TO_NUMBER()](aql/functions-type-cast.html#to_number),
  [TO_BOOL()](aql/functions-type-cast.html#to_bool))
  - `"string"` (default): convert emitted tokens to strings
  - `"number"`: convert emitted tokens to numbers
  - `"bool"`: convert emitted tokens to booleans

**Examples**

Soundex Analyzer for a phonetically similar term search:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerAqlSoundex
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerAqlSoundex}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("soundex", "aql", { queryString: "RETURN SOUNDEX(@param)" },
        ["frequency", "norm", "position"]);
      db._query("RETURN TOKENS('ArangoDB', 'soundex')").toArray();
    ~ analyzers.remove(a.name);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerAqlSoundex
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Concatenating Analyzer for conditionally adding a custom prefix or suffix:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerAqlConcat
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerAqlConcat}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("concat", "aql", { queryString:
    |   "RETURN LOWER(LEFT(@param, 5)) == 'inter' ? CONCAT(@param, 'ism') : CONCAT('inter', @param)"
      }, ["frequency", "norm", "position"]);
      db._query("RETURN TOKENS('state', 'concat')");
      db._query("RETURN TOKENS('international', 'concat')");
    ~ analyzers.remove(a.name);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerAqlConcat
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Filtering Analyzer that ignores unwanted data based on the prefix `"ir"`,
with `keepNull: false` and explicitly returning `null`:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerAqlFilterNull
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerAqlFilterNull}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("filter", "aql", { keepNull: false, queryString:
    |   "RETURN LOWER(LEFT(@param, 2)) == 'ir' ? null : @param"
      }, ["frequency", "norm", "position"]);
      db._query("RETURN TOKENS('regular', 'filter')");
      db._query("RETURN TOKENS('irregular', 'filter')");
    ~ analyzers.remove(a.name);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerAqlFilterNull
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Filtering Analyzer that discards unwanted data based on the prefix `"ir"`,
using a filter for an empty result, which is discarded from the View index even
without `keepNull: false`:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerAqlFilter
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerAqlFilter}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("filter", "aql", { queryString:
    |   "FILTER LOWER(LEFT(@param, 2)) != 'ir' RETURN @param"
      }, ["frequency", "norm", "position"]);
      var coll = db._create("coll");
      var doc1 = db.coll.save({ value: "regular" });
      var doc2 = db.coll.save({ value: "irregular" });
    | var view = db._createView("view", "arangosearch",
        { links: { coll: { fields: { value: { analyzers: ["filter"] }}}}})
    ~ db._query("FOR doc IN view OPTIONS { waitForSync: true } LIMIT 1 RETURN true");
      db._query("FOR doc IN view SEARCH ANALYZER(doc.value IN ['regular', 'irregular'], 'filter') RETURN doc");
    ~ db._dropView(view.name())
    ~ analyzers.remove(a.name);
    ~ db._drop(coll.name());
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerAqlFilter
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Custom tokenization with `collapsePositions` on and off:
The input string `"A-B-C-D"` is split into an array of strings
`["A", "B", "C", "D"]`. The position metadata (as used by the `PHRASE()`
function) is set to 0 for all four strings if `collapsePosition` is enabled.
Otherwise the position is set to the respective array index, 0 for `"A"`,
1 for `"B"` and so on.

| `collapsePosition` | A | B | C | D |
|-------------------:|:-:|:-:|:-:|:-:|
|             `true` | 0 | 0 | 0 | 0 |
|            `false` | 0 | 1 | 2 | 3 |

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerAqlCollapse
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerAqlCollapse}
      var analyzers = require("@arangodb/analyzers");
    | var a1 = analyzers.save("collapsed", "aql", { collapsePositions: true, queryString:
    |   "FOR d IN SPLIT(@param, '-') RETURN d"
      }, ["frequency", "norm", "position"]);
    | var a2 = analyzers.save("uncollapsed", "aql", { collapsePositions: false, queryString:
    |   "FOR d IN SPLIT(@param, '-') RETURN d"
      }, ["frequency", "norm", "position"]);
      var coll = db._create("coll");
    | var view = db._createView("view", "arangosearch",
        { links: { coll: { analyzers: [ "collapsed", "uncollapsed" ], includeAllFields: true }}});
      var doc = db.coll.save({ text: "A-B-C-D" });
    ~ db._query("FOR d IN view OPTIONS { waitForSync: true } LIMIT 1 RETURN true");
      db._query("FOR d IN view SEARCH PHRASE(d.text, {TERM: 'B'}, 1, {TERM: 'D'}, 'uncollapsed') RETURN d");
      db._query("FOR d IN view SEARCH PHRASE(d.text, {TERM: 'B'}, -1, {TERM: 'D'}, 'uncollapsed') RETURN d");
      db._query("FOR d IN view SEARCH PHRASE(d.text, {TERM: 'B'}, 1, {TERM: 'D'}, 'collapsed') RETURN d");
      db._query("FOR d IN view SEARCH PHRASE(d.text, {TERM: 'B'}, -1, {TERM: 'D'}, 'collapsed') RETURN d");
    ~ db._dropView(view.name());
    ~ analyzers.remove(a1.name);
    ~ analyzers.remove(a2.name);
    ~ db._drop(coll.name());
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerAqlCollapse
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

The position data is not directly exposed, but we can see its effects through
the `PHRASE()` function. There is one token between `"B"` and `"D"` to skip in
case of uncollapsed positions. With positions collapsed, both are in the same
position, thus there is negative one to skip to match the tokens.

### `pipeline`

<small>Introduced in: v3.8.0</small>

An Analyzer capable of chaining effects of multiple Analyzers into one.
The pipeline is a list of Analyzers, where the output of an Analyzer is passed
to the next for further processing. The final token value is determined by last
Analyzer in the pipeline.

The Analyzer is designed for cases like the following:
- Normalize text for a case insensitive search and apply _n_-gram tokenization
- Split input with `delimiter` Analyzer, followed by stemming with the `stem`
  Analyzer

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `pipeline` (array): an array of Analyzer definition-like objects with
  `type` and `properties` attributes
  
{% hint 'info' %}
Analyzers of types `geopoint` and `geojson` cannot be used in pipelines and
will make the creation fail. These Analyzers require additional postprocessing
and can only be applied to document fields directly.
{% endhint %}

**Examples**

Normalize to all uppercase and compute bigrams:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerPipelineUpperNgram
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerPipelineUpperNgram}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("ngram_upper", "pipeline", { pipeline: [
    |   { type: "norm", properties: { locale: "en.utf-8", case: "upper" } },
    |   { type: "ngram", properties: { min: 2, max: 2, preserveOriginal: false, streamType: "utf8" } }
      ] }, ["frequency", "norm", "position"]);
      db._query(`RETURN TOKENS("Quick brown foX", "ngram_upper")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerPipelineUpperNgram
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Split at delimiting characters `,` and `;`, then stem the tokens:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerPipelineDelimiterStem
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerPipelineDelimiterStem}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("delimiter_stem", "pipeline", { pipeline: [
    |   { type: "delimiter", properties: { delimiter: "," } },
    |   { type: "delimiter", properties: { delimiter: ";" } },
    |   { type: "stem", properties: { locale: "en.utf-8" } }
      ] }, ["frequency", "norm", "position"]);
      db._query(`RETURN TOKENS("delimited,stemmable;words", "delimiter_stem")`).toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerPipelineDelimiterStem
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `stopwords`

<small>Introduced in: v3.8.1</small>

An Analyzer capable of removing specified tokens from the input.

It uses binary comparison to determine if an input token should be discarded.
It checks for exact matches. If the input contains only a substring that
matches one of the defined stopwords, then it is not discarded. Longer inputs
such as prefixes of stopwords are also not discarded.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `stopwords` (array): array of strings that describe the tokens to
  be discarded. The interpretation of each string depends on the value of
  the `hex` parameter.
- `hex` (boolean): If false (default), then each string in `stopwords` is used
  verbatim. If true, then the strings need to be hex-encoded. This allows for
  removing tokens that contain non-printable characters. To encode UTF-8
  strings to hex strings you can use e.g.
  - AQL:
    ```js
    FOR token IN ["and","the"] RETURN TO_HEX(token)
    ```
  - arangosh / Node.js:
    ```js
    ["and","the"].map(token => Buffer(token).toString("hex"))
    ```
  - Modern browser:
    ```js
    ["and","the"].map(token => Array.from(new TextEncoder().encode(token), byte => byte.toString(16).padStart(2, "0")).join(""))
    ```

**Examples**

Create and use a stopword Analyzer that removes the tokens `and` and `the`.
The stopword array with hex-encoded strings for this looks like
`["616e64","746865"]` (`a` = 0x61, `n` = 0x6e, `d` = 0x64 and so on).
Note that `a` and `theater` are not removed, because there is no exact match
with either of the stopwords `and` and `the`:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerStopwords
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerStopwords}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("stop", "stopwords", {
    |   stopwords: ["616e64","746865"], hex: true
      }, ["frequency", "norm", "position"]);
      db._query("RETURN FLATTEN(TOKENS(SPLIT('the fox and the dog and a theater', ' '), 'stop'))");
    ~ analyzers.remove(a.name);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerStopwords
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create and use an Analyzer pipeline that normalizes the input (convert to
lower-case and base characters) and then discards the stopwords `and` and `the`:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerPipelineStopwords
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerPipelineStopwords}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("norm_stop", "pipeline", { "pipeline": [
    |   { type: "norm", properties: { locale: "en.utf-8", accent: false, case: "lower" } },
    |   { type: "stopwords", properties: { stopwords: ["and","the"], hex: false } },
      ]}, ["frequency", "norm", "position"]);
      db._query("RETURN FLATTEN(TOKENS(SPLIT('The fox AND the dog äñḏ a ţhéäter', ' '), 'norm_stop'))");
    ~ analyzers.remove(a.name);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerPipelineStopwords
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `segmentation`

<small>Introduced in: v3.9.0</small>

An Analyzer capable of breaking up the input text into tokens in a
language-agnostic manner as per
[Unicode Standard Annex #29](https://unicode.org/reports/tr29){:target="_blank"},
making it suitable for mixed language strings. It can optionally preserve all
non-whitespace or all characters instead of keeping alphanumeric characters only,
as well as apply case conversion.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `break` (string, _optional_):
  - `"all"`: return all tokens
  - `"alpha"`: return tokens composed of alphanumeric characters only (default).
    Alphanumeric characters are Unicode codepoints from the Letter and Number
    categories, see
    [Unicode Technical Note #36](https://www.unicode.org/notes/tn36/){:target="_blank"}.
  - `"graphic"`: return tokens composed of non-whitespace characters only.
    Note that the list of whitespace characters does not include line breaks:
    - `U+0009` Character Tabulation
    - `U+0020` Space
    - `U+0085` Next Line
    - `U+00A0` No-break Space
    - `U+1680` Ogham Space Mark
    - `U+2000` En Quad
    - `U+2028` Line Separator
    - `U+202F` Narrow No-break Space
    - `U+205F` Medium Mathematical Space
    - `U+3000` Ideographic Space
- `case` (string, _optional_):
  - `"lower"` to convert to all lower-case characters (default)
  - `"upper"` to convert to all upper-case characters
  - `"none"` to not change character case

**Examples**

Create different `segmentation` Analyzers to show the behavior of the different
`break` options:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerSegmentationBreak
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerSegmentationBreak}
      var analyzers = require("@arangodb/analyzers");
      var all = analyzers.save("segment_all", "segmentation", { break: "all" }, ["frequency", "norm", "position"]);
      var alpha = analyzers.save("segment_alpha", "segmentation", { break: "alpha" }, ["frequency", "norm", "position"]);
      var graphic = analyzers.save("segment_graphic", "segmentation", { break: "graphic" }, ["frequency", "norm", "position"]);
    | db._query(`LET str = 'Test\twith An_EMAIL-address+123@example.org\n蝴蝶。\u2028бутерброд'
    |   RETURN {
    |     "all": TOKENS(str, 'segment_all'),
    |     "alpha": TOKENS(str, 'segment_alpha'),
    |     "graphic": TOKENS(str, 'segment_graphic'),
    |   }
      `);
    ~ analyzers.remove(all.name);
    ~ analyzers.remove(alpha.name);
    ~ analyzers.remove(graphic.name);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerSegmentationBreak
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `geojson`

<small>Introduced in: v3.8.0</small>

An Analyzer capable of breaking up a GeoJSON object into a set of
indexable tokens for further usage with
[ArangoSearch Geo functions](aql/functions-arangosearch.html#geo-functions).

GeoJSON object example:

```js
{
  "type": "Point",
  "coordinates": [ -73.97, 40.78 ] // [ longitude, latitude ]
}
```

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `type` (string, _optional_):
  - `"shape"` (default): index all GeoJSON geometry types (Point, Polygon etc.)
  - `"centroid"`: compute and only index the centroid of the input geometry
  - `"point"`: only index GeoJSON objects of type Point, ignore all other
    geometry types
- `options` (object, _optional_): options for fine-tuning geo queries.
  These options should generally remain unchanged
  - `maxCells` (number, _optional_): maximum number of S2 cells (default: 20)
  - `minLevel` (number, _optional_): the least precise S2 level (default: 4)
  - `maxLevel` (number, _optional_): the most precise S2 level (default: 23)

**Examples**

Create a collection with GeoJSON Points stored in an attribute `location`, a
`geojson` Analyzer with default properties, and a View using the Analyzer.
Then query for locations that are within a 3 kilometer radius of a given point
and return the matched documents, including the calculated distance in meters.
The stored coordinates and the `GEO_POINT()` arguments are expected in
longitude, latitude order:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerGeoJSON
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerGeoJSON}
      var analyzers = require("@arangodb/analyzers");
      var a = analyzers.save("geo_json", "geojson", {}, ["frequency", "norm", "position"]);
      db._create("geo");
    | db.geo.save([
    |   { location: { type: "Point", coordinates: [6.937, 50.932] } },
    |   { location: { type: "Point", coordinates: [6.956, 50.941] } },
    |   { location: { type: "Point", coordinates: [6.962, 50.932] } },
      ]);
    | db._createView("geo_view", "arangosearch", {
    |   links: {
    |     geo: {
    |       fields: {
    |         location: {
    |           analyzers: ["geo_json"]
    |         }
    |       }
    |     }
    |   }
      });
    ~ db._query("FOR doc IN geo_view OPTIONS { waitForSync: true } LIMIT 1 RETURN true");
    | db._query(`LET point = GEO_POINT(6.93, 50.94)
    |   FOR doc IN geo_view
    |     SEARCH ANALYZER(GEO_DISTANCE(doc.location, point) < 2000, "geo_json")
          RETURN MERGE(doc, { distance: GEO_DISTANCE(doc.location, point) })`).toArray();
    ~ db._dropView("geo_view");
    ~ analyzers.remove("geo_json", true);
    ~ db._drop("geo");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerGeoJSON
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `geopoint`

<small>Introduced in: v3.8.0</small>

An Analyzer capable of breaking up JSON object describing a coordinate into a
set of indexable tokens for further usage with
[ArangoSearch Geo functions](aql/functions-arangosearch.html#geo-functions).

The Analyzer can be used for two different coordinate representations:
- an array with two numbers as elements in the format
  `[<latitude>, <longitude>]`, e.g. `[40.78, -73.97]`.
- two separate number attributes, one for latitude and one for
  longitude, e.g. `{ location: { lat: 40.78, lon: -73.97 } }`.
  The attributes cannot be at the top level of the document, but must be nested
  like in the example, so that the Analyzer can be defined for the field
  `location` with the Analyzer properties
  `{ "latitude": ["lat"], "longitude": ["lng"] }`.

The *properties* allowed for this Analyzer are an object with the following
attributes:

- `latitude` (array, _optional_): array of strings that describes the
  attribute path of the latitude value relative to the field for which the
  Analyzer is defined in the View
- `longitude` (array, _optional_): array of strings that describes the
  attribute path of the longitude value relative to the field for which the
  Analyzer is defined in the View
- `options` (object, _optional_): options for fine-tuning geo queries.
  These options should generally remain unchanged
  - `maxCells` (number, _optional_): maximum number of S2 cells (default: 20)
  - `minLevel` (number, _optional_): the least precise S2 level (default: 4)
  - `maxLevel` (number, _optional_): the most precise S2 level (default: 23)

**Examples**

Create a collection with coordinates pairs stored in an attribute `location`,
a `geopoint` Analyzer with default properties, and a View using the Analyzer.
Then query for locations that are within a 3 kilometer radius of a given point.
The stored coordinates are in latitude, longitude order, but `GEO_POINT()` and
`GEO_DISTANCE()` expect longitude, latitude order:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerGeoPointPair
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerGeoPointPair}
      var analyzers = require("@arangodb/analyzers");
      var a = analyzers.save("geo_pair", "geopoint", {}, ["frequency", "norm", "position"]);
      db._create("geo");
    | db.geo.save([
    |   { location: [50.932, 6.937] },
    |   { location: [50.941, 6.956] },
    |   { location: [50.932, 6.962] },
      ]);
    | db._createView("geo_view", "arangosearch", {
    |   links: {
    |     geo: {
    |       fields: {
    |         location: {
    |           analyzers: ["geo_pair"]
    |         }
    |       }
    |     }
    |   }
      });
    ~ db._query("FOR doc IN geo_view OPTIONS { waitForSync: true } LIMIT 1 RETURN true");
    | db._query(`LET point = GEO_POINT(6.93, 50.94)
    |   FOR doc IN geo_view
    |     SEARCH ANALYZER(GEO_DISTANCE(doc.location, point) < 2000, "geo_pair")
          RETURN MERGE(doc, { distance: GEO_DISTANCE([doc.location[1], doc.location[0]], point) })`).toArray();
    ~ db._dropView("geo_view");
    ~ analyzers.remove("geo_pair", true);
    ~ db._drop("geo");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerGeoPointPair
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create a collection with coordinates stored in an attribute `location` as
separate nested attributes `lat` and `lng`, a `geopoint` Analyzer that
specifies the attribute paths to the latitude and longitude attributes
(relative to `location` attribute), and a View using the Analyzer.
Then query for locations that are within a 3 kilometer radius of a given point:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerGeoPointLatLng
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerGeoPointLatLng}
      var analyzers = require("@arangodb/analyzers");
    | var a = analyzers.save("geo_latlng", "geopoint", {
    |   latitude: ["lat"],
    |   longitude: ["lng"]
      }, ["frequency", "norm", "position"]);
      db._create("geo");
    | db.geo.save([
    |   { location: { lat: 50.932, lng: 6.937 } },
    |   { location: { lat: 50.941, lng: 6.956 } },
    |   { location: { lat: 50.932, lng: 6.962 } },
      ]);
    | db._createView("geo_view", "arangosearch", {
    |   links: {
    |     geo: {
    |       fields: {
    |         location: {
    |           analyzers: ["geo_latlng"]
    |         }
    |       }
    |     }
    |   }
      });
    ~ db._query("FOR doc IN geo_view OPTIONS { waitForSync: true } LIMIT 1 RETURN true");
    | db._query(`LET point = GEO_POINT(6.93, 50.94)
    |   FOR doc IN geo_view
    |     SEARCH ANALYZER(GEO_DISTANCE(doc.location, point) < 2000, "geo_latlng")
          RETURN MERGE(doc, { distance: GEO_DISTANCE([doc.location.lng, doc.location.lat], point) })`).toArray();
    ~ db._dropView("geo_view");
    ~ analyzers.remove("geo_latlng", true);
    ~ db._drop("geo");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerGeoPointLatLng
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

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

### Tokenization and Normalization

Analyzers rely on [ICU](http://site.icu-project.org/){:target="_blank"} for
language-dependent tokenization and normalization. The ICU data file
`icudtl.dat` that ArangoDB ships with contains information for a lot of
languages, which are technically all supported.

Setting an unsupported or invalid locale does not raise a warning or error.
ICU will fall back to a locale without the requested variant, country, or
script, or use its default locale if neither of the former is valid.

{% hint 'warning' %}
The alphabetical order of characters is not taken into account by ArangoSearch,
i.e. range queries in SEARCH operations against Views will not follow the
language rules as per the defined Analyzer locale nor the server language
(startup option `--default-language`)!
Also see [Known Issues](release-notes-known-issues39.html#arangosearch).
{% endhint %}

### Stemming

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
