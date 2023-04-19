---
layout: default
description: >-
  The HTTP API for indexes lets you create, delete, and list indexes
redirect_from:
  - indexes-working-with.html # 3.10 -> 3.10
---
# HTTP interface for indexes

{{ page.description }}
{:class="lead"}

## Addresses of indexes

All indexes in ArangoDB have a unique identifier. It identifies an
index within a collection and is managed by ArangoDB. The full identifier
is prefixed with a collection name and a forward slash (`/`) to identify an
index within a database.

```
http://server:port/_api/index/<collection-name>/<index-identifier>
```

For example, assume that the full index identifier is `demo/63563528`, then the
URL of that index is as follows:

```
http://localhost:8529/_api/index/demo/63563528
```

{% docublock get_api_index, h2 %}
{% docublock get_api_index_index, h2 %}
{% docublock post_api_index, h2 %}
{% docublock delete_api_index_index, h2 %}
