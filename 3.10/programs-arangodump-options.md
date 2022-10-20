---
layout: default
description: arangodump Options
---
_arangodump_ Options

Usage: `arangodump [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangodump" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangodump" %}

Notes
-----

### Encryption Option Details

{% include hint-ee-arangograph.md feature="Dump encryption" %}
 
*\--encryption.keyfile path-of-keyfile*

The file `path-to-keyfile` must contain the encryption key. This file must be
secured, so that only `arangodump`, `arangorestore`, and `arangod` can access it.
You should also ensure that in case someone steals your hardware, they will not be
able to read the file. For example, by encrypting `/mytmpfs` or
creating an in-memory file-system under `/mytmpfs`. The encryption keyfile must 
contain 32 bytes of data.

*\--encryption.key-generator path-to-my-generator*

This output is used if you want to use the program to generate your encryption key.
The program `path-to-my-generator` must output the encryption on standard output
and exit. The encryption keyfile must contain 32 bytes of data.

