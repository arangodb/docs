---
layout: default
description: >-
  You can use inverted indexes to speed up a broad range of AQL queries,
  from simple to complex, including full-text search
---
# Inverted indexes

{{ page.description }}
{:class="lead"}

Documents hold attributes, mapping attribute keys to values.
Inverted indexes store mappings from values (of document attributes) to their
locations in collections. You can create these indexes to accelerate queries
like value lookups, range queries, accent- and case-insensitive search,
wildcard and fuzzy search, nested search, search highlighting, as well as for
sophisticated full-text search with the ability to search for words, phrases,
and more.

You can use inverted indexes stand-alone in `FILTER` operations of AQL queries,
or add them to [Search Alias Views](arangosearch.html#getting-started-with-arangosearch)
to search multiple collections at once and to rank search results by relevance.

## Defining inverted indexes

Inverted indexes are defined per collection. You can add an arbitrary number of
document attributes to each index. Every attribute can optionally be processed
with an [Analyzer](analyzers.html), for instance, to tokenize text into words.

### Basic definition

For example, you can create an inverted index for the attributes `value1` and
`value2` with the following command in arangosh:

```js
db.<collection>.ensureIndex({ type: "inverted", fields: ["value1", "value2"] });
```

### Processing fields with Analyzers

The fields are processed by the `identity` Analyzer by default, which indexes
the attribute values as-in. To define a different Analyzer for the second field,
you can pass an object with the field settings instead. It also allows you to
overwrite the Analyzer features:

```js
db.<collection>.ensureIndex({ type: "inverted", fields: ["value1", { name: "value2", analyzer: "text_en", features: [ "frequency", "norm", "position", "offset" ] } ] });
```

You can define default `analyzer` and `features` value at the top-level of the
index property. Both fields are indexed with the `text_en` Analyzer using the
following example:

```js
db.<collection>.ensureIndex({ type: "inverted", fields: ["value1", "value2" ], analyzer: "text_en" });
```

If no `features` are defined in `fields` nor at the top-level, then the features
defined by the Analyzer itself are used.

### Indexing sub-attributes

To index a sub-attribute, like `{ "attr": { "sub": "value" } }`, use the
`.` character for the description of the attribute path:

```js
db.<collection>.ensureIndex({ type: "inverted", fields: ["attr.sub"] });
```

For `SEARCH` queries using a `search-alias` View, you can also index all
sub-attribute of an attribute with the `includeAllFields` options. It has no
effect on `FILTER` queries that use an inverted index directly, however. You can
enable the option for specific attributes in the `fields` definition, or for the
entire document by setting the option at the top-level of the index properties:

```js
db.<collection>.ensureIndex({ type: "inverted", fields: [ { name: "attr", includeAllFields: true } ] });
db.<collection>.ensureIndex({ type: "inverted", includeAllFields: true });
```

With the `includeAllFields` option enabled at the top-level, the otherwise
mandatory `fields` property becomes optional.

The `includeAllFields` option only includes the remaining fields that are not
separately specified in the `fields` definition, including their sub-attributes.

### Indexing array values

You can expand an attribute with an array as value so that its elements get
indexed individually by using `[*]` in the attribute path. For example, to
index the string values of a document like
`{ "arr": [ { "name": "foo" }, { "name": "bar" } ] }`, use `arr[*].name`:

```js
db.<collection>.ensureIndex({ type: "inverted", fields: ["arr[*].name"] });
```

You can only expand one level of arrays.

If you want to use the inverted index in a `search-alias` View and index primitive
and array values like ArangoSearch Views do by default, then you can enable the
`searchField` option for specific attributes in the `fields` definition, or by
default using the top-level option with the same name. You may want to combine
it with the `includeAllFields` option to index sub-objects without explicit
definition:

```js
db.<collection>.ensureIndex({ type: "inverted", fields: [ { name: "arr", searchField: true, includeAllFields: true } ] });
db.<collection>.ensureIndex({ type: "inverted", fields: [ "arr", "arr.name" ], searchField: true });
```

To index array values but preserve the array indexes for a `search-alias` View,
which you then also need to specify in queries, enable the `trackListPositions`
option:

```js
db.<collection>.ensureIndex({ type: "inverted", fields: [ { name: "arr", searchField: true, trackListPositions: true, includeAllFields: true } ] });
db.<collection>.ensureIndex({ type: "inverted", fields: [ "arr", "arr.name" ], searchField: true, trackListPositions: true });
```

### Storing additional values in indexes

Inverted indexes allow you to store additional attributes in the index that
can be used to satisfy projections of the document. They cannot be used for
index lookups or for sorting, but for projections only. They allow inverted
indexes to fully cover more queries and avoid extra document lookups. This can
have a great positive effect on index scan performance if the number of scanned
index entries is large.

You can set the `storedValues` option and specify the additional attributes as
an array of attribute paths when creating a new inverted index:

```js
db.<collection>.ensureIndex({
  type: "inverted",
  fields: ["value1"],
  storedValues: ["value2"]
});
```

This indexes the `value1` attribute in the traditional sense, so that the index 
can be used for looking up by `value1` or for sorting by `value1`. The index also
supports projections on `value1` as usual.

In addition, due to `storedValues` being used here, the index can now also 
supply the values for the `value2` attribute for projections without having to
look up the full document. Non-existing attributes are stored as `null` values.

You cannot specify the same attribute path in both, the `fields` and the
`storedValues` option. If there is an overlap, the index creation aborts
with an error message.

### Additional configuration options

See the full list of options in the [HTTP API](http/indexes-inverted.html)
documentation.

### Restrictions

- You cannot index the same field twice in a single inverted index. This includes
  indexing the same field with and without array expansion (e.g.
  `fields: ["arr", "arr[*]"]`).
- Every field can only be processed by a single Analyzer per index. The benefit
  is that you don't need to specify the Analyzers in queries with the `ANALYZER()`
  function, they can be inferred from the index definition.

If you plan on using inverted indexes in Search Alias Views, also consider the
following restrictions:

- All inverted indexes you add to a single `search-alias` View need to have
  matching `primarySort` and `storedValues` settings.
- If inverted indexes of different collections index fields with the same name
  (attribute path), these fields need to have matching `analyzer` and
  `searchField` settings.

## Utilizing inverted indexes in queries

Unlike other index types in ArangoDB, inverted indexes are not utilized
automatically, even if they are eligible for a query. The reason is that AQL
queries may produce different results with and without an inverted index,
because of differences in how `FILTER` operations work for inverted indexes,
the eventual-consistent nature of this index type, and for backward compatibility.

To use an inverted index, add an `OPTIONS` clause to the `FOR` operation that
you want to speed up. It needs to be a loop over a collection, not an array or
a View. Specify the desired index as an `indexHint`, using its name. If any of
the attributes you filter by is processed by an Analyzer other than `identity`,
then you need to enable the `forceIndexHint` option.

```aql
FOR doc IN coll OPTIONS { indexHint: "inverted_index_name", forceIndexHint: true }
  FILTER doc.value == 42 AND PHRASE(doc.text, ["meaning", 1, "life"])
  RETURN doc
```

## Examples

The following examples demonstrate how you can set up and use inverted indexes
with the JavaScript API of arangosh. See for 

### Exact value matching

```js
db.imdb_vertices.ensureIndex({ type: "inverted", name: "inv-exact", fields: [ "title" ] });
db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-exact" }
  FILTER doc.title == "The Matrix"
  RETURN doc`);
