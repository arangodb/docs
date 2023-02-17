---
layout: default
description: Working with Persistent Indexes
redirect_from:
  - indexes-hash.html # 3.9 -> 3.10
  - indexes-skiplist.html # 3.9 -> 3.10
---
Working with Persistent Indexes
===============================

{% hint 'info' %}
The index types `hash` and `skiplist` are aliases for the `persistent` index
type and should no longer be used to create new indexes. The aliases will be
removed in a future version.
{% endhint %}

<!-- js/actions/api-index.js -->
{% docublock post_api_index_persistent %}
