---
fileID: programs-arangorestore
title: _arangorestore_
weight: 485
description: 
layout: default
---
_arangorestore_ is a command-line client tool to restore backups created by
[_arangodump_](../arangodump/) to
[ArangoDB servers](../arangodb-server/).

If you want to import data in formats like JSON or CSV, see
[_arangoimport_](../arangoimport/) instead.

_arangorestore_ can restore selected collections or all collections of a backup,
optionally including _system_ collections. One can restore the structure, i.e.
the collections with their configuration with or without data.
Views can also be dumped or restored (either all of them or selectively).

{{% hints/tip %}}
In order to speed up the _arangorestore_ performance in a Cluster environment,
the [Fast Cluster Restore](programs-arangorestore-fast-cluster-restore)
procedure is recommended.
{{% /hints/tip %}}
