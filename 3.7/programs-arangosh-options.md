---
layout: default
description: Arangosh Options
---
Arangosh Options
================

Usage: `arangosh [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangosh" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangosh" %}
