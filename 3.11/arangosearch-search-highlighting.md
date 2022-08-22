---
layout: default
description: >-
  You can retrieve the positions of matches within strings when querying
  ArangoSearch Views, to highlight what was found in search results
title: Search Highlighting ArangoSearch Examples
---
# Search highlighting with ArangoSearch

{{ page.description }}
{:class="lead"}

{% include hint-ee.md feature="Search highlighting" %}

ArangoSearch lets you search for tokens and phrases in full-text, and also
perform fuzzy searches, among other things. It only returns matching documents,
however. With search highlighting, you can get the exact locations of the
matches for tokens, phrases, and _n_-grams.

A common use case is to emphasize the matching parts in client applications,
for example, with a background color or an underline, so that users can easily
see and understand the matches.

## How to use search highlighting

To use search highlighting, you need to index the respective attributes with
Analyzers that have the `offset` feature enabled. The built-in `text` Analyzers
don't have this feature enabled, you need to create custom Analyzers.

You can get the substring offsets of matches by calling the
[`OFFSET_INFO()` function](aql/functions-arangosearch.html#offset_info) in
search queries. It takes the document emitted by the View (`FOR doc IN viewName`)
and a list of paths like `"field.nested"` or `"array[0].field"`, defining for
what attributes or array elements you want to retrieve the offsets for. For
every path, it returns a list comprised of a `name` and `offsets`.

The name is the path of the value, but in a different form than you passed to
the function, like `["field", "nested"]` or `["array", 0, "field"]`. You can
look up the value with the [`VALUE()` function](aql/functions-document.html#value)
using this path description.

The offsets are a list of offset pairs, one for every match. Each pair is an
array with two numbers, with the start and end offset of the match. There can be
multiple matches per path. You can optionally cap how many matches are collected
per path by setting limits when calling the `OFFSET_INFO()` function.

### Token search with highlighting

**Dataset:**

A collection called `food` with the following documents:

```json
{ "name": "avocado", "description": { "en": "The avocado is a medium-sized, evergreen tree, native to the Americas." } }
{ "name": "carrot", "description": { "en": "The carrot is a root vegetable, typically orange in color, native to Europe and Southwestern Asia." } }
{ "name": "chili pepper", "description": { "en": "Chili peppers are varieties of the berry-fruit of plants from the genus Capsicum, cultivated for their pungency." } }
{ "name": "tomato", "description": { "en": "The tomato is the edible berry of the tomato plant." } }
```

**Custom Analyzer:**

Create a `text` Analyzer in arangosh to tokenize text, like the built-in
`text_en` Analyzer, but additionally set the `offset` feature that enables
search highlighting:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerTextOffset
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerTextOffset}
      var analyzers = require("@arangodb/analyzers");
      var analyzer = analyzers.save("text_en_offset", "text", { locale: "en.utf-8", stopwords: [] }, ["position", "frequency", "norm", "offset"]);
    ~ analyzers.remove(analyzer.name);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerTextOffset
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

**View definition:**

```json
{
  "links": {
    "food": {
      "fields": {
        "description": {
          "fields": {
            "en": {
              "analyzers": [
                "text_en_offset"
              ]
            }
          }
        }
      }
    }
  }
}
```

**AQL queries:**

Search the View for descriptions that contain `avocado` or `tomato`, get the
matching positions, and use this information to extract the substrings. The
[`OFFSET_INFO()` function](aql/functions-arangosearch.html#offset_info) returns
a `name` that describes the path of the attribute or array element with the
match. You can use the [`VALUE()` function](aql/functions-document.html#value)
to dynamically get the respective value:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline searchHighlighting_1
    @EXAMPLE_ARANGOSH_OUTPUT{searchHighlighting_1}
      db._create("food");
      db.food.save({ name: "avocado", description: { en: "The avocado is a medium-sized, evergreen tree, native to the Americas." } });
      db.food.save({ name: "carrot", description: { en: "The carrot is a root vegetable, typically orange in color, native to Europe and Southwestern Asia." } });
      db.food.save({ name: "chili pepper", description: { en: "Chili peppers are varieties of the berry-fruit of plants from the genus Capsicum, cultivated for their pungency." } });
      db.food.save({ name: "tomato", description: { en: "The tomato is the edible berry of the tomato plant." } });
      var analyzers = require("@arangodb/analyzers");
      var analyzer = analyzers.save("text_en_offset", "text", { locale: "en.utf-8", stopwords: [] }, ["frequency", "norm", "position", "offset"]);
      db._createView("food_view", "arangosearch", { links: { food: { fields: { description: { fields: { en: { analyzers: ["text_en_offset"] } } } } } } });
      db._query(`FOR doc IN food_view SEARCH true OPTIONS { waitForSync: true } LIMIT 1 RETURN doc`); /* wait for View to update */
    | db._query(`FOR doc IN food_view
    |   SEARCH ANALYZER(TOKENS("avocado tomato", "text_en_offset") ANY == doc.description.en, "text_en_offset")
    |   FOR offsetInfo IN OFFSET_INFO(doc, ["description.en"])
    |     RETURN {
    |       description: doc.description,
    |       name: offsetInfo.name,
    |       matches: offsetInfo.offsets[* RETURN {
    |         offset: CURRENT,
    |         match: SUBSTRING(VALUE(doc, offsetInfo.name), CURRENT[0], CURRENT[1] - CURRENT[0])
    |       }]
          }`);
    ~ db._dropView("food_view");
    ~ db._drop("food");
    ~ analyzers.remove(analyzer.name);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock searchHighlighting_1
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}
