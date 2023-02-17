---
layout: default
description: arangoinspect Options
---
# _arangoinspect_ Options

Usage: `arangoinspect [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangoinspect" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangoinspect" %}
