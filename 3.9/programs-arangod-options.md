---
layout: default
description: ArangoDB Server Options
page-toc:
  max-headline-level: 2
---
ArangoDB Server Options
=======================

Usage: `arangod [<options>]`

The database directory can be specified as positional (unnamed) first parameter:

    arangod /path/to/datadir

Or explicitly as named parameter:

    arangod --database.directory /path/to/datadir

All other parameters need to be passed as named parameters.
That is two hyphens followed by the option name, an equals sign or a space and
finally the parameter value. The value needs to be wrapped in double quote marks
if the value contains whitespace. Extra whitespace around `=` is allowed:

    arangod --database.directory = "/path with spaces/to/datadir"

See [Configuration](administration-configuration.html)
if you want to translate startup parameters to configuration files
or learn more about startup options in general.

See
[Fetch Current Configuration Options](administration-configuration.html#fetch-current-configuration-options)
if you want to query the `arangod` server for the current settings at runtime.

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangod" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangod" %}
