---
layout: default
description: ArangoDB Server Options
redirect_from:
  - programs-arangod-agency.html # 3.10 -> 3.10
  - programs-arangod-arangosearch.html # 3.10 -> 3.10
  - programs-arangod-audit.html # 3.10 -> 3.10
  - programs-arangod-backup.html # 3.10 -> 3.10
  - programs-arangod-cache.html # 3.10 -> 3.10
  - programs-arangod-cluster.html # 3.10 -> 3.10
  - programs-arangod-database.html # 3.10 -> 3.10
  - programs-arangod-encryption.html # 3.10 -> 3.10
  - programs-arangod-foxx.html # 3.10 -> 3.10
  - programs-arangod-general.html # 3.10 -> 3.10
  - programs-arangod-http.html # 3.10 -> 3.10
  - programs-arangod-javascript.html # 3.10 -> 3.10
  - programs-arangod-log.html # 3.10 -> 3.10
  - programs-arangod-network.html # 3.10 -> 3.10
  - programs-arangod-nonce.html # 3.10 -> 3.10
  - programs-arangod-pregel.html # 3.10 -> 3.10
  - programs-arangod-query.html # 3.10 -> 3.10
  - programs-arangod-random.html # 3.10 -> 3.10
  - programs-arangod-rclone.html # 3.10 -> 3.10
  - programs-arangod-replication.html # 3.10 -> 3.10
  - programs-arangod-server.html # 3.10 -> 3.10
  - programs-arangod-ssl.html # 3.10 -> 3.10
  - programs-arangod-tcp.html # 3.10 -> 3.10
  - programs-arangod-temp.html # 3.10 -> 3.10
  - programs-arangod-transaction.html # 3.10 -> 3.10
  - programs-arangod-ttl.html # 3.10 -> 3.10
  - programs-arangod-vst.html # 3.10 -> 3.10
  - programs-arangod-web-interface.html # 3.10 -> 3.10
---
ArangoDB Server Options
=======================

Usage: `arangod [<options>]`

To list the commonly used startup options with a description of each option, run
the server executable in a command-line with the `--help` (or `-h`) option:

    arangod --help

To list **all** available startup options and their descriptions, use:

    arangod --help-all

You can specify the database directory for the server as a positional (unnamed)
parameter:

    arangod /path/to/datadir

You can also be explicit by using a named parameter:

    arangod --database.directory /path/to/datadir

All other startup options need to be passed as named parameters, using two
hyphens (`--`), followed by the option name, an equals sign (`=`) or a space,
and the option value. The value needs to be wrapped in double quote marks (`"`)
if the value contains whitespace characters. Extra whitespace around `=` is
allowed:

    arangod --database.directory = "/path with spaces/to/datadir"

See [Configuration](administration-configuration.html)
if you want to translate startup options set  to configuration files
and to learn more about startup options in general.

See
[Fetch Current Configuration Options](administration-configuration.html#fetch-current-configuration-options)
if you want to query the `arangod` server for the current settings at runtime.

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangod" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangod" %}
