---
fileID: programs-arangod-options
title: ArangoDB Server Options
weight: 170
description: 
layout: default
---
Usage: `arangod [<options>]`

To list the commonly used startup options with a description of each option, run
the server executable in a command-line with the `--help` (or `-h`) option:

{{< tabs >}}
{{% tab name="bash" %}}
    arangod --help
{{% /tab %}}
{{< /tabs >}}

To list **all** available startup options and their descriptions, use:

{{< tabs >}}
{{% tab name="bash" %}}
    arangod --help
{{% /tab %}}
{{< /tabs >}}-all

You can specify the database directory for the server as a positional (unnamed)
parameter:

{{< tabs >}}
{{% tab name="bash" %}}
    arangod /path/to/datadir
{{% /tab %}}
{{< /tabs >}}

You can also be explicit by using a named parameter:

{{< tabs >}}
{{% tab name="bash" %}}
    arangod --database.directory /path/to/datadir
{{% /tab %}}
{{< /tabs >}}

All other startup options need to be passed as named parameters, using two
hyphens (`--`), followed by the option name, an equals sign (`=`) or a space,
and the option value. The value needs to be wrapped in double quote marks (`"`)
if the value contains whitespace characters. Extra whitespace around `=` is
allowed:

{{< tabs >}}
{{% tab name="bash" %}}
    arangod --database.directory = "/path with spaces/to/datadir"
{{% /tab %}}
{{< /tabs >}}

See [Configuration](../../administration/administration-configuration)
if you want to translate startup options set  to configuration files
and to learn more about startup options in general.

See
[Fetch Current Configuration Options](../../administration/administration-configuration#fetch-current-configuration-options)
if you want to query the `arangod` server for the current settings at runtime.

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangod" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangod" %}
