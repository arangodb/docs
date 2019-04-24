---
layout: default
description: Since ArangoDB 2
---
Write-ahead log options
=======================

Since ArangoDB 2.2, the server will write all data-modification operations into its
write-ahead log.

The write-ahead log is a sequence of logfiles that are written in an append-only
fashion. Full logfiles will eventually be garbage-collected, and the relevant data
might be transferred into collection journals and datafiles. Unneeded and already
garbage-collected logfiles will either be deleted or kept for the purpose of keeping
a replication backlog.

### Directory
<!-- arangod/Wal/LogfileManager.h -->
{% docublock WalLogfileDirectory %}

### Logfile size
<!-- arangod/Wal/LogfileManager.h -->
{% docublock WalLogfileSize %}

### Allow oversize entries
<!-- arangod/Wal/LogfileManager.h -->
{% docublock WalLogfileAllowOversizeEntries %}

### Suppress shape information
<!-- arangod/Wal/LogfileManager.h -->
{% docublock WalLogfileSuppressShapeInformation %}

### Number of reserve logfiles
<!-- arangod/Wal/LogfileManager.h -->
{% docublock WalLogfileReserveLogfiles %}

### Number of historic logfiles
<!-- arangod/Wal/LogfileManager.h -->
{% docublock WalLogfileHistoricLogfiles %}

### Sync interval
<!-- arangod/Wal/LogfileManager.h -->
{% docublock WalLogfileSyncInterval %}

### Throttling
<!-- arangod/Wal/LogfileManager.h -->
{% docublock WalLogfileThrottling %}

### Number of slots
<!-- arangod/Wal/LogfileManager.h -->
{% docublock WalLogfileSlots %}

### Ignore logfile errors
<!-- arangod/Wal/LogfileManager.h -->
{% docublock WalLogfileIgnoreLogfileErrors %}

### Ignore recovery errors
<!-- arangod/Wal/LogfileManager.h -->
{% docublock WalLogfileIgnoreRecoveryErrors %}

### Ignore (non-WAL) datafile errors
<!-- arangod/RestServer/ArangoServer.h -->
{% docublock databaseIgnoreDatafileErrors %}

