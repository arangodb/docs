---
layout: default
description: Quick guides about backups in ArangoDB Oasis
title: Backups in Oasis
---
# Backups in Oasis

## How to create backups

To backup data in Oasis for an ArangoDB installation, navigate to the
**Backups** section of your deployment created previously.

![Backup ArangoDB](images/oasis-backup-section.png)

There are two ways to create backups. Create periodic backups using a
**Backup policy**, or create a backup manually.

### Periodic backups

Periodic backups are created at a given schedule. To see when the new backup is
due, observe the schedule section.

![Backup Policy schedule](images/oasis-backup-policy-schedule.png)

When a new deployment is created, a default **Backup policy** is created for it
as well. This policy will create backups every two hours. To edit this policy
(or any policy), highlight it in the row above and hit the pencil icon.

![Edit Backup Policy](images/oasis-edit-backup-policy.png)

These backups are not automatically uploaded.

### Manual backups

It's also possible to create a backup on demand. To do this, click **Back up now**.

![Back up Now](images/oasis-back-up-now.png)

![Back up Now Dialog](images/oasis-back-up-now-dialog.png)

### Uploading backups

By default a backup is not uploaded to the cloud, instead it remains on the
servers of the deployment. To make a backup that is resilient against server
(disk) failures, upload the backup to cloud storage. Uploaded backups are
required for [cloning](#how-to-clone-deployments-using-backups).

## How to restore backups

To restore a database from a backup, highlight the desired backup and click the restore icon.

{% hint 'warning' %}
All current data will be lost when restoring.
During restore the deployment is temporarily not available.
{% endhint %}

![Restore From Backup](images/oasis-restore-from-backup.png)

![Restore From Backup Dialog](images/oasis-restore-from-backup-dialog.png)

![Restore From Backup Status Pending](images/oasis-restore-from-backup-status-pending.png)

![Restore From Backup Status Restored](images/oasis-restore-from-backup-status-restored.png)

## How to clone deployments using backups

{% hint 'info' %}
The cloned deployment will have the exact same features as the previous
deployment including node size, model, cloud provider & region. The data
contained in the backup will be restored to this new deployment.

The *root password* for this deployment will be different.
{% endhint %}

1. Highlight the backup you wish to clone from and hit **Clone backup to new deployment**

   ![Oasis Clone Deployment From Backup](images/oasis-clone-deployment-from-backup.png)

2. The view should navigate to the new deployment being bootstrapped

   ![Oasis Cloned Deployment](images/oasis-cloned-deployment.png)

This feature is also available through [oasisctl](oasisctl.html).
