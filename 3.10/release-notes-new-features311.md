---
layout: default
description: ArangoDB v3.11 Release Notes New Features
---
Features and Improvements in ArangoDB 3.11
==========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.11. ArangoDB 3.11 also contains several bug fixes that are not listed
here.


Index creation
---------------

It is now forbidden to create indexes that cover fields whose names start or end 
with `:` , for example, `fields: ["value:"]`. This applies both for single server
or cluster mode in the coordinator.


