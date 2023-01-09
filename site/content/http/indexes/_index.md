---
fileID: indexes
title: HTTP Interface for Indexes
weight: 2080
description: 
layout: default
---
## Indexes

This is an introduction to ArangoDB's HTTP interface for indexes in
general. There are special sections for various index types.

### Index

Indexes are used to allow fast access to documents. For each collection there is always the primary index which is a hash index for the
[document key](../../appendix/appendix-glossary#document-key) (_key attribute). This index cannot be dropped or changed.
[edge collections](../../appendix/appendix-glossary#edge-collection) will also have an automatically created edges index, which cannot be modified. This index provides quick access to documents via the `_from` and `_to` attributes.

Most user-land indexes can be created by defining the names of the attributes which should be indexed. Some index types allow indexing just one attribute (e.g. ttl index) whereas other index types allow indexing multiple attributes.

You cannot use the `_id` system attribute, nor sub-attributes with this name, in
user-defined indexes of any type.

### Index Handle

An index handle uniquely identifies an index in the database. It is a string and consists of a collection name and an index identifier separated by /.
If the index is declared unique, then access to the indexed attributes should be fast. The performance degrades if the indexed attribute(s) contain(s) only very few distinct values.

### Primary Index

A primary index is automatically created for each collections. It indexes the documents' primary keys, which are stored in the `_key` system attribute. The primary index is unique and can be used for queries on both the `_key` and `_id` attributes.
There is no way to explicitly create or delete primary indexes.

### Edge Index

An edge index is automatically created for edge collections. It contains connections between vertex documents and is invoked when the connecting edges of a vertex are queried. There is no way to explicitly create or delete edge indexes.
The edge index is non-unique.

### Persistent Index

A persistent index is a sorted index that can be used for finding individual documents or ranges of documents.

### Inverted Index

An inverted index can accelerate a broad range of queries, but it is not updated
immediately like other indexes.

### TTL (time-to-live) index

The TTL index can be used for automatically removing expired documents from a collection.
Documents which are expired are eventually removed by a background thread.

### Geo-spatial index

A geo-spatial index can accelerate queries that filter and sort by the distance
between stored coordinates and coordinates provided in a query.

### Multi-dimensional index

The `zkd` index type is an experimental index for indexing two- or higher
dimensional data such as time ranges, for efficient intersection of multiple
range queries.

### Fulltext Index

{{% hints/warning %}}
The fulltext index type is deprecated from version 3.10 onwards.
It is recommended to use [Inverted indexes](../../indexing/working-with-indexes/indexing-inverted) or
[ArangoSearch](../../indexing/arangosearch/) for advanced full-text search capabilities.
{{% /hints/warning %}}

A fulltext index can be used to find words, or prefixes of words inside documents. A fulltext index can be set on one attribute only, and will index all words contained in documents that have a textual value in this attribute. Only words with a (specifiable) minimum length are indexed. Word tokenization is done using the word boundary analysis provided by libicu, which is taking into account the selected language provided at server start. Words are indexed in their lower-cased form. The index supports complete match queries (full words) and prefix queries.

## Address of an Index

All indexes in ArangoDB have an unique handle. This index handle identifies an
index and is managed by ArangoDB. All indexes are found under the URI

    http://server:port/_api/index/index-handle

For example: Assume that the index handle is *demo/63563528* then the URL of
that index is:

    http://localhost:8529/_api/index/demo/63563528
