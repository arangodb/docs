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
wildcard and fuzzy search, nested search, as well as for
sophisticated full-text search with the ability to search for words, phrases,
and more.

You can use inverted indexes as follows:

- Stand-alone in `FILTER` operations of AQL queries.

- Add them to [`search-alias` Views](arangosearch.html#getting-started-with-arangosearch)
  to search multiple collections at once and to rank search results by relevance.

## Defining inverted indexes

Inverted indexes are defined per collection. You can add an arbitrary number of
document attributes to each index. Every attribute can optionally be processed
with an [Analyzer](analyzers.html), for instance, to tokenize text into words.

### Basic definition

For example, you can create an inverted index for the attributes `value1` and
`value2` with the following command in arangosh:

```js
db.<collection>.ensureIndex({
  type: "inverted",
  fields: ["value1", "value2"]
});
```

You should give inverted indexes easy-to-remember names because you need to
refer to them with `indexHint` in queries to
[utilize inverted indexes](#utilizing-inverted-indexes-in-queries):

```js
db.<collection>.ensureIndex({
  name: "inverted_index_name",
  type: "inverted",
  fields: ["value1", "value2"]
});
```

### Processing fields with Analyzers

The fields are processed by the `identity` Analyzer by default, which indexes
the attribute values as-is. To define a different Analyzer, you can pass an
object with the field settings instead. For example, you can use the default
Analyzer for `value1` and the built-in `text_en` Analyzer for `value2`.
You can also overwrite the `features` of an Analyzer:

```js
db.<collection>.ensureIndex({
  type: "inverted",
  fields: [
    "value1",
    { name: "value2", analyzer: "text_en", features: [ "frequency", "norm", "position", "offset" ] }
  ]
});
```

You can define default `analyzer` and `features` value at the top-level of the
index property. In the following example, both fields are indexed with the
`text_en` Analyzer:

```js
db.<collection>.ensureIndex({
  type: "inverted",
  fields: ["value1", "value2" ],
  analyzer: "text_en"
});
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
and array values like `arangosearch` Views do by default, then you can enable the
`searchField` option for specific attributes in the `fields` definition, or by
default using the top-level option with the same name. You may want to combine
it with the `includeAllFields` option to index sub-objects without explicit
definition:

```js
db.<collection>.ensureIndex({
  type: "inverted",
  fields: [
    { name: "arr", searchField: true, includeAllFields: true }
  ]
});
```

```js
db.<collection>.ensureIndex({
  type: "inverted",
  fields: [ "arr", "arr.name" ],
  searchField: true
});
```

To index array values but preserve the array indexes for a `search-alias` View,
which you then also need to specify in queries, enable the `trackListPositions`
option (requires `searchField` to be `true`):

```js
db.<collection>.ensureIndex({
  type: "inverted",
  fields: [
    { name: "arr", searchField: true, trackListPositions: true, includeAllFields: true }
  ]
});
```

```js
db.<collection>.ensureIndex({
  type: "inverted",
  fields: [ "arr", "arr.name" ],
  searchField: true,
  trackListPositions: true
});
```

### Storing additional values in indexes

Inverted indexes allow you to store additional attributes in the index that
can be used to satisfy projections of the document. They cannot be used for
index lookups, but for projections and sorting only. They allow inverted
indexes to fully cover more queries and avoid extra document lookups. This can
have a great positive effect on index scan performance if the number of scanned
index entries is large.

You can set the `storedValues` option when creating a new inverted index and
specify the additional attributes as an array of objects, each with a `fields`
attribute defining the attribute paths to add to the index: 

```js
db.<collection>.ensureIndex({
  type: "inverted",
  fields: ["value1"],
  storedValues: [ { fields: ["value1", "value2"] } ]
});
```

This indexes the `value1` attribute in the traditional sense, so that the index 
can be used for looking up by `value1` or for sorting by `value1`.

In addition, due to `storedValues` being used here, the index can also supply
the values for the `value1` and `value2` attributes for projections without
having to look up the document. The values can be read from the index instead.
Non-existing attributes are stored as `null` values.

You may specify the same attribute paths in both the `fields` and the
`storedValues` option. This is useful if you want to filter by an attribute and
also return it using an AQL query. The attribute values indexed by `fields`
cannot be utilized for projections because the index representation does not
match the original values as stored in the documents.

Attribute paths specified in the `primarySort` option can be utilized for
projections. Therefore, you don't need to add them to `storedValues`, too.

For each object in the `storedValues` array, you can additionally set a
`compression` (`lz4` by default) and `cache` option (`false` by default):

```js
db.<collection>.ensureIndex({
  type: "inverted",
  fields: ["value1"],
  storedValues: [
    { fields: ["value1"], compression: "lz4", cache: false },
    { fields: ["value2"], compression: "none", cache: true }
  ]
});
```

See [Optimizing View and inverted index query performance](arangosearch-performance.html#stored-values)
for details.

You may use the following shorthand notations on index creation instead of
an array of objects as described above. The default compression and cache
settings are used in this case:

- An array of strings, like `["attr1", "attr2"]`, to place each attribute into
  a separate column of the index (introduced in v3.10.3).

- An array of arrays of strings, like `[["attr1", "attr2"]]`, to place the
  attributes into a single column of the index, or `[["attr1"], ["attr2"]]`
  to place each attribute into a separate column. You can also mix it with the
  full form:
  
  ```json
  [
    ["attr1"],
    ["attr2", "attr3"],
    { "fields": ["attr4", "attr5"], "cache": true }
  ]
  ```

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

If you plan on using inverted indexes in `search-alias` Views, also consider the
following restrictions in addition:

- All inverted indexes you add to a single `search-alias` View need to have
  matching `primarySort` and `storedValues` settings.
- If different inverted indexes index fields with the same name (attribute path),
  these fields need to have matching `analyzer` and `searchField` settings.
- Fields that are implicitly indexed by `includeAllFields` must also have
  the same `analyzer` and `searchField` settings as fields with the same
  attribute path indexed by other inverted indexes. You cannot combine inverted
  indexes in a `search-alias` View if these settings would be ambiguous for any
  field.

## Utilizing inverted indexes in queries

Unlike other index types in ArangoDB, inverted indexes are not utilized
automatically, even if they are eligible for a query. The reason is that AQL
queries may produce different results with and without an inverted index,
because of differences in how `FILTER` operations work for inverted indexes,
the eventual-consistent nature of this index type, and for backward compatibility.

To use an inverted index, add an `OPTIONS` clause to the `FOR` operation that
you want to speed up. It needs to be a loop over a collection, not an array or
a View. Specify the desired index as an `indexHint`, using its name.

You should enable the `forceIndexHint` option to prevent unexpected query
results: Index hints are only recommendations you provide to
the optimizer unless you force them, and because `FILTER` queries behave
differently if an inverted index is used, the results would be inconsistent,
depending on whether or not the index hint is used. Forcing the hint ensures
that an error is raised if the index isn't suitable.

```aql
FOR doc IN coll OPTIONS { indexHint: "inverted_index_name", forceIndexHint: true }
  FILTER doc.value == 42 AND PHRASE(doc.text, ["meaning", 1, "life"])
  RETURN doc
```

Inverted indexes are eventually consistent. Document changes are not reflected
instantly, but only near-realtime. There is an internal option to wait for the
inverted index to update. This option is intended to be used **in unit tests only**:

```aql
FOR doc IN coll { indexHint: "inv-idx", forceIndexHint: true, waitForSync: true }
  FILTER doc.value != null ... // an arbitrary expression that the index can cover
```

This is not necessary if you use a single server deployment and populate a
collection with documents before creating an inverted index.

Also see [Dealing with eventual consistency](arangosearch.html#dealing-with-eventual-consistency).

## Examples

The following examples demonstrate how you can set up and use inverted indexes
with the JavaScript API of arangosh. See the
[`ensureIndex()` method](indexing-working-with-indexes.html#creating-an-index)
description for details. 

For more in-depth explanations and example data, see the
[ArangoSearch example datasets](arangosearch-example-datasets.html) and the
corresponding ArangoSearch examples.

### Exact value matching

Match exact movie title (case-sensitive, full string):

```js
db.imdb_vertices.ensureIndex({ name: "inv-exact", type: "inverted", fields: [ "title" ] });

db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-exact", forceIndexHint: true }
  FILTER doc.title == "The Matrix"
  RETURN KEEP(doc, "title", "tagline")`);
```

Match multiple exact movie titles using `IN`:

```js
db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-exact", forceIndexHint: true }
  FILTER doc.title IN ["The Matrix", "The Matrix Reloaded"]
  RETURN KEEP(doc, "title", "tagline")`);
```

Match movies that neither have the title `The Matrix` nor `The Matrix Reloaded`,
but ignore documents without a title:

```js
db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-exact", forceIndexHint: true }
  FILTER doc.title != null AND doc.title NOT IN ["The Matrix", "The Matrix Reloaded"]
  RETURN doc.title`);
```

### Range queries

Match movies with a runtime over `300` minutes and sort them from longest to
shortest runtime. You can give the index a primary sort order so that the `SORT`
operation of the query can be optimized away:

```js
db.imdb_vertices.ensureIndex({
  name: "inv-exact-runtime",
  type: "inverted",
  fields: [ "runtime" ],
  primarySort: {
    fields: [
      { field: "runtime", direction: "desc" }
    ]
  }
});

db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-exact-runtime", forceIndexHint: true }
  FILTER doc.runtime > 300
  SORT doc.runtime DESC
  RETURN KEEP(doc, "title", "runtime")`);
