---
layout: default
description: arangoimport Options
---
# _arangoimport_ Options

Usage: `arangoimport [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangoimport" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangoimport" %}
