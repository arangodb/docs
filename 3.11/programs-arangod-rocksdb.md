---
layout: default
description: RocksDB is a highly configurable key-value store used to power ArangoDB's RocksDB storage engine
---
# ArangoDB Server RocksDB Options

RocksDB is a highly configurable key-value store used to power ArangoDB's RocksDB
storage engine. Most of the options on this page are pass-through options to the
underlying RocksDB instance, and only a few of its default settings are changed.

### Validation

<small>Introduced in: v3.11.0</small>

`--rocksdb.verify-sst`

This flag specifies whether or not to validate the SST files present in the 
database directory provided on startup. The default value is `false`.

If set to true, during startup, all SST files in the `engine-rocksdb` folder in
the database directory are checked for potential corruption and errors.
The server process stops after the check and returns an exit code of `0` if the
validation was successful, or a non-zero exit code if there is an error in any
of the SST files.
