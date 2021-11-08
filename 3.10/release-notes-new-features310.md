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

Histogram displaying is now switched off by default. For displaying it, the new
flag `--histogram.generate` must be set to true. Its default value is false for 
compatibility with other versions and also for complying with the histogram not 
being displayed by default. If this flag is not set to true, but other 
histogram flags are addressed, e.g. `--histogram.interval-size 500`, everything
will still run normally, but a warning message will be displayed saying that 
the histogram is switched off and setting this flag would not be of use.


Internal changes
----------------


