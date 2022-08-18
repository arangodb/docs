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

Added a `DATE_ISOWEEKYEAR()` function that returns the ISO week year number,
like `DATE_ISOWEEK()` does, but also the year it belongs to:

```aql
RETURN DATE_ISOWEEKYEAR("2023-01-01") // { "week": 52, "year": 2022 }
```

See [AQL Date functions](aql/functions-date.html#date_isoweekyear) for details.