```

Match movies where the name is `>= Wu` and `< Y`:

```js
db.imdb_vertices.ensureIndex({ name: "inv-exact-name", type: "inverted", fields: [ "name" ] });

db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-exact-name", forceIndexHint: true }
  FILTER IN_RANGE(doc.name, "Wu", "Y", true, false)
  RETURN doc.name`);
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

Match movie titles, ignoring capitalization and using the base characters
instead of accented characters (full string):

```js
var analyzers = require("@arangodb/analyzers");
analyzers.save("norm_en", "norm", { locale: "en", accent: false, case: "lower" });

db.imdb_vertices.ensureIndex({
  name: "inv-ci",
  type: "inverted",
  fields: [
    { name: "title", analyzer: "norm_en" }
  ]
});

db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-ci", forceIndexHint: true }
  FILTER doc.title == TOKENS("thé mäTRïX", "norm_en")[0]
  RETURN doc.title`);
```

### Prefix matching

Match movie titles that start with either `"the matr"` or `"harry pot"`
(case-insensitive and accent-insensitive, using a custom `norm` Analyzer),
utilizing the feature of the `STARTS_WITH()` function that allows you to pass
multiple possible prefixes as array of strings, of which one must match:

```js
var analyzers = require("@arangodb/analyzers");
analyzers.save("norm_en", "norm", { locale: "en", accent: false, case: "lower" });

db.imdb_vertices.ensureIndex({
  name: "inv-ci",
  type: "inverted",
  fields: [
    { name: "title", analyzer: "norm_en" }
  ]
});

db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-ci", forceIndexHint: true }
  FILTER STARTS_WITH(doc.title, ["the matr", "harry pot"])
  RETURN doc.title`);
