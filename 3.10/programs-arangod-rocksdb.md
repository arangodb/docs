---
layout: default
description: RocksDB is a highly configurable key-value store used to power ArangoDB's RocksDB storage engine
---
# ArangoDB Server RocksDB Options

RocksDB is a highly configurable key-value store used to power ArangoDB's RocksDB
storage engine. Most of the options on this page are pass-through options to the
underlying RocksDB instance, and only a few of its default settings are changed.

## Pass-through options

`--rocksdb.wal-directory`

Absolute path for the RocksDB WAL files. If left empty, this will use a
subdirectory `journals` inside the data directory.

### Write buffers

`--rocksdb.write-buffer-size`

The amount of data to build up in each in-memory buffer (backed by a log file)
before closing the buffer and queuing it to be flushed into standard storage.
Default: 64MiB. Larger values may improve performance, especially for bulk
loads.

`--rocksdb.max-write-buffer-number`

The maximum number of write buffers that built up in memory. If this number is
reached before the buffers can be flushed, writes will be slowed or stalled.
Default: 2.

`--rocksdb.total-write-buffer-size`

The total amount of data to build up in all in-memory buffers (backed by log
files). This option, together with the block cache size configuration option,
can be used to limit memory usage. If set to 0, the memory usage is not limited.

If set to a value larger than 0, this will cap memory usage for write buffers 
but may have an effect on performance. If there is more than 4GiB of RAM on the 
system, the default value is `(system RAM size - 2GiB) * 0.5`.

For systems with less RAM, the default values are:

- 512MiB for systems with between 1 and 4GiB of RAM.
- 256MiB for systems with less than 1GiB of RAM.

`--rocksdb.max-write-buffer-size-to-maintain`

