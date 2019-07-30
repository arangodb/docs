---
layout: default
description: How to retrieve a list of restorable backups with the arangobackup tool.
title: List All Available Backups
---
List All Backups
================

One may hold a multitude of backups. Those would all be available
to restore from. In order to get a listing of such backups, one
may use the `list` command.

```bash 
arangobackup list
```

The output lists all available backups:

```bash
2019-05-15T15:28:17Z [16224] INFO {backup} Server version: 3.5.1
2019-05-15T15:28:17Z [16224] INFO {backup} The following backups are available:
2019-05-15T15:28:17Z [16224] INFO {backup}  - 2019-05-15T13.57.11Z_my-label
2019-05-15T15:28:17Z [16224] INFO {backup}  - 2019-05-15T13.57.03Z-other-label
```
