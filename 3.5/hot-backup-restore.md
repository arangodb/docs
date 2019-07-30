---
layout: default
description: Backup and restore associated operation can be performed via the arangobackup client tool.
title: ArangoDB Backup and Restore Overview
---
Backup and Restore
==================

Backup and restore associated operations can be performed with the
[_arangobackup_](programs-arangobackup.html) client tool.

Many operations cannot afford downtimes and thus require administrators and
operators to create consistent freezes of the data during normal operation.
Such use cases imply that near instantaneous backups must be obtained in sync
across say a cluster's deployment. For this purpose the backup mechanism
was created.
