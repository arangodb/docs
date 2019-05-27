---
layout: default
description: delete inividual hot backups 
---
Delete individual hot backups
=============================

Hot backup, analogous to virtual machine snapshots, cause additional
disk usage. With every hot backup a consitent state in time is
frozen. Later changes will then have to hold a difference to older
backups. Compactions no longer can cover events before the last hot
backup. Naturally, one may want to be able to free disk space, once
backups become obsolete. 

```bash
arangobackup delete --server.username root --identifier <identifier>
```

The result of the operation is thus delivered:

```
2019-05-15T15:34:34Z [16257] INFO {backup} Server version: 3.4.5
2019-05-15T15:34:34Z [16257] INFO {backup} Successfully deleted '2019-05-15T13.57.03Z'
```
