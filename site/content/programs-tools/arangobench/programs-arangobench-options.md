---
fileID: programs-arangobench-options
title: _arangobench_ Startup Options
weight: 415
description: 
layout: default
---
Usage: `arangobench [<options>]`

**Examples**

Run the `version` test case with 1000 requests, without threads:

{{< tabs >}}
{{% tab name="" %}}
```
arangobench --test-case version --requests 1000 --threads 1
```
{{% /tab %}}
{{< /tabs >}}

Run the `document` test case with 2000 requests, with two concurrent threads:

{{< tabs >}}
{{% tab name="" %}}
```
arangobench --test-case document --requests 1000 --threads 2
```
{{% /tab %}}
{{< /tabs >}}

Run the `document` test case with 2000 requests, with threads 2,
with async requests:

{{< tabs >}}
{{% tab name="" %}}
```
arangobench --test-case document --requests 1000 --threads 2 --async true
```
{{% /tab %}}
{{< /tabs >}}

Run the `document` test case with 2000 requests, with threads 2,
using batch requests:

{{< tabs >}}
{{% tab name="" %}}
```
arangobench --test-case document --requests 1000 --threads 2 --batch-size 10
```
{{% /tab %}}
{{< /tabs >}}

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangobench" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangobench" %}
