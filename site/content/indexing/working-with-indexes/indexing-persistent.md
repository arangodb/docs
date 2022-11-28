---
fileID: indexing-persistent
title: Persistent indexes
weight: 500
description: 
layout: default
---
Ensures that a non-unique persistent index exists:

`collection.ensureIndex({ type: "persistent", fields: [ "field1", ..., "fieldn" ] })`

Creates a non-unique persistent index on all documents using `field1`, ...
`fieldn` as attribute paths. At least one attribute path has to be given.
The index will be non-sparse by default.

To create a sparse unique index, set the `sparse` attribute to `true`.

In case that the index was successfully created, an object with the index
details, including the index-identifier, is returned.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: ensurePersistent
description: ''
render: input/output
version: '3.10'
release: stable
---
~db._create("names");
db.names.ensureIndex({ type: "persistent", fields: [ "first" ] });
db.names.save({ "first" : "Tim" });
db.names.save({ "first" : "Tom" });
db.names.save({ "first" : "John" });
db.names.save({ "first" : "Tim" });
db.names.save({ "first" : "Tom" });
~db._drop("names");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



### Query by example using a persistent index

Constructs a query-by-example using a persistent index:

`collection.byExample(example)`

Selects all documents from the collection that match the specified example 
and returns a cursor. A persistent index will be used if present.

You can use `toArray()`, `next()`, or `hasNext()` to access the
result. The result can be limited using the `skip()` and `limit()`
operator.

An attribute name of the form `a.b` is interpreted as attribute path,
not as attribute. If you use

```json
{ "a" : { "c" : 1 } }
```

as example, then you will find all documents, such that the attribute
`a` contains a document of the form `{ "c" : 1 }`. For example the document

```json
{ "a" : { "c" : 1 }, "b" : 1 }
```

will match, but the document

```json
{ "a" : { "c" : 1, "b" : 1 } }
```

will not.

However, if you use

```json
{ "a.c" : 1 }
```

then you will find all documents, which contain a sub-document in `a`
that has an attribute `c` of value `1`. Both the following documents

```json
{ "a" : { "c" : 1 }, "b" : 1 }
```
and

```json
{ "a" : { "c" : 1, "b" : 1 } }
```
will match.

## Persistent Indexes and Server Language

The order of index entries in persistent indexes adheres to the configured
[server language](../../programs-tools/arangodb-server/programs-arangod-options#--default-language).
If, however, the server is restarted with a different language setting as when
the persistent index was created, not all documents may be returned anymore and
the sort order of those which are returned can be wrong (whenever the persistent
index is consulted).

To fix persistent indexes after a language change, delete and re-create them.
