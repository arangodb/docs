---
layout: default
description: arangoinspect Options
page-toc:
  max-headline-level: 2
---
# _arangoinspect_ Options

Usage: `arangoinspect [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangoinspect" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangoinspect" %}