```

### Wildcard search

Match all titles that starts with `the matr` (case-insensitive) using `LIKE()`,
where `_` stands for a single wildcard character and `%` for an arbitrary amount:

```js
var analyzers = require("@arangodb/analyzers");
analyzers.save("norm_en", "norm", { locale: "en", accent: false, case: "lower" });

db.imdb_vertices.ensureIndex({
  name: "inv-ci",
  type: "inverted",
  fields: [
    { name: "title", analyzer: "norm_en" }
  ]
});

db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-ci", forceIndexHint: true }
  FILTER LIKE(doc.title, "the matr%")
  RETURN doc.title`);
```

### Full-text token search

Search for movies with both `dinosaur` and `park` in their description:

```js
db.imdb_vertices.ensureIndex({
  name: "inv-text",
  type: "inverted",
  fields: [
    { name: "description", analyzer: "text_en" }
  ]
});

db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-text", forceIndexHint: true }
  FILTER TOKENS("dinosaur park", "text_en") ALL == doc.description
  RETURN {
    title: doc.title,
    description: doc.description
  }`);
```

### Phrase and proximity search

Search for movies that have the (normalized and stemmed) tokens `biggest` and
`blockbust` in their description, in this order:

```js
db.imdb_vertices.ensureIndex({
  name: "inv-text",
  type: "inverted",
  fields: [
    { name: "description", analyzer: "text_en" }
  ]
});

