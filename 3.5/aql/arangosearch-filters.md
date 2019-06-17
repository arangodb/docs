---
layout: default
title: Using the SEARCH keyword of ArangoSearch in AQL
---
ArangoSearch filters
--------------------

The basic ArangoSearch functionality can be accessed via the `SEARCH` statement
with common AQL filters and operators, e.g.:

- `AND`
- `OR`
- `NOT`
- `==`
- `<=`
- `>=`
- `<`
- `>`
- `!=`
- `IN <ARRAY>`
- `IN <RANGE>`

However, the full power of ArangoSearch is harnessed and exposed via functions,
during both the search and sort stages.

Note, that `SEARCH` statement, in contrast to `FILTER`, is meant to be treated
as a part of the `FOR` operation, not as an individual statement.

The supported AQL context functions are:

### ANALYZER()

`ANALYZER(searchExpression, analyzer)`

Override analyzer in a context of **searchExpression** with another one,
denoted by a specified **analyzer** argument, making it available for search
functions.

- *searchExpression* - any valid search expression
- *analyzer* - string with the analyzer to imbue, i.e. *"text_en"* or one of the
  other [available string analyzers](../views-arango-search-analyzers.html)

By default, context contains `Identity` analyzer.

### BOOST()

`BOOST(searchExpression, boost)`

Override boost in a context of **searchExpression** with a specified value,
making it available for scorer functions.

- *searchExpression* - any valid search expression
- *boost* - numeric boost value

By default, context contains boost value equal to `1.0`.

The supported search functions are:

### EXISTS()

Note: Will only match values when the specified attribute has been processed
with the link property **storeValues** set to **"id"** (by default it's
**"none"**).

`EXISTS(doc.someAttr)`

Match documents **doc** where the attribute **someAttr** exists in the
document.

This also works with sub-attributes, e.g.

`EXISTS(doc.someAttr.anotherAttr)`

as long as the field is processed by the view with **storeValues** not
**none**.

`EXISTS(doc.someAttr, "analyzer", analyzer)`

Match documents where **doc.someAttr** exists in the document _and_ was indexed
by the specified **analyzer**. **analyzer** is optional and defaults to the
current context analyzer (e.g. specified by `ANALYZER` function).

`EXISTS(doc.someAttr, type)`

Match documents where the **doc.someAttr** exists in the document
 and is of the specified type.

- *doc.someAttr* - the path of the attribute to exist in the document
- *analyzer* - string with the analyzer used, i.e. *"text_en"* or one of the
  other [available string analyzers](../views-arango-search-analyzers.html)
- *type* - data type as string; one of:
    - **bool**
    - **boolean**
    - **numeric**
    - **null**
    - **string**

In case if **analyzer** isn't specified, current context analyzer (e.g.
specified by `ANALYZER` function) will be used.

### PHRASE()

```
PHRASE(doc.someAttr, 
       phrasePart [, skipTokens] [, phrasePart | , phrasePart, skipTokens]*
       [, analyzer])
```

Search for a phrase in the referenced attributes. 

The phrase can be expressed as an arbitrary number of *phraseParts* separated by
*skipToken* number of tokens.

- *doc.someAttr* - the path of the attribute to compare against in the document
- *phrasePart* - a string to search in the token stream; may consist of several
  words; will be split using the specified *analyzer*
- *skipTokens* number of words or tokens to treat as wildcards
- *analyzer* - string with the analyzer used, i.e. *"text_en"* or one of the
  other [available string analyzers
  ](../views-arango-search-analyzers.html)

For example, given a document `doc` containing the text `"Lorem ipsum dolor sit
amet, consectetur adipiscing elit"`, the following expression will be `true`:

```js
PHRASE(doc.text, "ipsum", 1, "sit", 2, "adipiscing", "text_de")
```

Specifying deep attributes like `doc.some.deep.attr` is also allowed. The
attribute has to be processed by the view as specified in the link.

### STARTS_WITH()

`STARTS_WITH(doc.someAttr, prefix)`

Match the value of the **doc.someAttr** that starts with **prefix**

- *doc.someAttr* - the path of the attribute to compare against in the document
- *prefix* - a string to search at the start of the text