```

### Range queries

```js
db.imdb_vertices.ensureIndex({ type: "inverted", name: "inv-exact", fields: [ "runtime" ], primarySort: { fields: [ { field: "runtime", direction: "desc" } ] } });
db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-exact" }
  FILTER doc.runtime > 300
  SORT doc.runtime DESC
  RETURN doc`);
```

```js
db.imdb_vertices.ensureIndex({ type: "inverted", name: "inv-exact", fields: [ "name" ] });
db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-exact" }
  FILTER IN_RANGE(doc.name, "Wu", "Y", true, false)
  RETURN doc`);
```

{% hint 'warning' %}
The alphabetical order of characters is not taken into account,
i.e. range queries backed by inverted indexes do not follow the
language rules as per the defined Analyzer locale (except for the
[`collation` Analyzer](analyzers.html#collation)) nor the server language
(startup option `--default-language`)!
Also see [Known Issues](release-notes-known-issues310.html#arangosearch).
{% endhint %}

### Case-insensitive search

Match movie title, ignoring capitalization and using the base characters
instead of accented characters (full string):

```js
var analyzers = require("@arangodb/analyzers");
analyzers.save("norm_en", "norm", { locale: "en.utf-8", accent: false, case: "lower" }, ["frequency", "norm", "position"]);
db.imdb_vertices.ensureIndex({ type: "inverted", name: "inv-ci", fields: [ { name: "title", analyzer: "norm_en" } ] });
db._query(`FOR doc IN imdb_vertices
  FILTER doc.title == TOKENS("thé mäTRïX", "norm_en")[0]
  RETURN doc.title)
```

### Phrase and proximity search

Search for movies that have the (normalized and stemmed) tokens `biggest` and
`blockbust` in their description, in this order:

```js
db.imdb_vertices.ensureIndex({ type: "inverted", name: "inv-text", fields: [ { name: "description", analyzer: "text_en" } ] });
db._query(`FOR doc IN imdb_vertices
  FILTER PHRASE(doc.description, "BIGGEST Blockbuster")
  RETURN {
    title: doc.title,
    description: doc.description
  }
`);
```

### Nested search

```js
db.coll.ensureIndex({ type: "inverted", name: "inv-nest", fields: [ { nested: [ { name: "dimensions" } ] } ] });
db._query(`FOR doc IN coll
  SEARCH doc.dimensions[? 1..2 FILTER CURRENT.type == "height" AND CURRENT.value > 40]
  RETURN doc
`);
```

### Search highlighting

```js
db.imdb_vertices.ensureIndex({ type: "inverted", name: "inv-text", fields: [ { name: "description", analyzer: "text_en", features: ["frequency", "norm", "position", "offset"] } ] });
db._query(`FOR doc IN food
  FILTER
    TOKENS("avocado tomato", "text_en") ANY == doc.description.en OR
    PHRASE(doc.description.en, "cultivated", 2, "pungency") OR
    STARTS_WITH(doc.description.en, "cap")
  RETURN {
    title: doc.title,
    matches: (
      FOR offsetInfo IN OFFSET_INFO(doc, ["description.en"])
        RETURN offsetInfo.offsets[* RETURN {
          offset: CURRENT,
          match: SUBSTRING_BYTES(VALUE(doc, offsetInfo.name), CURRENT[0], CURRENT[1])
        }]
    )
  }
`);
```

### Ranking query results

```js
db.imdb_vertices.ensureIndex({ type: "inverted", name: "inv-text", fields: [ { name: "description", analyzer: "text_en" } ] });
db._query(`FOR doc IN imdb_vertices
  FILTER PHRASE(doc.description, "BIGGEST Blockbuster")
  SORT BM25(doc) DESC
  RETURN {
    title: doc.title,
    description: doc.description,
    bm25: BM25(doc)
  }
`);
```