The maximum size of immutable write buffers that build up in memory per column
family (larger values mean that more in-memory data can be used for transaction
conflict checking (`-1` = use automatic default value, `0` = do not keep
immutable flushed write buffers, which is the default and usually correct).

The default value `0` restores the memory usage pattern of ArangoDB v3.6.
This leads to the fact that RocksDB will not keep any flushed immutable
write-buffers in memory.

`--rocksdb.min-write-buffer-number-to-merge`

Minimum number of write buffers that will be merged together when flushing to
normal storage. Default: 1.

`--rocksdb.max-total-wal-size`

Maximum total size of WAL files that, when reached, will force a flush of all
column families whose data is backed by the oldest WAL files. Setting this
to a low value will trigger regular flushing of column family data from memtables, 
so that WAL files can be moved to the archive.
Setting this to a high value will avoid regular flushing but may prevent WAL
files from being moved to the archive and being removed.

`--rocksdb.delayed-write-rate`

Limited write rate to DB (in bytes per second) if we are writing to the last
in-memory buffer allowed and we allow more than 3 buffers. Default: 16MiB/s.

### LSM tree structure

`--rocksdb.num-levels`

The number of levels for the database in the LSM tree. Default: 7.

`--rocksdb.num-uncompressed-levels`

The number of levels that do not use compression. The default value is 2.
Levels above this number will use Snappy compression to reduce the disk
space requirements for storing data in these levels.

`--rocksdb.dynamic-level-bytes`

If true, the amount of data in each level of the LSM tree is determined
dynamically so as to minimize the space amplification; otherwise, the level
sizes are fixed. The dynamic sizing allows RocksDB to maintain a well-structured
LSM tree regardless of total data size. Default: true.

`--rocksdb.max-bytes-for-level-base`

The maximum total data size in bytes in level-1 of the LSM tree. Only effective
if `--rocksdb.dynamic-level-bytes` is false. Default: 256MiB.

`--rocksdb.max-bytes-for-level-multiplier`

The maximum total data size in bytes for level L of the LSM tree can be
calculated as `max-bytes-for-level-base * (max-bytes-for-level-multiplier ^
(L-1))`. Only effective if `--rocksdb.dynamic-level-bytes` is false. Default:
10.

`--rocksdb.level0-compaction-trigger`

Compaction of level-0 to level-1 is triggered when this many files exist in
level-0. Setting this to a higher number may help bulk writes at the expense of
slowing down reads. Default: 2.

`--rocksdb.level0-slowdown-trigger`

When this many files accumulate in level-0, writes will be slowed down to
`--rocksdb.delayed-write-rate` to allow compaction to catch up. Default: 20.

`--rocksdb.level0-stop-trigger`

When this many files accumulate in level-0, writes will be stopped to allow
compaction to catch up. Default: 36.

### File I/O

`--rocksdb.compaction-read-ahead-size`

If non-zero, we perform bigger reads when doing compaction. If you're  running
RocksDB on spinning disks, you should set this to at least 2MiB. That way
RocksDB's compaction is doing sequential instead of random reads. Default: 0.

`--rocksdb.use-direct-reads`

Only meaningful on Linux. If set, use `O_DIRECT` for reading files. Default:
false.

`--rocksdb.use-direct-io-for-flush-and-compaction`

Only meaningful on Linux. If set, use `O_DIRECT` for writing files. Default: false.

`--rocksdb.use-fsync`

If set, issue an `fsync` call when writing to disk (set to false to issue
`fdatasync` only. Default: false.

`--rocksdb.allow-fallocate`

Allow RocksDB to use the fallocate call. If false, fallocate calls are bypassed
and no preallocation is done. Preallocation is turned on by default, but can be
turned off for operating system versions that are known to have issues with it.
This option only has an effect on operating systems that support fallocate.

`--rocksdb.limit-open-files-at-startup`

If set to true, this will limit the amount of .sst files RocksDB will inspect at 
startup, which can reduce the number of IO operations performed at start.

`--rocksdb.block-align-data-blocks`

If true, data blocks are aligned on the lesser of page size and block size,
which may waste some memory but may reduce the number of cross-page I/O operations.

### Background tasks

<small>Introduced in: v3.9.3</small>

`--rocksdb.periodic-compaction-ttl`

TTL (in seconds) for periodic compaction of .sst files in RocksDB, based on
the .sst file age. The default value from RocksDB is ~30 days. To avoid
periodic auto-compaction and the I/O caused by it, the option can be set to `0`.

`--rocksdb.max-background-jobs`

Maximum number of concurrent background compaction jobs, submitted to the low
priority thread pool. Default: number of processors.

`--rocksdb.num-threads-priority-high`

Number of threads for high priority operations (e.g. flush). We recommend
setting this equal to `max-background-flushes`. Default: number of processors / 2.

`--rocksdb.num-threads-priority-low`

Number of threads for low priority operations (e.g. compaction).
Default: number of processors / 2.

### Caching

`--rocksdb.block-cache-size`

This is the maximum size of the block cache in bytes. Increasing this may improve
performance. If there is more than 4GiB of RAM on the system, the default value
is `(system RAM size - 2GiB) * 0.3`.

For systems with less RAM, the default values are:

- 512MiB for systems with between 2 and 4GiB of RAM.
- 256MiB for systems with between 1 and 2GiB of RAM.
- 128MiB for systems with less than 1GiB of RAM.

`--rocksdb.enforce-block-cache-size-limit`

Whether or not the maximum size of the RocksDB block cache is strictly enforced.
This option can be set to limit the memory usage of the block cache to at most the
specified size. If then inserting a data block into the cache would exceed the 
cache's capacity, the data block will not be inserted. If the flag is not set,
a data block may still get inserted into the cache. It is evicted later, but the
cache may temporarily grow beyond its capacity limit. 

The default value for `--rocksdb.enforce-block-cache-size-limit` was `false`
before ArangoDB 3.10, but was changed to `true` from ArangoDB 3.10 onwards.

To improve stability of memory usage and prevent exceeding the block cache capacity
limit (as configurable via `--rocksdb.block-cache-size`), it is recommended to set
this option to `true`.

`--rocksdb.cache-index-and-filter-blocks`

Setting this option to `true` makes RocksDB track all loaded index and filter blocks 
in the block cache, so they are accounted against RocksDB's block cache memory limit. 
Setting the option to `false` will lead to the memory usage for index and filter blocks
being unaccounted for.

The default value of `--rocksdb.cache-index-and-filter-blocks` was `false` in 
ArangoDB versions before 3.10, and was changed to `true` from ArangoDB 3.10 onwards.

To improve stability of memory usage and avoid untracked memory allocations by
RocksDB, it is recommended to set this option to `true`. Please note that tracking
index and filter blocks will leave less room for other data in the block cache, so
in case servers have unused RAM capacity available, it may be useful to increase the
overall size of the block cache.

`--rocksdb.block-cache-shard-bits`

The number of bits used to shard the block cache to allow concurrent operations.
To keep individual shards at a reasonable size (i.e. at least 512KB), keep this
value to at most `block-cache-shard-bits / 512KB`. Default: `block-cache-size /
2^19`.

`--rocksdb.table-block-size`

Approximate size of user data (in bytes) packed per block for uncompressed data.

`--rocksdb.recycle-log-file-num`

If true, keeps a pool of log files around for recycling them. The default
value is false.

### Miscellaneous

`--rocksdb.optimize-filters-for-hits`

This flag specifies that the implementation should optimize the filters mainly
for cases where keys are found rather than also optimize for the case where
keys are not. This would be used in cases where the application knows that
there are very few misses or the performance in the case of misses is not as
important. Default: false.

`--rocksdb.wal-recovery-skip-corrupted`

If true, skip corrupted records in WAL recovery. Default: false.

`-- rocksdb.transaction-lock-stripes`

<small>Introduced in: v3.9.2</small>

This option controls the number of lock stripes to use for RocksDB's transaction
lock manager. Higher values can be used to reduce a potential contention in the
lock manager. 
The option defaults to the number of available cores, but is increased to a
value of `16` if the number of cores is lower.

## Non-Pass-Through Options

### Write-ahead Log

<small>Introduced in: v3.10.0</small>

`--rocksdb.use-range-delete-in-wal`

Controls whether the collection truncate operation in the cluster can use 
RangeDelete operations in RocksDB. Using RangeDeletes is fast and reduces
the algorithmic complexity of the truncate operation to O(1), compared to
O(n) for when this option is turned off (with n being the number of
documents in the collection/shard).
Previous versions of ArangoDB used RangeDeletes only on a single server, but
never in a cluster. 

The default value for this startup option is `true`, and the option should
only be changed in case of emergency. This option is only honored in the
cluster. Single server and active failover deployments will use RangeDeletes
regardless of the value of this option.

Note that it is not guaranteed that all truncate operations will use a 
RangeDelete operation. For collections containing a low number of documents,
the O(n) truncate method may still be used.

`--rocksdb.wal-file-timeout`

Timeout after which unused WAL files are deleted (in seconds). Default: 10.0s.

Data of ongoing transactions is stored in RAM. Transactions that get too big
(in terms of number of operations involved or the total size of data created or
modified by the transaction) will be committed automatically. Effectively this
means that big user transactions are split into multiple smaller RocksDB
transactions that are committed individually. The entire user transaction will
not necessarily have ACID properties in this case.

The following options can be used to control the RAM usage and automatic
intermediate commits for the RocksDB engine:

`--rocksdb.wal-file-timeout-initial`

Timeout after which deletion of unused WAL files kicks in after server start
(in seconds). Default: 180.0s

By decreasing this option's value, the server will start the removal of obsolete
WAL files earlier after server start. This is useful in testing environments that
are space-restricted and do not require keeping much WAL file data at all.

`--rocksdb.wal-archive-size-limit`

Maximum total size (in bytes) of archived WAL files to keep on a leader.
A value of `0` will not restrict the size of the archive, so the leader will
removed archived WAL files when there are no replication clients needing them.
Any non-zero value will restrict the size of the WAL files archive to about the 
specified value and trigger WAL archive file deletion once the threshold is reached.
Please note that the value is only a threshold, so the archive may get bigger than 
the configured value until the background thread actually deletes files from
the archive. Also note that deletion from the archive will only kick in after
`--rocksdb.wal-file-timeout-initial` seconds have elapsed after server start.

The default value is `0` (i.e. unlimited).

When setting the value to a size bigger than 0, the RocksDB storage engine
will force a removal of archived WAL files if the total size of the archive
exceeds the configured size. The option can be used to get rid of archived
WAL files in a disk size-constrained environment.

Note that archived WAL files are normally deleted automatically after a 
short while when there is no follower attached that may read from the archive.
However, in case when there are followers attached that may read from the
archive, WAL files normally remain in the archive until their contents have 
been streamed to the followers. In case there are slow followers that cannot
catch up this will cause a growth of the WAL files archive over time. 

The option `--rocksdb.wal-archive-size-limit` can now be used to force a 
deletion of WAL files from the archive even if there are followers attached
that may want to read the archive. In case the option is set and a leader
deletes files from the archive that followers want to read, this will abort
the replication on the followers. Followers can however restart the replication
doing a resync.

`--rocksdb.sync-interval`

The interval (in milliseconds) that ArangoDB will use to automatically
synchronize data in RocksDB's write-ahead logs to disk. Automatic syncs will
only be performed for not-yet synchronized data, and only for operations that
have been executed without the *waitForSync* attribute.

Note: this option is not supported on Windows platforms. Setting the option to
a value greater 0 will produce a startup warning.

### Transactions

`--rocksdb.max-transaction-size`

Transaction size limit (in bytes). Transactions store all keys and values in
RAM, so large transactions run the risk of causing out-of-memory situations.
This setting allows you to ensure that does not happen by limiting the size of
any individual transaction. Transactions whose operations would consume more
RAM than this threshold value will abort automatically with error 32 ("resource
limit exceeded").

`--rocksdb.intermediate-commit-size`

If the size of all operations in a transaction reaches this threshold, the
transaction is committed automatically and a new transaction is started. The
value is specified in bytes.

`--rocksdb.intermediate-commit-count`

If the number of operations in a transaction reaches this value, the transaction
is committed automatically and a new transaction is started.

### Write Throttling

`--rocksdb.throttle`

If enabled, dynamically throttles the ingest rate of writes if necessary to reduce 
chances of compactions getting too far behind and blocking incoming writes. 
This option is `true` by default.

There are various options to control the throttling behavior in more detail:

`--rocksdb.throttle-frequency`

<small>Introduced in: v3.8.5</small>

Frequency for write-throttle calculations (in milliseconds). If the throttling is
enabled, it will recalculate a new maximum ingestion rate with this frequency.
The default value is 60000, i.e. every 60 seconds.

This option has no effect if throttling is turned off.

`--rocksdb.throttle-slots`

<small>Introduced in: v3.8.5</small>

If throttling is enabled, this parameter controls the number of previous intervals
to use for throttle value calculation. The default value is 63.

This option has no effect if throttling is turned off.

`--rocksdb.throttle-scaling-factor`

<small>Introduced in: v3.8.5</small>

Controls the adaptiveness scaling factor for write-throttle calculations. There 
is normally no need to change this value. The default value is 17.

This option has no effect if throttling is turned off.

`--rocksdb.throttle-slow-down-writes-trigger`

<small>Introduced in: v3.8.5</small>

Sets the number of level 0 files whose payload is not considered in throttle value
calculations when penalizing the presence of L0 files. There is normally no need to 
change this value.

This option has no effect if throttling is turned off.

`--rocksdb.throttle-max-write-rate`

<small>Introduced in: v3.8.5</small>

Controls the maximum write rate enforced by the throttle (in bytes per second).
The default value is 0, meaning "unlimited". The actual write rate estabilished by
the throttling will be the minimum of this value and the value that the regular
throttle calculation produces, i.e. this option can be used to set a fixed upper 
bound on the write rate.
This option has no effect if throttling is turned off.

### Exclusive Writes

`--rocksdb.exclusive-writes`

Allows to make all writes to the RocksDB storage exclusive and therefore avoids
write-write conflicts. This option was introduced to open a way to upgrade from
the legacy MMFiles to the RocksDB storage engine without modifying client
application code. Otherwise it should best be avoided as the use of exclusive
locks on collections will introduce a noticeable throughput penalty.

Note that the MMFiles engine was removed and that
this option is a stopgap measure only. This option is thus deprecated, and will
be removed in a future version.

The option has effect on single servers and on DB-Servers in the cluster.

### Debugging

`--rocksdb.use-file-logging`

When set to *true*, enables writing of RocksDB's own informational LOG files into 
RocksDB's database directory.

This option is turned off by default, but can be enabled for debugging RocksDB
internals and performance.

`--rocksdb.debug-logging`

When set to *true*, enables verbose logging of RocksDB's actions into the logfile
written by ArangoDB (if option `--rocksdb.use-file-logging` is off) or RocksDB's
own log (if option `--rocksdb.use-file-logging` is on).

This option is turned off by default, but can be enabled for debugging RocksDB
internals and performance.
