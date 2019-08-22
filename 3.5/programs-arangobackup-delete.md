---
layout: default
description: How to remove hot backups with the arangobackup tool.
title: Delete Individual Hot Backups in ArangoDB
---
Delete Individual Hot Backups
=============================

Hot backups, analogous to virtual machine snapshots, cause additional
disk usage. With every hot backup a consistent state in time is
frozen. Later changes will then have to hold a difference to older
hot backups. Compactions can no longer cover events before the last
hot backup. Naturally, one may want to be able to free disk space, once
hot backups become obsolete. 

```bash
arangobackup delete --server.username root --identifier <identifier>
```

The result of the operation is thus delivered:

```
2019-05-15T15:34:34Z [16257] INFO {backup} Server version: 3.5.1
2019-05-15T15:34:34Z [16257] INFO {backup} Successfully deleted '2019-05-15T13.57.03Z'
```
