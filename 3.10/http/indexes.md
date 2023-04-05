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

All indexes in ArangoDB have a unique handle. This index handle identifies an
index and is managed by ArangoDB.

```
http://server:port/_api/index/<index-handle>
```

For example, assume that the index handle is `demo/63563528`, then the URL of
that index is:

```
http://localhost:8529/_api/index/demo/63563528
```

{% docublock get_api_index, h2 %}
{% docublock get_api_index_index, h2 %}
{% docublock post_api_index, h2 %}
{% docublock delete_api_index_index, h2 %}
