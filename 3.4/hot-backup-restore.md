---
layout: default
description: Hot backup and restore and associated operation may be performed via the tool arangobackup.
title: ArangoDB Hot Backup and Restore Overview
---
Hot Backup and Restore
======================

Hot backup and restore and associated operations may be performed tool
[_arangobackup_](programs-arangobackup.html).

Many operations cannot afford downtimes and thus require administrators and
operators to create consistent freezes of the data during normal operation.
Such use cases imply that near instantaneous backups must be obtained in sync
across say a cluster's deployment. For this purpose the hot backup mechanism
was created.

In the following the ArangoDB hot backup feature is explained in some detail.
It is important to understand the technology as best as possible in order to
conclude which operations it might or might not be suited for.

{% hint 'warning' %}
Please review the [requirements and limitations](hot-backup-restore-limitations.html) of hot backups, specifically
regarding storage engine, deployment, scope and storage space.
{% endhint %}
