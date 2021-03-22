---
layout: default
description: ArangoSearch is a C++ based full-text search engine including similarity ranking capabilities natively integrated into ArangoDB.
title: ArangoSearch - Integrated Full-text Search Engine
redirect_from:
  - views-arango-search.html # 3.4 -> 3.5
---
# Fulltext Indexing with ArangoSearch

You can index nested fields from multiple collections, use full-text processing
and rank query results with ArangoDB's built-in ArangoSearch feature
{:class="lead"}

ArangoSearch provides information retrieval features, natively integrated
into ArangoDB's query language and with support for all data models. It is
primarily a full-text search engine, a much more powerful alternative to the
[full-text index](indexing-fulltext.html) type.

## Example Use Cases

- Perform federated full-text searches over product descriptions for a
  web shop, with the product documents stored in various collections.
- Find information in a research database using stemmed phrases, case and
  accent insensitive, with irrelevant terms removed from the search index
  (stop word filtering), ranked by relevance based on term frequency (TFIDF).
- Query a movie dataset for titles with words in a particular order
  (optionally with wildcards), and sort the results by best matching (BM25)
  but favor movies with a longer duration.

## Getting Started with ArangoSearch

ArangoSearch introduces the concept of **Views** which can be seen as
virtual collections. Each View represents an inverted index to provide fast
full-text searching over one or multiple linked collections and holds the
configuration for the search capabilities, such as the attributes to index.
It can cover multiple or even all attributes of the documents in the linked
collections.

{% hint 'info' %}
ArangoSearch Views are not updated synchronously as the source collections
change in order to minimize the performance impact. They are
**eventually consistent**, with a configurable consolidation policy.
{% endhint %}

The input values can be processed by so called **Analyzers** which can
normalize strings, tokenize text into words and more, enabling different
possibilities to search for values later on.

Search results can be sorted by their similarity ranking to return the best
matches first using popular scoring algorithms.

![Conceptual model of ArangoSearch interacting with Collections and Analyzers](images/arangosearch-variant.png)

### Create an ArangoSearch View

Views can be managed in the Web UI, via an [HTTP API](http/views.html) and
through a [JavaScript API](data-modeling-views-database-methods.html).

1. Create a test collection (e.g. `testcoll`) and insert a few documents like
   `{"food": "avocado"}` and `{"food": "apple"}`, so that you have something to
   index and search for.
2. In the Web UI, click on _VIEWS_ in the main navigation.
3. Click on the _Add View_ button, enter a name (e.g. `myview`) and confirm.
4. You can toggle the mode of the View definition editor from _Tree_ to _Code_
   to edit the JSON object as text.
5. Replace `"links": {}` with below configuration, then save the changes:
   ```json
   "links": {
     "testcoll": {
       "includeAllFields": true
     }
   }
   ```

### Define what to index with ArangoSearch Views



### Write search expressions with ArangoSearch functions

The ArangoSearch features are integrated into AQL as
[`SEARCH` operation](aql/operations-search.html) and a set of
[AQL functions](aql/functions-arangosearch.html).

ArangoSearch AQL functions take either an expression or an
attribute path expression as first argument.

```js
ANALYZER(<expression>, …)
STARTS_WITH(doc.attribute, …)
```

If an expression is expected, it means that search conditions can expressed in
AQL syntax. They are typically function calls to ArangoSearch search functions,
possibly nested and/or using logical operators for multiple conditions.

```js
STARTS_WITH(doc.text, "avoca") OR STARTS_WITH(doc.text, "arang")
```

The default Analyzer that will be used for searching is `"identity"`.
While some ArangoSearch functions accept an Analyzer argument, it is often
necessary to wrap search (sub-)expressions with an `ANALYZER()` call to set the
correct Analyzer in the query so that it matches one of the Analyzers with
which the field was indexed.

It can be easier and cleaner to use `ANALYZER()` even if you exclusively
use functions that take an Analyzer argument and leave that argument out:

```js
// Analyzer specified in each function call
PHRASE(doc.text, "avocado dish", "text_en") AND PHRASE(doc.text, "lemon", "text_en")

// Analyzer specified using ANALYZER()
ANALYZER(PHRASE(doc.text, "avocado dish") AND PHRASE(doc.text, "lemon"), "text_en")
```

Certain expressions do not require any ArangoSearch functions, such as basic
comparisons. However, the Analyzer used for searching will be `"identity"`
unless `ANALYZER()` is used to set a different one.

```js
// The "identity" Analyzer will be used by default
SEARCH doc.text == "avocado"

// Use the "text_en" Analyzer for searching instead
SEARCH ANALYZER(doc.text == "avocado", "text_en")
```

If an attribute path expressions is needed, then you have to reference a
document object emitted by a View like `FOR doc IN viewName` and then specify
which attribute you want to test for as an unquoted string literal. For example
`doc.attr` or `doc.deeply.nested.attr` but not `"doc.attr"`. You can also use
the bracket notation `doc["attr"]`.

```js
FOR doc IN viewName
  SEARCH STARTS_WITH(doc.deeply.nested["attr"], "avoca")
  RETURN doc
```

### 