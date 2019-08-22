---
layout: default
description: This is an introduction to ArangoDB's HTTP interface for hot backup and restore
---
HTTP Interface for hot backup and restore
=========================================

This is an introduction to ArangoDB's HTTP interface for hot backup and restore.

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
most of all the [requirements and limitations](../programs-arangobackup-limitations.html), 
before using the API.
{% endhint %}

Create
------

{% docublock post_admin_backup_create %}

Restore
-------

{% docublock post_admin_backup_restore %}

Delete
------

{% docublock post_admin_backup_delete %}

List
----

{% docublock post_admin_backup_list %}

Upload
------

{% docublock post_admin_backup_upload %}

Download
--------

{% docublock post_admin_backup_download %}


