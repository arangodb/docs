---
fileID: programs-arangobench-options
title: _arangobench_ Startup Options
weight: 565
description: 
layout: default
---
Usage: `arangobench [<options>]`

**Examples**

Run the `version` test case with 1000 requests, without threads:

```
arangobench --test-case version --requests 1000 --threads 1
```

Run the `document` test case with 2000 requests, with two concurrent threads:

```
arangobench --test-case document --requests 1000 --threads 2
```

Run the `document` test case with 2000 requests, with threads 2,
with async requests:

```
arangobench --test-case document --requests 1000 --threads 2 --async true
```

Run the `document` test case with 2000 requests, with threads 2,
using batch requests:

```
arangobench --test-case document --requests 1000 --threads 2 --batch-size 10
```

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangobench" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangobench" %}
