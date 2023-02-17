---
layout: default
description: arangodump Options
page-toc:
  max-headline-level: 2
---
_arangodump_ Options

Usage: `arangodump [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangodump" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangodump" %}
