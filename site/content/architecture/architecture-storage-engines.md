---
fileID: architecture-storage-engines
title: Storage Engine
weight: 760
description: 
layout: default
---
At the very bottom of the ArangoDB database system lies the storage
engine. The storage engine is responsible for persisting the documents
on disk, holding copies in memory, providing indexes and caches to
speed up queries.

ArangoDB's storage engine is based on Facebook's **RocksDB** and the only
storage engine available in ArangoDB 3.7 and above.

## RocksDB

RocksDB is an embeddable persistent key-value store. It is a log
structure database and is optimized for fast storage.

The RocksDB engine is optimized for large data-sets and allows for a
steady insert performance even if the data-set is much larger than the
main memory. Indexes are always stored on disk but caches are used to
speed up performance. RocksDB uses document-level locks allowing for
concurrent writes. Writes do not block reads. Reads do not block writes.

### Advantages

RocksDB is a very flexible engine that can be configured for various use cases.

The main advantages of RocksDB are:

- document-level locks
- support for large data-sets
- persistent indexes

### Caveats

RocksDB allows concurrent writes. However, when touching the same document a
write conflict is raised. It is possible to exclusively lock collections when
executing AQL. This will avoid write conflicts but also inhibits concurrent
writes.

Currently, another restriction is due to the transaction handling in
RocksDB. Transactions are limited in total size. If you have a statement
modifying a lot of documents it is necessary to commit data in-between. This will
be done automatically for AQL by default. Transactions that get too big (in terms of
number of operations involved or the total size of data modified by the transaction)
will be committed automatically. Effectively this means that big user transactions
are split into multiple smaller RocksDB transactions that are committed individually.
The entire user transaction will not necessarily have ACID properties in this case.

The threshold values for transaction sizes can be configured globally using the
startup options

- [`--rocksdb.intermediate-commit-size`](../programs-tools/arangodb-server/programs-arangod-options#--rocksdbintermediate-commit-size)

- [`--rocksdb.intermediate-commit-count`](../programs-tools/arangodb-server/programs-arangod-options#--rocksdbintermediate-commit-count)

- [`--rocksdb.max-transaction-size`](../programs-tools/arangodb-server/programs-arangod-options#--rocksdbmax-transaction-size)

It is also possible to override these thresholds per transaction.

### Write-ahead log

Write-ahead logging is used for data recovery after a server crash and for
replication.

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
[RocksDB Configuration](../programs-tools/arangodb-server/programs-arangod-options#rocksdb)

### Performance

RocksDB is based on a log-structured merge tree. A good introduction can be
found in:

- [www.benstopford.com/2015/02/14/log-structured-merge-trees/](http://www.benstopford.com/2015/02/14/log-structured-merge-trees/)
- [blog.acolyer.org/2014/11/26/the-log-structured-merge-tree-lsm-tree/](https://blog.acolyer.org/2014/11/26/the-log-structured-merge-tree-lsm-tree/)

The basic idea is that data is organized in levels were each level is a factor
larger than the previous. New data will reside in smaller levels while old data
is moved down to the larger levels. This allows to support high rate of inserts
over an extended period. In principle it is possible that the different levels
reside on different storage media. The smaller ones on fast SSD, the larger ones
on bigger spinning disks.

RocksDB itself provides a lot of different knobs to fine tune the storage
engine according to your use-case. ArangoDB supports the most common ones
using the options below.

Performance reports for the storage engine can be found here:

- [github.com/facebook/rocksdb/wiki/performance-benchmarks](https://github.com/facebook/rocksdb/wiki/performance-benchmarks)
- [github.com/facebook/rocksdb/wiki/RocksDB-Tuning-Guide](https://github.com/facebook/rocksdb/wiki/RocksDB-Tuning-Guide)

### ArangoDB options

ArangoDB has a cache for the persistent indexes in RocksDB. The total size
of this cache is controlled by the option

    --cache.size

RocksDB also has a cache for the blocks stored on disk. The size of
this cache is controlled by the option

    --rocksdb.block-cache-size

ArangoDB distributes the available memory equally between the two
caches by default.

ArangoDB chooses a size for the various levels in RocksDB that is
suitable for general purpose applications.

RocksDB log strutured data levels have increasing size

    MEM: --
    L0:  --
    L1:  -- --
    L2:  -- -- -- --
    ...

New or updated Documents are first stored in memory. If this memtable
reaches the limit given by

    --rocksdb.write-buffer-size

it will converted to an SST file and inserted at level 0.

The following option controls the size of each level and the depth.

    --rocksdb.num-levels N

Limits the number of levels to N. By default it is 7 and there is
seldom a reason to change this. A new level is only opened if there is
too much data in the previous one.

    --rocksdb.max-bytes-for-level-base B

L0 will hold at most B bytes.

    --rocksdb.max-bytes-for-level-multiplier M

Each level is at most M times as much bytes as the previous
one. Therefore the maximum number of bytes-for-level L can be
calculated as

    max-bytes-for-level-base * (max-bytes-for-level-multiplier ^ (L-1))

### Future

RocksDB imposes a limit on the transaction size. It is optimized to
handle small transactions very efficiently, but is effectively limiting
the total size of transactions.

ArangoDB currently uses RocksDB's transactions to implement the ArangoDB
transaction handling. Therefore the same restrictions apply for ArangoDB
transactions when using the RocksDB engine.

We will improve this by introducing distributed transactions in a future
version of ArangoDB. This will allow handling large transactions as a
series of small RocksDB transactions and hence removing the size restriction.
