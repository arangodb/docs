---
fileID: architecture-deployment-modes-single-instance
title: Single Instance
weight: 790
description: 
layout: default
---
Running a single instance of ArangoDB is the most simple way to get started.
It means to run the ArangoDB Server binary `arangod` stand-alone, without
replication, without failover opportunity, and not as cluster together with
other nodes.

You may run multiple processes of `arangod` side-by-side on the same machine as
single instances, as long as they are configured for different ports and data
folders. The official installers may not support multiple installations
side-by-side, but you can get archive packages and unpack them manually.

The provided ArangoDB packages run as single instances out of the box.

Unlike other setups, like the *Active Failover*, *Cluster*, or *Multiple Datacenters*,
which require some specific procedure to be started once the ArangoDB package
has been installed, deploying a single-instance is straightforward.

Depending on your operating system, after the installation, the ArangoDB Server
might be already up and running. *Start*, *stop* and *restart* operations can
be handled directly by using your *System and Service Manager*.

The following are two additional ways that can be used to start the stand-alone
instance:

- Using the [ArangoDB Starter tool](deployment-single-instance-using-the-starter), or
- [manually](deployment-single-instance-manual-start).