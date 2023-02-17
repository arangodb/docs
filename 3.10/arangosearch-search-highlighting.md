---
layout: default
description: >-
  You can retrieve the positions of matches within strings when querying
  Views with ArangoSearch, to highlight what was found in search results
title: Search Highlighting ArangoSearch Examples
---
# Search highlighting with ArangoSearch

{{ page.description }}
{:class="lead"}

{% include hint-ee-arangograph.md feature="Search highlighting" %}

ArangoSearch lets you search for terms and phrases in full-text, and more.
It only returns matching documents, however. With search highlighting, you can
get the exact locations of the matches.

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

The `name` is the path of the value, but in a different form than you passed to
the function, like `["field", "nested"]` or `["array", 0, "field"]`. You can
look up the value with the [`VALUE()` function](aql/functions-document.html#value)
using this path description.

The `offsets` are a list of offset pairs, one for every match. Each pair is an
array with two numbers, with the start offset and length of the match. There can be
multiple matches per path. You can optionally cap how many matches are collected
per path by setting limits when calling the `OFFSET_INFO()` function.

{% hint 'warning' %}
The start offsets and lengths describe the positions in bytes, not characters.
You may need to account for characters encoded using multiple bytes.
{% endhint %}

### Term and phrase search with highlighting

#### Dataset

A collection called `food` with the following documents:

```json
{ "name": "avocado", "description": { "en": "The avocado is a medium-sized, evergreen tree, native to the Americas." } }
{ "name": "carrot", "description": { "en": "The carrot is a root vegetable, typically orange in color, native to Europe and Southwestern Asia." } }
{ "name": "chili pepper", "description": { "en": "Chili peppers are varieties of the berry-fruit of plants from the genus Capsicum, cultivated for their pungency." } }
{ "name": "tomato", "description": { "en": "The tomato is the edible berry of the tomato plant." } }
```

#### Custom Analyzer

If you want to use an `arangosearch` View,
create a `text` Analyzer in arangosh to tokenize text, like the built-in
`text_en` Analyzer, but additionally set the `offset` feature, enabling
search highlighting:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzerTextOffset
    @EXAMPLE_ARANGOSH_OUTPUT{analyzerTextOffset}
      var analyzers = require("@arangodb/analyzers");
      analyzers.save("text_en_offset", "text", { locale: "en", stopwords: [] }, ["position", "frequency", "norm", "offset"]);
    ~ analyzers.remove("text_en_offset");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzerTextOffset
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

You can skip this step if you want to use a `search-alias` View, because the
Analyzer features can be overwritten in the inverted index definition.

#### View definition

##### `search-alias` View

```js
db.food.ensureIndex({
  name: "inv-text-offset",
  type: "inverted",
  fields: [
    { name: "description.en", analyzer: "text_en", features: ["frequency", "norm", "position", "offset"] }
  ]
});

db._createView("food_view", "search-alias", { indexes: [ { collection: "food", index: "inv-text-offset" } ] });
```

##### `arangosearch` View

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

#### AQL queries

Search the View for descriptions that contain the tokens `avocado` or `tomato`,
the phrase `cultivated ... pungency` with two arbitrary tokens between the two
words, and for words that start with `cap`. Get the matching positions, and use
this information to extract the substrings with the
[`SUBSTRING_BYTES()` function](aql/functions-string.html#substring_bytes).

The [`OFFSET_INFO()` function](aql/functions-arangosearch.html#offset_info)
returns a `name` that describes the path of the attribute or array element with
the match. You can use the [`VALUE()` function](aql/functions-document.html#value)
to dynamically get the respective value.

_`search-alias` View:_

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline searchHighlighting_2
    @EXAMPLE_ARANGOSH_OUTPUT{searchHighlighting_2}
      var coll = db._create("food");
    | var docs = db.food.save([
    |   { name: "avocado", description: { en: "The avocado is a medium-sized, evergreen tree, native to the Americas." } },
    |   { name: "carrot", description: { en: "The carrot is a root vegetable, typically orange in color, native to Europe and Southwestern Asia." } },
    |   { name: "chili pepper", description: { en: "Chili peppers are varieties of the berry-fruit of plants from the genus Capsicum, cultivated for their pungency." } },
    |   { name: "tomato", description: { en: "The tomato is the edible berry of the tomato plant." } }
      ]);
      var idx = db.food.ensureIndex({ name: "inv-text-offset", type: "inverted", fields: [ { name: "description.en", analyzer: "text_en", features: ["frequency", "norm", "position", "offset"] } ] });
      var view = db._createView("food_view", "search-alias", { indexes: [ { collection: "food", index: "inv-text-offset" } ] });
    ~ assert(db._query(`FOR d IN food_view COLLECT WITH COUNT INTO c RETURN c`).toArray()[0] === 4);
    | db._query(`FOR doc IN food_view
    |   SEARCH
    |     TOKENS("avocado tomato", "text_en") ANY == doc.description.en OR
    |     PHRASE(doc.description.en, "cultivated", 2, "pungency") OR
    |     STARTS_WITH(doc.description.en, "cap")
    |   FOR offsetInfo IN OFFSET_INFO(doc, ["description.en"])
    |     RETURN {
    |       description: doc.description,
    |       name: offsetInfo.name,
    |       matches: offsetInfo.offsets[* RETURN {
    |         offset: CURRENT,
    |         match: SUBSTRING_BYTES(VALUE(doc, offsetInfo.name), CURRENT[0], CURRENT[1])
    |       }]
          }`).toArray();
    ~ db._dropView("food_view");
    ~ db._drop("food");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock searchHighlighting_2
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

_`arangosearch` View:_

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline searchHighlighting_1
    @EXAMPLE_ARANGOSH_OUTPUT{searchHighlighting_1}
      var coll = db._create("food");
    | var docs = db.food.save([
    |   { name: "avocado", description: { en: "The avocado is a medium-sized, evergreen tree, native to the Americas." } },
    |   { name: "carrot", description: { en: "The carrot is a root vegetable, typically orange in color, native to Europe and Southwestern Asia." } },
    |   { name: "chili pepper", description: { en: "Chili peppers are varieties of the berry-fruit of plants from the genus Capsicum, cultivated for their pungency." } },
    |   { name: "tomato", description: { en: "The tomato is the edible berry of the tomato plant." } }
      ]);
      var analyzers = require("@arangodb/analyzers");
      var analyzer = analyzers.save("text_en_offset", "text", { locale: "en", stopwords: [] }, ["frequency", "norm", "position", "offset"]);
      var view = db._createView("food_view", "arangosearch", { links: { food: { fields: { description: { fields: { en: { analyzers: ["text_en_offset"] } } } } } } });
    ~ assert(db._query(`FOR d IN food_view COLLECT WITH COUNT INTO c RETURN c`).toArray()[0] === 4);
    | db._query(`FOR doc IN food_view
    |   SEARCH ANALYZER(
    |     TOKENS("avocado tomato", "text_en_offset") ANY == doc.description.en OR
    |     PHRASE(doc.description.en, "cultivated", 2, "pungency") OR
    |     STARTS_WITH(doc.description.en, "cap")
    |   , "text_en_offset")
    |   FOR offsetInfo IN OFFSET_INFO(doc, ["description.en"])
    |     RETURN {
    |       description: doc.description,
    |       name: offsetInfo.name,
    |       matches: offsetInfo.offsets[* RETURN {
    |         offset: CURRENT,
    |         match: SUBSTRING_BYTES(VALUE(doc, offsetInfo.name), CURRENT[0], CURRENT[1])
    |       }]
          }`).toArray();
    ~ db._dropView("food_view");
    ~ db._drop("food");
    ~ analyzers.remove(analyzer.name);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock searchHighlighting_1
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}
