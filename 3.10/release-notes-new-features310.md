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

### Rebalance shards

The rebalance shards section displays a button for rebalancing shards. A new DB-Server will not have any shards. With the rebalance functionality the cluster will start to rebalance shards including empty DB-Servers. The maximum number of shards that can be 
moved in each operation is given by the flag `--cluster.max-number-of-move-shards` in arangod (default value is 10).
When the button is clicked, the number of scheduled move shards operations is displayed, or it is displayed that 
no move operations have been scheduled if they are not necessary.


AQL
---



Server options
--------------

### Rebalance shards

There's a flag `--cluster.max-number-of-move-shards` that limits the maximum number of move shards operations that can be made when the button "Rebalance Shards" is clicked in the web UI. The default value is 10, for backwards compatibility. If its value is 0, then the tab that contains the button "Rebalance Shards" would not be clickable, hence, the button would not be displayed.
F


Miscellaneous changes
---------------------



Client tools
------------



Internal changes
----------------


