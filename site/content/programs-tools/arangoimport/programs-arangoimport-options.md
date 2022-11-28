---
fileID: programs-arangoimport-options
title: _arangoimport_ Options
weight: 540
description: 
layout: default
---
Usage: `arangoimport [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangoimport" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangoimport" %}
