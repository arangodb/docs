---
fileID: functions-arangosearch
title: ArangoSearch Functions
weight: 3690
description: ArangoSearch offers various AQL functions for search queries to control the search context, for filtering and scoring
layout: default
---
`OFFSET_INFO(doc, rules) → offsetInfo`

- **doc** (document): must be emitted by `FOR ... IN viewName`
- **rules** (array): an array of objects with the following attributes:
  - **name** (string): an attribute and array element path
    you want to get the offsets for. Use `.` to access nested objects,
    and `[n]` with `n` being an array index to specify array elements. The
    attributes need to be indexed by Analyzers with the `offset` feature enabled.
  - **options** (object): an object with the following attributes:
    - **maxOffsets** (number, _optional_): the total number of offsets to
      collect per path. Default: `10`.
    - **limits** (object, _optional_): an object with the following attributes:
      - **term** (number, _optional_): the total number of term offsets to
        collect per path. Default: 2<sup>32</sup>.
      - **phrase** (number, _optional_): the total number of phrase offsets to
        collect per path. Default: 2<sup>32</sup>.
      - **ngram** (number, _optional_): the total number of _n_-gram offsets to
        collect per path. Default: 2<sup>32</sup>.
- returns **offsetInfo** (array): an array of objects, each with the following
  attributes: 
  - **name** (array): the attribute and array element path as an array of
    strings and numbers. You can pass this name to the
    [VALUE()](functions-document) to dynamically look up the value.
  - **offsets** (array): an array of arrays with the matched positions, capped
    to the specified limits. Each inner array has two elements with the start
    offset and the length of a match.

    {{% hints/warning %}}
    The start offsets and lengths describe the positions in bytes, not characters.
    You may need to account for characters encoded using multiple bytes.
{{% /hints/warning %}}

**Examples**

Search a View and get the offset information for the matches:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: aqlOffsetInfo
description: ''
render: input/output
version: '3.10'
release: stable
---
~ db._create("food");
~ db.food.save({ name: "avocado", description: { en: "The avocado is a medium-sized, evergreen tree, native to the Americas." } });
~ db.food.save({ name: "tomato", description: { en: "The tomato is the edible berry of the tomato plant." } });
~ var analyzers = require("@arangodb/analyzers");
~ var analyzer = analyzers.save("text_en_offset", "text", { locale: "en", stopwords: [] }, ["frequency", "norm", "position", "offset"]);
~ db._createView("food_view", "arangosearch", { links: { food: { fields: { description: { fields: { en: { analyzers: ["text_en_offset"] } } } } } } });
~ assert(db._query(`FOR d IN food_view COLLECT WITH COUNT INTO c RETURN c`).toArray()[0] === 2);
  db._query(`FOR doc IN food_view
    SEARCH ANALYZER(TOKENS("avocado tomato", "text_en_offset") ANY == doc.description.en, "text_en_offset")
RETURN OFFSET_INFO(doc, ["description.en"])`);
~ db._dropView("food_view");
~ db._drop("food");
~ analyzers.remove(analyzer.name);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

For full examples, see [Search Highlighting](../../indexing/arangosearch/arangosearch-search-highlighting).
