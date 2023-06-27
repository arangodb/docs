---
layout: default
description: >-
  You can create a backup and upgrade ArangoDB in-place, but downgrading
  is only possible with the backup or by dumping and restoring all data
---
# Upgrading

{{ page.description }}
{:class="lead"}

## Upgrade methods

There are two main ways to upgrade ArangoDB:

- **_In-Place_ upgrade**: when the installed ArangoDB package is replaced with a new
  one, and the new server executable is started on the existing data directory.

  The database files typically require to be upgraded when you upgrade to a
  consecutive release, for example, from 3.9 to 3.10. The database files cannot
  be downgraded again. Take a backup before upgrading if you want to be able to
  return to the old version of your data and ArangoDB.

- **_Logical_ upgrade**: when the data is exported from the old ArangoDB version
  using [_arangodump_](programs-arangodump.html) and then restored in
  the new ArangoDB version using [_arangorestore_](programs-arangorestore.html).

  Depending on the size of your database, this strategy can be more time consuming,
  but might be necessary under some circumstances.

## Before the upgrade

Before upgrading, it is recommended to:

- Check the [CHANGELOG](release-notes.html#changelogs) and the
  [list of incompatible changes](release-notes.html#incompatible-changes)
  for API or other changes in the new version of ArangoDB, and make sure your applications
  can deal with them.
- Check if any [technical alert](https://www.arangodb.com/alerts/){:target="_blank"}
  discourages the upgrade to the version you want to upgrade to.
- As an extra precaution, and as a requirement if you want to [downgrade](downgrading.html),
  you might want to:
  - **Take a backup** of the old ArangoDB database using [_arangodump_](programs-arangodump.html),
    as well as
  - Copy the entire "old" data directory to a safe place, after stopping the ArangoDB Server
    running on it (if you are running an Active Failover, or a Cluster, you will need to take
    a copy of their data directories, from all involved machines, after stopping all the running
    ArangoDB processes).
  - Keep a copy of all ArangoDB package files (executables, configuration files,
    bundled scripts, etc.) in case you want to return to the old version of
    ArangoDB.

## Upgrade paths

- It is always possible to upgrade to patch versions of the same
  general availability (GA) release, i.e from x.y.W to x.y.Z, where Z > W.

  Examples:
  - Upgrading from 3.9.0 to 3.9.1 or (directly to) 3.9.3 is supported.
  - Upgrading from 3.9.1 to 3.9.2 or (directly to) 3.9.3 is supported.

- It is possible to upgrade between two different consecutive GA releases, but it is
  not officially supported to upgrade if the two GA releases are not consecutive
  (in this case, you first have to upgrade to all intermediate releases).

  Examples:
  - Upgrading from 3.8 to 3.9 is supported.
  - Upgrading from 3.9 to 3.10 is supported.
  - Upgrading from 3.8 directly to 3.10 is not officially supported!
    The officially supported upgrade path in this case is 3.8 to 3.9, and then
    3.9 to 3.10.

  {% hint 'info' %}
  Before upgrading between two consecutive GA releases, it is highly recommended
  to first upgrade the previous GA release to its latest patch version.

  Examples:
  - To upgrade from 3.8 to 3.9, first upgrade your 3.8 installation to
    the latest 3.8 version, for example, from 3.8.2 to 3.8.9 and then to 3.9.x.
  - To upgrade from 3.9 to 3.10, first upgrade your 3.9 installation to
    the latest 3.9 version, for example, from 3.9.5 to 3.9.10 and then to 3.10.x.
  {% endhint %}

### Additional notes regarding rolling upgrades

In addition to the paragraph above, rolling upgrades via the tool _Starter_ are supported,
as documented in [Upgrading Starter Deployments](upgrading-starter.html).
