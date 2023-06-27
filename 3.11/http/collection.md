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
# HTTP interface for collections

{{ page.description }}
{:class="lead"}

## Addresses of collections

All collections in ArangoDB have a unique identifier and a unique
name. To access a collection, use the collection name to refer to it:

```
http://server:port/_api/collection/<collection-name>
```

For example, assume that the collection identifier is `7254820` and
the collection name is `demo`, then the URL of that collection is:

```
http://localhost:8529/_api/collection/demo
```

## Get information about collections

{% docublock get_api_collection %}
{% docublock get_api_collection_collection %}
{% docublock get_api_collection_collection_properties %}
{% docublock get_api_collection_collection_count %}
{% docublock get_api_collection_collection_figures %}
{% docublock put_api_collection_collection_responsibleShard %}
{% docublock get_api_collection_collection_shards %}
{% docublock get_api_collection_collection_revision %}
{% docublock get_api_collection_collection_checksum %}

## Create and delete collections

{% docublock post_api_collection %}
{% docublock delete_api_collection_collection %}
{% docublock put_api_collection_collection_truncate %}

## Modify collections

{% docublock put_api_collection_collection_load %}
{% docublock put_api_collection_collection_unload %}
{% docublock put_api_collection_collection_loadIndexesIntoMemory %}
{% docublock put_api_collection_collection_properties %}
{% docublock put_api_collection_collection_rename %}
{% docublock put_api_collection_collection_recalculateCount %}
{% docublock put_api_collection_collection_compact %}
