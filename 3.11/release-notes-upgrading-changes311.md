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

### `--database.force-sync-properties` deprecated

The `--database.force-sync-properties` option was useful with the MMFiles
storage engine, which has been removed in v3.7. The option does not have any
useful effect if you use the RocksDB storage engine. From v3.11.0 onwards, it
has no effect at all, is deprecated, and will be removed in a future version.

## Client tools

### arangoexport

The default output file type produced by arangoexport, controlled by the `--type`
startup option, has been changed from `json` to `jsonl`.
This allows for more efficient processing of the files produced by arangoexport
with other tools, such as arangoimport, by default.
