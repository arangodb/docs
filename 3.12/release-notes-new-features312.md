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

## Internal changes

