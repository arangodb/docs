---
layout: default
description: Arangodump limitations in cluster and with MMFiles storage engine
title: Arangodump Limitations
---
Arangodump Limitations
======================

_Arangodump_ has the following limitations:

- In a cluster, _arangodump_ does not guarantee to dump a consistent snapshot
  if write operations happen while the dump is in progress (see
  [Hot Backups](backup-restore.html#hot-backups) for an alternative). It is
  therefore recommended not to  perform any data-modification operations on the
  cluster while _arangodump_ is running. This is in contrast to what happens on
  a single instance, a Leader/Follower, or active failover setup, where even if
  write operations are ongoing, the created dump is consistent, as a snapshot
  is taken when the dump starts.
<!-- TOOD Remove when 3.6 reaches EoL -->
- If the MMFiles engine is in use, on a single instance, a Leader/Follower, or
  active failover setup, even if the write operations are suspended, it is not
  guaranteed that the dump includes all the data that has been previously
  written as _arangodump_ will only dump the data included in the _datafiles_
  but not the data that has not been transferred from the _WAL_ to the
  _datafiles_. A WAL flush can be forced however.
