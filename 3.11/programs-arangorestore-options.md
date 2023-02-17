---
layout: default
description: arangorestore Options
page-toc:
  max-headline-level: 2
---
# _arangorestore_ Options

Usage: `arangorestore [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangorestore" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangorestore" %}
