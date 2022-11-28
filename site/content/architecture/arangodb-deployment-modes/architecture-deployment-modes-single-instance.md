---
fileID: architecture-deployment-modes-single-instance
title: Single Instance
weight: 940
description: 
layout: default
---
Running a single instance of ArangoDB is the most simple way to get started.
It means to run the ArangoDB Server binary `arangod` stand-alone, without
replication, without failover opportunity and not as cluster together with
other nodes.

You may run multiple processes of `arangod` side-by-side on the same machine as
single instances, as long as they are configured for different ports and data
folders. The official installers may not support multiple installations
side-by-side, but you can get archive packages and unpack them manually.

The provided ArangoDB packages run as single instances out of the box.

See also:

- [Installation](../../installation/)
- [Single Instance Deployment](../../deployment/by-arangodb-deployment-modes/single-instance/)
