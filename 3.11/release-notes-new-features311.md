---
layout: default
description: ArangoDB v3.11 Release Notes New Features
---
Features and Improvements in ArangoDB 3.11
==========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.11. ArangoDB 3.11 also contains several bug fixes that are not listed
here.

Server options
--------------

The new `--rocksdb.verify-sst` startup option lets you validate the SST files
currently contained in the database directory on startup. If set to `true`,
on startup, all SST files in the `engine-rocksdb` folder in the database
directory are validated, then the process finishes execution.
The default value is `false`.
