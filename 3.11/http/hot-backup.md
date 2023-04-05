---
layout: default
description: >-
  The HTTP API for Hot Backups lets you manage incremental, zero-downtime data
  backups
---
# HTTP interface for Hot Backups

{{ page.description }}
{:class="lead"}

{% include hint-ee.md feature="Hot Backup" %}

Hot Backups are near instantaneous consistent snapshots of an
**entire** ArangoDB deployment. This includes all databases, collections,
indexes, View definitions, and users at any given time.

For creations a label may be specified, which if omitted
is replaced with a generated UUID. This label is then combined with a
timestamp to generate an identifier for the created
hot backup. Subsequently, all other APIs operate on these identifiers.

{% hint 'warning' %}
Make sure to understand all aspects of [Hot Backups](../backup-restore.html#hot-backups),
most of all the [requirements and limitations](../backup-restore.html#hot-backup-limitations),
before using the API.
{% endhint %}

{% docublock post_admin_backup_create, h2 %}
{% docublock post_admin_backup_restore, h2 %}
{% docublock post_admin_backup_delete, h2 %}
{% docublock post_admin_backup_list, h2 %}
{% docublock post_admin_backup_upload, h2 %}
{% docublock post_admin_backup_download, h2 %}