db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-text", forceIndexHint: true }
  FILTER PHRASE(doc.description, "BIGGEST Blockbuster")
  RETURN {
    title: doc.title,
    description: doc.description
  }`);
```

Match movies that contain the phrase `epic <something> film` in their
description, where `<something>` can be exactly one arbitrary token:

```js
db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-text", forceIndexHint: true }
  FILTER PHRASE(doc.description, "epic", 1, "film", "text_en")
  RETURN {
    title: doc.title,
    description: doc.description
  }`);
```

### Fuzzy search

Search for the token `galxy` in the movie descriptions with some fuzziness.
The maximum allowed Levenshtein distance is set to `1`. Everything with a
Levenshtein distance equal to or lower than this value will be a match and the
respective documents will be included in the search result. The query will find
the token `galaxy` as the edit distance to `galxy` is `1`.

A custom `text` Analyzer with stemming disabled is used to improve the accuracy
of the Levenshtein distance calculation:

```js
var analyzers = require("@arangodb/analyzers");
analyzers.save("text_en_no_stem", "text", { locale: "en", accent: false, case: "lower", stemming: false, stopwords: [] });

db.imdb_vertices.ensureIndex({
  name: "inv-text-no-stem",
  type: "inverted",
  fields: [
    { name: "description", analyzer: "text_en_no_stem" }
  ]
});

db._query(`FOR doc IN imdb_vertices OPTIONS { indexHint: "inv-text-no-stem", forceIndexHint: true }
  FILTER LEVENSHTEIN_MATCH(
    doc.description,
    TOKENS("galxy", "text_en_no_stem")[0],
    1,    // max distance
    false // without transpositions
  )
  RETURN {
    title: doc.title,
    description: doc.description
  }`);
```

### Geo-spatial search

Using the Museum of Modern Arts as reference location, find restaurants within
a 100 meter radius. Return the matches sorted by distance and include how far
away they are from the reference point in the result:

```js
var analyzers = require("@arangodb/analyzers");
analyzers.save("geojson", "geojson", {}, ["frequency", "norm", "position"]);

db.restaurants.ensureIndex({
  name: "inv-rest",
  type: "inverted",
  fields: [
    { name: "location", analyzer: "geojson" }
  ]
});

db._query(`LET moma = GEO_POINT(-73.983, 40.764)
FOR doc IN restaurants OPTIONS { indexHint: "inv-rest", forceIndexHint: true }
  FILTER GEO_DISTANCE(doc.location, moma) < 100
  LET distance = GEO_DISTANCE(doc.location, moma)
  SORT distance
  RETURN {
    geometry: doc.location,
    distance
  }`);
```

### Nested search (Enterprise Edition)

Example data:

```js
db._create("exhibits");
db.exhibits.save([
  {
    "dimensions": [
      { "type": "height", "value": 35 },
      { "type": "width", "value": 60 }
    ]
  },
  {
    "dimensions": [
      { "type": "height", "value": 47 },
      { "type": "width", "value": 72 }
    ]
  }
]);
```

Match documents with a `dimensions` array that contains one or two sub-objects
with a `type` of `"height"` and a `value` greater than `40`:

```js
db.exhibits.ensureIndex({
  name: "inv-nest",
  type: "inverted",
  fields: [
    {
      name: "dimensions",
      nested: [
        { name: "type" },
        { name: "value" }
      ]
    }
  ]
});

db._query(`FOR doc IN exhibits OPTIONS { indexHint: "inv-nest", forceIndexHint: true }
  FILTER doc.dimensions[? 1..2 FILTER CURRENT.type == "height" AND CURRENT.value > 40]
  RETURN doc
`);
```

Nested search is only available in the Enterprise Edition.
