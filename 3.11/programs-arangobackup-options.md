---
layout: default
description: Arangobackup Options
page-toc:
  max-headline-level: 2
---
Arangobackup Options
====================

Usage: `arangobackup <operation> [<options>]`

The `--operation` option can be passed as positional argument to specify the
desired action.

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangobackup" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangobackup" %}
