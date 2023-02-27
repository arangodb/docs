---
layout: default
description: >-
  The HTTP API for collections lets you create and delete collections, get
  information about collections, and modify certain properties of existing
  collections
redirect_from:
  - collection-creating.html # 3.10 -> 3.10
  - collection-getting.html # 3.10 -> 3.10
  - collection-modifying.html # 3.10 -> 3.10
---
# HTTP Interface for Collections

{{ page.description }}
{:class="lead"}

## Collections

A collection consists of documents. It is uniquely identified by its
[collection identifier](../appendix-glossary.html#collection-identifier).
It also has a unique name that clients should
use to identify and access it. Collections can be renamed.
This changes the collection name, but not the collection identifier.
Collections have a type that is specified by the user when the collection
is created. There are currently two types: document and edge. The default
type is document.

### Collection Identifiers

A collection identifier lets you refer to a collection in a database.
It is a string value and is unique within the database. Clients should use
a collection's unique name to access a collection instead of its identifier.
ArangoDB currently uses 64bit unsigned integer values to maintain
collection IDs internally. When returning collection IDs to clients,
ArangoDB puts them into a string to ensure the collection identifier is not
clipped by clients that do not support big integers. Clients should treat
the collection IDs returned by ArangoDB as opaque strings when they store
or use them locally.

### Collection Names

A collection name identifies a collection in a database. It is a string
and is unique within the database. Unlike the collection identifier it is
supplied by the creator of the collection. The collection name must consist
of letters, digits, and the underscore (`_`) and dash (`-`) characters only.
Also see [Naming conventions](../data-modeling-naming-conventions-collection-and-view-names.html).

### Key Generator

ArangoDB allows using key generators for each collection. Key generators
have the purpose of auto-generating values for the _key attribute of a document
if none was specified by the user. By default, ArangoDB will use the traditional
key generator. The traditional key generator will auto-generate key values that
are strings with ever-increasing numbers. The increment values it uses are
non-deterministic.

Contrary, the auto increment key generator will auto-generate deterministic key
values. Both the start value and the increment value can be defined when the
collection is created. The default start value is 0 and the default increment
is 1, meaning the key values it will create by default are:

1, 2, 3, 4, 5, ...

When creating a collection with the auto increment key generator and an increment of 5, the generated keys would be:

1, 6, 11, 16, 21, ...

The auto-increment values are increased and handed out on each document insert
attempt. Even if an insert fails, the auto-increment value is never rolled back.
That means there may exist gaps in the sequence of assigned auto-increment values
if inserts fails.

The basic operations (create, read, update, delete) for documents are mapped
to the standard HTTP methods (*POST*, *GET*, *PUT*, *DELETE*).

## Addresses of collections

All collections in ArangoDB have a unique identifier and a unique
name. ArangoDB internally uses the collection's unique identifier to
look up collections. This identifier however is managed by ArangoDB
and the user has no control over it. In order to allow users use their
own names, each collection also has a unique name, which is specified
by the user.  To access a collection from the user perspective, the
collection name should be used, i.e.:

```
http://server:port/_api/collection/collection-name
```

For example, assume that the collection identifier is *7254820* and
the collection name is *demo*, then the URL of that collection is:

```
http://localhost:8529/_api/collection/demo
```

## Collection API

### Get information about collections

{% docublock get_api_collection_name %}
{% docublock get_api_collection_properties %}
{% docublock get_api_collection_count %}
{% docublock get_api_collection_figures %}
{% docublock get_api_collection_getResponsibleShard %}
{% docublock get_api_collection_shards %}
{% docublock get_api_collection_revision %}
{% docublock get_api_collection_checksum %}
{% docublock get_api_collections %}

### Create and delete collections

{% docublock post_api_collection %}
{% docublock delete_api_collection %}
{% docublock put_api_collection_truncate %}

### Modify collections

{% docublock put_api_collection_load %}
{% docublock put_api_collection_unload %}
{% docublock put_api_collection_load_indexes_into_memory %}
{% docublock put_api_collection_properties %}
{% docublock put_api_collection_rename %}
{% docublock put_api_collection_recalculate_count %}
{% docublock put_api_collection_compact %}
