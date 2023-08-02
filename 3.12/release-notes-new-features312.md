---
layout: default
description: ArangoDB v3.12 Release Notes New Features
---
# Features and Improvements in ArangoDB 3.12

The following list shows in detail which features have been added or improved in
ArangoDB 3.12. ArangoDB 3.12 also contains several bug fixes that are not listed
here.

## ArangoSearch



## Analyzers



## Web interface

### Shard rebalancing

The feature for rebalancing shards in cluster deployments has been moved from
the **Rebalance Shards** tab in the **NODES** section to the **Distribution**
tab in the **CLUSTER** section of the web interface.

The updated interface now offers the following options:
- **Move Leaders**
- **Move Followers**
- **Include System Collections**

## AQL



## Server options

### LZ4 compression for values in the in-memory edge cache

<small>Introduced in: v3.11.2, 3.12.0</small>

LZ4 compression of edge index cache values allows to store more data in main
memory than without compression, so the available memory can be used more
efficiently. The compression is transparent and does not require any change to
queries or applications.
The compression can add CPU overhead for compressing values when storing them
in the cache, and for decompressing values when fetching them from the cache.

The new startup option `--cache.min-value-size-for-edge-compression` can be
used to set a threshold value size for compression edge index cache payload
values. The default value is `1GB`, which effectively turns compression
off. Setting the option to a lower value (i.e. `100`) turns on the
compression for any payloads whose size exceeds this value.
  
The new startup option `--cache.acceleration-factor-for-edge-compression` can
be used to fine-tune the compression. The default value is `1`.
Higher values typically mean less compression but faster speeds.

The following new metrics can be used to determine the usefulness of
compression:
  
- `rocksdb_cache_edge_effective_entries_size`: returns the total number of
  bytes of all entries that were stored in the in-memory edge cache, after
  compression was attempted/applied. This metric is populated regardless
  of whether compression is used or not.
- `rocksdb_cache_edge_uncompressed_entries_size`: returns the total number
  of bytes of all entries that were ever stored in the in-memory edge cache,
  before compression was applied. This metric is populated regardless of
  whether compression is used or not.
- `rocksdb_cache_edge_compression_ratio`: returns the effective
  compression ratio for all edge cache entries ever stored in the cache.

Note that these metrics are increased upon every insertion into the edge
cache, but not decreased when data gets evicted from the cache.

### Limit the number of databases in a deployment

<small>Introduced in: v3.10.10, 3.11.2, 3.12.0</small>

The `--database.max-databases` startup option allows you to limit the
number of databases that can exist in parallel in a deployment. You can use this
option to limit the resources used by database objects. If the option is used
and there are already as many databases as configured by this option, any
attempt to create an additional database fails with error
`32` (`ERROR_RESOURCE_LIMIT`). Additional databases can then only be created
if other databases are dropped first. The default value for this option is
unlimited, so an arbitrary amount of databases can be created.

### RocksDB .sst file partitioning (experimental)

The following experimental startup options for RockDB .sst file partitioning
have been added:

- `--rocksdb.partition-files-for-documents`
- `--rocksdb.partition-files-for-primary-index`
- `--rocksdb.partition-files-for-edge-index`
- `--rocksdb.partition-files-for-persistent-index`

Enabling any of these options makes RocksDB's compaction write the 
data for different collections/shards/indexes into different .sst files. 
Otherwise, the document data from different collections/shards/indexes 
can be mixed and written into the same .sst files.

When these options are enabled, the RocksDB compaction is more efficient since
a lot of different collections/shards/indexes are written to in parallel.
The disavantage of enabling these options is that there can be more .sst
files than when the option is turned off, and the disk space used by
these .sst files can be higher.
In particular, on deployments with many collections/shards/indexes
this can lead to a very high number of .sst files, with the potential
of outgrowing the maximum number of file descriptors the ArangoDB process 
can open. Thus, these options should only be enabled on deployments with a
limited number of collections/shards/indexes.

## Internal changes

