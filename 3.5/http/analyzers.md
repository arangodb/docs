---
layout: default
description: HTTP interface for Analyzers
title: Analyzers HTTP API
---
HTTP Interface for Analyzers
============================

The RESTful API is accessible via the `/_api/analyzer` endpoint and callable
via HTTP requests.

Analyzer Operations
-------------------

{% docublock post_api_analyzer %}
{% docublock get_api_analyzer %}
{% docublock get_api_analyzers %}
{% docublock delete_api_analyzer %}

Analyzer Names
--------------

Analyzers are stored per database, 

Analyzer Types
--------------

The currently implemented Analyzer types are:

- `identity`
- `delimiter`
- `stem`
- `norm`
- `ngram`
- `text`

### Identity

An analyzer applying the `identity` transformation, i.e. returning the input
unmodified.

The value of the *properties* attribute is ignored.

### Delimiter

An analyzer capable of breaking up delimited text into tokens as per RFC4180
(without starting new records on newlines).

The *properties* allowed for this analyzer are either:

- a string encoded delimiter to use
- an object with the attribute *delimiter* containing the string encoded
  delimiter to use

### Stem

An analyzer capable of stemming the text, treated as a single token,
for supported languages.

The *properties* allowed for this analyzer are an object with the following
attributes:

 - `locale` : string (required) format: (language[_COUNTRY][.encoding][@variant])

###  Norm

An analyzer capable of normalizing the text, treated as a single
token, i.e. case conversion and accent removal

The *properties* allowed for this analyzer are an object with the following
attributes:

- `locale`: string (required) format: (language[_COUNTRY][.encoding][@variant])
- `case`: string enum (optional) one of: `lower`, `none`, `upper`,
  default: `lower`
- `accent`: boolean (optional) preserve accent, default: true

### N-gram

An analyzer capable of producing n-grams from a specified input in a range of
[min;max] (inclusive). Can optionally preserve the original input.

The *properties* allowed for this analyzer are an object with the following
attributes:

- *max*: unsigned integer (required) maximum n-gram length
- *min*: unsigned integer (required) minimum n-gram length
- *preserveOriginal*: boolean (required) output the original value as well

*Example*

With `min` = 4 and `max` = 5, the analyzer will produce the following n-grams
for the input *foobar*:
- foob
- ooba
- obar
- fooba
- oobar

With `preserveOriginal` enabled, it will additionally include *foobar* itself.

### Text

An analyzer capable of breaking up strings into individual words while also
optionally filtering out stop-words, applying case conversion and extracting
word stems.

The *properties* allowed for this analyzer are an object with the following
attributes:

- `locale`: string (required) format: (language[_COUNTRY][.encoding][@variant])
- `case`: string enum (optional) one of: `lower`, `none`, `upper`,
  default: `lower`
- `stopwords`: array of strings (optional) words to omit from result,
  default: load words from `stopwordsPath`
- `stopwordsPath`: string(optional) path with the `language` sub-directory
  containing files with words to omit, default: if no
  `stopwords` provided then the value from the
  environment variable `IRESEARCH_TEXT_STOPWORD_PATH` or
  if undefined then the current working directory
- `accent`: boolean (optional) preserve accent in returned words, default: false
- `stemming`: boolean (optional) apply stemming on returned words,
  default: true
