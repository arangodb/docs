---
layout: default
description: arangoexport Options
---
# _arangoexport_ Options

Usage: `arangoexport [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangoexport" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangoexport" %}
