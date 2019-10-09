---
layout: default
description: Arangobackup Options
---
Arangobackup Options
====================

Usage: `arangobackup <operation> [<options>]`

The `--operation` option can be passed as positional argument to specify the
desired action.

{% assign options = site.data["35-program-options-arangobackup"] %}
{% include program-option.html options=options name="arangobackup" %}
