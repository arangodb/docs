---
layout: default
description: arangobench Startup Options
redirect_from:
  - programs-arangobench-examples.html # 3.8 -> 3.8
---
_arangobench_ Startup Options
===========================

Usage: `arangobench [<options>]`

**Examples**

Run the `version` test case with 1000 requests, without concurrency:

```
arangobench --test-case version --requests 1000 --concurrency 1
```

Run the `document` test case with 2000 requests, with two concurrent threads:

```
arangobench --test-case document --requests 1000 --concurrency 2
```

Run the `document` test case with 2000 requests, with concurrency 2,
with async requests:

```
arangobench --test-case document --requests 1000 --concurrency 2 --async true
```

Run the `document` test case with 2000 requests, with concurrency 2,
using batch requests:

```
arangobench --test-case document --requests 1000 --concurrency 2 --batch-size 10
```

{% assign options = site.data["38-program-options-arangobench"] %}
{% include program-option.html options=options name="arangobench" %}
