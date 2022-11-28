---
fileID: programs-arangoinspect-options
title: _arangoinspect_ Options
weight: 440
description: 
layout: default
---
Usage: `arangoinspect [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangoinspect" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangoinspect" %}
