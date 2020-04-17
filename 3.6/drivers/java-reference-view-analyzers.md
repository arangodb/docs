---
layout: default
description: HTTP Interface for Analyzers
---
# Analyzers

[ArangoSearch Analyzers](../arangosearch-analyzers.html)

[HTTP Interface for Analyzers](../http/analyzers.html)


## Types

- **IdentityAnalyzer**

  - **name**: `String`

    The Analyzer name.

  - **type**: `AnalyzerType`

    The Analyzer type, in this case `identity`.

  - **features**: `Set<AnalyzerFeature>`

    The set of features to set on the Analyzer generated fields. The default
    value is an empty array. Values can be: `frequency`, `norm`, `position`


- **DelimiterAnalyzer**

  - **name**: `String`

    The Analyzer name.

  - **type**: `AnalyzerType`

    The Analyzer type, in this case `delimiter`.

  - **features**: `Set<AnalyzerFeature>`

    The set of features to set on the Analyzer generated fields. The default
    value is an empty array. Values can be: `frequency`, `norm`, `position`

  - **properties**: `DelimiterAnalyzerProperties`
  
    The properties used to configure the analyzer. 
      - *delimiter*: `String`: the delimiting character(s)


- **StemAnalyzer**

  - **name**: `String`

    The Analyzer name.

  - **type**: `AnalyzerType`

    The Analyzer type, in this case `stem`.

  - **features**: `Set<AnalyzerFeature>`

    The set of features to set on the Analyzer generated fields. The default
    value is an empty array. Values can be: `frequency`, `norm`, `position`

  - **properties**: `StemAnalyzerProperties`
  
    The properties used to configure the analyzer. 
      - *locale*: `String`: a locale in the format `language[_COUNTRY][.encoding][@variant]`
        (square brackets denote optional parts), e.g. `de.utf-8` or `en_US.utf-8`.
        Only UTF-8 encoding is meaningful in ArangoDB. Also see
        [Supported Languages](../arangosearch-analyzers.html#supported-languages).


- **NormAnalyzer**

  - **name**: `String`

    The Analyzer name.

  - **type**: `AnalyzerType`

    The Analyzer type, in this case `norm`.

  - **features**: `Set<AnalyzerFeature>`

    The set of features to set on the Analyzer generated fields. The default
    value is an empty array. Values can be: `frequency`, `norm`, `position`

  - **properties**: `NormAnalyzerProperties`
  
    The properties used to configure the analyzer. 
      - *locale*: `String`: a locale in the format `language[_COUNTRY][.encoding][@variant]`
        (square brackets denote optional parts), e.g. `de.utf-8` or `en_US.utf-8`.
        Only UTF-8 encoding is meaningful in ArangoDB. Also see
        [Supported Languages](../arangosearch-analyzers.html#supported-languages).
      - *accent*: `boolean`:
        - `true` to preserve accented characters (default)
        - `false` to convert accented characters to their base characters
      - *case*: `SearchAnalyzerCase`:
        -`lower` to convert to all lower-case characters
        -`upper` to convert to all upper-case characters
        -`none` to not change character case (default)


- **NGramAnalyzer**

  - **name**: `String`

    The Analyzer name.

  - **type**: `AnalyzerType`

    The Analyzer type, in this case `ngram`.

  - **features**: `Set<AnalyzerFeature>`

    The set of features to set on the Analyzer generated fields. The default
    value is an empty array. Values can be: `frequency`, `norm`, `position`

  - **properties**: `NGramAnalyzerProperties`
  
    The properties used to configure the analyzer. 
      - *min*: `long`: minimum n-gram length
      - *max*: `long`: maximum n-gram length
      - *preserveOriginal*: `boolean`:
        - `true` to include the original value as well
        - `false` to produce the n-grams based on min and max only
      - *startMarker*: `String`: this value will be prepended to n-grams which
        include the beginning of the input. Can be used for matching prefixes.
        Choose a character or sequence as marker which does not occur in the input.
      - *endMarker*: `String`: this value will be appended to n-grams which
        include the end of the input. Can be used for matching suffixes.
        Choose a character or sequence as marker which does not occur in the input.
      - *streamType*: `StreamType`:
        - `binary`: one byte is considered as one character (default)
        - `utf8`: one Unicode codepoint is treated as one character

      
- **TextAnalyzer**

  - **name**: `String`

    The Analyzer name.

  - **type**: `AnalyzerType`

    The Analyzer type, in this case `text`.

  - **features**: `Set<AnalyzerFeature>`

    The set of features to set on the Analyzer generated fields. The default
    value is an empty array. Values can be: `frequency`, `norm`, `position`

  - **properties**: `TextAnalyzerProperties`
  
    The properties used to configure the analyzer. 
      - *locale*: `String`: a locale in the format `language[_COUNTRY][.encoding][@variant]`
        (square brackets denote optional parts), e.g. `de.utf-8` or `en_US.utf-8`.
        Only UTF-8 encoding is meaningful in ArangoDB. Also see
        [Supported Languages](../arangosearch-analyzers.html#supported-languages).
      - *accent*: `boolean`:
        - `true` to preserve accented characters (default)
        - `false` to convert accented characters to their base characters
      - *case*: `SearchAnalyzerCase`:
        -`lower` to convert to all lower-case characters
        -`upper` to convert to all upper-case characters
        -`none` to not change character case (default)
      - *stemming*: `stemming`:
        - `true` to apply stemming on returned words (default)
        - `false` to leave the tokenized words as-is
      - *edgeNgram*: `EdgeNgram`: if present, then edge n-grams are generated
        for each token (word). That is, the start of the n-gram is anchored to
        the beginning of the token, whereas the ngram Analyzer would produce
        all possible substrings from a single input token (within the defined
        length restrictions). Edge n-grams can be used to cover word-based
        auto-completion queries with an index, for which you should set the
        following other options: `accent: false`, `case: "lower"` and most
        importantly `stemming: false`.
        - `min` minimal n-gram length
        - `max` maximal n-gram length
        - `preserveOriginal` whether to include the original token even if its
          length is less than min or greater than max
      - *stopwords*: `List<String>`: an array of strings with words to omit
        from result. Default: load words from stopwordsPath. To disable
        stop-word filtering provide an empty array []. If both stopwords and
        stopwordsPath are provided then both word sources are combined.
      - *stopwordsPath*: `String`: path with a language sub-directory
        (e.g. en for a locale en_US.utf-8) containing files with words to omit.
        Each word has to be on a separate line. Everything after the first
        whitespace character on a line will be ignored and can be used for
        comments. The files can be named arbitrarily and have any file
        extension (or none).


## ArangoDatabase.createSearchAnalyzer

`ArangoDatabase.createSearchAnalyzer(SearchAnalyzer options) : SearchAnalyzer`

Creates an Analyzer.


## ArangoDatabase.getSearchAnalyzer

`ArangoDatabase.getSearchAnalyzer(String name) : SearchAnalyzer`

Gets information about an Analyzer

**Arguments**

- **name**: `String`

  The name of the Analyzer


## ArangoDatabase.getSearchAnalyzer

`ArangoDatabase.getSearchAnalyzer() : Collection<SearchAnalyzer>`

Retrieves all Analyzers definitions.


## ArangoDatabase.deleteSearchAnalyzer

`ArangoDatabase.deleteSearchAnalyzer(String name) : void`

Deletes an Analyzer.

**Arguments**

- **name**: `String`

  The name of the Analyzer


## ArangoDatabase.deleteSearchAnalyzer

`ArangoDatabase.deleteSearchAnalyzer(String name, AnalyzerDeleteOptions options) : void`

Deletes an Analyzer.

**Arguments**

- **name**: `String`

  The name of the Analyzer

- **options**: `AnalyzerDeleteOptions`

  - **force**: `Boolean`

    The Analyzer configuration should be removed even if it is in-use.
    The default value is false.
