---
layout: default
description: arangorestore is a command-line client tool to restore backups created by arangodump toArangoDB servers
---
# _arangorestore_

_arangorestore_ is a command-line client tool to restore backups created by
[_arangodump_](programs-arangodump.html) to
[ArangoDB servers](programs-arangod.html).

If you want to import data in formats like JSON or CSV, see
[_arangoimport_](programs-arangoimport.html) instead.

_arangorestore_ can restore selected collections or all collections of a backup,
optionally including _system_ collections. One can restore the structure, i.e.
the collections with their configuration with or without data.
Views can also be dumped or restored (either all of them or selectively).
