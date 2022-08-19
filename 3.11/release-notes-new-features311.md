---
layout: default
description: ArangoDB v3.11 Release Notes New Features
---
Features and Improvements in ArangoDB 3.11
==========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.11. ArangoDB 3.11 also contains several bug fixes that are not listed
here.

AQL
---

### Added AQL functions

Added the `DATE_ISOWEEKYEAR()` function that returns the ISO week number,
like `DATE_ISOWEEK()` does, but also the year it belongs to:

```aql
RETURN DATE_ISOWEEKYEAR("2023-01-01") // { "week": 52, "year": 2022 }
```

See [AQL Date functions](aql/functions-date.html#date_isoweekyear) for details.

Server options
--------------

The new `--rocksdb.verify-sst` startup option lets you validate the SST files
currently contained in the database directory on startup. If set to `true`,
on startup, all SST files in the `engine-rocksdb` folder in the database
directory are validated, then the process finishes execution.
The default value is `false`.
