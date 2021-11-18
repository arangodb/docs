---
layout: default
description: ArangoDB v3.10 Release Notes New Features
---
Features and Improvements in ArangoDB 3.10
==========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.10. ArangoDB 3.10 also contains several bug fixes that are not listed
here.

ArangoSearch
------------



UI
--



AQL
---



Server options
--------------



Miscellaneous changes
---------------------



Client tools
------------


### arangobench

Histogram is now switched off by default (the `--histogram.generate` flag set to false). To display it, set the flag to true.
If this option is disabled, but other histogram flags are addressed, e.g. `--histogram.interval-size 500`, everything will still run normally, but a warning message will be displayed saying that the histogram is switched off and using that flag has no effect.


Internal changes
----------------

### Upgraded bundled RocksDB library version

The bundled version of the RocksDB library has been upgraded from 6.8 to 6.26.
