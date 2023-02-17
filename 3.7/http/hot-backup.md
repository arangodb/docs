---
layout: default
description: This is an introduction to ArangoDB's HTTP interface for hot backup and restore
title: Hot Backup HTTP API
---
HTTP Interface for Hot Backup and Restore
=========================================

<small>Introduced in: v3.5.1</small>

This is an introduction to ArangoDB's HTTP interface for hot backup and restore.

{% include hint-ee.md feature="Hot Backup" %}

Hot Backups
===========

Hot backups are near instantaneous consistent snapshots of an
**entire** ArangoDB service. This includes all databases, collections,
indexes, view definitions and users at any given time. 

For creations a label may be specified, which if omitted
is replaced with a generated UUID. This label is then combined with a
timestamp to generate an identifier for the created
hot backup. Subsequently, all other APIs operate on these identifiers.

The below APIs exclusively handle POST actions.

{% hint 'warning' %}
Make sure to understand all aspects of [hot backups](../backup-restore.html#hot-backups),
most of all the [requirements and limitations](../backup-restore.html#hot-backup-limitations),
before using the API.
{% endhint %}

{% docublock post_admin_backup_create %}

{% docublock post_admin_backup_restore %}

{% docublock post_admin_backup_delete %}

{% docublock post_admin_backup_list %}

{% docublock post_admin_backup_upload %}

{% docublock post_admin_backup_download %}
