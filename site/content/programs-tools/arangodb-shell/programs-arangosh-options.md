---
fileID: programs-arangosh-options
title: _arangosh_ Options
weight: 250
description: 
layout: default
---
Usage: `arangosh [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangosh" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangosh" %}
