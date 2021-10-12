---
layout: default
description: There are two main ways to upgrade ArangoDB
---
General Upgrade Information
===========================

Upgrade Methods
---------------

There are two main ways to upgrade ArangoDB:

- _In-Place_ upgrade: when the installed ArangoDB package is replaced with the new one, and
  the new ArangoDB binary is started on the existing data directory.
- _Logical_ upgrade: when the data is exported from the old ArangoDB version,
  using [_arangodump_ ](programs-arangodump.html) and then restored in
  the new ArangoDB version using [_arangorestore_ ](programs-arangorestore.html).
  Depending on the size of your database, this strategy can be more time consuming,
  but needed in some circumstances.

Before the Upgrade
------------------

Before upgrading, it is recommended to:

- Check the [CHANGELOG](release-notes.html#changelogs) and the
  [list of incompatible changes](release-notes.html#incompatible-changes)
  for API or other changes in the new version of ArangoDB, and make sure your applications
  can deal with them.
- Check if any [technical alert](https://www.arangodb.com/alerts/){:target="_blank"}
  discourages the upgrade to the version you want to upgrade to.
- As an extra precaution, and as a requirement if you want to [downgrade](downgrading.html),
  you might want to:
  - Take a backup of the old ArangoDB database, using [Arangodump](programs-arangodump.html),
    as well as
  - Copy the entire "old" data directory to a safe place, after stopping the ArangoDB Server
    running on it (if you are running an Active Failover, or a Cluster, you will need to take
    a copy of their data directories, from all involved machines, after stopping all the running
    ArangoDB processes).

Upgrade Paths
-------------

- It is always possible to upgrade between hot-fixes of the same GA release, i.e
  from X.Y.w to X.Y.z, where z>w.
  - Examples:
    - Upgrading from 3.6.0 to 3.6.1 or (directly to) 3.6.15 is supported.
    - Upgrading from 3.7.7 to 3.7.8 or (directly to) 3.7.13 is supported.
- It is possible to upgrade between two different consecutive GA releases, but it is
  not officially supported to upgrade if the two GA releases are not consecutive
  (in this case, you first have to upgrade to all intermediate releases).
  - Examples:
    - Upgrading from 3.6 to 3.7 is supported.
    - Upgrading from 3.7 to 3.8 is supported.
    - Upgrading from 3.6 to 3.8 directly is not officially supported!
      The officially supported upgrade path in this case is 3.6 to 3.7, and then
      3.7 to 3.8.
  - **Important:** before upgrading between two consecutive GA releases it is highly
    recommended to first upgrade the previous GA release to its latest hot-fix version.
    - Examples:
      - To upgrade from 3.6 to 3.7, first upgrade your 3.6 installation to
        the latest 3.6 version.
      - To upgrade from 3.7 to 3.8, first upgrade your 3.7 installation to
        the latest 3.7 version.

### Additional Notes Regarding Rolling Upgrades

In addition to the paragraph above, rolling upgrades via the tool _Starter_ are supported,
as documented in the _Section_ [Upgrading Starter Deployments](upgrading-starter.html).
