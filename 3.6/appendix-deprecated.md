---
layout: default
description: Features listed in this section should no longer be used, because they are considered obsolete and may get removed in a future release
title: Deprecated Features
---
Deprecated
==========

Features listed in this section should no longer be used, because they are
considered obsolete and may get removed in a future release. They are currently
kept for backward compatibility. There are usually better alternatives to
replace the old features with:

- **MMFiles Storage Engine**:
  The MMFiles storage engine is deprecated starting with version
  3.6.0 and it will be removed in a future release.
  To change your MMFiles storage engine deployment to RocksDB, see:
  [Switch storage engine](administration-engine-switch-engine.html)

  We recommend to switch to RocksDB even before the removal of MMFiles.
  RocksDB is the default [storage engine](architecture-storage-engines.html)
  since v3.4.0.

  Once the MMFiles engine is removed, all MMFiles specific startup options will
  also be removed. This will affect the following options:

  - `--compaction.*`
  - `--database.force-sync-properties`
  - `--database.index-threads`
  - `--database.maximal-journal-size`
  - `--database.throw-collection-not-loaded-error`
  - `--wal.*`

  The collection attributes `doCompact`, `indexBuckets`, `isVolatile`,
  `journalSize` and `path` are only used with MMFiles and are thus also
  deprecated.

- **Simple Queries**: Idiomatic interface in arangosh to perform trivial queries.
  They are superseded by [AQL queries](aql/index.html), which can also
  be run in arangosh. AQL is a language on its own and way more powerful than
  *Simple Queries* could ever be. In fact, the (still supported) *Simple Queries*
  are translated internally to AQL, then the AQL query is optimized and run
  against the database in recent versions, because of better performance and
  reduced maintenance complexity.

- **Actions**: Snippets of JavaScript code on the server-side for minimal
  custom endpoints. Since the Foxx revamp in 3.0, it became really easy to
  write [Foxx Microservices](foxx.html), which allow you to define
  custom endpoints even with complex business logic.

  From v3.5.0 on, the system collections `_routing` and `_modules` are not
  created anymore when the `_system` database is first created (blank new data
  folder). They are not actively removed, they remain on upgrade or backup
  restoration from previous versions.
