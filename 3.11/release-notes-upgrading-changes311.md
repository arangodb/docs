---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.11
---
# Incompatible changes in ArangoDB 3.11

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.11, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.11:

## Restriction of indexable fields

It is now forbidden to create indexes that cover fields whose attribute names
start or end with `:` , for example, `fields: ["value:"]`. This notation is
reserved for internal use.

Existing indexes are not affected but you cannot create new indexes with a
preceding or trailing colon.

## Startup options

### `--server.disable-authentication` and `--server.disable-authentication-unix-sockets` obsoleted

The `--server.disable-authentication` and `--server.disable-authentication-unix-sockets`
startup options are now obsolete. Specifying them is still tolerated but has
no effect anymore. These options were deprecated in v3.0 and mapped to
`--server.authentication` and  `--server.authentication-unix-sockets`, which
made them do the opposite of what their names suggest.

### `--database.force-sync-properties` deprecated

The `--database.force-sync-properties` option was useful with the MMFiles
storage engine, which has been removed in v3.7. The option does not have any
useful effect if you use the RocksDB storage engine. From v3.11.0 onwards, it
has no effect at all, is deprecated, and will be removed in a future version.

### `--agency.pool-size` deprecated

The `--agency.pool-size` option was effectively not properly supported in any
version of ArangoDB. Setting the option to anything but the value of
`--agency.size` should be avoided.

From v3.11.0 onwards, this option is deprecated, and setting it to a value
different than the value of `--agency.size` leads to a startup error.

## Client tools

### arangoexport

The default output file type produced by arangoexport, controlled by the `--type`
startup option, has been changed from `json` to `jsonl`.
This allows for more efficient processing of the files produced by arangoexport
with other tools, such as arangoimport, by default.
