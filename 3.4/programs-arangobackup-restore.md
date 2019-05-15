---
layout: default
description: create hot backups 
---
Restore to a hot backup
=======================

Hot backups are created near instantaneously. The single server as
well as other deployment modes try to obtain a global transaction lock
to enforce consistency across all servers, databases, collections
etc. Once that lock could be acquired the backup itself is most
readily described as a consistent snapshot and as instantaneous as the
quickest operation on the local file system.

```bash
arangobackup create --server.username root
Please specify a password: 
2019-05-15T13:57:11Z [15213] INFO {backup} Server version: 3.4.5
2019-05-15T13:57:11Z [15213] INFO {backup} Backup succeeded. Generated
identifier '2019-05-15T13.57.11Z'
```

lorem ipsum
