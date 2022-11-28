---
fileID: programs-arangod-temp
title: ArangoDB Server Temp Options
weight: 340
description: 
layout: default
---
## Path

`temp.path`

Path for temporary files. ArangoDB will use this for storing temporary files, for
extracting data from uploaded zip files (e.g. for Foxx services) and other things.
Ideally the temporary path is set to an instance-specific subdirectory of the 
operating system's temporary directory.
To avoid data loss the temporary path should not overlap with any directories that 
contain important data, for example, the instance's database directory.

If you set the temporary path to the same directory as the instance's database directory,
a startup error is logged and the startup is aborted.
