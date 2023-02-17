---
layout: default
description: Write ahead logging is used for data recovery after a server crash and for replication
---
Write-ahead log
===============

ArangoDB's RocksDB storage engine stores all data-modification operation in a
write-ahead log (WAL). The WAL is sequence of append-only files containing
all the write operations that were executed on the server.
It is used to run data recovery after a server crash, and can also be used in
a replication setup when Followers need to replay the same sequence of operations as
on the Leader.

The individual RocksDB WAL files are per default about 64 MiB big.
The size will always be proportionally sized to the value specified via
`--rocksdb.write-buffer-size`. The value specifies the amount of data to build
up in memory (backed by the unsorted WAL on disk) before converting it to a
sorted on-disk file.

Larger values can increase performance, especially during bulk loads.
Up to `--rocksdb.max-write-buffer-number` write buffers may be held in memory
at the same time, so you may wish to adjust this parameter to control memory
usage. A larger write buffer will result in a longer recovery time  the next
time the database is opened.

The RocksDB WAL only contains committed transactions. This means you will never
see partial transactions in the replication log, but it also means transactions
are tracked completely in-memory. In practice this causes RocksDB transaction
sizes to be limited, for more information see the
[RocksDB Configuration](programs-arangod-rocksdb.html)