Specifying deep attributes like `doc.some.deep.attr` is also allowed. The
attribute has to be processed by the view as specified in the link.

### TOKENS()

`TOKENS(input, analyzer)`

Split the **input** string with the help of the specified **analyzer** into an
Array. The resulting Array can i.e. be used in subsequent `FILTER` or `SEARCH`
statements with the **IN** operator. This can be used to better understand how
the specific analyzer is going to behave.
- *input* string to tokenize
- *analyzer* one of the [available string_analyzers](../views-arango-search-analyzers.html)

### MIN_MATCH()

`MIN_MATCH(searchExpression [, searchExpression]*, minMatchCount)`

Match documents where at least **minMatchCount** of the specified
**searchExpression**s are satisfied.

- *searchExpression* - any valid search expression
- *minMatchCount* - minimum number of *searchExpression*s that should be
  satisfied

For example,

```js
MIN_MATCH(doc.text == 'quick', doc.text == 'brown', doc.text == 'fox', 2)
```

if `doc.text`, as analyzed by the current analyzer, contains 2 out of 'quick',
'brown' and 'fox', it will be included as matched one.

### Searching examples

to match documents which have a 'name' attribute

    FOR doc IN someView SEARCH EXISTS(doc.name)
      RETURN doc

or

    FOR doc IN someView SEARCH EXISTS(doc['name'])
      RETURN doc

to match documents where 'body' was analyzed via the 'text_en' analyzer

    FOR doc IN someView SEARCH EXISTS(doc.body, 'analyzer', 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH EXISTS(doc['body'], 'analyzer', 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH ANALYZER(EXISTS(doc['body'], 'analyzer'), 'text_en')
      RETURN doc

to match documents which have an 'age' attribute of type number

    FOR doc IN someView SEARCH EXISTS(doc.age, 'numeric')
      RETURN doc

or

    FOR doc IN someView SEARCH EXISTS(doc['age'], 'numeric')
      RETURN doc

to match documents where 'description' contains word 'quick' or word
'brown' and has been analyzed with 'text_en' analyzer

    FOR doc IN someView SEARCH ANALYZER(doc.description == 'quick' OR doc.description == 'brown', 'text_en')
      RETURN doc

to match documents where 'description' contains at least 2 of 3 words 'quick', 
'brown', 'fox' and has been analyzed with 'text_en' analyzer

    FOR doc IN someView SEARCH ANALYZER(
        MIN_MATCH(doc.description == 'quick', doc.description == 'brown', doc.description == 'fox', 2),
        'text_en'
      )
      RETURN doc

to match documents where 'description' contains a phrase 'quick brown'

    FOR doc IN someView SEARCH PHRASE(doc.description, [ 'quick brown' ], 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH PHRASE(doc['description'], [ 'quick brown' ], 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH ANALYZER(PHRASE(doc['description'], [ 'quick brown' ]), 'text_en')
      RETURN doc

to match documents where 'body' contains the phrase consisting of a sequence
like this:
'quick' * 'fox jumps' (where the asterisk can be any single word)

    FOR doc IN someView SEARCH PHRASE(doc.body, [ 'quick', 1, 'fox jumps' ], 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH PHRASE(doc['body'], [ 'quick', 1, 'fox jumps' ], 'text_en')
      RETURN doc

or

    FOR doc IN someView SEARCH ANALYZER(PHRASE(doc['body'], [ 'quick', 1, 'fox jumps' ]), 'text_en')
      RETURN doc

to match documents where 'story' starts with 'In the beginning'

    FOR doc IN someView SEARCH STARTS_WITH(doc.story, 'In the beginning')
      RETURN DOC

or

    FOR doc IN someView SEARCH STARTS_WITH(doc['story'], 'In the beginning')
      RETURN DOC

to watch the analyzer doing its work

    RETURN TOKENS('a quick brown fox', 'text_en')

to match documents where 'description' best matches 'a quick brown fox'

    FOR doc IN someView SEARCH ANALYZER(doc.description IN TOKENS('a quick brown fox', 'text_en'), 'text_en')
      RETURN doc
