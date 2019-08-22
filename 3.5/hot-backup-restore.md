---
layout: default
description: Hot backup and restore associated operation can be performed via the arangobackup client tool.
title: ArangoDB Hot Backup and Restore Overview
---
Hot Backup and Restore
======================

Hot backup and restore associated operations can be performed with the
[_arangobackup_](programs-arangobackup.html) client tool.

Many operations cannot afford downtimes and thus require administrators and
operators to create consistent freezes of the data during normal operation.
Such use cases imply that near instantaneous hot backups must be
obtained in sync across say a cluster's deployment. For this purpose the
hot backup mechanism was created.
